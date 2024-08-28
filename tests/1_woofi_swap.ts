import * as anchor from "@coral-xyz/anchor";
import * as borsh from "borsh";
import { BN, Program } from "@coral-xyz/anchor";
import * as token from "@solana/spl-token";
import { LAMPORTS_PER_SOL, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { getLogs } from "@solana-developers/helpers";
import { assert } from "chai";
import { createAssociatedTokenAccount, transferToken } from "./utils/token";
import { getPythPrice, PythToken } from "./utils/pyth";
import { PoolUtils } from "./utils/pool";
import { usdcTokenMint, solTokenMint, solPriceUpdate, usdcPriceUpdate, confirmOptionsRetryTres } from "./utils/test-consts";

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

  describe("#create_usdc_pool()", async () => {
    it("creates usdc pool", async () => {
      let usdcOracle = await poolUtils.createOracle(PythToken.USDC, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);
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
      let solOracle = await poolUtils.createOracle(PythToken.SOL, solTokenMint, solFeedAccount, solPriceUpdate);
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
      const oracleItemData = await program.account.woOracle.fetch(fromPoolParams.wooracle);
      console.log('wooracle price:', oracleItemData.price.toNumber());
      console.log('wooracle rangeMin:', oracleItemData.rangeMin.toNumber());
      console.log('wooracle rangeMax:', oracleItemData.rangeMax.toNumber());

      const [fromPrice, fromFeasible] = await poolUtils.getOraclePriceResult(fromPoolParams.wooracle, solPriceUpdate, usdcPriceUpdate);
      console.log(`price - ${fromPrice}`);
      console.log(`feasible - ${fromFeasible}`);
    })

    it("get_usdc_price", async ()=> {
      const toPoolParams = await poolUtils.generatePoolParams(usdcTokenMint, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);

      // init set wooracle range min and max
      const oracleItemData = await program.account.woOracle.fetch(toPoolParams.wooracle);
      console.log('wooracle price:', oracleItemData.price.toNumber());
      console.log('wooracle rangeMin:', oracleItemData.rangeMin.toNumber());
      console.log('wooracle rangeMax:', oracleItemData.rangeMax.toNumber());

      const [toPrice, toFeasible] = await poolUtils.getOraclePriceResult(toPoolParams.wooracle, usdcPriceUpdate, usdcPriceUpdate);  
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

      const providerTokenAccount = token.getAssociatedTokenAddressSync(usdcTokenMint, provider.wallet.publicKey);

      const tx = await program
      .methods
      .deposit(new BN(1000000))
      .accounts({
        tokenMint: usdcTokenMint,
        quoteTokenMint: usdcTokenMint,
        authority: provider.wallet.publicKey,
        tokenOwnerAccount: providerTokenAccount,
        woopool: params.woopool,
        tokenVault: params.tokenVault,
        tokenProgram: token.TOKEN_PROGRAM_ID,
      })
      .rpc(confirmOptionsRetryTres);

      const logs = await getLogs(provider.connection, tx);
      console.log(logs);

      let checkUsdcPool = await poolUtils.checkPool(usdcTokenMint, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);
      assert.ok(
        checkUsdcPool.authority.equals(provider.wallet.publicKey)
      );
    });
  });


  describe("#swap_between_sol_and_usdc", async ()=> {
    it("swap_from_sol_to_usdc", async ()=> {
      let fromAmount = 0.001 * LAMPORTS_PER_SOL;
      let feeAuthority = provider.wallet.publicKey;

      const fromWallet = anchor.web3.Keypair.generate();

      const fromTokenAccount = await createAssociatedTokenAccount(
        provider,
        solTokenMint,
        fromWallet.publicKey,
        provider.wallet.publicKey
      );
      const toTokenAccount = await createAssociatedTokenAccount(
        provider,
        usdcTokenMint,
        fromWallet.publicKey,
        provider.wallet.publicKey
      );
      console.log("fromWallet PublicKey:" + fromWallet.publicKey);
      console.log('fromWalletTokenAccount:' + fromTokenAccount);
      console.log('toWalletTokenAccount:' + toTokenAccount);

      // increase from pool liquidity
      const transferTranscation = new Transaction().add(
        // transfer SOL to from wallet
        SystemProgram.transfer({
          fromPubkey: provider.wallet.publicKey,
          toPubkey: fromWallet.publicKey,
          lamports: fromAmount,
        }),
        // trasnfer SOL to WSOL into ata account
        SystemProgram.transfer({
          fromPubkey: fromWallet.publicKey,
          toPubkey: fromTokenAccount,
          lamports: fromAmount,
        }),
        // sync wrapped SOL balance
        token.createSyncNativeInstruction(fromTokenAccount)
      );

      await provider.sendAndConfirm(transferTranscation, [fromWallet], { commitment: "confirmed" });

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
      const tokenBalance = await provider.connection.getTokenAccountBalance(fromTokenAccount);
      console.log("fromTokenAccount amount:" + tokenBalance.value.amount);
      console.log("fromTokenAccount decimals:" + tokenBalance.value.decimals);
    
      const fromPoolParams = await poolUtils.generatePoolParams(solTokenMint, usdcTokenMint, solFeedAccount, solPriceUpdate);
      const toPoolParams = await poolUtils.generatePoolParams(usdcTokenMint, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);
      const quotePoolParams = await poolUtils.generatePoolParams(usdcTokenMint, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);
      const [fromPrice, fromFeasible] = await poolUtils.getOraclePriceResult(fromPoolParams.wooracle, solPriceUpdate, usdcPriceUpdate);  
      console.log(`price - ${fromPrice}`);
      console.log(`feasible - ${fromFeasible}`);

      const [toPrice, toFeasible] = await poolUtils.getOraclePriceResult(toPoolParams.wooracle, usdcPriceUpdate, usdcPriceUpdate);  
      console.log(`price - ${toPrice}`);
      console.log(`feasible - ${toFeasible}`);

      const tx = await program
        .methods
        .tryQuery(new BN(fromAmount))
        .accounts({
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
          tokenProgram: token.TOKEN_PROGRAM_ID,
          owner: fromWallet.publicKey,  // is the user want to do swap
          wooracleFrom: fromPoolParams.wooracle,
          woopoolFrom: fromPoolParams.woopool,
          tokenOwnerAccountFrom: fromTokenAccount,
          tokenVaultFrom: fromPoolParams.tokenVault,
          priceUpdateFrom: solPriceUpdate,
          wooracleTo: toPoolParams.wooracle,
          woopoolTo: toPoolParams.woopool,
          tokenOwnerAccountTo: toTokenAccount,
          tokenVaultTo: toPoolParams.tokenVault,
          priceUpdateTo: usdcPriceUpdate,
          woopoolQuote: quotePoolParams.woopool,
          quotePriceUpdate: usdcPriceUpdate,
          quoteTokenVault: quotePoolParams.tokenVault,
      
        })
        .signers([fromWallet])
        .rpc(confirmOptionsRetryTres);

        const toTokenAccountBalance = await provider.connection.getTokenAccountBalance(toTokenAccount);
        console.log("toTokenAccount amount:" + toTokenAccountBalance.value.amount);
        console.log("toTokenAccount decimals:" + toTokenAccountBalance.value.decimals);
    });
  });
});
