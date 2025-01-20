use anchor_lang::prelude::*;

use crate::WooConfig;

#[derive(Accounts)]
pub struct SetOnlyOwnerConfig<'info> {
    #[account(mut,
        has_one = authority,
    )]
    pub wooconfig: Account<'info, WooConfig>,

    pub authority: Signer<'info>,
}

pub fn set_wooracle_admin_handler(
    ctx: Context<SetOnlyOwnerConfig>,
    admin_authority: Vec<Pubkey>,
) -> Result<()> {
    ctx.accounts
        .wooconfig
        .set_wooracle_admin_authority(admin_authority.clone())
}

pub fn set_guardian_handler(
    ctx: Context<SetOnlyOwnerConfig>,
    guardian_authority: Vec<Pubkey>,
) -> Result<()> {
    ctx.accounts
        .wooconfig
        .set_guardian_authority(guardian_authority.clone())
}

pub fn set_lending_manager_handler(
    ctx: Context<SetOnlyOwnerConfig>,
    lending_managers: Vec<Pubkey>,
) -> Result<()> {
    ctx.accounts
        .wooconfig
        .set_lending_manager_authority(lending_managers.clone())
}
