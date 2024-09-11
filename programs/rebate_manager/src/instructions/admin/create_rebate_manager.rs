use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::constants::*;

#[derive(Accounts)]
pub struct CreateRebateManager<'info> {
    pub quote_token_mint: Account<'info, Mint>,

    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = 8 + RebateManager::INIT_SPACE,
        seeds = [
          REBATEMANAGER_SEED.as_bytes(),
          quote_token_mint.key().as_ref()
        ],
        bump)]
    pub rebate_manager: Box<Account<'info, RebateManager>>,

    #[account(
        init,
        payer = authority,
        token::mint = quote_token_mint,
        token::authority = rebate_manager
      )]
    pub token_vault: Box<Account<'info, TokenAccount>>,

    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<CreateRebateManager>) -> Result<()> {
    let authority = ctx.accounts.authority.key();
    let quote_token_mint = ctx.accounts.quote_token_mint.key();
    let token_vault = ctx.accounts.token_vault.key();

    let rebate_manager = &mut ctx.accounts.rebate_manager;

    rebate_manager.initialize(authority, quote_token_mint, token_vault)
}
