use std::cmp::{max, min};

use anchor_lang::prelude::*;

use crate::{
    errors::ErrorCode, state::wooracle::*, util::checked_mul_div, TENPOW18U128, TENPOW18U64,
};

#[derive(Accounts)]
pub struct SetWooState<'info> {
    #[account(mut,
        constraint =
            wooracle.authority == authority.key() ||
            wooracle.admin_authority == authority.key()
    )]
    pub wooracle: Account<'info, WOOracle>,

    pub authority: Signer<'info>,
}

pub fn update_spread_for_new_price(price: u128, wooracle: &mut WOOracle) -> Result<()> {
    let pre_spread = wooracle.spread;
    let pre_price = wooracle.price;
    if pre_price == 0 || price == 0 || pre_spread >= TENPOW18U64 {
        // previous price or current price is 0, no action is needed
        return Ok(());
    }

    let max_price = max(price, pre_price);
    let min_price = min(price, pre_price);
    // let anti_spread = (TENPOW18U128 * TENPOW18U128 * min_price) / max_price / (TENPOW18U128 - pre_spread as u128);
    let anti_spread_calc_a = checked_mul_div(TENPOW18U128, min_price, max_price).unwrap();
    let anti_spread = checked_mul_div(
        TENPOW18U128,
        anti_spread_calc_a,
        TENPOW18U128 - pre_spread as u128,
    )
    .unwrap();
    if anti_spread < TENPOW18U128 {
        let new_spread = TENPOW18U128.checked_sub(anti_spread).unwrap() as u64;
        if new_spread > pre_spread {
            let _ = wooracle.update_spread(new_spread);
        }
    }

    Ok(())
}

pub fn update_spread_for_new_price_and_spread(
    price: u128,
    spread: u64,
    wooracle: &mut WOOracle,
) -> Result<()> {
    //require(spread < 1e18, "!_spread");
    require!(spread < TENPOW18U64, ErrorCode::WooOracleSpreadExceed);

    let pre_spread = wooracle.spread;
    let pre_price = wooracle.price;
    if pre_price == 0 || price == 0 || pre_spread >= TENPOW18U64 {
        // previous price or current price is 0, just use spread
        return wooracle.update_spread(spread);
    }

    let max_price = max(price, pre_price);
    let min_price = min(price, pre_price);
    let anti_spread_calc_a = checked_mul_div(TENPOW18U128, min_price, max_price).unwrap();
    let anti_spread = checked_mul_div(
        TENPOW18U128,
        anti_spread_calc_a,
        TENPOW18U128 - pre_spread as u128,
    )
    .unwrap();
    if anti_spread < TENPOW18U128 {
        let new_spread = TENPOW18U128.checked_sub(anti_spread).unwrap() as u64;
        let _ = wooracle.update_spread(max(new_spread, spread));
    } else {
        let _ = wooracle.update_spread(spread);
    }

    Ok(())
}

pub fn set_state_handler(
    ctx: Context<SetWooState>,
    price: u128,
    coeff: u64,
    spread: u64,
) -> Result<()> {
    let wooracle = &mut ctx.accounts.wooracle;
    update_spread_for_new_price_and_spread(price, spread, wooracle)?;
    wooracle.update_price(price)?;
    wooracle.update_coeff(coeff)?;
    wooracle.update_now()?;

    Ok(())
}

pub fn set_maximum_age_handler(ctx: Context<SetWooState>, maximum_age: u64) -> Result<()> {
    ctx.accounts.wooracle.update_maximum_age(maximum_age)
}

pub fn set_outer_preferred_handler(ctx: Context<SetWooState>, outer_preferred: bool) -> Result<()> {
    ctx.accounts
        .wooracle
        .update_outer_preferred(outer_preferred)
}

pub fn set_stale_duration_handler(ctx: Context<SetWooState>, stale_duration: i64) -> Result<()> {
    ctx.accounts.wooracle.update_stale_duration(stale_duration)
}

pub fn set_bound_handler(ctx: Context<SetWooState>, bound: u64) -> Result<()> {
    // TODO: check bound limit
    ctx.accounts.wooracle.update_bound(bound)
}

pub fn set_range_handler(
    ctx: Context<SetWooState>,
    range_min: u128,
    range_max: u128,
) -> Result<()> {
    let _ = ctx.accounts.wooracle.update_range_min(range_min);
    let _ = ctx.accounts.wooracle.update_range_max(range_max);

    Ok(())
}

pub fn set_coeff_handler(ctx: Context<SetWooState>, coeff: u64, update_time: bool) -> Result<()> {
    if update_time {
        ctx.accounts.wooracle.update_now()?
    }

    ctx.accounts.wooracle.update_coeff(coeff)
}

pub fn set_price_handler(ctx: Context<SetWooState>, price: u128, update_time: bool) -> Result<()> {
    if update_time {
        ctx.accounts.wooracle.update_now()?
    }

    let wooracle = &mut ctx.accounts.wooracle;
    let _ = update_spread_for_new_price(price, wooracle);
    wooracle.update_price(price)
}

pub fn set_spread_handler(ctx: Context<SetWooState>, spread: u64, update_time: bool) -> Result<()> {
    if update_time {
        ctx.accounts.wooracle.update_now()?
    }

    ctx.accounts.wooracle.update_spread(spread)
}
