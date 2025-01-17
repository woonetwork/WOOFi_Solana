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
  var solPool;
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

      solPool = await woofiUtils.createPool(solTokenMint, usdcTokenMint, solFeedAccount, solPriceUpdate);
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
      console.log('solPool.tokenVault:{}', solPool.tokenVault);

      // TODO Prince: for test simplicity, change base to sol for test
      // const superCharger = await superChargerUtils.createSuperCharger(usdcPool.tokenVault);
      const superCharger = await superChargerUtils.createSuperCharger(solPool.tokenVault);

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

    it ("set interest rate", async() => {
      await superChargerUtils.setLendingManagerInterestRate(new BN(1000))
    })

    it("deposit", async () => {
      let depositAmount = new BN(0.05 * LAMPORTS_PER_SOL);

      const {
        userWeAccount,
        stakeVault,
        lendingManager
      } = await superChargerUtils.deposit(depositAmount, payerUser, payerWSOLTokenAccount);
      // TODO Prince: for test simplicity, change base to sol for test
      // if use USDC, should use payerUSDCTokenAccount

      const wsolTokenAccountBalance = await provider.connection.getTokenAccountBalance(payerWSOLTokenAccount);
      console.log("wsolTokenAccountBalance:" + wsolTokenAccountBalance.value.amount);

      const userWeAccountBalance = await provider.connection.getTokenAccountBalance(userWeAccount);
      console.log("userWeAccountBalance:" + userWeAccountBalance.value.amount);

      const stakeVaultBalance = await provider.connection.getTokenAccountBalance(stakeVault);
      console.log("stakeVaultBalance:" + stakeVaultBalance.value.amount);

      const lendingManagerData = await superChargerProgram.account.lendingManager.fetch(lendingManager);
      console.log('lendingManager borrowedPrinciple:' + lendingManagerData.borrowedPrincipal);
      console.log('lendingManager borrowedInterest:' + lendingManagerData.borrowedInterest);

      const woopoolTokenVaultBalance = await provider.connection.getTokenAccountBalance(lendingManagerData.woopoolTokenVault);
      console.log("woopoolTokenVaultBalance:" + woopoolTokenVaultBalance.value.amount);

    });

    // it ("setWoopoolTokenVault", async() => {
    //   solPool = await woofiUtils.createPool(solTokenMint, usdcTokenMint, solFeedAccount, solPriceUpdate);
    //   await superChargerUtils.setWoopoolTokenVault(solPool.tokenVault);
    // })

    it ("borrow", async() => {
      let borrowAmount = new BN(0.05 * LAMPORTS_PER_SOL);
      const {
        lendingManager,
        stakeVault,
        woopoolTokenVault,
      } = await superChargerUtils.borrow(borrowAmount);

      const stakeVaultBalance = await provider.connection.getTokenAccountBalance(stakeVault);
      console.log("stakeVaultBalance:" + stakeVaultBalance.value.amount);

      const lendingManagerData = await superChargerProgram.account.lendingManager.fetch(lendingManager);
      console.log('lendingManager borrowedPrinciple:' + lendingManagerData.borrowedPrincipal);
      console.log('lendingManager borrowedInterest:' + lendingManagerData.borrowedInterest);

      const woopoolTokenVaultBalance = await provider.connection.getTokenAccountBalance(woopoolTokenVault);
      console.log("woopoolTokenVaultBalance:" + woopoolTokenVaultBalance.value.amount);
    })

    it ("setLendingManagerAuthority", async() => {
      const {
        superChargerConfig,
        superCharger,
        lendingManager,
        stakeVault,
        weTokenMint,
        weTokenVault
      } = await superChargerUtils.generateSuperChargerPDAs();

      await woofiUtils.setLendingManagerAuthority([lendingManager]);
    })

    it ("repay", async() => {
      // TODO Prince: for test simplicity, change base to sol for test
      // if use USDC, should use usdcPoolParams
      const solPoolParams = await woofiUtils.generatePoolParams(solTokenMint, usdcTokenMint, solFeedAccount, solPriceUpdate);
      let repayAmount = new BN(0.04 * LAMPORTS_PER_SOL);
      const {
        lendingManager,
        stakeVault,
      } = await superChargerUtils.repay(
        repayAmount,
        solPoolParams.wooconfig,
        solPoolParams.woopool,
        solPoolParams.tokenVault,
        woofiProgram.programId
      );

      const stakeVaultBalance = await provider.connection.getTokenAccountBalance(stakeVault);
      console.log("stakeVaultBalance:" + stakeVaultBalance.value.amount);

      const lendingManagerData = await superChargerProgram.account.lendingManager.fetch(lendingManager);
      console.log('lendingManager borrowedPrinciple:' + lendingManagerData.borrowedPrincipal);
      console.log('lendingManager borrowedInterest:' + lendingManagerData.borrowedInterest);

      const woopoolTokenVaultBalance = await provider.connection.getTokenAccountBalance(solPoolParams.tokenVault);
      console.log("woopoolTokenVaultBalance:" + woopoolTokenVaultBalance.value.amount);
    })
  });

});
