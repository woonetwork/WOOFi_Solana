use anchor_lang::prelude::*;
use anchor_spl::{token::Token, token_interface::TokenAccount};
use woofi::cpi::accounts::Repay;
use woofi::{program::Woofi, state::{WooConfig, WooPool}};

use crate::{
    errors::ErrorCode, events::LendingManagerRepayEvent, LendingManager,
    SuperCharger, SuperChargerConfig
};


#[derive(Accounts)]
pub struct RepayOnlyAdmin<'info> {
    pub authority: Signer<'info>,

    #[account(mut,
        constraint =
            super_charger_config.authority == authority.key() ||
            super_charger_config.admin_authority.contains(authority.key)
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

    #[account(
        constraint = wooconfig.lending_manager_authority.contains(&lending_manager.key())
    )]
    pub wooconfig: Box<Account<'info, WooConfig>>,

    #[account(mut,
        has_one = wooconfig,
        constraint = woopool.token_mint == woopool_token_vault.mint,
        constraint = woopool.token_vault == lending_manager.woopool_token_vault
    )]
    pub woopool: Box<Account<'info, WooPool>>,

    #[account(mut,
        address = woopool.token_vault,
        constraint = woopool_token_vault.mint == stake_vault.mint
      )]
    pub woopool_token_vault: Box<InterfaceAccount<'info, TokenAccount>>,

    pub token_program: Program<'info, Token>,
    pub woofi_program: Program<'info, Woofi>
}

pub fn repay(
    ctx: Context<RepayOnlyAdmin>,
    principal_amount: u64,
    interest_amount: u64
) -> Result<u64> {
    if principal_amount == 0 && interest_amount == 0 {
        emit!(LendingManagerRepayEvent {
            authority: ctx.accounts.authority.key(),
            token_mint: ctx.accounts.woopool_token_vault.mint,
            perf_fee: 0,
        });

        return Ok(0);
    }

    let lending_manager = &mut ctx.accounts.lending_manager;

    let perf_fee = interest_amount.checked_mul(lending_manager.perf_rate)
                                     .ok_or(ErrorCode::MathOverflow)?
                                     .checked_div(10000)
                                     .ok_or(ErrorCode::MathOverflow)?;
    let total_amount = principal_amount.checked_add(interest_amount)    
                                       .ok_or(ErrorCode::MathOverflow)?
                                       .checked_add(perf_fee)
                                       .ok_or(ErrorCode::MathOverflow)?;
    
    lending_manager.borrowed_interest = lending_manager.borrowed_interest
                                                       .checked_sub(interest_amount)
                                                       .ok_or(ErrorCode::MathOverflow)?;
    lending_manager.borrowed_principal = lending_manager.borrowed_principal
                                                        .checked_sub(principal_amount)
                                                        .ok_or(ErrorCode::MathOverflow)?;

    // TODO Prince: perf fee need send to lending manager
    //              if using this implementation, perf fee will be also in stake vault.

    // ask woofi to do the repay
    // transfer from woopool to stake vault

    woofi_repay(
        ctx.accounts.woofi_program.to_account_info(), 
        ctx.accounts.wooconfig.to_account_info(),
        lending_manager.to_account_info(),
        ctx.accounts.woopool.to_account_info(),
        ctx.accounts.woopool_token_vault.to_account_info(),
        ctx.accounts.stake_vault.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
        lending_manager.seeds().as_slice(),
        total_amount)?;

    // TODO Prince: not total_amount here
    //              should be principal + interest
    Ok(total_amount)
}

#[allow(clippy::too_many_arguments)]
fn woofi_repay<'info>(
    woofi_program: AccountInfo<'info>,
    wooconfig: AccountInfo<'info>,
    authority: AccountInfo<'info>,
    woopool: AccountInfo<'info>,
    token_vault: AccountInfo<'info>,
    super_charger_vault: AccountInfo<'info>,
    token_program: AccountInfo<'info>,
    signer_seeds: &[&[u8]],
    repay_amount: u64,
) -> Result<()> {
    woofi::cpi::repay(
        CpiContext::new_with_signer(
            woofi_program, 
            Repay {
                wooconfig,
                authority,
                woopool,
                token_vault,
                super_charger_vault,
                token_program,
            },
        &[signer_seeds]),
        repay_amount as u128
    )
}