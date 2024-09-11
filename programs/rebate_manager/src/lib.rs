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
mod constants;
mod errors;
mod events;
mod instructions;
mod state;
mod util;

use anchor_lang::prelude::*;

use crate::{instructions::*, state::*};

declare_id!("6UcVauE8N1icb7uV8a7aJy7cZ9SDcuxbXMVjAgsoMn3Z");

#[program]
pub mod woofi {
    use super::*;

    pub fn create_config(ctx: Context<CreateConfig>) -> Result<()> {
        instructions::create_config::handler(ctx)
    }

    pub fn create_rebate_pool(ctx: Context<CreateRebatePool>) -> Result<()> {
        instructions::create_rebate_pool::handler(ctx)
    }

    pub fn claim_rebate_fee(ctx: Context<ClaimRebateFee>) -> Result<()> {
        instructions::claim_rebate_fee::handler(ctx)
    }

    pub fn deposit_rebate_fee(ctx: Context<DepositWithdraw>, amount: u128) -> Result<()> {
        instructions::deposit(ctx, amount)
    }

    pub fn withdraw_rebate_fee(ctx: Context<DepositWithdraw>, amount: u128) -> Result<()> {
        instructions::withdraw(ctx, amount)
    }

    pub fn pause(ctx: Context<PauseSwitch>) -> Result<()> {
        instructions::pause(ctx)
    }

    pub fn unpause(ctx: Context<PauseSwitch>) -> Result<()> {
        instructions::unpause(ctx)
    }
}
