import * as anchor from "@coral-xyz/anchor";
import { BN } from "@coral-xyz/anchor";
import { WoofiClient } from "../src/client";
import { WoofiContext } from "../src";
import { WOOFI_TOKENS } from '../src/utils/constants'

describe("woofi_sdk", async () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const context = WoofiContext.from(provider.connection, provider.wallet);

  it("try_query", async ()=> {
    const result = await WoofiClient.tryQuery(
      context,
      new BN(100000),
      WOOFI_TOKENS['SOL'],
      WOOFI_TOKENS['USDC']
    )

    console.log('TryQuery to_amount:'+ result.to_amount);
    console.log('TryQuery swap_fee:'+ result.swap_fee);
    console.log('TryQuery swap_fee_amount:'+ result.swap_fee_amount);
  })

  // it("try_query_on_chain", async ()=> {
  //   const result = await WoofiClient.tryQueryOnChain(
  //     context,
  //     new BN(100),
  //     new anchor.web3.PublicKey(TOKEN_MINTS.SOL),
  //     new anchor.web3.PublicKey(CHAINLINK_FEED_ACCOUNT.SOL),
  //     new anchor.web3.PublicKey(TOKEN_MINTS.USDC),
  //     new anchor.web3.PublicKey(CHAINLINK_FEED_ACCOUNT.USDC),
  //   )

  //   console.log('TryQuery to_amount:'+ result.);
  //   console.log('TryQuery swap_fee:'+ result.swap_fee);
  //   console.log('TryQuery swap_fee_amount:'+ result.swap_fee_amount);
  // })
});
