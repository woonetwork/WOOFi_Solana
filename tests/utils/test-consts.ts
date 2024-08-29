import * as anchor from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { BN } from "bn.js";
import { ConfirmOptions } from "@solana/web3.js";

export enum SupportedToken {
    USDC,
    SOL
}

export const TEST_TOKEN_PROGRAM_ID = new anchor.web3.PublicKey(TOKEN_PROGRAM_ID.toString());

export const ZERO_BN = new anchor.BN(0);

export const ONE_SOL = 1000000000;

export const MAX_U64 = new BN(new anchor.BN(2).pow(new anchor.BN(64)).sub(new anchor.BN(1)).toString());

export const solTokenMint = new anchor.web3.PublicKey("So11111111111111111111111111111111111111112");

export const usdcTokenMint = new anchor.web3.PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");

export const quoteTokenMint = usdcTokenMint;

// SOL Price Update
export const solPriceUpdate = new anchor.web3.PublicKey("7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE");
// USDC Price Update
export const usdcPriceUpdate = new anchor.web3.PublicKey("Dpw1EAVrSB1ibxiDQyTAW6Zip3J4Btk2x4SgApQCeFbX");

export const quotePriceUpdate = usdcPriceUpdate;

export const confirmOptionsRetryTres: ConfirmOptions = { commitment: "confirmed" };
