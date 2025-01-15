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
mod instructions;
mod state;
mod util;

use anchor_lang::prelude::*;

use crate::{instructions::*, state::*};

declare_id!("EESDHt2dBt79iMEBG6D7wBbmpJHndNkQJVktmLX22gq7");

#[program]
pub mod rebate_manager {
    use super::*;

    pub fn create_rebate_info(ctx: Context<CreateRebateInfo>) -> Result<()> {
        instructions::create_rebate_info::handler(ctx)
    }

    pub fn create_rebate_manager(ctx: Context<CreateRebateManager>) -> Result<()> {
        instructions::create_rebate_manager::handler(ctx)
    }

    pub fn set_admin(ctx: Context<SetAdmin>, admins: Vec<Pubkey>) -> Result<()> {
        instructions::set_admin_handler(ctx, admins)
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

    pub fn add_rebate(ctx: Context<AddSubRebate>, amount: u128) -> Result<()> {
        instructions::add_rebate(ctx, amount)
    }

    pub fn sub_rebate(ctx: Context<AddSubRebate>, amount: u128) -> Result<()> {
        instructions::sub_rebate(ctx, amount)
    }
}
