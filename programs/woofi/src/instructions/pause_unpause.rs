use anchor_lang::prelude::*;

use crate::state::wooconfig::*;

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
    ctx.accounts.wooconfig.set_paused(true)
}

#[derive(Accounts)]
pub struct UnPause<'info> {
    #[account(mut,
        constraint =
            wooconfig.paused &&
            (wooconfig.authority == authority.key() ||
            wooconfig.woopool_admin_authority.contains(authority.key))
    )]
    pub wooconfig: Account<'info, WooConfig>,

    pub authority: Signer<'info>,
}

pub fn unpause(ctx: Context<UnPause>) -> Result<()> {
    ctx.accounts.wooconfig.set_paused(false)
}
