use anchor_lang::prelude::*;

use crate::state::oracle::*;

#[derive(Accounts)]
pub struct SetOuterPreferred<'info> {
    #[account(mut, has_one = authority)]
    pub oracle: Account<'info, Oracle>,

    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<SetOuterPreferred>, outer_preferred: bool) -> Result<()> {
    ctx.accounts.oracle.update_outer_preferred(outer_preferred)
}
