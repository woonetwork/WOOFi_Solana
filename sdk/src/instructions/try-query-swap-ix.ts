import { Program } from "@coral-xyz/anchor";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import BN from "bn.js";
import { Woofi } from "../artifacts/woofi";

/**
 * Raw parameters and accounts to swap on a Woofi
 *
 * @category Instruction Types
 * @param wooconfig - The config account for the program
 * @param amount - The amount of input token to swap from.
 * @param wooracleFrom - PublicKey for the wooracle account for from woopool.
 * @param woopoolFrom - PublicKey for the woopool that the swap will occur on from.
 * @param priceUpdateFrom - PublicKey for the pyth oracle update for from token.
 * @param wooracleTo - PublicKey for the wooracle account for to woopool.
 * @param woopoolTo - PublicKey for the woopool that the swap will occur on to.
 * @param priceUpdateTo - PublicKey for the pyth oracle update for to token.
 * @param quotePriceUpdate - PublicKey for the pyth oracle update for quote token.
 */
export type TryQuerySwapParams = {
  wooconfig: PublicKey,
  amount: BN,
  wooracleFrom: PublicKey,
  woopoolFrom: PublicKey,
  priceUpdateFrom: PublicKey,
  wooracleTo: PublicKey,
  woopoolTo: PublicKey,
  priceUpdateTo: PublicKey,
  quotePriceUpdate: PublicKey,
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
 * @param params - {@link TryQuerySwapParams}
 * @returns - Instruction to perform the action.
 */
export function tryQuerySwapIx(program: Program<Woofi>, params: TryQuerySwapParams): Promise<TransactionInstruction> {
  const {
    wooconfig,
    amount,
    wooracleFrom,
    woopoolFrom,
    priceUpdateFrom,
    wooracleTo,
    woopoolTo,
    priceUpdateTo,
    quotePriceUpdate
  } = params;

  const ix = program
    .methods
    .tryQuery(amount)
    .accounts({
      wooconfig,
      wooracleFrom,
      woopoolFrom,
      priceUpdateFrom,
      wooracleTo,
      woopoolTo,
      priceUpdateTo,
      quotePriceUpdate
    })
    .instruction();

  return ix;
}
