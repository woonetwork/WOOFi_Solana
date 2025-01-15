import * as anchor from "@coral-xyz/anchor";
import { assert } from "chai";
import { SuperChargerUtils } from "./utils/super-charger-utils";

describe("super_charger", () => {
  const superChargerUtils = new SuperChargerUtils();
  superChargerUtils.initEnv();

  const provider = superChargerUtils.provider;
  const program = superChargerUtils.program;

  describe("#create_super_charger()", async () => {
    it("creates super charger config", async () => {
      const superChargerConfig = await superChargerUtils.createConfig();

      assert.ok(
        superChargerConfig.authority.equals(provider.wallet.publicKey)
      );
    });

    it("creates super charger", async () => {
      const testkey = anchor.web3.Keypair.generate();
      
      const superCharger = await superChargerUtils.createSuperCharger(testkey.publicKey);

      assert.ok(
        superCharger.authority.equals(provider.wallet.publicKey)
      );

    });

  });

});
