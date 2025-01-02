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

declare_id!("Boi3FPi38PXGJigfiuBB5f5xjDRUuL7P3ahsG9M3n89B");

#[program]
pub mod rebate_manager {
    use super::*;

    pub fn create_config(ctx: Context<CreateConfig>) -> Result<()> {
        instructions::create_config::handler(ctx)
    }

    pub fn create_super_charger(ctx: Context<CreateSuperCharger>) -> Result<()> {
        instructions::create_super_charger::handler(ctx)
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

    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        instructions::initialize_user::handler(ctx)
    }

    pub fn deposit(ctx: Context<Deposit>, deposit_amount: u64) -> Result<()> {
        instructions::deposit::hanlder(ctx, deposit_amount)
    }

    pub fn instant_withdraw(
        ctx: Context<InstantWithdraw>,
        withdraw_amount: u64
    ) -> Result<()> {
        instructions::instant_withdraw::hanlder(ctx, withdraw_amount)
    }

}
