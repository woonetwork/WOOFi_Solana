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
pub struct RebatePool {
    pub authority: Pubkey, // 32

    pub rebate_authority: Pubkey, // 32

    pub woopool_quote: Pubkey, // 32

    // unit: 0.1 bps (1e6 = 100%, 25 = 2.5 bps)
    // decimal = 5; 1 in 100_000; 10 = 1bp = 0.01%; max = 65535
    // Max fee rate supported is u16::MAX around 65.5%.
    pub rebate_rate: u16, // 2

    // rebate reserve
    pub rebate_reserve: u128, // 16

    pub token_mint: Pubkey, // 32

    pub token_vault: Pubkey, // 32

    /// Number of base 10 digits to the right of the decimal place.
    pub base_decimals: u8, // 1

    pub enabled: bool, // 1
}

impl RebatePool {
    pub const LEN: usize = 8 + (32 + 32 + 32 + 2 + 16 + 32 + 32 + 1 + 1);

    pub fn seeds(&self) -> [&[u8]; 4] {
        [
            REBATEPOOL_SEED.as_bytes(),
            self.rebate_authority.as_ref(),
            self.woopool_quote.as_ref(),
            self.token_mint.as_ref(),
        ]
    }

    pub fn initialize(
        &mut self,
        authority: Pubkey,
        rebate_authority: Pubkey,
        woopool_quote: Pubkey,
        token_mint: Pubkey,
        token_vault: Pubkey,
        base_decimals: u8,
    ) -> Result<()> {
        self.authority = authority;
        self.rebate_authority = rebate_authority;

        self.woopool_quote = woopool_quote;

        self.rebate_rate = 0;
        self.rebate_reserve = 0;

        self.token_mint = token_mint;
        self.token_vault = token_vault;

        self.base_decimals = base_decimals;

        self.enabled = true;

        Ok(())
    }

    pub fn set_rebate_rate(&mut self, rebate_rate: u16) -> Result<()> {
        if rebate_rate > MAX_FEE_RATE {
            return Err(ErrorCode::FeeRateMaxExceeded.into());
        }
        self.rebate_rate = rebate_rate;

        Ok(())
    }

    pub fn set_enabled(&mut self, enabled: bool) -> Result<()> {
        self.enabled = enabled;

        Ok(())
    }

    pub fn add_rebate_fee(&mut self, fee: u128) -> Result<()> {
        self.rebate_reserve = self
            .rebate_reserve
            .checked_add(fee)
            .ok_or(ErrorCode::RebateFeeMaxExceeded)?;

        Ok(())
    }

    pub fn sub_rebate_fee(&mut self, fee: u128) -> Result<()> {
        if fee > self.rebate_reserve {
            return Err(ErrorCode::RebateFeeNotEnough.into());
        }

        self.rebate_reserve = self
            .rebate_reserve
            .checked_sub(fee)
            .ok_or(ErrorCode::RebateFeeNotEnough)?;

        Ok(())
    }
}
