import * as anchor from "@coral-xyz/anchor";
import { WoofiContext } from "../src";
import { PYTH_FEED_ACCOUNT, PYTH_PRICE_UPDATE_ACCOUNT, TOKEN_MINTS, WOOFI_TOKENS } from '../src/utils/constants'
import { generatePoolParams, getWooPrice } from "../src/utils/contract";

describe("woofi_sdk", async () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const ctx = WoofiContext.from(provider.connection, provider.wallet);

  it("get_price_sol", async ()=> {
    const poolParams = await generatePoolParams(
      new anchor.web3.PublicKey(TOKEN_MINTS['SOL']),
      new anchor.web3.PublicKey(TOKEN_MINTS['USDC']),
      new anchor.web3.PublicKey(PYTH_FEED_ACCOUNT['SOL']), 
      new anchor.web3.PublicKey(PYTH_PRICE_UPDATE_ACCOUNT['SOL']),
      ctx.program);

    const wooracle = await ctx.program.account.woOracle.fetch(poolParams.wooracle);

    const result = await getWooPrice(WOOFI_TOKENS.SOL, wooracle);

    console.log('Get price price_out:'+ result.price_out);
    console.log('Get price feasible_out:'+ result.feasible_out);
  })

  it("get_price_usdc", async ()=> {
    const poolParams = await generatePoolParams(
      new anchor.web3.PublicKey(TOKEN_MINTS['USDC']),
      new anchor.web3.PublicKey(TOKEN_MINTS['USDC']),
      new anchor.web3.PublicKey(PYTH_FEED_ACCOUNT['USDC']), 
      new anchor.web3.PublicKey(PYTH_PRICE_UPDATE_ACCOUNT['USDC']),
      ctx.program);

    const wooracle = await ctx.program.account.woOracle.fetch(poolParams.wooracle);

    const result = await getWooPrice(WOOFI_TOKENS.USDC, wooracle);

    console.log('Get price price_out:'+ result.price_out);
    console.log('Get price feasible_out:'+ result.feasible_out);
  })
});
