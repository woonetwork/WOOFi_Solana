use crate::state::*;
use anchor_lang::prelude::*;

use crate::constants::*;

#[derive(Accounts)]
pub struct CreateConfig<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = 8 + SuperChargerConfig::INIT_SPACE,
        seeds = [
            SUPER_CHARGER_CONFIG_SEED.as_bytes(),
        ],
        bump)]
    pub super_charger_config: Box<Account<'info, SuperChargerConfig>>,

    pub system_program: Program<'info, System>,
}

pub fn create_config_handler(ctx: Context<CreateConfig>) -> Result<()> {
    ctx.accounts.super_charger_config.authority = ctx.accounts.authority.key();
    ctx.accounts.super_charger_config.paused = false;

    Ok(())
}
