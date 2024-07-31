use anchor_lang::prelude::*;

use crate::state::wooracle::*;

#[derive(Accounts)]
pub struct SetWooAdmin<'info> {
    #[account(mut, has_one = authority)]
    pub wooracle: Account<'info, WOOracle>,

    pub authority: Signer<'info>,
}

pub fn set_woo_admin_handler(ctx: Context<SetWooAdmin>, admin_authority: Pubkey) -> Result<()> {
    ctx.accounts.wooracle.update_admin_authority(admin_authority)?;

    Ok(())
}
