use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::{errors::ErrorCode, util::*};

#[derive(Accounts)]
pub struct DepositWithdraw<'info> {
    pub quote_token_mint: Account<'info, Mint>,

    pub authority: Signer<'info>,

    #[account(mut,
        constraint = token_owner_account.owner == authority.key(),
        constraint = token_owner_account.mint == quote_token_mint.key()
    )]
    token_owner_account: Box<Account<'info, TokenAccount>>,

    #[account(mut,
        constraint = rebate_manager.authority == authority.key()
                  || rebate_manager.admin_authority.contains(authority.key),
        constraint = rebate_manager.quote_token_mint == quote_token_mint.key()
    )]
    pub rebate_manager: Box<Account<'info, RebateManager>>,

    #[account(mut,
        address = rebate_manager.token_vault,
        constraint = token_vault.mint == quote_token_mint.key()
      )]
    pub token_vault: Box<Account<'info, TokenAccount>>,

    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
}

pub fn deposit(ctx: Context<DepositWithdraw>, amount: u128) -> Result<()> {
    let token_owner_account = &ctx.accounts.token_owner_account;
    let token_vault = &ctx.accounts.token_vault;

    require!(
        token_owner_account.amount as u128 >= amount,
        ErrorCode::NotEnoughBalance
    );

    transfer_from_owner_to_vault(
        &ctx.accounts.authority,
        token_owner_account,
        token_vault,
        &ctx.accounts.token_program,
        amount as u64,
    )?;

    Ok(())
}

pub fn withdraw(ctx: Context<DepositWithdraw>, amount: u128) -> Result<()> {
    let token_owner_account = &ctx.accounts.token_owner_account;
    let rebate_manager = &mut ctx.accounts.rebate_manager;
    let token_vault = &ctx.accounts.token_vault;

    require!(
        token_vault.amount as u128 >= amount,
        ErrorCode::NotEnoughBalance
    );

    transfer_from_vault_to_owner(
        rebate_manager,
        token_vault,
        token_owner_account,
        &ctx.accounts.token_program,
        amount as u64,
    )?;

    Ok(())
}
