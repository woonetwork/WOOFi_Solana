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

use crate::constants::*;
use crate::errors::ErrorCode;
use anchor_lang::prelude::*;

pub const ADMIN_AUTH_MAX_LEN: usize = 5;

#[account]
#[derive(InitSpace)]
pub struct RebateManager {
    pub authority: Pubkey, // 32

    pub rebate_manager_bump: [u8; 1], // 1

    #[max_len(ADMIN_AUTH_MAX_LEN)]
    pub admin_authority: Vec<Pubkey>,

    pub quote_token_mint: Pubkey, // 32

    pub token_vault: Pubkey, // 32
}

impl RebateManager {
    pub fn seeds(&self) -> [&[u8]; 3] {
        [
            REBATEMANAGER_SEED.as_bytes(),
            self.quote_token_mint.as_ref(),
            self.rebate_manager_bump.as_ref(),
        ]
    }

    pub fn initialize(
        &mut self,
        authority: Pubkey,
        quote_token_mint: Pubkey,
        token_vault: Pubkey,
        bump: u8
    ) -> Result<()> {
        self.authority = authority;
        self.quote_token_mint = quote_token_mint;
        self.token_vault = token_vault;
        self.rebate_manager_bump = [bump];

        Ok(())
    }

    pub fn set_admin_authority(&mut self, admin_authority: Vec<Pubkey>) -> Result<()> {
        require!(
            admin_authority.len() <= ADMIN_AUTH_MAX_LEN,
            ErrorCode::TooManyAuthorities
        );
        self.admin_authority = admin_authority;

        Ok(())
    }
}
