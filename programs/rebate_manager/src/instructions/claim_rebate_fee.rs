use crate::{events::ClaimRebateFeeEvent, state::*};
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::errors::ErrorCode;
use crate::util::*;

#[derive(Accounts)]
pub struct ClaimRebateFee<'info> {
    pub quote_token_mint: Account<'info, Mint>,

    pub rebate_authority: Signer<'info>,

    #[account(mut,
        has_one = rebate_authority,
        has_one = quote_token_mint,
    )]
    pub rebate_pool: Account<'info, RebatePool>,

    #[account(mut,
        address = rebate_pool.token_vault
    )]
    token_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut, constraint = claim_fee_to_account.mint == quote_token_mint.key())]
    pub claim_fee_to_account: Box<Account<'info, TokenAccount>>,

    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<ClaimRebateFee>) -> Result<()> {
    let rebate_pool = &mut ctx.accounts.rebate_pool;
    let token_vault = &mut ctx.accounts.token_vault;
    let claim_fee_to_account = &ctx.accounts.claim_fee_to_account;

    require!(
        rebate_pool.pending_rebate > 0,
        ErrorCode::RebateFeeNotEnough
    );

    let claim_amount = rebate_pool.pending_rebate;
    rebate_pool.clear_pending_rebate()?;

    transfer_from_vault_to_owner(
        rebate_pool,
        token_vault,
        &ctx.accounts.claim_fee_to_account,
        &ctx.accounts.token_program,
        claim_amount as u64,
    )?;

    emit!(ClaimRebateFeeEvent {
        quote_token_mint: rebate_pool.quote_token_mint,
        rebate_authority: ctx.accounts.rebate_authority.key(),
        to_account: claim_fee_to_account.key(),
        claim_amount,
    });

    Ok(())
}
