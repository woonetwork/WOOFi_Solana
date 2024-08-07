use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::constants::*;

#[derive(Accounts)]
pub struct CreateRebatePool<'info> {
    pub token_mint: Account<'info, Mint>,

    #[account(mut)]
    pub authority: Signer<'info>,

    /// CHECK: Todo
    pub rebate_authority: UncheckedAccount<'info>,

    #[account(
        init,
        payer = authority,
        space = RebatePool::LEN,
        seeds = [
          REBATEPOOL_SEED.as_bytes(),
          rebate_authority.key().as_ref(),
          woopool.key().as_ref(),
          token_mint.key().as_ref()
        ],
        bump)]
    pub rebate_pool: Box<Account<'info, RebatePool>>,

    #[account(
        has_one = authority,
        constraint = woopool.token_mint == token_mint.key()
    )]
    woopool: Box<Account<'info, WooPool>>,

    #[account(
        init,
        payer = authority,
        token::mint = token_mint,
        token::authority = rebate_pool
      )]
    pub token_vault: Box<Account<'info, TokenAccount>>,

    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<CreateRebatePool>,
) -> Result<()> {
    let authority = ctx.accounts.authority.key();
    let rebate_authority = ctx.accounts.rebate_authority.key();
    let token_mint = ctx.accounts.token_mint.key();
    let token_vault = ctx.accounts.token_vault.key();
    let base_decimals = ctx.accounts.token_mint.decimals;
    let woopool = ctx.accounts.woopool.key();

    let rebate_pool = &mut ctx.accounts.rebate_pool;

    Ok(rebate_pool.initialize(
        authority,
        rebate_authority,
        woopool,
        token_mint,
        token_vault,
        base_decimals,
    )?)
}
