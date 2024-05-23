import * as anchor from "@coral-xyz/anchor";
import * as borsh from "borsh";
import { BN, Program } from "@coral-xyz/anchor";
import { ConfirmOptions } from "@solana/web3.js";
import { Woospmmtres } from "../target/types/woospmmtres";
import { assert } from "chai";
import Decimal from "decimal.js";
import moment from "moment";
import * as global from "./global";

describe("woospmmtres", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Woospmmtres as Program<Woospmmtres>;

  let cloracleAccount;
  let wooracleAccount;
  let cloracle_price: BN;
  let cloracle_decimal: Number;

  const feedAccount = new anchor.web3.PublicKey("HgTtcbcmp5BeThax5AU8vg4VwK79qAvAKKFMs8txMLW6");
  const chainLinkProgramAccount = new anchor.web3.PublicKey("HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny");
  const confirmOptionsRetryTres: ConfirmOptions = { maxRetries: 3 };
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

  const getPriceResult = async () => {
    const confirmOptions: ConfirmOptions = { commitment: "confirmed", maxRetries: 3 };

    const tx = await program
      .methods
      .getPrice()
      .accounts({
        oracle: cloracleAccount,
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

      const [cloracle] = await anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('cloracle'), feedAccount.toBuffer(), chainLinkProgramAccount.toBuffer()],
        program.programId
      );

      const [wooracle] = await anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('wooracle'), feedAccount.toBuffer()],
        program.programId
      );

      cloracleAccount = cloracle;
      wooracleAccount = wooracle;

      // console.log("process.env:");
      // console.log(process.env);

      let oracleItemData = null;
      try {
        oracleItemData = await program.account.woOracle.fetch(wooracleAccount);
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
        oracleItemData = await program.account.woOracle.fetch(wooracleAccount);
      }

      assert.ok(
        oracleItemData.authority.equals(provider.wallet.publicKey)
      );
    });

    describe("#update_cloracle()", async () => {
      it("updates chain link oracle account", async () => {

        if (global.getCluster() == 'localnet') {
          cloracle_price = new BN(2211263986);
          cloracle_decimal = 8;

          return;
        }
      
        await program
          .methods
          .updateCloracle()
          .accounts({
            cloracle: cloracleAccount,
            authority: provider.wallet.publicKey,
            feedAccount: feedAccount,
            chainlinkProgram: chainLinkProgramAccount
          })
          .rpc(confirmOptionsRetryTres);
    
        const result = await program.account.oracle.fetch(cloracleAccount);
        const price = new Decimal(result.round.toNumber()).mul(new Decimal(10).pow(-result.decimals));
        const updatedAt = moment.unix(result.updatedAt.toNumber());

        cloracle_price = result.round;
        cloracle_decimal = result.decimals;

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
      
        const setPrice = new BN(5000000000);
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

    describe("#get_price()", async () => {
      it("get oracle price result", async () => {
      
        const setPrice = new BN(5000000000);
        const setCoeff = new BN(100);
        const setSpread = new BN(200);

        const confirmOptions: ConfirmOptions = { commitment: "confirmed", maxRetries: 3 };

        const tx = await program
          .methods
          .getPrice()
          .accounts({
            oracle: cloracleAccount,
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
        assert.equal(feasible, 0);
      });
    });

    describe("#set_price_upper_bound_get_result()", async () => {
      it("set oracle price to upper bound and get oracle result", async () => {
      
        // upper cloracle 1%
        const low_bound = cloracle_price.mul(tenpow18.sub(tenpow16)).div(tenpow18);
        const upper_bound = cloracle_price.mul(tenpow18.add(tenpow16)).div(tenpow18);

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
        const low_bound = cloracle_price.mul(tenpow18.sub(tenpow16)).div(tenpow18);
        const upper_bound = cloracle_price.mul(tenpow18.add(tenpow16)).div(tenpow18);

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
        const low_bound = cloracle_price.mul(tenpow18.sub(tenpow16)).div(tenpow18);
        const upper_bound = cloracle_price.mul(tenpow18.add(tenpow16)).div(tenpow18);

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
        const low_bound = cloracle_price.mul(tenpow18.sub(tenpow16)).div(tenpow18);
        const upper_bound = cloracle_price.mul(tenpow18.add(tenpow16)).div(tenpow18);

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
});
