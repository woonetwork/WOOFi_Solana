use anchor_lang::prelude::*;

use crate::state::woopool::*;

#[derive(Accounts)]
pub struct SetPoolState<'info> {
    #[account(mut,
        constraint =
            woopool.authority == authority.key() ||
            woopool.admin_authority == authority.key()
    )]
    pub woopool: Account<'info, WooPool>,

    pub authority: Signer<'info>,
}

pub fn set_fee_rate_handler(ctx: Context<SetPoolState>, fee_rate: u16) -> Result<()> {
    ctx.accounts.woopool.set_fee_rate(fee_rate)
}

pub fn set_max_notional_swap_handler(
    ctx: Context<SetPoolState>,
    max_notional_swap: u128,
) -> Result<()> {
    ctx.accounts
        .woopool
        .set_max_notional_swap(max_notional_swap)
}

pub fn set_max_gamma_handler(ctx: Context<SetPoolState>, max_gamma: u128) -> Result<()> {
    ctx.accounts.woopool.set_max_gamma(max_gamma)
}
