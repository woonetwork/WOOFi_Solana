use anchor_lang::prelude::*;

use crate::SuperChargerConfig;

#[derive(Accounts)]
pub struct SetAdmin<'info> {
    #[account(mut,
        constraint =
            super_charger_config.authority == authority.key() ||
            super_charger_config.admin_authority.contains(authority.key)
    )]
    pub super_charger_config: Account<'info, SuperChargerConfig>,

    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<SetAdmin>, admins: Vec<Pubkey>) -> Result<()> {
    ctx.accounts
        .super_charger_config
        .set_admin_authority(admins.clone())?;

    Ok(())
}
