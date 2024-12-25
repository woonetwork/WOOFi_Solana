use crate::constants::SUPER_CHARGER_RESERVE_VAULT_SEED;
use crate::util::{mint_lp_token, transfer_from_user};
use crate::SuperCharger;
use crate::{errors::ErrorCode, UserState};
use anchor_lang::prelude::*;
use anchor_lang::ToAccountInfo;
use anchor_spl::token::{Mint, Token, TokenAccount};

#[derive(Accounts)]
pub struct Stake<'info> {
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

pub fn hanlder(ctx: Context<Stake>, reserve_amount: u64) -> Result<()> {
    require!(reserve_amount != 0, ErrorCode::StakeZero);

    let user_reserve_account = &ctx.accounts.user_reserve_account;
    require!(
        user_reserve_account.amount >= reserve_amount,
        ErrorCode::NotEnoughBalance
    );

    let super_charger = &mut ctx.accounts.super_charger;
    let user_state = &mut ctx.accounts.user_state;

    let reserve_amount = if reserve_amount == u64::MAX {
        ctx.accounts.user_reserve_account.amount
    } else {
        reserve_amount
    };

    let total_staked_amount = super_charger.total_staked_amount;
    super_charger.total_staked_amount = total_staked_amount.checked_add(reserve_amount).ok_or(ErrorCode::MathOverflow)?;

    // TODO Prince:
    // update user_state.cost_share_price
    // update user_state.last_stake_ts

    transfer_from_user(
        reserve_amount,
        &ctx.accounts.user_reserve_account.to_account_info(),
        &ctx.accounts.reserve_vault.to_account_info(),
        &ctx.accounts.user,
        &ctx.accounts.token_program,
    )?;

    // TODO Prince:
    // calculate mint amount based on lending manager
    // consider decimals
    let mint_amount = reserve_amount;

    // TODO QC & Prince:
    // Mint lp token to super charger or mint to user?
    mint_lp_token(
        ctx.accounts.lp_token_program.to_account_info(),
        ctx.accounts.lp_token_mint.to_account_info(),
        super_charger.to_account_info(),
        ctx.accounts.user_lp_account.to_account_info(),
        super_charger.seeds().as_slice(),
        mint_amount,
    )?;

    Ok(())
}