use anchor_lang::prelude::*;

use crate::{
    events::{AdminUpdatedEvent, FeeAdminUpdatedEvent, PauseRoleUpdatedEvent},
    state::woopool::*,
};

#[derive(Accounts)]
pub struct SetPoolAdmin<'info> {
    #[account(mut, has_one = authority)]
    pub woopool: Account<'info, WooPool>,

    pub authority: Signer<'info>,
}

pub fn set_pool_admin_handler(ctx: Context<SetPoolAdmin>, admin_authority: Pubkey) -> Result<()> {
    ctx.accounts
        .woopool
        .update_admin_authority(admin_authority)?;

    emit!(AdminUpdatedEvent {
        woopool: ctx.accounts.woopool.key(),
        authority: ctx.accounts.authority.key(),
        admin_authority,
    });

    Ok(())
}

pub fn set_pool_fee_admin_handler(ctx: Context<SetPoolAdmin>, fee_authority: Pubkey) -> Result<()> {
    ctx.accounts.woopool.update_fee_authority(fee_authority)?;

    emit!(FeeAdminUpdatedEvent {
        woopool: ctx.accounts.woopool.key(),
        authority: ctx.accounts.authority.key(),
        fee_authority,
    });

    Ok(())
}

pub fn set_pool_pause_auth_handler(
    ctx: Context<SetPoolAdmin>,
    pause_authority: Vec<Pubkey>,
) -> Result<()> {
    ctx.accounts
        .woopool
        .set_pause_authority(pause_authority.clone())?;

    emit!(PauseRoleUpdatedEvent {
        woopool: ctx.accounts.woopool.key(),
        authority: ctx.accounts.authority.key(),
        pause_authority,
    });

    Ok(())
}
