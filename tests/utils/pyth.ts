import { PriceFeed, PriceServiceConnection } from "@pythnetwork/price-service-client";

export async function runQuery(): Promise<PriceFeed[]> {
    // Get the Stable Hermes service URL from https://docs.pyth.network/price-feeds/api-instances-and-providers/hermes
    const connection = new PriceServiceConnection("https://hermes.pyth.network");
    
    const priceIds = [
    "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d", // SOL/USD price id
    "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a", // USDC/USD price id
    ];
    
    // Get the latest values of the price feeds as JSON objects.
    return connection.getLatestPriceFeeds(priceIds);
}