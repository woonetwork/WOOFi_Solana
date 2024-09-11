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

pub const ADMIN_AUTH_MAX_LEN: usize = 5;

#[account]
#[derive(InitSpace)]
pub struct RebatePool {
    pub authority: Pubkey, // 32

    #[max_len(ADMIN_AUTH_MAX_LEN)]
    pub admin_authority: Vec<Pubkey>,

    pub rebate_authority: Pubkey, // 32

    pub quote_token_mint: Pubkey, // 32

    pub token_vault: Pubkey, // 32

    // pending rebate
    pub pending_rebate: u128, // 16
}

impl RebatePool {
    pub const LEN: usize = 8 + (32 + 32 + 32 + 32 + 32 + 16);

    pub fn seeds(&self) -> [&[u8]; 3] {
        [
            REBATEPOOL_SEED.as_bytes(),
            self.rebate_authority.as_ref(),
            self.quote_token_mint.as_ref(),
        ]
    }

    pub fn initialize(
        &mut self,
        authority: Pubkey,
        rebate_authority: Pubkey,
        quote_token_mint: Pubkey,
        token_vault: Pubkey,
    ) -> Result<()> {
        self.authority = authority;
        self.rebate_authority = rebate_authority;
        self.quote_token_mint = quote_token_mint;
        self.token_vault = token_vault;
        self.pending_rebate = 0;

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
