use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::constants::*;

#[derive(Accounts)]
pub struct CreateSuperCharger<'info> {
    pub super_charger_config: Box<Account<'info, SuperChargerConfig>>,

    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = 8 + SuperCharger::INIT_SPACE,
        constraint = super_charger_config.authority == authority.key(),
        seeds = [
          SUPER_CHARGER_SEED.as_bytes(),
          super_charger_config.key().as_ref(),
          stake_token_mint.key().as_ref()
        ],
        bump)]
    pub super_charger: Box<Account<'info, SuperCharger>>,

    #[account(
        init,
        payer = authority,
        space = 8 + LendingManager::INIT_SPACE,
        constraint = super_charger_config.authority == authority.key(),
        seeds = [
          LENDING_MANAGER_SEED.as_bytes(),
          super_charger_config.key().as_ref(),
          stake_token_mint.key().as_ref(),
        ],
        bump)]
    pub lending_manager: Box<Account<'info, LendingManager>>,

    #[account(
        mint::token_program = stake_token_program,
    )]
    pub stake_token_mint: Account<'info, Mint>,

    #[account(
        init,
        seeds = [
            SUPER_CHARGER_STAKE_VAULT_SEED.as_bytes(),
            super_charger.key().as_ref(),
            stake_token_mint.key().as_ref()
        ],
        bump,
        payer = authority,
        token::mint = stake_token_mint,
        token::authority = super_charger,
        token::token_program = stake_token_program
      )]
    pub stake_vault: Box<Account<'info, TokenAccount>>,

    #[account(
        init,
        seeds = [
            SUPER_CHARGER_WE_MINT_SEED.as_bytes(),
            super_charger.key().as_ref(),
            stake_token_mint.key().as_ref()
        ],
        bump,
        payer = authority,
        mint::decimals = 9,
        mint::authority = super_charger,
        mint::token_program = we_token_program,
    )]
    pub we_token_mint: Box<Account<'info, Mint>>,

    #[account(
        init,
        seeds = [
            SUPER_CHARGER_WE_VAULT_SEED.as_bytes(),
            super_charger.key().as_ref(),
            stake_token_mint.key().as_ref()
        ],
        bump,
        payer = authority,
        token::mint = we_token_mint,
        token::authority = super_charger,
        token::token_program = we_token_program,
    )]
    pub we_token_vault: Box<Account<'info, TokenAccount>>,

    pub stake_token_program: Program<'info, Token>,
    pub we_token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateSuperCharger>) -> Result<()> {
    let super_charger_config = ctx.accounts.super_charger_config.key();
    let authority = ctx.accounts.authority.key();
    let stake_token_mint = ctx.accounts.stake_token_mint.key();
    let stake_token_decimals = ctx.accounts.stake_token_mint.decimals;
    let stake_vault = ctx.accounts.stake_vault.key();
    let we_token_mint = ctx.accounts.we_token_mint.key();
    let we_token_vault = ctx.accounts.we_token_vault.key();
    let stake_token_program = ctx.accounts.stake_token_program.key();
    let we_token_program = ctx.accounts.we_token_program.key();

    let lending_manager = &mut ctx.accounts.lending_manager;
    let lending_manager_bump = ctx.bumps.lending_manager;
    let super_charger = &mut ctx.accounts.super_charger;
    let super_charger_bump = ctx.bumps.super_charger;

    super_charger.initialize(
        super_charger_bump,
        super_charger_config,
        authority,
        lending_manager.key(),
        stake_token_mint,
        stake_token_decimals,
        stake_vault,
        we_token_mint,
        we_token_vault,
        stake_token_program,
        we_token_program
    )?;

    lending_manager.initialize(
        lending_manager_bump, 
        super_charger_config, 
        authority, 
        super_charger.key(), 
        stake_token_mint, 
        stake_token_decimals, 
        stake_vault, 
        stake_token_program
    )?;

    Ok(())
}
