use std::cmp::max;

use anchor_lang::prelude::*;

use crate::{
    constants::*,
    errors::ErrorCode,
    state::*,
    instructions::*,
    util::*
};

// TODO Prince: use checked mul div muldiv to do the calc

// u128 can cover
pub fn adjust_price<'info>(woopool: &Account<'info, WooPool>, price: u128) -> Result<u128> {
    let Bt = woopool.tgt_balance;
    let Bmax = woopool.cap_balance;
    let B = woopool.reserve;
    let Smax = woopool.shift_max as u128; // decimal = 5

    let mut p : u128;
    if B < Bt {
        p = (price * (TE5U128 + (Smax * (Bt - B)) / Bt)) / TE5U128;
    } else {
        let mut shift = (Smax as u128 * (B - Bt)) / max(Bt, (B * (Bmax - Bt)) / Bmax);
        if shift > Smax {
            shift = Smax;
        }
        p = (price * (TE5U128 - shift)) / TE5U128;
    }

    Ok(p)
}

// u128 can cover with 1 assumption
// decimals.price_dec is 8
pub fn adjust_k<'info>(woopool: &Account<'info, WooPool>, price: u128, decimals: &Decimals, coeff: u64) -> Result<u128> {
    let Smax = woopool.shift_max as u128;
    let Bt = woopool.tgt_balance;

    let k = max(
        coeff as u128, 
        // definitely overflow u128
        // ((TENPOW18U128 * Smax * decimals.base_dec as u128 * decimals.price_dec as u128) / TE5U128 / Bt / price) as u64);
        // TODO Prince: below has only 1 assumption: decimals.price_dec is 8
        // ((18 + 5 + 8) - 8 - 5) + (18 or 8) - (18 or 8)
        ((TENPOW18U128 * Smax * decimals.price_dec as u128) / price / TE5U128) * decimals.base_dec as u128 / Bt);
    Ok(k)
}

// u128 can cover
pub fn calc_usd_amount_sell_base<'info>(base_amount: u128, woopool: &Account<'info, WooPool>, decimals: &Decimals, base_coeff: u64, base_spread: u64, price_result: &GetPriceResult) -> Result<(u128, u128)> {
    if !price_result.feasible_out {
        return Err(ErrorCode::WooOracleNotFeasible.into());
    }

    let p = adjust_price(woopool, price_result.price_out)?;
    let k = adjust_k(woopool, price_result.price_out, decimals, base_coeff)?;

    // 1 - k * B * p - s
    let coeff = TENPOW18U128 -
    (k * base_amount / decimals.base_dec as u128) * p / decimals.price_dec as u128 -
    base_spread as u128; // spread decimal = 18
    // usd amount = B * p * (1 - k * B * p - s)
    let usd_amount = 
    (((base_amount * p) / decimals.price_dec as u128) * coeff / TENPOW18U128) 
    * decimals.quote_dec as u128 / decimals.base_dec as u128;

    Ok((usd_amount, p))
}

// u128 can cover with 1 assumption
// decimals.price_dec is 8
pub fn calc_base_amount_sell_usd<'info>(usd_amount: u128, woopool: &Account<'info, WooPool>, decimals: &Decimals, base_coeff: u64, base_spread: u64, price_result: &GetPriceResult) -> Result<(u128, u128)> {
    if !price_result.feasible_out {
        return Err(ErrorCode::WooOracleNotFeasible.into());
    }

    let p = adjust_price(woopool, price_result.price_out)?;
    let k = adjust_k(woopool, price_result.price_out, decimals, base_coeff)?;

    // 1 - k * B * p - s
    let coeff = TENPOW18U128 -
    (k * usd_amount) / decimals.quote_dec as u128 -
    base_spread as u128; // spread decimal = 18
    // usd amount = B * p * (1 - k * B * p - s)
    let base_amount = 
    (((usd_amount * decimals.base_dec as u128 * decimals.price_dec as u128) / p) * coeff)
    / TENPOW18U128 / decimals.quote_dec as u128;

    Ok((base_amount, p))
}