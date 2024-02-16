use anchor_lang::prelude::*;

use crate::state::wooracle::*;

#[derive(Accounts)]
pub struct SetStaleDuration<'info> {
    #[account(mut, has_one = authority)]
    pub wooracle: Account<'info, WOOracle>,

    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<SetStaleDuration>, stale_duration: u128) -> Result<()> {
    Ok(ctx.accounts.wooracle.update_stale_duration(stale_duration)?)
}
