import { AnchorProvider, Idl, Program } from "@coral-xyz/anchor";
import { Commitment, Connection, PublicKey, SendOptions } from "@solana/web3.js";
import { Wallet } from "./common";
import { Woospmm } from "./artifacts/woospmm";
import WoospmmIDL from "./artifacts/woospmm.json";

/**
 * Default settings used when interacting with transactions.
 * @category Core
 */
export type WoospmmContextOpts = {
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
export class WoospmmContext {
  readonly connection: Connection;
  readonly wallet: Wallet;
  readonly program: Program<Woospmm>;
  readonly provider: AnchorProvider;
  readonly opts: WoospmmContextOpts;
  readonly accountResolverOpts: AccountResolverOptions;

  public static from(
    connection: Connection,
    wallet: Wallet,
    programId: PublicKey = new PublicKey(WoospmmIDL.metadata.address),
    opts: WoospmmContextOpts = {}
  ): WoospmmContext {
    const anchorProvider = new AnchorProvider(connection, wallet, {
      commitment: opts.userDefaultConfirmCommitment || "confirmed",
      preflightCommitment: opts.userDefaultConfirmCommitment || "confirmed",
    });
    const program = new Program(WoospmmIDL as Idl, programId, anchorProvider);
    return new WoospmmContext(
      anchorProvider,
      anchorProvider.wallet,
      program,
      opts
    );
  }

  public static fromWorkspace(
    provider: AnchorProvider,
    program: Program,
    opts: WoospmmContextOpts = {}
  ) {
    return new WoospmmContext(
      provider,
      provider.wallet,
      program,
      opts
    );
  }

  public static withProvider(
    provider: AnchorProvider,
    programId: PublicKey,
    opts: WoospmmContextOpts = {}
  ): WoospmmContext {
    const program = new Program(WoospmmIDL as Idl, programId, provider);
    return new WoospmmContext(
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
    opts: WoospmmContextOpts = {}
  ) {
    this.connection = provider.connection;
    this.wallet = wallet;
    // It's a hack but it works on Anchor workspace *shrug*
    this.program = program as unknown as Program<Woospmm>;
    this.provider = provider;
    this.opts = opts;
    this.accountResolverOpts = opts.accountResolverOptions ?? DEFAULT_ACCOUNT_RESOLVER_OPTS;
  }

  // TODO: Add another factory method to build from on-chain IDL
}
