use crate::errors::ErrorCode;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::WooPool;

pub fn balance<'info>(
    woopool: &Account<'info, WooPool>,
    token_vault: &Account<'info, TokenAccount>,
) -> Result<u128> {
    let balance: u128 = if woopool.token_mint == woopool.quote_token_mint {
        (token_vault.amount as u128)
            .checked_sub(woopool.unclaimed_fee)
            .ok_or(ErrorCode::ReserveLessThanFee)?
    } else {
        token_vault.amount as u128
    };

    Ok(balance)
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
    woopool: &Account<'info, WooPool>,
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
                authority: woopool.to_account_info(),
            },
            &[&woopool.seeds()],
        ),
        amount,
    )
}
