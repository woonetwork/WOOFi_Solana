import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { ConfirmOptions, Transaction } from "@solana/web3.js";
import { assert } from "chai";
import { PoolUtils } from "./utils/pool";
import { confirmOptionsRetryTres, solPriceUpdate, solTokenMint } from "./utils/test-consts";

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

  let wooracleAccount: anchor.web3.PublicKey;

  describe("#set_woo_state()", async () => {
    it("set woo oracle state", async () => {

      const setSpread = new BN(800);

      const [wooracle] = await anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('wooracle'), solTokenMint.toBuffer(), solFeedAccount.toBuffer(), solPriceUpdate.toBuffer()],
        program.programId
      );

      wooracleAccount = wooracle;

      const adminWallet = anchor.web3.Keypair.generate();

      console.log('Set admin authority to:', adminWallet.publicKey);
      await program
        .methods
        .setWooAdmin(adminWallet.publicKey)
        .accounts({
          wooracle: wooracleAccount,
          authority: provider.wallet.publicKey,
        })
        .rpc(confirmOptionsRetryTres);

      const adminSetTranscation = new Transaction().add(
        await program
          .methods
          .setWooSpread(setSpread)
          .accounts({
            wooracle: wooracleAccount,
            authority: adminWallet.publicKey
          }).instruction()
      );

      await provider.sendAndConfirm(adminSetTranscation, [adminWallet], { commitment: "confirmed" });
      
      const result = await program.account.woOracle.fetch(wooracleAccount);
      console.log(`spread - ${result.spread}`);
      assert.ok(
        result.spread.eq(setSpread), "wooracle spread should be the same with setted"
      );

      console.log('Set admin authority to:', provider.wallet.publicKey);
      await program
        .methods
        .setWooAdmin(provider.wallet.publicKey)
        .accounts({
          wooracle: wooracleAccount,
          authority: provider.wallet.publicKey,
        })
        .rpc(confirmOptionsRetryTres);

    });
  });
  
});
