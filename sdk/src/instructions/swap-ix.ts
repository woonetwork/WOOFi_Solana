import { Program } from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import BN from "bn.js";
import { Woofi } from "../artifacts/woofi";

/**
 * Raw parameters and accounts to swap on a Woofi
 *
 * @category Instruction Types
 * @param wooconfig - The config account for the program
 * @param amount - The amount of input token to swap from.
 * @param minToAmount - The minimum amount of token swap to.
 * @param owner - PublicKey of the user wallet want to do the swap.
 * @param wooracleFrom - PublicKey for the wooracle account for from woopool.
 * @param woopoolFrom - PublicKey for the woopool that the swap will occur on from.
 * @param tokenOwnerAccountFrom - PublicKey for the associated token account for token from in the collection wallet.
 * @param tokenVaultFrom - PublicKey for the token vault for from woopool.
 * @param priceUpdateFrom - PublicKey for the pyth oracle update for from token.
 * @param wooracleTo - PublicKey for the wooracle account for to woopool.
 * @param woopoolTo - PublicKey for the woopool that the swap will occur on to.
 * @param tokenOwnerAccountTo - PublicKey for the associated token account for token to in the collection wallet.
 * @param tokenVaultTo - PublicKey for the token vault for to woopool.
 * @param priceUpdateTo - PublicKey for the pyth oracle update for to token.
 * @param woopoolQuote - PublicKey for the woopool for quote token.
 * @param quotePriceUpdate - PublicKey for the pyth oracle update for quote token.
 * @param quoteTokenVault - PublicKey for the token vault for quote woopool.
 * @param rebateTo - PublicKey for rebate addres.
 */
export type SwapParams = {
  wooconfig: PublicKey,
  amount: BN,
  minToAmount: BN,
  owner: PublicKey,
  wooracleFrom: PublicKey,
  woopoolFrom: PublicKey,
  tokenOwnerAccountFrom: PublicKey,
  tokenVaultFrom: PublicKey,
  priceUpdateFrom: PublicKey,
  wooracleTo: PublicKey,
  woopoolTo: PublicKey,
  tokenOwnerAccountTo: PublicKey,
  tokenVaultTo: PublicKey,
  priceUpdateTo: PublicKey,
  woopoolQuote: PublicKey,
  quotePriceUpdate: PublicKey,
  quoteTokenVault: PublicKey,
  rebateTo: PublicKey,
};

/**
 * Perform a swap
 *
 * #### Special Errors
 * - `ZeroTradableAmount` - User provided parameter `amount` is 0.
 * - `InvalidSqrtPriceLimitDirection` - User provided parameter `sqrt_price_limit` does not match the direction of the trade.
 * - `InvalidTickArraySequence` - User provided tick-arrays are not in sequential order required to proceed in this trade direction.
 * - `TickArraySequenceInvalidIndex` - The swap loop attempted to access an invalid array index during the query of the next initialized tick.
 * - `TickArrayIndexOutofBounds` - The swap loop attempted to access an invalid array index during tick crossing.
 * - `LiquidityOverflow` - Liquidity value overflowed 128bits during tick crossing.
 * - `InvalidTickSpacing` - The swap pool was initialized with tick-spacing of 0.
 *
 * ### Parameters
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - {@link SwapParams}
 * @returns - Instruction to perform the action.
 */
export function swapIx(program: Program<Woofi>, params: SwapParams): Promise<TransactionInstruction> {
  const {
    wooconfig,
    amount,
    minToAmount,
    owner,
    wooracleFrom,
    woopoolFrom,
    tokenOwnerAccountFrom,
    tokenVaultFrom,
    priceUpdateFrom,
    wooracleTo,
    woopoolTo,
    tokenOwnerAccountTo,
    tokenVaultTo,
    priceUpdateTo,
    woopoolQuote,
    quotePriceUpdate,
    quoteTokenVault,
    rebateTo,
  } = params;

  const ix = program
    .methods
    .swap(amount, minToAmount)
    .accounts({
      wooconfig,
      tokenProgram: TOKEN_PROGRAM_ID,
      owner,
      wooracleFrom,
      woopoolFrom,
      tokenOwnerAccountFrom,
      tokenVaultFrom,
      priceUpdateFrom,
      wooracleTo,
      woopoolTo,
      tokenOwnerAccountTo,
      tokenVaultTo,
      priceUpdateTo,
      woopoolQuote,
      quotePriceUpdate,
      quoteTokenVault,
      rebateTo,
    })
    .instruction();

  return ix;
}
