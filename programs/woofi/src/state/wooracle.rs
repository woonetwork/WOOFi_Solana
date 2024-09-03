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

use std::cmp::{max, min};

use crate::errors::ErrorCode;
use crate::{util::checked_mul_div, TENPOW18U128, TENPOW18U64};
use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct WOOracle {
    pub wooconfig: Pubkey,    // 32
    pub authority: Pubkey,    // 32
    pub token_mint: Pubkey,   // 32
    pub feed_account: Pubkey, // 32
    // store pyth price update account
    pub price_update: Pubkey, // 32
    // store pyth oracle maximum age, in seconds, 60 means 60s
    pub maximum_age: u64,   // 8
    pub price_decimals: u8, // 1
    pub quote_decimals: u8, // 1
    pub base_decimals: u8,  // 1
    //    pub round: i128,          // 16
    pub outer_preferred: bool,      // 1
    pub updated_at: i64,            // 8
    pub stale_duration: i64,        // 8
    pub bound: u64,                 // 8
    pub price: u128,                // 16 as chainlink oracle (e.g. decimal = 8)
    pub coeff: u64,                 // 8 k: decimal = 18.    18.4 * 1e18
    pub spread: u64,                // 8 s: decimal = 18.   spread <= 2e18   18.4 * 1e18
    pub range_min: u128,            // 16
    pub range_max: u128,            // 16
    pub quote_token_mint: Pubkey,   // 32
    pub quote_feed_account: Pubkey, // 32
    pub quote_price_update: Pubkey, // 32
}

impl WOOracle {
    pub const LEN: usize = 8
        + (32
            + 32
            + 32
            + 32
            + 32
            + 8
            + 1
            + 1
            + 1
//            + 16
            + 1
            + 8
            + 8
            + 8
            + 16
            + 8
            + 8
            + 16
            + 16
            + 32
            + 32
            + 32);

    pub fn update_now(&mut self) -> Result<()> {
        let timestamp = Clock::get()?.unix_timestamp;
        self.updated_at = timestamp;

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

    pub fn post_price(&mut self, price: u128) -> Result<()> {
        self.update_spread_for_new_price(price)?;
        self.update_price(price)?;
        self.update_now()?;

        Ok(())
    }

    pub fn update_spread_for_new_price(&mut self, price: u128) -> Result<()> {
        let pre_s = self.spread;
        let pre_p = self.price;
        if pre_p == 0 || price == 0 || pre_s >= TENPOW18U64 {
            // previous price or current price is 0, no action is needed
            return Ok(());
        }

        let max_p = max(price, pre_p);
        let min_p = min(price, pre_p);
        // let anti_spread = (TENPOW18U128 * TENPOW18U128 * min_price) / max_price / (TENPOW18U128 - pre_spread as u128);
        let calc_a = checked_mul_div(TENPOW18U128, min_p, max_p)?;
        let anti_s = checked_mul_div(
            TENPOW18U128,
            calc_a,
            TENPOW18U128.checked_sub(pre_s as u128).unwrap(),
        )?;
        if anti_s < TENPOW18U128 {
            let new_s = TENPOW18U128.checked_sub(anti_s).unwrap() as u64;
            if new_s > pre_s {
                self.update_spread(new_s)?;
            }
        }

        Ok(())
    }

    pub fn update_spread_for_new_price_and_spread(
        &mut self,
        price: u128,
        spread: u64,
    ) -> Result<()> {
        //require(spread < 1e18, "!_spread");
        require!(spread < TENPOW18U64, ErrorCode::WooOracleSpreadExceed);

        let pre_s = self.spread;
        let pre_p = self.price;
        if pre_p == 0 || price == 0 || pre_s >= TENPOW18U64 {
            // previous price or current price is 0, just use spread
            return self.update_spread(spread);
        }

        let max_p = max(price, pre_p);
        let min_p = min(price, pre_p);
        let calc_a = checked_mul_div(TENPOW18U128, min_p, max_p)?;
        let anti_s = checked_mul_div(
            TENPOW18U128,
            calc_a,
            TENPOW18U128.checked_sub(pre_s as u128).unwrap(),
        )?;
        if anti_s < TENPOW18U128 {
            let new_s = TENPOW18U128.checked_sub(anti_s).unwrap() as u64;
            self.update_spread(max(new_s, spread))
        } else {
            self.update_spread(spread)
        }
    }
}
