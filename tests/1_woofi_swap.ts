import * as anchor from "@coral-xyz/anchor";
import * as borsh from "borsh";
import { BN, Program } from "@coral-xyz/anchor";
import * as token from "@solana/spl-token";
import { LAMPORTS_PER_SOL, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { getLogs } from "@solana-developers/helpers";
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
  let payerWallet = provider.wallet;
  if (getCluster() == 'localnet') {
    payerWallet = keypair;
    signers.push(keypair);
    ataSigner.push(payerWallet);
  }
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
      let checkUsdcPool = await poolUtils.checkPool(usdcTokenMint, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);
      assert.ok(
        checkUsdcPool.authority.equals(provider.wallet.publicKey)
      );
    });
  });

  describe("#deposit_usdc_pool()", async () => {
    it("deposit usdc pool", async () => {
      const params = await poolUtils.generatePoolParams(usdcTokenMint, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);

      await program
          .methods
          .setPoolAdmin([keypair.publicKey])
          .accounts({
              wooconfig: params.wooconfig,
              authority: provider.wallet.publicKey,
          })
          .rpc(confirmOptionsRetryTres);

      const providerTokenAccount = token.getAssociatedTokenAddressSync(usdcTokenMint, keypair.publicKey);

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

      let checkUsdcPool = await poolUtils.checkPool(usdcTokenMint, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);
      assert.ok(
        checkUsdcPool.authority.equals(provider.wallet.publicKey)
      );

      if (getCluster() == 'localnet') {
        assert.ok(
          checkUsdcPool.reserve.eq(depositAmount)
        )
      }
    });
  });

  describe("#set_pool_fee_rate", async ()=> {
    it("set_pool_fee_rate_sol", async ()=> {
      const poolParams = await poolUtils.generatePoolParams(solTokenMint, usdcTokenMint, solFeedAccount, solPriceUpdate);

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
    it("swap_from_sol_to_usdc", async ()=> {
      let fromAmount = 0.001 * LAMPORTS_PER_SOL;

      payerSolTokenAccount = await createAssociatedTokenAccount(
        provider,
        solTokenMint,
        fromWallet.publicKey,
        payerWallet.publicKey,
        ataSigner
      );
      payerUsdcTokenAccount = await createAssociatedTokenAccount(
        provider,
        usdcTokenMint,
        fromWallet.publicKey,
        payerWallet.publicKey,
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
          fromPubkey: payerWallet.publicKey,
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

      const fromPoolParams = await poolUtils.generatePoolParams(solTokenMint, usdcTokenMint, solFeedAccount, solPriceUpdate);
      const toPoolParams = await poolUtils.generatePoolParams(usdcTokenMint, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);
      const quotePoolParams = await poolUtils.generatePoolParams(usdcTokenMint, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);
      const [fromPrice, fromFeasible] = await poolUtils.getOraclePriceResult(fromPoolParams.wooconfig, fromPoolParams.wooracle, solPriceUpdate, usdcPriceUpdate);
      console.log(`price - ${fromPrice}`);
      console.log(`feasible - ${fromFeasible}`);

      const [toPrice, toFeasible] = await poolUtils.getOraclePriceResult(toPoolParams.wooconfig, toPoolParams.wooracle, usdcPriceUpdate, usdcPriceUpdate);
      console.log(`price - ${toPrice}`);
      console.log(`feasible - ${toFeasible}`);

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

            // increase to pool liquidity
            // const providerToTokenAccount = token.getAssociatedTokenAddressSync(usdcTokenMint, provider.wallet.publicKey);
            // const beforeProviderToTokenBalance = await provider.connection.getTokenAccountBalance(providerToTokenAccount);
            // console.log("beforeProviderToTokenBalance amount:" + beforeProviderToTokenBalance.value.amount);
            // console.log("beforeProviderToTokenBalance decimals:" + beforeProviderToTokenBalance.value.decimals);

            // const transferToTranscation = new Transaction().add(
            //   // trasnfer USDC to to account
            //   token.createTransferCheckedInstruction(
            //     providerToTokenAccount,
            //     usdcTokenMint,
            //     toPoolParams.tokenVault,
            //     provider.wallet.publicKey,
            //     0.2 * Math.pow(10, beforeProviderToTokenBalance.value.decimals),
            //     beforeProviderToTokenBalance.value.decimals
            //   ),
            // );

            // await provider.sendAndConfirm(transferToTranscation, [], { commitment: "confirmed" });

            // const afterToTokenBalance = await provider.connection.getTokenAccountBalance(toPoolParams.tokenVault);
            // console.log("afterProviderToTokenBalance amount:" + afterToTokenBalance.value.amount);
            // console.log("afterProviderToTokenBalance decimals:" + afterToTokenBalance.value.decimals);


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

        const toTokenAccountBalance = await provider.connection.getTokenAccountBalance(usdcTokenAccount);
        console.log("toTokenAccount amount:" + toTokenAccountBalance.value.amount);
        console.log("toTokenAccount decimals:" + toTokenAccountBalance.value.decimals);
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

        const toTokenAccountBalance = await provider.connection.getTokenAccountBalance(solTokenAccount);
        console.log("toTokenAccount amount:" + toTokenAccountBalance.value.amount);
        console.log("toTokenAccount decimals:" + toTokenAccountBalance.value.decimals);
    });
  });

});
