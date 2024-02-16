use anchor_lang::prelude::*;

use crate::state::wooracle::*;

#[derive(Accounts)]
pub struct SetSpread<'info> {
    #[account(mut, has_one = authority)]
    pub wooracle: Account<'info, WOOracle>,

    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<SetSpread>, spread: u64) -> Result<()> {
    Ok(ctx.accounts.wooracle.update_spread(spread)?)
}
