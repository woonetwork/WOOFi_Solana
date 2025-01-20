use anchor_lang::prelude::*;

use crate::{
    events::PauseRoleUpdatedEvent,
    SuperChargerConfig,
};

#[derive(Accounts)]
pub struct SetOnlyAdminConfig<'info> {
    #[account(mut,
        constraint =
            super_charger_config.authority == authority.key() ||
            super_charger_config.admin_authority.contains(authority.key)
    )]
    pub super_charger_config: Account<'info, SuperChargerConfig>,

    pub authority: Signer<'info>,
}

pub fn set_pause_role_handler(
    ctx: Context<SetOnlyAdminConfig>,
    pause_roles: Vec<Pubkey>,
) -> Result<()> {
    ctx.accounts
        .super_charger_config
        .set_pause_authority(pause_roles.clone())?;

    emit!(PauseRoleUpdatedEvent {
        super_charger_config: ctx.accounts.super_charger_config.key(),
        authority: ctx.accounts.authority.key(),
        pause_roles,
    });

    Ok(())
}
