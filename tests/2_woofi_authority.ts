import * as anchor from "@coral-xyz/anchor";
import { assert } from "chai";
import { PoolUtils } from "./utils/pool";
import { confirmOptionsRetryTres } from "./utils/test-consts";

describe("woofi", () => {
  const poolUtils = new PoolUtils();
  poolUtils.initEnv();

  const provider = poolUtils.provider;
  const program = poolUtils.program;

  // SOL/USD
  const solFeedAccount = poolUtils.solFeedAccount;
  // USDC/USD
  const usdcFeedAccount = poolUtils.usdcFeedAccount;
  const quoteFeedAccount = usdcFeedAccount;

  const adminPublicKey = new anchor.web3.PublicKey("EW4E3yBnijzDjoyBpDkgQkJ48Yd6cmponxRsuUT2Cinn");
  const adminPublicKey2 = new anchor.web3.PublicKey("GG4ZxC4a5fukCSxbFUCHWyYDHybmhMXrs5wTf9BDAnRb");

  const oracleKeys: anchor.web3.Keypair[] = [];
  for (let i = 0; i < 3; ++i) {
    const key = anchor.web3.Keypair.generate();
    console.log('Oracle Keypair:' + i + ':' + key.publicKey);
    oracleKeys.push(key);
  }
  const wooAdmins: anchor.web3.PublicKey[] = [adminPublicKey, adminPublicKey2];
  oracleKeys.every(key => wooAdmins.push(key.publicKey))

  const poolKeys: anchor.web3.Keypair[] = [];
  for (let i = 0; i < 3; ++i) {
    const key = anchor.web3.Keypair.generate();
    console.log('WooPool Keypair:' + i + ':' + key.publicKey);
    poolKeys.push(key);
  }
  const poolAdmins: anchor.web3.PublicKey[] = [adminPublicKey, adminPublicKey2];
  poolKeys.every(key => poolAdmins.push(key.publicKey))

  const guardianKeys: anchor.web3.Keypair[] = [];
  for (let i = 0; i < 5; ++i) {
    const key = anchor.web3.Keypair.generate();
    console.log('Guardian Keypair:' + i + ':' + key.publicKey);
    guardianKeys.push(key);
  }

  const pauseKeys: anchor.web3.Keypair[] = [];
  for (let i = 0; i < 5; ++i) {
    const key = anchor.web3.Keypair.generate();
    console.log('Pause Keypair:' + i + ':' + key.publicKey);
    pauseKeys.push(key);
  }

  const feeKeys: anchor.web3.Keypair[] = [];
  for (let i = 0; i < 5; ++i) {
    const key = anchor.web3.Keypair.generate();
    console.log('Fee Keypair:' + i + ':' + key.publicKey);
    feeKeys.push(key);
  }

//   describe("#set_woo_admin()", async () => {
//     const [wooconfig] = await anchor.web3.PublicKey.findProgramAddressSync(
//         [Buffer.from('wooconfig')],
//         program.programId
//       );

//     it("set woo oracle admin", async () => {        
//         console.log('Set wooracle admin authority to:', adminPublicKey);
//         await program
//             .methods
//             .setWooAdmin(wooAdmins)
//             .accounts({
//                 wooconfig,
//                 authority: provider.wallet.publicKey,
//             })
//             .rpc(confirmOptionsRetryTres);

//         await program
//             .methods
//             .setPoolAdmin(poolAdmins)
//             .accounts({
//                 wooconfig,
//                 authority: provider.wallet.publicKey,
//             })
//             .rpc(confirmOptionsRetryTres);

//         await program
//             .methods
//             .setGuardianAdmin(guardianKeys.map(key => key.publicKey))
//             .accounts({
//                 wooconfig,
//                 authority: provider.wallet.publicKey,
//             })
//             .rpc(confirmOptionsRetryTres);

//         await program
//             .methods
//             .setPauseRole(pauseKeys.map(key => key.publicKey))
//             .accounts({
//                 wooconfig,
//                 authority: provider.wallet.publicKey,
//             })
//             .rpc(confirmOptionsRetryTres);

//         await program
//             .methods
//             .setFeeAdmin(feeKeys.map(key => key.publicKey))
//             .accounts({
//                 wooconfig,
//                 authority: provider.wallet.publicKey,
//             })
//             .rpc(confirmOptionsRetryTres);

//         poolUtils.checkAdmins();
//     });
//   });

//   describe("#set_woopool_admin_using_admin_authority()", async () => {
//     const [wooconfig] = await anchor.web3.PublicKey.findProgramAddressSync(
//         [Buffer.from('wooconfig')],
//         program.programId
//       );
    
//     it("set woopool admin", async () => {
//         //console.log('Set wooracle admin authority to:', adminPublicKey);
//         await program
//             .methods
//             .setPoolAdmin([poolKeys[1].publicKey])
//             .accounts({
//                 wooconfig,
//                 authority: poolKeys[0].publicKey,
//             })
//             .signers([poolKeys[0]])
//             .rpc(confirmOptionsRetryTres);

//         try {
//             await program
//                 .methods
//                 .setPoolAdmin([poolKeys[1].publicKey])
//                 .accounts({
//                     wooconfig,
//                     authority: poolKeys[0].publicKey,
//                 })
//                 .signers([poolKeys[0]])
//                 .rpc(confirmOptionsRetryTres);

//             assert.fail(
//                 "should fail no auth"
//             );
//         } catch (e) {
//             const error = e as Error;
//             console.log("----------------------name----------------------------")
//             console.log(error.name);
//             console.log("----------------------message-------------------------")
//             console.log(error.message);
//             console.log("----------------------stack---------------------------")
//             console.log(error.stack);
//             console.log("----------------------end-----------------------------")

//             assert.match(error.message, /A raw constraint was violated./);
//         }

//         await program
//             .methods
//             .setPoolAdmin(poolAdmins)
//             .accounts({
//                 wooconfig,
//                 authority: provider.wallet.publicKey,
//             })
//             .rpc(confirmOptionsRetryTres);

//         poolUtils.checkAdmins();
//     });
//   });


//   describe("#set_usdc_woo_admin()", async () => {
//     it("set usdc woo oracle admin", async () => {

//       const usdcPoolParams = await poolUtils.generatePoolParams(usdcTokenMint, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);

//       console.log('Set usdc wooracle admin authority to:', adminPublicKey);
//       await program
//         .methods
//         .setWooAdmin(adminPublicKey)
//         .accounts({
//           wooracle: usdcPoolParams.wooracle,
//           authority: provider.wallet.publicKey,
//         })
//         .rpc(confirmOptionsRetryTres);
      
//       const result = await program.account.woOracle.fetch(usdcPoolParams.wooracle);
//       console.log(`admin authority: ${result.adminAuthority}`);
//       assert.ok(
//         result.adminAuthority.equals(adminPublicKey), "wooracle admin authority should be the same with setted"
//       );

//     });
//   });

//   describe("#set_sol_pool_admin()", async () => {
//     it("set sol pool admin", async () => {

//       const usdcPoolParams = await poolUtils.generatePoolParams(usdcTokenMint, usdcTokenMint, usdcFeedAccount, usdcPriceUpdate);

//       console.log('Set sol pol admin authority to:', adminPublicKey);
//       await program
//         .methods
//         .setPoolAdmin(adminPublicKey)
//         .accounts({
//           woopool: usdcPoolParams.woopool,
//           authority: provider.wallet.publicKey,
//         })
//         .rpc(confirmOptionsRetryTres);
      
//       const result = await program.account.wooPool.fetch(usdcPoolParams.woopool);
//       console.log(`admin authority: ${result.adminAuthority}`);
//       assert.ok(
//         result.adminAuthority.equals(adminPublicKey), "woopool admin authority should be the same with setted"
//       );

//     });
//   });

//   describe("#set_usdc_pool_admin()", async () => {
//     it("set usdc pool admin", async () => {

//       const solPoolParams = await poolUtils.generatePoolParams(solTokenMint, usdcTokenMint, solFeedAccount, solPriceUpdate);

//       console.log('Set sol pol admin authority to:', adminPublicKey);
//       await program
//         .methods
//         .setPoolAdmin(adminPublicKey)
//         .accounts({
//           woopool: solPoolParams.woopool,
//           authority: provider.wallet.publicKey,
//         })
//         .rpc(confirmOptionsRetryTres);
      
//       const result = await program.account.wooPool.fetch(solPoolParams.woopool);
//       console.log(`admin authority: ${result.adminAuthority}`);
//       assert.ok(
//         result.adminAuthority.equals(adminPublicKey), "woopool admin authority should be the same with setted"
//       );

//     });
//   });

});
