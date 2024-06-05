import { BN, Program } from "@coral-xyz/anchor";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { SwapParams, swapIx } from "./instructions/swap-ix"
import { Woospmmtres } from "./artifacts/woospmmtres";
import { WoospmmtresContext } from "./context";
import { CHAINLINK_PROGRAM_ACCOUNT, CHAINLINK_FEED_ACCOUNT, TOKEN_MINTS } from "./utils/constants";
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
  const {tokenVault} = await program.account.wooPool.fetch(woopool);

  return {
    oracle,
    wooracle,
    woopool,
    tokenVault
  }
}

export class WoospmmtresClient {
  public async tryQuery(
    ctx: WoospmmtresContext,
    amount: BN,
  ): Promise<TransactionInstruction> {
    const fromTokenMint = new PublicKey(TOKEN_MINTS["SOL"]);
    const toTokenMint = new PublicKey(TOKEN_MINTS["USDC"]);

    const fromPoolParams = await generatePoolParams(new PublicKey(CHAINLINK_FEED_ACCOUNT.SOL), fromTokenMint, ctx.program);
    const toPoolParams = await generatePoolParams(new PublicKey(CHAINLINK_FEED_ACCOUNT.USDC), toTokenMint, ctx.program);

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

  /**
   * Swap instruction builder method with resolveATA & additional checks.
   * @param ctx - WoospmmtresContext object for the current environment.
   * @param amount - {@link SwapAsyncParams}
   * @returns
   */
  public async swap(
    ctx: WoospmmtresContext,
    amount: BN,
  ): Promise<TransactionInstruction> {
    const fromTokenMint = new PublicKey(TOKEN_MINTS["SOL"]);
    const toTokenMint = new PublicKey(TOKEN_MINTS["USDC"]);

    const fromPoolParams = await generatePoolParams(new PublicKey(CHAINLINK_FEED_ACCOUNT.SOL), fromTokenMint, ctx.program);
    const toPoolParams = await generatePoolParams(new PublicKey(CHAINLINK_FEED_ACCOUNT.USDC), toTokenMint, ctx.program);

    // TODO Prince: create ata if not exist for now.
    const tokenOwnerAccountFrom = getAssociatedTokenAddressSync(fromTokenMint, ctx.wallet.publicKey);
    const tokenOwnerAccountTo = getAssociatedTokenAddressSync(toTokenMint, ctx.wallet.publicKey);

    const swapParams : SwapParams = {
      amount,
      owner: ctx.wallet.publicKey,
      oracleFrom: fromPoolParams.oracle,
      wooracleFrom: fromPoolParams.wooracle,
      woopoolFrom: fromPoolParams.woopool,
      tokenOwnerAccountFrom,
      tokenVaultFrom: fromPoolParams.tokenVault,
      oracleTo: toPoolParams.oracle,
      wooracleTo: toPoolParams.wooracle,
      woopoolTo: toPoolParams.woopool,
      tokenOwnerAccountTo,
      tokenVaultTo: toPoolParams.tokenVault
    }

    const tx = swapIx(ctx.program, swapParams);
    return tx;
  }
}