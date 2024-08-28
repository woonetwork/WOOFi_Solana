import { Program } from "@coral-xyz/anchor";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import BN from "bn.js";
import { Woofi } from "../artifacts/woofi";

/**
 * Raw parameters and accounts to swap on a Woofi
 *
 * @category Instruction Types
 * @param amount - The amount of input token to swap from.
 * @param oracleFrom - PublicKey for the outside oracle account for from woopool.
 * @param wooracleFrom - PublicKey for the wooracle account for from woopool.
 * @param woopoolFrom - PublicKey for the woopool that the swap will occur on from.
 * @param oracleTo - PublicKey for the outside oracle account for to woopool.
 * @param wooracleTo - PublicKey for the wooracle account for to woopool.
 * @param woopoolTo - PublicKey for the woopool that the swap will occur on to.
 * @param priceUpdate - PublicKey for the pyth oracle update.
 */
export type TryQuerySwapParams = {
  amount: BN;
  oracleFrom: PublicKey;
  wooracleFrom: PublicKey;
  woopoolFrom: PublicKey;
  priceUpdateFrom: PublicKey;
  oracleTo: PublicKey;
  wooracleTo: PublicKey;
  woopoolTo: PublicKey;
  priceUpdateTo: PublicKey;
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
    amount,
    oracleFrom,
    wooracleFrom,
    woopoolFrom,
    priceUpdateFrom,
    oracleTo,
    wooracleTo,
    woopoolTo,
    priceUpdateTo
  } = params;

  const ix = program
    .methods
    .tryQuery(amount)
    .accounts({
      oracleFrom,
      wooracleFrom,
      woopoolFrom,
      priceUpdateFrom,
      oracleTo,
      wooracleTo,
      woopoolTo,
      priceUpdateTo
    })
    .instruction();

  return ix;
}
