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

use crate::errors::ErrorCode;
use anchor_lang::prelude::*;

pub const ADMIN_AUTH_MAX_LEN: usize = 5;
pub const PAUSE_AUTH_MAX_LEN: usize = 5;

#[account]
#[derive(InitSpace)]
pub struct SuperChargerConfig {
    pub authority: Pubkey,

    pub paused: bool,

    #[max_len(ADMIN_AUTH_MAX_LEN)]
    pub admin_authority: Vec<Pubkey>,

    #[max_len(PAUSE_AUTH_MAX_LEN)]
    pub pause_authority: Vec<Pubkey>,

    pub new_authority: Pubkey,
}

impl SuperChargerConfig {
    pub fn set_paused(&mut self, paused: bool) -> Result<()> {
        self.paused = paused;

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

    pub fn set_pause_authority(&mut self, pause_authority: Vec<Pubkey>) -> Result<()> {
        require!(
            pause_authority.len() <= PAUSE_AUTH_MAX_LEN,
            ErrorCode::TooManyAuthorities
        );
        self.pause_authority = pause_authority;

        Ok(())
    }

    pub fn set_new_authority(&mut self, new_authority: Pubkey) -> Result<()> {
        self.new_authority = new_authority;

        Ok(())
    }
}
