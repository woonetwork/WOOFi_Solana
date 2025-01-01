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

use crate::{constants::SUPER_CHARGER_USER_STATE_SEED, errors::ErrorCode};
use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct UserState {
    pub bump: u64,

    pub super_charger: Pubkey,

    pub user_id: u64,
    pub user: Pubkey,

    pub cost_share_price: u128,

    pub pending_withdrawal_unstake_scaled: u128,
    pub pending_withdrawal_unstake_ts: u64,

    pub last_stake_ts: i64,
}

impl UserState {
    pub fn seeds(&self) -> [&[u8]; 3] {
        [
            SUPER_CHARGER_USER_STATE_SEED.as_bytes(),
            self.super_charger.as_ref(),
            self.user.as_ref(),
        ]
    }

    #[allow(clippy::too_many_arguments)]
    pub fn initialize(
        &mut self,
        super_charger: Pubkey,
        user_id: u64,
        user: Pubkey,
    ) -> Result<()> {
        self.super_charger = super_charger;
        self.user_id = user_id;
        self.user = user;
        self.cost_share_price = 0;
        self.pending_withdrawal_unstake_scaled = 0;
        self.pending_withdrawal_unstake_ts = 0;
        self.last_stake_ts = 0;

        Ok(())
    }

    pub fn update_stake_now(&mut self) -> Result<()> {
        self.last_stake_ts = Clock::get()?.unix_timestamp;
        Ok(())
    }
}
