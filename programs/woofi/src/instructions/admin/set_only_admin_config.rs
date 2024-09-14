use anchor_lang::prelude::*;

use crate::{
    events::{FeeAdminUpdatedEvent, PauseRoleUpdatedEvent, WooPoolAdminUpdatedEvent},
    WooConfig,
};

#[derive(Accounts)]
pub struct SetOnlyAdminConfig<'info> {
    #[account(mut,
        constraint =
            wooconfig.authority == authority.key() ||
            wooconfig.woopool_admin_authority.contains(authority.key)
    )]
    pub wooconfig: Account<'info, WooConfig>,

    pub authority: Signer<'info>,
}

pub fn set_pool_admin_handler(
    ctx: Context<SetOnlyAdminConfig>,
    admins: Vec<Pubkey>,
) -> Result<()> {
    ctx.accounts
        .wooconfig
        .set_woopool_admin_authority(admins.clone())?;

    emit!(WooPoolAdminUpdatedEvent {
        wooconfig: ctx.accounts.wooconfig.key(),
        authority: ctx.accounts.authority.key(),
        admins,
    });

    Ok(())
}

pub fn set_fee_admin_handler(
    ctx: Context<SetOnlyAdminConfig>,
    fee_admins: Vec<Pubkey>,
) -> Result<()> {
    ctx.accounts
        .wooconfig
        .set_fee_authority(fee_admins.clone())?;

    emit!(FeeAdminUpdatedEvent {
        wooconfig: ctx.accounts.wooconfig.key(),
        authority: ctx.accounts.authority.key(),
        fee_admins,
    });

    Ok(())
}

pub fn set_pause_role_handler(
    ctx: Context<SetOnlyAdminConfig>,
    pause_roles: Vec<Pubkey>,
) -> Result<()> {
    ctx.accounts
        .wooconfig
        .set_pause_authority(pause_roles.clone())?;

    emit!(PauseRoleUpdatedEvent {
        wooconfig: ctx.accounts.wooconfig.key(),
        authority: ctx.accounts.authority.key(),
        pause_roles,
    });

    Ok(())
}
