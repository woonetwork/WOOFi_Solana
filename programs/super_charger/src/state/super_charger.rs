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

use crate::{constants::SUPER_CHARGER_SEED, errors::ErrorCode};
use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct SuperCharger {
    pub super_charger_bump: [u8; 1], // 1

    pub authority: Pubkey,

    pub super_charger_config: Pubkey,

    pub num_users: u64,
    pub total_staked_amount: u64,

    pub stake_token_mint: Pubkey,  // stake_token_mint
    pub stake_token_decimals: u8,  // 
    pub stake_vault: Pubkey,

    pub we_token_mint: Pubkey,  // woofi earn token
    pub we_token_vault: Pubkey,
    // cost share price 

    pub stake_token_program: Pubkey,
    pub we_token_program: Pubkey,
}

impl SuperCharger {
    pub fn seeds(&self) -> [&[u8]; 4] {
        [
            SUPER_CHARGER_SEED.as_bytes(),
            self.super_charger_config.as_ref(),
            self.stake_token_mint.as_ref(),
            self.super_charger_bump.as_ref(),
        ]
    }

    #[allow(clippy::too_many_arguments)]
    pub fn initialize(
        &mut self,
        bump: u8,
        super_charger_config: Pubkey,
        authority: Pubkey,
        stake_token_mint: Pubkey,
        stake_token_decimals: u8,
        stake_vault: Pubkey,
        we_token_mint: Pubkey,
        we_token_vault: Pubkey,
        stake_token_program: Pubkey,
        we_token_program: Pubkey
    ) -> Result<()> {
        self.super_charger_bump = [bump];
        self.super_charger_config = super_charger_config;
        self.authority = authority;
        self.stake_token_mint = stake_token_mint;
        self.stake_token_decimals = stake_token_decimals;
        self.stake_vault = stake_vault;
        self.we_token_mint = we_token_mint;
        self.we_token_vault = we_token_vault;
        self.stake_token_program = stake_token_program;
        self.we_token_program = we_token_program;

        self.num_users = 0;
        self.total_staked_amount = 0;

        Ok(())
    }
}
