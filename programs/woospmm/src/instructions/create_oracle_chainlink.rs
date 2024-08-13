/*

░██╗░░░░░░░██╗░█████╗░░█████╗░░░░░░░███████╗██╗
░██║░░██╗░░██║██╔══██╗██╔══██╗░░░░░░██╔════╝██║
░╚██╗████╗██╔╝██║░░██║██║░░██║█████╗█████╗░░██║
░░████╔═████║░██║░░██║██║░░██║╚════╝██╔══╝░░██║
░░╚██╔╝░╚██╔╝░╚█████╔╝╚█████╔╝░░░░░░██║░░░░░██║
░░░╚═╝░░░╚═╝░░░╚════╝░░╚════╝░░░░░░░╚═╝░░░░░╚═╝

*
* MIT License
* ===========
*
* Copyright (c) 2020 WooTrade
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

use crate::state::*;
use anchor_lang::prelude::*;

use crate::constants::*;

use chainlink_solana as chainlink;

#[derive(Accounts)]
pub struct CreateOracleChainlink<'info> {
    #[account(
        init,
        payer = admin,
        space = Oracle::LEN,
        seeds = [
            CLORACLE_SEED.as_bytes(),
            feed_account.key().as_ref(),
            chainlink_program.key().as_ref(),
            ],
        bump,
        constraint = chainlink_program.key() == *feed_account.to_account_info().owner
    )]
    cloracle: Account<'info, Oracle>,
    #[account(
        init,
        payer = admin,
        space = WOOracle::LEN,
        seeds = [
            WOORACLE_SEED.as_bytes(),
            feed_account.key().as_ref(),
            chainlink_program.key().as_ref(),
            ],
        bump,
    )]
    wooracle: Account<'info, WOOracle>,
    #[account(mut)]
    admin: Signer<'info>,
    system_program: Program<'info, System>,
    /// CHECK: This is the Chainlink feed account
    feed_account: AccountInfo<'info>,
    /// CHECK: This is the Chainlink program library
    pub chainlink_program: AccountInfo<'info>,
}

pub fn handler(ctx: Context<CreateOracleChainlink>) -> Result<()> {
  let timestamp = Clock::get()?.unix_timestamp;

  ctx.accounts.cloracle.oracle_type = OracleType::ChainLink;
  ctx.accounts.cloracle.authority = ctx.accounts.admin.key();
  ctx.accounts.cloracle.feed_account = ctx.accounts.feed_account.key();
  ctx.accounts.cloracle.price_update = ctx.accounts.chainlink_program.key();
  ctx.accounts.cloracle.updated_at = timestamp;
  // maximum_age used for pythoracle, set to 0 here
  ctx.accounts.cloracle.maximum_age = 0;

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

  // Default set prefer clo to true
  ctx.accounts.cloracle.outer_preferred = true;

  ctx.accounts.wooracle.authority = ctx.accounts.admin.key();
  ctx.accounts.wooracle.oracle = ctx.accounts.cloracle.key();
  ctx.accounts.wooracle.stale_duration = DEFAULT_STALE_DURATION;
  // set default bound to 1e16 means 1%
  ctx.accounts.wooracle.bound = DEFAULT_BOUND;

  Ok(())
}