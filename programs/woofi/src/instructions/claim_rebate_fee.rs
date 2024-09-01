use crate::{events::ClaimRebateFeeEvent, state::*};
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::errors::ErrorCode;
use crate::util::*;

#[derive(Accounts)]
pub struct ClaimRebateFee<'info> {
    pub quote_token_mint: Account<'info, Mint>,

    pub rebate_authority: Signer<'info>,

    #[account(
        constraint = !woopool_quote.paused,
        has_one = quote_token_mint,
        constraint = woopool_quote.token_mint == quote_token_mint.key(),
    )]
    pub woopool_quote: Box<Account<'info, WooPool>>,

    #[account(mut,
        address = woopool_quote.token_vault
    )]
    woopool_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut,
        constraint = !rebate_pool.paused,
        has_one = rebate_authority,
        has_one = woopool_quote,
        has_one = quote_token_mint,
        constraint = rebate_pool.authority == woopool_quote.authority
    )]
    pub rebate_pool: Account<'info, RebatePool>,

    #[account(mut, constraint = claim_fee_to_account.mint == quote_token_mint.key())]
    pub claim_fee_to_account: Box<Account<'info, TokenAccount>>,

    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<ClaimRebateFee>) -> Result<()> {
    let woopool_quote = &ctx.accounts.woopool_quote;
    let woopool_vault = &ctx.accounts.woopool_vault;
    let rebate_pool = &mut ctx.accounts.rebate_pool;
    let claim_fee_to_account = &ctx.accounts.claim_fee_to_account;

    require!(
        rebate_pool.pending_rebate > 0,
        ErrorCode::RebateFeeNotEnough
    );

    let claim_amount = rebate_pool.pending_rebate;
    rebate_pool.clear_pending_rebate()?;

    transfer_from_vault_to_owner(
        woopool_quote,
        woopool_vault,
        &ctx.accounts.claim_fee_to_account,
        &ctx.accounts.token_program,
        claim_amount as u64,
    )?;

    emit!(ClaimRebateFeeEvent {
        rebate_authority: ctx.accounts.rebate_authority.key(),
        woopool_quote: woopool_quote.key(),
        woopool_vault: woopool_vault.key(),
        rebate_pool: rebate_pool.key(),
        claim_fee_to_account: claim_fee_to_account.key(),
        claim_amount,
    });

    Ok(())
}
