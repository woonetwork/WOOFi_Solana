use anchor_lang::prelude::*;
use anchor_spl::{token::Token, token_interface::TokenAccount};

use crate::{
    errors::ErrorCode, util::transfer_from_vault, LendingManager, SuperCharger, SuperChargerConfig
};


#[derive(Accounts)]
pub struct BorrowOnlyBorrower<'info> {
    pub authority: Signer<'info>,

    #[account(mut,
        constraint =
            super_charger_config.authority == authority.key() ||
            super_charger_config.borrower_authority.contains(authority.key)
    )]
    pub super_charger_config: Account<'info, SuperChargerConfig>,

    #[account(mut,
        has_one = super_charger_config,
        has_one = lending_manager,
    )]
    pub super_charger: Account<'info, SuperCharger>,

    #[account(mut,
        has_one = super_charger_config,
        has_one = super_charger,
    )]
    pub lending_manager: Account<'info, LendingManager>,

    #[account(mut,
        address = super_charger.stake_vault
    )]
    pub stake_vault: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(mut,
        address = lending_manager.woopool_token_vault,
        constraint = woopool_token_vault.mint == stake_vault.mint
    )]
    pub woopool_token_vault: Box<InterfaceAccount<'info, TokenAccount>>,

    pub token_program: Program<'info, Token>,
}

pub fn borrow_only_borrower_handler(
    ctx: Context<BorrowOnlyBorrower>,
    borrow_amount: u64,
) -> Result<()> {
    require!(borrow_amount > 0, ErrorCode::BorrowZero);

    let super_charger = &mut ctx.accounts.super_charger;
    let lending_manager = &mut ctx.accounts.lending_manager;
    let stake_vault = &mut ctx.accounts.stake_vault;
    let woopool_token_vault = &mut ctx.accounts.woopool_token_vault;

    lending_manager.accure_interest()?;
    lending_manager.borrowed_principal = lending_manager.borrowed_principal
                                            .checked_add(borrow_amount)
                                            .ok_or(ErrorCode::MathOverflow)?;

    // Borrow the fund from super charger and then deposit directly into WooPP.
    // transfer from super_charger to woopool

    // TODO Prince:
    // require(!isSettling, "IN SETTLING");
    // require(amount <= maxBorrowableAmount(), "INSUFF_AMOUNT_FOR_BORROW");

    transfer_from_vault(
        borrow_amount, 
        &[super_charger.seeds().as_slice()],
        &woopool_token_vault.to_account_info(),
        &stake_vault.to_account_info(), 
        &super_charger.to_account_info(), 
        &ctx.accounts.token_program)?;

    Ok(())
}
