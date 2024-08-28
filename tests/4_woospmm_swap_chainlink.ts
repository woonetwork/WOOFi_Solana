import * as anchor from "@coral-xyz/anchor";
import * as borsh from "borsh";
import { BN, Program } from "@coral-xyz/anchor";
import * as token from "@solana/spl-token";
import { ConfirmOptions, LAMPORTS_PER_SOL, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import * as web3 from "@solana/web3.js";
import { Woofi } from "../target/types/woofi";
import { assert } from "chai";
import Decimal from "decimal.js";
import moment from "moment";
import * as global from "./global";
import { createAssociatedTokenAccount, transferToken } from "./utils/token";

describe("woofi_swap", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Woofi as Program<Woofi>;

  let cloracle_price: BN;
  let cloracle_decimal: Number;

  const solTokenMint = new anchor.web3.PublicKey("So11111111111111111111111111111111111111112");
  const usdcTokenMint = new anchor.web3.PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");

  // SOL/USD
  const solFeedAccount = new anchor.web3.PublicKey("99B2bTijsU6f1GCT73HmdR7HCFFjGMBcPZY6jZ96ynrR");
  // USDC/USD
  const usdcFeedAccount = new anchor.web3.PublicKey("2EmfL3MqL3YHABudGNmajjCpR13NNEn9Y4LWxbDm6SwR");
  const chainLinkProgramAccount = new anchor.web3.PublicKey("HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny");
  const confirmOptionsRetryTres: ConfirmOptions = { commitment: "confirmed", maxRetries: 3 };
  const tenpow18 = new BN(10).pow(new BN(18));
  const tenpow16 = new BN(10).pow(new BN(16));

  const getReturnLog = (confirmedTransaction) => {
    const prefix = "Program return: ";
    let log = confirmedTransaction.meta.logMessages.find((log) =>
      log.startsWith(prefix)
    );
    log = log.slice(prefix.length);
    const [key, data] = log.split(" ", 2);
    const buffer = Buffer.from(data, "base64");
    return [key, data, buffer];
  };

  const getOraclePriceResult = async (oracle: anchor.web3.PublicKey, wooracle: anchor.web3.PublicKey) => {
    const tx = await program
      .methods
      .getPrice()
      .accounts({
        oracle,
        wooracle,
        priceUpdate: chainLinkProgramAccount
      })
      .rpc(confirmOptionsRetryTres);

    let t = await provider.connection.getTransaction(tx, {
      commitment: "confirmed",
    })

    const [key, data, buffer] = getReturnLog(t);
    const reader = new borsh.BinaryReader(buffer);
    const price = reader.readU128().toNumber();
    const feasible = reader.readU8();

    return [price, feasible];
  };

  const createOracle = async (feedAccount: anchor.web3.PublicKey) => {
    const [cloracle] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('cloracle'), feedAccount.toBuffer(), chainLinkProgramAccount.toBuffer()],
      program.programId
    );

    const [wooracle] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('wooracle'), feedAccount.toBuffer(), chainLinkProgramAccount.toBuffer()],
      program.programId
    );

    let oracleItemData = null;
    try {
      oracleItemData = await program.account.woOracle.fetch(wooracle);
    } catch (e) {
      const error = e as Error;
      if (error.message.indexOf("Account does not exist") >= 0) {
        await program
          .methods
          .createOracleChainlink()
          .accounts({
            cloracle,
            wooracle,
            admin: provider.wallet.publicKey,
            feedAccount: feedAccount,
            chainlinkProgram: chainLinkProgramAccount
          })
          .rpc(confirmOptionsRetryTres);   
      }
    }

    if (oracleItemData == null) {
      oracleItemData = await program.account.woOracle.fetch(wooracle);
    }

    // init set wooracle range min and max
    const oracleChinlinkData = await program.account.oracle.fetch(cloracle);
    console.log('oracle chainlink price:' + oracleChinlinkData.round);
    console.log('wooracle price:' + oracleItemData.price);

    const rangeMin = oracleChinlinkData.round.mul(new BN(10)).div(new BN(20));
    const rangeMax = oracleChinlinkData.round.mul(new BN(30)).div(new BN(20));
    await program
      .methods
      .setWooRange(rangeMin, rangeMax)
      .accounts({
        wooracle: wooracle,
        authority: provider.wallet.publicKey,
      })
      .rpc(confirmOptionsRetryTres);

    return oracleItemData;
  }

  const createPool = async (feedAccount: anchor.web3.PublicKey, tokenMint: anchor.web3.PublicKey) => {
    const [cloracle] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('cloracle'), feedAccount.toBuffer(), chainLinkProgramAccount.toBuffer()],
      program.programId
    );

    const [wooracle] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('wooracle'), feedAccount.toBuffer(), chainLinkProgramAccount.toBuffer()],
      program.programId
    );

    const adminAuthority = provider.wallet.publicKey;
    const feeAuthority = provider.wallet.publicKey;

    const [woopool] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('woopool'), tokenMint.toBuffer()],
      program.programId
    );

    console.log('woopool:' + woopool);

    const tokenVaultKeypair = anchor.web3.Keypair.generate();

    console.log('tokenVault Keypair:' + tokenVaultKeypair.publicKey);

    let woopoolData = null;
    try {
      woopoolData = await program.account.wooPool.fetch(woopool);
    } catch (e) {
      const error = e as Error;
      if (error.message.indexOf("Account does not exist") >= 0) {
        console.log('start create pool:');
        await program
        .methods
        .createPool(adminAuthority, feeAuthority)
        .accounts({
          tokenMint,
          authority: provider.wallet.publicKey,
          woopool,
          tokenVault: tokenVaultKeypair.publicKey,
          oracle: cloracle,
          wooracle,
          tokenProgram: token.TOKEN_PROGRAM_ID, 
          systemProgram: web3.SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY
          })
          .signers([tokenVaultKeypair])
          .rpc(confirmOptionsRetryTres);   
        console.log('end create pool.');
      }
    }

    // init set Pool Max Notional Swap
    await program
    .methods
    .setPoolMaxNotionalSwap(new BN(1000*LAMPORTS_PER_SOL))
    .accounts({
      woopool: woopool,
      authority: provider.wallet.publicKey
    })
    .rpc(confirmOptionsRetryTres);

    await program
    .methods
    .setPoolMaxGamma(new BN(1000))
    .accounts({
      woopool: woopool,
      authority: provider.wallet.publicKey
    }).rpc(confirmOptionsRetryTres);

    if (woopoolData == null) {
      woopoolData = await program.account.wooPool.fetch(woopool);
    }

    console.log('authority:' + woopoolData.authority);
    console.log('feeAuthority:' + woopoolData.feeAuthority);
    console.log('tokenMint:' + woopoolData.tokenMint);
    console.log('tokenVault:' + woopoolData.tokenVault);
    console.log('setPoolMaxNotionalSwap:', woopoolData.maxNotionalSwap.toNumber());
    console.log('setMaxGamma', woopoolData.maxGamma.toNumber());

    return woopoolData;
  }

  const generatePoolParams = async(
    feedAccount: anchor.web3.PublicKey,
    tokenMint: anchor.web3.PublicKey
  ) => {
    const [oracle] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('cloracle'), feedAccount.toBuffer(), chainLinkProgramAccount.toBuffer()],
      program.programId
    );

    const [wooracle] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('wooracle'), feedAccount.toBuffer(), chainLinkProgramAccount.toBuffer()],
      program.programId
    );

    const [woopool] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('woopool'), tokenMint.toBuffer()],
      program.programId
    );

    // woopool data should already be created after init
    const {tokenVault} = await program.account.wooPool.fetch(woopool);

    return {
      oracle,
      wooracle,
      woopool,
      tokenVault
    }
  }

  describe("#create_sol_pool()", async () => {
    it("creates sol pool", async () => {

      let solOracle = await createOracle(solFeedAccount);
      assert.ok(
        solOracle.authority.equals(provider.wallet.publicKey)
      );
  
      let solPool = await createPool(solFeedAccount, solTokenMint);
      assert.ok(
        solPool.authority.equals(provider.wallet.publicKey)
      );
    });
  });

  describe("#create_usdc_pool()", async () => {
    it("creates usdc pool", async () => {
      let usdcOracle = await createOracle(usdcFeedAccount);
      assert.ok(
        usdcOracle.authority.equals(provider.wallet.publicKey)
      );

      let usdcPool = await createPool(usdcFeedAccount, usdcTokenMint);
      assert.ok(
        usdcPool.authority.equals(provider.wallet.publicKey)
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
    
      const fromPoolParams = await generatePoolParams(solFeedAccount, solTokenMint);
      const toPoolParams = await generatePoolParams(usdcFeedAccount, usdcTokenMint);

      const [fromPrice, fromFeasible] = await getOraclePriceResult(fromPoolParams.oracle, fromPoolParams.wooracle);  
      console.log(`price - ${fromPrice}`);
      console.log(`feasible - ${fromFeasible}`);

      const [toPrice, toFeasible] = await getOraclePriceResult(toPoolParams.oracle, toPoolParams.wooracle);  
      console.log(`price - ${toPrice}`);
      console.log(`feasible - ${toFeasible}`);

      const tx = await program
        .methods
        .tryQuery(new BN(fromAmount))
        .accounts({
          oracleFrom: fromPoolParams.oracle,
          wooracleFrom: fromPoolParams.wooracle,
          woopoolFrom: fromPoolParams.woopool,
          priceUpdateFrom: chainLinkProgramAccount,
          oracleTo: toPoolParams.oracle,
          wooracleTo: toPoolParams.wooracle,
          woopoolTo: toPoolParams.woopool,
          priceUpdateTo: chainLinkProgramAccount
        })
        .rpc(confirmOptionsRetryTres);

      let t = await provider.connection.getTransaction(tx, {
        commitment: "confirmed",
      })
  
      const [key, data, buffer] = getReturnLog(t);
      const reader = new borsh.BinaryReader(buffer);
      const toAmount = reader.readU128().toNumber();
      const swapFeeAmount = reader.readU128().toNumber();
      const swapFee = reader.readU128().toNumber();
      console.log('toAmount:' + toAmount);
      console.log('swapFeeAmount:' + swapFeeAmount);
      console.log('swapFee:' + swapFee);

            // increase to pool liquidity
            const providerToTokenAccount = token.getAssociatedTokenAddressSync(usdcTokenMint, provider.wallet.publicKey);
            const beforeProviderToTokenBalance = await provider.connection.getTokenAccountBalance(providerToTokenAccount);
            console.log("beforeProviderToTokenBalance amount:" + beforeProviderToTokenBalance.value.amount);
            console.log("beforeProviderToTokenBalance decimals:" + beforeProviderToTokenBalance.value.decimals);
      
            const transferToTranscation = new Transaction().add(
              // trasnfer USDC to to account
              token.createTransferCheckedInstruction(
                providerToTokenAccount,
                usdcTokenMint,
                toPoolParams.tokenVault,
                provider.wallet.publicKey,
                0.2 * Math.pow(10, beforeProviderToTokenBalance.value.decimals),
                beforeProviderToTokenBalance.value.decimals
              ),
            );
      
            await provider.sendAndConfirm(transferToTranscation, [], { commitment: "confirmed" });
      
            const afterToTokenBalance = await provider.connection.getTokenAccountBalance(toPoolParams.tokenVault);
            console.log("afterProviderToTokenBalance amount:" + afterToTokenBalance.value.amount);
            console.log("afterProviderToTokenBalance decimals:" + afterToTokenBalance.value.decimals);
      
  
      await program
        .methods
        .swap(new BN(fromAmount), new BN(0))
        .accounts({
          tokenProgram: token.TOKEN_PROGRAM_ID,
          owner: fromWallet.publicKey,  // is the user want to do swap
          oracleFrom: fromPoolParams.oracle,
          wooracleFrom: fromPoolParams.wooracle,
          woopoolFrom: fromPoolParams.woopool,
          tokenOwnerAccountFrom: fromTokenAccount,
          tokenVaultFrom: fromPoolParams.tokenVault,
          priceUpdateFrom: chainLinkProgramAccount,
          oracleTo: toPoolParams.oracle,
          wooracleTo: toPoolParams.wooracle,
          woopoolTo: toPoolParams.woopool,
          tokenOwnerAccountTo: toTokenAccount,
          tokenVaultTo: toPoolParams.tokenVault,
          priceUpdateTo: chainLinkProgramAccount
        })
        .signers([fromWallet])
        .rpc(confirmOptionsRetryTres);

        const toTokenAccountBalance = await provider.connection.getTokenAccountBalance(toTokenAccount);
        console.log("toTokenAccount amount:" + toTokenAccountBalance.value.amount);
        console.log("toTokenAccount decimals:" + toTokenAccountBalance.value.decimals);
    });
  });
});
