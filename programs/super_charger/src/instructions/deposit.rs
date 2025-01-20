use crate::constants::{ONE_E18_U128, SUPER_CHARGER_STAKE_VAULT_SEED};
use crate::util::{get_price_per_full_share, mint_we_token, shares, transfer_from_user};
use crate::{LendingManager, SuperCharger, SuperChargerConfig};
use crate::{errors::ErrorCode, UserState};
use anchor_lang::prelude::*;
use anchor_lang::ToAccountInfo;
use anchor_spl::token::Token;
use anchor_spl::token_interface::{Mint, TokenAccount};

#[derive(Accounts)]
pub struct Deposit<'info> {
    pub user: Signer<'info>,

    #[account(mut,
        has_one = user,
        has_one = super_charger,
    )]
    pub user_state: Account<'info, UserState>,

    #[account(
        constraint = !super_charger_config.paused
    )]
    pub super_charger_config: Account<'info, SuperChargerConfig>,

    #[account(mut,
        has_one = super_charger_config,
        has_one = stake_vault,
        has_one = lending_manager,
        has_one = stake_token_mint,
        has_one = we_token_mint,
    )]
    pub super_charger: Account<'info, SuperCharger>,

    #[account(mut,
        has_one = super_charger
    )]
    pub lending_manager:Account<'info, LendingManager>,

    #[account(mut,
        seeds = [
            SUPER_CHARGER_STAKE_VAULT_SEED.as_bytes(),
            super_charger.key().as_ref(),
            stake_token_mint.key().as_ref()
        ],
        bump,
    )]
    pub stake_vault: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(mut,
        constraint = user_deposit_account.owner == user.key(),
        constraint = user_deposit_account.mint == stake_token_mint.key() @ ErrorCode::UserAtaStakeTokenMintMissmatch,
    )]
    pub user_deposit_account: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        constraint = stake_token_mint.key() == super_charger.stake_token_mint @ ErrorCode::StakeTokenMintMissmatch,
    )]
    pub stake_token_mint: Box<InterfaceAccount<'info, Mint>>,

    pub token_program: Program<'info, Token>,

    #[account(mut,
        constraint = we_token_mint.key() == super_charger.we_token_mint @ ErrorCode::StakeTokenMintMissmatch,
    )]
    pub we_token_mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(mut,
        constraint = user_we_account.owner == user.key(),
        constraint = user_we_account.mint == we_token_mint.key() @ ErrorCode::UserAtaStakeTokenMintMissmatch,
    )]
    pub user_we_account: Box<InterfaceAccount<'info, TokenAccount>>,

    pub we_token_program: Program<'info, Token>,
}

pub fn deposit_handler(ctx: Context<Deposit>, deposit_amount: u64) -> Result<()> {
    require!(deposit_amount != 0, ErrorCode::StakeZero);

    let user_deposit_account = &ctx.accounts.user_deposit_account;
    require!(
        user_deposit_account.amount >= deposit_amount,
        ErrorCode::NotEnoughBalance
    );

    let super_charger = &mut ctx.accounts.super_charger;
    let lending_manager = &mut ctx.accounts.lending_manager;
    let stake_vault = &ctx.accounts.stake_vault;
    let user_state = &mut ctx.accounts.user_state;

    let deposit_amount = if deposit_amount == u64::MAX {
        ctx.accounts.user_deposit_account.amount
    } else {
        deposit_amount
    };

    let total_staked_amount = super_charger.total_staked_amount;
    super_charger.total_staked_amount = total_staked_amount
                                            .checked_add(deposit_amount)
                                            .ok_or(ErrorCode::MathOverflow)?;
    super_charger.instant_withdraw_cap = super_charger.instant_withdraw_cap
                                            .checked_add(
                                                deposit_amount.checked_div(10)
                                                .ok_or(ErrorCode::MathOverflow)?
                                            )
                                            .ok_or(ErrorCode::MathOverflow)?;
    transfer_from_user(
        deposit_amount,
        &ctx.accounts.user_deposit_account.to_account_info(),
        &stake_vault.to_account_info(),
        &ctx.accounts.user,
        &ctx.accounts.token_program,
    )?;

    lending_manager.accure_interest()?;
    let share_price = get_price_per_full_share(
        stake_vault,
        lending_manager,
        &ctx.accounts.we_token_mint)?;
    let mint_amount = shares(deposit_amount, share_price)?;

    let shares_before = ctx.accounts.user_we_account.amount as u128;
    let cost_before = user_state.cost_share_price;

    // (shares_before * cost_before + deposit_amount as u128 * ONE_E18_U128) / (shares_before + mint_amount as u128);
    user_state.cost_share_price = shares_before.checked_mul(cost_before)
                                    .ok_or(ErrorCode::MathOverflow)?
                                    .checked_add(
                                        (deposit_amount as u128).checked_mul(ONE_E18_U128)
                                        .ok_or(ErrorCode::MathOverflow)?
                                    )
                                    .ok_or(ErrorCode::MathOverflow)?
                                    .checked_div(
                                        shares_before.checked_add(mint_amount as u128)
                                        .ok_or(ErrorCode::MathOverflow)?
                                    )
                                    .ok_or(ErrorCode::MathOverflow)?;
    user_state.update_stake_now()?;

    // TODO QC & Prince:
    // Mint lp token to super charger or mint to user?
    mint_we_token(
        ctx.accounts.we_token_program.to_account_info(),
        ctx.accounts.we_token_mint.to_account_info(),
        super_charger.to_account_info(),
        ctx.accounts.user_we_account.to_account_info(),
        super_charger.seeds().as_slice(),
        mint_amount,
    )?;

    Ok(())
}