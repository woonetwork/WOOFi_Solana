use anchor_lang::prelude::*;

use crate::WooConfig;
use crate::Wooracle;
use crate::WooPool;

#[derive(Accounts)]
pub struct SetOnlyOwnerAuthorityConfig<'info> {
    #[account(mut,
        has_one = authority,
    )]
    pub wooconfig: Account<'info, WooConfig>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct SetOnlyOwnerAuthorityWooracle<'info> {
    #[account(mut,
        has_one = authority
    )]
    pub wooracle: Account<'info, Wooracle>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct SetOnlyOwnerAuthorityPool<'info> {
    #[account(mut,
        has_one = authority,
    )]
    pub woopool: Account<'info, WooPool>,

    pub authority: Signer<'info>,
}

pub fn set_wooconfig_authority(ctx: Context<SetOnlyOwnerAuthorityConfig>, new_authority: Pubkey) -> Result<()> {
    ctx.accounts.wooconfig.authority = new_authority;

    Ok(())
}

pub fn set_wooracle_authority(ctx: Context<SetOnlyOwnerAuthorityWooracle>, new_authority: Pubkey) -> Result<()> {
    ctx.accounts.wooracle.authority = new_authority;

    Ok(())
}

pub fn set_woopool_authority(ctx: Context<SetOnlyOwnerAuthorityPool>, new_authority: Pubkey) -> Result<()> {
    ctx.accounts.woopool.authority = new_authority;

    Ok(())
}
