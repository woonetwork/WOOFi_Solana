use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::constants::*;

#[derive(Accounts)]
pub struct CreateRebatePool<'info> {
    pub wooconfig: Box<Account<'info, WooConfig>>,
    pub quote_token_mint: Account<'info, Mint>,

    #[account(mut)]
    pub authority: Signer<'info>,

    /// CHECK: rebate authority which can claim rebate fees in this rebate pool
    pub rebate_authority: UncheckedAccount<'info>,

    #[account(
        init,
        payer = authority,
        space = 8 + RebatePool::INIT_SPACE,
        seeds = [
          REBATEPOOL_SEED.as_bytes(),
          wooconfig.key().as_ref(),
          rebate_authority.key().as_ref(),
          quote_token_mint.key().as_ref()
        ],
        bump)]
    pub rebate_pool: Box<Account<'info, RebatePool>>,

    #[account(
        init,
        payer = authority,
        token::mint = quote_token_mint,
        token::authority = rebate_pool
      )]
    pub token_vault: Box<Account<'info, TokenAccount>>,

    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<CreateRebatePool>) -> Result<()> {
    let authority = ctx.accounts.authority.key();
    let wooconfig = ctx.accounts.authority.key();
    let rebate_authority = ctx.accounts.rebate_authority.key();
    let quote_token_mint = ctx.accounts.quote_token_mint.key();
    let token_vault = ctx.accounts.token_vault.key();

    let rebate_pool = &mut ctx.accounts.rebate_pool;

    rebate_pool.initialize(
        authority,
        wooconfig,
        rebate_authority,
        quote_token_mint,
        token_vault,
    )
}
