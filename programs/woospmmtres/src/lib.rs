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

mod constants;

use crate::{constants::*};

declare_id!("45LgxBpxsu7mRdn3GPLrUZM93LxvP3SpCZ1TufDdNr2u");

#[program]
pub mod woospmmtres {
    use super::*;

    pub fn create_oracle(ctx: Context<CreateOracle>, _base_address: Pubkey) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(base_address: Pubkey)]
pub struct CreateOracle<'info> {
    #[account(
        init,
        payer = funder,
        space = 32 + 1 + 1 + 8,
        seeds = [
            CLORACLE_SEED.as_bytes(),
            base_address.as_ref(),
            ],
        bump,
    )]
    pub cloracle: Account<'info, CLOracle>,

    #[account(
        init,
        payer = funder,
        space = 16 + 8 + 8 + 8,
        seeds = [
            TOKEN_INFO_SEED.as_bytes(),
            base_address.as_ref(),
            ],
        bump,
    )]
    pub token_info: Account<'info, TokenInfo>,

    #[account(mut)]
    pub funder: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct CLOracle {
    oracle: Pubkey,         //32
    decimal: u8,            //1
    clo_preferred: bool,    //1
}
#[account]
pub struct TokenInfo {
    price: u128, // 16 as chainlink oracle (e.g. decimal = 8)
    coeff: u64,  // 8 k: decimal = 18.    18.4 * 1e18
    spread: u64, // 8 s: decimal = 18.   spread <= 2e18   18.4 * 1e18
}

