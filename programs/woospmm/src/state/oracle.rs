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

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, Debug)]
#[repr(u8)]
pub enum OracleType {
    Pyth = 0,
    ChainLink = 1,
}

impl OracleType {
    pub fn is_pyth(&self) -> bool {
        matches!(self, OracleType::Pyth)
    }
}

#[account]
pub struct Oracle {
    pub authority: Pubkey,      // 32
    pub feed_account: Pubkey,   // 32
    // store pyth price update account
    pub price_update: Pubkey,   // 32
    // store pyth oracle maximum age, in seconds, 60 means 60s
    pub maximum_age: u64,       // 8
    pub updated_at: i64,        // 8
    pub decimals: u8,           // 1
    pub round: i128,            // 16
    pub outer_preferred: bool,  // 1
    pub oracle_type: OracleType // 1
}

impl Oracle {
    pub const LEN : usize = 8 + (32 + 32 + 32 + 8 + 8 + 1 + 16 + 1 + 1);

    pub fn update_authority(&mut self, authority: Pubkey) -> Result<()> {
        self.authority = authority;

        Ok(())
    }

    pub fn update_outer_preferred(&mut self, outer_preferred: bool) -> Result<()> {
        self.outer_preferred = outer_preferred;

        Ok(())
    }

    pub fn update_maximum_age(&mut self, maximum_age: u64) -> Result<()> {
        self.maximum_age = maximum_age;

        Ok(())
    }
}