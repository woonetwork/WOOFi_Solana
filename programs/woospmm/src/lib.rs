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
mod state;
mod instructions;
mod constants;
mod errors;
mod util;

use anchor_lang::prelude::*;

use crate::{constants::*, state::*, instructions::*, };

declare_id!("48KN3Khr7mEW46Xkqm49xkmRVN1GpFsSRL8xaYtRd9T4");

#[program]
pub mod woospmm {
    use super::*;

    pub fn create_oracle_chainlink(ctx: Context<CreateOracleChainlink>) -> Result<()> {
        return instructions::create_oracle_chainlink::handler(ctx);
    }

    pub fn create_oracle_pyth(ctx: Context<CreateOraclePyth>) -> Result<()> {
        return instructions::create_oracle_pyth::handler(ctx);
    }

    pub fn set_stale_duration(ctx: Context<SetWooState>, stale_duration: i64) -> Result<()> {
        return instructions::set_woo_state::set_stale_duration_handler(ctx, stale_duration);
    }

    pub fn set_woo_bound(ctx: Context<SetWooState>, bound: u64) -> Result<()> {
        return instructions::set_woo_state::set_bound_handler(ctx, bound);
    }

    pub fn set_woo_range(ctx: Context<SetWooState>, range_min: u128, range_max: u128) -> Result<()> {
        return instructions::set_woo_state::set_range_handler(ctx, range_min, range_max);
    }

    pub fn set_woo_price(ctx: Context<SetWooState>, price: u128) -> Result<()> {
        return instructions::set_woo_state::set_price_handler(ctx, price, true);
    }

    pub fn set_woo_coeff(ctx: Context<SetWooState>, coeff: u64) -> Result<()> {
        return instructions::set_woo_state::set_coeff_handler(ctx, coeff, true);
    }

    pub fn set_woo_spread(ctx: Context<SetWooState>, spread: u64) -> Result<()> {
        return instructions::set_woo_state::set_spread_handler(ctx, spread, true);
    }

    pub fn set_clo_preferred(ctx: Context<SetOuterPreferred>, clo_preferred: bool) -> Result<()> {
        return instructions::set_outer_preferred::handler(ctx, clo_preferred);
    }

    pub fn set_woo_admin(ctx: Context<SetWooAdmin>, admin_authority: Pubkey) -> Result<()> {
        return instructions::set_woo_admin_handler(ctx, admin_authority);
    }

    pub fn set_woo_state(ctx: Context<SetWooState>, price: u128, coeff: u64, spread: u64) -> Result<()> {
        return instructions::set_woo_state::set_state_handler(ctx, price, coeff, spread);
    }

    // Cannot support change feed account key and program key after create
    // Due to wooracle and cloracle's seed need to change
    // If need to change feed account, just create another pair of wooralce and cloracle
    // pub fn re_initialize_cloracle(ctx: Context<ReInitializeCLOracle>, clo_preferred: bool) -> Result<()> {
    //     return instructions::re_initialize_cloracle::handler(ctx, clo_preferred);
    // }

    pub fn update_cloracle(ctx: Context<UpdateCLOracle>) -> Result<()> {
        return instructions::update_cloracle::handler(ctx);
    }

    pub fn update_pythoracle(ctx: Context<UpdatePythOracle>) -> Result<()> {
        return instructions::update_pythoracle::handler(ctx);
    }

    pub fn get_price(ctx: Context<GetPrice>) -> Result<GetPriceResult> {
        return instructions::get_price::handler(ctx);        
    }

    pub fn create_pool(ctx: Context<CreatePool>, admin_authority: Pubkey, fee_authority: Pubkey) -> Result<()> {
        return instructions::create_pool::handler(ctx, admin_authority, fee_authority);
    }

    pub fn set_pool_admin(ctx: Context<SetPoolAdmin>, admin_authority: Pubkey) -> Result<()> {
        return instructions::set_pool_admin_handler(ctx, admin_authority);
    }

    pub fn set_pool_fee_admin(ctx: Context<SetPoolAdmin>, fee_authority: Pubkey) -> Result<()> {
        return instructions::set_pool_fee_admin_handler(ctx, fee_authority);
    }

    pub fn set_pool_state(ctx: Context<SetPoolState>, fee_rate: u16, cap_balance: u128, tgt_balance: u128, shift_max: u16) -> Result<()> {
        return instructions::set_pool_state::set_pool_state_handler(ctx, fee_rate, cap_balance, tgt_balance, shift_max);
    }

    pub fn set_pool_fee_rate(ctx: Context<SetPoolState>, fee_rate: u16) -> Result<()> {
        return instructions::set_pool_state::set_fee_rate_handler(ctx, fee_rate);
    }

    pub fn set_pool_cap_balance(ctx: Context<SetPoolState>, cap_balance: u128) -> Result<()> {
        return instructions::set_pool_state::set_cap_balance_handler(ctx, cap_balance);
    }

    pub fn set_pool_tgt_balance(ctx: Context<SetPoolState>, tgt_balance: u128) -> Result<()> {
        return instructions::set_pool_state::set_tgt_balance_handler(ctx, tgt_balance);
    }

    pub fn set_pool_shift_max(ctx: Context<SetPoolState>, shift_max: u16) -> Result<()> {
        return instructions::set_pool_state::set_shift_max_handler(ctx, shift_max);
    }

    pub fn set_pool_max_gamma(ctx: Context<SetPoolState>, max_gamma: u128) -> Result<()> {
        return instructions::set_pool_state::set_max_gamma_handler(ctx, max_gamma);
    }

    pub fn set_pool_max_notional_swap(ctx: Context<SetPoolState>, max_notional_swap: u128) -> Result<()> {
        return instructions::set_pool_state::set_max_notional_swap_handler(ctx, max_notional_swap);
    }

    pub fn try_query(ctx: Context<TryQuery>, from_amount: u128) -> Result<QueryResult> {
        return instructions::try_query::handler(ctx, from_amount);
    }

    pub fn swap(ctx: Context<Swap>, from_amount: u128, min_to_amount: u128) -> Result<()> {
        return instructions::swap::handler(ctx, from_amount, min_to_amount);
    }

}