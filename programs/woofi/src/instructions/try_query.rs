use std::cmp::max;

use anchor_lang::prelude::*;

use crate::{constants::*, instructions::*, state::*, util::*};

use pyth_solana_receiver_sdk::price_update::PriceUpdateV2;

#[derive(Accounts)]
pub struct TryQuery<'info> {
    #[account(
        constraint = !wooconfig.paused
    )]
    pub wooconfig: Box<Account<'info, WooConfig>>,
    #[account(
        has_one = wooconfig,
        address = woopool_from.wooracle,
        has_one = quote_price_update,
        constraint = wooracle_from.price_update == price_update_from.key()
    )]
    wooracle_from: Account<'info, Wooracle>,
    #[account(
        has_one = wooconfig,
        constraint = woopool_from.authority == wooracle_from.authority,
        constraint = woopool_from.quote_token_mint == wooracle_from.quote_token_mint
    )]
    woopool_from: Box<Account<'info, WooPool>>,
    #[account(mut,
        address = wooracle_from.price_update,
    )]
    price_update_from: Account<'info, PriceUpdateV2>,

    #[account(
        has_one = wooconfig,
        address = woopool_to.wooracle,
        has_one = quote_price_update,
        constraint = wooracle_to.price_update == price_update_to.key()
    )]
    wooracle_to: Account<'info, Wooracle>,
    #[account(
        has_one = wooconfig,
        constraint = woopool_to.authority == woopool_from.authority,
        constraint = woopool_to.authority == wooracle_to.authority,
        constraint = woopool_to.quote_token_mint == woopool_from.quote_token_mint,
        constraint = woopool_to.quote_token_mint == wooracle_to.quote_token_mint,
        constraint = woopool_to.token_mint != woopool_from.token_mint
    )]
    woopool_to: Box<Account<'info, WooPool>>,
    #[account(mut,
        address = wooracle_to.price_update,
    )]
    price_update_to: Account<'info, PriceUpdateV2>,

    quote_price_update: Account<'info, PriceUpdateV2>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Copy)]
pub struct QueryResult {
    pub to_amount: u128,
    pub swap_fee: u128,
}

pub fn handler(ctx: Context<TryQuery>, from_amount: u128) -> Result<QueryResult> {
    let price_update_from = &mut ctx.accounts.price_update_from;
    let price_update_to = &mut ctx.accounts.price_update_to;
    let quote_price_update = &mut ctx.accounts.quote_price_update;

    let wooracle_from = &ctx.accounts.wooracle_from;
    let woopool_from = &ctx.accounts.woopool_from;

    let wooracle_to = &ctx.accounts.wooracle_to;
    let woopool_to = &ctx.accounts.woopool_to;

    let fee_rate: u16 = if woopool_from.token_mint == woopool_from.quote_token_mint {
        woopool_to.fee_rate
    } else if woopool_to.token_mint == woopool_to.quote_token_mint {
        woopool_from.fee_rate
    } else {
        max(woopool_from.fee_rate, woopool_to.fee_rate)
    };

    let decimals_from = Decimals::new(
        wooracle_from.price_decimals as u32,
        wooracle_from.quote_decimals as u32,
        woopool_from.base_decimals as u32,
    );

    let mut quote_amount = from_amount;
    if woopool_from.token_mint != woopool_from.quote_token_mint {
        let state_from =
            get_price::get_state_impl(wooracle_from, price_update_from, quote_price_update)?;

        let (_quote_amount, _) = swap_math::calc_quote_amount_sell_base(
            from_amount,
            woopool_from,
            &decimals_from,
            &state_from,
        )?;

        quote_amount = _quote_amount;
    }

    let swap_fee = checked_mul_div_round_up(quote_amount, fee_rate as u128, ONE_E5_U128)?;
    quote_amount = quote_amount.checked_sub(swap_fee).unwrap();

    let decimals_to = Decimals::new(
        wooracle_to.price_decimals as u32,
        wooracle_to.quote_decimals as u32,
        woopool_to.base_decimals as u32,
    );

    let mut to_amount = quote_amount;
    if woopool_to.token_mint != woopool_to.quote_token_mint {
        let state_to = get_price::get_state_impl(wooracle_to, price_update_to, quote_price_update)?;

        let (_to_amount, _) = swap_math::calc_base_amount_sell_quote(
            quote_amount,
            woopool_to,
            &decimals_to,
            &state_to,
        )?;
        to_amount = _to_amount;
    }

    Ok(QueryResult {
        to_amount,
        swap_fee,
    })
}
