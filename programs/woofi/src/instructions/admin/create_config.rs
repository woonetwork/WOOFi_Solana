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
        space = 8 + WooConfig::INIT_SPACE,
        seeds = [
          WOOCONFIG_SEED.as_bytes(),
        ],
        bump)]
    pub wooconfig: Box<Account<'info, WooConfig>>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateConfig>) -> Result<()> {
    ctx.accounts.wooconfig.authority = ctx.accounts.authority.key();
    ctx.accounts.wooconfig.paused = false;

    Ok(())
}
