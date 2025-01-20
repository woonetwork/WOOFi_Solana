use anchor_lang::prelude::*;

use crate::{events::BorrowerRoleUpdatedEvent, SuperChargerConfig};

#[derive(Accounts)]
pub struct SetOnlyOwnerConfig<'info> {
    #[account(mut,
        has_one = authority,
    )]
    pub super_charger_config: Account<'info, SuperChargerConfig>,

    pub authority: Signer<'info>,
}

pub fn set_super_charger_admin_handler(
    ctx: Context<SetOnlyOwnerConfig>,
    admin_authority: Vec<Pubkey>,
) -> Result<()> {
    ctx.accounts
        .super_charger_config
        .set_admin_authority(admin_authority.clone())
}

pub fn set_borrower_role_handler(
    ctx: Context<SetOnlyOwnerConfig>,
    borrower_roles: Vec<Pubkey>,
) -> Result<()> {
    ctx.accounts
        .super_charger_config
        .set_borrower_authority(borrower_roles.clone())?;

    emit!(BorrowerRoleUpdatedEvent {
        super_charger_config: ctx.accounts.super_charger_config.key(),
        authority: ctx.accounts.authority.key(),
        borrower_roles,
    });

    Ok(())
}




