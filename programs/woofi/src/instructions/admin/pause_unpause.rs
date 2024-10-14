use anchor_lang::prelude::*;

use crate::{events::{PauseEvent, UnPauseEvent}, state::wooconfig::*};

#[derive(Accounts)]
pub struct Pause<'info> {
    #[account(mut,
        constraint =
            wooconfig.authority == authority.key() ||
            wooconfig.woopool_admin_authority.contains(authority.key) ||
            wooconfig.pause_authority.contains(authority.key)
    )]
    pub wooconfig: Account<'info, WooConfig>,

    pub authority: Signer<'info>,
}

pub fn pause(ctx: Context<Pause>) -> Result<()> {
    ctx.accounts.wooconfig.set_paused(true)?;
    emit!(PauseEvent{
        wooconfig: ctx.accounts.wooconfig.key(),
        authority: ctx.accounts.authority.key()
    });

    Ok(())
}

#[derive(Accounts)]
pub struct UnPause<'info> {
    #[account(mut,
        constraint =
            wooconfig.authority == authority.key() ||
            wooconfig.woopool_admin_authority.contains(authority.key)
    )]
    pub wooconfig: Account<'info, WooConfig>,

    pub authority: Signer<'info>,
}

pub fn unpause(ctx: Context<UnPause>) -> Result<()> {
    ctx.accounts.wooconfig.set_paused(false)?;
    emit!(UnPauseEvent{
        wooconfig: ctx.accounts.wooconfig.key(),
        authority: ctx.accounts.authority.key()
    });

    Ok(())
}
