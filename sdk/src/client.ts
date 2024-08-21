import { BN } from "@coral-xyz/anchor";
import { NATIVE_MINT, createAssociatedTokenAccountInstruction, createCloseAccountInstruction, createSyncNativeInstruction, getAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { SwapParams, swapIx } from "./instructions/swap-ix"
import { WoospmmContext } from "./context";
import { TryQuerySwapParams, tryQuerySwapIx } from "./instructions/try-query-swap-ix";
import { WOOSPMM_TOKENS, TOKEN_MINTS, CHAINLINK_FEED_ACCOUNT, WOOPOOL_VAULTS, PYTH_FEED_ACCOUNT, PYTH_PRICE_UPDATE_ACCOUNT, CHAINLINK_PROGRAM_ACCOUNT } from "./utils/constants";
import { generatePoolParams, QueryResult, tryCalculate } from "./utils/contract";

export class WoospmmClient {
  private static autoUnwrapWSOL: boolean = true;

  public static isNativeMint(mint: PublicKey) {
    return mint.equals(NATIVE_MINT);
  }

  public static isAutoUnwrapWSOL(): boolean {
    return WoospmmClient.autoUnwrapWSOL;
  }

  public static setAutoUnwrapWSOL(autoUnwrap: boolean) {
    WoospmmClient.autoUnwrapWSOL = autoUnwrap;
  }

  public static async tryQuery(
    ctx: WoospmmContext,
    fromAmount: BN,
    fromToken: WOOSPMM_TOKENS,
    toToken: WOOSPMM_TOKENS
  ): Promise<QueryResult> {
    return tryCalculate(
      ctx, 
      fromAmount,
      new PublicKey(TOKEN_MINTS[fromToken]),
      new PublicKey(PYTH_FEED_ACCOUNT[fromToken]),
      new PublicKey(PYTH_PRICE_UPDATE_ACCOUNT[fromToken]),
      new PublicKey(TOKEN_MINTS[toToken]),
      new PublicKey(PYTH_FEED_ACCOUNT[toToken]),
      new PublicKey(PYTH_PRICE_UPDATE_ACCOUNT[toToken])
    )
  }

  public static async tryQueryOnChain(
    ctx: WoospmmContext,
    fromAmount: BN,
    fromToken: WOOSPMM_TOKENS,
    toToken: WOOSPMM_TOKENS
  ): Promise<TransactionInstruction> {
    return WoospmmClient.tryQueryOnChainInner(
      ctx, 
      fromAmount,
      new PublicKey(TOKEN_MINTS[fromToken]),
      new PublicKey(PYTH_FEED_ACCOUNT[fromToken]),
      new PublicKey(PYTH_PRICE_UPDATE_ACCOUNT[fromToken]),
      new PublicKey(TOKEN_MINTS[toToken]),
      new PublicKey(PYTH_FEED_ACCOUNT[toToken]),
      new PublicKey(PYTH_PRICE_UPDATE_ACCOUNT[toToken])
    )
  }

  public static async tryQueryOnChainChainlink(
    ctx: WoospmmContext,
    fromAmount: BN,
    fromToken: WOOSPMM_TOKENS,
    toToken: WOOSPMM_TOKENS
  ): Promise<TransactionInstruction> {
    return WoospmmClient.tryQueryOnChainInner(
      ctx, 
      fromAmount,
      new PublicKey(TOKEN_MINTS[fromToken]),
      new PublicKey(CHAINLINK_FEED_ACCOUNT[fromToken]),
      new PublicKey(CHAINLINK_PROGRAM_ACCOUNT),
      new PublicKey(TOKEN_MINTS[toToken]),
      new PublicKey(CHAINLINK_FEED_ACCOUNT[toToken]),
      new PublicKey(CHAINLINK_PROGRAM_ACCOUNT)
    )
  }

  private static async tryQueryOnChainInner(
    ctx: WoospmmContext,
    amount: BN,
    fromTokenMint: PublicKey,
    fromOracleFeedAccount: PublicKey,
    fromPriceUpdate: PublicKey,
    toTokenMint: PublicKey,
    toOracleFeedAccount: PublicKey,
    toPriceUpdate: PublicKey
  ): Promise<TransactionInstruction> {
    const fromPoolParams = await generatePoolParams(fromOracleFeedAccount, fromTokenMint, fromPriceUpdate, ctx.program);
    const toPoolParams = await generatePoolParams(toOracleFeedAccount, toTokenMint, toPriceUpdate, ctx.program);

    const tryQuerySwapParams: TryQuerySwapParams = {
      amount,
      oracleFrom: fromPoolParams.oracle,
      wooracleFrom: fromPoolParams.wooracle,
      woopoolFrom: fromPoolParams.woopool,
      priceUpdateFrom: fromPriceUpdate,
      oracleTo: toPoolParams.oracle,
      wooracleTo: toPoolParams.wooracle,
      woopoolTo: toPoolParams.woopool,
      priceUpdateTo: toPriceUpdate
    }

    const tx = tryQuerySwapIx(ctx.program, tryQuerySwapParams);
    return tx;
  }

  public static async swap(
    ctx: WoospmmContext,
    fromAmount: BN,
    minToAmount: BN,
    fromToken: WOOSPMM_TOKENS,
    toToken: WOOSPMM_TOKENS,
  ): Promise<TransactionInstruction[]> {
    return WoospmmClient.swapInner(
      ctx,
      fromAmount,
      minToAmount,
      new PublicKey(TOKEN_MINTS[fromToken]),
      new PublicKey(PYTH_FEED_ACCOUNT[fromToken]),
      new PublicKey(WOOPOOL_VAULTS[fromToken]),
      new PublicKey(PYTH_PRICE_UPDATE_ACCOUNT[fromToken]),
      new PublicKey(TOKEN_MINTS[toToken]),
      new PublicKey(PYTH_FEED_ACCOUNT[toToken]),
      new PublicKey(WOOPOOL_VAULTS[toToken]),
      new PublicKey(PYTH_PRICE_UPDATE_ACCOUNT[toToken])
    )
  }

  // Example usage: swap(ctx, amount, TOKEN_MINTS["SOL"], CHAINLINK_FEED_ACCOUNT["SOL"], WOOPOOL_VAULTS["SOL"],
  // TOKEN_MINTS["USDC"], CHAINLINK_FEED_ACCOUNT["USDC"], WOOPOOL_VAULTS["USDC"])
  /**
   * Swap instruction builder method with resolveATA & additional checks.
   * @param ctx - WoospmmContext object for the current environment.
   * @param amount - {@link SwapAsyncParams}
   * @returns
   */
  private static async swapInner(
    ctx: WoospmmContext,
    amount: BN,
    minToAmount: BN,
    fromTokenMint: PublicKey,
    fromOracleFeedAccount: PublicKey,
    fromPoolVault: PublicKey,
    fromPriceUpdate: PublicKey,
    toTokenMint: PublicKey,
    toOracleFeedAccount: PublicKey,
    toPoolVault: PublicKey,
    toPriceUpdate: PublicKey
  ): Promise<TransactionInstruction[]> {
    const instructions: TransactionInstruction[] = [];

    const fromPoolParams = await generatePoolParams(fromOracleFeedAccount, fromTokenMint, fromPriceUpdate, ctx.program);
    const toPoolParams = await generatePoolParams(toOracleFeedAccount, toTokenMint, toPriceUpdate, ctx.program);

    const tokenOwnerAccountFrom = getAssociatedTokenAddressSync(fromTokenMint, ctx.wallet.publicKey);
    const tokenOwnerAccountTo = getAssociatedTokenAddressSync(toTokenMint, ctx.wallet.publicKey);

    // Create an instruction to create the tokenOwnerAccountFrom if it does not exist
    const createFromAccountInstruction = createAssociatedTokenAccountInstruction(
      ctx.wallet.publicKey,
      tokenOwnerAccountFrom,
      ctx.wallet.publicKey,
      fromTokenMint
    )

    // Create an instruction to create the tokenOwnerAccountTo if it does not exist
    const createToAccountInstruction = createAssociatedTokenAccountInstruction(
      ctx.wallet.publicKey,
      tokenOwnerAccountTo,
      ctx.wallet.publicKey,
      toTokenMint
    )

    // Check if the tokenOwnerAccountFrom exists
    try {
      let tokenAccount = await getAccount(
        ctx.connection,
        tokenOwnerAccountFrom,
        'confirmed'
      )
    } catch (e) {
      // If the account does not exist, add the create account instruction to the transaction
      instructions.push(createFromAccountInstruction)
    }

    // Check if the tokenOwnerAccountTo exists
    try {
      let tokenAccount = await getAccount(
        ctx.connection,
        tokenOwnerAccountTo,
        'confirmed'
      )
    } catch (e) {
      // If the account does not exist, add the create account instruction to the transaction
      instructions.push(createToAccountInstruction)
    }

    // Woo router logic, handle sol and wsol, do the transfer
    if (fromTokenMint.equals(NATIVE_MINT)) {
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

    const swapParams : SwapParams = {
      amount,
      minToAmount,
      owner: ctx.wallet.publicKey,
      oracleFrom: fromPoolParams.oracle,
      wooracleFrom: fromPoolParams.wooracle,
      woopoolFrom: fromPoolParams.woopool,
      tokenOwnerAccountFrom,
      tokenVaultFrom: fromPoolVault,
      priceUpdateFrom: fromPriceUpdate,
      oracleTo: toPoolParams.oracle,
      wooracleTo: toPoolParams.wooracle,
      woopoolTo: toPoolParams.woopool,
      tokenOwnerAccountTo,
      tokenVaultTo: toPoolVault,
      priceUpdateTo: toPriceUpdate
    }

    const tx = await swapIx(ctx.program, swapParams);
    instructions.push(tx);

    if (WoospmmClient.isAutoUnwrapWSOL()) {
      if (toTokenMint.equals(NATIVE_MINT)) {
        instructions.push(
          // close wSol account instruction
          createCloseAccountInstruction(
            tokenOwnerAccountTo,
            ctx.wallet.publicKey,
            ctx.wallet.publicKey
          )
        );
      }
    }

    return instructions;
  }
}