use anchor_lang::prelude::*;

use crate::errors::ErrorCode;
use crate::WooConfig;
use crate::Wooracle;
use crate::WooPool;

#[derive(Accounts)]
pub struct SetOnlyOnwerNewAuthority<'info> {
    pub authority: Signer<'info>,

    #[account(mut, has_one = authority @ ErrorCode::InvalidAuthority)]
    pub wooconfig: Account<'info, WooConfig>,

    /// CHECK: nothing to check here, its just the new authority address
    pub new_authority: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct ClaimAuthorityConfig<'info> {
    pub new_authority: Signer<'info>,

    #[account(mut, has_one = new_authority @ ErrorCode::InvalidAuthority)]
    pub wooconfig: Account<'info, WooConfig>,
}

#[derive(Accounts)]
pub struct ClaimAuthorityWooracle<'info> {
    pub new_authority: Signer<'info>,

    #[account(
        has_one = new_authority @ ErrorCode::InvalidAuthority)]
    pub wooconfig: Account<'info, WooConfig>,

    #[account(mut,
        has_one = wooconfig
    )]
    pub wooracle: Account<'info, Wooracle>,
}

#[derive(Accounts)]
pub struct ClaimAuthorityWoopool<'info> {
    pub new_authority: Signer<'info>,

    #[account(
        has_one = new_authority @ ErrorCode::InvalidAuthority)]
    pub wooconfig: Account<'info, WooConfig>,

    #[account(mut,
        has_one = wooconfig
    )]
    pub woopool: Account<'info, WooPool>,
}

pub fn set_wooconfig_new_authority_handler(ctx: Context<SetOnlyOnwerNewAuthority>) -> Result<()> {
    ctx.accounts.wooconfig.new_authority = ctx.accounts.new_authority.key();

    Ok(())
}

pub fn claim_wooconfig_authority_handler(ctx: Context<ClaimAuthorityConfig>) -> Result<()> {
    ctx.accounts.wooconfig.authority = ctx.accounts.new_authority.key();

    Ok(())
}

pub fn claim_wooracle_authority_handler(ctx: Context<ClaimAuthorityWooracle>) -> Result<()> {
    ctx.accounts.wooracle.authority = ctx.accounts.new_authority.key();

    Ok(())
}

pub fn claim_woopool_authority_handler(ctx: Context<ClaimAuthorityWoopool>) -> Result<()> {
    ctx.accounts.woopool.authority = ctx.accounts.new_authority.key();

    Ok(())
}
