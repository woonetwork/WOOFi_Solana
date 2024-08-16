use std::cmp::max;

use anchor_lang::prelude::*;

use crate::{constants::*, errors::ErrorCode, instructions::*, state::*, util::*};

// TODO Prince: use checked mul div muldiv to do the calc
pub fn calc_usd_amount_sell_base(
    base_amount: u128,
    woopool: &Account<'_, WooPool>,
    decimals: &Decimals,
    state: &GetStateResult,
) -> Result<(u128, u128)> {
    if !state.feasible_out {
        return Err(ErrorCode::WooOracleNotFeasible.into());
    }
    if state.price_out <= 0 {
        return Err(ErrorCode::WooOraclePriceNotValid.into());
    }

    //let notionalSwap : u128 = (base_amount * state.price_out * decimals.quote_dec) / decimals.base_dec / decimals.price_dec;
    let notion_calc_a: u128 =
        checked_mul_div(base_amount, state.price_out, decimals.price_dec as u128)?;
    let notional_swap: u128 = checked_mul_div(
        notion_calc_a,
        decimals.quote_dec as u128,
        decimals.base_dec as u128,
    )?;
    if notional_swap > woopool.max_notional_swap {
        return Err(ErrorCode::WooPoolExceedMaxNotionalValue.into());
    }

    // gamma = k * price * base_amount; and decimal 18
    let gamma_calc_a: u128 =
        checked_mul_div(base_amount, state.price_out, decimals.price_dec as u128)?;
    let gamma: u128 =
        checked_mul_div(gamma_calc_a, state.coeff as u128, decimals.base_dec as u128)?;
    if gamma > woopool.max_gamma {
        return Err(ErrorCode::WooPoolExceedMaxGamma.into());
    }

    // Formula: quoteAmount = baseAmount * oracle.price * (1 - oracle.k * baseAmount * oracle.price - oracle.spread)
    // amount = 100000, price = 1
    // 1e5 * 1e18 * 1e6 = 1e29
    // amount = 10,000,000, price = 10
    // 1e7*1e18 * 1e2*1e8 * 1e6 / 1e8 1e33

    // so change the position of priceDec and baseDec

    // let calcA: u128 = checked_mul_div(base_amount, state.price_out, decimals.price_dec as u128)?
    //                  .checked_mul(decimals.quote_dec as u128).ok_or(ErrorCode::MulDivOverflow)?;
    // let calcB: u128 = TENPOW18U128.checked_sub(gamma).ok_or(ErrorCode::MathOverflow)?
    //                  .checked_sub(state.spread as u128).ok_or(ErrorCode::MathOverflow)?;
    // let usd_amount: u128 = checked_mul_div(calcA, calcB, TENPOW18U128)?
    //                  .checked_div(decimals.base_dec as u128).ok_or(ErrorCode::MathOverflow)?;
    let calc_a: u128 = checked_mul_div(base_amount, state.price_out, decimals.base_dec as u128)?
        .checked_mul(decimals.quote_dec as u128)
        .ok_or(ErrorCode::MulDivOverflow)?;
    let calc_b: u128 = TENPOW18U128
        .checked_sub(gamma)
        .ok_or(ErrorCode::MathOverflow)?
        .checked_sub(state.spread as u128)
        .ok_or(ErrorCode::MathOverflow)?;
    let usd_amount: u128 = checked_mul_div(calc_a, calc_b, TENPOW18U128)?
        .checked_div(decimals.price_dec as u128)
        .ok_or(ErrorCode::MathOverflow)?;

    // newPrice = oracle.price * (1 - k * oracle.price * baseAmount)
    let new_price: u128 = checked_mul_div(
        TENPOW18U128.checked_sub(gamma).unwrap(),
        state.price_out,
        TENPOW18U128,
    )?;

    Ok((usd_amount, new_price))
}

pub fn calc_base_amount_sell_usd(
    usd_amount: u128,
    woopool: &Account<'_, WooPool>,
    decimals: &Decimals,
    state: &GetStateResult,
) -> Result<(u128, u128)> {
    if !state.feasible_out {
        return Err(ErrorCode::WooOracleNotFeasible.into());
    }
    if state.price_out <= 0 {
        return Err(ErrorCode::WooOraclePriceNotValid.into());
    }

    if usd_amount > woopool.max_notional_swap {
        return Err(ErrorCode::WooPoolExceedMaxNotionalValue.into());
    }

    // gamma = k * quote_amount; and decimal 18
    let gamma: u128 = checked_mul_div(usd_amount, state.coeff as u128, decimals.quote_dec as u128)?;
    if gamma > woopool.max_gamma {
        return Err(ErrorCode::WooPoolExceedMaxGamma.into());
    }

    // Formula: baseAmount = quoteAmount / oracle.price * (1 - oracle.k * quoteAmount - oracle.spread)
    let calc_a: u128 = usd_amount
        .checked_mul(decimals.base_dec as u128)
        .ok_or(ErrorCode::MathOverflow)?;
    let calc_b: u128 = checked_mul_div(calc_a, decimals.price_dec as u128, state.price_out)?;
    let calc_c: u128 = TENPOW18U128
        .checked_sub(gamma)
        .ok_or(ErrorCode::MathOverflow)?
        .checked_sub(state.spread as u128)
        .ok_or(ErrorCode::MathOverflow)?;
    let calc_d: u128 = checked_mul_div(calc_b, calc_c, TENPOW18U128)?;
    let base_amount = calc_d / decimals.quote_dec as u128;

    // new_price = oracle.price / (1 - k * quoteAmount)
    let new_price: u128 = checked_mul_div(
        TENPOW18U128,
        state.price_out,
        TENPOW18U128.checked_sub(gamma).unwrap(),
    )?;

    Ok((base_amount, new_price))
}

// u128 can cover
pub fn adjust_price_v3(woopool: &Account<'_, WooPool>, price: u128) -> Result<u128> {
    let bt = woopool.tgt_balance;
    let bmax = woopool.cap_balance;
    let b = woopool.reserve;
    let smax = woopool.shift_max as u128; // decimal = 5

    let p: u128;
    if b < bt {
        p = (price * (TE5U128 + (smax * (bt - b)) / bt)) / TE5U128;
    } else {
        let mut shift = (smax * (b - bt)) / max(bt, (b * (bmax - bt)) / bmax);
        if shift > smax {
            shift = smax;
        }
        p = (price * (TE5U128 - shift)) / TE5U128;
    }

    Ok(p)
}

// u128 can cover with 1 assumption
// decimals.price_dec is 8
pub fn adjust_k_v3(
    woopool: &Account<'_, WooPool>,
    price: u128,
    decimals: &Decimals,
    coeff: u64,
) -> Result<u128> {
    let smax = woopool.shift_max as u128;
    let bt = woopool.tgt_balance;

    let k = max(
        coeff as u128,
        // definitely overflow u128
        // ((TENPOW18U128 * Smax * decimals.base_dec as u128 * decimals.price_dec as u128) / TE5U128 / Bt / price) as u64);
        // TODO Prince: below has only 1 assumption: decimals.price_dec is 8
        // ((18 + 5 + 8) - 8 - 5) + (18 or 8) - (18 or 8)
        ((TENPOW18U128 * smax * decimals.price_dec as u128) / price / TE5U128)
            * decimals.base_dec as u128
            / bt,
    );
    Ok(k)
}

// u128 can cover
pub fn calc_usd_amount_sell_base_v3(
    base_amount: u128,
    woopool: &Account<'_, WooPool>,
    decimals: &Decimals,
    base_coeff: u64,
    base_spread: u64,
    price_result: &GetPriceResult,
) -> Result<(u128, u128)> {
    if !price_result.feasible_out {
        return Err(ErrorCode::WooOracleNotFeasible.into());
    }

    let p = adjust_price_v3(woopool, price_result.price_out)?;
    let k = adjust_k_v3(woopool, price_result.price_out, decimals, base_coeff)?;

    // 1 - k * B * p - s
    let coeff = TENPOW18U128
        - (k * base_amount / decimals.base_dec as u128) * p / decimals.price_dec as u128
        - base_spread as u128; // spread decimal = 18
                               // usd amount = B * p * (1 - k * B * p - s)
    let usd_amount = (((base_amount * p) / decimals.price_dec as u128) * coeff / TENPOW18U128)
        * decimals.quote_dec as u128
        / decimals.base_dec as u128;

    Ok((usd_amount, p))
}

// u128 can cover with 1 assumption
// decimals.price_dec is 8
pub fn calc_base_amount_sell_usd_v3(
    usd_amount: u128,
    woopool: &Account<'_, WooPool>,
    decimals: &Decimals,
    base_coeff: u64,
    base_spread: u64,
    price_result: &GetPriceResult,
) -> Result<(u128, u128)> {
    if !price_result.feasible_out {
        return Err(ErrorCode::WooOracleNotFeasible.into());
    }

    let p = adjust_price_v3(woopool, price_result.price_out)?;
    let k = adjust_k_v3(woopool, price_result.price_out, decimals, base_coeff)?;

    // 1 - k * B * p - s
    let coeff = TENPOW18U128 - (k * usd_amount) / decimals.quote_dec as u128 - base_spread as u128; // spread decimal = 18
                                                                                                    // usd amount = B * p * (1 - k * B * p - s)
    let base_amount = (((usd_amount * decimals.base_dec as u128 * decimals.price_dec as u128) / p)
        * coeff)
        / TENPOW18U128
        / decimals.quote_dec as u128;

    Ok((base_amount, p))
}
