use crate::constants::SUPER_CHARGER_STAKE_VAULT_SEED;
use crate::util::{burn_we_token, get_price_per_full_share, shares, transfer_from_vault};
use crate::SuperCharger;
use crate::{errors::ErrorCode, UserState};
use anchor_lang::prelude::*;
use anchor_lang::ToAccountInfo;
use anchor_spl::token::Token;
use anchor_spl::token_interface::{Mint, TokenAccount};

#[derive(Accounts)]
pub struct Withdraw<'info> {
    pub user: Signer<'info>,

    #[account(mut,
        has_one = user,
        has_one = super_charger,
    )]
    pub user_state: Account<'info, UserState>,

    #[account(mut,
        has_one = stake_vault,
        has_one = stake_token_mint,
        has_one = we_token_mint,
    )]
    pub super_charger: Account<'info, SuperCharger>,

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
        constraint = user_deposit_account.mint == stake_token_mint.key() @ ErrorCode::UserAtaReserveTokenMintMissmatch,
    )]
    pub user_deposit_account: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        constraint = stake_token_mint.key() == super_charger.stake_token_mint @ ErrorCode::ReserveTokenMintMissmatch,
    )]
    pub stake_token_mint: Box<InterfaceAccount<'info, Mint>>,

    pub token_program: Program<'info, Token>,

    #[account(
        constraint = we_token_mint.key() == super_charger.we_token_mint @ ErrorCode::ReserveTokenMintMissmatch,
    )]
    pub we_token_mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(mut,
        constraint = user_we_account.owner == user.key(),
        constraint = user_we_account.mint == we_token_mint.key() @ ErrorCode::UserAtaReserveTokenMintMissmatch,
    )]
    pub user_we_account: Box<InterfaceAccount<'info, TokenAccount>>,

    pub we_token_program: Program<'info, Token>,
}

pub fn hanlder(ctx: Context<Withdraw>, withdraw_amount: u64) -> Result<()> {
    require!(withdraw_amount != 0, ErrorCode::UnstakeZero);

    let super_charger = &mut ctx.accounts.super_charger;
    let stake_vault = &ctx.accounts.stake_vault;
    let user_state = &mut ctx.accounts.user_state;

    require!(
        stake_vault.amount >= withdraw_amount,
        ErrorCode::NotEnoughOut
    );

    let share_price = get_price_per_full_share(
        &stake_vault,
        &ctx.accounts.we_token_mint)?;
    let we_token_amount = shares(withdraw_amount, share_price)?;

    let user_we_account = &ctx.accounts.user_we_account;
    require!(
        user_we_account.amount >= we_token_amount,
        ErrorCode::NotEnoughBalance
    );

    let total_staked_amount = super_charger.total_staked_amount;
    super_charger.total_staked_amount = total_staked_amount.checked_sub(withdraw_amount).ok_or(ErrorCode::MathOverflow)?;

    // TODO Prince:
    // update user_state.cost_share_price
    // update user_state.last_stake_ts

    transfer_from_vault(
        withdraw_amount, 
        &[super_charger.seeds().as_slice()],
        &ctx.accounts.user_deposit_account.to_account_info(),
        &stake_vault.to_account_info(), 
        &super_charger.to_account_info(), 
        &ctx.accounts.token_program)?;

    // TODO QC & Prince:
    // Mint lp token to super charger or mint to user?
    burn_we_token(
        ctx.accounts.we_token_mint.to_account_info(),
        ctx.accounts.user_we_account.to_account_info(),
        ctx.accounts.user.to_account_info(),
        ctx.accounts.we_token_program.to_account_info(),
        we_token_amount
    )?;

    Ok(())
}