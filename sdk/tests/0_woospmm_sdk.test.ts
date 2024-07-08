import * as anchor from "@coral-xyz/anchor";
import { BN } from "@coral-xyz/anchor";
import { WoospmmtresClient } from "../src/client";
import { WoospmmtresContext } from "../src";
import { TOKEN_MINTS, CHAINLINK_FEED_ACCOUNT, WOOPOOL_VAULTS } from '../src/utils/constants'

describe("woospmm_sdk", async () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const context = WoospmmtresContext.from(provider.connection, provider.wallet);

  it("try_query", async ()=> {
    const result = await WoospmmtresClient.tryQuery(
      context,
      new BN(100000),
      new anchor.web3.PublicKey(TOKEN_MINTS.SOL),
      new anchor.web3.PublicKey(CHAINLINK_FEED_ACCOUNT.SOL),
      new anchor.web3.PublicKey(TOKEN_MINTS.USDC),
      new anchor.web3.PublicKey(CHAINLINK_FEED_ACCOUNT.USDC),
    )

    console.log('TryQuery to_amount:'+ result.to_amount);
    console.log('TryQuery swap_fee:'+ result.swap_fee);
    console.log('TryQuery swap_fee_amount:'+ result.swap_fee_amount);
  })

  // it("try_query_on_chain", async ()=> {
  //   const result = await WoospmmtresClient.tryQueryOnChain(
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
