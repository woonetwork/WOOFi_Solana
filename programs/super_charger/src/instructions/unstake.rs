use crate::constants::SUPER_CHARGER_RESERVE_VAULT_SEED;
use crate::util::{burn_lp_token, transfer_from_vault};
use crate::SuperCharger;
use crate::{errors::ErrorCode, UserState};
use anchor_lang::prelude::*;
use anchor_lang::ToAccountInfo;
use anchor_spl::token::{Mint, Token, TokenAccount};

#[derive(Accounts)]
pub struct Unstake<'info> {
    pub user: Signer<'info>,

    #[account(mut,
        has_one = user,
        has_one = super_charger,
    )]
    pub user_state: Account<'info, UserState>,

    #[account(mut,
        has_one = reserve_vault,
        has_one = reserve_mint,
        has_one = lp_token_mint,
    )]
    pub super_charger: Account<'info, SuperCharger>,

    #[account(mut,
        seeds = [
            SUPER_CHARGER_RESERVE_VAULT_SEED.as_bytes(),
            super_charger.key().as_ref(),
            reserve_mint.key().as_ref()
        ],
        bump,
    )]
    pub reserve_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut,
        constraint = user_reserve_account.owner == user.key(),
        constraint = user_reserve_account.mint == reserve_mint.key() @ ErrorCode::UserAtaReserveTokenMintMissmatch,
    )]
    pub user_reserve_account: Box<Account<'info, TokenAccount>>,

    #[account(
        constraint = reserve_mint.key() == super_charger.reserve_mint @ ErrorCode::ReserveTokenMintMissmatch,
    )]
    pub reserve_mint: Box<Account<'info, Mint>>,

    pub token_program: Program<'info, Token>,

    #[account(
        constraint = lp_token_mint.key() == super_charger.lp_token_mint @ ErrorCode::ReserveTokenMintMissmatch,
    )]
    pub lp_token_mint: Box<Account<'info, Mint>>,

    #[account(mut,
        constraint = user_lp_account.owner == user.key(),
        constraint = user_lp_account.mint == lp_token_mint.key() @ ErrorCode::UserAtaReserveTokenMintMissmatch,
    )]
    pub user_lp_account: Box<Account<'info, TokenAccount>>,

    pub lp_token_program: Program<'info, Token>,
}

pub fn hanlder(ctx: Context<Unstake>, reserve_amount: u64) -> Result<()> {
    require!(reserve_amount != 0, ErrorCode::UnstakeZero);

    let super_charger = &mut ctx.accounts.super_charger;
    let reserve_vault = &mut ctx.accounts.reserve_vault;
    let user_state = &mut ctx.accounts.user_state;

    require!(
        reserve_vault.amount >= reserve_amount,
        ErrorCode::NotEnoughOut
    );

    // TODO Prince:
    // calculate reserve amount by lp_token_amount
    // consider decimals
    let lp_token_amount = reserve_amount;

    let user_lp_account = &ctx.accounts.user_lp_account;
    require!(
        user_lp_account.amount >= lp_token_amount,
        ErrorCode::NotEnoughBalance
    );

    let total_staked_amount = super_charger.total_staked_amount;
    super_charger.total_staked_amount = total_staked_amount.checked_sub(reserve_amount).ok_or(ErrorCode::MathOverflow)?;

    // TODO Prince:
    // update user_state.cost_share_price
    // update user_state.last_stake_ts

    transfer_from_vault(
        reserve_amount, 
        &[super_charger.seeds().as_slice()],
        &ctx.accounts.user_reserve_account.to_account_info(),
        &reserve_vault.to_account_info(), 
        &super_charger.to_account_info(), 
        &ctx.accounts.token_program)?;

    // TODO QC & Prince:
    // Mint lp token to super charger or mint to user?
    burn_lp_token(
        ctx.accounts.lp_token_mint.to_account_info(),
        ctx.accounts.user_lp_account.to_account_info(),
        ctx.accounts.user.to_account_info(),
        ctx.accounts.lp_token_program.to_account_info(),
        lp_token_amount
    )?;

    Ok(())
}