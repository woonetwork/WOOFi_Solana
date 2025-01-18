use anchor_lang::prelude::Result;

use anchor_spl::token_interface::{Mint, TokenAccount};

use crate::{constants::ONE_E18_U128, errors::ErrorCode, LendingManager};

// debt = borrowedPrincipal + borrowedInterest
pub fn debt(lending_manager: &LendingManager) -> Result<u64> {
    Ok(
        lending_manager.borrowed_principal
                       .checked_add(lending_manager.borrowed_interest)
                       .ok_or(ErrorCode::MathOverflow)?
    )
}

pub fn balance(stake_vault: &TokenAccount, lending_manager: &LendingManager) -> Result<u64> {
    let lending_balance = debt(lending_manager)?;
    Ok(
        stake_vault.amount
                   .checked_add(lending_balance)
                   .ok_or(ErrorCode::MathOverflow)?
    )
}

pub fn get_price_per_full_share(
    stake_vault: &TokenAccount,
    lending_manager: &LendingManager,
    we_token_mint: &Mint
) -> Result<u128> {
    let total_balance = balance(stake_vault, lending_manager)?;
    let total_we_token_amount = we_token_mint.supply;
    
    calculate_share_price(total_balance, total_we_token_amount)
}

// share_price = total_balance / total_we_token_amount
// TODO Prince: check whether we need handle decimals
// currently we token and usdc's decimal is the same, 9
// share_price = (total_balance / total_we_token_amount) * (we_token_decimals / base_decimals)
pub fn calculate_share_price(total_balance: u64, total_we_token_amount: u64) -> Result<u128> {
    if total_we_token_amount == 0 {
        Ok(ONE_E18_U128)
    } else {
        let price = (total_balance as u128).checked_mul(ONE_E18_U128)
                                           .ok_or(ErrorCode::MathOverflow)?
                                           .checked_div(total_we_token_amount as u128)
                                           .ok_or(ErrorCode::MathOverflow)?;
        // price's unit is 1E18
        Ok(price)
    }
}

// shares = deposit_amount / share_price
pub fn shares(amount: u64, share_price: u128) -> Result<u64> {
    let shares = (amount as u128).checked_mul(ONE_E18_U128)
                                .ok_or(ErrorCode::MathOverflow)?
                                .checked_div(share_price)
                                .ok_or(ErrorCode::MathOverflow)?;
    Ok(shares as u64)
}