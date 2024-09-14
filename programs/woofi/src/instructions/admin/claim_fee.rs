use crate::{events::ClaimFeeEvent, state::*};
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::{errors::ErrorCode, util::*};

#[derive(Accounts)]
pub struct ClaimFee<'info> {
    pub wooconfig: Box<Account<'info, WooConfig>>,
    pub token_mint: Account<'info, Mint>,

    pub authority: Signer<'info>,

    #[account(mut,
        has_one = wooconfig,
        constraint = woopool.authority == authority.key()
                  || wooconfig.fee_authority.contains(authority.key),
        constraint = woopool.token_mint == token_mint.key()
    )]
    pub woopool: Box<Account<'info, WooPool>>,

    #[account(mut,
        address = woopool.token_vault,
        constraint = token_vault.mint == token_mint.key()
      )]
    pub token_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut, constraint = claim_fee_to_account.mint == token_mint.key())]
    pub claim_fee_to_account: Box<Account<'info, TokenAccount>>,

    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
}

pub fn claim_handler(ctx: Context<ClaimFee>) -> Result<()> {
    let token_vault = &ctx.accounts.token_vault;
    let claim_fee_to_account = &ctx.accounts.claim_fee_to_account;
    let woopool = &mut ctx.accounts.woopool;

    require!(
        woopool.unclaimed_fee > 0 && token_vault.amount as u128 > 0,
        ErrorCode::ProtocolFeeNotEnough
    );

    let claim_amount = woopool.unclaimed_fee;
    woopool.unclaimed_fee = 0;

    transfer_from_vault_to_owner(
        woopool,
        token_vault,
        claim_fee_to_account,
        &ctx.accounts.token_program,
        claim_amount as u64,
    )?;

    emit!(ClaimFeeEvent {
        quote_token_mint: woopool.quote_token_mint,
        authority: ctx.accounts.authority.key(),
        claim_fee_to_account: claim_fee_to_account.key(),
        claim_amount
    });

    Ok(())
}

pub fn claim_amount_handler(ctx: Context<ClaimFee>, claim_amount: u128) -> Result<()> {
    let token_vault = &ctx.accounts.token_vault;
    let claim_fee_to_account = &ctx.accounts.claim_fee_to_account;
    let woopool = &mut ctx.accounts.woopool;

    require!(
        woopool.unclaimed_fee >= claim_amount && token_vault.amount as u128 >= claim_amount,
        ErrorCode::ProtocolFeeNotEnough
    );

    woopool.sub_unclaimed_fee(claim_amount)?;

    transfer_from_vault_to_owner(
        woopool,
        token_vault,
        claim_fee_to_account,
        &ctx.accounts.token_program,
        claim_amount as u64,
    )?;

    emit!(ClaimFeeEvent {
        quote_token_mint: woopool.quote_token_mint,
        authority: ctx.accounts.authority.key(),
        claim_fee_to_account: claim_fee_to_account.key(),
        claim_amount
    });

    Ok(())
}
