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

declare_id!("DijYgrdt8WPUpxQz6jyhdvhE6jRKRhW62sp64me4rBVA");

#[program]
pub mod woospmmtres {
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
        return instructions::set_woo_state::set_rang_handler(ctx, range_min, range_max);
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

    pub fn create_pool(ctx: Context<CreatePool>, fee_authority: Pubkey) -> Result<()> {
        return instructions::create_pool::handler(ctx, fee_authority);
    }

    pub fn try_query(ctx: Context<TryQuery>, from_amount: u128) -> Result<QueryResult> {
        return instructions::try_query::handler(ctx, from_amount);
    }

    pub fn swap(ctx: Context<Swap>, from_amount: u128) -> Result<()> {
        return instructions::swap::handler(ctx, from_amount);
    }

}