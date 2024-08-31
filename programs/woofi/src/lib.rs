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

use crate::{constants::*, instructions::*, state::*};

declare_id!("5dvaMKBFqkSpnPxQVLoGGgeDNWPp4Cc29FRt289mkfpu");

#[program]
pub mod woofi {
    use super::*;

    pub fn create_oracle(ctx: Context<CreateOracle>, maximum_age: u64) -> Result<()> {
        instructions::create_oracle::handler(ctx, maximum_age)
    }

    pub fn set_oracle_maximum_age(ctx: Context<SetWooState>, maximum_age: u64) -> Result<()> {
        instructions::set_woo_state::set_maximum_age_handler(ctx, maximum_age)
    }

    pub fn set_stale_duration(ctx: Context<SetWooState>, stale_duration: i64) -> Result<()> {
        instructions::set_woo_state::set_stale_duration_handler(ctx, stale_duration)
    }

    pub fn set_woo_bound(ctx: Context<SetWooState>, bound: u64) -> Result<()> {
        instructions::set_woo_state::set_bound_handler(ctx, bound)
    }

    pub fn set_woo_range(
        ctx: Context<SetWooState>,
        range_min: u128,
        range_max: u128,
    ) -> Result<()> {
        instructions::set_woo_state::set_range_handler(ctx, range_min, range_max)
    }

    pub fn set_woo_price(ctx: Context<SetWooState>, price: u128) -> Result<()> {
        instructions::set_woo_state::set_price_handler(ctx, price)
    }

    pub fn set_woo_coeff(ctx: Context<SetWooState>, coeff: u64) -> Result<()> {
        instructions::set_woo_state::set_coeff_handler(ctx, coeff)
    }

    pub fn set_woo_spread(ctx: Context<SetWooState>, spread: u64) -> Result<()> {
        instructions::set_woo_state::set_spread_handler(ctx, spread)
    }

    pub fn set_out_preferred(ctx: Context<SetWooState>, out_preferred: bool) -> Result<()> {
        instructions::set_woo_state::set_outer_preferred_handler(ctx, out_preferred)
    }

    pub fn set_woo_admin(ctx: Context<SetWooAdmin>, admin_authority: Pubkey) -> Result<()> {
        instructions::set_woo_admin_handler(ctx, admin_authority)
    }

    pub fn set_woo_state(
        ctx: Context<SetWooState>,
        price: u128,
        coeff: u64,
        spread: u64,
    ) -> Result<()> {
        instructions::set_woo_state::set_state_handler(ctx, price, coeff, spread)
    }

    pub fn get_price(ctx: Context<GetPrice>) -> Result<GetPriceResult> {
        instructions::get_price::handler(ctx)
    }

    pub fn create_pool(
        ctx: Context<CreatePool>,
        admin_authority: Pubkey,
        fee_authority: Pubkey,
    ) -> Result<()> {
        instructions::create_pool::handler(ctx, admin_authority, fee_authority)
    }

    pub fn create_rebate_pool(ctx: Context<CreateRebatePool>) -> Result<()> {
        instructions::create_rebate_pool::handler(ctx)
    }

    pub fn set_pool_admin(ctx: Context<SetPoolAdmin>, admin_authority: Pubkey) -> Result<()> {
        instructions::set_pool_admin_handler(ctx, admin_authority)
    }

    pub fn set_pool_fee_admin(ctx: Context<SetPoolAdmin>, fee_authority: Pubkey) -> Result<()> {
        instructions::set_pool_fee_admin_handler(ctx, fee_authority)
    }

    pub fn set_pool_paused(ctx: Context<SetPoolState>, paused: bool) -> Result<()> {
        instructions::set_pool_paused(ctx, paused)
    }

    pub fn set_rebate_pool_paused(ctx: Context<SetRebatePoolState>, paused: bool) -> Result<()> {
        instructions::set_rebate_pool_paused(ctx, paused)
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

    pub fn try_query(ctx: Context<TryQuery>, from_amount: u128) -> Result<QueryResult> {
        instructions::try_query::handler(ctx, from_amount)
    }

    pub fn query(
        ctx: Context<Query>,
        from_amount: u128,
        min_to_amount: u128,
    ) -> Result<QueryResult> {
        instructions::query::handler(ctx, from_amount, min_to_amount)
    }

    pub fn swap(ctx: Context<Swap>, from_amount: u128, min_to_amount: u128) -> Result<()> {
        instructions::swap::handler(ctx, from_amount, min_to_amount)
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u128) -> Result<()> {
        instructions::deposit::handler(ctx, amount)
    }

    pub fn claim_fee(ctx: Context<ClaimFee>) -> Result<()> {
        instructions::claim_fee::claim_handler(ctx)
    }

    pub fn claim_fee_amount(ctx: Context<ClaimFee>, claim_amount: u128) -> Result<()> {
        instructions::claim_fee::claim_amount_handler(ctx, claim_amount)
    }

    pub fn claim_rebate_fee(ctx: Context<ClaimRebateFee>) -> Result<()> {
        instructions::claim_rebate_fee::handler(ctx)
    }
}
