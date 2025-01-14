import * as anchor from "@coral-xyz/anchor";
import { getLogs } from "@solana-developers/helpers";
import { assert } from "chai";
import { PoolUtils } from "./utils/pool";
import { usdcTokenMint, solTokenMint, solPriceUpdate, usdcPriceUpdate } from "./utils/test-consts";

describe("wooammpool", () => {
  const poolUtils = new PoolUtils();
  poolUtils.initEnv();

  const provider = poolUtils.provider;
  const program = poolUtils.program;

  // SOL/USD
  const solFeedAccount = poolUtils.solFeedAccount;
  // USDC/USD
  const usdcFeedAccount = poolUtils.usdcFeedAccount;
  const quoteFeedAccount = usdcFeedAccount;

  describe("#create_wooammpool()", async () => {
    it("creates woo amm pool", async () => {
      const solPoolParams = await poolUtils.generatePoolParams(solTokenMint, usdcTokenMint, solFeedAccount, solPriceUpdate);
      const usdcPoolParams = await poolUtils.generatePoolParams(usdcTokenMint, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);
      const wooconfig = solPoolParams.wooconfig;

      const [wooammpool] = await anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from('wooammpool'), wooconfig.toBuffer(), solTokenMint.toBuffer(), usdcTokenMint.toBuffer()],
          program.programId
        );

      let wooammpoolData = null;
      try {
        wooammpoolData = await program.account.wooAmmPool.fetch(wooammpool);
      } catch (e) {
        const error = e as Error;
        if (error.message.indexOf("Account does not exist") >= 0) {
          const tx = await program
                      .methods
                      .createWooAmmPool()
                      .accounts({
                        wooconfig,
                        wooammpool,
                        wooracleA: solPoolParams.wooracle,
                        woopoolA: solPoolParams.woopool,
                        wooracleB: usdcPoolParams.wooracle,
                        woopoolB: usdcPoolParams.woopool
                      })
                      .transaction();

          tx.recentBlockhash = (await provider.connection.getLatestBlockhash()).blockhash;
          console.log('tx.recentBlockhash', tx.recentBlockhash);
          const sig = await provider.sendAndConfirm(tx);

          const logs = await getLogs(provider.connection, sig);
          console.log(logs);
        }
      }
  
      if (wooammpoolData == null) {
        wooammpoolData = await program.account.wooAmmPool.fetch(wooammpool);
      }
  
      assert.ok(
        wooammpoolData.authority.equals(provider.wallet.publicKey)
      );

      assert.ok(
        wooammpoolData.wooracleA.equals(solPoolParams.wooracle)
      );

      assert.ok(
        wooammpoolData.woopoolA.equals(solPoolParams.woopool)
      );

      assert.ok(
        wooammpoolData.feedAccountA.equals(solFeedAccount)
      );

      assert.ok(
        wooammpoolData.priceUpdateA.equals(solPriceUpdate)
      );

      assert.ok(
        wooammpoolData.wooracleB.equals(usdcPoolParams.wooracle)
      );

      assert.ok(
        wooammpoolData.woopoolB.equals(usdcPoolParams.woopool)
      );

      assert.ok(
        wooammpoolData.feedAccountB.equals(usdcFeedAccount)
      );

      assert.ok(
        wooammpoolData.priceUpdateB.equals(usdcPriceUpdate)
      );

    });
  });

});
