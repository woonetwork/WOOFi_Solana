import { BN, Program } from "@coral-xyz/anchor";
import { NATIVE_MINT, createAssociatedTokenAccount, createSyncNativeInstruction, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { SwapParams, swapIx } from "./instructions/swap-ix"
import { Woospmmtres } from "./artifacts/woospmmtres";
import { WoospmmtresContext } from "./context";
import { CHAINLINK_PROGRAM_ACCOUNT } from "./utils/constants";
import { TryQuerySwapParams, tryQuerySwapIx } from "./instructions/try-query-swap-ix";

const generatePoolParams = async(
  feedAccount: PublicKey,
  tokenMint: PublicKey,
  program: Program<Woospmmtres> 
) => {
  const [oracle] = await PublicKey.findProgramAddressSync(
    [Buffer.from('cloracle'), feedAccount.toBuffer(), new PublicKey(CHAINLINK_PROGRAM_ACCOUNT).toBuffer()],
    program.programId
  );

  const [wooracle] = await PublicKey.findProgramAddressSync(
    [Buffer.from('wooracle'), feedAccount.toBuffer()],
    program.programId
  );

  const [woopool] = await PublicKey.findProgramAddressSync(
    [Buffer.from('woopool'), tokenMint.toBuffer()],
    program.programId
  );

  // woopool data should already be created after init
  // due to anchor 0.29's js wrapper bug, and consider performance
  // caller should remember the vault for now.
  // const {tokenVault} = await program.account.wooPool.fetch(woopool);

  return {
    oracle,
    wooracle,
    woopool
  }
}

export class WoospmmtresClient {
  public static async tryQuery(
    ctx: WoospmmtresContext,
    amount: BN,
    fromTokenMint: PublicKey,
    fromOracleFeedAccount: PublicKey,
    toTokenMint: PublicKey,
    toOracleFeedAccount: PublicKey,
  ): Promise<TransactionInstruction> {
    const fromPoolParams = await generatePoolParams(fromOracleFeedAccount, fromTokenMint, ctx.program);
    const toPoolParams = await generatePoolParams(toOracleFeedAccount, toTokenMint, ctx.program);

    const tryQuerySwapParams: TryQuerySwapParams = {
      amount,
      oracleFrom: fromPoolParams.oracle,
      wooracleFrom: fromPoolParams.wooracle,
      woopoolFrom: fromPoolParams.woopool,
      oracleTo: toPoolParams.oracle,
      wooracleTo: toPoolParams.wooracle,
      woopoolTo: toPoolParams.woopool
    }

    const tx = tryQuerySwapIx(ctx.program, tryQuerySwapParams);
    return tx;
  }

  // Example usage: swap(ctx, amount, TOKEN_MINTS["SOL"], CHAINLINK_FEED_ACCOUNT["SOL"], WOOPOOL_VAULTS["SOL"],
  // TOKEN_MINTS["USDC"], CHAINLINK_FEED_ACCOUNT["USDC"], WOOPOOL_VAULTS["USDC"])
  /**
   * Swap instruction builder method with resolveATA & additional checks.
   * @param ctx - WoospmmtresContext object for the current environment.
   * @param amount - {@link SwapAsyncParams}
   * @returns
   */
  public static async swap(
    ctx: WoospmmtresContext,
    amount: BN,
    fromTokenMint: PublicKey,
    fromOracleFeedAccount: PublicKey,
    fromPoolVault: PublicKey,
    toTokenMint: PublicKey,
    toOracleFeedAccount: PublicKey,
    toPoolVault: PublicKey
  ): Promise<TransactionInstruction[]> {
    const instructions: TransactionInstruction[] = [];

    const fromPoolParams = await generatePoolParams(fromOracleFeedAccount, fromTokenMint, ctx.program);
    const toPoolParams = await generatePoolParams(toOracleFeedAccount, toTokenMint, ctx.program);

    const tokenOwnerAccountFrom = getAssociatedTokenAddressSync(fromTokenMint, ctx.wallet.publicKey);
    const tokenOwnerAccountTo = getAssociatedTokenAddressSync(toTokenMint, ctx.wallet.publicKey);

    // Woo router logic, handle sol and wsol, do the transfer
    if (fromTokenMint == NATIVE_MINT) {
      instructions.push(
        // trasnfer SOL to WSOL into ata account
        SystemProgram.transfer({
          fromPubkey: ctx.wallet.publicKey,
          toPubkey: tokenOwnerAccountFrom,
          lamports: amount.toNumber(),
        }),
        // sync wrapped SOL balance
        createSyncNativeInstruction(tokenOwnerAccountFrom)
      );
    }

    // TODO Prince: if (toTokenMint == NATIVE_MINT), need double check the wsol to sol logic
    // consider have a flag to do the transfer

    const swapParams : SwapParams = {
      amount,
      owner: ctx.wallet.publicKey,
      oracleFrom: fromPoolParams.oracle,
      wooracleFrom: fromPoolParams.wooracle,
      woopoolFrom: fromPoolParams.woopool,
      tokenOwnerAccountFrom,
      tokenVaultFrom: fromPoolVault,
      oracleTo: toPoolParams.oracle,
      wooracleTo: toPoolParams.wooracle,
      woopoolTo: toPoolParams.woopool,
      tokenOwnerAccountTo,
      tokenVaultTo: toPoolVault
    }

    const tx = await swapIx(ctx.program, swapParams);
    instructions.push(tx);
    return instructions;
  }
}