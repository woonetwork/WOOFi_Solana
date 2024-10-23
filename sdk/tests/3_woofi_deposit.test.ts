import * as anchor from "@coral-xyz/anchor";
import { BN } from "@coral-xyz/anchor";
import * as token from "@solana/spl-token";
import { WoofiContext } from "../src";
import { PYTH_FEED_ACCOUNT, PYTH_PRICE_UPDATE_ACCOUNT, SOLPriceUpdate, SOLTokenMint, TOKEN_MINTS, USDCPriceUpdate, USDCTokenMint, WOOFI_TOKENS } from '../src/utils/constants'
import { generatePoolParams, getWooPrice } from "../src/utils/contract";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { createTransferCheckedInstruction, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { getLogs } from "@solana-developers/helpers";
import { PoolUtils } from "../src/utils/pool";

// async function getTokenBalanceWeb3(connection: Connection, tokenAccount: PublicKey) {
//   const info = await connection.getTokenAccountBalance(tokenAccount);
//   if (info.value.uiAmount == null) throw new Error('No balance found');
//   console.log('Balance (using Solana-Web3.js): ', info.value.uiAmount);
//   return info.value.uiAmount;
// }

describe("woofi_deposit_withdraw", async () => {
  // Configure the client to use the local cluster.
  const poolUtils = new PoolUtils();
  poolUtils.initEnv();

  const provider = poolUtils.provider;
  const program = poolUtils.program;
  // SOL/USD
  const solFeedAccount = poolUtils.solFeedAccount;
  // USDC/USD
  const usdcFeedAccount = poolUtils.usdcFeedAccount;
  const quoteFeedAccount = usdcFeedAccount;

  // it("withdraw usdc pool", async () => {
  //     const params = await poolUtils.generatePoolParams(USDCTokenMint, USDCTokenMint, usdcFeedAccount, USDCPriceUpdate);

  //     // increase to pool liquidity
  //     const providerTokenAccount = token.getAssociatedTokenAddressSync(USDCTokenMint, provider.wallet.publicKey);
  //     console.log('providerTokenAccount', providerTokenAccount);
  //     const beforeUSDCPoolBalance = await provider.connection.getTokenAccountBalance(params.tokenVault);
  //     console.log("beforeUSDCPoolBalance amount:" + beforeUSDCPoolBalance.value.amount);
      
  //     // Deposit 0.01 USDC
  //     const depositAmount = new BN(10000);
  //     //poolUtils.getLatestBlockHash();
  //     const tx = await program
  //                 .methods
  //                 .withdraw(depositAmount)
  //                 .accounts({
  //                   wooconfig: params.wooconfig,
  //                   tokenMint: USDCTokenMint,
  //                   authority: provider.wallet.publicKey,
  //                   tokenOwnerAccount: providerTokenAccount,
  //                   woopool: params.woopool,
  //                   tokenVault: params.tokenVault,
  //                   tokenProgram: token.TOKEN_PROGRAM_ID,
  //                 })
  //                 .transaction()
  //     tx.recentBlockhash = await (await provider.connection.getLatestBlockhash()).blockhash;
  //     console.log('tx.recentBlockhash', tx.recentBlockhash);
  //     const sig = await provider.sendAndConfirm(tx);
  //     const logs = await getLogs(provider.connection, sig);
  //     console.log(logs);

  //     const afterUSDCPoolBalance = await provider.connection.getTokenAccountBalance(params.tokenVault);
  //     console.log("afterUSDCPoolBalance amount:" + afterUSDCPoolBalance.value.amount);

  //     //assert.equal(parseInt(afterUSDCPoolBalance.value.amount), parseInt(beforeUSDCPoolBalance.value.amount) + depositAmount.toNumber());

  //     let {woopoolData, } = await poolUtils.checkPool(USDCTokenMint, USDCTokenMint, usdcFeedAccount, USDCPriceUpdate);
  // });

  it("incase token got stuck sol pool", async () => {
    const params = await poolUtils.generatePoolParams(SOLTokenMint, USDCTokenMint, solFeedAccount, SOLPriceUpdate);

    // increase to pool liquidity
    const providerTokenAccount = token.getAssociatedTokenAddressSync(SOLTokenMint, provider.wallet.publicKey);
    console.log('providerTokenAccount', providerTokenAccount);
    const beforeSOLPoolBalance = await provider.connection.getTokenAccountBalance(params.tokenVault);
    console.log("before SOL PoolBalance amount:" + beforeSOLPoolBalance.value.amount);
    
    // Create an instruction to create the tokenOwnerAccountFrom if it does not exist
    const createFromAccountInstruction = token.createAssociatedTokenAccountInstruction(
      provider.wallet.publicKey,
      providerTokenAccount,
      provider.wallet.publicKey,
      SOLTokenMint
    )
    
    // Withdraw 0.01 USDC
    const withdrawAmount = new BN(1000000);
    const tx = await program
                .methods
                .incaseTokenGotStuck(withdrawAmount)
                .accounts({
                  authority: provider.wallet.publicKey,
                  tokenMint: SOLTokenMint,
                  tokenVault: params.tokenVault,
                  woopool: params.woopool,
                  toTokenAccount: providerTokenAccount,
                  tokenProgram: token.TOKEN_PROGRAM_ID,
                })
                .preInstructions([createFromAccountInstruction])
                .transaction();
    tx.recentBlockhash = (await provider.connection.getLatestBlockhash()).blockhash;
    console.log('tx.recentBlockhash', tx.recentBlockhash);
    const sig = await provider.sendAndConfirm(tx);
    const logs = await getLogs(provider.connection, sig);
    console.log(logs);

    const afterSOLPoolBalance = await provider.connection.getTokenAccountBalance(params.tokenVault);
    console.log("after SOL PoolBalance amount:" + afterSOLPoolBalance.value.amount);

    //assert.equal(parseInt(afterUSDCPoolBalance.value.amount), parseInt(beforeUSDCPoolBalance.value.amount) + depositAmount.toNumber());

    let {woopoolData, } = await poolUtils.checkPool(USDCTokenMint, USDCTokenMint, usdcFeedAccount, USDCPriceUpdate);
  });

  // it("deposit usdc pool", async () => {
  //   const params = await poolUtils.generatePoolParams(USDCTokenMint, USDCTokenMint, usdcFeedAccount, USDCPriceUpdate);

  //   // increase to pool liquidity
  //   const providerTokenAccount = token.getAssociatedTokenAddressSync(USDCTokenMint, provider.wallet.publicKey);
  //   const beforeUSDCPoolBalance = await provider.connection.getTokenAccountBalance(params.tokenVault);
  //   console.log("beforeUSDCPoolBalance amount:" + beforeUSDCPoolBalance.value.amount);
    
  //   // Deposit 0.01 USDC
  //   const depositAmount = new BN(10000);
  //   //poolUtils.getLatestBlockHash();
  //   const tx = await program
  //               .methods
  //               .deposit(depositAmount)
  //               .accounts({
  //                 wooconfig: params.wooconfig,
  //                 tokenMint: USDCTokenMint,
  //                 authority: provider.wallet.publicKey,
  //                 tokenOwnerAccount: providerTokenAccount,
  //                 woopool: params.woopool,
  //                 tokenVault: params.tokenVault,
  //                 tokenProgram: token.TOKEN_PROGRAM_ID,
  //               })
  //               .transaction()
  //   tx.recentBlockhash = await (await provider.connection.getLatestBlockhash()).blockhash;
  //   console.log('tx.recentBlockhash', tx.recentBlockhash);
  //   const sig = await provider.sendAndConfirm(tx);
  //   const logs = await getLogs(provider.connection, sig);
  //   console.log(logs);

  //   const afterUSDCPoolBalance = await provider.connection.getTokenAccountBalance(params.tokenVault);
  //   console.log("afterUSDCPoolBalance amount:" + afterUSDCPoolBalance.value.amount);

  //   //assert.equal(parseInt(afterUSDCPoolBalance.value.amount), parseInt(beforeUSDCPoolBalance.value.amount) + depositAmount.toNumber());

  //   let {woopoolData, } = await poolUtils.checkPool(USDCTokenMint, USDCTokenMint, usdcFeedAccount, USDCPriceUpdate);
  // });

});
