import { createJupiterApiClient, QuoteGetRequest } from '@jup-ag/api';
import * as anchor from "@coral-xyz/anchor";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { TOKEN_MINTS, WOOFI_TOKENS } from '../src/utils/constants'
import { WoofiClient } from "./client";
import { WoofiContext } from "./context";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const jupiterQuoteApi = createJupiterApiClient();

export async function quoteFromJupiter() {
    const sellParams: QuoteGetRequest = {
        inputMint: TOKEN_MINTS['SOL'],
        outputMint: TOKEN_MINTS['USDC'],
        amount: 1000000000, // 1 SOL
        autoSlippage: true,
        autoSlippageCollisionUsdValue: 1_000,
        maxAutoSlippageBps: 1000, // 10%
        minimizeSlippage: true,
        onlyDirectRoutes: false,
        asLegacyTransaction: false,
    };
    const sellQuote = await jupiterQuoteApi.quoteGet(sellParams);

    const buyParams: QuoteGetRequest = {
        inputMint: TOKEN_MINTS['USDC'],
        outputMint: TOKEN_MINTS['SOL'],
        amount: 160000000, // 160 USDC
        autoSlippage: true,
        autoSlippageCollisionUsdValue: 1_000,
        maxAutoSlippageBps: 1000, // 10%
        minimizeSlippage: true,
        onlyDirectRoutes: false,
        asLegacyTransaction: false,
    };
    
    const buyQuote = await jupiterQuoteApi.quoteGet(buyParams);

    // console.log(quote);
    return {
        sellPrice: parseFloat(sellQuote.outAmount) / 1e6,
        buyPrice: 160 * 1e9 / parseFloat(buyQuote.outAmount),
    }
}

export async function quoteFromWOOFi() {  
    // Configure the client to use the local cluster.
    const connection = new Connection("https://api.mainnet-beta.solana.com");
    // generate a new wallet
    const wallet = anchor.Wallet.local();
    // const envProvider = anchor.AnchorProvider.env()
    const provider = new anchor.AnchorProvider(connection, wallet, { commitment: 'confirmed' });
    anchor.setProvider(provider);

    const context = WoofiContext.from(provider.connection, provider.wallet);

    const sellResult = await WoofiClient.tryQuery(
        context,
        new BN(1000000000),
        WOOFI_TOKENS['SOL'],
        WOOFI_TOKENS['USDC']
    )

    await sleep(30000);

    const buyResult = await WoofiClient.tryQuery(
        context,
        new BN(160000000),
        WOOFI_TOKENS['USDC'],
        WOOFI_TOKENS['SOL']
    )
  
    // console.log('TryQuery to_amount:'+ result.to_amount);
    // console.log('TryQuery swap_fee:'+ result.swap_fee);

    return {
        sellPrice: sellResult.to_amount.toNumber() / 1e6,
        buyPrice: 160 * 1e9 / buyResult.to_amount.toNumber(),
    }
}

export async function main() {
    while (true) {

        try {
            const jupiterPrice = await quoteFromJupiter();
            const woofiPrice = await quoteFromWOOFi();
            const sellDiff = (jupiterPrice.sellPrice - woofiPrice.sellPrice) / jupiterPrice.sellPrice * 100;
            const buyDiff = (jupiterPrice.buyPrice - woofiPrice.buyPrice) / jupiterPrice.buyPrice * 100;

            console.log(`jupiter sell: ${jupiterPrice.sellPrice.toFixed(3)}, woofi sell: ${woofiPrice.sellPrice.toFixed(3)}, price diff: ${sellDiff}`);
            console.log(`jupiter buy: ${jupiterPrice.buyPrice.toFixed(3)}, woofi buy: ${woofiPrice.buyPrice.toFixed(3)}, price diff: ${buyDiff}`);
        } catch (error) {
            console.log('price fetch error');
        }

        await sleep(30000);
    }
}

main();
