use std::cmp::max;

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};

use crate::{
    constants::*, errors::ErrorCode, events::SwapWithRebateEvent, instructions::*, state::*,
    util::*,
};

use pyth_solana_receiver_sdk::price_update::PriceUpdateV2;

#[derive(Accounts)]
pub struct SwapWithRebate<'info> {
    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,

    pub owner: Signer<'info>,

    #[account(mut,
        address = woopool_from.wooracle,
        has_one = quote_price_update,
        constraint = wooracle_from.price_update == price_update_from.key()
    )]
    wooracle_from: Account<'info, WOOracle>,
    #[account(mut,
        constraint = woopool_from.authority == wooracle_from.authority,
        constraint = woopool_from.quote_token_mint == wooracle_from.quote_token_mint
    )]
    woopool_from: Box<Account<'info, WooPool>>,
    #[account(mut,
        has_one = owner,
        constraint = token_owner_account_from.mint == woopool_from.token_mint
    )]
    token_owner_account_from: Box<Account<'info, TokenAccount>>,
    #[account(mut,
        address = woopool_from.token_vault
    )]
    token_vault_from: Box<Account<'info, TokenAccount>>,
    #[account(mut,
        address = wooracle_from.price_update,
    )]
    price_update_from: Account<'info, PriceUpdateV2>,

    #[account(mut,
        address = woopool_to.wooracle,
        has_one = quote_price_update,
        constraint = wooracle_to.price_update == price_update_to.key()
    )]
    wooracle_to: Account<'info, WOOracle>,
    #[account(mut,
        constraint = woopool_to.authority == woopool_from.authority,
        constraint = woopool_to.authority == wooracle_to.authority,
        constraint = woopool_to.quote_token_mint == woopool_from.quote_token_mint,
        constraint = woopool_to.quote_token_mint == wooracle_to.quote_token_mint,
        constraint = woopool_to.token_mint != woopool_from.token_mint
    )]
    woopool_to: Box<Account<'info, WooPool>>,
    #[account(mut,
        has_one = owner,
        constraint = token_owner_account_to.mint == woopool_to.token_mint
    )]
    token_owner_account_to: Box<Account<'info, TokenAccount>>,
    #[account(mut,
        address = woopool_to.token_vault
    )]
    token_vault_to: Box<Account<'info, TokenAccount>>,
    #[account(mut,
        address = wooracle_to.price_update,
    )]
    price_update_to: Account<'info, PriceUpdateV2>,

    #[account(mut,
        constraint = woopool_quote.token_mint == woopool_from.quote_token_mint,
        constraint = woopool_quote.authority == woopool_from.authority,
    )]
    woopool_quote: Box<Account<'info, WooPool>>,
    quote_price_update: Account<'info, PriceUpdateV2>,
    #[account(mut,
        address = woopool_quote.token_vault
    )]
    quote_token_vault: Box<Account<'info, TokenAccount>>,

    /// CHECK: safe, the account that will be rebate will link with rebate pool
    rebate_authority: UncheckedAccount<'info>,
    #[account(mut,
        has_one = rebate_authority,
        has_one = woopool_quote,
        seeds = [
            REBATEPOOL_SEED.as_bytes(),
            rebate_authority.key().as_ref(),
            woopool_quote.key().as_ref(),
            woopool_quote.token_mint.as_ref(),
        ],
        bump,
        constraint = rebate_pool.enabled,
        constraint = rebate_pool.token_mint == woopool_quote.token_mint,
        constraint = rebate_pool.authority == woopool_quote.authority,
    )]
    rebate_pool: Account<'info, RebatePool>,

    #[account(mut,
        address = rebate_pool.token_vault
    )]
    rebate_vault: Box<Account<'info, TokenAccount>>,
}

pub fn handler(ctx: Context<SwapWithRebate>, from_amount: u128, min_to_amount: u128) -> Result<()> {
    // TODO Prince: check from_amount upper, total amount limit in one swap

    let price_update_from = &mut ctx.accounts.price_update_from;
    let price_update_to = &mut ctx.accounts.price_update_to;
    let quote_price_update = &mut ctx.accounts.quote_price_update;

    let token_owner_account_from = &ctx.accounts.token_owner_account_from;
    require!(
        token_owner_account_from.amount as u128 >= from_amount,
        ErrorCode::NotEnoughBalance
    );

    let token_vault_from = &ctx.accounts.token_vault_from;
    let token_owner_account_to = &ctx.accounts.token_owner_account_to;
    let token_vault_to = &ctx.accounts.token_vault_to;
    let quote_token_vault = &ctx.accounts.quote_token_vault;
    let woopool_quote = &mut ctx.accounts.woopool_quote;

    let wooracle_from = &mut ctx.accounts.wooracle_from;
    let woopool_from = &mut ctx.accounts.woopool_from;

    let wooracle_to = &mut ctx.accounts.wooracle_to;
    let woopool_to = &mut ctx.accounts.woopool_to;

    let fee_rate = max(woopool_from.fee_rate, woopool_to.fee_rate);

    let decimals_from = Decimals::new(
        wooracle_from.price_decimals as u32,
        wooracle_from.quote_decimals as u32,
        woopool_from.base_decimals as u32,
    );

    let mut quote_amount = from_amount;
    if woopool_from.token_mint != woopool_from.quote_token_mint {
        let state_from =
            get_price::get_state_impl(wooracle_from, price_update_from, quote_price_update)?;

        let (_quote_amount, new_base_price) = swap_math::calc_quote_amount_sell_base(
            from_amount,
            woopool_from,
            &decimals_from,
            &state_from,
        )?;

        let _ = wooracle_from.post_price(new_base_price);

        quote_amount = _quote_amount;
    }

    let swap_fee = checked_mul_div_round_up(quote_amount, fee_rate as u128, TE5U128)?;
    quote_amount = quote_amount.checked_sub(swap_fee).unwrap();

    if woopool_from.token_mint != woopool_from.quote_token_mint {
        require!(
            woopool_quote.reserve >= swap_fee && quote_token_vault.amount as u128 >= swap_fee,
            ErrorCode::NotEnoughOut
        );
    }

    let decimals_to = Decimals::new(
        wooracle_to.price_decimals as u32,
        wooracle_to.quote_decimals as u32,
        woopool_to.base_decimals as u32,
    );

    let mut to_amount = quote_amount;
    if woopool_to.token_mint != woopool_to.quote_token_mint {
        let state_to = get_price::get_state_impl(wooracle_to, price_update_to, quote_price_update)?;

        let (_to_amount, to_new_price) = swap_math::calc_base_amount_sell_quote(
            quote_amount,
            woopool_to,
            &decimals_to,
            &state_to,
        )?;
        let _ = wooracle_to.post_price(to_new_price);

        to_amount = _to_amount;
    }

    require!(
        woopool_to.reserve >= to_amount && token_vault_to.amount as u128 >= to_amount,
        ErrorCode::NotEnoughOut
    );

    require!(to_amount >= min_to_amount, ErrorCode::AmountOutBelowMinimum);

    woopool_from.add_reserve(from_amount).unwrap();
    woopool_to.sub_reserve(to_amount).unwrap();

    // calc rebate amount
    let rebate_pool = &mut ctx.accounts.rebate_pool;
    let rebate_vault = &ctx.accounts.rebate_vault;
    let rebate_fee = checked_mul_div(swap_fee, rebate_pool.rebate_rate as u128, TE5U128).unwrap();
    let swap_fee_after_rebate = swap_fee.checked_sub(rebate_fee).unwrap();

    // record fee into account
    woopool_quote.sub_reserve(swap_fee).unwrap();
    woopool_quote
        .add_protocol_fee(swap_fee_after_rebate)
        .unwrap();
    rebate_pool.add_rebate_fee(rebate_fee).unwrap();

    transfer_from_owner_to_vault(
        &ctx.accounts.owner,
        token_owner_account_from,
        token_vault_from,
        &ctx.accounts.token_program,
        from_amount as u64,
    )?;

    transfer_from_vault_to_owner(
        woopool_to,
        token_vault_to,
        token_owner_account_to,
        &ctx.accounts.token_program,
        to_amount as u64,
    )?;

    // transfer from quote token vault to rebate vault
    transfer_from_vault_to_owner(
        woopool_quote,
        quote_token_vault,
        rebate_vault,
        &ctx.accounts.token_program,
        rebate_fee as u64,
    )?;

    emit!(SwapWithRebateEvent {
        owner: ctx.accounts.owner.key(),
        wooracle_from: wooracle_from.key(),
        woopool_from: woopool_from.key(),
        token_owner_account_from: token_owner_account_from.key(),
        token_vault_from: token_vault_from.key(),
        price_update_from: price_update_from.key(),
        wooracle_to: wooracle_to.key(),
        woopool_to: woopool_to.key(),
        token_owner_account_to: token_owner_account_to.key(),
        token_vault_to: token_vault_to.key(),
        price_update_to: price_update_to.key(),
        rebate_authority: ctx.accounts.rebate_authority.key(),
        rebate_pool: rebate_pool.key(),
        rebate_vault: rebate_vault.key(),
        from_amount,
        min_to_amount,
        to_amount,
        swap_fee,
        swap_fee_after_rebate,
        rebate_fee,
    });

    Ok(())
}
