import * as anchor from "@coral-xyz/anchor";
import * as borsh from "borsh";
import { BN, Program } from "@coral-xyz/anchor";
import * as token from "@solana/spl-token";
import { LAMPORTS_PER_SOL, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { airdropIfRequired, getLogs } from "@solana-developers/helpers";
import { assert } from "chai";
import { createAssociatedTokenAccount, transferToken } from "./utils/token";
import { PoolUtils } from "./utils/pool";
import { getCluster } from "./global";
import { usdcTokenMint, solTokenMint, solPriceUpdate, usdcPriceUpdate, confirmOptionsRetryTres, SupportedToken } from "./utils/test-consts";

describe("woofi_swap", () => {
  const poolUtils = new PoolUtils();
  poolUtils.initEnv();

  const provider = poolUtils.provider;
  const program = poolUtils.program;

  // SOL/USD
  const solFeedAccount = poolUtils.solFeedAccount;
  // USDC/USD
  const usdcFeedAccount = poolUtils.usdcFeedAccount;
  const quoteFeedAccount = usdcFeedAccount;

  // Note: test account only in devnet
  const keypair = anchor.web3.Keypair.fromSecretKey(
    Uint8Array.from([
        14, 134,  28, 211,  88,  74,  30, 241,  77, 166,  34,
        106, 198, 235, 100, 159,  82, 127,  72,  10, 101, 146,
        137,  83,  43,  25,  38,  10,  26, 217, 248,  64, 165,
        109,  48, 119, 128,  14, 170,  92,  99,  37,  71,  77,
         90, 116,  13,  67, 176, 214,   9,  47,  46, 103, 197,
        222,  76, 186, 193, 143, 114, 203, 154, 225
    ]),
  )

  // for swap test usage,
  // swap payer wallet
  const fromWallet = anchor.web3.Keypair.generate();

  let signers: anchor.web3.Keypair[] = [fromWallet];
  let ataSigner: anchor.web3.Keypair[] = [];
  // if (getCluster() == 'localnet') {
  //   signers.push(keypair);
  //   ataSigner.push(keypair);
  // }
  let payerSolTokenAccount: anchor.web3.PublicKey;
  let payerUsdcTokenAccount: anchor.web3.PublicKey;

  describe("#create_usdc_pool()", async () => {
    it("creates usdc pool", async () => {
      let usdcOracle = await poolUtils.createWooracle(SupportedToken.USDC, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);
      assert.ok(
        usdcOracle.authority.equals(provider.wallet.publicKey)
      );

      let usdcPool = await poolUtils.createPool(usdcTokenMint, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);
      assert.ok(
        usdcPool.authority.equals(provider.wallet.publicKey)
      );
    });
  });

  describe("#create_sol_pool()", async () => {
    it("creates sol pool", async () => {
      let solOracle = await poolUtils.createWooracle(SupportedToken.SOL, solTokenMint, solFeedAccount, solPriceUpdate);
      assert.ok(
        solOracle.authority.equals(provider.wallet.publicKey)
      );

      let solPool = await poolUtils.createPool(solTokenMint, usdcTokenMint, solFeedAccount, solPriceUpdate);
      assert.ok(
        solPool.authority.equals(provider.wallet.publicKey)
      );
    });
  });

  describe("#get_price_from_contract", async ()=> {
    it("get_sol_price", async ()=> {
      const fromPoolParams = await poolUtils.generatePoolParams(solTokenMint, usdcTokenMint, solFeedAccount, solPriceUpdate);

      // init set wooracle range min and max
      const oracleItemData = await program.account.wooracle.fetch(fromPoolParams.wooracle);
      console.log('wooracle price:', oracleItemData.price.toNumber());
      console.log('wooracle rangeMin:', oracleItemData.rangeMin.toNumber());
      console.log('wooracle rangeMax:', oracleItemData.rangeMax.toNumber());

      const [fromPrice, fromFeasible] = await poolUtils.getOraclePriceResult(fromPoolParams.wooconfig, fromPoolParams.wooracle, solPriceUpdate, usdcPriceUpdate);
      console.log(`price - ${fromPrice}`);
      console.log(`feasible - ${fromFeasible}`);
    })

    it("get_usdc_price", async ()=> {
      const toPoolParams = await poolUtils.generatePoolParams(usdcTokenMint, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);

      // init set wooracle range min and max
      const oracleItemData = await program.account.wooracle.fetch(toPoolParams.wooracle);
      console.log('wooracle price:', oracleItemData.price.toNumber());
      console.log('wooracle rangeMin:', oracleItemData.rangeMin.toNumber());
      console.log('wooracle rangeMax:', oracleItemData.rangeMax.toNumber());

      const [toPrice, toFeasible] = await poolUtils.getOraclePriceResult(toPoolParams.wooconfig, toPoolParams.wooracle, usdcPriceUpdate, usdcPriceUpdate);
      console.log(`price - ${toPrice}`);
      console.log(`feasible - ${toFeasible}`);
    })
  })

  describe("#check_usdc_pool()", async () => {
    it("check usdc pool", async () => {
      let {woopoolData, } = await poolUtils.checkPool(usdcTokenMint, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);
      assert.ok(
        woopoolData.authority.equals(provider.wallet.publicKey)
      );
    });
  });

  describe("#deposit_usdc_pool()", async () => {
    it("deposit usdc pool", async () => {
      const params = await poolUtils.generatePoolParams(usdcTokenMint, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);

      await poolUtils.getLatestBlockHash();

      if (getCluster() == 'localnet') {
        await program
          .methods
          .setPoolAdmin([keypair.publicKey])
          .accounts({
              wooconfig: params.wooconfig,
              authority: provider.wallet.publicKey,
          })
          .rpc(confirmOptionsRetryTres);

        const providerTokenAccount = token.getAssociatedTokenAddressSync(usdcTokenMint, keypair.publicKey);

        await poolUtils.getLatestBlockHash();

        // Deposit 0.2 USDC
        const depositAmount = new BN(200000);
        const tx = await program
                    .methods
                    .deposit(depositAmount)
                    .accounts({
                      wooconfig: params.wooconfig,
                      tokenMint: usdcTokenMint,
                      authority: keypair.publicKey,
                      tokenOwnerAccount: providerTokenAccount,
                      woopool: params.woopool,
                      tokenVault: params.tokenVault,
                      tokenProgram: token.TOKEN_PROGRAM_ID,
                    })
                    .signers([keypair])
                    .rpc(confirmOptionsRetryTres);
        const logs = await getLogs(provider.connection, tx);
        console.log(logs);              
      } else if (getCluster() == 'devnet') {
        // increase to pool liquidity
        const providerTokenAccount = token.getAssociatedTokenAddressSync(usdcTokenMint, provider.wallet.publicKey);
        const beforeUSDCPoolBalance = await provider.connection.getTokenAccountBalance(params.tokenVault);
        console.log("beforeUSDCPoolBalance amount:" + beforeUSDCPoolBalance.value.amount);
        
        // Deposit 0.2 USDC
        const depositAmount = new BN(200000);
        const tx = await program
                    .methods
                    .deposit(depositAmount)
                    .accounts({
                      wooconfig: params.wooconfig,
                      tokenMint: usdcTokenMint,
                      authority: provider.wallet.publicKey,
                      tokenOwnerAccount: providerTokenAccount,
                      woopool: params.woopool,
                      tokenVault: params.tokenVault,
                      tokenProgram: token.TOKEN_PROGRAM_ID,
                    })
                    .rpc(confirmOptionsRetryTres);
        const logs = await getLogs(provider.connection, tx);
        console.log(logs);

        const afterUSDCPoolBalance = await provider.connection.getTokenAccountBalance(params.tokenVault);
        console.log("afterUSDCPoolBalance amount:" + afterUSDCPoolBalance.value.amount);

        assert.equal(parseInt(afterUSDCPoolBalance.value.amount), parseInt(beforeUSDCPoolBalance.value.amount) + depositAmount.toNumber());
      }

      let {woopoolData, } = await poolUtils.checkPool(usdcTokenMint, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);
      assert.ok(
        woopoolData.authority.equals(provider.wallet.publicKey)
      );
    });
  });

  describe("#set_pool_fee_rate", async ()=> {
    it("set_pool_fee_rate_sol", async ()=> {
      const poolParams = await poolUtils.generatePoolParams(solTokenMint, usdcTokenMint, solFeedAccount, solPriceUpdate);

      await poolUtils.getLatestBlockHash();

      const tx = await program
      .methods
      .setPoolFeeRate(3000)
      .accounts({
        wooconfig: poolParams.wooconfig,
        authority: provider.wallet.publicKey,
        woopool: poolParams.woopool
      })
      .rpc(confirmOptionsRetryTres);

      let woopoolData = null;
      try {
        woopoolData = await program.account.wooPool.fetch(poolParams.woopool);
      } catch (e) {
          console.log(e);
          return;
      }

      console.log('authority:', woopoolData.authority);
      console.log('tokenMint:', woopoolData.tokenMint);
      console.log('feeRate', woopoolData.feeRate);

      assert.ok(
        // 3%
        woopoolData.feeRate == 3000
      );

    })
  })

  describe("#swap_between_sol_and_usdc", async ()=> {
    it("increase_wallet_pool_liquidity", async ()=> {
      let fromAmount = 0.002 * LAMPORTS_PER_SOL;

      let payerPubkey = provider.wallet.publicKey;
      if (getCluster() == 'localnet') {
        // payerPubkey = keypair.publicKey;
        await airdropIfRequired(
          provider.connection,
          payerPubkey,
          1 * LAMPORTS_PER_SOL,
          0.5 * LAMPORTS_PER_SOL,
        );
      }

      payerSolTokenAccount = await createAssociatedTokenAccount(
        provider,
        solTokenMint,
        fromWallet.publicKey,
        payerPubkey,
        ataSigner
      );
      payerUsdcTokenAccount = await createAssociatedTokenAccount(
        provider,
        usdcTokenMint,
        fromWallet.publicKey,
        payerPubkey,
        ataSigner
      );
      const solTokenAccount = payerSolTokenAccount;
      const usdcTokenAccount = payerUsdcTokenAccount;
      console.log("fromWallet PublicKey:" + fromWallet.publicKey);
      console.log('solWalletTokenAccount:' + solTokenAccount);
      console.log('usdcWalletTokenAccount:' + usdcTokenAccount);    

      // increase from pool liquidity
      const transferTranscation = new Transaction().add(
        // transfer SOL to from wallet
        SystemProgram.transfer({
          fromPubkey: payerPubkey,
          toPubkey: fromWallet.publicKey,
          lamports: fromAmount,
        }),
        // trasnfer SOL to WSOL into ata account
        SystemProgram.transfer({
          fromPubkey: fromWallet.publicKey,
          toPubkey: solTokenAccount,
          lamports: fromAmount,
        }),
        // sync wrapped SOL balance
        token.createSyncNativeInstruction(solTokenAccount)
      );

      await poolUtils.getLatestBlockHash();

      await provider.sendAndConfirm(transferTranscation, signers, { commitment: "confirmed" });

      // const fromAirdropSignature = await provider.connection.requestAirdrop(
      //   fromWallet.publicKey,
      //   LAMPORTS_PER_SOL,
      // );
      // // Wait for airdrop confirmation
      // await provider.connection.confirmTransaction({
      //   signature: fromAirdropSignature,
      //   ...(await provider.connection.getLatestBlockhash("confirmed")),
      // }, "confirmed");

      const initBalance = await provider.connection.getBalance(fromWallet.publicKey);
      console.log("fromWallet Balance:" + initBalance);
      const tokenBalance = await provider.connection.getTokenAccountBalance(solTokenAccount);
      console.log("fromTokenAccount amount:" + tokenBalance.value.amount);
      console.log("fromTokenAccount decimals:" + tokenBalance.value.decimals);
    });

    it ("swap_exceed_cap_bal", async() => {
      let fromAmount = 0.002 * LAMPORTS_PER_SOL;

      const solTokenAccount = payerSolTokenAccount;
      const usdcTokenAccount = payerUsdcTokenAccount;

      const fromPoolParams = await poolUtils.generatePoolParams(solTokenMint, usdcTokenMint, solFeedAccount, solPriceUpdate);
      const toPoolParams = await poolUtils.generatePoolParams(usdcTokenMint, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);
      const quotePoolParams = await poolUtils.generatePoolParams(usdcTokenMint, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);
      const [fromPrice, fromFeasible] = await poolUtils.getOraclePriceResult(fromPoolParams.wooconfig, fromPoolParams.wooracle, solPriceUpdate, usdcPriceUpdate);
      console.log(`price - ${fromPrice}`);
      console.log(`feasible - ${fromFeasible}`);

      const [toPrice, toFeasible] = await poolUtils.getOraclePriceResult(toPoolParams.wooconfig, toPoolParams.wooracle, usdcPriceUpdate, usdcPriceUpdate);
      console.log(`price - ${toPrice}`);
      console.log(`feasible - ${toFeasible}`);

      const solPoolParams = await poolUtils.generatePoolParams(solTokenMint, usdcTokenMint, solFeedAccount, solPriceUpdate);
      const usdcPoolParams = await poolUtils.generatePoolParams(usdcTokenMint, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);

      await poolUtils.getLatestBlockHash();

      // init 0 set SOL Pool Max Cap Bal
      const setSolCapBal = new BN(0);
      await program
      .methods
      .setPoolCapBal(setSolCapBal)
      .accounts({
        wooconfig: solPoolParams.wooconfig,
        woopool: solPoolParams.woopool,
        authority: provider.wallet.publicKey
      }).rpc(confirmOptionsRetryTres);

      await poolUtils.getLatestBlockHash();

      try {
        await program
            .methods
            .swap(new BN(fromAmount), new BN(0))
            .accounts({
            wooconfig: fromPoolParams.wooconfig,
            tokenProgram: token.TOKEN_PROGRAM_ID,
            payer: fromWallet.publicKey,  // is the user want to do swap
            wooracleFrom: fromPoolParams.wooracle,
            woopoolFrom: fromPoolParams.woopool,
            tokenOwnerAccountFrom: solTokenAccount,
            tokenVaultFrom: fromPoolParams.tokenVault,
            priceUpdateFrom: solPriceUpdate,
            wooracleTo: toPoolParams.wooracle,
            woopoolTo: toPoolParams.woopool,
            tokenOwnerAccountTo: usdcTokenAccount,
            tokenVaultTo: toPoolParams.tokenVault,
            priceUpdateTo: usdcPriceUpdate,
            woopoolQuote: quotePoolParams.woopool,
            quotePriceUpdate: usdcPriceUpdate,
            quoteTokenVault: quotePoolParams.tokenVault,
            rebateTo: fromWallet.publicKey,
        })
        .signers([fromWallet])
        .rpc(confirmOptionsRetryTres);

        assert.fail(
          "should fail exceed cap bal"
        );
      } catch (e) {
        const error = e as Error;
        console.log("----------------------name----------------------------")
        console.log(error.name);
        console.log("----------------------message-------------------------")
        console.log(error.message);
        console.log("----------------------stack---------------------------")
        console.log(error.stack);
        console.log("----------------------end-----------------------------")

        assert.match(error.message, /BalanceCapExceeds/);
      }
    });

    it ("set_cap_bal", async() => {
      const solPoolParams = await poolUtils.generatePoolParams(solTokenMint, usdcTokenMint, solFeedAccount, solPriceUpdate);
      const usdcPoolParams = await poolUtils.generatePoolParams(usdcTokenMint, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);

      await poolUtils.getLatestBlockHash();

      // set SOL Pool Max Cap Bal
      const setSolCapBal = new BN(10).pow(new BN(15));;
      await program
      .methods
      .setPoolCapBal(setSolCapBal)
      .accounts({
        wooconfig: solPoolParams.wooconfig,
        woopool: solPoolParams.woopool,
        authority: provider.wallet.publicKey
      }).rpc(confirmOptionsRetryTres);
      
      const woopoolData = await program.account.wooPool.fetch(solPoolParams.woopool);
      console.log('cap_bal:', woopoolData.capBal.toNumber());
      assert(woopoolData.capBal.eq(setSolCapBal));

      await poolUtils.getLatestBlockHash();

      // init set SOL Pool Max Cap Bal
      const setUSDCCapBal = new BN(10).pow(new BN(15));;
      await program
      .methods
      .setPoolCapBal(setUSDCCapBal)
      .accounts({
        wooconfig: usdcPoolParams.wooconfig,
        woopool: usdcPoolParams.woopool,
        authority: provider.wallet.publicKey
      }).rpc(confirmOptionsRetryTres);
      
      const woopoolUSDCData = await program.account.wooPool.fetch(usdcPoolParams.woopool);
      console.log('cap_bal:', woopoolUSDCData.capBal.toNumber());
      assert(woopoolUSDCData.capBal.eq(setUSDCCapBal));
    })

    it("swap_from_sol_to_usdc", async ()=> {
      let fromAmount = 0.001 * LAMPORTS_PER_SOL;

      const solTokenAccount = payerSolTokenAccount;
      const usdcTokenAccount = payerUsdcTokenAccount;
      console.log("fromWallet PublicKey:" + fromWallet.publicKey);
      console.log('solWalletTokenAccount:' + solTokenAccount);
      console.log('usdcWalletTokenAccount:' + usdcTokenAccount);    

      const initBalance = await provider.connection.getBalance(fromWallet.publicKey);
      console.log("fromWallet Balance:" + initBalance);
      const tokenBalance = await provider.connection.getTokenAccountBalance(solTokenAccount);
      console.log("fromTokenAccount amount:" + tokenBalance.value.amount);
      console.log("fromTokenAccount decimals:" + tokenBalance.value.decimals);

      const fromPoolParams = await poolUtils.generatePoolParams(solTokenMint, usdcTokenMint, solFeedAccount, solPriceUpdate);
      const toPoolParams = await poolUtils.generatePoolParams(usdcTokenMint, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);
      const quotePoolParams = await poolUtils.generatePoolParams(usdcTokenMint, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);
      const [fromPrice, fromFeasible] = await poolUtils.getOraclePriceResult(fromPoolParams.wooconfig, fromPoolParams.wooracle, solPriceUpdate, usdcPriceUpdate);
      console.log(`price - ${fromPrice}`);
      console.log(`feasible - ${fromFeasible}`);

      const [toPrice, toFeasible] = await poolUtils.getOraclePriceResult(toPoolParams.wooconfig, toPoolParams.wooracle, usdcPriceUpdate, usdcPriceUpdate);
      console.log(`price - ${toPrice}`);
      console.log(`feasible - ${toFeasible}`);

      await poolUtils.getLatestBlockHash();

      const tx = await program
        .methods
        .tryQuery(new BN(fromAmount))
        .accounts({
          wooconfig: fromPoolParams.wooconfig,
          wooracleFrom: fromPoolParams.wooracle,
          woopoolFrom: fromPoolParams.woopool,
          priceUpdateFrom: solPriceUpdate,
          wooracleTo: toPoolParams.wooracle,
          woopoolTo: toPoolParams.woopool,
          priceUpdateTo: usdcPriceUpdate,
          quotePriceUpdate: usdcPriceUpdate,
        })
        .rpc(confirmOptionsRetryTres);

      let t = await provider.connection.getTransaction(tx, {
        commitment: "confirmed",
      })

      const [key, data, buffer] = poolUtils.getReturnLog(t);
      const reader = new borsh.BinaryReader(buffer);
      const toAmount = reader.readU128().toNumber();
      const swapFee = reader.readU128().toNumber();
      console.log('toAmount:' + toAmount);
      console.log('swapFee:' + swapFee);

      const toVaultBalanceBefore = await provider.connection.getTokenAccountBalance(toPoolParams.tokenVault);
      console.log("toVault balance amount before:" + toVaultBalanceBefore.value.amount);
      console.log("toVault balance decimals before:" + toVaultBalanceBefore.value.decimals);

      let toPoolDataBefore = await program.account.wooPool.fetch(toPoolParams.woopool);
      console.log("toPool unclaimed fee before swap:" + toPoolDataBefore.unclaimedFee);

      await poolUtils.getLatestBlockHash();

      await program
        .methods
        .swap(new BN(fromAmount), new BN(0))
        .accounts({
          wooconfig: fromPoolParams.wooconfig,
          tokenProgram: token.TOKEN_PROGRAM_ID,
          payer: fromWallet.publicKey,  // is the user want to do swap
          wooracleFrom: fromPoolParams.wooracle,
          woopoolFrom: fromPoolParams.woopool,
          tokenOwnerAccountFrom: solTokenAccount,
          tokenVaultFrom: fromPoolParams.tokenVault,
          priceUpdateFrom: solPriceUpdate,
          wooracleTo: toPoolParams.wooracle,
          woopoolTo: toPoolParams.woopool,
          tokenOwnerAccountTo: usdcTokenAccount,
          tokenVaultTo: toPoolParams.tokenVault,
          priceUpdateTo: usdcPriceUpdate,
          woopoolQuote: quotePoolParams.woopool,
          quotePriceUpdate: usdcPriceUpdate,
          quoteTokenVault: quotePoolParams.tokenVault,
          rebateTo: fromWallet.publicKey,
        })
        .signers([fromWallet])
        .rpc(confirmOptionsRetryTres);

      const toVaultBalanceAfter = await provider.connection.getTokenAccountBalance(toPoolParams.tokenVault);
      console.log("toVault balance amount after:" + toVaultBalanceAfter.value.amount);
      console.log("toVault balance decimals after:" + toVaultBalanceAfter.value.decimals);
        
      let toPoolDataAfter = await program.account.wooPool.fetch(toPoolParams.woopool);
      console.log("toPool unclaimed fee after swap:" + toPoolDataAfter.unclaimedFee);

      const swapToAccountBalance = await provider.connection.getTokenAccountBalance(usdcTokenAccount);
      console.log("swapToAccount balance amount:" + swapToAccountBalance.value.amount);
      console.log("swapToAccount balance decimals:" + swapToAccountBalance.value.decimals);

      assert.equal(parseInt(toVaultBalanceAfter.value.amount), parseInt(toVaultBalanceBefore.value.amount) - toAmount);
      assert.equal(parseInt(swapToAccountBalance.value.amount), toAmount);
      assert.equal(toPoolDataAfter.unclaimedFee.toNumber(), toPoolDataBefore.unclaimedFee.toNumber() + swapFee);
    });

    it("swap_from_usdc_to_sol", async ()=> {
      let fromAmount = 100000 // USDC decimal is 6, means 0.1 USDC

      const solTokenAccount = payerSolTokenAccount;
      const usdcTokenAccount = payerUsdcTokenAccount;
      console.log("fromWallet PublicKey:" + fromWallet.publicKey);
      console.log('solWalletTokenAccount:' + solTokenAccount);
      console.log('usdcWalletTokenAccount:' + usdcTokenAccount);    

      const initBalance = await provider.connection.getBalance(fromWallet.publicKey);
      console.log("fromWallet Balance:" + initBalance);
      const tokenBalance = await provider.connection.getTokenAccountBalance(usdcTokenAccount);
      console.log("USDC TokenAccount amount:" + tokenBalance.value.amount);
      console.log("USDC TokenAccount decimals:" + tokenBalance.value.decimals);

      const fromPoolParams = await poolUtils.generatePoolParams(usdcTokenMint, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);
      const toPoolParams = await poolUtils.generatePoolParams(solTokenMint, usdcTokenMint, solFeedAccount, solPriceUpdate);
      const quotePoolParams = await poolUtils.generatePoolParams(usdcTokenMint, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);
      const [fromPrice, fromFeasible] = await poolUtils.getOraclePriceResult(fromPoolParams.wooconfig, fromPoolParams.wooracle, usdcPriceUpdate, usdcPriceUpdate);
      console.log(`price - ${fromPrice}`);
      console.log(`feasible - ${fromFeasible}`);

      const [toPrice, toFeasible] = await poolUtils.getOraclePriceResult(toPoolParams.wooconfig, toPoolParams.wooracle, solPriceUpdate, usdcPriceUpdate);
      console.log(`price - ${toPrice}`);
      console.log(`feasible - ${toFeasible}`);

      await poolUtils.getLatestBlockHash();

      const tx = await program
        .methods
        .tryQuery(new BN(fromAmount))
        .accounts({
          wooconfig: fromPoolParams.wooconfig,
          wooracleFrom: fromPoolParams.wooracle,
          woopoolFrom: fromPoolParams.woopool,
          priceUpdateFrom: usdcPriceUpdate,
          wooracleTo: toPoolParams.wooracle,
          woopoolTo: toPoolParams.woopool,
          priceUpdateTo: solPriceUpdate,
          quotePriceUpdate: usdcPriceUpdate,
        })
        .rpc(confirmOptionsRetryTres);

      let t = await provider.connection.getTransaction(tx, {
        commitment: "confirmed",
      })

      const [key, data, buffer] = poolUtils.getReturnLog(t);
      const reader = new borsh.BinaryReader(buffer);
      const toAmount = reader.readU128().toNumber();
      const swapFee = reader.readU128().toNumber();
      console.log('toAmount:' + toAmount);
      console.log('swapFee:' + swapFee);

      const swapToAccountBalanceBefore = await provider.connection.getTokenAccountBalance(solTokenAccount);
      console.log("swapToAccount balance amount before:" + swapToAccountBalanceBefore.value.amount);
      console.log("swapToAccount balance decimals before:" + swapToAccountBalanceBefore.value.decimals);

      const toVaultBalanceBefore = await provider.connection.getTokenAccountBalance(toPoolParams.tokenVault);
      console.log("toVault balance amount before:" + toVaultBalanceBefore.value.amount);
      console.log("toVault balance decimals before:" + toVaultBalanceBefore.value.decimals);

      let quotePoolDataBefore = await program.account.wooPool.fetch(quotePoolParams.woopool);
      console.log("quotePool unclaimed fee before swap:" + quotePoolDataBefore.unclaimedFee);

      let toPoolDataBefore = await program.account.wooPool.fetch(toPoolParams.woopool);
      console.log("toPool unclaimed fee before swap:" + toPoolDataBefore.unclaimedFee);

      await poolUtils.getLatestBlockHash();

      await program
        .methods
        .swap(new BN(fromAmount), new BN(0))
        .accounts({
          wooconfig: fromPoolParams.wooconfig,
          tokenProgram: token.TOKEN_PROGRAM_ID,
          payer: fromWallet.publicKey,  // is the user want to do swap
          wooracleFrom: fromPoolParams.wooracle,
          woopoolFrom: fromPoolParams.woopool,
          tokenOwnerAccountFrom: usdcTokenAccount,
          tokenVaultFrom: fromPoolParams.tokenVault,
          priceUpdateFrom: usdcPriceUpdate,
          wooracleTo: toPoolParams.wooracle,
          woopoolTo: toPoolParams.woopool,
          tokenOwnerAccountTo: solTokenAccount,
          tokenVaultTo: toPoolParams.tokenVault,
          priceUpdateTo: solPriceUpdate,
          woopoolQuote: quotePoolParams.woopool,
          quotePriceUpdate: usdcPriceUpdate,
          quoteTokenVault: quotePoolParams.tokenVault,
          rebateTo: fromWallet.publicKey,
        })
        .signers([fromWallet])
        .rpc(confirmOptionsRetryTres);

        const toVaultBalanceAfter = await provider.connection.getTokenAccountBalance(toPoolParams.tokenVault);
        console.log("toVault balance amount after:" + toVaultBalanceAfter.value.amount);
        console.log("toVault balance decimals after:" + toVaultBalanceAfter.value.decimals);
          
        let toPoolDataAfter = await program.account.wooPool.fetch(toPoolParams.woopool);
        console.log("toPool unclaimed fee after swap:" + toPoolDataAfter.unclaimedFee);

        let quotePoolDataAfter = await program.account.wooPool.fetch(quotePoolParams.woopool);
        console.log("quotePool unclaimed fee after swap:" + quotePoolDataAfter.unclaimedFee);

        const swapToAccountBalanceAfter = await provider.connection.getTokenAccountBalance(solTokenAccount);
        console.log("swapToAccount balance amount after:" + swapToAccountBalanceAfter.value.amount);
        console.log("swapToAccount balance decimals after:" + swapToAccountBalanceAfter.value.decimals);
  
        assert.equal(parseInt(toVaultBalanceAfter.value.amount), parseInt(toVaultBalanceBefore.value.amount) - toAmount);
        assert.equal(parseInt(swapToAccountBalanceBefore.value.amount), 0);
        assert.equal(parseInt(swapToAccountBalanceAfter.value.amount), toAmount);
        assert.equal(quotePoolDataAfter.unclaimedFee.toNumber(), quotePoolDataBefore.unclaimedFee.toNumber() + swapFee);
      });
  });

});
