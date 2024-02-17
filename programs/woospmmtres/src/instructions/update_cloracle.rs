use anchor_lang::prelude::*;

use crate::state::cloracle::*;
use chainlink_solana as chainlink;

#[derive(Accounts)]
pub struct UpdateCLOracle<'info> {
    #[account(
        mut,
        constraint = chainlink_program.key() == *feed_account.to_account_info().owner,
        constraint = cloracle.chainlink_feed == *feed_account.key,
        has_one = authority,
    )]
    cloracle: Account<'info, CLOracle>,
    authority: Signer<'info>,
    /// CHECK: Todo
    feed_account: UncheckedAccount<'info>,
    /// CHECK: This is the Chainlink program library
    pub chainlink_program: AccountInfo<'info>,
}

pub fn handler(ctx: Context<UpdateCLOracle>) -> Result<()> {
    let timestamp = Clock::get()?.unix_timestamp;

    // get decimal value from chainlink program
    let decimals = chainlink::decimals(
        ctx.accounts.chainlink_program.to_account_info(),
        ctx.accounts.feed_account.to_account_info(),
    )?;
    // get round value from chainlink program
    let round = chainlink::latest_round_data(
        ctx.accounts.chainlink_program.to_account_info(),
        ctx.accounts.feed_account.to_account_info(),
    )?;

    ctx.accounts.cloracle.decimals = decimals;
    ctx.accounts.cloracle.round = round.answer;
    ctx.accounts.cloracle.updated_at = timestamp;

    Ok(())
}