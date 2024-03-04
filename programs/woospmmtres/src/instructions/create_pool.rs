use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::constants::*;

#[derive(Accounts)]
#[instruction(fee_authority: Pubkey)]
pub struct CreatePool<'info> {
    pub token_mint: Account<'info, Mint>,

    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = WooPool::LEN,
        seeds = [
          WOOPOOL_SEED.as_bytes(),
          fee_authority.as_ref(),
          token_mint.key().as_ref(),
        ],
        bump)]
    pub woopool: Box<Account<'info, WooPool>>,

    #[account(
        init,
        payer = authority,
        seeds = [
          WOOPOOL_VAULT_SEED.as_bytes(),
          woopool.key().as_ref()
        ],
        bump,
        token::mint = token_mint,
        token::authority = woopool
      )]
    pub token_vault: Box<Account<'info, TokenAccount>>,

    // #[account(has_one = pools_config)]
    // pub fee_tier: Account<'info, FeeTier>,

    // TODO Prince: must make sure the cloracle is related to this pools token
    // currently cannot change for now, for security problem.
    // find a way to identify the cloracle's token type
    #[account(
      has_one = authority,
    )]
    cloracle: Account<'info, CLOracle>,
    #[account(
        has_one = authority,
        seeds = [
            WOORACLE_SEED.as_bytes(),
            cloracle.chainlink_feed.as_ref()
        ],
        bump
    )]
    wooracle: Account<'info, WOOracle>,

    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<CreatePool>,
    fee_authority: Pubkey
) -> Result<()> {
    let token_mint = ctx.accounts.token_mint.key();
    let token_vault = ctx.accounts.token_vault.key();

    let woopool = &mut ctx.accounts.woopool;
    let bump = ctx.bumps.woopool;
    let cloracle = ctx.accounts.cloracle.key();
    let wooracle = ctx.accounts.wooracle.key();

    Ok(woopool.initialize(
        bump,
        cloracle,
        wooracle,
        fee_authority,
        token_mint,
        token_vault,
    )?)
}