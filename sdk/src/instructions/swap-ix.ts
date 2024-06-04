import { Program } from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import BN from "bn.js";
import { Woospmmtres } from "../artifacts/woospmmtres";

/**
 * Raw parameters and accounts to swap on a Woospmmtres
 *
 * @category Instruction Types
 * @param amount - The amount of input token to swap from.
 * @param owner - PublicKey of the user wallet want to do the swap.
 * @param oracleFrom - PublicKey for the outside oracle account for from woopool.
 * @param wooracleFrom - PublicKey for the wooracle account for from woopool.
 * @param woopoolFrom - PublicKey for the woopool that the swap will occur on from.
 * @param tokenOwnerAccountFrom - PublicKey for the associated token account for token from in the collection wallet.
 * @param tokenVaultFrom - PublicKey for the token vault for from woopool.
 * @param oracleTo - PublicKey for the outside oracle account for to woopool.
 * @param wooracleTo - PublicKey for the wooracle account for to woopool.
 * @param woopoolTo - PublicKey for the woopool that the swap will occur on to.
 * @param tokenOwnerAccountTo - PublicKey for the associated token account for token to in the collection wallet.
 * @param tokenVaultTo - PublicKey for the token vault for to woopool.
 */
export type SwapParams = {
  amount: BN;
  owner: PublicKey;
  oracleFrom: PublicKey;
  wooracleFrom: PublicKey;
  woopoolFrom: PublicKey;
  tokenOwnerAccountFrom: PublicKey;
  tokenVaultFrom: PublicKey;
  oracleTo: PublicKey;
  wooracleTo: PublicKey;
  woopoolTo: PublicKey;
  tokenOwnerAccountTo: PublicKey;
  tokenVaultTo: PublicKey;
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
export function swapIx(program: Program<Woospmmtres>, params: SwapParams): Promise<TransactionInstruction> {
  const {
    amount,
    owner,
    oracleFrom,
    wooracleFrom,
    woopoolFrom,
    tokenOwnerAccountFrom,
    tokenVaultFrom,
    oracleTo,
    wooracleTo,
    woopoolTo,
    tokenOwnerAccountTo,
    tokenVaultTo,
  } = params;

  const ix = program
    .methods
    .swap(amount)
    .accounts({
      tokenProgram: TOKEN_PROGRAM_ID,
      owner,
      oracleFrom,
      wooracleFrom,
      woopoolFrom,
      tokenOwnerAccountFrom,
      tokenVaultFrom,
      oracleTo,
      wooracleTo,
      woopoolTo,
      tokenOwnerAccountTo,
      tokenVaultTo,
    })
    .instruction();

  return ix;
}
