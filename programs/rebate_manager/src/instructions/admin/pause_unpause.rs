use anchor_lang::prelude::*;

use crate::state::wooconfig::*;

#[derive(Accounts)]
pub struct PauseSwitch<'info> {
    #[account(mut,
        constraint =
            wooconfig.authority == authority.key() ||
            wooconfig.admin_authority.contains(authority.key)
    )]
    pub wooconfig: Account<'info, WooConfig>,

    pub authority: Signer<'info>,
}

pub fn pause(ctx: Context<PauseSwitch>) -> Result<()> {
    ctx.accounts.wooconfig.set_paused(true)
}

pub fn unpause(ctx: Context<PauseSwitch>) -> Result<()> {
    ctx.accounts.wooconfig.set_paused(false)
}
