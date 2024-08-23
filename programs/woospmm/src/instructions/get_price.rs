use anchor_lang::prelude::*;

use crate::{constants::*, errors::ErrorCode, state::wooracle::*};

use super::update_oracle;
use pyth_solana_receiver_sdk::price_update::PriceUpdateV2;

#[derive(Accounts)]
pub struct GetPrice<'info> {
    #[account(mut,
        has_one = price_update,
    )]
    pub oracle: Account<'info, WOOracle>,
    pub price_update: Account<'info, PriceUpdateV2>,
}

// #[zero_copy(unsafe)]
// #[repr(packed)]
//#[derive(Default, Debug, BorshSerialize, BorshDeserialize)]
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Copy)]
pub struct GetPriceResult {
    pub price_out: u128,
    pub feasible_out: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Copy)]
pub struct GetStateResult {
    pub price_out: u128,
    pub spread: u64,
    pub coeff: u64,
    pub feasible_out: bool,
}

pub fn handler(ctx: Context<GetPrice>) -> Result<GetPriceResult> {
    let oracle = &mut ctx.accounts.oracle;
    let price_update = &mut ctx.accounts.price_update;

    get_price_impl(oracle, price_update)
}

pub fn get_price_impl<'info>(
    oracle: &mut Account<'info, WOOracle>,
    price_update: &mut Account<'info, PriceUpdateV2>,
) -> Result<GetPriceResult> {
    let now = Clock::get()?.unix_timestamp;

    let _ = update_oracle::update(price_update, oracle);

    let wo_price = oracle.price;
    let wo_timestamp = oracle.updated_at;
    let bound = oracle.bound as u128;

    let clo_price = oracle.round as u128;
    let wo_feasible = clo_price != 0 && now <= (wo_timestamp + oracle.stale_duration);
    let wo_price_in_bound = clo_price != 0
        && ((clo_price * (TENPOW18U128 - bound)) / TENPOW18U128 <= wo_price
            && wo_price <= (clo_price * (TENPOW18U128 + bound)) / TENPOW18U128);
    // TODO: check upper and low bound

    let price_out: u128;
    let feasible_out: bool;
    if wo_feasible {
        price_out = wo_price;
        feasible_out = wo_price_in_bound;
    } else {
        if oracle.outer_preferred {
            price_out = clo_price;
        } else {
            price_out = 0;
        }
        feasible_out = price_out != 0;
    }

    if feasible_out {
        if price_out < oracle.range_min {
            return Err(ErrorCode::WooOraclePriceRangeMin.into());
        }
        if price_out > oracle.range_max {
            return Err(ErrorCode::WooOraclePriceRangeMax.into());
        }
    }

    Ok(GetPriceResult {
        price_out,
        feasible_out,
    })
}

pub fn get_state_impl<'info>(
    oracle: &mut Account<'info, WOOracle>,
    price_update: &mut Account<'info, PriceUpdateV2>,
) -> Result<GetStateResult> {
    let price_result = get_price_impl(oracle, price_update)?;
    Ok(GetStateResult {
        price_out: price_result.price_out,
        spread: oracle.spread,
        coeff: oracle.coeff,
        feasible_out: price_result.feasible_out,
    })
}
