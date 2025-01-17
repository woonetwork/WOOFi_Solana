use anchor_lang::prelude::*;

use crate::{LendingManager, SuperChargerConfig};

#[derive(Accounts)]
pub struct SetOnlyAdminLendingManager<'info> {
    #[account(mut,
        constraint =
            super_charger_config.authority == authority.key() ||
            super_charger_config.admin_authority.contains(authority.key)
    )]
    pub super_charger_config: Account<'info, SuperChargerConfig>,

    #[account(mut,
        has_one = super_charger_config,
    )]
    pub lending_manager: Account<'info, LendingManager>,

    pub authority: Signer<'info>,
}

pub fn set_lending_manager_interest_rate_handler(
    ctx: Context<SetOnlyAdminLendingManager>,
    interest_rate: u64,
) -> Result<()> {
    ctx.accounts.lending_manager
       .set_interest_rate(interest_rate)
}

pub fn set_lending_manager_perf_rate_handler(
    ctx: Context<SetOnlyAdminLendingManager>,
    perf_rate: u64,
) -> Result<()> {
    ctx.accounts.lending_manager
       .set_perf_rate(perf_rate)
}
