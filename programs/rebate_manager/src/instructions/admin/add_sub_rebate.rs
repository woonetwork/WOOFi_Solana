use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token};

#[derive(Accounts)]
pub struct AddSubRebate<'info> {
    pub quote_token_mint: Account<'info, Mint>,

    pub authority: Signer<'info>,

    /// CHECK, rebate authority is third party account, can be anyone
    pub rebate_authority: UncheckedAccount<'info>,

    #[account(
        constraint = rebate_manager.authority == authority.key()
                  || rebate_manager.admin_authority.contains(authority.key),
        constraint = rebate_manager.quote_token_mint == quote_token_mint.key()
    )]
    pub rebate_manager: Box<Account<'info, RebateManager>>,

    #[account(mut,
        has_one = rebate_manager,
        has_one = rebate_authority,
    )]
    pub rebate_info: Account<'info, RebateInfo>,

    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
}

pub fn add_rebate(ctx: Context<AddSubRebate>, amount: u128) -> Result<()> {
    let rebate_info = &mut ctx.accounts.rebate_info;

    rebate_info.add_pending_rebate(amount)
}

pub fn sub_rebate(ctx: Context<AddSubRebate>, amount: u128) -> Result<()> {
    let rebate_info = &mut ctx.accounts.rebate_info;

    rebate_info.sub_pending_rebate(amount)
}