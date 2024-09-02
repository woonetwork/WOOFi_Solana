use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::constants::*;

#[derive(Accounts)]
pub struct CreateRebatePool<'info> {
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
          rebate_authority.key().as_ref(),
          woopool_quote.key().as_ref(),
          quote_token_mint.key().as_ref()
        ],
        bump)]
    pub rebate_pool: Box<Account<'info, RebatePool>>,

    #[account(
        has_one = authority,
        has_one = quote_token_mint,
        constraint = woopool_quote.token_mint == quote_token_mint.key(),
    )]
    woopool_quote: Box<Account<'info, WooPool>>,

    #[account(mut,
        address = woopool_quote.token_vault
    )]
    woopool_vault: Box<Account<'info, TokenAccount>>,

    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<CreateRebatePool>) -> Result<()> {
    let authority = ctx.accounts.authority.key();
    let rebate_authority = ctx.accounts.rebate_authority.key();
    let quote_token_mint = ctx.accounts.quote_token_mint.key();
    let woopool_quote = ctx.accounts.woopool_quote.key();
    let woopool_vault = ctx.accounts.woopool_vault.key();

    let rebate_pool = &mut ctx.accounts.rebate_pool;

    rebate_pool.initialize(
        authority,
        rebate_authority,
        quote_token_mint,
        woopool_quote,
        woopool_vault,
    )
}
