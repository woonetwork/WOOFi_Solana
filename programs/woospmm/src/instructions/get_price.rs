use anchor_lang::prelude::*;

use crate::{
    constants::*,
    errors::ErrorCode,
    state::{oracle::*, wooracle::*},
};

use super::update_pythoracle;
use pyth_solana_receiver_sdk::price_update::PriceUpdateV2;

#[derive(Accounts)]
pub struct GetPrice<'info> {
    #[account(
        has_one = price_update
    )]
    pub oracle: Account<'info, Oracle>,
    #[account(
        has_one = oracle,
        seeds = [
            WOORACLE_SEED.as_bytes(),
            oracle.token_mint.as_ref(),
            oracle.feed_account.as_ref(),
            oracle.price_update.as_ref()
        ],
        bump,
        constraint = oracle.authority == wooracle.authority,
    )]
    pub wooracle: Account<'info, WOOracle>,
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
    let wooracle = &ctx.accounts.wooracle;
    let price_update = &mut ctx.accounts.price_update;

    get_price_impl(oracle, wooracle, price_update)
}

pub fn get_price_impl<'info>(
    oracle: &mut Account<'info, Oracle>,
    wooracle: &Account<'info, WOOracle>,
    price_update: &mut Account<'info, PriceUpdateV2>,
) -> Result<GetPriceResult> {
    let now = Clock::get()?.unix_timestamp;

    if oracle.oracle_type == OracleType::Pyth {
        let _ = update_pythoracle::update(price_update, oracle);
    } else if oracle.oracle_type == OracleType::ChainLink {
        // TODO Prince: auto fetch chainlink price
    }

    let wo_price = wooracle.price;
    let wo_timestamp = wooracle.updated_at;
    let bound = wooracle.bound as u128;

    let clo_price = oracle.round as u128;
    let wo_feasible = clo_price != 0 && now <= (wo_timestamp + wooracle.stale_duration);
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
        if price_out < wooracle.range_min {
            return Err(ErrorCode::WooOraclePriceRangeMin.into());
        }
        if price_out > wooracle.range_max {
            return Err(ErrorCode::WooOraclePriceRangeMax.into());
        }
    }

    Ok(GetPriceResult {
        price_out,
        feasible_out,
    })
}

pub fn get_state_impl<'info>(
    oracle: &mut Account<'info, Oracle>,
    wooracle: &Account<'info, WOOracle>,
    price_update: &mut Account<'info, PriceUpdateV2>,
) -> Result<GetStateResult> {
    let price_result = get_price_impl(oracle, wooracle, price_update)?;
    Ok(GetStateResult {
        price_out: price_result.price_out,
        spread: wooracle.spread,
        coeff: wooracle.coeff,
        feasible_out: price_result.feasible_out,
    })
}
