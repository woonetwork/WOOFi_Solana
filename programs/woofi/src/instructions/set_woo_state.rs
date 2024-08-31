use anchor_lang::prelude::*;

use crate::state::wooracle::*;

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

pub fn set_state_handler(
    ctx: Context<SetWooState>,
    price: u128,
    coeff: u64,
    spread: u64,
) -> Result<()> {
    let wooracle = &mut ctx.accounts.wooracle;
    wooracle.update_spread_for_new_price_and_spread(price, spread)?;
    wooracle.update_price(price)?;
    wooracle.update_coeff(coeff)?;
    wooracle.update_now()
}

pub fn set_price_handler(ctx: Context<SetWooState>, price: u128) -> Result<()> {
    let wooracle = &mut ctx.accounts.wooracle;
    wooracle.update_spread_for_new_price(price)?;
    wooracle.update_price(price)?;
    wooracle.update_now()
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
    ctx.accounts.wooracle.update_range_min(range_min)?;
    ctx.accounts.wooracle.update_range_max(range_max)
}

pub fn set_coeff_handler(ctx: Context<SetWooState>, coeff: u64) -> Result<()> {
    ctx.accounts.wooracle.update_coeff(coeff)?;
    ctx.accounts.wooracle.update_now()
}

pub fn set_spread_handler(ctx: Context<SetWooState>, spread: u64) -> Result<()> {
    ctx.accounts.wooracle.update_spread(spread)?;
    ctx.accounts.wooracle.update_now()
}
