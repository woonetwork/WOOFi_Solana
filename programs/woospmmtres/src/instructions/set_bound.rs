use anchor_lang::prelude::*;

use crate::state::wooracle::*;

#[derive(Accounts)]
pub struct SetBound<'info> {
    #[account(mut, has_one = authority)]
    pub wooracle: Account<'info, WOOracle>,

    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<SetBound>, bound: u64) -> Result<()> {
    // TODO: check bound limit
    Ok(ctx.accounts.wooracle.update_bound(bound)?)
}
