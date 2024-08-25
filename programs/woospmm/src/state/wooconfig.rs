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

#[account]
pub struct WooConfig {
    pub authority: Pubkey, // 32

    pub admin_authority: Pubkey, // 32

    pub fee_authority: Pubkey, // 32

    pub quote_token_mint: Pubkey, // 32

    pub quote_feed_account: Pubkey, // 32

    pub quote_price_update: Pubkey, // 32

    pub quote_token_vault: Pubkey, // 32

    pub quote_decimals: u8, // 1
}

impl WooConfig {
    pub const LEN: usize = 8 + (32 + 32 + 32 + 32 + 32 + 32 + 32 + 1);

    pub fn initialize(
        &mut self,
        authority: Pubkey,
        admin_authority: Pubkey,
        fee_authority: Pubkey,
        quote_token_mint: Pubkey,
        quote_feed_account: Pubkey,
        quote_price_update: Pubkey,
        // quote_token_vault: Pubkey,
        quote_decimals: u8,
    ) -> Result<()> {
        self.authority = authority;
        self.admin_authority = admin_authority;
        self.fee_authority = fee_authority;
        self.quote_token_mint = quote_token_mint;
        self.quote_feed_account = quote_feed_account;
        self.quote_price_update = quote_price_update;
        // self.quote_token_vault = quote_token_vault;
        self.quote_decimals = quote_decimals;

        Ok(())
    }

    pub fn update_admin_authority(&mut self, admin_authority: Pubkey) -> Result<()> {
        self.admin_authority = admin_authority;

        Ok(())
    }

    pub fn update_fee_authority(&mut self, fee_authority: Pubkey) -> Result<()> {
        self.fee_authority = fee_authority;

        Ok(())
    }
}
