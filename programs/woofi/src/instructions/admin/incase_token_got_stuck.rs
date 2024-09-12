use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::util::*;

#[derive(Accounts)]
pub struct IncaseTokenGotStuck<'info> {
    pub wooconfig: Box<Account<'info, WooConfig>>,
    pub token_mint: Account<'info, Mint>,
    pub quote_token_mint: Account<'info, Mint>,

    pub authority: Signer<'info>,

    #[account(mut,
        constraint = to_token_account.mint == token_mint.key()
    )]
    to_token_account: Box<Account<'info, TokenAccount>>,

    #[account(mut,
        has_one = wooconfig,
        has_one = authority,
        has_one = token_mint,
        has_one = quote_token_mint,
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

pub fn incase_token_got_stuck_handler(
    ctx: Context<IncaseTokenGotStuck>,
    amount: u128,
) -> Result<()> {
    let to_token_account = &ctx.accounts.to_token_account;
    let token_vault = &ctx.accounts.token_vault;
    let woopool = &mut ctx.accounts.woopool;

    transfer_from_vault_to_owner(
        woopool,
        token_vault,
        to_token_account,
        &ctx.accounts.token_program,
        amount as u64,
    )?;

    Ok(())
}
