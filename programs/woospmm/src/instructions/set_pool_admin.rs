use anchor_lang::prelude::*;

use crate::state::woopool::*;

#[derive(Accounts)]
pub struct SetPoolAdmin<'info> {
    #[account(mut, has_one = authority)]
    pub woopool: Account<'info, WooPool>,

    pub authority: Signer<'info>,
}

pub fn set_pool_admin_handler(ctx: Context<SetPoolAdmin>, admin_authority: Pubkey) -> Result<()> {
    ctx.accounts.woopool.update_admin_authority(admin_authority)?;

    Ok(())
}

pub fn set_pool_fee_admin_handler(ctx: Context<SetPoolAdmin>, fee_authority: Pubkey) -> Result<()> {
    ctx.accounts.woopool.update_fee_authority(fee_authority)?;

    Ok(())
}