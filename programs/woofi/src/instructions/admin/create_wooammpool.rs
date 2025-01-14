use crate::state::*;
use anchor_lang::prelude::*;

use crate::constants::*;

#[derive(Accounts)]
pub struct CreateWooAmmPool<'info> {
    pub wooconfig: Box<Account<'info, WooConfig>>,

    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = 8 + WooAmmPool::INIT_SPACE,
        constraint = wooconfig.authority == authority.key(),
        seeds = [
          WOOAMMPOOL_SEED.as_bytes(),
          wooconfig.key().as_ref(),
          woopool_a.token_mint.as_ref(),
          woopool_b.token_mint.as_ref(),
        ],
        bump)]
    pub wooammpool: Box<Account<'info, WooAmmPool>>,

    #[account(
        has_one = wooconfig,
        address = woopool_a.wooracle,
        constraint = wooracle_a.quote_token_mint == wooracle_b.quote_token_mint,
        constraint = wooracle_a.quote_feed_account == wooracle_b.quote_feed_account,
        constraint = wooracle_a.quote_price_update == wooracle_b.quote_price_update,
    )]
    wooracle_a: Account<'info, Wooracle>,
    #[account(
        has_one = wooconfig,
        constraint = woopool_a.authority == wooracle_a.authority,
        constraint = woopool_a.quote_token_mint == wooracle_a.quote_token_mint
    )]
    woopool_a: Box<Account<'info, WooPool>>,

    #[account(
        has_one = wooconfig,
        address = woopool_b.wooracle,
    )]
    wooracle_b: Account<'info, Wooracle>,
    #[account(
        has_one = wooconfig,
        constraint = woopool_b.authority == woopool_a.authority,
        constraint = woopool_b.authority == wooracle_b.authority,
        constraint = woopool_b.quote_token_mint == woopool_a.quote_token_mint,
        constraint = woopool_b.quote_token_mint == wooracle_b.quote_token_mint,
        constraint = woopool_b.token_mint != woopool_a.token_mint
    )]
    woopool_b: Box<Account<'info, WooPool>>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateWooAmmPool>) -> Result<()> {
    let wooconfig = ctx.accounts.wooconfig.key();
    let authority = ctx.accounts.authority.key();

    let wooammpool = &mut ctx.accounts.wooammpool;

    let wooracle_a = &ctx.accounts.wooracle_a;
    let woopool_a = &ctx.accounts.woopool_a;
    let wooracle_b = &ctx.accounts.wooracle_b;
    let woopool_b = &ctx.accounts.woopool_b;

    let bump = ctx.bumps.wooammpool;

    wooammpool.initialize(
        bump,
        wooconfig,
        authority,
        wooracle_a.key(),
        woopool_a.key(),
        wooracle_a.feed_account,
        wooracle_a.price_update,
        woopool_a.token_mint,
        woopool_a.token_vault,
        wooracle_b.key(),
        woopool_b.key(),
        wooracle_b.feed_account,
        wooracle_b.price_update,
        woopool_b.token_mint,
        woopool_b.token_vault,
        wooracle_a.quote_token_mint,
        wooracle_a.quote_feed_account,
        wooracle_a.quote_price_update,
    )

}
