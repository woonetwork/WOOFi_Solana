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
          token_mint.key().as_ref(),
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

    // #[account(has_one = pools_config)]
    // pub fee_tier: Account<'info, FeeTier>,

    // TODO Prince: must make sure the cloracle is related to this pools token
    // currently cannot change for now, for security problem.
    // find a way to identify the cloracle's token type
    #[account(
      has_one = authority,
      has_one = token_mint
    )]
    oracle: Account<'info, Oracle>,
    #[account(
        has_one = authority,
        has_one = oracle,
        seeds = [
            WOORACLE_SEED.as_bytes(),
            oracle.token_mint.as_ref(),
            oracle.feed_account.as_ref(),
            oracle.price_update.as_ref()
        ],
        bump,
    )]
    wooracle: Account<'info, WOOracle>,

    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<CreatePool>,
    admin_authority: Pubkey,
    fee_authority: Pubkey,
) -> Result<()> {
    let authority = ctx.accounts.authority.key();
    let token_mint = ctx.accounts.token_mint.key();
    let token_vault = ctx.accounts.token_vault.key();
    let base_decimals = ctx.accounts.token_mint.decimals;

    let woopool = &mut ctx.accounts.woopool;
    let bump = ctx.bumps.woopool;
    let oracle = ctx.accounts.oracle.key();
    let wooracle = ctx.accounts.wooracle.key();

    woopool.initialize(
        bump,
        authority,
        admin_authority,
        fee_authority,
        oracle,
        wooracle,
        token_mint,
        token_vault,
        base_decimals,
    )
}
