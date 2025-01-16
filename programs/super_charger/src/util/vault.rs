use anchor_lang::prelude::Result;

use anchor_spl::token_interface::{Mint, TokenAccount};

use crate::{constants::ONE_E18_U128, errors::ErrorCode};

// we_token => WOOFi Earn Token
// total_balance = principal + interest
pub fn balance(stake_vault: &TokenAccount) -> u64 {
    // lending_manager)
    stake_vault.amount
    // + lending_manager.borrow_amount
}

// share_price = total_balance / total_we_token_amount
pub fn get_price_per_full_share(stake_vault: &TokenAccount, we_token_mint: &Mint) -> Result<u128> {
    let total_we_token_amount = we_token_mint.supply;
    calculate_share_price(balance(stake_vault), total_we_token_amount)
}

pub fn calculate_share_price(total_balance: u64, total_we_token_amount: u64) -> Result<u128> {
    if total_we_token_amount == 0 {
        Ok(0)
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
    if share_price == 0 {
        Ok(0)
    } else {
        let shares = (amount as u128).checked_mul(ONE_E18_U128)
                                    .ok_or(ErrorCode::MathOverflow)?
                                    .checked_div(share_price)
                                    .ok_or(ErrorCode::MathOverflow)?;
        Ok(shares as u64)
    }
}