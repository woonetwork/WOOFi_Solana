import * as anchor from "@coral-xyz/anchor";
import * as borsh from "borsh";
import { BN, Program } from "@coral-xyz/anchor";
import * as token from "@solana/spl-token";
import { ConfirmOptions, LAMPORTS_PER_SOL, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import * as web3 from "@solana/web3.js";
import { getLogs } from "@solana-developers/helpers";
import { Woofi } from "../../target/types/woofi";
import { assert } from "chai";
import Decimal from "decimal.js";
import moment from "moment";
import * as global from "../global";
import { createAssociatedTokenAccount, transferToken } from "./token";
import { getPythPrice, PythToken } from "./pyth";
import { quotePriceUpdate, quoteTokenMint, usdcTokenMint } from "./test-consts";

export class PoolUtils {
  public provider;
  public program;
  public sol_priceFeed;
  public usdc_priceFeed;

  // SOL/USD
  public solFeedAccount: anchor.web3.PublicKey;
  // USDC/USD
  public usdcFeedAccount: anchor.web3.PublicKey;
  public quoteFeedAccount: anchor.web3.PublicKey;

  public confirmOptionsRetryTres: ConfirmOptions = { maxRetries: 3, commitment: "confirmed" };
  public tenpow18 = new BN(10).pow(new BN(18));
  public tenpow16 = new BN(10).pow(new BN(16));

  public initEnv = () => {
    this.provider = anchor.AnchorProvider.env();
    // Configure the client to use the local cluster.
    anchor.setProvider(this.provider);

    this.program = anchor.workspace.Woofi as Program<Woofi>;

    // SOL pyth oracle price feed
    // https://pyth.network/developers/price-feed-ids
    const bs58 = require('bs58')
    const sol_bytes = Buffer.from('ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d', 'hex')
    this.sol_priceFeed = bs58.encode(sol_bytes)
    console.log("SOL PriceFeed:", this.sol_priceFeed)

    const usdc_bytes = Buffer.from('eaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a', 'hex')
    this.usdc_priceFeed = bs58.encode(usdc_bytes)
    console.log("USDC PriceFeed:", this.usdc_priceFeed)

    // SOL/USD
    this.solFeedAccount = new anchor.web3.PublicKey(this.sol_priceFeed);
    // USDC/USD
    this.usdcFeedAccount = new anchor.web3.PublicKey(this.usdc_priceFeed);
    this.quoteFeedAccount = this.usdcFeedAccount;    
  };

  public getReturnLog = (confirmedTransaction) => {
    const prefix = "Program return: ";
    let log = confirmedTransaction.meta.logMessages.find((log) =>
      log.startsWith(prefix)
    );
    log = log.slice(prefix.length);
    const [key, data] = log.split(" ", 2);
    const buffer = Buffer.from(data, "base64");
    return [key, data, buffer];
  };

  public getOraclePriceResult = async (
    oracle: anchor.web3.PublicKey,
    priceUpdate: anchor.web3.PublicKey,
    quotePriceUpdate: anchor.web3.PublicKey
  ) => {
    const confirmOptions: ConfirmOptions = { commitment: "confirmed", maxRetries: 3 };

    const tx = await this.program
      .methods
      .getPrice()
      .accounts({
        oracle,
        priceUpdate,
        quotePriceUpdate
      })
      .rpc(confirmOptions);

    let t = await this.provider.connection.getTransaction(tx, {
      commitment: "confirmed",
    })

    const [key, data, buffer] = this.getReturnLog(t);
    const reader = new borsh.BinaryReader(buffer);
    const price = reader.readU128().toNumber();
    const feasible = reader.readU8();

    return [price, feasible];
  };

  public createOracle = async (token: PythToken, tokenMint: anchor.web3.PublicKey, feedAccount: anchor.web3.PublicKey, priceUpdate: anchor.web3.PublicKey) => {
    const [wooracle] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('wooracle'), tokenMint.toBuffer(), feedAccount.toBuffer(), priceUpdate.toBuffer()],
      this.program.programId
    );

    let oracleItemData = null;
    try {
      oracleItemData = await this.program.account.woOracle.fetch(wooracle);
    } catch (e) {
      const error = e as Error;
      if (error.message.indexOf("Account does not exist") >= 0) {
          // TODO Prince: need notice here
          // set maximum age to larger seconds due to pyth oracled push in 20mins in Dev env.
          const quoteFeedAccount = this.quoteFeedAccount;
          const tx = await this.program
            .methods
            .createOracle(new BN(1000))
            .accounts({
              tokenMint,
              wooracle,
              admin: this.provider.wallet.publicKey,
              feedAccount,
              priceUpdate,
              quoteTokenMint,
              quoteFeedAccount,
              quotePriceUpdate
            })
            .rpc(this.confirmOptionsRetryTres);

          const logs = await getLogs(this.provider.connection, tx);
          console.log(logs);
      }
    }

    if (oracleItemData == null) {
      oracleItemData = await this.program.account.woOracle.fetch(wooracle);
    }

    // init set wooracle range min and max
    const pythPrice = await getPythPrice(token);

    await this.program
      .methods
      .setWooRange(pythPrice.rangeMin, pythPrice.rangeMax)
      .accounts({
        wooracle: wooracle,
        authority: this.provider.wallet.publicKey,
      })
      .rpc(this.confirmOptionsRetryTres);

    return oracleItemData;
  }

  public createPool = async (tokenMint: anchor.web3.PublicKey, quoteTokenMint: anchor.web3.PublicKey, feedAccount: anchor.web3.PublicKey, priceUpdate: anchor.web3.PublicKey) => {
    const [wooracle] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('wooracle'), tokenMint.toBuffer(), feedAccount.toBuffer(), priceUpdate.toBuffer()],
      this.program.programId
    );
  
    const adminAuthority = this.provider.wallet.publicKey;
    const feeAuthority = this.provider.wallet.publicKey;

    const [woopool] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('woopool'), tokenMint.toBuffer(), quoteTokenMint.toBuffer()],
      this.program.programId
    );

    console.log('woopool:' + woopool);

    let woopoolData = null;
    try {
      woopoolData = await this.program.account.wooPool.fetch(woopool);
    } catch (e) {
      const error = e as Error;
      if (error.message.indexOf("Account does not exist") >= 0) {
        console.log('start create pool:');

        const tokenVaultKeypair = anchor.web3.Keypair.generate();
        console.log('tokenVault Keypair:' + tokenVaultKeypair.publicKey);

        await this.program
        .methods
        .createPool(adminAuthority, feeAuthority)
        .accounts({
          tokenMint,
          quoteTokenMint,
          authority: this.provider.wallet.publicKey,
          woopool,
          tokenVault: tokenVaultKeypair.publicKey,
          wooracle,
          tokenProgram: token.TOKEN_PROGRAM_ID, 
          systemProgram: web3.SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY
        })
        .signers([tokenVaultKeypair])
        .rpc(this.confirmOptionsRetryTres);   
        console.log('end create pool.');
      }
    }

    // init set Pool Max Notional Swap
    await this.program
    .methods
    .setPoolMaxNotionalSwap(new BN(1000*LAMPORTS_PER_SOL))
    .accounts({
      woopool: woopool,
      authority: this.provider.wallet.publicKey
    }).rpc(this.confirmOptionsRetryTres);

    // init set Pool Max Notional Swap
    await this.program
    .methods
    .setPoolMaxGamma(new BN(1000))
    .accounts({
      woopool: woopool,
      authority: this.provider.wallet.publicKey
    }).rpc(this.confirmOptionsRetryTres);
    
    if (woopoolData == null) {
      woopoolData = await this.program.account.wooPool.fetch(woopool);
    }

    console.log('authority:' + woopoolData.authority);
    console.log('feeAuthority:' + woopoolData.feeAuthority);
    console.log('tokenMint:' + woopoolData.tokenMint);
    console.log('tokenVault:' + woopoolData.tokenVault);
    console.log('setPoolMaxNotionalSwap:', woopoolData.maxNotionalSwap.toNumber());
    console.log('setMaxGamma', woopoolData.maxGamma.toNumber());

    return woopoolData;
  }

  public checkPool = async (tokenMint: anchor.web3.PublicKey, quoteTokenMint: anchor.web3.PublicKey, feedAccount: anchor.web3.PublicKey, priceUpdate: anchor.web3.PublicKey) => {
    const [wooracle] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('wooracle'), tokenMint.toBuffer(), feedAccount.toBuffer(), priceUpdate.toBuffer()],
      this.program.programId
    );
  
    const adminAuthority = this.provider.wallet.publicKey;
    const feeAuthority = this.provider.wallet.publicKey;

    const [woopool] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('woopool'), tokenMint.toBuffer(), quoteTokenMint.toBuffer()],
      this.program.programId
    );

    console.log('woopool:' + woopool);

    let woopoolData = null;
    try {
      woopoolData = await this.program.account.wooPool.fetch(woopool);
    } catch (e) {
        console.log(e);
        return;
    }

    console.log('authority:', woopoolData.authority);
    console.log('feeAuthority:', woopoolData.feeAuthority);
    console.log('tokenMint:', woopoolData.tokenMint);
    console.log('tokenVault:', woopoolData.tokenVault);
    console.log('setPoolMaxNotionalSwap:', woopoolData.maxNotionalSwap.toNumber());
    console.log('setMaxGamma', woopoolData.maxGamma.toNumber());
    console.log('reserve', woopoolData.reserve.toNumber());

    return woopoolData;
  }

  public generatePoolParams = async(
    tokenMint: anchor.web3.PublicKey,
    quoteTokenMint: anchor.web3.PublicKey,
    feedAccount: anchor.web3.PublicKey,
    priceUpdate: anchor.web3.PublicKey
  ) => {
    const [wooracle] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('wooracle'), tokenMint.toBuffer(), feedAccount.toBuffer(), priceUpdate.toBuffer()],
      this.program.programId
    );

    const [woopool] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('woopool'), tokenMint.toBuffer(), quoteTokenMint.toBuffer()],
      this.program.programId
    );

    // woopool data should already be created after init
    const {tokenVault} = await this.program.account.wooPool.fetch(woopool);

    return {
      wooracle,
      woopool,
      tokenVault
    }
  }

}