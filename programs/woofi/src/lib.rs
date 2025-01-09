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

use crate::{constants::*, instructions::*, state::*};

declare_id!("WooFiGFK9x5FBYdvMg3pJBpAkPA8EEYiLcopwrxJvDG");

#[program]
pub mod woofi {
    use super::*;

    pub fn create_config(ctx: Context<CreateConfig>) -> Result<()> {
        instructions::create_config::create_config_handler(ctx)
    }

    pub fn create_wooracle(ctx: Context<CreateWooracle>, maximum_age: u64) -> Result<()> {
        instructions::create_wooracle::create_wooracle_handler(ctx, maximum_age)
    }

    pub fn set_oracle_maximum_age(
        ctx: Context<SetWooStateOnlyAdmin>,
        maximum_age: u64,
    ) -> Result<()> {
        instructions::set_woo_state::set_maximum_age_handler(ctx, maximum_age)
    }

    pub fn set_stale_duration(
        ctx: Context<SetWooStateOnlyAdmin>,
        stale_duration: i64,
    ) -> Result<()> {
        instructions::set_woo_state::set_stale_duration_handler(ctx, stale_duration)
    }

    pub fn set_woo_bound(ctx: Context<SetWooStateOnlyOwner>, bound: u64) -> Result<()> {
        instructions::set_woo_state::set_bound_handler(ctx, bound)
    }

    pub fn set_woo_range(
        ctx: Context<SetWooStateOnlyGuardian>,
        range_min: u128,
        range_max: u128,
    ) -> Result<()> {
        instructions::set_woo_state::set_range_handler(ctx, range_min, range_max)
    }

    pub fn set_woo_price(ctx: Context<SetWooStateOnlyAdmin>, price: u128) -> Result<()> {
        instructions::set_woo_state::set_price_handler(ctx, price)
    }

    pub fn set_woo_coeff(ctx: Context<SetWooStateOnlyAdmin>, coeff: u64) -> Result<()> {
        instructions::set_woo_state::set_coeff_handler(ctx, coeff)
    }

    pub fn set_woo_spread(ctx: Context<SetWooStateOnlyAdmin>, spread: u64) -> Result<()> {
        instructions::set_woo_state::set_spread_handler(ctx, spread)
    }

    pub fn set_woo_admin(
        ctx: Context<SetOnlyOwnerConfig>,
        admin_authority: Vec<Pubkey>,
    ) -> Result<()> {
        instructions::set_wooracle_admin_handler(ctx, admin_authority)
    }

    pub fn set_guardian_admin(
        ctx: Context<SetOnlyOwnerConfig>,
        guardian_authority: Vec<Pubkey>,
    ) -> Result<()> {
        instructions::set_guardian_handler(ctx, guardian_authority)
    }

    pub fn set_lending_manager(
        ctx: Context<SetOnlyOwnerConfig>,
        lending_managers: Vec<Pubkey>,
    ) -> Result<()> {
        instructions::set_lending_manager_handler(ctx, lending_managers)
    }

    pub fn set_woo_state(
        ctx: Context<SetWooStateOnlyAdmin>,
        price: u128,
        coeff: u64,
        spread: u64,
    ) -> Result<()> {
        instructions::set_woo_state::set_state_handler(ctx, price, coeff, spread)
    }

    pub fn get_price(ctx: Context<GetPrice>) -> Result<GetPriceResult> {
        instructions::get_price::get_price_handler(ctx)
    }

    pub fn create_pool(ctx: Context<CreatePool>) -> Result<()> {
        instructions::create_pool::create_pool_handler(ctx)
    }

    pub fn set_pool_admin(
        ctx: Context<SetOnlyAdminConfig>,
        admin_authority: Vec<Pubkey>,
    ) -> Result<()> {
        instructions::set_pool_admin_handler(ctx, admin_authority)
    }

    pub fn set_fee_admin(
        ctx: Context<SetOnlyAdminConfig>,
        fee_authority: Vec<Pubkey>,
    ) -> Result<()> {
        instructions::set_fee_admin_handler(ctx, fee_authority)
    }

    pub fn set_pause_role(
        ctx: Context<SetOnlyAdminConfig>,
        pause_authority: Vec<Pubkey>,
    ) -> Result<()> {
        instructions::set_pause_role_handler(ctx, pause_authority)
    }

    pub fn pause(ctx: Context<Pause>) -> Result<()> {
        instructions::pause(ctx)
    }

    pub fn unpause(ctx: Context<UnPause>) -> Result<()> {
        instructions::unpause(ctx)
    }

    pub fn set_pool_fee_rate(ctx: Context<SetPoolState>, fee_rate: u16) -> Result<()> {
        instructions::set_pool_state::set_fee_rate_handler(ctx, fee_rate)
    }

    pub fn set_pool_max_gamma(ctx: Context<SetPoolState>, max_gamma: u128) -> Result<()> {
        instructions::set_pool_state::set_max_gamma_handler(ctx, max_gamma)
    }

    pub fn set_pool_max_notional_swap(
        ctx: Context<SetPoolState>,
        max_notional_swap: u128,
    ) -> Result<()> {
        instructions::set_pool_state::set_max_notional_swap_handler(ctx, max_notional_swap)
    }

    pub fn set_pool_cap_bal(ctx: Context<SetPoolState>, cap_bal: u128) -> Result<()> {
        instructions::set_pool_state::set_cap_bal_handler(ctx, cap_bal)
    }

    pub fn set_pool_min_swap_amount(ctx: Context<SetPoolState>, min_swap_amount: u128) -> Result<()> {
        instructions::set_pool_state::set_min_swap_amount_handler(ctx, min_swap_amount)
    }

    pub fn try_query(ctx: Context<TryQuery>, from_amount: u128) -> Result<QueryResult> {
        instructions::try_query::try_query_handler(ctx, from_amount)
    }

    pub fn query(
        ctx: Context<Query>,
        from_amount: u128,
        min_to_amount: u128,
    ) -> Result<QueryResult> {
        instructions::query::query_handler(ctx, from_amount, min_to_amount)
    }

    pub fn swap(ctx: Context<Swap>, from_amount: u128, min_to_amount: u128) -> Result<()> {
        instructions::swap::swap_handler(ctx, from_amount, min_to_amount)
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u128) -> Result<()> {
        instructions::deposit_withdraw::deposit(ctx, amount)
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u128) -> Result<()> {
        instructions::deposit_withdraw::withdraw(ctx, amount)
    }

    pub fn claim_fee(ctx: Context<ClaimFee>) -> Result<()> {
        instructions::claim_fee::claim_handler(ctx)
    }

    pub fn claim_fee_amount(ctx: Context<ClaimFee>, claim_amount: u128) -> Result<()> {
        instructions::claim_fee::claim_amount_handler(ctx, claim_amount)
    }

    pub fn incase_token_got_stuck(ctx: Context<IncaseTokenGotStuck>, amount: u128) -> Result<()> {
        instructions::incase_token_got_stuck_handler(ctx, amount)
    }

    pub fn set_wooconfig_new_authority(ctx: Context<SetNewAuthority>) -> Result<()> {
        instructions::set_wooconfig_new_authority_handler(ctx)
    }

    pub fn claim_wooconfig_authority(ctx: Context<ClaimAuthorityConfig>) -> Result<()> {
        instructions::claim_wooconfig_authority_handler(ctx)
    }

    pub fn claim_wooracle_authority(ctx: Context<ClaimAuthorityWooracle>) -> Result<()> {
        instructions::claim_wooracle_authority_handler(ctx)
    }

    pub fn claim_woopool_authority(ctx: Context<ClaimAuthorityWoopool>) -> Result<()> {
        instructions::claim_woopool_authority_handler(ctx)
    }

    pub fn repay(ctx: Context<Repay>, repay_amount: u128) -> Result<()> {
        instructions::repay(ctx, repay_amount)
    }
}
