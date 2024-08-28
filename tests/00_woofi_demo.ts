import { BN, Program } from "@coral-xyz/anchor";
import * as token from "@solana/spl-token";
import { assert } from "chai";
import { getLogs } from "@solana-developers/helpers";
import { PoolUtils } from "./utils/pool";
import { usdcTokenMint, usdcPriceUpdate, confirmOptionsRetryTres } from "./utils/test-consts";

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

//   describe("#get_price_from_contract", async ()=> {
//     it("get_sol_price", async ()=> {

//       const bs58 = require('bs58')
//       const sol_bytes = Buffer.from('ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d', 'hex')
//       const sol_priceFeed = bs58.encode(sol_bytes)
//       const feedAccount = new anchor.web3.PublicKey(sol_priceFeed);

//       const priceUpdate = new anchor.web3.PublicKey("7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE");

//       const solTokenMint = new anchor.web3.PublicKey("So11111111111111111111111111111111111111112");

//       const [oracle] = await anchor.web3.PublicKey.findProgramAddressSync(
//         [Buffer.from('pythoracle'), feedAccount.toBuffer(), priceUpdate.toBuffer()],
//         program.programId
//       );
  
//       const [wooracle] = await anchor.web3.PublicKey.findProgramAddressSync(
//         [Buffer.from('wooracle'), feedAccount.toBuffer(), priceUpdate.toBuffer()],
//         program.programId
//       );
  
//       const [woopool] = await anchor.web3.PublicKey.findProgramAddressSync(
//         [Buffer.from('woopool'), solTokenMint.toBuffer()],
//         program.programId
//       );

//       console.log('feedAccount:', feedAccount);
//       console.log('priceUpdate:', priceUpdate);
//       console.log('program.programId:', program.programId);
//       console.log('solTokenMint', solTokenMint);
  
//       // init set wooracle range min and max
//       const oraclePythData = await program.account.oracle.fetch(oracle);
//       console.log('oracle pyth price:' + oraclePythData.round);
//       const oracleItemData = await program.account.woOracle.fetch(wooracle);
//       const rangeMin = oraclePythData.round.mul(new BN(10)).div(new BN(20));
//       const rangeMax = oraclePythData.round.mul(new BN(30)).div(new BN(20));
//       console.log('oraclePythData.round', oraclePythData.round.toNumber());
//       console.log('oraclePythData.updatedAt', oraclePythData.updatedAt.toString());
//       console.log('calc rangeMin:', rangeMin.toNumber());
//       console.log('calc rangeMax:', rangeMax.toNumber());

//       console.log('wooracle price:', oracleItemData.price.toNumber());
//       console.log('wooracle bound:', oracleItemData.bound.toString());
//       console.log(`wooracle bound percentage: ${oracleItemData.bound.mul(new BN(100)).div(TENPOW18U128)}%`);
//       console.log('wooracle coeff:', oracleItemData.coeff.toNumber());
//       console.log('wooracle spread:', oracleItemData.spread.toNumber());
//       console.log('wooracle rangeMin:', oracleItemData.rangeMin.toNumber());
//       console.log('wooracle rangeMax:', oracleItemData.rangeMax.toNumber());
//       console.log('wooracle updatedAt:', oracleItemData.updatedAt.toString());
//       console.log('wooracle staleDuration:', oracleItemData.staleDuration.toNumber());

//       const [fromPrice, fromFeasible] = await getOraclePriceResult(oracle, wooracle, priceUpdate);  
//       console.log(`price - ${fromPrice}`);
//       console.log(`feasible - ${fromFeasible}`);
//     })

//   })
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
});
