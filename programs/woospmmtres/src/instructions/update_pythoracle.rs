use anchor_lang::prelude::*;
use pyth_solana_receiver_sdk::price_update::PriceUpdateV2;

use crate::state::oracle::*;

#[derive(Accounts)]
pub struct UpdatePythOracle<'info> {
    #[account(
        mut,
        constraint = pythoracle.price_update_account == price_update.key(),
        has_one = authority,
    )]
    pythoracle: Account<'info, Oracle>,
    authority: Signer<'info>,
    // Add this account to any instruction Context that needs price data.
    // Warning: 
    // users must ensure that the account passed to their instruction is owned by the Pyth pull oracle program.
    // Using Anchor with the Account<'info, PriceUpdateV2> type will automatically perform this check. 
    // However, if you are not using Anchor, it is your responsibility to perform this check.
    pub price_update: Account<'info, PriceUpdateV2>,
}

pub fn handler(ctx: Context<UpdatePythOracle>) -> Result<()> {
    let price_update = &mut ctx.accounts.price_update;
    // get_price_no_older_than will fail if the price update is more than 30 seconds old
    // TODO Prince: move the 30s to config later
    // TODO Prince: need take action here, the sponsored feed's update time is not stable, change to 60s for now.
    let maximum_age: u64 = 60;
    // get_price_no_older_than will fail if the price update is for a different price feed.
    // This string is the id of the BTC/USD feed. See https://pyth.network/developers/price-feed-ids for all available ids.
    //let feed_id = get_feed_id_from_hex(ctx.accounts.feed_account.key().to_string().as_str())?;
    let price = price_update.get_price_no_older_than(&Clock::get()?, maximum_age, &ctx.accounts.pythoracle.feed_account.key().to_bytes())?;
    // Sample output:
    // The price is (7160106530699 ± 5129162301) * 10^-8
    // msg!("The price is ({} ± {}) * 10^{}", price.price, price.conf, price.exponent);

    ctx.accounts.pythoracle.decimals = price.exponent.abs().try_into().unwrap();
    ctx.accounts.pythoracle.round = price.price as i128;
    ctx.accounts.pythoracle.updated_at = price.publish_time;

    Ok(())
}