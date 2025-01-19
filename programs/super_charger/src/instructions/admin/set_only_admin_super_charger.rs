use anchor_lang::prelude::*;

use crate::{SuperCharger, SuperChargerConfig};

#[derive(Accounts)]
pub struct SetOnlyAdminSuperCharger<'info> {
    #[account(mut,
        constraint =
            super_charger_config.authority == authority.key() ||
            super_charger_config.admin_authority.contains(authority.key)
    )]
    pub super_charger_config: Account<'info, SuperChargerConfig>,

    #[account(mut,
        has_one = super_charger_config,
    )]
    pub super_charger: Account<'info, SuperCharger>,

    pub authority: Signer<'info>,
}

pub fn set_instant_withdraw_fee_rate_handler(
    ctx: Context<SetOnlyAdminSuperCharger>,
    instant_withdraw_fee_rate: u64,
) -> Result<()> {
    ctx.accounts.super_charger
       .set_instant_withdraw_fee_rate(instant_withdraw_fee_rate)
}
