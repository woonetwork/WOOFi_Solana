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
use anchor_spl::token::Mint;

use crate::constants::*;

use pyth_solana_receiver_sdk::price_update::PriceUpdateV2;

#[derive(Accounts)]
pub struct CreateConfig<'info> {
    #[account(
        init,
        payer = admin,
        space = WooConfig::LEN,
        seeds = [
            WOOCONFIG_SEED.as_bytes(),
            quote_token_mint.key().as_ref()
            ],
        bump,
    )]
    wooconfig: Account<'info, WooConfig>,
    #[account(mut)]
    admin: Signer<'info>,
    system_program: Program<'info, System>,

    quote_token_mint: Account<'info, Mint>,
    /// CHECK: This is the Quote token's pyth feed account
    quote_feed_account: AccountInfo<'info>,
    // Add this account to any instruction Context that needs price data.
    // Warning:
    // users must ensure that the account passed to their instruction is owned by the Pyth pull oracle program.
    // Using Anchor with the Account<'info, PriceUpdateV2> type will automatically perform this check.
    // However, if you are not using Anchor, it is your responsibility to perform this check.
    quote_price_update: Account<'info, PriceUpdateV2>,
}

pub fn handler(
    ctx: Context<CreateConfig>,
    admin_authority: Pubkey,
    fee_authority: Pubkey,
) -> Result<()> {
    let authority = ctx.accounts.admin.key();
    let quote_token_mint = ctx.accounts.quote_token_mint.key();
    let quote_feed_account = ctx.accounts.quote_feed_account.key();
    let quote_price_update = ctx.accounts.quote_price_update.key();
    let quote_decimals = ctx.accounts.quote_token_mint.decimals;

    let wooconfig = &mut ctx.accounts.wooconfig;
    let _ = wooconfig.initialize(
        authority,
        admin_authority,
        fee_authority,
        quote_token_mint,
        quote_feed_account,
        quote_price_update,
        // will have quote token vault when init quote pool
        // quote_token_vault,
        quote_decimals,
    );

    Ok(())
}
