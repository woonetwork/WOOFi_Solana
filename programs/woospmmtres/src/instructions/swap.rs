use std::cmp::max;

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::{
    constants::*,
    errors::ErrorCode,
    state::*,
    instructions::*,
    util::*
};

#[derive(Accounts)]
pub struct Swap<'info> {
    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,

    pub owner: Signer<'info>,

    #[account(
        constraint = cloracle_from.key() == woopool_from.cloracle
    )]
    cloracle_from: Account<'info, CLOracle>,
    #[account(
        seeds = [
            WOORACLE_SEED.as_bytes(),
            cloracle_from.chainlink_feed.as_ref()
        ],
        bump,
        constraint = wooracle_from.key() == woopool_from.wooracle
    )]
    wooracle_from: Account<'info, WOOracle>,
    woopool_from: Box<Account<'info, WooPool>>,
    #[account(mut,
        has_one = owner,
        constraint = token_owner_account_from.mint == woopool_from.token_mint
    )]
    token_owner_account_from: Box<Account<'info, TokenAccount>>,
    #[account(mut, 
        address = woopool_from.token_vault
    )]
    token_vault_from: Box<Account<'info, TokenAccount>>,

    #[account(
        constraint = cloracle_to.key() == woopool_to.cloracle
    )]
    cloracle_to: Account<'info, CLOracle>,
    #[account(
        seeds = [
            WOORACLE_SEED.as_bytes(),
            cloracle_to.chainlink_feed.as_ref()
        ],
        bump,
        constraint = wooracle_to.key() == woopool_to.wooracle
    )]
    wooracle_to: Account<'info, WOOracle>,
    woopool_to: Box<Account<'info, WooPool>>,
    #[account(mut,
        has_one = owner,
        constraint = token_owner_account_to.mint == woopool_to.token_mint
    )]
    token_owner_account_to: Box<Account<'info, TokenAccount>>,
    #[account(mut, 
        address = woopool_to.token_vault
    )]
    token_vault_to: Box<Account<'info, TokenAccount>>,
}

pub fn handler(ctx: Context<Swap>, from_amount: u128) -> Result<()> {
    // TODO Prince: check from_amount upper, total amount limit in one swap
    // TODO Prince: use checked_mul checked_div in math

    let token_owner_account_from = &ctx.accounts.token_owner_account_from;
    require!(token_owner_account_from.amount as u128 >= from_amount, ErrorCode::NotEnoughBalance);
    
    let token_vault_from = &ctx.accounts.token_vault_from;
    let token_owner_account_to = &ctx.accounts.token_owner_account_to;
    let token_vault_to = &ctx.accounts.token_vault_to;

    let cloracle_from = &ctx.accounts.cloracle_from;
    let wooracle_from = &mut ctx.accounts.wooracle_from;
    let woopool_from = &mut ctx.accounts.woopool_from;

    let mut state_from = get_price::get_state_impl(cloracle_from, wooracle_from)?;

    let cloracle_to = &ctx.accounts.cloracle_to;
    let wooracle_to = &mut ctx.accounts.wooracle_to;
    let woopool_to = &ctx.accounts.woopool_to;

    let mut state_to = get_price::get_state_impl(cloracle_to, wooracle_to)?;

    let spread = max(state_from.spread, state_to.spread);
    let fee_rate = max(woopool_from.fee_rate, woopool_to.fee_rate);

    state_from.spread = spread;
    state_to.spread = spread;

    let decimals_from = Decimals::new(
        DEFAULT_PRICE_DECIMALS, 
        DEFAULT_QUOTE_DECIMALS,
        cloracle_from.decimals as u32);

    let swap_fee_amount = checked_mul_div(from_amount, fee_rate as u128, TE5U128)?;
    let remain_amount = swap_fee_amount.checked_sub(swap_fee_amount).unwrap();
    
    let (remain_usd_amount, from_new_price) = swap_math::calc_usd_amount_sell_base(
        remain_amount, 
        woopool_from, 
        &decimals_from, 
        &state_from)?;
    
    // TODO Prince: we currently subtract fee on coin, can enable below when we have base usd
    // let (usd_amount, _) = swap_math::calc_usd_amount_sell_base(
    //     from_amount, 
    //     woopool_from, 
    //     &decimals_from, 
    //     wooracle_from.coeff, 
    //     spread, 
    //     &price_from)?;
    
    // let swap_fee = checked_mul_div(usd_amount, fee_rate as u128, TE5U128)?;
    // let remain_amount = usd_amount.checked_sub(swap_fee).unwrap();

    let decimals_to = Decimals::new(
        DEFAULT_PRICE_DECIMALS, 
        DEFAULT_QUOTE_DECIMALS,
        cloracle_to.decimals as u32);

    let (to_amount, to_new_price) = swap_math::calc_base_amount_sell_usd(
        remain_usd_amount, 
        woopool_to, 
        &decimals_to, 
        &state_to)?;

    require!(token_vault_to.amount as u128 >= to_amount, ErrorCode::NotEnoughOut);

    // TODO Prince:
    // we have from_amount, to_amount, swap_fee_amount here
    // we can do the pool balance check before real swap

    // record fee into account
    // TODO Prince: check all unwrap, should throw Error out
    woopool_from.add_protocol_fee(swap_fee_amount).unwrap();

    wooracle_from.post_price(from_new_price);
    wooracle_to.post_price(to_new_price);

    transfer_from_owner_to_vault(
        &ctx.accounts.owner,
        &token_owner_account_from,
        &token_vault_from,
        &ctx.accounts.token_program,
        from_amount as u64,
    )?;

    transfer_from_vault_to_owner(
        &woopool_to,
        &token_vault_to,
        &token_owner_account_to,
        &ctx.accounts.token_program,
        to_amount as u64,
    )?;

    Ok(())
}