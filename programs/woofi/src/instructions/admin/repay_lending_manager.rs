use crate::{events::RepayEvent, state::*};
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};

use crate::{errors::ErrorCode, util::*};

#[derive(Accounts)]
pub struct Repay<'info> {
    #[account(
        constraint = wooconfig.lending_manager_authority.contains(authority.key)
    )]
    pub wooconfig: Box<Account<'info, WooConfig>>,

    pub authority: Signer<'info>,

    #[account(mut,
        has_one = wooconfig,
    )]
    pub woopool: Box<Account<'info, WooPool>>,

    #[account(mut,
        address = woopool.token_vault,
      )]
    pub token_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut,
        constraint = super_charger_vault.mint == woopool.token_mint
    )]
    pub super_charger_vault: Box<Account<'info, TokenAccount>>,

    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
}

pub fn repay(ctx: Context<Repay>, amount: u128) -> Result<()> {
    let token_vault = &ctx.accounts.token_vault;
    let woopool = &mut ctx.accounts.woopool;

    require!(
        token_vault.amount as u128 >= amount,
        ErrorCode::NotEnoughBalance
    );

    transfer_from_vault_to_owner(
        woopool,
        token_vault,
        &ctx.accounts.super_charger_vault,
        &ctx.accounts.token_program,
        amount as u64,
    )?;

    emit!(RepayEvent {
        authority: ctx.accounts.authority.key(),
        token_mint: woopool.token_mint,
        repay_amount: amount,
    });

    Ok(())
}
