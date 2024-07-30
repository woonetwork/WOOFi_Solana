use anchor_lang::prelude::*;

use crate::state::oracle::*;
use chainlink_solana as chainlink;

#[derive(Accounts)]
pub struct ReInitializeCLOracle<'info> {
    #[account(
        mut,
        constraint = chainlink_program.key() == *feed_account.to_account_info().owner,
        // constraint = cloracle.chainlink_feed == *feed_account.key,
        has_one = authority,
    )]
    cloracle: Account<'info, Oracle>,
    authority: Signer<'info>,
    /// CHECK: Todo
    feed_account: UncheckedAccount<'info>,
    /// CHECK: This is the Chainlink program library
    pub chainlink_program: AccountInfo<'info>,
}


pub fn handler(ctx: Context<ReInitializeCLOracle>, outer_preferred: bool) -> Result<()> {
    let timestamp = Clock::get()?.unix_timestamp;

    ctx.accounts.cloracle.feed_account = ctx.accounts.feed_account.key();
    ctx.accounts.cloracle.updated_at = timestamp;

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
    ctx.accounts.cloracle.outer_preferred = outer_preferred;

    Ok(())
}