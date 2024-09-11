use crate::{errors::ErrorCode, RebatePool};
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

pub fn balance<'info>(
    rebate_pool: &Account<'info, RebatePool>,
    token_vault: &Account<'info, TokenAccount>,
) -> Result<u128> {
    require!(
        rebate_pool.token_vault == token_vault.key(),
        ErrorCode::RebateVaultNotMatch
    );
    require!(
        // TODO Prince: consider using abs(sub) < threshhold
        rebate_pool.pending_rebate == token_vault.amount as u128,
        ErrorCode::PendingRebateNotMatch
    );

    Ok(rebate_pool.pending_rebate)
}

pub fn transfer_from_owner_to_vault<'info>(
    position_authority: &Signer<'info>,
    token_owner_account: &Account<'info, TokenAccount>,
    token_vault: &Account<'info, TokenAccount>,
    token_program: &Program<'info, Token>,
    amount: u64,
) -> Result<()> {
    token::transfer(
        CpiContext::new(
            token_program.to_account_info(),
            Transfer {
                from: token_owner_account.to_account_info(),
                to: token_vault.to_account_info(),
                authority: position_authority.to_account_info(),
            },
        ),
        amount,
    )
}

pub fn transfer_from_vault_to_owner<'info>(
    rebate_pool: &Account<'info, RebatePool>,
    token_vault: &Account<'info, TokenAccount>,
    token_owner_account: &Account<'info, TokenAccount>,
    token_program: &Program<'info, Token>,
    amount: u64,
) -> Result<()> {
    token::transfer(
        CpiContext::new_with_signer(
            token_program.to_account_info(),
            Transfer {
                from: token_vault.to_account_info(),
                to: token_owner_account.to_account_info(),
                authority: rebate_pool.to_account_info(),
            },
            &[&rebate_pool.seeds()],
        ),
        amount,
    )
}
