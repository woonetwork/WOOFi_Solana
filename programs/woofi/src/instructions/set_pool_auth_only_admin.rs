use anchor_lang::prelude::*;

use crate::{
    events::{FeeAdminUpdatedEvent, PauseRoleUpdatedEvent, WooPoolAdminUpdatedEvent},
    WooConfig,
};

#[derive(Accounts)]
pub struct SetPoolAuthOnlyAdmin<'info> {
    // TODO Prince: may set admin when pool is paused
    // #[account(
    //     constraint = !wooconfig.paused
    // )]
    #[account(mut,
        constraint =
            wooconfig.authority == authority.key() ||
            wooconfig.woopool_admin_authority.contains(authority.key)
    )]
    pub wooconfig: Account<'info, WooConfig>,

    pub authority: Signer<'info>,
}

pub fn set_pool_admin_handler(
    ctx: Context<SetPoolAuthOnlyAdmin>,
    admin_authority: Vec<Pubkey>,
) -> Result<()> {
    ctx.accounts
        .wooconfig
        .set_woopool_admin_authority(admin_authority.clone())?;

    emit!(WooPoolAdminUpdatedEvent {
        wooconfig: ctx.accounts.wooconfig.key(),
        authority: ctx.accounts.authority.key(),
        admin_authority,
    });

    Ok(())
}

pub fn set_fee_admin_handler(
    ctx: Context<SetPoolAuthOnlyAdmin>,
    fee_authority: Vec<Pubkey>,
) -> Result<()> {
    ctx.accounts
        .wooconfig
        .set_fee_authority(fee_authority.clone())?;

    emit!(FeeAdminUpdatedEvent {
        wooconfig: ctx.accounts.wooconfig.key(),
        authority: ctx.accounts.authority.key(),
        fee_authority,
    });

    Ok(())
}

pub fn set_pause_role_handler(
    ctx: Context<SetPoolAuthOnlyAdmin>,
    pause_authority: Vec<Pubkey>,
) -> Result<()> {
    ctx.accounts
        .wooconfig
        .set_pause_authority(pause_authority.clone())?;

    emit!(PauseRoleUpdatedEvent {
        wooconfig: ctx.accounts.wooconfig.key(),
        authority: ctx.accounts.authority.key(),
        pause_authority,
    });

    Ok(())
}
