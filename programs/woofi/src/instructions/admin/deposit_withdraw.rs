use crate::{events::DepositEvent, events::WithdrawEvent, state::*};
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::{errors::ErrorCode, util::*};

#[derive(Accounts)]
pub struct Deposit<'info> {
    pub wooconfig: Box<Account<'info, WooConfig>>,
    pub token_mint: Account<'info, Mint>,

    pub authority: Signer<'info>,

    #[account(mut,
        constraint = token_owner_account.owner == authority.key(),
        constraint = token_owner_account.mint == token_mint.key()
    )]
    token_owner_account: Box<Account<'info, TokenAccount>>,

    #[account(mut,
        has_one = wooconfig,
        constraint = woopool.authority == authority.key()
                  || wooconfig.woopool_admin_authority.contains(authority.key),
        constraint = woopool.token_mint == token_mint.key()
    )]
    pub woopool: Box<Account<'info, WooPool>>,

    #[account(mut,
        address = woopool.token_vault,
        constraint = token_vault.mint == token_mint.key()
      )]
    pub token_vault: Box<Account<'info, TokenAccount>>,

    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(
        has_one = authority
    )]
    pub wooconfig: Box<Account<'info, WooConfig>>,
    pub token_mint: Account<'info, Mint>,

    pub authority: Signer<'info>,

    #[account(mut,
        constraint = token_owner_account.owner == authority.key(),
        constraint = token_owner_account.mint == token_mint.key()
    )]
    token_owner_account: Box<Account<'info, TokenAccount>>,

    #[account(mut,
        has_one = wooconfig,
        has_one = authority,
        constraint = woopool.token_mint == token_mint.key()
    )]
    pub woopool: Box<Account<'info, WooPool>>,

    #[account(mut,
        address = woopool.token_vault,
        constraint = token_vault.mint == token_mint.key()
      )]
    pub token_vault: Box<Account<'info, TokenAccount>>,

    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
}

pub fn deposit(ctx: Context<Deposit>, amount: u128) -> Result<()> {
    let token_owner_account = &ctx.accounts.token_owner_account;
    let token_vault = &ctx.accounts.token_vault;
    let woopool = &mut ctx.accounts.woopool;

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

    emit!(DepositEvent {
        authority: ctx.accounts.authority.key(),
        token_mint: woopool.token_mint,
        deposit_amount: amount,
    });

    Ok(())
}

pub fn withdraw(ctx: Context<Withdraw>, amount: u128) -> Result<()> {
    let token_owner_account = &ctx.accounts.token_owner_account;
    let token_vault = &ctx.accounts.token_vault;
    let woopool = &mut ctx.accounts.woopool;

    require!(
        token_vault.amount as u128 >= amount,
        ErrorCode::NotEnoughBalance
    );

    transfer_from_vault_to_owner(
        woopool,
        token_vault,
        token_owner_account,
        &ctx.accounts.token_program,
        amount as u64,
    )?;

    emit!(WithdrawEvent {
        authority: ctx.accounts.authority.key(),
        token_mint: woopool.token_mint,
        withdraw_amount: amount,
    });

    Ok(())
}
