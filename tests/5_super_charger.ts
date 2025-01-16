import * as anchor from "@coral-xyz/anchor";
import { assert } from "chai";
import { SuperChargerUtils } from "./utils/super-charger-utils";
import { PoolUtils } from "./utils/pool";
import { solPriceUpdate, solTokenMint, SupportedToken, usdcPriceUpdate, usdcTokenMint } from "./utils/test-consts";

describe("super_charger", () => {
  const provider = anchor.AnchorProvider.env();

  const woofiUtils = new PoolUtils();
  woofiUtils.initEnv();
  const woofiProgram = woofiUtils.program;

  // SOL/USD
  const solFeedAccount = woofiUtils.solFeedAccount;
  // USDC/USD
  const usdcFeedAccount = woofiUtils.usdcFeedAccount;
  const quoteFeedAccount = usdcFeedAccount;

  var usdcPool;

  const superChargerUtils = new SuperChargerUtils();
  superChargerUtils.initEnv();
  const superChargerProgram = superChargerUtils.program;

  describe("#create_woofi()", async () => {
    it("create woofi config", async () => {
      const wooconfig = await woofiUtils.createConfig();

      assert.ok(
        wooconfig.authority.equals(provider.wallet.publicKey)
      );
    });

    it("creates usdc pool", async () => {
      let usdcOracle = await woofiUtils.createWooracle(SupportedToken.USDC, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);
      assert.ok(
        usdcOracle.authority.equals(provider.wallet.publicKey)
      );

      usdcPool = await woofiUtils.createPool(usdcTokenMint, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);
      assert.ok(
        usdcPool.authority.equals(provider.wallet.publicKey)
      );
    });

    it("creates sol pool", async () => {
      let solOracle = await woofiUtils.createWooracle(SupportedToken.SOL, solTokenMint, solFeedAccount, solPriceUpdate);
      assert.ok(
        solOracle.authority.equals(provider.wallet.publicKey)
      );

      let solPool = await woofiUtils.createPool(solTokenMint, usdcTokenMint, solFeedAccount, solPriceUpdate);
      assert.ok(
        solPool.authority.equals(provider.wallet.publicKey)
      );
    });

  });

  describe("#create_super_charger()", async () => {
    it("create super charger config", async () => {
      const superChargerConfig = await superChargerUtils.createConfig();

      assert.ok(
        superChargerConfig.authority.equals(provider.wallet.publicKey)
      );
    });

    it("create super charger", async () => {
      console.log('usdcPool.tokenVault:{}', usdcPool.tokenVault);

      const superCharger = await superChargerUtils.createSuperCharger(usdcPool.tokenVault);

      assert.ok(
        superCharger.authority.equals(provider.wallet.publicKey)
      );

    });

  });

});
