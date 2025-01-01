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

use crate::{constants::{LENDING_MANAGER_SEED, SUPER_CHARGER_SEED}, errors::ErrorCode};
use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct LendingManager {
    pub lending_manager_bump: [u8; 1], // 1

    pub authority: Pubkey,

    pub super_charger_config: Pubkey,
    pub super_charger: Pubkey,

    pub principals: u64,
    pub interests: u64,

    pub perf_rate: u64, // 1 in 10000th. 1000 = 10%

    pub interest_rate: u64, // 1 in 10000th. 1 = 0.01% (1 bp), 10 = 0.1% (10 bps)
    pub last_accured_ts: i64, // Timestamp of last accured interests

    pub stake_token_mint: Pubkey,  // stake_token_mint
    pub stake_token_decimals: u8,  // 
    pub super_charger_vault: Pubkey,
    pub treasury_vault: Pubkey,

    pub stake_token_program: Pubkey,
}

impl LendingManager {
    pub fn seeds(&self) -> [&[u8]; 4] {
        [
            LENDING_MANAGER_SEED.as_bytes(),
            self.super_charger_config.as_ref(),
            self.super_charger.as_ref(),
            self.lending_manager_bump.as_ref(),
        ]
    }

    #[allow(clippy::too_many_arguments)]
    pub fn initialize(
        &mut self,
        bump: u8,
        super_charger_config: Pubkey,
        authority: Pubkey,
        super_charger: Pubkey,
        stake_token_mint: Pubkey,
        stake_token_decimals: u8,
        stake_vault: Pubkey,
        stake_token_program: Pubkey,
    ) -> Result<()> {
        self.lending_manager_bump = [bump];
        self.super_charger_config = super_charger_config;
        self.authority = authority;
        self.super_charger = super_charger;
        self.stake_token_mint = stake_token_mint;
        self.stake_token_decimals = stake_token_decimals;
        // TODO Prince: check following vault setted in correct way
        self.super_charger_vault = stake_vault;
        self.treasury_vault = stake_vault;
        self.stake_token_program = stake_token_program;

        self.principals = 0;
        self.interests = 0;
        self.perf_rate = 1000;
        self.interest_rate = 0;
        self.last_accured_ts = Clock::get()?.unix_timestamp;
    
        Ok(())
    }
}
