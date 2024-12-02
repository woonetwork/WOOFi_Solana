import * as anchor from "@coral-xyz/anchor";
import * as borsh from "borsh";
import { BN } from "@coral-xyz/anchor";
import { WoofiClient } from "../src/client";
import { WoofiContext } from "../src";
import { PYTH_FEED_ACCOUNT, PYTH_PRICE_UPDATE_ACCOUNT, QuoteTokenMint, TOKEN_MINTS, WOOFI_TOKENS } from '../src/utils/constants'
import { Transaction, TransactionResponse } from "@solana/web3.js";
import { generatePoolParams, getOraclePrice } from "../src/utils/contract";
import { publicKey } from '@metaplex-foundation/umi'
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters'
import { hexZeroPad, arrayify } from '@ethersproject/bytes';
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { oft } from "../src/oft";

describe("woofi_sdk", async () => {

  const getReturnLog = (confirmedTransaction: TransactionResponse): (string | Buffer)[] => {
    const prefix = "Program return: ";
    let log: string = confirmedTransaction.meta?.logMessages?.find((ret: string) =>
      ret.startsWith(prefix)
    )!;
    log = log.slice(prefix.length);
    const [key, data] = log.split(" ", 2);
    const buffer = Buffer.from(data, "base64");
    return [key, data, buffer];
  };

  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const context = WoofiContext.from(provider.connection, provider.wallet);

  it("trader_set_price", async ()=> {
    let pythPrice = await getOraclePrice(WOOFI_TOKENS.SOL);

    const params = await generatePoolParams(
        new anchor.web3.PublicKey(TOKEN_MINTS.SOL),
        QuoteTokenMint,
        new anchor.web3.PublicKey(PYTH_FEED_ACCOUNT.SOL),
        new anchor.web3.PublicKey(PYTH_PRICE_UPDATE_ACCOUNT.SOL),
        context.program
    );

    await context.program
      .methods
      .setWooPrice(pythPrice)
      .accounts({
        wooconfig: params.wooconfig,
        wooracle: params.wooracle,
        authority: provider.wallet.publicKey,
      })
      .rpc();
  })

  it("try_query", async ()=> {
    const result = await WoofiClient.tryQuery(
      context,
      new BN(100000),
      WOOFI_TOKENS['SOL'],
      WOOFI_TOKENS['USDC']
    )

    console.log('TryQuery to_amount:'+ result.to_amount);
    console.log('TryQuery swap_fee:'+ result.swap_fee);
  })

  it("try_query_on_chain", async ()=> {
    const ix = await WoofiClient.tryQueryOnChain(
      context,
      new BN(100000),
      WOOFI_TOKENS['SOL'],
      WOOFI_TOKENS['USDC']
    )

    const tx = new Transaction();
    tx.add(ix);
    const sig = await provider.sendAndConfirm(tx, [], { commitment: "confirmed" });

    let t = await provider.connection.getTransaction(sig, {
      commitment: "confirmed",
    })!;

    const [key, data, buffer] = getReturnLog(t!);
    const reader = new borsh.BinaryReader(buffer as Buffer);
    const to_amount = reader.readU128().toNumber();
    const swap_fee = reader.readU128().toNumber();

    console.log('TryQuery to_amount:', to_amount);
    console.log('TryQuery swap_fee:', swap_fee);
  })

  it("send_oft", async ()=> {

    const amount = 1000000000
    const to = publicKey("0xc031C368b51c28266396273b0C6ce2489b00969d")

    const toEid = 30101
    const oftProgramId = publicKey("woo98ny1QLULqdTzpNM8PiJpwfzL5MJ9pAmLw1rfvk7")
    const tokenMint = new anchor.web3.PublicKey("Dz8VutERqbHR2aFL5A3s1Ky4dG1unJT1jUFXXPaY9ytX");
    const mint = fromWeb3JsPublicKey(tokenMint)
    const umiEscrowPublicKey = publicKey("22ag34UbSzp2d4ekBLkekLHX1woPLDYZHqLGPY7e3ybu")
    const recipientAddressBytes32 = addressToBytes32(to)
    const tokenProgramId = fromWeb3JsPublicKey(TOKEN_PROGRAM_ID)

    const tokenPublicKey = getAssociatedTokenAddressSync(tokenMint, provider.wallet.publicKey)
    const tokenAccount = fromWeb3JsPublicKey(tokenPublicKey)

    const ix = await oft.send(
      {
          payer: fromWeb3JsPublicKey(provider.wallet.publicKey),
          tokenMint: mint,
          tokenEscrow: umiEscrowPublicKey,
          tokenSource: tokenAccount,
      },
      {
          to: Buffer.from(recipientAddressBytes32),
          dstEid: toEid,
          amountLd: BigInt(amount),
          minAmountLd: (BigInt(amount) * BigInt(9)) / BigInt(10),
          options: Buffer.from(''),
          composeMsg: undefined,
          nativeFee: BigInt(0),
          //nativeFee,
      },
      {
          oft: oftProgramId,
          token: tokenProgramId,
      }
    )
  })
});

// src/utils/hex.ts
function hexZeroPadTo32(addr: string) {
  return hexZeroPad(addr, 32);
}
// function bytes32ToEthAddress(bytes32: Uint8Array) {
//   if (bytes32 instanceof Uint8Array) {
//     bytes32 = hexlify(bytes32);
//   }
//   return getAddress(bytes32.slice(-40));
// }
function trim0x(str: string) {
  return str.replace(/^0x/, "");
}
var solanaAddressRegex = /^([1-9A-HJ-NP-Za-km-z]{32,44})$/;
function isSolanaAddress(address: string) {
  return solanaAddressRegex.test(address);
}

function addressToBytes32(address: string) {
  const base58 = require('bs58')

  if (isSolanaAddress(address)) {
    return base58.decode(address);
  } else if (address.startsWith("0x") && address.length <= 66) {
    return arrayify(hexZeroPadTo32(address));
  }
  throw new Error("Invalid address");
}
