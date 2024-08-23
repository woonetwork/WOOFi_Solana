use std::cmp::max;

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};

use crate::{
    constants::*, errors::ErrorCode, events::SwapEvent, instructions::*, state::*, util::*,
};

use pyth_solana_receiver_sdk::price_update::PriceUpdateV2;

#[derive(Accounts)]
pub struct Swap<'info> {
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
        constraint = woopool_from.authority == wooracle_from.authority
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
    #[account(
        constraint = woopool_to.authority == woopool_from.authority,
        constraint = woopool_to.authority == wooracle_to.authority,
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

    quote_price_update: Account<'info, PriceUpdateV2>,
}

pub fn handler(ctx: Context<Swap>, from_amount: u128, min_to_amount: u128) -> Result<()> {
    // TODO Prince: check from_amount upper, total amount limit in one swap
    // TODO Prince: use checked_mul checked_div in math

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

    let wooracle_from = &mut ctx.accounts.wooracle_from;
    let woopool_from = &mut ctx.accounts.woopool_from;

    let mut state_from =
        get_price::get_state_impl(wooracle_from, price_update_from, quote_price_update)?;

    let wooracle_to = &mut ctx.accounts.wooracle_to;
    let woopool_to = &ctx.accounts.woopool_to;

    let mut state_to = get_price::get_state_impl(wooracle_to, price_update_to, quote_price_update)?;

    let spread = max(state_from.spread, state_to.spread);
    let fee_rate = max(woopool_from.fee_rate, woopool_to.fee_rate);

    state_from.spread = spread;
    state_to.spread = spread;

    let decimals_from = Decimals::new(
        wooracle_from.price_decimals as u32,
        DEFAULT_QUOTE_DECIMALS,
        woopool_from.base_decimals as u32,
    );

    let swap_fee_amount = checked_mul_div_round_up(from_amount, fee_rate as u128, TE5U128)?;
    let remain_amount = from_amount.checked_sub(swap_fee_amount).unwrap();

    let (remain_usd_amount, from_new_price) = swap_math::calc_usd_amount_sell_base(
        remain_amount,
        woopool_from,
        &decimals_from,
        &state_from,
    )?;

    // TODO Prince: we currently subtract fee on coin, can enable below when we have base usd
    // let (usd_amount, _) = swap_math::calc_usd_amount_sell_base(
    //     from_amount,
    //     woopool_from,
    //     &decimals_from,
    //     wooracle_from.coeff,
    //     spread,
    //     &price_from)?;

    // let swap_fee = checked_mul_div(usd_amount, fee_rate as u128, TE5U128)?;
    // let remain_amount = usd_amount.checked_sub(swap_fee).unwrap();

    let decimals_to = Decimals::new(
        wooracle_to.price_decimals as u32,
        DEFAULT_QUOTE_DECIMALS,
        woopool_to.base_decimals as u32,
    );

    let (to_amount, to_new_price) = swap_math::calc_base_amount_sell_usd(
        remain_usd_amount,
        woopool_to,
        &decimals_to,
        &state_to,
    )?;

    require!(
        token_vault_to.amount as u128 >= to_amount,
        ErrorCode::NotEnoughOut
    );

    require!(to_amount >= min_to_amount, ErrorCode::AmountOutBelowMinimum);

    // TODO Prince:
    // we have from_amount, to_amount, swap_fee_amount here
    // we can do the pool balance check before real swap

    // record fee into account
    // TODO Prince: check all unwrap, should throw Error out
    woopool_from.add_protocol_fee(swap_fee_amount).unwrap();

    let _ = wooracle_from.post_price(from_new_price);
    let _ = wooracle_to.post_price(to_new_price);

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

    emit!(SwapEvent {
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
        from_amount,
        min_to_amount,
        to_amount,
        swap_fee_amount,
    });

    Ok(())
}
