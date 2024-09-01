use anchor_lang::prelude::*;

use crate::state::woopool::*;

#[derive(Accounts)]
pub struct PausePool<'info> {
    #[account(mut,
        constraint =
            woopool.authority == authority.key() ||
            woopool.admin_authority == authority.key() ||
            woopool.pause_authority.contains(authority.key)
    )]
    pub woopool: Account<'info, WooPool>,

    pub authority: Signer<'info>,
}

pub fn pause_pool(ctx: Context<PausePool>) -> Result<()> {
    ctx.accounts.woopool.set_paused(true)
}
