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
pub mod constants;
pub mod errors;
pub mod events;
pub mod instructions;
pub mod state;
pub mod util;

use anchor_lang::prelude::*;

use crate::{instructions::*, state::*};

declare_id!("3uPLMRfgeAbiMzY2iuBkRgZKdYnBrNfqwvfNz1aBY6dX");

#[program]
pub mod super_charger {
    use super::*;

    pub fn create_config(ctx: Context<CreateConfig>) -> Result<()> {
        instructions::create_config::create_config_handler(ctx)
    }

    pub fn create_super_charger(ctx: Context<CreateSuperCharger>) -> Result<()> {
        instructions::create_super_charger::create_super_charger_handler(ctx)
    }

    pub fn set_super_charger_admin(
        ctx: Context<SetOnlyOwnerConfig>,
        admin_authority: Vec<Pubkey>,
    ) -> Result<()> {
        instructions::set_super_charger_admin_handler(ctx, admin_authority)
    }

    pub fn set_borrower_role(
        ctx: Context<SetOnlyOwnerConfig>,
        admin_authority: Vec<Pubkey>,
    ) -> Result<()> {
        instructions::set_borrower_role_handler(ctx, admin_authority)
    }

    pub fn set_pause_role(
        ctx: Context<SetOnlyAdminConfig>,
        pause_authority: Vec<Pubkey>,
    ) -> Result<()> {
        instructions::set_pause_role_handler(ctx, pause_authority)
    }

    pub fn set_lending_manager_woopool(
        ctx: Context<SetOnlyOwnerLendingManager>,
        woopool_token_vault: Pubkey
    ) -> Result<()> {
        instructions::set_lending_manager_woopool_handler(ctx, woopool_token_vault)
    }

    pub fn set_lending_manager_interest_rate(
        ctx: Context<SetOnlyAdminLendingManager>,
        interest_rate: u64
    ) -> Result<()> {
        instructions::set_lending_manager_interest_rate_handler(ctx, interest_rate)
    }

    pub fn set_lending_manager_perf_rate(
        ctx: Context<SetOnlyAdminLendingManager>,
        perf_rate: u64
    ) -> Result<()> {
        instructions::set_lending_manager_perf_rate_handler(ctx, perf_rate)
    }

    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        instructions::initialize_user::initialize_user_handler(ctx)
    }

    pub fn deposit(ctx: Context<Deposit>, deposit_amount: u64) -> Result<()> {
        instructions::deposit::deposit_handler(ctx, deposit_amount)
    }

    pub fn instant_withdraw(
        ctx: Context<InstantWithdraw>,
        withdraw_amount: u64
    ) -> Result<()> {
        instructions::instant_withdraw::instant_withdraw_hanlder(ctx, withdraw_amount)
    }

    pub fn borrow(
        ctx: Context<BorrowOnlyBorrower>,
        borrow_amount: u64
    ) -> Result<()> {
        instructions::borrow_only_borrower_handler(ctx, borrow_amount)
    }

    pub fn repay(
        ctx: Context<RepayOnlyAdmin>,
        principle_amount: u64,
        interest_amount: u64
    ) -> Result<u64> {
        instructions::repay_only_admin::repay(ctx, principle_amount, interest_amount)
    }

}
