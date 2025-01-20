use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::constants::*;

#[derive(Accounts)]
pub struct CreatePool<'info> {
    pub wooconfig: Box<Account<'info, WooConfig>>,
    pub token_mint: Account<'info, Mint>,
    pub quote_token_mint: Account<'info, Mint>,

    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = 8 + WooPool::INIT_SPACE,
        constraint = wooconfig.authority == authority.key(),
        seeds = [
          WOOPOOL_SEED.as_bytes(),
          wooconfig.key().as_ref(),
          token_mint.key().as_ref(),
          quote_token_mint.key().as_ref()
        ],
        bump)]
    pub woopool: Box<Account<'info, WooPool>>,

    #[account(
        init,
        payer = authority,
        token::mint = token_mint,
        token::authority = woopool
      )]
    pub token_vault: Box<Account<'info, TokenAccount>>,

    #[account(
        has_one = wooconfig,
        has_one = authority,
        has_one = token_mint,
        has_one = quote_token_mint
    )]
    wooracle: Account<'info, Wooracle>,

    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn create_pool_handler(ctx: Context<CreatePool>) -> Result<()> {
    let wooconfig = ctx.accounts.wooconfig.key();
    let authority = ctx.accounts.authority.key();
    let token_mint = ctx.accounts.token_mint.key();
    let quote_token_mint = ctx.accounts.quote_token_mint.key();
    let token_vault = ctx.accounts.token_vault.key();
    let base_decimals = ctx.accounts.token_mint.decimals;

    let woopool = &mut ctx.accounts.woopool;
    let bump = ctx.bumps.woopool;
    let wooracle = ctx.accounts.wooracle.key();

    woopool.initialize(
        bump,
        wooconfig,
        authority,
        wooracle,
        token_mint,
        token_vault,
        quote_token_mint,
        base_decimals,
    )
}
