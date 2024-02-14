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

use anchor_lang::prelude::*;
use chainlink_solana as chainlink;

mod constants;

use crate::{constants::*};

declare_id!("45LgxBpxsu7mRdn3GPLrUZM93LxvP3SpCZ1TufDdNr2u");

#[program]
pub mod woospmmtres {
    use super::*;

    pub fn create_oracle(ctx: Context<CreateOracle>) -> Result<()> {
        let timestamp = Clock::get()?.unix_timestamp;

        ctx.accounts.cloracle.authority = ctx.accounts.admin.key();
        ctx.accounts.cloracle.chainlink_feed = ctx.accounts.feed_account.key();
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

        Ok(())
    }

    pub fn update_cloracle(ctx: Context<UpdateCLOracle>) -> Result<()> {
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
}

#[derive(Accounts)]
pub struct CreateOracle<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + 32 + 32 + 8 + 1 + 16 + 1,
        seeds = [
            CLORACLE_SEED.as_bytes(),
            chainlink_program.key().as_ref(),
            feed_account.key().as_ref(),
            ],
        bump,
        constraint = chainlink_program.key() == *feed_account.to_account_info().owner
    )]
    cloracle: Account<'info, CLOracle>,
    #[account(
        init,
        payer = admin,
        space = 8 + 32 + 8 + 16 + 8 + 16 + 8 + 8,
        seeds = [
            WOORACLE_SEED.as_bytes(),
            chainlink_program.key().as_ref(),
            feed_account.key().as_ref(),
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

#[derive(Accounts)]
pub struct UpdateCLOracle<'info> {
    #[account(
        mut,
        constraint = chainlink_program.key() == *feed_account.to_account_info().owner,
        constraint = cloracle.chainlink_feed == *feed_account.key,
        has_one = authority,
    )]
    cloracle: Account<'info, CLOracle>,
    #[account(mut)]
    authority: Signer<'info>,
    /// CHECK: Todo
    feed_account: UncheckedAccount<'info>,
    /// CHECK: This is the Chainlink program library
    pub chainlink_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct UpdateWOOracle<'info> {
    #[account(
        mut,
        has_one = authority,
    )]
    wooracle: Account<'info, WOOracle>,
    #[account(mut)]
    authority: Signer<'info>,
}

#[account]
pub struct CLOracle {
    authority: Pubkey,      // 32
    chainlink_feed: Pubkey, // 32
    updated_at: i64,        // 8
    decimals: u8,           // 1
    round: i128,            // 16
    clo_preferred: bool,    // 1
}

#[account]
pub struct WOOracle {
    authority: Pubkey,      // 32
    updated_at: i64,        // 8
    stale_duration: u128,   // 16
    bound: u64,             // 8
    price: u128,            // 16 as chainlink oracle (e.g. decimal = 8)
    coeff: u64,             // 8 k: decimal = 18.    18.4 * 1e18
    spread: u64,            // 8 s: decimal = 18.   spread <= 2e18   18.4 * 1e18
}

