use anchor_lang::prelude::*;
use pyth_solana_receiver_sdk::price_update::PriceUpdateV2;

use crate::WOOracle;

#[derive(Accounts)]
pub struct UpdateOracle<'info> {
    #[account(
        mut,
        constraint = oracle.price_update == price_update.key(),
        has_one = authority,
    )]
    oracle: Account<'info, WOOracle>,
    authority: Signer<'info>,
    // Add this account to any instruction Context that needs price data.
    // Warning:
    // users must ensure that the account passed to their instruction is owned by the Pyth pull oracle program.
    // Using Anchor with the Account<'info, PriceUpdateV2> type will automatically perform this check.
    // However, if you are not using Anchor, it is your responsibility to perform this check.
    pub price_update: Account<'info, PriceUpdateV2>,
}

pub fn handler(ctx: Context<UpdateOracle>) -> Result<()> {
    update(&mut ctx.accounts.price_update, &mut ctx.accounts.oracle)
}

pub fn update<'info>(
    price_update: &mut Account<'info, PriceUpdateV2>,
    oracle: &mut Account<'info, WOOracle>,
) -> Result<()> {
    // get_price_no_older_than will fail if the price update is more than 30 seconds old
    // 30s has been stored in oracle's param maximum_age
    // the sponsored feed's update time is not stable in dev env. need set based on needs.
    let maximum_age = oracle.maximum_age;
    // get_price_no_older_than will fail if the price update is for a different price feed.
    // This string is the id of the BTC/USD feed. See https://pyth.network/developers/price-feed-ids for all available ids.
    //let feed_id = get_feed_id_from_hex(ctx.accounts.feed_account.key().to_string().as_str())?;
    let price = price_update.get_price_no_older_than(
        &Clock::get()?,
        maximum_age,
        &oracle.feed_account.key().to_bytes(),
    )?;
    // Sample output:
    // The price is (7160106530699 ± 5129162301) * 10^-8
    // msg!("The price is ({} ± {}) * 10^{}", price.price, price.conf, price.exponent);

    oracle.decimals = price.exponent.abs().try_into().unwrap();
    oracle.round = price.price as i128;
    oracle.updated_at = price.publish_time;

    Ok(())
}
