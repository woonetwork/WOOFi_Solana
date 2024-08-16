import * as anchor from "@coral-xyz/anchor";
import * as borsh from "borsh";
import { BN, Program } from "@coral-xyz/anchor";
import { ConfirmOptions, Transaction } from "@solana/web3.js";
import {BorshCoder, EventParser} from "@coral-xyz/anchor";
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
  const sol_bytes = Buffer.from('ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d', 'hex')
  const sol_priceFeed = bs58.encode(sol_bytes)
  console.log("SOL PriceFeed:", sol_priceFeed)

  const usdc_bytes = Buffer.from('eaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a', 'hex')
  const usdc_priceFeed = bs58.encode(usdc_bytes)
  console.log("USDC PriceFeed:", usdc_priceFeed)

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

  const getProgramDataLog = (confirmedTransaction: any) => {
    const prefix = "Program data: ";
    let log = confirmedTransaction.meta.logMessages.find((log) =>
      log.startsWith(prefix)
    );
    const data = log.slice(prefix.length);
    const buffer = Buffer.from(data, "base64");
    return [data, buffer];
  };

  const getPriceResult = async () => {
    const confirmOptions: ConfirmOptions = { commitment: "confirmed", maxRetries: 3 };

    const tx = await program
      .methods
      .getPrice()
      .accounts({
        oracle: pythoracleAccount,
        wooracle: wooracleAccount,
        priceUpdate: priceUpdateAccount
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

  describe("#get_events()", async () => {
    it("get woospmm events", async () => {

      const setSpread = new BN(800);

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


      const pubKey = new anchor.web3.PublicKey(program.programId);
      provider.opts.commitment = 'confirmed';
      let transactionList = await provider.connection.getSignaturesForAddress(pubKey, {limit: 10}, 'finalized');
      let signatureList = transactionList.map(transaction => transaction.signature);

      for await (const sig of signatureList) {
        if (sig == '54SUf5BZPVPaqiHpzJ7mbmnJV5sc7wTH7Kx7M2XMVzwLgHLLC15i8TUUg5bqaBh1gnhT1yi69aoaExLDfLVHLZLA') {
            const tx = await provider.connection.getParsedTransaction(sig, 
                {maxSupportedTransactionVersion: 0, commitment: 'finalized'});
            const eventParser = new EventParser(program.programId, new BorshCoder(program.idl));
            const events = eventParser.parseLogs(tx.meta.logMessages);
            for (let event of events) {
                console.log(event);
            }

        }
      }

      console.log(signatureList);

    });
  });
  
});
