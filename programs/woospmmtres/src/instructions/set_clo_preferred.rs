use anchor_lang::prelude::*;

use crate::state::cloracle::*;

#[derive(Accounts)]
pub struct SetCloPreferred<'info> {
    #[account(mut, has_one = authority)]
    pub cloracle: Account<'info, CLOracle>,

    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<SetCloPreferred>, clo_preferred: bool) -> Result<()> {
    Ok(ctx.accounts.cloracle.update_clo_preferred(clo_preferred)?)
}
