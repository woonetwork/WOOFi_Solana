use anchor_lang::prelude::*;

use crate::{LendingManager, SuperChargerConfig};

#[derive(Accounts)]
pub struct SetOnlyOwnerLendingManager<'info> {
    #[account(mut,
        has_one = authority,
    )]
    pub super_charger_config: Account<'info, SuperChargerConfig>,

    #[account(mut,
        has_one = authority,
        has_one = super_charger_config,
    )]
    pub lending_manager: Account<'info, LendingManager>,

    pub authority: Signer<'info>,
}

pub fn set_lending_manager_woopool_handler(
    ctx: Context<SetOnlyOwnerLendingManager>,
    woopool_token_vault: Pubkey,
) -> Result<()> {
    ctx.accounts
        .lending_manager
        .set_woopool_token_vault(woopool_token_vault)
}
