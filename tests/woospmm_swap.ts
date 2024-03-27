import * as anchor from "@coral-xyz/anchor";
import * as borsh from "borsh";
import { BN, Program } from "@coral-xyz/anchor";
import * as token from "@solana/spl-token";
import { ConfirmOptions } from "@solana/web3.js";
import * as web3 from "@solana/web3.js";
import { Woospmmtres } from "../target/types/woospmmtres";
import { assert } from "chai";
import Decimal from "decimal.js";
import moment from "moment";
import * as global from "./global";

describe("woospmm_swap", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Woospmmtres as Program<Woospmmtres>;

  let solCloracleAccount;
  let solWooracleAccount;
  let cloracle_price: BN;
  let cloracle_decimal: Number;

  const solTokenMint = new anchor.web3.PublicKey("So11111111111111111111111111111111111111112");
  const usdcTokenMint = new anchor.web3.PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");

  // SOL/USD
  const solFeedAccount = new anchor.web3.PublicKey("99B2bTijsU6f1GCT73HmdR7HCFFjGMBcPZY6jZ96ynrR");
  // USDC/USD
  const usdcFeedAccount = new anchor.web3.PublicKey("2EmfL3MqL3YHABudGNmajjCpR13NNEn9Y4LWxbDm6SwR");
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

  const getSOLPriceResult = async () => {
    const confirmOptions: ConfirmOptions = { commitment: "confirmed", maxRetries: 3 };

    const tx = await program
      .methods
      .getPrice()
      .accounts({
        cloracle: solCloracleAccount,
        wooracle: solWooracleAccount
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

  const createPool = async (feedAccount: anchor.web3.PublicKey) => {
    const [cloracle] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('cloracle'), feedAccount.toBuffer(), chainLinkProgramAccount.toBuffer()],
      program.programId
    );

    const [wooracle] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('wooracle'), feedAccount.toBuffer()],
      program.programId
    );

    const feedAuthority = provider.wallet.publicKey;

    const [woopool] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('woopool'), feedAuthority.toBuffer(), solTokenMint.toBuffer()],
      program.programId
    );

    const [tokenVault] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('woopoolvalut'), woopool.toBuffer()],
      program.programId,
    );

    let woopoolData = null;
    try {
      woopoolData = await program.account.wooPool.fetch(woopool);
    } catch (e) {
      const error = e as Error;
      if (error.message.indexOf("Account does not exist") >= 0) {
        await program
        .methods
        .createPool(feedAuthority)
        .accounts({
          tokenMint: solTokenMint,
          authority: provider.wallet.publicKey,
          woopool,
          tokenVault,
          cloracle,
          wooracle,
          tokenProgram: token.TOKEN_PROGRAM_ID, 
          systemProgram: web3.SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY
          })
          .rpc(confirmOptionsRetryTres);   
      }
    }

    if (woopoolData == null) {
      woopoolData = await program.account.wooPool.fetch(woopool);
    }

    return woopoolData;
  }

  describe("#create_sol_pool()", async () => {
    it("creates an oracle account", async () => {

      let solPool = await createPool(solFeedAccount);

      assert.ok(
        solPool.authority.equals(provider.wallet.publicKey)
      );
    });
    
  });

  describe("#create_usdc_pool()", async () => {
    it("creates an oracle account", async () => {
      let usdcPool = await createPool(usdcFeedAccount);

      assert.ok(
        usdcPool.authority.equals(provider.wallet.publicKey)
      );
    });
    
  });
});
