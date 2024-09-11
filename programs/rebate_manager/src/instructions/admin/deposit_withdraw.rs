use crate::{
    events::{DepositRebateEvent, WithdrawRebateEvent},
    state::*,
};
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::{constants::*, errors::ErrorCode, util::*};

#[derive(Accounts)]
pub struct DepositWithdraw<'info> {
    pub quote_token_mint: Account<'info, Mint>,

    /// CHECK: rebater's authority
    pub rebate_authority: UncheckedAccount<'info>,

    pub authority: Signer<'info>,

    #[account(mut,
        constraint = token_owner_account.owner == authority.key(),
        constraint = token_owner_account.mint == quote_token_mint.key()
    )]
    token_owner_account: Box<Account<'info, TokenAccount>>,

    #[account(mut,
        has_one = rebate_authority,
        seeds = [
          REBATEPOOL_SEED.as_bytes(),
          rebate_authority.key().as_ref(),
          quote_token_mint.key().as_ref()
        ],
        bump,
        constraint = rebate_pool.authority == authority.key()
                  || rebate_pool.admin_authority.contains(authority.key),
        constraint = rebate_pool.quote_token_mint == quote_token_mint.key()
    )]
    pub rebate_pool: Box<Account<'info, RebatePool>>,

    #[account(mut,
        address = rebate_pool.token_vault,
        constraint = token_vault.mint == quote_token_mint.key()
      )]
    pub token_vault: Box<Account<'info, TokenAccount>>,

    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
}

pub fn deposit(ctx: Context<DepositWithdraw>, amount: u128) -> Result<()> {
    let token_owner_account = &ctx.accounts.token_owner_account;
    let rebate_pool = &mut ctx.accounts.rebate_pool;
    let token_vault = &ctx.accounts.token_vault;

    let _balance_before = balance(rebate_pool, token_vault)?;

    require!(
        token_owner_account.amount as u128 >= amount,
        ErrorCode::NotEnoughBalance
    );

    rebate_pool.add_pending_rebate(amount)?;

    transfer_from_owner_to_vault(
        &ctx.accounts.authority,
        token_owner_account,
        token_vault,
        &ctx.accounts.token_program,
        amount as u64,
    )?;

    emit!(DepositRebateEvent {
        quote_token_mint: ctx.accounts.quote_token_mint.key(),
        rebate_authority: ctx.accounts.rebate_authority.key(),
        from_account: token_owner_account.key(),
        deposit_amount: amount
    });

    Ok(())
}

pub fn withdraw(ctx: Context<DepositWithdraw>, amount: u128) -> Result<()> {
    let token_owner_account = &ctx.accounts.token_owner_account;
    let rebate_pool = &mut ctx.accounts.rebate_pool;
    let token_vault = &ctx.accounts.token_vault;

    let _balance_before = balance(rebate_pool, token_vault)?;

    require!(
        rebate_pool.pending_rebate >= amount && token_vault.amount as u128 >= amount,
        ErrorCode::NotEnoughBalance
    );

    rebate_pool.sub_pending_rebate(amount)?;

    transfer_from_vault_to_owner(
        rebate_pool,
        token_vault,
        token_owner_account,
        &ctx.accounts.token_program,
        amount as u64,
    )?;

    emit!(WithdrawRebateEvent {
        quote_token_mint: ctx.accounts.quote_token_mint.key(),
        rebate_authority: ctx.accounts.rebate_authority.key(),
        to_account: token_owner_account.key(),
        deposit_amount: amount
    });

    Ok(())
}
