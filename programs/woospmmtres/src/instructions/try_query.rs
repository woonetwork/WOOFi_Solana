use std::cmp::max;

use anchor_lang::prelude::*;

use crate::{
    constants::*,
    errors::ErrorCode,
    state::*,
    instructions::*,
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

    let price_from = get_price::get_price_impl(cloracle_from, wooracle_from)?;

    let cloracle_to = &ctx.accounts.cloracle_to;
    let wooracle_to = &ctx.accounts.wooracle_to;
    let woopool_to = &ctx.accounts.woopool_to;

    let price_to = get_price::get_price_impl(cloracle_to, wooracle_to)?;

    let spread = max(wooracle_from.spread, wooracle_to.spread);
    let fee_rate = max(woopool_from.fee_rate, woopool_to.fee_rate);

    let (usd_amount, _) = calc_usd_amount_sell_base(
        from_amount, 
        woopool_from, 
        cloracle_from.decimals, 
        wooracle_from.coeff, 
        spread, 
        &price_from)?;
    
    let swap_fee = (usd_amount * fee_rate as u128) / 1e5 as u128;
    let remain_amount = usd_amount - swap_fee;

    let (to_amount, _) = calc_base_amount_sell_usd(
        remain_amount, 
        woopool_to, 
        cloracle_to.decimals, 
        wooracle_to.coeff, 
        spread, 
        &price_to)?;

    Ok(QueryResult {
        to_amount,
        swap_fee
    })
}

pub fn adjust_price<'info>(woopool: &Account<'info, WooPool>, price: u128) -> Result<u128> {
    let Bt = woopool.tgt_balance;
    let Bmax = woopool.cap_balance;
    let B = woopool.reserve;
    let Smax = woopool.shift_max as u128;

    // TODO Prince: check upper and low bound of u128
    let mut p : u128;
    if B < Bt {
        p = (price * (TENPOW18U128 + (Smax * (Bt - B)) / Bt)) / TENPOW18U128;
    } else {
        let mut shift = (Smax as u128 * (B - Bt)) / max(Bt, (B * (Bmax - Bt)) / Bmax);
        if shift > Smax {
            shift = Smax;
        }
        p = (price * (TENPOW18U128 - shift)) / TENPOW18U128;
    }

    Ok(p)
}

pub fn adjustK<'info>(woopool: &Account<'info, WooPool>, price: u128, dec_info: u128, coeff: u64) -> Result<u64> {
    let Smax = woopool.shift_max as u128;
    let Bt = woopool.tgt_balance;

    let k = max(coeff, ((Smax * dec_info * dec_info) / Bt / price) as u64);
    Ok(k)
}

pub fn calc_usd_amount_sell_base<'info>(base_amount: u128, woopool: &Account<'info, WooPool>, base_decimal: u8, base_coeff: u64, base_spread: u64, price_result: &GetPriceResult) -> Result<(u128, u128)> {
    if !price_result.feasible_out {
        return Err(ErrorCode::WooOracleNotFeasible.into());
    }

    let base_dec_info = (10 as u128).pow(base_decimal as u32);

    let p = adjust_price(woopool, price_result.price_out)?;
    let k = adjustK(woopool, price_result.price_out, base_dec_info, base_coeff)?;

    // 1 - k * B * p - s
    let coeff = TENPOW18U128 -
    (k as u128 * base_amount * p) / base_dec_info / base_dec_info -
    base_spread as u128; // spread decimal = 18
    // usd amount = B * p * (1 - k * B * p - s)
    let usd_amount = 
    (((base_amount * base_dec_info * p) / base_dec_info) * coeff) 
    / TENPOW18U128 / base_dec_info;

    Ok((usd_amount, p))
}

pub fn calc_base_amount_sell_usd<'info>(usd_amount: u128, woopool: &Account<'info, WooPool>, base_decimal: u8, base_coeff: u64, base_spread: u64, price_result: &GetPriceResult) -> Result<(u128, u128)> {
    if !price_result.feasible_out {
        return Err(ErrorCode::WooOracleNotFeasible.into());
    }

    let base_dec_info = (10 as u128).pow(base_decimal as u32);

    let p = adjust_price(woopool, price_result.price_out)?;
    let k = adjustK(woopool, price_result.price_out, base_dec_info, base_coeff)?;

    // 1 - k * B * p - s
    let coeff = TENPOW18U128 -
    (k as u128 * usd_amount) / base_dec_info -
    base_spread as u128; // spread decimal = 18
    // usd amount = B * p * (1 - k * B * p - s)
    let base_amount = 
    (((usd_amount * base_dec_info * base_dec_info) / p) * coeff)
    / TENPOW18U128 / base_dec_info;

    Ok((base_amount, p))
}