use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::{
    constants::*,
    errors::ErrorCode,
    util::*
};

#[derive(Accounts)]
pub struct ClaimFee<'info> {
    pub token_mint: Account<'info, Mint>,

    pub authority: Signer<'info>,

    #[account(
        seeds = [
          WOOPOOL_SEED.as_bytes(),
          token_mint.key().as_ref(),
        ],
        bump,
        constraint = woopool.authority == authority.key() 
                  || woopool.fee_authority == authority.key(),
        constraint = woopool.token_mint == token_mint.key()
    )]
    pub woopool: Box<Account<'info, WooPool>>,

    #[account(
        constraint = token_vault.key() == woopool.token_vault,
        constraint = token_vault.mint == token_mint.key()
      )]
    pub token_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut, constraint = claim_fee_to_account.mint == token_mint.key())]
    pub claim_fee_to_account: Box<Account<'info, TokenAccount>>,

    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
}

pub fn handler(
    ctx: Context<ClaimFee>,
    claim_amount: u128
) -> Result<()> {
    let token_vault = &ctx.accounts.token_vault;
    let claim_fee_to_account = &ctx.accounts.claim_fee_to_account;

    let woopool = &mut ctx.accounts.woopool;

    require!(token_vault.amount as u128 >= claim_amount, ErrorCode::ProtocolFeeNotEnough);

    let _ = woopool.sub_protocol_fee(claim_amount)?;

    transfer_from_vault_to_owner(
        woopool,
        token_vault,
        claim_fee_to_account,
        &ctx.accounts.token_program,
        claim_amount as u64,
    )?;

    Ok(())
}
