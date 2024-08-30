use anchor_lang::prelude::*;

use crate::RebatePool;

#[derive(Accounts)]
pub struct SetRebatePoolState<'info> {
    #[account(mut,
        has_one = authority
    )]
    pub rebate_pool: Account<'info, RebatePool>,

    pub authority: Signer<'info>,
}

pub fn set_rebate_pool_paused(ctx: Context<SetRebatePoolState>, paused: bool) -> Result<()> {
    ctx.accounts.rebate_pool.set_paused(paused)
}
