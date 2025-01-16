import * as anchor from "@coral-xyz/anchor";
import * as borsh from "borsh";
import { BN, Program } from "@coral-xyz/anchor";
import * as token from "@solana/spl-token";
import { ConfirmOptions, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as web3 from "@solana/web3.js";
import { getLogs } from "@solana-developers/helpers";
import { Woofi } from "../../target/types/woofi";
import { getPythPrice } from "./pyth";
import { quotePriceUpdate, quoteTokenMint, solPriceUpdate, solTokenMint, SupportedToken, usdcPriceUpdate, usdcTokenMint } from "./test-consts";
import { getCluster } from "../global";
import { sendAndConfirm } from "./web3";
import { assert } from "chai";

const sleep = async (ms: number) => {
  return new Promise(r => setTimeout(r, ms));
};

export class PoolUtils {
  public provider: anchor.AnchorProvider;
  public program: Program<Woofi>;
  public sol_priceFeed;
  public usdc_priceFeed;

  // SOL/USD
  public solFeedAccount: anchor.web3.PublicKey;
  // USDC/USD
  public usdcFeedAccount: anchor.web3.PublicKey;
  public quoteFeedAccount: anchor.web3.PublicKey;

  public confirmOptionsRetryTres: ConfirmOptions = { maxRetries: 3, commitment: "confirmed" };
  public tenpow28 = new BN(10).pow(new BN(28));
  public tenpow18 = new BN(10).pow(new BN(18));
  public tenpow16 = new BN(10).pow(new BN(16));
  public tenpow15 = new BN(10).pow(new BN(15));
  public tenpow12 = new BN(10).pow(new BN(12));
  public tenpow14 = new BN(10).pow(new BN(14));

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

  public getLatestBlockHash = async () => {
    if (getCluster() == 'localnet') {
      return;
    }

    const blockhashResponse = await this.provider.connection.getLatestBlockhash();
    const lastValidBlockHeight = blockhashResponse.lastValidBlockHeight - 150;
    let blockheight = await this.provider.connection.getBlockHeight();
    console.log("blockhashResponse", blockhashResponse);
    console.log("current blockheight", blockheight);

    while (blockheight <= lastValidBlockHeight) {
      await sleep(500);
      blockheight = await this.provider.connection.getBlockHeight();
      console.log("current blockheight", blockheight);
    }
  }

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
    wooconfig: anchor.web3.PublicKey,
    oracle: anchor.web3.PublicKey,
    priceUpdate: anchor.web3.PublicKey,
    quotePriceUpdate: anchor.web3.PublicKey
  ) => {
    const confirmOptions: ConfirmOptions = { commitment: "confirmed", maxRetries: 3 };

    await this.getLatestBlockHash();

    const tx = await this.program
      .methods
      .getPrice()
      .accounts({
        wooconfig,
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

  public createConfig = async () => {
    const [wooconfig] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('wooconfig')],
      this.program.programId
    );
    
    let wooconfigData = null;
    try {
      wooconfigData = await this.program.account.wooConfig.fetch(wooconfig);
    } catch (e) {
      const error = e as Error;
      if (error.message.indexOf("Account does not exist") >= 0) {
          await this.getLatestBlockHash();

          const tx = await this.program
            .methods
            .createConfig()
            .accounts({
              wooconfig,
              authority: this.provider.wallet.publicKey,
            })
            .transaction();

          await sendAndConfirm(this.provider, tx);
      }
    }

    if (wooconfigData == null) {
      wooconfigData = await this.program.account.wooConfig.fetch(wooconfig);
    }

    return wooconfigData;
  }

  public createWooracle = async (token: SupportedToken, tokenMint: anchor.web3.PublicKey, feedAccount: anchor.web3.PublicKey, priceUpdate: anchor.web3.PublicKey) => {
    const [wooconfig] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('wooconfig')],
      this.program.programId
    );
    
    const [wooracle] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('wooracle'), wooconfig.toBuffer(), tokenMint.toBuffer(), feedAccount.toBuffer(), priceUpdate.toBuffer()],
      this.program.programId
    );

    let oracleItemData = null;
    try {
      oracleItemData = await this.program.account.wooracle.fetch(wooracle);
    } catch (e) {
      const error = e as Error;
      if (error.message.indexOf("Account does not exist") >= 0) {
          await this.getLatestBlockHash();

          // TODO Prince: need notice here
          // set maximum age to larger seconds due to pyth oracled push in 20mins in Dev env.
          const quoteFeedAccount = this.quoteFeedAccount;
          const tx = await this.program
            .methods
            .createWooracle(new BN(1000))
            .accounts({
              wooconfig,
              tokenMint,
              wooracle,
              admin: this.provider.wallet.publicKey,
              feedAccount,
              priceUpdate,
              quoteTokenMint,
              quoteFeedAccount,
              quotePriceUpdate
            })
            .transaction();

          await sendAndConfirm(this.provider, tx);
      }
    }

    if (oracleItemData == null) {
      oracleItemData = await this.program.account.wooracle.fetch(wooracle);
    }

    // init set wooracle range min and max
    const pythPrice = await getPythPrice(token);

    await this.getLatestBlockHash();

    const tx = await this.program
      .methods
      .setWooRange(pythPrice.rangeMin, pythPrice.rangeMax)
      .accounts({
        wooconfig,
        wooracle: wooracle,
        authority: this.provider.wallet.publicKey,
      })
      .transaction();

    await sendAndConfirm(this.provider, tx);

    return oracleItemData;
  }

  public createPool = async (tokenMint: anchor.web3.PublicKey, quoteTokenMint: anchor.web3.PublicKey, feedAccount: anchor.web3.PublicKey, priceUpdate: anchor.web3.PublicKey) => {
    const [wooconfig] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('wooconfig')],
      this.program.programId
    );

    const [wooracle] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('wooracle'), wooconfig.toBuffer(), tokenMint.toBuffer(), feedAccount.toBuffer(), priceUpdate.toBuffer()],
      this.program.programId
    );
  
    const [woopool] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('woopool'), wooconfig.toBuffer(), tokenMint.toBuffer(), quoteTokenMint.toBuffer()],
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

        await this.getLatestBlockHash();

        const tx = await this.program
        .methods
        .createPool()
        .accounts({
          wooconfig,
          tokenMint,
          quoteTokenMint,
          authority: this.provider.wallet.publicKey,
          woopool,
          tokenVault: tokenVaultKeypair.publicKey,
          wooracle,
          tokenProgram: token.TOKEN_PROGRAM_ID, 
          systemProgram: web3.SystemProgram.programId,
        })
        .transaction();

        await sendAndConfirm(this.provider, tx, [tokenVaultKeypair]);

        console.log('end create pool.');
      }
    }

    await this.getLatestBlockHash();

    // init set Pool Max Notional Swap
    const tx_setPoolMaxNotionalSwap = await this.program
    .methods
    .setPoolMaxNotionalSwap(new BN(100*LAMPORTS_PER_SOL))
    .accounts({
      wooconfig,
      woopool: woopool,
      authority: this.provider.wallet.publicKey
    }).transaction();

    await sendAndConfirm(this.provider, tx_setPoolMaxNotionalSwap);

    // init set Pool Max Notional Swap
    const tx_setPoolMaxGamma = await this.program
    .methods
    .setPoolMaxGamma(this.tenpow28) // same as ARB on arbitrum
    .accounts({
      wooconfig,
      woopool: woopool,
      authority: this.provider.wallet.publicKey
    }).transaction();

    await sendAndConfirm(this.provider, tx_setPoolMaxGamma);
    
    if (woopoolData == null) {
      woopoolData = await this.program.account.wooPool.fetch(woopool);
    }

    console.log('authority:' + woopoolData.authority);
    console.log('tokenMint:' + woopoolData.tokenMint);
    console.log('tokenVault:' + woopoolData.tokenVault);
    console.log('setPoolMaxNotionalSwap:', woopoolData.maxNotionalSwap.toNumber());
    console.log('setMaxGamma', woopoolData.maxGamma);

    return woopoolData;
  }

  public checkPool = async (tokenMint: anchor.web3.PublicKey, quoteTokenMint: anchor.web3.PublicKey, feedAccount: anchor.web3.PublicKey, priceUpdate: anchor.web3.PublicKey) => {
    const [wooconfig] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('wooconfig')],
      this.program.programId
    );

    const [wooracle] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('wooracle'), wooconfig.toBuffer(), tokenMint.toBuffer(), feedAccount.toBuffer(), priceUpdate.toBuffer()],
      this.program.programId
    );
  
    const [woopool] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('woopool'), wooconfig.toBuffer(), tokenMint.toBuffer(), quoteTokenMint.toBuffer()],
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
    console.log('tokenMint:', woopoolData.tokenMint);
    console.log('tokenVault:', woopoolData.tokenVault);
    console.log('setPoolMaxNotionalSwap:', woopoolData.maxNotionalSwap.toNumber());
    console.log('setMaxGamma', woopoolData.maxGamma);

    const poolVaultBalance = await this.provider.connection.getTokenAccountBalance(woopoolData.tokenVault);
    console.log("Pool vault balance amount:" + poolVaultBalance.value.amount);
    console.log("Pool vault balance decimals:" + poolVaultBalance.value.decimals);

    return {woopoolData, poolVaultBalance};
  }

  public generatePoolParams = async(
    tokenMint: anchor.web3.PublicKey,
    quoteTokenMint: anchor.web3.PublicKey,
    feedAccount: anchor.web3.PublicKey,
    priceUpdate: anchor.web3.PublicKey
  ) => {
    const [wooconfig] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('wooconfig')],
      this.program.programId
    );

    const [wooracle] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('wooracle'), wooconfig.toBuffer(), tokenMint.toBuffer(), feedAccount.toBuffer(), priceUpdate.toBuffer()],
      this.program.programId
    );

    const [woopool] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('woopool'), wooconfig.toBuffer(), tokenMint.toBuffer(), quoteTokenMint.toBuffer()],
      this.program.programId
    );

    // woopool data should already be created after init
    const {tokenVault} = await this.program.account.wooPool.fetch(woopool);

    return {
      wooconfig,
      wooracle,
      woopool,
      tokenVault
    }
  }

  public checkAdmins = async() => {
    const [wooconfig] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('wooconfig')],
      this.program.programId
    );

    const wooconfigData = await this.program.account.wooConfig.fetch(wooconfig);

    console.log('paused:', wooconfigData.paused);
    console.log('wooracleAdminAuthority:', wooconfigData.wooracleAdminAuthority)
    console.log('woopoolAdminAuthority:', wooconfigData.woopoolAdminAuthority)
    console.log('guardianAuthority:', wooconfigData.guardianAuthority)
    console.log('pauseAuthority:', wooconfigData.pauseAuthority)
  }

  public setLendingManagerAuthority = async(lendingManagerAdmins: web3.PublicKey[]) => {
    const [wooconfig] = await anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('wooconfig')],
        this.program.programId
      );
    
    console.log('Set lending manager admin authority to:', lendingManagerAdmins);
    const tx = await this.program
        .methods
        .setLendingManager(lendingManagerAdmins)
        .accounts({
            wooconfig,
            authority: this.provider.wallet.publicKey,
        }).transaction();
    await sendAndConfirm(this.provider, tx);
  }

  public swap = async(
    payerUser: web3.Keypair,
    payerWSOLTokenAccount: web3.PublicKey,
    payerUSDCTokenAccount: web3.PublicKey
  ) => {
      let fromAmount = 0.001 * LAMPORTS_PER_SOL;

      const wsolTokenAccount = payerWSOLTokenAccount;
      const usdcTokenAccount = payerUSDCTokenAccount;
      console.log("payer PublicKey:" + payerUser.publicKey);
      console.log('solWalletTokenAccount:' + wsolTokenAccount);
      console.log('usdcWalletTokenAccount:' + usdcTokenAccount);    

      const initBalance = await this.provider.connection.getBalance(payerUser.publicKey);
      console.log("fromWallet Balance:" + initBalance);
      const tokenBalance = await this.provider.connection.getTokenAccountBalance(wsolTokenAccount);
      console.log("fromTokenAccount amount:" + tokenBalance.value.amount);
      console.log("fromTokenAccount decimals:" + tokenBalance.value.decimals);

      const fromPoolParams = await this.generatePoolParams(solTokenMint, usdcTokenMint, this.solFeedAccount, solPriceUpdate);
      const toPoolParams = await this.generatePoolParams(usdcTokenMint, usdcTokenMint, this.usdcFeedAccount, usdcPriceUpdate);
      const quotePoolParams = await this.generatePoolParams(usdcTokenMint, usdcTokenMint, this.usdcFeedAccount, usdcPriceUpdate);
      const [fromPrice, fromFeasible] = await this.getOraclePriceResult(fromPoolParams.wooconfig, fromPoolParams.wooracle, solPriceUpdate, usdcPriceUpdate);
      console.log(`price - ${fromPrice}`);
      console.log(`feasible - ${fromFeasible}`);

      const [toPrice, toFeasible] = await this.getOraclePriceResult(toPoolParams.wooconfig, toPoolParams.wooracle, usdcPriceUpdate, usdcPriceUpdate);
      console.log(`price - ${toPrice}`);
      console.log(`feasible - ${toFeasible}`);


      const tx = await this.program
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
                  }).transaction();

      let sig = await sendAndConfirm(this.provider, tx);

      let t = await this.provider.connection.getTransaction(sig, {
        commitment: "confirmed",
      })

      const [key, data, buffer] = this.getReturnLog(t);
      const reader = new borsh.BinaryReader(buffer);
      const toAmount = reader.readU128().toNumber();
      const swapFee = reader.readU128().toNumber();
      console.log('toAmount:' + toAmount);
      console.log('swapFee:' + swapFee);

      const toVaultBalanceBefore = await this.provider.connection.getTokenAccountBalance(toPoolParams.tokenVault);
      console.log("toVault balance amount before:" + toVaultBalanceBefore.value.amount);
      console.log("toVault balance decimals before:" + toVaultBalanceBefore.value.decimals);

      let toPoolDataBefore = await this.program.account.wooPool.fetch(toPoolParams.woopool);
      console.log("toPool unclaimed fee before swap:" + toPoolDataBefore.unclaimedFee);

      const tx2 = await this.program
        .methods
        .swap(new BN(fromAmount), new BN(0))
        .accounts({
          wooconfig: fromPoolParams.wooconfig,
          tokenProgram: token.TOKEN_PROGRAM_ID,
          payer: payerUser.publicKey,  // is the user want to do swap
          wooracleFrom: fromPoolParams.wooracle,
          woopoolFrom: fromPoolParams.woopool,
          tokenOwnerAccountFrom: wsolTokenAccount,
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
          rebateTo: payerUser.publicKey,
        })
        .signers([payerUser])
        .transaction();
      await sendAndConfirm(this.provider, tx2, [payerUser]);

      const toVaultBalanceAfter = await this.provider.connection.getTokenAccountBalance(toPoolParams.tokenVault);
      console.log("toVault balance amount after:" + toVaultBalanceAfter.value.amount);
      console.log("toVault balance decimals after:" + toVaultBalanceAfter.value.decimals);
        
      let toPoolDataAfter = await this.program.account.wooPool.fetch(toPoolParams.woopool);
      console.log("toPool unclaimed fee after swap:" + toPoolDataAfter.unclaimedFee);

      const swapToAccountBalance = await this.provider.connection.getTokenAccountBalance(usdcTokenAccount);
      console.log("swapToAccount balance amount:" + swapToAccountBalance.value.amount);
      console.log("swapToAccount balance decimals:" + swapToAccountBalance.value.decimals);

      assert.equal(parseInt(toVaultBalanceAfter.value.amount), parseInt(toVaultBalanceBefore.value.amount) - toAmount);
      assert.equal(parseInt(swapToAccountBalance.value.amount), toAmount);
      assert.equal(toPoolDataAfter.unclaimedFee.toNumber(), toPoolDataBefore.unclaimedFee.toNumber() + swapFee);
  }

}