import * as anchor from "@coral-xyz/anchor";
import * as borsh from "borsh";
import { BN, Program } from "@coral-xyz/anchor";
import { ConfirmOptions } from "@solana/web3.js";
import { getLogs } from "@solana-developers/helpers";
import { Woospmm } from "../target/types/woospmm";
import { Wallet } from "@coral-xyz/anchor";
import { assert } from "chai";
import Decimal from "decimal.js";
import moment from "moment";
import * as global from "./global";

describe("woospmm", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Woospmm as Program<Woospmm>;

  let pythoracleAccount;
  let wooracleAccount;
  let pythoracle_price: BN;
  let pythoracle_decimal: Number;

  // SOL pyth oracle price feed
  // https://pyth.network/developers/price-feed-ids
  const bs58 = require('bs58')
  const bytes = Buffer.from('ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d', 'hex')
  const priceFeed = bs58.encode(bytes)
  console.log(priceFeed)

  const feedAccount = new anchor.web3.PublicKey(priceFeed);
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
        oracle: pythoracleAccount,
        wooracle: wooracleAccount
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

      const [pythoracle] = await anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('pythoracle'), feedAccount.toBuffer(), priceUpdateAccount.toBuffer()],
        program.programId
      )

      const [wooracle] = await anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('wooracle'), feedAccount.toBuffer(), priceUpdateAccount.toBuffer()],
        program.programId
      );

      pythoracleAccount = pythoracle;
      wooracleAccount = wooracle;

      // console.log("process.env:");
      // console.log(process.env);
      console.log("feedAccount:", feedAccount);

      let oracleItemData = null;
      try {
        oracleItemData = await program.account.woOracle.fetch(wooracleAccount);
      } catch (e) {
        const error = e as Error;
        if (error.message.indexOf("Account does not exist") >= 0) {
          const tx = await program
            .methods
            .createOraclePyth()
            .accounts({
              pythoracle,
              wooracle,
              admin: provider.wallet.publicKey,
              feedAccount,
              priceUpdate: priceUpdateAccount
            })
            .rpc(confirmOptionsRetryTres);

          const logs = await getLogs(provider.connection, tx);
          console.log(logs);
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

  describe("#update_pythoracle()", async () => {
    it("updates pyth oracle account", async () => {

      if (global.getCluster() == 'localnet') {
        pythoracle_price = new BN(2211263986);
        pythoracle_decimal = 8;

        return;
      }
    
      const tx = await program
        .methods
        .updatePythoracle()
        .accounts({
          pythoracle: pythoracleAccount,
          authority: provider.wallet.publicKey,
          priceUpdate: priceUpdateAccount
        })
        .rpc(confirmOptionsRetryTres);
      
      const logs = await getLogs(provider.connection, tx);
      console.log(logs);
  
      const result = await program.account.oracle.fetch(pythoracleAccount);
      const price = new Decimal(result.round.toNumber()).mul(new Decimal(10).pow(-result.decimals));
      const updatedAt = moment.unix(result.updatedAt.toNumber());

      pythoracle_price = result.round;
      pythoracle_decimal = result.decimals;

      traderSetPrice = new BN(result.round);
      rangeMax = traderSetPrice.mul(new BN(110)).div(new BN(100));
      rangeMin = traderSetPrice.mul(new BN(90)).div(new BN(100));

      console.log(
        `price - ${price}`
      );

      console.log(`round - ${result.round}`);
      console.log(`decimal - ${result.decimals}`);
      console.log(`updated at - ${updatedAt}`);

      assert.ok(
        result.authority.equals(provider.wallet.publicKey),
        "oracle should be finalized"
      );
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
            oracle: pythoracleAccount,
            wooracle: wooracleAccount
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
            oracle: pythoracleAccount,
            wooracle: wooracleAccount
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
          oracle: pythoracleAccount,
          wooracle: wooracleAccount
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

      const setPrice = upper_bound;

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

      const setPrice = upper_bound.add(new BN(1));

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

      const setPrice = low_bound;

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

      const setPrice = low_bound.sub(new BN(1));

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
