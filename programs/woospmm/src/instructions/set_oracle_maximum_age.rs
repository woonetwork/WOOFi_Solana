use anchor_lang::prelude::*;

use crate::state::oracle::*;

#[derive(Accounts)]
pub struct SetOracleMaximumAge<'info> {
    #[account(
        mut,
        has_one = authority,
    )]
    oracle: Account<'info, Oracle>,
    authority: Signer<'info>,
}

pub fn handler(ctx: Context<SetOracleMaximumAge>, maximum_age: u64) -> Result<()> {
    Ok(ctx.accounts.oracle.update_maximum_age(maximum_age)?)    
}