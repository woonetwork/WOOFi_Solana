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

use crate::{constants::*, errors::ErrorCode};
use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct RebatePool {
    pub paused: bool, // 1

    pub authority: Pubkey, // 32

    pub rebate_authority: Pubkey, // 32

    pub quote_token_mint: Pubkey, // 32

    pub woopool_quote: Pubkey, // 32

    pub woopool_vault: Pubkey, // 32

    // pending rebate
    pub pending_rebate: u128, // 16
}

impl RebatePool {
    pub const LEN: usize = 8 + (1 + 32 + 32 + 32 + 32 + 32 + 16);

    pub fn seeds(&self) -> [&[u8]; 4] {
        [
            REBATEPOOL_SEED.as_bytes(),
            self.rebate_authority.as_ref(),
            self.woopool_quote.as_ref(),
            self.quote_token_mint.as_ref(),
        ]
    }

    pub fn initialize(
        &mut self,
        authority: Pubkey,
        rebate_authority: Pubkey,
        quote_token_mint: Pubkey,
        woopool_quote: Pubkey,
        woopool_vault: Pubkey,
    ) -> Result<()> {
        self.authority = authority;
        self.rebate_authority = rebate_authority;

        self.quote_token_mint = quote_token_mint;
        self.woopool_quote = woopool_quote;
        self.woopool_vault = woopool_vault;

        self.paused = false;
        self.pending_rebate = 0;

        Ok(())
    }

    pub fn set_paused(&mut self, paused: bool) -> Result<()> {
        self.paused = paused;

        Ok(())
    }

    pub fn add_pending_rebate(&mut self, fee: u128) -> Result<()> {
        self.pending_rebate = self
            .pending_rebate
            .checked_add(fee)
            .ok_or(ErrorCode::RebateFeeMaxExceeded)?;

        Ok(())
    }

    pub fn sub_pending_rebate(&mut self, fee: u128) -> Result<()> {
        if fee > self.pending_rebate {
            return Err(ErrorCode::RebateFeeNotEnough.into());
        }

        self.pending_rebate = self
            .pending_rebate
            .checked_sub(fee)
            .ok_or(ErrorCode::RebateFeeNotEnough)?;

        Ok(())
    }

    pub fn clear_pending_rebate(&mut self) -> Result<()> {
        self.pending_rebate = 0;

        Ok(())
    }
}
