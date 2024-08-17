import * as anchor from "@coral-xyz/anchor";
import * as borsh from "borsh";
import { BN, Program } from "@coral-xyz/anchor";
import * as token from "@solana/spl-token";
import { ConfirmOptions, LAMPORTS_PER_SOL, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import * as web3 from "@solana/web3.js";
import { Woospmm } from "../target/types/woospmm";
import { assert } from "chai";
import Decimal from "decimal.js";
import moment from "moment";
import * as global from "./global";
import { createAssociatedTokenAccount, transferToken } from "./utils/token";

describe("woospmm_swap", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Woospmm as Program<Woospmm>;

  const TENPOW18U128 = new BN(10).pow(new BN(18));

  const solTokenMint = new anchor.web3.PublicKey("So11111111111111111111111111111111111111112");
  const usdcTokenMint = new anchor.web3.PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");

    // SOL pyth oracle price feed
  // https://pyth.network/developers/price-feed-ids
  const bs58 = require('bs58')
  const sol_bytes = Buffer.from('ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d', 'hex')
  const sol_priceFeed = bs58.encode(sol_bytes)
  console.log("SOL PriceFeed:", sol_priceFeed)
  const usdc_bytes = Buffer.from('eaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a', 'hex')
  const usdc_priceFeed = bs58.encode(usdc_bytes)
  console.log("USDC PriceFeed:", usdc_priceFeed)

  // SOL Price Update
  const solPriceUpdate = new anchor.web3.PublicKey("7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE");
  // USDC Price Update
  const usdcPriceUpdate = new anchor.web3.PublicKey("Dpw1EAVrSB1ibxiDQyTAW6Zip3J4Btk2x4SgApQCeFbX");
  // SOL/USD
  const solFeedAccount = new anchor.web3.PublicKey(sol_priceFeed);
  // USDC/USD
  const usdcFeedAccount = new anchor.web3.PublicKey(usdc_priceFeed);

  const confirmOptionsRetryTres: ConfirmOptions = { commitment: "confirmed", maxRetries: 3 };
  const tenpow18 = new BN(10).pow(new BN(18));
  const tenpow16 = new BN(10).pow(new BN(16));

  let pythoracleAccount;
  let wooracleAccount;
  let pythoracle_price: BN;
  let pythoracle_decimal: Number;

  let traderSetPrice = new BN(2200000000);
  let rangeMin = new BN(2000000000);
  let rangeMax = new BN(2300000000);

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

  const getOraclePriceResult = async (oracle: anchor.web3.PublicKey, wooracle: anchor.web3.PublicKey, priceUpdate: anchor.web3.PublicKey) => {
    const tx = await program
      .methods
      .getPrice()
      .accounts({
        oracle,
        wooracle,
        priceUpdate
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

  const createOracle = async (feedAccount: anchor.web3.PublicKey, priceUpdate: anchor.web3.PublicKey) => {
    const [pythoracle] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('pythoracle'), feedAccount.toBuffer(), priceUpdate.toBuffer()],
      program.programId
    );

    const [wooracle] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('wooracle'), feedAccount.toBuffer(), priceUpdate.toBuffer()],
      program.programId
    );

    let oracleItemData = null;
    try {
      oracleItemData = await program.account.woOracle.fetch(wooracle);
    } catch (e) {
      const error = e as Error;
      if (error.message.indexOf("Account does not exist") >= 0) {
        // TODO Prince: need notice here
        // set maximum age to larger seconds due to pyth oracled push in 20mins in Dev env.
        await program
          .methods
          .createOraclePyth(new BN(1000))
          .accounts({
            pythoracle,
            wooracle,
            admin: provider.wallet.publicKey,
            feedAccount,
            priceUpdate
          })
          .rpc(confirmOptionsRetryTres);   
      }
    }

    if (oracleItemData == null) {
      oracleItemData = await program.account.woOracle.fetch(wooracle);
    }

    // init set wooracle range min and max
    const oraclePythData = await program.account.oracle.fetch(pythoracle);
    console.log('oracle pyth price:' + oraclePythData.round);
    console.log('wooracle price:' + oracleItemData.price);

    const rangeMin = oraclePythData.round.mul(new BN(10)).div(new BN(20));
    const rangeMax = oraclePythData.round.mul(new BN(30)).div(new BN(20));
    console.log('oraclePythData', oraclePythData.round.toNumber());
    console.log('rangeMin:', rangeMin.toNumber());
    console.log('rangeMax:', rangeMax.toNumber());

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

  const createPool = async (feedAccount: anchor.web3.PublicKey, tokenMint: anchor.web3.PublicKey, priceUpdate: anchor.web3.PublicKey) => {
    const [pythoracle] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('pythoracle'), feedAccount.toBuffer(), priceUpdate.toBuffer()],
      program.programId
    );

    const [wooracle] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('wooracle'), feedAccount.toBuffer(), priceUpdate.toBuffer()],
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
          oracle: pythoracle,
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
    }).rpc(confirmOptionsRetryTres);

    // init set Pool Max Notional Swap
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
    tokenMint: anchor.web3.PublicKey,
    priceUpdate: anchor.web3.PublicKey
  ) => {
    const [oracle] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('pythoracle'), feedAccount.toBuffer(), priceUpdate.toBuffer()],
      program.programId
    );

    const [wooracle] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('wooracle'), feedAccount.toBuffer(), priceUpdate.toBuffer()],
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

  describe("#get_price_from_contract", async ()=> {
    it("get_sol_price", async ()=> {

      const bs58 = require('bs58')
      const sol_bytes = Buffer.from('ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d', 'hex')
      const sol_priceFeed = bs58.encode(sol_bytes)
      const feedAccount = new anchor.web3.PublicKey(sol_priceFeed);

      const priceUpdate = new anchor.web3.PublicKey("7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE");

      const solTokenMint = new anchor.web3.PublicKey("So11111111111111111111111111111111111111112");

      const [oracle] = await anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('pythoracle'), feedAccount.toBuffer(), priceUpdate.toBuffer()],
        program.programId
      );
  
      const [wooracle] = await anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('wooracle'), feedAccount.toBuffer(), priceUpdate.toBuffer()],
        program.programId
      );
  
      const [woopool] = await anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('woopool'), solTokenMint.toBuffer()],
        program.programId
      );

      console.log('feedAccount:', feedAccount);
      console.log('priceUpdate:', priceUpdate);
      console.log('program.programId:', program.programId);
      console.log('solTokenMint', solTokenMint);
  
      // init set wooracle range min and max
      const oraclePythData = await program.account.oracle.fetch(oracle);
      console.log('oracle pyth price:' + oraclePythData.round);
      const oracleItemData = await program.account.woOracle.fetch(wooracle);
      const rangeMin = oraclePythData.round.mul(new BN(10)).div(new BN(20));
      const rangeMax = oraclePythData.round.mul(new BN(30)).div(new BN(20));
      console.log('oraclePythData.round', oraclePythData.round.toNumber());
      console.log('oraclePythData.updatedAt', oraclePythData.updatedAt.toString());
      console.log('calc rangeMin:', rangeMin.toNumber());
      console.log('calc rangeMax:', rangeMax.toNumber());

      console.log('wooracle price:', oracleItemData.price.toNumber());
      console.log('wooracle bound:', oracleItemData.bound.toString());
      console.log(`wooracle bound percentage: ${oracleItemData.bound.mul(new BN(100)).div(TENPOW18U128)}%`);
      console.log('wooracle coeff:', oracleItemData.coeff.toNumber());
      console.log('wooracle spread:', oracleItemData.spread.toNumber());
      console.log('wooracle rangeMin:', oracleItemData.rangeMin.toNumber());
      console.log('wooracle rangeMax:', oracleItemData.rangeMax.toNumber());
      console.log('wooracle updatedAt:', oracleItemData.updatedAt.toString());
      console.log('wooracle staleDuration:', oracleItemData.staleDuration.toNumber());

      const [fromPrice, fromFeasible] = await getOraclePriceResult(oracle, wooracle, priceUpdate);  
      console.log(`price - ${fromPrice}`);
      console.log(`feasible - ${fromFeasible}`);
    })

  })

});
