import { AnchorProvider, Idl, Program } from "@coral-xyz/anchor";
import { Commitment, Connection, PublicKey, SendOptions } from "@solana/web3.js";
import { Wallet } from "./common";
import { Woospmmtres } from "./artifacts/woospmmtres";
import WoospmmtresIDL from "./artifacts/woospmmtres.json";

/**
 * Default settings used when interacting with transactions.
 * @category Core
 */
export type WoospmmtresContextOpts = {
  //userDefaultBuildOptions?: Partial<BuildOptions>;
  userDefaultSendOptions?: Partial<SendOptions>;
  userDefaultConfirmCommitment?: Commitment;
  accountResolverOptions?: AccountResolverOptions;
};

/**
 * Default settings used when resolving token accounts.
 * @category Core
 */
export type AccountResolverOptions = {
  //createWrappedSolAccountMethod: WrappedSolAccountCreateMethod;
  allowPDAOwnerAddress: boolean;
};

const DEFAULT_ACCOUNT_RESOLVER_OPTS: AccountResolverOptions = {
  //createWrappedSolAccountMethod: "keypair",
  allowPDAOwnerAddress: false,
};

/**
 * Context for storing environment classes and objects for usage throughout the SDK
 * @category Core
 */
export class WoospmmtresContext {
  readonly connection: Connection;
  readonly wallet: Wallet;
  readonly program: Program<Woospmmtres>;
  readonly provider: AnchorProvider;
  readonly opts: WoospmmtresContextOpts;
  readonly accountResolverOpts: AccountResolverOptions;

  public static from(
    connection: Connection,
    wallet: Wallet,
    programId: PublicKey = new PublicKey(WoospmmtresIDL.metadata.address),
    opts: WoospmmtresContextOpts = {}
  ): WoospmmtresContext {
    const anchorProvider = new AnchorProvider(connection, wallet, {
      commitment: opts.userDefaultConfirmCommitment || "confirmed",
      preflightCommitment: opts.userDefaultConfirmCommitment || "confirmed",
    });
    const program = new Program(WoospmmtresIDL as Idl, programId, anchorProvider);
    return new WoospmmtresContext(
      anchorProvider,
      anchorProvider.wallet,
      program,
      opts
    );
  }

  public static fromWorkspace(
    provider: AnchorProvider,
    program: Program,
    opts: WoospmmtresContextOpts = {}
  ) {
    return new WoospmmtresContext(
      provider,
      provider.wallet,
      program,
      opts
    );
  }

  public static withProvider(
    provider: AnchorProvider,
    programId: PublicKey,
    opts: WoospmmtresContextOpts = {}
  ): WoospmmtresContext {
    const program = new Program(WoospmmtresIDL as Idl, programId, provider);
    return new WoospmmtresContext(
      provider,
      provider.wallet,
      program,
      opts
    );
  }

  public constructor(
    provider: AnchorProvider,
    wallet: Wallet,
    program: Program,
    opts: WoospmmtresContextOpts = {}
  ) {
    this.connection = provider.connection;
    this.wallet = wallet;
    // It's a hack but it works on Anchor workspace *shrug*
    this.program = program as unknown as Program<Woospmmtres>;
    this.provider = provider;
    this.opts = opts;
    this.accountResolverOpts = opts.accountResolverOptions ?? DEFAULT_ACCOUNT_RESOLVER_OPTS;
  }

  // TODO: Add another factory method to build from on-chain IDL
}