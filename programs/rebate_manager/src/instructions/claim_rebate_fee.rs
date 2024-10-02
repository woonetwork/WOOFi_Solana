use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::{errors::ErrorCode, util::*};

#[derive(Accounts)]
pub struct ClaimRebateFee<'info> {
    pub quote_token_mint: Account<'info, Mint>,

    pub rebate_authority: Signer<'info>,

    #[account(mut,
        has_one = quote_token_mint,
    )]
    pub rebate_manager: Account<'info, RebateManager>,

    #[account(mut,
        address = rebate_manager.token_vault
    )]
    token_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut,
        has_one = rebate_manager,
        has_one = rebate_authority,
        constraint = rebate_info.authority == rebate_manager.authority
                  || rebate_manager.admin_authority.contains(&rebate_info.authority),
    )]
    pub rebate_info: Account<'info, RebateInfo>,

    #[account(mut, constraint = claim_fee_to_account.mint == quote_token_mint.key())]
    pub claim_fee_to_account: Box<Account<'info, TokenAccount>>,

    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<ClaimRebateFee>) -> Result<()> {
    let rebate_manager = &mut ctx.accounts.rebate_manager;
    let token_vault = &mut ctx.accounts.token_vault;
    let rebate_info = &mut ctx.accounts.rebate_info;
    let claim_fee_to_account = &ctx.accounts.claim_fee_to_account;

    require!(
        token_vault.amount as u128 >= rebate_info.pending_rebate,
        ErrorCode::RebateFeeNotEnough
    );

    let claim_amount = rebate_info.pending_rebate;
    rebate_info.clear_pending_rebate()?;

    transfer_from_vault_to_owner(
        rebate_manager,
        token_vault,
        claim_fee_to_account,
        &ctx.accounts.token_program,
        claim_amount as u64,
    )?;

    Ok(())
}
