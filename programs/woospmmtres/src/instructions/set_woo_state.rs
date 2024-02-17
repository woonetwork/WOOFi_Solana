use anchor_lang::prelude::*;

use crate::state::wooracle::*;

#[derive(Accounts)]
pub struct SetWooState<'info> {
    #[account(mut, has_one = authority)]
    pub wooracle: Account<'info, WOOracle>,

    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<SetWooState>, price: u128, coeff: u64, spread: u64) -> Result<()> {
    ctx.accounts.wooracle.update_price(price)?;
    ctx.accounts.wooracle.update_coeff(coeff)?;
    ctx.accounts.wooracle.update_spread(spread)?;
    
    Ok(())
}
