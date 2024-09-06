import { BN } from "@coral-xyz/anchor";
import { NATIVE_MINT, createAssociatedTokenAccountInstruction, createCloseAccountInstruction, createSyncNativeInstruction, getAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { SwapParams, swapIx } from "./instructions/swap-ix"
import { WoofiContext } from "./context";
import { TryQuerySwapParams, tryQuerySwapIx } from "./instructions/try-query-swap-ix";
import { WOOFI_TOKENS, TOKEN_MINTS, PYTH_FEED_ACCOUNT, PYTH_PRICE_UPDATE_ACCOUNT, QUOTE_TOKEN_MINT, QuoteTokenMint, QuotePriceUpdate } from "./utils/constants";
import { generatePoolParams, generateQuoteParams, QueryResult, tryCalculate } from "./utils/contract";

export class WoofiClient {
  private static autoUnwrapWSOL: boolean = true;

  public static isNativeMint(mint: PublicKey) {
    return mint.equals(NATIVE_MINT);
  }

  public static isAutoUnwrapWSOL(): boolean {
    return WoofiClient.autoUnwrapWSOL;
  }

  public static setAutoUnwrapWSOL(autoUnwrap: boolean) {
    WoofiClient.autoUnwrapWSOL = autoUnwrap;
  }

  public static async tryQuery(
    ctx: WoofiContext,
    fromAmount: BN,
    fromToken: WOOFI_TOKENS,
    toToken: WOOFI_TOKENS
  ): Promise<QueryResult> {
    return tryCalculate(
      ctx, 
      fromAmount,
      fromToken,
      new PublicKey(TOKEN_MINTS[fromToken]),
      new PublicKey(PYTH_FEED_ACCOUNT[fromToken]),
      new PublicKey(PYTH_PRICE_UPDATE_ACCOUNT[fromToken]),
      toToken,
      new PublicKey(TOKEN_MINTS[toToken]),
      new PublicKey(PYTH_FEED_ACCOUNT[toToken]),
      new PublicKey(PYTH_PRICE_UPDATE_ACCOUNT[toToken]),
      new PublicKey(QUOTE_TOKEN_MINT)
    )
  }

  public static async tryQueryOnChain(
    ctx: WoofiContext,
    fromAmount: BN,
    fromToken: WOOFI_TOKENS,
    toToken: WOOFI_TOKENS
  ): Promise<TransactionInstruction> {
    return WoofiClient.tryQueryOnChainInner(
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

  private static async tryQueryOnChainInner(
    ctx: WoofiContext,
    amount: BN,
    fromTokenMint: PublicKey,
    fromOracleFeedAccount: PublicKey,
    fromPriceUpdate: PublicKey,
    toTokenMint: PublicKey,
    toOracleFeedAccount: PublicKey,
    toPriceUpdate: PublicKey
  ): Promise<TransactionInstruction> {
    const fromPoolParams = await generatePoolParams(fromTokenMint, QuoteTokenMint, fromOracleFeedAccount, fromPriceUpdate, ctx.program);
    const toPoolParams = await generatePoolParams(toTokenMint, QuoteTokenMint, toOracleFeedAccount, toPriceUpdate, ctx.program);    
    const tryQuerySwapParams: TryQuerySwapParams = {
      wooconfig: fromPoolParams.wooconfig,
      amount,
      wooracleFrom: fromPoolParams.wooracle,
      woopoolFrom: fromPoolParams.woopool,
      priceUpdateFrom: fromPriceUpdate,
      wooracleTo: toPoolParams.wooracle,
      woopoolTo: toPoolParams.woopool,
      priceUpdateTo: toPriceUpdate,
      quotePriceUpdate: QuotePriceUpdate
    }

    const tx = tryQuerySwapIx(ctx.program, tryQuerySwapParams);
    return tx;
  }

  public static async swap(
    ctx: WoofiContext,
    fromAmount: BN,
    minToAmount: BN,
    fromToken: WOOFI_TOKENS,
    toToken: WOOFI_TOKENS,
  ): Promise<TransactionInstruction[]> {
    return WoofiClient.swapInner(
      ctx,
      fromAmount,
      minToAmount,
      new PublicKey(TOKEN_MINTS[fromToken]),
      new PublicKey(PYTH_FEED_ACCOUNT[fromToken]),
      new PublicKey(PYTH_PRICE_UPDATE_ACCOUNT[fromToken]),
      new PublicKey(TOKEN_MINTS[toToken]),
      new PublicKey(PYTH_FEED_ACCOUNT[toToken]),
      new PublicKey(PYTH_PRICE_UPDATE_ACCOUNT[toToken])
    )
  }

  // Example usage: swap(ctx, amount, TOKEN_MINTS["SOL"], CHAINLINK_FEED_ACCOUNT["SOL"], WOOPOOL_VAULTS["SOL"],
  // TOKEN_MINTS["USDC"], CHAINLINK_FEED_ACCOUNT["USDC"], WOOPOOL_VAULTS["USDC"])
  /**
   * Swap instruction builder method with resolveATA & additional checks.
   * @param ctx - WoofiContext object for the current environment.
   * @param amount - {@link SwapAsyncParams}
   * @returns
   */
  private static async swapInner(
    ctx: WoofiContext,
    amount: BN,
    minToAmount: BN,
    fromTokenMint: PublicKey,
    fromOracleFeedAccount: PublicKey,
    fromPriceUpdate: PublicKey,
    toTokenMint: PublicKey,
    toOracleFeedAccount: PublicKey,
    toPriceUpdate: PublicKey
  ): Promise<TransactionInstruction[]> {
    const instructions: TransactionInstruction[] = [];

    const fromPoolParams = await generatePoolParams(fromTokenMint, QuoteTokenMint, fromOracleFeedAccount, fromPriceUpdate, ctx.program);
    const toPoolParams = await generatePoolParams(toTokenMint, QuoteTokenMint, toOracleFeedAccount, toPriceUpdate, ctx.program);
    const quoteParams = await generateQuoteParams(ctx.program);

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
      wooconfig: fromPoolParams.wooconfig,
      amount,
      minToAmount,
      payer: ctx.wallet.publicKey,
      wooracleFrom: fromPoolParams.wooracle,
      woopoolFrom: fromPoolParams.woopool,
      tokenOwnerAccountFrom,
      tokenVaultFrom: fromPoolParams.tokenVault,
      priceUpdateFrom: fromPriceUpdate,
      wooracleTo: toPoolParams.wooracle,
      woopoolTo: toPoolParams.woopool,
      tokenOwnerAccountTo,
      tokenVaultTo: toPoolParams.tokenVault,
      priceUpdateTo: toPriceUpdate,
      woopoolQuote: quoteParams.woopool,
      quotePriceUpdate: QuotePriceUpdate,
      quoteTokenVault: quoteParams.tokenVault,
      rebateTo: ctx.wallet.publicKey
    }

    const tx = await swapIx(ctx.program, swapParams);
    instructions.push(tx);

    if (WoofiClient.isAutoUnwrapWSOL()) {
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