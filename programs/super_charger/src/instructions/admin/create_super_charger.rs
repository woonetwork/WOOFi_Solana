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
          reserve_mint.key().as_ref()
        ],
        bump)]
    pub super_charger: Box<Account<'info, SuperCharger>>,

    #[account(
        mint::token_program = reserve_token_program,
    )]
    pub reserve_mint: Account<'info, Mint>,

    #[account(
        init,
        seeds = [
            SUPER_CHARGER_RESERVE_VAULT_SEED.as_bytes(),
            super_charger.key().as_ref(),
            reserve_mint.key().as_ref()
        ],
        bump,
        payer = authority,
        token::mint = reserve_mint,
        token::authority = super_charger,
        token::token_program = reserve_token_program
      )]
    pub reserve_vault: Box<Account<'info, TokenAccount>>,

    #[account(
        init,
        seeds = [
            SUPER_CHARGER_LP_MINT_SEED.as_bytes(),
            super_charger.key().as_ref(),
            reserve_mint.key().as_ref()
        ],
        bump,
        payer = authority,
        mint::decimals = 6,
        mint::authority = super_charger,
        mint::token_program = lp_token_program,
    )]
    pub lp_token_mint: Box<Account<'info, Mint>>,

    #[account(
        init,
        seeds = [
            SUPER_CHARGER_LP_VAULT_SEED.as_bytes(),
            super_charger.key().as_ref(),
            reserve_mint.key().as_ref()
        ],
        bump,
        payer = authority,
        token::mint = lp_token_mint,
        token::authority = super_charger,
        token::token_program = lp_token_program,
    )]
    pub lp_token_vault: Box<Account<'info, TokenAccount>>,

    pub reserve_token_program: Program<'info, Token>,
    pub lp_token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateSuperCharger>) -> Result<()> {
    let super_charger_config = ctx.accounts.super_charger_config.key();
    let authority = ctx.accounts.authority.key();
    let reserve_mint = ctx.accounts.reserve_mint.key();
    let reserve_decimals = ctx.accounts.reserve_mint.decimals;
    let reserve_vault = ctx.accounts.reserve_vault.key();
    let lp_token_mint = ctx.accounts.lp_token_mint.key();
    let lp_token_vault = ctx.accounts.lp_token_vault.key();
    let reserve_token_program = ctx.accounts.reserve_token_program.key();
    let lp_token_program = ctx.accounts.lp_token_program.key();

    let super_charger = &mut ctx.accounts.super_charger;
    let bump = ctx.bumps.super_charger;

    super_charger.initialize(
        bump,
        super_charger_config,
        authority,
        reserve_mint,
        reserve_decimals,
        reserve_vault,
        lp_token_mint,
        lp_token_vault,
        reserve_token_program,
        lp_token_program
    )
}
