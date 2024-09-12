use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token};

use crate::constants::*;

#[derive(Accounts)]
pub struct CreateRebateInfo<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    /// CHECK, rebate authority is third party account, can be anyone
    pub rebate_authority: UncheckedAccount<'info>,

    #[account(
      constraint = rebate_manager.authority == authority.key()
                || rebate_manager.admin_authority.contains(authority.key),
    )]
    pub rebate_manager: Box<Account<'info, RebateManager>>,

    #[account(
        init,
        payer = authority,
        space = 8 + RebateInfo::INIT_SPACE,
        seeds = [
          REBATEINFO_SEED.as_bytes(),
          rebate_manager.key().as_ref(),
          rebate_authority.key().as_ref()
        ],
       bump)]
    pub rebate_info: Account<'info, RebateInfo>,

    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateRebateInfo>) -> Result<()> {
    let rebate_info = &mut ctx.accounts.rebate_info;

    rebate_info.authority = ctx.accounts.authority.key();
    rebate_info.rebate_authority = ctx.accounts.rebate_authority.key();
    rebate_info.rebate_manager = ctx.accounts.rebate_manager.key();
    rebate_info.pending_rebate = 0;

    Ok(())
}
