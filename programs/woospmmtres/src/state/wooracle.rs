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
pub struct WOOracle {
    pub authority: Pubkey,  // 32
    pub updated_at: i64,        // 8
    pub stale_duration: i64,    // 8
    pub bound: u64,             // 8
    pub price: u128,            // 16 as chainlink oracle (e.g. decimal = 8)
    pub coeff: u64,             // 8 k: decimal = 18.    18.4 * 1e18
    pub spread: u64,            // 8 s: decimal = 18.   spread <= 2e18   18.4 * 1e18
    pub range_min: u128,        // 16
    pub range_max: u128,        // 16
}

impl WOOracle {
    pub const LEN : usize = 8 + (32 + 8 + 8 + 8 + 16 + 8 + 8 + 16 + 16);

    pub fn update_authority(&mut self, authority: Pubkey) -> Result<()> {
        self.authority = authority;

        Ok(())
    }

    pub fn update_now(&mut self) -> Result<()> {
        let timestamp = Clock::get()?.unix_timestamp;
        self.updated_at = timestamp;

        Ok(())
    }

    pub fn update_stale_duration(&mut self, stale_duration: i64) -> Result<()> {
        self.stale_duration = stale_duration;

        Ok(())
    }

    pub fn update_bound(&mut self, bound: u64) -> Result<()> {
        self.bound = bound;

        Ok(())
    }

    pub fn update_price(&mut self, price: u128) -> Result<()> {
        self.price = price;

        Ok(())
    }

    pub fn update_coeff(&mut self, coeff: u64) -> Result<()> {
        self.coeff = coeff;

        Ok(())
    }

    pub fn update_spread(&mut self, spread: u64) -> Result<()> {
        self.spread = spread;

        Ok(())
    }

    pub fn update_range_min(&mut self, range_min: u128) -> Result<()> {
        self.range_min = range_min;

        Ok(())
    }

    pub fn update_range_max(&mut self, range_max: u128) -> Result<()> {
        self.range_max = range_max;

        Ok(())
    }
}
