use anchor_lang::prelude::*;

use crate::RebateManager;

#[derive(Accounts)]
pub struct SetAdmin<'info> {
    #[account(mut,
        constraint =
            rebate_manager.authority == authority.key() ||
            rebate_manager.admin_authority.contains(authority.key)
    )]
    pub rebate_manager: Account<'info, RebateManager>,

    pub authority: Signer<'info>,
}

pub fn set_admin_handler(ctx: Context<SetAdmin>, admins: Vec<Pubkey>) -> Result<()> {
    ctx.accounts
        .rebate_manager
        .set_admin_authority(admins.clone())?;

    Ok(())
}
