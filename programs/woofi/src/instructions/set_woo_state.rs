use anchor_lang::prelude::*;

use crate::{state::wooracle::*, WooConfig};

#[derive(Accounts)]
pub struct SetWooStateOnlyAdmin<'info> {
    #[account(
        constraint = !wooconfig.paused
    )]
    pub wooconfig: Box<Account<'info, WooConfig>>,
    #[account(mut,
        has_one = wooconfig,
        constraint =
            wooracle.authority == authority.key() ||
            wooconfig.wooracle_admin_authority.contains(authority.key)
    )]
    pub wooracle: Account<'info, WOOracle>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct SetWooStateOnlyOwner<'info> {
    #[account(
        constraint = !wooconfig.paused
    )]
    pub wooconfig: Box<Account<'info, WooConfig>>,
    #[account(mut,
        has_one = wooconfig,
        has_one = authority
    )]
    pub wooracle: Account<'info, WOOracle>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct SetWooStateOnlyGuardian<'info> {
    #[account(
        constraint = !wooconfig.paused
    )]
    pub wooconfig: Box<Account<'info, WooConfig>>,
    #[account(mut,
        has_one = wooconfig,
        constraint =
            wooracle.authority == authority.key() ||
            wooconfig.guardian_authority.contains(authority.key)
    )]
    pub wooracle: Account<'info, WOOracle>,

    pub authority: Signer<'info>,
}

pub fn set_state_handler(
    ctx: Context<SetWooStateOnlyAdmin>,
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

pub fn set_price_handler(ctx: Context<SetWooStateOnlyAdmin>, price: u128) -> Result<()> {
    let wooracle = &mut ctx.accounts.wooracle;
    wooracle.update_spread_for_new_price(price)?;
    wooracle.update_price(price)?;
    wooracle.update_now()
}

pub fn set_maximum_age_handler(ctx: Context<SetWooStateOnlyAdmin>, maximum_age: u64) -> Result<()> {
    ctx.accounts.wooracle.update_maximum_age(maximum_age)
}

pub fn set_outer_preferred_handler(
    ctx: Context<SetWooStateOnlyAdmin>,
    outer_preferred: bool,
) -> Result<()> {
    ctx.accounts
        .wooracle
        .update_outer_preferred(outer_preferred)
}

pub fn set_stale_duration_handler(
    ctx: Context<SetWooStateOnlyAdmin>,
    stale_duration: i64,
) -> Result<()> {
    ctx.accounts.wooracle.update_stale_duration(stale_duration)
}

pub fn set_bound_handler(ctx: Context<SetWooStateOnlyOwner>, bound: u64) -> Result<()> {
    // TODO: check bound limit
    ctx.accounts.wooracle.update_bound(bound)
}

pub fn set_range_handler(
    ctx: Context<SetWooStateOnlyGuardian>,
    range_min: u128,
    range_max: u128,
) -> Result<()> {
    ctx.accounts.wooracle.update_range_min(range_min)?;
    ctx.accounts.wooracle.update_range_max(range_max)
}

pub fn set_coeff_handler(ctx: Context<SetWooStateOnlyAdmin>, coeff: u64) -> Result<()> {
    ctx.accounts.wooracle.update_coeff(coeff)?;
    ctx.accounts.wooracle.update_now()
}

pub fn set_spread_handler(ctx: Context<SetWooStateOnlyAdmin>, spread: u64) -> Result<()> {
    ctx.accounts.wooracle.update_spread(spread)?;
    ctx.accounts.wooracle.update_now()
}
