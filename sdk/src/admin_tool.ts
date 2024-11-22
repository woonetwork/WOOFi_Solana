import * as anchor from "@coral-xyz/anchor";
import * as token from "@solana/spl-token";
import { getLogs } from "@solana-developers/helpers";
import { WoofiContext } from "./context";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { runQuery } from "./utils/pyth";
import BN from "bn.js";
import moment from "moment";
import { WoofiClient } from "./client";
import {
  PYTH_FEED_ACCOUNT,
  PYTH_PRICE_UPDATE_ACCOUNT,
  TOKEN_MINTS,
  WOOFI_TOKENS,
} from "./utils/constants";

// Create a connection to the Solana devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
// Initialize wallet from local keypair file
const keyFile = require("os").homedir() + "/.config/solana/id.json";
const secretKey = Buffer.from(JSON.parse(require("fs").readFileSync(keyFile, "utf-8")));
const wallet = new anchor.Wallet(anchor.web3.Keypair.fromSecretKey(secretKey));
// Initialize WoofiContext
const ctx = WoofiContext.from(connection, wallet);

async function getWooConfigAccount() {
  const [wooconfig] = await anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("wooconfig")],
    ctx.program.programId,
  );
  return wooconfig;
}

async function getWooracleAccount(token: string) {
  const wooconfigAccount = await getWooConfigAccount();

  const tokenMint = new anchor.web3.PublicKey(
    token == "SOL" ? TOKEN_MINTS.SOL : TOKEN_MINTS.USDC,
  );
  const feedAccount = new anchor.web3.PublicKey(
    token == "SOL" ? PYTH_FEED_ACCOUNT.SOL : PYTH_FEED_ACCOUNT.USDC,
  );
  const priceUpdateAccount = new anchor.web3.PublicKey(
    token == "SOL" ? PYTH_PRICE_UPDATE_ACCOUNT.SOL : PYTH_PRICE_UPDATE_ACCOUNT.USDC,
  );

  // initialize WOORACLE
  const [wooracleAccount] = await anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("wooracle"),
      wooconfigAccount.toBuffer(),
      tokenMint.toBuffer(),
      feedAccount.toBuffer(),
      priceUpdateAccount.toBuffer(),
    ],
    ctx.program.programId,
  );
  return wooracleAccount;
}

async function getWooPoolAccount(
  tokenMint: anchor.web3.PublicKey,
  quoteTokenMint: anchor.web3.PublicKey,
) {
  const wooconfigAccount = await getWooConfigAccount();
  const [woopoolAccount] = await anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("woopool"),
      wooconfigAccount.toBuffer(),
      tokenMint.toBuffer(),
      quoteTokenMint.toBuffer(),
    ],
    ctx.program.programId,
  );
  return woopoolAccount;
}

async function createWooConfig() {
  const wooconfigAccount = await getWooConfigAccount();
  console.log("wooconfig address:", wooconfigAccount.toBase58());

  const tx = await ctx.program.methods
    .createConfig()
    .accounts({
      wooconfig: wooconfigAccount,
      authority: ctx.wallet.publicKey,
    })
    .rpc();

  console.log("tx hash:", tx);
  const logs = await getLogs(ctx.connection, tx);
  console.log("tx logs:", logs);
}

async function fetchWooConfig() {
  const wooconfigAccount = await getWooConfigAccount();
  console.log("wooconfig address:", wooconfigAccount.toBase58());
  const wooconfigData = await ctx.program.account.wooConfig.fetch(wooconfigAccount);
  console.log("wooconfig data: ", wooconfigData);
}

async function createWooracle(token: string) {
  const wooconfigAccount = await getWooConfigAccount();
  const wooracleAccount = await getWooracleAccount(token);
  console.log("wooracle address:", wooracleAccount.toBase58());

  // initialize SOL/USDC token mint
  const tokenMint = new anchor.web3.PublicKey(token == "SOL" ? TOKEN_MINTS.SOL : TOKEN_MINTS.USDC);
  const usdcTokenMint = new anchor.web3.PublicKey(TOKEN_MINTS.USDC);

  // initialize SOL/USDC price feed
  const feedAccount = new anchor.web3.PublicKey(token == "SOL" ? PYTH_FEED_ACCOUNT.SOL : PYTH_FEED_ACCOUNT.USDC);
  const usdcFeedAccount = new anchor.web3.PublicKey(PYTH_FEED_ACCOUNT.USDC);

  // initialize SOL/USDC price update
  const priceUpdateAccount = new anchor.web3.PublicKey(token == "SOL" ? PYTH_PRICE_UPDATE_ACCOUNT.SOL : PYTH_PRICE_UPDATE_ACCOUNT.USDC);
  const usdcPriceUpdateAccount = new anchor.web3.PublicKey(PYTH_PRICE_UPDATE_ACCOUNT.USDC);

  const tx = await ctx.program.methods
    .createWooracle(new BN(1000))
    .accounts({
      wooconfig: wooconfigAccount,
      tokenMint: tokenMint,
      wooracle: wooracleAccount,
      admin: ctx.provider.wallet.publicKey,
      feedAccount: feedAccount,
      priceUpdate: priceUpdateAccount,
      quoteTokenMint: usdcTokenMint,
      quoteFeedAccount: usdcFeedAccount,
      quotePriceUpdate: usdcPriceUpdateAccount,
    })
    .rpc();

  console.log("tx hash:", tx);
  const logs = await getLogs(ctx.provider.connection, tx);
  console.log("tx logs:", logs);
}

async function fetchWooracle(token: string) {
  const wooracleAccount = await getWooracleAccount(token);
  console.log("wooracle address:", wooracleAccount.toBase58());
  const wooracleData = await ctx.program.account.wooracle.fetch(wooracleAccount);
  console.log("wooracle data: ", wooracleData);
}

async function syncPythPrice() {
  const pythPriceFeed = (await runQuery())!; // assume pyth price feed is available
  const solPrice = pythPriceFeed[0].getPriceNoOlderThan(1000)!;
  console.log("solPrice", solPrice);

  const usdcPrice = pythPriceFeed[1].getPriceNoOlderThan(1000)!;
  console.log("usdcPrice", usdcPrice);

  // use usdc as quote token
  const pythoracle_decimal = Math.abs(solPrice.expo);
  const pythoracle_price = new BN(solPrice.price)
    .mul(new BN(10).pow(new BN(pythoracle_decimal)))
    .div(new BN(usdcPrice.price));

  const updatedAt = moment.unix(solPrice.publishTime);

  console.log(`pythoracle_price:${pythoracle_price}`);
  console.log(`pythoracle_decimal:${pythoracle_decimal}`);
  console.log(`updated at - ${updatedAt}`);

  // TODO Prince: The price is the latest pyth price
  // May slightly differ from the one in wooracle's pyth price (clone program in localnet)
  const traderSetPrice = pythoracle_price;
  const rangeMax = traderSetPrice.mul(new BN(110)).div(new BN(100));
  const rangeMin = traderSetPrice.mul(new BN(90)).div(new BN(100));

  console.log("traderSetPrice: ", traderSetPrice.toNumber());
  console.log("rangeMin: ", rangeMin.toNumber());
  console.log("rangeMax: ", rangeMax.toNumber());
}

async function setStaleDuration(token: string) {
  const wooconfigAccount = await getWooConfigAccount();
  const wooracleAccount = await getWooracleAccount(token);
  const setStaleDuration = new BN(1200);

  const tx = await ctx.program.methods
    .setStaleDuration(setStaleDuration)
    .accounts({
      wooconfig: wooconfigAccount,
      wooracle: wooracleAccount,
      authority: ctx.provider.wallet.publicKey,
    })
    .rpc();

  console.log("tx hash:", tx);
  const logs = await getLogs(ctx.provider.connection, tx);
  console.log("tx logs:", logs);
}

async function setWooState(token: string) {
  const wooconfigAccount = await getWooConfigAccount();
  const wooracleAccount = await getWooracleAccount(token);

  const pythPriceFeed = (await runQuery())!;
  const setPrice = new BN(pythPriceFeed[0].getPriceNoOlderThan(1000)!.price);
  const setCoeff = new BN(100);
  const setSpread = new BN(200);

  const tx = await ctx.program.methods
    .setWooState(setPrice, setCoeff, setSpread)
    .accounts({
      wooconfig: wooconfigAccount,
      wooracle: wooracleAccount,
      authority: ctx.provider.wallet.publicKey,
    })
    .rpc();

  console.log("tx hash:", tx);
  const logs = await getLogs(ctx.provider.connection, tx);
  console.log("tx logs:", logs);
}

async function setWooPrice(token: string) {
  const wooconfigAccount = await getWooConfigAccount();
  const wooracleAccount = await getWooracleAccount(token);

  const pythPriceFeed = (await runQuery())!;
  const solPrice = pythPriceFeed[0].getPriceNoOlderThan(1000)!;
  const usdcPrice = pythPriceFeed[1].getPriceNoOlderThan(1000)!;

  const price = token == "SOL" ? solPrice : usdcPrice;

  // use usdc as quote token
  const pythoracle_decimal = Math.abs(price.expo);
  const pythoracle_price = new BN(price.price)
    .mul(new BN(10).pow(new BN(pythoracle_decimal)))
    .div(new BN(usdcPrice.price));
  console.log("pythoracle_price: ", pythoracle_price.toNumber());

  const tx = await ctx.program.methods
    .setWooPrice(pythoracle_price)
    .accounts({
      wooconfig: wooconfigAccount,
      wooracle: wooracleAccount,
      authority: ctx.provider.wallet.publicKey,
    })
    .rpc();

  console.log("tx hash:", tx);
  const logs = await getLogs(ctx.provider.connection, tx);
  console.log("tx logs:", logs);
}

async function setWooRange(token: string) {
  const wooconfigAccount = await getWooConfigAccount();
  const wooracleAccount = await getWooracleAccount(token);

  const rangeMin = new BN(1);
  const rangeMax = new BN(100000000000);

  const tx = await ctx.program.methods
    .setWooRange(rangeMin, rangeMax)
    .accounts({
      wooconfig: wooconfigAccount,
      wooracle: wooracleAccount,
      authority: ctx.provider.wallet.publicKey,
    })
    .rpc();

  console.log("tx hash:", tx);
  const logs = await getLogs(ctx.provider.connection, tx);
  console.log("tx logs:", logs);
}

async function setWooBound(token: string) {
  const wooconfigAccount = await getWooConfigAccount();
  const wooracleAccount = await getWooracleAccount(token);

  // 1e16 means 1%, 2.5%
  const bound = new BN(25).mul(new BN(10).pow(new BN(15)));
  const tx = await ctx.program.methods
    .setWooBound(bound)
    .accounts({
      wooconfig: wooconfigAccount,
      wooracle: wooracleAccount,
      authority: ctx.provider.wallet.publicKey,
    })
    .rpc();

  console.log("tx hash:", tx);
  const logs = await getLogs(ctx.provider.connection, tx);
  console.log("tx logs:", logs);
}

async function createWooPool(tokenName: string) {
  const wooconfigAccount = await getWooConfigAccount();
  const wooracleAccount = await getWooracleAccount(tokenName);

  const tokenMint = new anchor.web3.PublicKey(tokenName == "SOL" ? TOKEN_MINTS.SOL : TOKEN_MINTS.USDC);
  const usdcTokenMint = new anchor.web3.PublicKey(TOKEN_MINTS.USDC);
  const woopoolAccount = await getWooPoolAccount(tokenMint, usdcTokenMint);
  console.log("woopool address:", woopoolAccount.toBase58());

  const tokenVaultKeypair = anchor.web3.Keypair.generate();
  console.log("tokenVault address:", tokenVaultKeypair.publicKey.toBase58());
  const tx = await ctx.program.methods
    .createPool()
    .accounts({
      wooconfig: wooconfigAccount,
      tokenMint,
      quoteTokenMint: usdcTokenMint,
      authority: ctx.provider.wallet.publicKey,
      woopool: woopoolAccount,
      tokenVault: tokenVaultKeypair.publicKey,
      wooracle: wooracleAccount,
      tokenProgram: token.TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([tokenVaultKeypair])
    .rpc();

  console.log("tx hash:", tx);
  const logs = await getLogs(ctx.provider.connection, tx);
  console.log("tx logs:", logs);
}

async function fetchWooPool(token: string) {
  const tokenMint = new anchor.web3.PublicKey(token == "SOL" ? TOKEN_MINTS.SOL : TOKEN_MINTS.USDC);
  const usdcTokenMint = new anchor.web3.PublicKey(TOKEN_MINTS.USDC);
  const woopoolAccount = await getWooPoolAccount(tokenMint, usdcTokenMint);
  console.log("woopool address:", woopoolAccount.toBase58());
  const woopoolData = await ctx.program.account.wooPool.fetch(woopoolAccount);
  console.log("woopool data: ", woopoolData);
}

async function apiQuery() {
  const fromAmount = new BN(1_000_000_000); // 1 SOL
  const result = await WoofiClient.tryQuery(
    ctx,
    fromAmount,
    WOOFI_TOKENS["SOL"],
    WOOFI_TOKENS["USDC"],
  );

  console.log("Query result:");
  console.log("from amount:", fromAmount);
  console.log("to amount:", result.to_amount);
  console.log("swap fee:", result.swap_fee);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log("Please provide a command: like create_wooconfig, create_wooracle");
    process.exit(1);
  }

  const command = args[0];
  switch (command) {
    case "create_wooconfig":
      await createWooConfig();
      break;
    case "fetch_wooconfig":
      await fetchWooConfig();
      break;
    case "create_wooracle":
      await createWooracle(args[1]);
      break;
    case "fetch_wooracle":
      await fetchWooracle(args[1]);
      break;
    case "sync_pyth_price":
      await syncPythPrice();
      break;
    case "set_stale_duration":
      await setStaleDuration(args[1]);
      break;
    case "set_woo_state":
      await setWooState(args[1]);
      break;
    case "set_woo_range":
      await setWooRange(args[1]);
      break;
    case "set_woo_bound":
      await setWooBound(args[1]);
      break;
    case "set_woo_price":
      await setWooPrice(args[1]);
      break;
    case "create_woopool":
      await createWooPool(args[1]);
      break;
    case "fetch_woopool":
      await fetchWooPool(args[1]);
      break;
    case "api_query":
      await apiQuery();
      break;
    default:
      console.log("Invalid command");
      process.exit(1);
  }
}

main();
