use anchor_lang::prelude::*;

use crate::{
    constants::*,
    state::{
        cloracle::*, wooracle::*
    }, wooracle
};

#[derive(Accounts)]
pub struct GetPrice<'info> {
    pub cloracle: Account<'info, CLOracle>,
    #[account(
        seeds = [
            WOORACLE_SEED.as_bytes(),
            cloracle.chainlink_feed.as_ref()
        ],
        bump
    )]
    pub wooracle: Account<'info, WOOracle>,
}

// #[zero_copy(unsafe)]
// #[repr(packed)]
//#[derive(Default, Debug, BorshSerialize, BorshDeserialize)]
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Copy)]
pub struct GetPriceResult {
    pub price_out: u128,
    pub feasible_out: bool
}

pub fn handler(ctx: Context<GetPrice>) -> Result<GetPriceResult> {
    let cloracle = &ctx.accounts.cloracle;
    let wooracle = &ctx.accounts.wooracle;

    Ok(get_price_impl(cloracle, wooracle)?)
}

pub fn get_price_impl<'info>(cloracle: &Account<'info, CLOracle>, wooracle: &Account<'info, WOOracle>) -> Result<GetPriceResult> {
    let now = Clock::get()?.unix_timestamp;

    let wo_price = wooracle.price;
    let wo_timestamp = wooracle.updated_at;
    let bound = wooracle.bound as u128;

    let clo_price = cloracle.round as u128;
    let wo_feasible = clo_price != 0 && now <= (wo_timestamp + wooracle.stale_duration);
    let wo_price_in_bound = clo_price == 0 ||
    ((clo_price * (TENPOW18U128 - bound)) / TENPOW18U128 <= wo_price && wo_price <= (clo_price * (TENPOW18U128 + bound)) / TENPOW18U128);
    // TODO: check upper and low bound

    let price_out : u128;
    let feasible_out : bool;
    if wo_feasible {
        price_out = wo_price;
        feasible_out = wo_price_in_bound;
    } else {
        if cloracle.clo_preferred {
            price_out = clo_price;
        } else {
            price_out = 0;
        }
        feasible_out = price_out != 0;
    }

    Ok(GetPriceResult {
        price_out: price_out, 
        feasible_out: feasible_out
    })
}