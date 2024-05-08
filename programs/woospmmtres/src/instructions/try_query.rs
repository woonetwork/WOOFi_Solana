use std::cmp::max;

use anchor_lang::prelude::*;

use crate::{
    constants::*,
    state::*,
    instructions::*,
    util::*
};

#[derive(Accounts)]
pub struct TryQuery<'info> {
    #[account(
        constraint = cloracle_from.key() == woopool_from.cloracle
    )]
    cloracle_from: Account<'info, CLOracle>,
    #[account(
        seeds = [
            WOORACLE_SEED.as_bytes(),
            cloracle_from.chainlink_feed.as_ref()
        ],
        bump,
        constraint = wooracle_from.key() == woopool_from.wooracle
    )]
    wooracle_from: Account<'info, WOOracle>,
    woopool_from: Box<Account<'info, WooPool>>,

    #[account(
        constraint = cloracle_to.key() == woopool_to.cloracle
    )]
    cloracle_to: Account<'info, CLOracle>,
    #[account(
        seeds = [
            WOORACLE_SEED.as_bytes(),
            cloracle_to.chainlink_feed.as_ref()
        ],
        bump,
        constraint = wooracle_to.key() == woopool_to.wooracle
    )]
    wooracle_to: Account<'info, WOOracle>,
    woopool_to: Box<Account<'info, WooPool>>
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Copy)]
pub struct QueryResult {
    pub to_amount: u128,
    pub swap_fee: u128,
}

pub fn handler(ctx: Context<TryQuery>, from_amount: u128) -> Result<QueryResult> {

    let cloracle_from = &ctx.accounts.cloracle_from;
    let wooracle_from = &ctx.accounts.wooracle_from;
    let woopool_from = &ctx.accounts.woopool_from;

    let mut state_from = get_price::get_state_impl(cloracle_from, wooracle_from)?;

    let cloracle_to = &ctx.accounts.cloracle_to;
    let wooracle_to = &ctx.accounts.wooracle_to;
    let woopool_to = &ctx.accounts.woopool_to;

    let mut state_to = get_price::get_state_impl(cloracle_to, wooracle_to)?;

    let spread = max(wooracle_from.spread, wooracle_to.spread);
    let fee_rate = max(woopool_from.fee_rate, woopool_to.fee_rate);

    state_from.spread = spread;
    state_to.spread = spread;

    let decimals_from = Decimals::new(
        DEFAULT_PRICE_DECIMALS, 
        DEFAULT_QUOTE_DECIMALS,
        cloracle_from.decimals as u32);

    let (usd_amount, _) = swap_math::calc_usd_amount_sell_base(
        from_amount, 
        woopool_from, 
        &decimals_from, 
        &state_from)?;
    
    let swap_fee = checked_mul_div(usd_amount, fee_rate as u128, TE5U128)?;
    let remain_amount = usd_amount.checked_sub(swap_fee).unwrap();

    let decimals_to = Decimals::new(
        DEFAULT_PRICE_DECIMALS, 
        DEFAULT_QUOTE_DECIMALS,
        cloracle_to.decimals as u32);

    let (to_amount, _) = swap_math::calc_base_amount_sell_usd(
        remain_amount, 
        woopool_to, 
        &decimals_to, 
        &state_to)?;

    Ok(QueryResult {
        to_amount,
        swap_fee
    })
}