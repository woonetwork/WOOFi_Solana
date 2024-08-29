import { PriceFeed, PriceServiceConnection } from "@pythnetwork/price-service-client";
import { BN } from "@coral-xyz/anchor";
import moment from "moment";
import { SupportedToken } from "./test-consts";


export async function runQuery(): Promise<PriceFeed[] | undefined> {
    // Get the Stable Hermes service URL from https://docs.pyth.network/price-feeds/api-instances-and-providers/hermes
    const connection = new PriceServiceConnection("https://hermes.pyth.network");
    
    const priceIds = [
    "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d", // SOL/USD price id
    "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a", // USDC/USD price id
    ];
    
    // Get the latest values of the price feeds as JSON objects.
    return connection.getLatestPriceFeeds(priceIds);
}

export type PythPrice = {
    price: BN,
    decimal: number,
    updatedAt: moment.Moment,
    rangeMax: BN,
    rangeMin: BN,
}

export async function getPythPrice(token: SupportedToken): Promise<PythPrice> {
    const pythPriceFeed = await runQuery() ?? [];
    const solPrice = pythPriceFeed[0].getPriceNoOlderThan(1000);
    console.log("solPrice", solPrice);

    const usdcPrice = pythPriceFeed[1].getPriceNoOlderThan(1000);
    console.log("usdcPrice", usdcPrice);

    const tokenPrice = token == SupportedToken.SOL ? solPrice : usdcPrice;

    // use usdc as quote token
    const decimal = Math.abs(tokenPrice.expo);
    const price = new BN(tokenPrice.price).mul(new BN(10).pow(new BN(decimal))).div(new BN(usdcPrice.price));

    const updatedAt = moment.unix(tokenPrice.publishTime);

    console.log(`pythoracle_price:${price}`);
    console.log(`pythoracle_decimal:${decimal}`);
    console.log(`updated at - ${updatedAt}`);

    const rangeMax = price.mul(new BN(110)).div(new BN(100));
    const rangeMin = price.mul(new BN(90)).div(new BN(100));

    console.log('rangeMin: ', rangeMin.toNumber());
    console.log('rangeMax: ', rangeMax.toNumber());

    return {
        price,
        decimal,
        updatedAt,
        rangeMax,
        rangeMin,
    }
}