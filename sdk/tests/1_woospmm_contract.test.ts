import * as anchor from "@coral-xyz/anchor";
import { BN } from "@coral-xyz/anchor";
import { WoofiClient } from "../src/client";
import { WoofiContext } from "../src";
import { PYTH_FEED_ACCOUNT, PYTH_PRICE_UPDATE_ACCOUNT, TOKEN_MINTS } from '../src/utils/constants'
import { generatePoolParams, getWooPrice } from "../src/utils/contract";

describe("woofi_sdk", async () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const ctx = WoofiContext.from(provider.connection, provider.wallet);

  it("get_price_sol", async ()=> {
    const poolParams = await generatePoolParams(
      new anchor.web3.PublicKey(PYTH_FEED_ACCOUNT['SOL']), 
      new anchor.web3.PublicKey(TOKEN_MINTS['SOL']),
      new anchor.web3.PublicKey(PYTH_PRICE_UPDATE_ACCOUNT['SOL']),
      ctx.program);

    const wooracle = await ctx.program.account.woOracle.fetch(poolParams.wooracle);
    const oracle = await ctx.program.account.oracle.fetch(poolParams.oracle);

    const result = await getWooPrice(oracle, wooracle);

    console.log('Get price price_out:'+ result.price_out);
    console.log('Get price feasible_out:'+ result.feasible_out);
  })

  it("get_price_usdc", async ()=> {
    const poolParams = await generatePoolParams(
      new anchor.web3.PublicKey(PYTH_FEED_ACCOUNT['USDC']), 
      new anchor.web3.PublicKey(TOKEN_MINTS['USDC']),
      new anchor.web3.PublicKey(PYTH_PRICE_UPDATE_ACCOUNT['USDC']),
      ctx.program);

    const wooracle = await ctx.program.account.woOracle.fetch(poolParams.wooracle);
    const oracle = await ctx.program.account.oracle.fetch(poolParams.oracle);

    const result = await getWooPrice(oracle, wooracle);

    console.log('Get price price_out:'+ result.price_out);
    console.log('Get price feasible_out:'+ result.feasible_out);
  })
});
