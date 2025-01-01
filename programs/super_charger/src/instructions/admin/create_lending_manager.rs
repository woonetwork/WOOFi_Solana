use crate::state::*;
use crate::errors::ErrorCode;
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::constants::*;

#[derive(Accounts)]
pub struct CreateLendingManager<'info> {
    pub super_charger_config: Box<Account<'info, SuperChargerConfig>>,

    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = 8 + LendingManager::INIT_SPACE,
        constraint = super_charger_config.authority == authority.key(),
        seeds = [
          LENDING_MANAGER_SEED.as_bytes(),
          super_charger_config.key().as_ref(),
          stake_token_mint.key().as_ref(),
          super_charger.key().as_ref(),
        ],
        bump)]
    pub lending_manager: Box<Account<'info, LendingManager>>,

    #[account(mut,
        has_one = stake_vault,
        has_one = stake_token_mint,
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
    pub stake_vault: Box<Account<'info, TokenAccount>>,

    #[account(
        constraint = stake_token_mint.key() == super_charger.stake_token_mint @ ErrorCode::StakeTokenMintMissmatch,
        mint::token_program = stake_token_program,
    )]
    pub stake_token_mint: Box<Account<'info, Mint>>,

    pub stake_token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateLendingManager>) -> Result<()> {
    let super_charger_config = ctx.accounts.super_charger_config.key();
    let authority = ctx.accounts.authority.key();
    let super_charger = ctx.accounts.super_charger.key();
    let stake_token_mint = ctx.accounts.stake_token_mint.key();
    let stake_token_decimals = ctx.accounts.stake_token_mint.decimals;
    let stake_vault = ctx.accounts.stake_vault.key();
    let stake_token_program = ctx.accounts.stake_token_program.key();

    let lending_manager = &mut ctx.accounts.lending_manager;
    let bump = ctx.bumps.lending_manager;

    lending_manager.initialize(
        bump,
        super_charger_config,
        authority,
        super_charger,
        stake_token_mint,
        stake_token_decimals,
        stake_vault,
        stake_token_program,
    )
}
