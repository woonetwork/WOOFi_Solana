import * as anchor from "@coral-xyz/anchor";
import * as borsh from "borsh";
import { BN, Program } from "@coral-xyz/anchor";
import { ConfirmOptions } from "@solana/web3.js";
import { getLogs } from "@solana-developers/helpers";
import { Woofi } from "../target/types/woofi";
import { Wallet } from "@coral-xyz/anchor";
import { assert } from "chai";
import Decimal from "decimal.js";
import moment from "moment";
import * as global from "./global";
import { runQuery } from "./utils/pyth";

describe("woofi", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Woofi as Program<Woofi>;

  const solTokenMint = new anchor.web3.PublicKey("So11111111111111111111111111111111111111112");
  const usdcTokenMint = new anchor.web3.PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");

  let wooracleAccount;
  let pythoracle_price: BN;
  let pythoracle_decimal: number;

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

  const quoteTokenMint = usdcTokenMint;
  const quoteFeedAccount = usdcFeedAccount;
  const quotePriceUpdate = usdcPriceUpdate;
  
  const tokenMint = solTokenMint;
  const feedAccount = new anchor.web3.PublicKey(sol_priceFeed);
  const priceUpdateAccount = new anchor.web3.PublicKey("7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE");
  const confirmOptionsRetryTres: ConfirmOptions = { maxRetries: 3, commitment: "confirmed" };
  const tenpow18 = new BN(10).pow(new BN(18));
  const tenpow16 = new BN(10).pow(new BN(16));
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

  const getPriceResult = async () => {
    const confirmOptions: ConfirmOptions = { commitment: "confirmed", maxRetries: 3 };

    const tx = await program
      .methods
      .getPrice()
      .accounts({
        oracle: wooracleAccount,
        priceUpdate: priceUpdateAccount,
        quotePriceUpdate
      })
      .rpc(confirmOptions);

    let t = await provider.connection.getTransaction(tx, {
      commitment: "confirmed",
    })

    const [key, data, buffer] = getReturnLog(t);
    const reader = new borsh.BinaryReader(buffer);
    const price = reader.readU128().toNumber();
    const feasible = reader.readU8();

    return [price, feasible];
  };

  describe("#create_oracle()", async () => {
    it("creates an oracle account", async () => {

      const [wooracle] = await anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('wooracle'), solTokenMint.toBuffer(), feedAccount.toBuffer(), priceUpdateAccount.toBuffer()],
        program.programId
      );

      wooracleAccount = wooracle;

      // console.log("process.env:");
      // console.log(process.env);
      console.log("feedAccount:", feedAccount);
      console.log("wooracle:", wooracleAccount);

      let oracleItemData = null;
      try {
        oracleItemData = await program.account.woOracle.fetch(wooracleAccount);
      } catch (e) {
        const error = e as Error;
        if (error.message.indexOf("Account does not exist") >= 0) {
          // TODO Prince: need notice here
          // set maximum age to larger seconds due to pyth oracled push in 20mins in Dev env.
          console.log('try create')
          try {
          const tx = await program
            .methods
            .createOracle(new BN(1000))
            .accounts({
              tokenMint,
              wooracle,
              admin: provider.wallet.publicKey,
              feedAccount,
              priceUpdate: priceUpdateAccount,
              quoteTokenMint,
              quoteFeedAccount,
              quotePriceUpdate
            })
            .rpc(confirmOptionsRetryTres);

          const logs = await getLogs(provider.connection, tx);
          console.log(logs);
         } catch(ee) {
            console.log(ee)
         }
        }
      }

      if (oracleItemData == null) {
        oracleItemData = await program.account.woOracle.fetch(wooracleAccount);
      }

      assert.ok(
        oracleItemData.authority.equals(provider.wallet.publicKey)
      );
    });
  });

  describe("#sync_pyth_price()", async () => {
    it("sync with pyth oracle's price", async () => {

      if (global.getCluster() == 'localnet') {
        pythoracle_price = new BN(2211263986);
        pythoracle_decimal = 8;

        return;
      }

      const pythPriceFeed = await runQuery();
      const solPrice = pythPriceFeed[0].getPriceNoOlderThan(1000);
      console.log("solPrice", solPrice);

      const usdcPrice = pythPriceFeed[1].getPriceNoOlderThan(1000);
      console.log("usdcPrice", usdcPrice);

      // use usdc as quote token
      pythoracle_decimal = Math.abs(solPrice.expo);
      pythoracle_price = new BN(solPrice.price).mul(new BN(10).pow(new BN(pythoracle_decimal))).div(new BN(usdcPrice.price));

      const updatedAt = moment.unix(solPrice.publishTime);

      console.log(`pythoracle_price:${pythoracle_price}`);
      console.log(`pythoracle_decimal:${pythoracle_decimal}`);
      console.log(`updated at - ${updatedAt}`);

      traderSetPrice = pythoracle_price;
      rangeMax = traderSetPrice.mul(new BN(110)).div(new BN(100));
      rangeMin = traderSetPrice.mul(new BN(90)).div(new BN(100));

      console.log('traderSetPrice: ', traderSetPrice.toNumber());
      console.log('rangeMin: ', rangeMin.toNumber());
      console.log('rangeMax: ', rangeMax.toNumber());

    });
  });

  describe("#set_woo_state()", async () => {
    it("set woo oracle state", async () => {
    
      const setPrice = traderSetPrice;
      const setCoeff = new BN(100);
      const setSpread = new BN(200);

      await program
        .methods
        .setWooState(setPrice, setCoeff, setSpread)
        .accounts({
          wooracle: wooracleAccount,
          authority: provider.wallet.publicKey,
        })
        .rpc(confirmOptionsRetryTres);
  
      const result = await program.account.woOracle.fetch(wooracleAccount);

      console.log(`price - ${result.price}`);
      console.log(`coeff - ${result.coeff}`);
      console.log(`spread - ${result.spread}`);

      assert.ok(
        result.price.eq(setPrice), "wooracle price should be the same with setted"
      );
      assert.ok(
        result.coeff.eq(setCoeff), "wooracle coeff should be the same with setted"
      );
      assert.ok(
        result.spread.eq(setSpread), "wooracle spread should be the same with setted"
      );
    });
  });

  describe("#set_woo_range_max()", async () => {
    it("set woo oracle range max too small", async () => {    
      const setPrice = traderSetPrice;
      const setRangeMax = setPrice.sub(new BN(100));

      await program
        .methods
        .setWooRange(rangeMin, setRangeMax)
        .accounts({
          wooracle: wooracleAccount,
          authority: provider.wallet.publicKey,
        })
        .rpc(confirmOptionsRetryTres);
  
      const result = await program.account.woOracle.fetch(wooracleAccount);

      console.log(`rangeMin - ${result.rangeMin}`);
      console.log(`rangeMax - ${result.rangeMax}`);

      assert.ok(
        result.rangeMin.eq(rangeMin), "wooracle rangeMin should be the same with setted"
      );
      assert.ok(
        result.rangeMax.eq(setRangeMax), "wooracle rangeMax should be the same with setted"
      );

      try {
        await program
          .methods
          .getPrice()
          .accounts({
            oracle: wooracleAccount,
            priceUpdate: priceUpdateAccount,
            quotePriceUpdate
          })
          .rpc(confirmOptionsRetryTres);

        assert.fail(
          "should fail exceed range max"
        );
      } catch (e) {
        const error = e as Error;
        console.log("----------------------name----------------------------")
        console.log(error.name);
        console.log("----------------------message-------------------------")
        console.log(error.message);
        console.log("----------------------stack---------------------------")
        console.log(error.stack);
        console.log("----------------------end-----------------------------")

        assert.match(error.message, /WooOraclePriceRangeMax/);
      }
    });
  });

  describe("#set_woo_range_min()", async () => {
    it("set woo oracle range min too large", async () => {    
      const setPrice = traderSetPrice;
      const setRangeMin = setPrice.add(new BN(100));

      await program
        .methods
        .setWooRange(setRangeMin, rangeMax)
        .accounts({
          wooracle: wooracleAccount,
          authority: provider.wallet.publicKey,
        })
        .rpc(confirmOptionsRetryTres);
  
      const result = await program.account.woOracle.fetch(wooracleAccount);

      console.log(`rangeMin - ${result.rangeMin}`);
      console.log(`rangeMax - ${result.rangeMax}`);

      assert.ok(
        result.rangeMin.eq(setRangeMin), "wooracle rangeMin should be the same with setted"
      );
      assert.ok(
        result.rangeMax.eq(rangeMax), "wooracle rangeMax should be the same with setted"
      );

      try {
        await program
          .methods
          .getPrice()
          .accounts({
            oracle: wooracleAccount,
            priceUpdate: priceUpdateAccount,
            quotePriceUpdate
          })
          .rpc(confirmOptionsRetryTres);

        assert.fail(
          "should fail exceed range max"
        );
      } catch (e) {
        const error = e as Error;
        console.log("----------------------name----------------------------")
        console.log(error.name);
        console.log("----------------------message-------------------------")
        console.log(error.message);
        console.log("----------------------stack---------------------------")
        console.log(error.stack);
        console.log("----------------------end-----------------------------")

        assert.match(error.message, /WooOraclePriceRangeMin/);
      }
    });
  });

  describe("#set_woo_range()", async () => {
    it("set woo oracle range", async () => {
    
      await program
        .methods
        .setWooRange(rangeMin, rangeMax)
        .accounts({
          wooracle: wooracleAccount,
          authority: provider.wallet.publicKey,
        })
        .rpc(confirmOptionsRetryTres);
  
      const result = await program.account.woOracle.fetch(wooracleAccount);

      console.log(`rangeMin - ${result.rangeMin}`);
      console.log(`rangeMax - ${result.rangeMax}`);

      assert.ok(
        result.rangeMin.eq(rangeMin), "wooracle rangeMin should be the same with setted"
      );
      assert.ok(
        result.rangeMax.eq(rangeMax), "wooracle rangeMax should be the same with setted"
      );
    });
  });

  describe("#get_price()", async () => {
    it("get oracle price result", async () => {
    
      const setPrice = traderSetPrice;
      const setCoeff = new BN(100);
      const setSpread = new BN(200);

      const confirmOptions: ConfirmOptions = { commitment: "confirmed", maxRetries: 3 };

      const tx = await program
        .methods
        .getPrice()
        .accounts({
          oracle: wooracleAccount,
          priceUpdate: priceUpdateAccount,
          quotePriceUpdate
      })
        .rpc(confirmOptions);

      let t = await provider.connection.getTransaction(tx, {
        commitment: "confirmed",
      })

      const [key, data, buffer] = getReturnLog(t);
      assert.equal(key, program.programId);

      console.log(`key: ${key}`);
      console.log(`data: ${data}`);
      console.log(`buffer: ${buffer}`);

      // Check for matching log on receive side
      let receiveLog = t.meta.logMessages.find(
        (log) => log == `Program return: ${key} ${data}`
      );

      console.log(`t.meta.logMessages: ${t.meta.logMessages}`);
      console.log(`receiveLog: ${receiveLog}`);
      assert(receiveLog !== undefined);
  
      const reader = new borsh.BinaryReader(buffer);
      const price = reader.readU128().toNumber();
      const feasible = reader.readU8();

      console.log(`price - ${price}`);
      console.log(`feasible - ${feasible}`);

      assert.equal(price, setPrice.toNumber());
      assert.equal(feasible, 1);
    });
  });

  describe("#set_price_upper_bound_get_result()", async () => {
    it("set oracle price to upper bound and get oracle result", async () => {
    
      // upper cloracle 1%
      const low_bound = pythoracle_price.mul(tenpow18.sub(tenpow16)).div(tenpow18);
      const upper_bound = pythoracle_price.mul(tenpow18.add(tenpow16)).div(tenpow18);

      console.log(`low_bound: ${low_bound}`);
      console.log(`upper_bound: ${upper_bound}`);

      // TODO Prince: Failed here, double check later
      const setPrice = upper_bound.sub(new BN(10000000));

      await program
        .methods
        .setWooPrice(setPrice)
        .accounts({
          wooracle: wooracleAccount,
          authority: provider.wallet.publicKey,
        })
        .rpc(confirmOptionsRetryTres);

      const [price, feasible] = await getPriceResult();  
      console.log(`price - ${price}`);
      console.log(`feasible - ${feasible}`);

      assert.equal(price, setPrice.toNumber());
      assert.equal(feasible, 1);
    });
  });

  describe("#set_price_beyond_upper_bound_get_result()", async () => {
    it("set oracle price to beyond upper bound and get oracle result", async () => {
    
      // upper cloracle 1%
      const low_bound = pythoracle_price.mul(tenpow18.sub(tenpow16)).div(tenpow18);
      const upper_bound = pythoracle_price.mul(tenpow18.add(tenpow16)).div(tenpow18);

      console.log(`low_bound: ${low_bound}`);
      console.log(`upper_bound: ${upper_bound}`);

      // TODO Prince: Failed here, double check later
      const setPrice = upper_bound.add(new BN(10000000));

      await program
        .methods
        .setWooPrice(setPrice)
        .accounts({
          wooracle: wooracleAccount,
          authority: provider.wallet.publicKey,
        })
        .rpc(confirmOptionsRetryTres);

      const [price, feasible] = await getPriceResult();  
      console.log(`price - ${price}`);
      console.log(`feasible - ${feasible}`);

      assert.equal(price, setPrice.toNumber());
      assert.equal(feasible, 0);
    });
  });

  describe("#set_price_low_bound_get_result()", async () => {
    it("set oracle price to low bound and get oracle result", async () => {
    
      // upper cloracle 1%
      const low_bound = pythoracle_price.mul(tenpow18.sub(tenpow16)).div(tenpow18);
      const upper_bound = pythoracle_price.mul(tenpow18.add(tenpow16)).div(tenpow18);

      console.log(`low_bound: ${low_bound}`);
      console.log(`upper_bound: ${upper_bound}`);

      const setPrice = low_bound.add(new BN(10000000));

      await program
        .methods
        .setWooPrice(setPrice)
        .accounts({
          wooracle: wooracleAccount,
          authority: provider.wallet.publicKey,
        })
        .rpc(confirmOptionsRetryTres);

      const [price, feasible] = await getPriceResult();  

      console.log(`price - ${price}`);
      console.log(`feasible - ${feasible}`);

      assert.equal(price, setPrice.toNumber());
      assert.equal(feasible, 1);
    });
  });

  describe("#set_price_beyond_low_bound_get_result()", async () => {
    it("set oracle price to beyond low bound and get oracle result", async () => {
    
      // upper cloracle 1%
      const low_bound = pythoracle_price.mul(tenpow18.sub(tenpow16)).div(tenpow18);
      const upper_bound = pythoracle_price.mul(tenpow18.add(tenpow16)).div(tenpow18);

      console.log(`low_bound: ${low_bound}`);
      console.log(`upper_bound: ${upper_bound}`);

      const setPrice = low_bound.sub(new BN(10000000));

      await program
        .methods
        .setWooPrice(setPrice)
        .accounts({
          wooracle: wooracleAccount,
          authority: provider.wallet.publicKey,
        })
        .rpc(confirmOptionsRetryTres);

      const [price, feasible] = await getPriceResult();  

      console.log(`price - ${price}`);
      console.log(`feasible - ${feasible}`);

      assert.equal(price, setPrice.toNumber());
      assert.equal(feasible, 0);
    });
  });
  
});
