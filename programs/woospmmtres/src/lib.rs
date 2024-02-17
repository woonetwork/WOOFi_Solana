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
mod state;
mod instructions;
mod constants;

use anchor_lang::prelude::*;
use chainlink_solana as chainlink;

use crate::{constants::*, state::*, instructions::*, };

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

        // Default set prefer clo to true
        ctx.accounts.cloracle.clo_preferred = true;

        // TODO: set bound and stale duration

        Ok(())
    }

    pub fn set_stale_duration(ctx: Context<SetStaleDuration>, stale_duration: u128) -> Result<()> {
        return instructions::set_stale_duration::handler(ctx, stale_duration);
    }

    pub fn set_bound(ctx: Context<SetBound>, bound: u64) -> Result<()> {
        return instructions::set_bound::handler(ctx, bound);
    }

    pub fn set_price(ctx: Context<SetPrice>, price: u128) -> Result<()> {
        return instructions::set_price::handler(ctx, price);
    }

    pub fn set_coeff(ctx: Context<SetCoeff>, coeff: u64) -> Result<()> {
        return instructions::set_coeff::handler(ctx, coeff);
    }

    pub fn set_spread(ctx: Context<SetSpread>, spread: u64) -> Result<()> {
        return instructions::set_spread::handler(ctx, spread);
    }

    pub fn set_clo_preferred(ctx: Context<SetCloPreferred>, clo_preferred: bool) -> Result<()> {
        return instructions::set_clo_preferred::handler(ctx, clo_preferred);
    }

    pub fn set_state(ctx: Context<SetWooState>, price: u128, coeff: u64, spread: u64) -> Result<()> {
        return instructions::set_woo_state::handler(ctx, price, coeff, spread);
    }

    pub fn re_initialize_cloracle(ctx: Context<ReInitializeCLOracle>, clo_preferred: bool) -> Result<()> {
        let timestamp = Clock::get()?.unix_timestamp;

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
        ctx.accounts.cloracle.clo_preferred = clo_preferred;

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
        space = CLOracle::LEN,
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
        space = WOOracle::LEN,
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
pub struct ReInitializeCLOracle<'info> {
    #[account(
        mut,
        constraint = chainlink_program.key() == *feed_account.to_account_info().owner,
        // constraint = cloracle.chainlink_feed == *feed_account.key,
        has_one = authority,
    )]
    cloracle: Account<'info, CLOracle>,
    authority: Signer<'info>,
    /// CHECK: Todo
    feed_account: UncheckedAccount<'info>,
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
    authority: Signer<'info>,
    /// CHECK: Todo
    feed_account: UncheckedAccount<'info>,
    /// CHECK: This is the Chainlink program library
    pub chainlink_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct GetPrice<'info> {
    #[account(
        has_one = authority,
    )]
    cloracle: Account<'info, CLOracle>,
    #[account(
        has_one = authority,
    )]
    wooracle: Account<'info, WOOracle>,
    authority: Signer<'info>,
}