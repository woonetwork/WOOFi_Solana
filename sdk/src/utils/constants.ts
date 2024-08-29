// MAIN_NET
// export const TOKEN_MINTS = {
//   USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
//   SOL: "So11111111111111111111111111111111111111112",
//   USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
//   USDH: "USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX",
//   mSOL: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
//   stSOL: "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj",
// };

import { PublicKey } from "@solana/web3.js";

export const enum WOOFI_TOKENS {
  SOL = "SOL",
  USDC = "USDC"
}

// DEV_NET
export const TOKEN_MINTS = {
  USDC: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
  SOL: "So11111111111111111111111111111111111111112",
  USDT: "EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS",
  USDH: "USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX",
  mSOL: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
  stSOL: "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj",
};

export const PYTH_PRICE_UPDATE_ACCOUNT = {
  SOL: "7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE",
  USDC: "Dpw1EAVrSB1ibxiDQyTAW6Zip3J4Btk2x4SgApQCeFbX"
}

export const PYTH_FEED_ACCOUNT = {
  SOL: "H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG",
  USDC: "Gnt27xtC473ZT2Mw5u8wZ68Z3gULkSTb5DuxJy7eJotD"
};

export const QUOTE_TOKEN_MINT = TOKEN_MINTS.USDC;
export const QuoteTokenMint = new PublicKey(QUOTE_TOKEN_MINT);
export const QuotePriceUpdate = new PublicKey(PYTH_PRICE_UPDATE_ACCOUNT.USDC);
export const QuoteFeedAccount = new PublicKey(PYTH_FEED_ACCOUNT.USDC);

export const CHAINLINK_PROGRAM_ACCOUNT = "HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny";

export const CHAINLINK_FEED_ACCOUNT = {
  SOL: "99B2bTijsU6f1GCT73HmdR7HCFFjGMBcPZY6jZ96ynrR",
  USDC: "2EmfL3MqL3YHABudGNmajjCpR13NNEn9Y4LWxbDm6SwR"
};