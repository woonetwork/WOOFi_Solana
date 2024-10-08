use std::cmp::max;

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};

use crate::{
    constants::*, errors::ErrorCode, events::SwapEvent, instructions::*, state::*, util::*,
};

use pyth_solana_receiver_sdk::price_update::PriceUpdateV2;

#[derive(Accounts)]
pub struct Swap<'info> {
    #[account(
        constraint = !wooconfig.paused
    )]
    pub wooconfig: Box<Account<'info, WooConfig>>,
    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,

    pub payer: Signer<'info>,

    #[account(mut,
        has_one = wooconfig,
        address = woopool_from.wooracle,
        has_one = quote_price_update,
        constraint = wooracle_from.price_update == price_update_from.key()
    )]
    wooracle_from: Account<'info, Wooracle>,
    #[account(mut,
        has_one = wooconfig,
        constraint = woopool_from.authority == wooracle_from.authority,
        constraint = woopool_from.quote_token_mint == wooracle_from.quote_token_mint
    )]
    woopool_from: Box<Account<'info, WooPool>>,
    #[account(mut,
        constraint = token_owner_account_from.owner == payer.key(),
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
        has_one = wooconfig,
        address = woopool_to.wooracle,
        has_one = quote_price_update,
        constraint = wooracle_to.price_update == price_update_to.key()
    )]
    wooracle_to: Account<'info, Wooracle>,
    #[account(mut,
        has_one = wooconfig,
        constraint = woopool_to.authority == woopool_from.authority,
        constraint = woopool_to.authority == wooracle_to.authority,
        constraint = woopool_to.quote_token_mint == woopool_from.quote_token_mint,
        constraint = woopool_to.quote_token_mint == wooracle_to.quote_token_mint,
        constraint = woopool_to.token_mint != woopool_from.token_mint
    )]
    woopool_to: Box<Account<'info, WooPool>>,
    #[account(mut,
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
        has_one = wooconfig,
        constraint = woopool_quote.token_mint == woopool_quote.quote_token_mint,
        constraint = woopool_quote.token_mint == woopool_from.quote_token_mint,
        constraint = woopool_quote.token_mint == woopool_to.quote_token_mint,
        constraint = woopool_quote.authority == woopool_from.authority,
    )]
    woopool_quote: Box<Account<'info, WooPool>>,
    // has_one = quote_price_update above twice
    quote_price_update: Account<'info, PriceUpdateV2>,
    #[account(mut,
        address = woopool_quote.token_vault
    )]
    quote_token_vault: Box<Account<'info, TokenAccount>>,

    /// CHECK: safe, the rebated to account, will calc rebate amount offline
    rebate_to: UncheckedAccount<'info>,
}

pub fn swap(ctx: Context<Swap>, from_amount: u128, min_to_amount: u128) -> Result<()> {
    let token_owner_account_from = &ctx.accounts.token_owner_account_from;
    let token_vault_from = &ctx.accounts.token_vault_from;

    transfer_from_owner_to_vault(
        &ctx.accounts.payer,
        token_owner_account_from,
        token_vault_from,
        &ctx.accounts.token_program,
        from_amount as u64,
    )?;

    swap_without_transfer(ctx, from_amount, min_to_amount)
}

pub fn swap_without_transfer(ctx: Context<Swap>, from_amount: u128, min_to_amount: u128) -> Result<()> {
    if ctx.accounts.woopool_from.key() == ctx.accounts.woopool_quote.key() {
        sell_quote(ctx, from_amount, min_to_amount)
    } else if ctx.accounts.woopool_to.key() == ctx.accounts.woopool_quote.key() {
        sell_base(ctx, from_amount, min_to_amount)
    } else {
        swap_base_to_base(ctx, from_amount, min_to_amount)
    }
}

pub fn sell_quote(ctx: Context<Swap>, from_amount: u128, min_to_amount: u128) -> Result<()> {
    require!(
        ctx.accounts.woopool_from.token_mint == ctx.accounts.woopool_quote.token_mint,
        ErrorCode::SwapPoolInvalid
    );

    let token_owner_account_from = &ctx.accounts.token_owner_account_from;
    let woopool_quote = &mut ctx.accounts.woopool_quote;
    let quote_price_update = &mut ctx.accounts.quote_price_update;
    let quote_token_vault = &ctx.accounts.quote_token_vault;
    require!(
        (quote_token_vault.amount as u128) - woopool_quote.reserve >= from_amount,
        ErrorCode::NotEnoughBalance
    );
    require!(
        (quote_token_vault.amount as u128) + from_amount <= woopool_quote.cap_bal,
        ErrorCode::BalanceCapExceeds
    );

    let woopool_to = &mut ctx.accounts.woopool_to;
    let wooracle_to = &mut ctx.accounts.wooracle_to;
    let price_update_to = &mut ctx.accounts.price_update_to;
    let token_owner_account_to = &ctx.accounts.token_owner_account_to;
    let token_vault_to = &ctx.accounts.token_vault_to;
    let rebate_to = &ctx.accounts.rebate_to;

    let fee_rate: u16 = woopool_to.fee_rate;
    let swap_fee = checked_mul_div_round_up(from_amount, fee_rate as u128, ONE_E5_U128)?;
    let quote_amount: u128 = from_amount.checked_sub(swap_fee).unwrap();

    let decimals_to = Decimals::new(
        wooracle_to.price_decimals as u32,
        wooracle_to.quote_decimals as u32,
        woopool_to.base_decimals as u32,
    );

    let state_to = get_price::get_state_impl(wooracle_to, price_update_to, quote_price_update)?;

    let (to_amount, to_new_price) = swap_math::calc_base_amount_sell_quote(
        quote_amount,
        woopool_to,
        &decimals_to,
        &state_to,
    )?;
    wooracle_to.post_price(to_new_price)?;

    require!(
        woopool_to.reserve >= to_amount && token_vault_to.amount as u128 >= to_amount,
        ErrorCode::NotEnoughOut
    );

    require!(to_amount >= min_to_amount, ErrorCode::AmountOutBelowMinimum);

    woopool_quote.add_reserve(from_amount).unwrap();
    woopool_to.sub_reserve(to_amount).unwrap();

    // record fee into account
    woopool_quote.sub_reserve(swap_fee).unwrap();
    woopool_quote.add_unclaimed_fee(swap_fee).unwrap();

    transfer_from_vault_to_owner(
        woopool_to,
        token_vault_to,
        token_owner_account_to,
        &ctx.accounts.token_program,
        to_amount as u64,
    )?;

    emit!(SwapEvent {
        sender: ctx.accounts.payer.key(),
        from_token_mint: woopool_quote.token_mint,
        to_token_mint: woopool_to.token_mint,
        from_amount,
        to_amount,
        from_account: token_owner_account_from.key(),
        to_account: token_owner_account_to.key(),
        rebate_to: rebate_to.key(),
        swap_vol: quote_amount + swap_fee,
        swap_fee,
    });

    Ok(())
}

pub fn sell_base(ctx: Context<Swap>, from_amount: u128, min_to_amount: u128) -> Result<()> {
    require!(
        ctx.accounts.woopool_to.token_mint == ctx.accounts.woopool_quote.token_mint,
        ErrorCode::SwapPoolInvalid
    );

    let token_owner_account_from = &ctx.accounts.token_owner_account_from;
    let wooracle_from = &mut ctx.accounts.wooracle_from;
    let price_update_from = &mut ctx.accounts.price_update_from;
    let woopool_from = &mut ctx.accounts.woopool_from;
    let token_vault_from = &ctx.accounts.token_vault_from;
    require!(
        (token_vault_from.amount as u128) - woopool_from.reserve >= from_amount,
        ErrorCode::NotEnoughBalance
    );
    require!(
        (token_vault_from.amount as u128) + from_amount <= woopool_from.cap_bal,
        ErrorCode::BalanceCapExceeds
    );

    let woopool_quote = &mut ctx.accounts.woopool_quote;
    let quote_price_update = &mut ctx.accounts.quote_price_update;
    let quote_token_vault = &ctx.accounts.quote_token_vault;
    let token_owner_account_to = &ctx.accounts.token_owner_account_to;
    let rebate_to = &ctx.accounts.rebate_to;

    let fee_rate: u16 = woopool_from.fee_rate;

    let decimals_from = Decimals::new(
        wooracle_from.price_decimals as u32,
        wooracle_from.quote_decimals as u32,
        woopool_from.base_decimals as u32,
    );

    let state_from =
        get_price::get_state_impl(wooracle_from, price_update_from, quote_price_update)?;

    let (mut quote_amount, new_base_price) = swap_math::calc_quote_amount_sell_base(
        from_amount,
        woopool_from,
        &decimals_from,
        &state_from,
    )?;

    wooracle_from.post_price(new_base_price)?;

    let swap_fee = checked_mul_div_round_up(quote_amount, fee_rate as u128, ONE_E5_U128)?;
    quote_amount = quote_amount.checked_sub(swap_fee).unwrap();

    require!(
        woopool_quote.reserve >= swap_fee + quote_amount && quote_token_vault.amount as u128 >= swap_fee + quote_amount,
        ErrorCode::NotEnoughOut
    );

    require!(quote_amount >= min_to_amount, ErrorCode::AmountOutBelowMinimum);

    woopool_from.add_reserve(from_amount).unwrap();
    woopool_quote.sub_reserve(quote_amount).unwrap();

    // record fee into account
    woopool_quote.sub_reserve(swap_fee).unwrap();
    woopool_quote.add_unclaimed_fee(swap_fee).unwrap();

    transfer_from_vault_to_owner(
        woopool_quote,
        quote_token_vault,
        token_owner_account_to,
        &ctx.accounts.token_program,
        quote_amount as u64,
    )?;

    emit!(SwapEvent {
        sender: ctx.accounts.payer.key(),
        from_token_mint: woopool_from.token_mint,
        to_token_mint: woopool_quote.token_mint,
        from_amount,
        to_amount: quote_amount,
        from_account: token_owner_account_from.key(),
        to_account: token_owner_account_to.key(),
        rebate_to: rebate_to.key(),
        swap_vol: quote_amount + swap_fee,
        swap_fee,
    });

    Ok(())
}

pub fn swap_base_to_base(ctx: Context<Swap>, from_amount: u128, min_to_amount: u128) -> Result<()> {
    require!(
        ctx.accounts.woopool_from.token_mint != ctx.accounts.woopool_quote.token_mint
        && ctx.accounts.woopool_to.token_mint != ctx.accounts.woopool_quote.token_mint,
        ErrorCode::SwapPoolInvalid
    );

    let price_update_from = &mut ctx.accounts.price_update_from;
    let price_update_to = &mut ctx.accounts.price_update_to;
    let quote_price_update = &mut ctx.accounts.quote_price_update;

    let token_owner_account_from = &ctx.accounts.token_owner_account_from;
    let token_vault_from = &ctx.accounts.token_vault_from;
    let token_owner_account_to = &ctx.accounts.token_owner_account_to;
    let token_vault_to = &ctx.accounts.token_vault_to;
    let quote_token_vault = &ctx.accounts.quote_token_vault;
    let woopool_quote = &mut ctx.accounts.woopool_quote;

    let wooracle_from = &mut ctx.accounts.wooracle_from;
    let woopool_from = &mut ctx.accounts.woopool_from;

    let wooracle_to = &mut ctx.accounts.wooracle_to;
    let woopool_to = &mut ctx.accounts.woopool_to;
    let rebate_to = &ctx.accounts.rebate_to;

    require!(
        (token_vault_from.amount as u128) - woopool_from.reserve >= from_amount,
        ErrorCode::NotEnoughBalance
    );
    require!(
        (token_vault_from.amount as u128) + from_amount <= woopool_from.cap_bal,
        ErrorCode::BalanceCapExceeds
    );

    let fee_rate: u16 = max(woopool_from.fee_rate, woopool_to.fee_rate);

    let decimals_from = Decimals::new(
        wooracle_from.price_decimals as u32,
        wooracle_from.quote_decimals as u32,
        woopool_from.base_decimals as u32,
    );

    let state_from =
        get_price::get_state_impl(wooracle_from, price_update_from, quote_price_update)?;

    let (mut quote_amount, new_base_price) = swap_math::calc_quote_amount_sell_base(
        from_amount,
        woopool_from,
        &decimals_from,
        &state_from,
    )?;

    wooracle_from.post_price(new_base_price)?;

    let swap_fee = checked_mul_div_round_up(quote_amount, fee_rate as u128, ONE_E5_U128)?;
    quote_amount = quote_amount.checked_sub(swap_fee).unwrap();

    require!(
        woopool_quote.reserve >= swap_fee && quote_token_vault.amount as u128 >= swap_fee,
        ErrorCode::NotEnoughOut
    );

    let decimals_to = Decimals::new(
        wooracle_to.price_decimals as u32,
        wooracle_to.quote_decimals as u32,
        woopool_to.base_decimals as u32,
    );

    let state_to = get_price::get_state_impl(wooracle_to, price_update_to, quote_price_update)?;

    let (to_amount, to_new_price) = swap_math::calc_base_amount_sell_quote(
        quote_amount,
        woopool_to,
        &decimals_to,
        &state_to,
    )?;
    wooracle_to.post_price(to_new_price)?;

    require!(
        woopool_to.reserve >= to_amount && token_vault_to.amount as u128 >= to_amount,
        ErrorCode::NotEnoughOut
    );

    require!(to_amount >= min_to_amount, ErrorCode::AmountOutBelowMinimum);

    woopool_from.add_reserve(from_amount).unwrap();
    woopool_to.sub_reserve(to_amount).unwrap();

    // record fee into account
    woopool_quote.sub_reserve(swap_fee).unwrap();
    woopool_quote.add_unclaimed_fee(swap_fee).unwrap();

    transfer_from_vault_to_owner(
        woopool_to,
        token_vault_to,
        token_owner_account_to,
        &ctx.accounts.token_program,
        to_amount as u64,
    )?;

    emit!(SwapEvent {
        sender: ctx.accounts.payer.key(),
        from_token_mint: woopool_from.token_mint,
        to_token_mint: woopool_to.token_mint,
        from_amount,
        to_amount,
        from_account: token_owner_account_from.key(),
        to_account: token_owner_account_to.key(),
        rebate_to: rebate_to.key(),
        swap_vol: quote_amount + swap_fee,
        swap_fee,
    });

    Ok(())
}
