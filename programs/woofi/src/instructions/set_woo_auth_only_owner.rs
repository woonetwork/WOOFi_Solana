use anchor_lang::prelude::*;

use crate::WooConfig;

#[derive(Accounts)]
pub struct SetWooAuthOnlyOwner<'info> {
    #[account(mut,
        has_one = authority,
    )]
    pub wooconfig: Account<'info, WooConfig>,

    pub authority: Signer<'info>,
}

pub fn set_wooracle_admin_handler(
    ctx: Context<SetWooAuthOnlyOwner>,
    admin_authority: Vec<Pubkey>,
) -> Result<()> {
    ctx.accounts
        .wooconfig
        .set_wooracle_admin_authority(admin_authority.clone())
}

pub fn set_guardian_handler(
    ctx: Context<SetWooAuthOnlyOwner>,
    guardian_authority: Vec<Pubkey>,
) -> Result<()> {
    ctx.accounts
        .wooconfig
        .set_guardian_authority(guardian_authority.clone())
}
