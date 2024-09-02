import * as anchor from "@coral-xyz/anchor";
import { assert } from "chai";
import { PoolUtils } from "./utils/pool";
import { usdcTokenMint, solTokenMint, solPriceUpdate, usdcPriceUpdate, confirmOptionsRetryTres } from "./utils/test-consts";


describe("woofi", () => {
  const poolUtils = new PoolUtils();
  poolUtils.initEnv();

  const provider = poolUtils.provider;
  const program = poolUtils.program;

  // SOL/USD
  const solFeedAccount = poolUtils.solFeedAccount;
  // USDC/USD
  const usdcFeedAccount = poolUtils.usdcFeedAccount;
  const quoteFeedAccount = usdcFeedAccount;

  const adminPublicKey = new anchor.web3.PublicKey("EW4E3yBnijzDjoyBpDkgQkJ48Yd6cmponxRsuUT2Cinn");

  describe("#set_sol_woo_admin()", async () => {
    it("set sol woo oracle admin", async () => {

      const solPoolParams = await poolUtils.generatePoolParams(solTokenMint, usdcTokenMint, solFeedAccount, solPriceUpdate);
      console.log('Set sol wooracle admin authority to:', adminPublicKey);
      await program
        .methods
        .setWooAdmin(adminPublicKey)
        .accounts({
          wooracle: solPoolParams.wooracle,
          authority: provider.wallet.publicKey,
        })
        .rpc(confirmOptionsRetryTres);
      
      const result = await program.account.woOracle.fetch(solPoolParams.wooracle);
      console.log(`admin authority: ${result.adminAuthority}`);
      assert.ok(
        result.adminAuthority.equals(adminPublicKey), "wooracle admin authority should be the same with setted"
      );

    });
  });

  describe("#set_usdc_woo_admin()", async () => {
    it("set usdc woo oracle admin", async () => {

      const usdcPoolParams = await poolUtils.generatePoolParams(usdcTokenMint, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);

      console.log('Set usdc wooracle admin authority to:', adminPublicKey);
      await program
        .methods
        .setWooAdmin(adminPublicKey)
        .accounts({
          wooracle: usdcPoolParams.wooracle,
          authority: provider.wallet.publicKey,
        })
        .rpc(confirmOptionsRetryTres);
      
      const result = await program.account.woOracle.fetch(usdcPoolParams.wooracle);
      console.log(`admin authority: ${result.adminAuthority}`);
      assert.ok(
        result.adminAuthority.equals(adminPublicKey), "wooracle admin authority should be the same with setted"
      );

    });
  });

  describe("#set_sol_pool_admin()", async () => {
    it("set sol pool admin", async () => {

      const usdcPoolParams = await poolUtils.generatePoolParams(usdcTokenMint, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);

      console.log('Set sol pol admin authority to:', adminPublicKey);
      await program
        .methods
        .setPoolAdmin(adminPublicKey)
        .accounts({
          woopool: usdcPoolParams.woopool,
          authority: provider.wallet.publicKey,
        })
        .rpc(confirmOptionsRetryTres);
      
      const result = await program.account.wooPool.fetch(usdcPoolParams.woopool);
      console.log(`admin authority: ${result.adminAuthority}`);
      assert.ok(
        result.adminAuthority.equals(adminPublicKey), "woopool admin authority should be the same with setted"
      );

    });
  });

  describe("#set_usdc_pool_admin()", async () => {
    it("set usdc pool admin", async () => {

      const solPoolParams = await poolUtils.generatePoolParams(solTokenMint, usdcTokenMint, solFeedAccount, solPriceUpdate);

      console.log('Set sol pol admin authority to:', adminPublicKey);
      await program
        .methods
        .setPoolAdmin(adminPublicKey)
        .accounts({
          woopool: solPoolParams.woopool,
          authority: provider.wallet.publicKey,
        })
        .rpc(confirmOptionsRetryTres);
      
      const result = await program.account.wooPool.fetch(solPoolParams.woopool);
      console.log(`admin authority: ${result.adminAuthority}`);
      assert.ok(
        result.adminAuthority.equals(adminPublicKey), "woopool admin authority should be the same with setted"
      );

    });
  });

});
