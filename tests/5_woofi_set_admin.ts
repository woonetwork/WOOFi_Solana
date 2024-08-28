import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { assert } from "chai";
import { PoolUtils } from "./utils/pool";
import { solTokenMint, solPriceUpdate, confirmOptionsRetryTres } from "./utils/test-consts";

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

  describe("#set_woo_admin()", async () => {
    it("set woo oracle admin", async () => {

      const setSpread = new BN(800);

      const [wooracle] = await anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('wooracle'), solTokenMint.toBuffer(), solFeedAccount.toBuffer(), solPriceUpdate.toBuffer()],
        program.programId
      );

      wooracleAccount = wooracle;

      const adminPublicKey = new anchor.web3.PublicKey("EW4E3yBnijzDjoyBpDkgQkJ48Yd6cmponxRsuUT2Cinn");

      console.log('Set admin authority to:', adminPublicKey);
      await program
        .methods
        .setWooAdmin(adminPublicKey)
        .accounts({
          wooracle: wooracleAccount,
          authority: provider.wallet.publicKey,
        })
        .rpc(confirmOptionsRetryTres);
      
      const result = await program.account.woOracle.fetch(wooracleAccount);
      console.log(`admin authority: ${result.adminAuthority}`);
      assert.ok(
        result.adminAuthority.equals(adminPublicKey), "wooracle admin authority should be the same with setted"
      );

    });
  });
  
});
