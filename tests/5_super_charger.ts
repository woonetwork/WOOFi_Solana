import * as anchor from "@coral-xyz/anchor";
import * as borsh from "borsh";
import { BN, Program } from "@coral-xyz/anchor";
import * as token from "@solana/spl-token";
import { assert } from "chai";
import { SuperChargerUtils } from "./utils/super-charger-utils";
import { PoolUtils } from "./utils/pool";
import { solPriceUpdate, solTokenMint, SupportedToken, usdcPriceUpdate, usdcTokenMint } from "./utils/test-consts";
import { sendAndConfirm } from "./utils/web3";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

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
  var payerUser;
  var payerWSOLTokenAccount;
  var payerUSDCTokenAccount;

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

  describe("#user_operation()", async () => {
    payerUser = anchor.web3.Keypair.generate();

    it("send sol to user", async () => {
      const {
        wsolTokenAccount,
        usdcTokenAccount
      } = await superChargerUtils.increaseWSOL(payerUser);

      payerWSOLTokenAccount = wsolTokenAccount;
      payerUSDCTokenAccount = usdcTokenAccount;

      const wsolTokenAccountBalance = await provider.connection.getTokenAccountBalance(wsolTokenAccount);
      console.log("wsolTokenAccountBalance:" + wsolTokenAccountBalance.value.amount);
    });

    it("initialize user", async () => {
      const userState = await superChargerUtils.initializeUser(payerUser);

      console.log('user_id:{}', userState.userId);
      console.log('user:{}', userState.user);
      console.log('super_charger:{}', userState.superCharger);
      console.log('cost_share_price:{}', userState.costSharePrice);

      assert.ok(
        userState.user.equals(payerUser.publicKey)
      );
    });

    it("deposit", async () => {
      const {
        userWeAccount,
        stakeVault,
        lendingManager
      } = await superChargerUtils.deposit(payerUser, payerWSOLTokenAccount);

      const wsolTokenAccountBalance = await provider.connection.getTokenAccountBalance(payerWSOLTokenAccount);
      console.log("wsolTokenAccountBalance:" + wsolTokenAccountBalance.value.amount);

      const userWeAccountBalance = await provider.connection.getTokenAccountBalance(userWeAccount);
      console.log("userWeAccountBalance:" + userWeAccountBalance.value.amount);

      const stakeVaultBalance = await provider.connection.getTokenAccountBalance(stakeVault);
      console.log("stakeVaultBalance:" + stakeVaultBalance.value.amount);

      const lendingManagerData = await superChargerProgram.account.lendingManager.fetch(lendingManager);
      console.log('lendingManager borrowedPrinciple:' + lendingManagerData.borrowedPrincipal);
      console.log('lendingManager borrowedInterest:' + lendingManagerData.borrowedInterest);

    });
  });

});
