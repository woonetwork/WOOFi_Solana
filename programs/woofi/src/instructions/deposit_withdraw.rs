use crate::{events::DepositEvent, events::WithdrawEvent, state::*};
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::{constants::*, errors::ErrorCode, util::*};

#[derive(Accounts)]
pub struct Deposit_Withdraw<'info> {
    pub token_mint: Account<'info, Mint>,
    pub quote_token_mint: Account<'info, Mint>,

    pub authority: Signer<'info>,

    #[account(mut,
        constraint = token_owner_account.owner == authority.key(),
        constraint = token_owner_account.mint == token_mint.key()
    )]
    token_owner_account: Box<Account<'info, TokenAccount>>,

    #[account(mut,
        constraint = !woopool.paused,
        seeds = [
          WOOPOOL_SEED.as_bytes(),
          token_mint.key().as_ref(),
          quote_token_mint.key().as_ref()
        ],
        bump,
        constraint = woopool.authority == authority.key()
                  || woopool.fee_authority == authority.key(),
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

pub fn deposit(ctx: Context<Deposit_Withdraw>, amount: u128) -> Result<()> {
    let token_owner_account = &ctx.accounts.token_owner_account;
    let token_vault = &ctx.accounts.token_vault;
    let woopool = &mut ctx.accounts.woopool;

    let _balance_before = balance(woopool, token_vault)?;

    require!(
        token_owner_account.amount as u128 >= amount,
        ErrorCode::NotEnoughBalance
    );

    woopool.reserve += amount;

    transfer_from_owner_to_vault(
        &ctx.accounts.authority,
        token_owner_account,
        token_vault,
        &ctx.accounts.token_program,
        amount as u64,
    )?;

    // TODO Prince: currently we cannot get result from above CPI, so we cannot check
    // the transfer result in the same call
    // let balance_after = balance(woopool, token_vault)?;
    // let amount_received = balance_after - balance_before;
    // require!(amount_received >= amount, ErrorCode::ReserveLessThanFee);

    emit!(DepositEvent {
        authority: ctx.accounts.authority.key(),
        token_mint: woopool.token_mint,
        deposit_amount: amount,
    });

    Ok(())
}

pub fn withdraw(ctx: Context<Deposit_Withdraw>, amount: u128) -> Result<()> {
    let token_owner_account = &ctx.accounts.token_owner_account;
    let token_vault = &ctx.accounts.token_vault;
    let woopool = &mut ctx.accounts.woopool;

    let _balance_before = balance(woopool, token_vault)?;

    require!(
        woopool.reserve >= amount && token_vault.amount as u128 >= amount,
        ErrorCode::NotEnoughBalance
    );

    woopool
        .reserve
        .checked_sub(amount)
        .ok_or(ErrorCode::NotEnoughBalance)?;

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
