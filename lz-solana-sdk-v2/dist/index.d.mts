// WOOFi Customized

import * as web3 from '@solana/web3.js';
import { PublicKey, TransactionInstruction, Connection, Commitment, GetAccountInfoConfig, AccountMeta, AccountInfo, TransactionSignature, Finality, GetVersionedTransactionConfig, Blockhash, VersionedTransaction, Transaction, Keypair, NonceAccount, MessageV0 } from '@solana/web3.js';
import { PacketPath, PacketV1Codec, Packet as Packet$2 } from '@layerzerolabs/lz-v2-utilities';
import * as beet from '@metaplex-foundation/beet';
import { bignum, FixableBeetArgsStruct, BeetArgsStruct } from '@metaplex-foundation/beet';
import * as beetSolana from '@metaplex-foundation/beet-solana';
import BN from 'bn.js';
import { EndpointId, Environment, Network } from '@layerzerolabs/lz-definitions';

declare const ENDPOINT_SEED = "Endpoint";
declare const MESSAGE_LIB_SEED = "MessageLib";
declare const SEND_LIBRARY_CONFIG_SEED = "SendLibraryConfig";
declare const RECEIVE_LIBRARY_CONFIG_SEED = "ReceiveLibraryConfig";
declare const NONCE_SEED = "Nonce";
declare const PENDING_NONCE_SEED = "PendingNonce";
declare const PAYLOAD_HASH_SEED = "PayloadHash";
declare const COMPOSED_MESSAGE_HASH_SEED = "ComposedMessageHash";
declare const OAPP_SEED = "OApp";
declare const COUNT_SEED = "Count";
declare const REMOTE_SEED = "Remote";
declare const LZ_RECEIVE_TYPES_SEED = "LzReceiveTypes";
declare const LZ_COMPOSE_TYPES_SEED = "LzComposeTypes";
declare const ULN_SEED = "MessageLib";
declare const ULN_CONFIG_SEED = "UlnConfig";
declare const SEND_CONFIG_SEED = "SendConfig";
declare const RECEIVE_CONFIG_SEED = "ReceiveConfig";
declare const OPTIONS_SEED = "Options";
declare const CONFIRMATIONS_SEED = "Confirmations";
declare const WORKER_SEED = "Worker";
declare const DVN_CONFIG_SEED = "DvnConfig";
declare const EVENT_SEED = "__event_authority";
declare const EXECUTOR_CONFIG_SEED = "ExecutorConfig";
declare const PRICE_FEED_SEED = "PriceFeed";
declare const PEER_SEED = "Peer";
declare const MINT_SEED = "Mint";
declare const ENFORCED_OPTIONS_SEED = "EnforcedOptions";
/**
 * derive address for endpoint program
 */
declare class EndpointPDADeriver {
    program: PublicKey;
    constructor(program: PublicKey);
    setting(): [PublicKey, number];
    defaultSendLibraryConfig(dstEndpointId: number): [PublicKey, number];
    sendLibraryConfig(sender: PublicKey, dstEndpointId: number): [PublicKey, number];
    /**
     * @param messageLibrary PDA(derive by message lib program)
     */
    messageLibraryInfo(messageLibrary: PublicKey): [PublicKey, number];
    defaultReceiveLibraryConfig(srcEndpointId: number): [PublicKey, number];
    receiveLibraryConfig(receiver: PublicKey, srcEndpointId: number): [PublicKey, number];
    receiveLibraryTimeout(_dstEndpointId: number): [PublicKey, number];
    defaultMessageLib(): [PublicKey, number];
    blockMessageLib(blockMsgLib: PublicKey): [PublicKey, number];
    /**
     * @param localOapp
     * @param remoteChainId
     * @param remoteOapp
     */
    nonce(localOapp: PublicKey, remoteChainId: number, remoteOapp: Uint8Array): [PublicKey, number];
    pendingNonce(localOapp: PublicKey, remoteChainId: number, remoteOapp: Uint8Array): [PublicKey, number];
    oappRegistry(localOapp: PublicKey): [PublicKey, number];
    /***
     * @param receiver
     * @param srcEid
     * @param sender
     * @param nonce
     * @param payloadHash
     * @srcChainId u32 to Uint8Array([0,0,0,0])
     * @sender [u8; 32] sender Address
     * @nonce u64 to Uint8Array([0,0,0,0,0,0,0,0])
     * @payloadHash [u8; 32]
     */
    payloadHash(receiver: PublicKey, srcEid: number, sender: Uint8Array, nonce: number): [PublicKey, number];
    composedMessage(from: PublicKey, guid: Uint8Array, index: number, to: PublicKey, messageHash: Uint8Array): [PublicKey, number];
}
/***
 * derive address by message lib program
 */
declare class MessageLibPDADeriver {
    program: PublicKey;
    constructor(program: PublicKey);
    messageLib(): [PublicKey, number];
    sendConfig(eid: number, oapp: PublicKey): [PublicKey, number];
    receiveConfig(eid: number, oapp: PublicKey): [PublicKey, number];
}
declare class UlnPDADeriver extends MessageLibPDADeriver {
    setting(): [PublicKey, number];
    config(eid: number): [PublicKey, number];
    defaultSendConfig(eid: number): [PublicKey, number];
    defaultReceiveConfig(eid: number): [PublicKey, number];
    options(eit: number): [PublicKey, number];
    workerConfig(worker: PublicKey): [PublicKey, number];
    confirmations(headerHash: Uint8Array, payloadHash: Uint8Array, dvn: PublicKey): [PublicKey, number];
}
/**
 * derive address by base oapp program
 */
declare class OAppBasePDADeriver {
    program: PublicKey;
    constructor(program: PublicKey);
    remote(dstChainId: number): [PublicKey, number];
    lzReceiveTypesAccounts(): [PublicKey, number];
    lzComposeTypesAccounts(): [PublicKey, number];
}
declare class DVNDeriver {
    program: PublicKey;
    constructor(program: PublicKey);
    authority(): [PublicKey, number];
    config(): [PublicKey, number];
    executeHash(digestHash: Buffer): [PublicKey, number];
}
declare class EventPDADeriver {
    program: PublicKey;
    constructor(program: PublicKey);
    eventAuthority(): [PublicKey, number];
}
declare class ExecutorPDADeriver {
    program: PublicKey;
    constructor(program: PublicKey);
    config(): [PublicKey, number];
}
declare class PriceFeedPDADeriver {
    program: PublicKey;
    constructor(program: PublicKey);
    priceFeed(): [PublicKey, number];
}

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * Arguments used to create {@link ComposeMessageState}
 * @category Accounts
 * @category generated
 */
type ComposeMessageStateArgs = {
    received: boolean;
    bump: number;
};
declare const composeMessageStateDiscriminator: number[];
/**
 * Holds the data for the {@link ComposeMessageState} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
declare class ComposeMessageState implements ComposeMessageStateArgs {
    readonly received: boolean;
    readonly bump: number;
    private constructor();
    /**
     * Creates a {@link ComposeMessageState} instance from the provided args.
     */
    static fromArgs(args: ComposeMessageStateArgs): ComposeMessageState;
    /**
     * Deserializes the {@link ComposeMessageState} from the data of the provided {@link web3.AccountInfo}.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static fromAccountInfo(accountInfo: web3.AccountInfo<Buffer>, offset?: number): [ComposeMessageState, number];
    /**
     * Retrieves the account info from the provided address and deserializes
     * the {@link ComposeMessageState} from its data.
     *
     * @throws Error if no account info is found at the address or if deserialization fails
     */
    static fromAccountAddress(connection: web3.Connection, address: web3.PublicKey, commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig): Promise<ComposeMessageState>;
    /**
     * Provides a {@link web3.Connection.getProgramAccounts} config builder,
     * to fetch accounts matching filters that can be specified via that builder.
     *
     * @param programId - the program that owns the accounts we are filtering
     */
    static gpaBuilder(programId?: web3.PublicKey): beetSolana.GpaBuilder<{
        received: any;
        bump: any;
        accountDiscriminator: any;
    }>;
    /**
     * Deserializes the {@link ComposeMessageState} from the provided data Buffer.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static deserialize(buf: Buffer, offset?: number): [ComposeMessageState, number];
    /**
     * Serializes the {@link ComposeMessageState} into a Buffer.
     * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
     */
    serialize(): [Buffer, number];
    /**
     * Returns the byteSize of a {@link Buffer} holding the serialized data of
     * {@link ComposeMessageState}
     */
    static get byteSize(): number;
    /**
     * Fetches the minimum balance needed to exempt an account holding
     * {@link ComposeMessageState} data from rent
     *
     * @param connection used to retrieve the rent exemption information
     */
    static getMinimumBalanceForRentExemption(connection: web3.Connection, commitment?: web3.Commitment): Promise<number>;
    /**
     * Determines if the provided {@link Buffer} has the correct byte size to
     * hold {@link ComposeMessageState} data.
     */
    static hasCorrectByteSize(buf: Buffer, offset?: number): boolean;
    /**
     * Returns a readable version of {@link ComposeMessageState} properties
     * and can be used to convert to JSON and/or logging
     */
    pretty(): {
        received: boolean;
        bump: number;
    };
}
/**
 * @category Accounts
 * @category generated
 */
declare const composeMessageStateBeet: beet.BeetStruct<ComposeMessageState, ComposeMessageStateArgs & {
    accountDiscriminator: number[];
}>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * Arguments used to create {@link EndpointSettings}
 * @category Accounts
 * @category generated
 */
type EndpointSettingsArgs = {
    eid: number;
    bump: number;
    admin: web3.PublicKey;
    lzTokenMint: beet.COption<web3.PublicKey>;
};
declare const endpointSettingsDiscriminator: number[];
/**
 * Holds the data for the {@link EndpointSettings} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
declare class EndpointSettings implements EndpointSettingsArgs {
    readonly eid: number;
    readonly bump: number;
    readonly admin: web3.PublicKey;
    readonly lzTokenMint: beet.COption<web3.PublicKey>;
    private constructor();
    /**
     * Creates a {@link EndpointSettings} instance from the provided args.
     */
    static fromArgs(args: EndpointSettingsArgs): EndpointSettings;
    /**
     * Deserializes the {@link EndpointSettings} from the data of the provided {@link web3.AccountInfo}.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static fromAccountInfo(accountInfo: web3.AccountInfo<Buffer>, offset?: number): [EndpointSettings, number];
    /**
     * Retrieves the account info from the provided address and deserializes
     * the {@link EndpointSettings} from its data.
     *
     * @throws Error if no account info is found at the address or if deserialization fails
     */
    static fromAccountAddress(connection: web3.Connection, address: web3.PublicKey, commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig): Promise<EndpointSettings>;
    /**
     * Provides a {@link web3.Connection.getProgramAccounts} config builder,
     * to fetch accounts matching filters that can be specified via that builder.
     *
     * @param programId - the program that owns the accounts we are filtering
     */
    static gpaBuilder(programId?: web3.PublicKey): beetSolana.GpaBuilder<EndpointSettingsArgs & {
        accountDiscriminator: number[];
    }>;
    /**
     * Deserializes the {@link EndpointSettings} from the provided data Buffer.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static deserialize(buf: Buffer, offset?: number): [EndpointSettings, number];
    /**
     * Serializes the {@link EndpointSettings} into a Buffer.
     * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
     */
    serialize(): [Buffer, number];
    /**
     * Returns the byteSize of a {@link Buffer} holding the serialized data of
     * {@link EndpointSettings} for the provided args.
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     */
    static byteSize(args: EndpointSettingsArgs): number;
    /**
     * Fetches the minimum balance needed to exempt an account holding
     * {@link EndpointSettings} data from rent
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     * @param connection used to retrieve the rent exemption information
     */
    static getMinimumBalanceForRentExemption(args: EndpointSettingsArgs, connection: web3.Connection, commitment?: web3.Commitment): Promise<number>;
    /**
     * Returns a readable version of {@link EndpointSettings} properties
     * and can be used to convert to JSON and/or logging
     */
    pretty(): {
        eid: number;
        bump: number;
        admin: string;
        lzTokenMint: beet.COption<web3.PublicKey>;
    };
}
/**
 * @category Accounts
 * @category generated
 */
declare const endpointSettingsBeet: beet.FixableBeetStruct<EndpointSettings, EndpointSettingsArgs & {
    accountDiscriminator: number[];
}>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category enums
 * @category generated
 */
declare enum MessageLibType {
    Send = 0,
    Receive = 1,
    SendAndReceive = 2
}
/**
 * @category userTypes
 * @category generated
 */
declare const messageLibTypeBeet: beet.FixedSizeBeet<MessageLibType, MessageLibType>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * Arguments used to create {@link MessageLibInfo}
 * @category Accounts
 * @category generated
 */
type MessageLibInfoArgs = {
    messageLibType: MessageLibType;
    bump: number;
    messageLibBump: number;
};
declare const messageLibInfoDiscriminator: number[];
/**
 * Holds the data for the {@link MessageLibInfo} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
declare class MessageLibInfo implements MessageLibInfoArgs {
    readonly messageLibType: MessageLibType;
    readonly bump: number;
    readonly messageLibBump: number;
    private constructor();
    /**
     * Creates a {@link MessageLibInfo} instance from the provided args.
     */
    static fromArgs(args: MessageLibInfoArgs): MessageLibInfo;
    /**
     * Deserializes the {@link MessageLibInfo} from the data of the provided {@link web3.AccountInfo}.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static fromAccountInfo(accountInfo: web3.AccountInfo<Buffer>, offset?: number): [MessageLibInfo, number];
    /**
     * Retrieves the account info from the provided address and deserializes
     * the {@link MessageLibInfo} from its data.
     *
     * @throws Error if no account info is found at the address or if deserialization fails
     */
    static fromAccountAddress(connection: web3.Connection, address: web3.PublicKey, commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig): Promise<MessageLibInfo>;
    /**
     * Provides a {@link web3.Connection.getProgramAccounts} config builder,
     * to fetch accounts matching filters that can be specified via that builder.
     *
     * @param programId - the program that owns the accounts we are filtering
     */
    static gpaBuilder(programId?: web3.PublicKey): beetSolana.GpaBuilder<{
        bump: any;
        messageLibType: any;
        messageLibBump: any;
        accountDiscriminator: any;
    }>;
    /**
     * Deserializes the {@link MessageLibInfo} from the provided data Buffer.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static deserialize(buf: Buffer, offset?: number): [MessageLibInfo, number];
    /**
     * Serializes the {@link MessageLibInfo} into a Buffer.
     * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
     */
    serialize(): [Buffer, number];
    /**
     * Returns the byteSize of a {@link Buffer} holding the serialized data of
     * {@link MessageLibInfo}
     */
    static get byteSize(): number;
    /**
     * Fetches the minimum balance needed to exempt an account holding
     * {@link MessageLibInfo} data from rent
     *
     * @param connection used to retrieve the rent exemption information
     */
    static getMinimumBalanceForRentExemption(connection: web3.Connection, commitment?: web3.Commitment): Promise<number>;
    /**
     * Determines if the provided {@link Buffer} has the correct byte size to
     * hold {@link MessageLibInfo} data.
     */
    static hasCorrectByteSize(buf: Buffer, offset?: number): boolean;
    /**
     * Returns a readable version of {@link MessageLibInfo} properties
     * and can be used to convert to JSON and/or logging
     */
    pretty(): {
        messageLibType: string;
        bump: number;
        messageLibBump: number;
    };
}
/**
 * @category Accounts
 * @category generated
 */
declare const messageLibInfoBeet: beet.BeetStruct<MessageLibInfo, MessageLibInfoArgs & {
    accountDiscriminator: number[];
}>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * Arguments used to create {@link Nonce}
 * @category Accounts
 * @category generated
 */
type NonceArgs$1 = {
    bump: number;
    outboundNonce: beet.bignum;
    inboundNonce: beet.bignum;
};
declare const nonceDiscriminator$1: number[];
/**
 * Holds the data for the {@link Nonce} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
declare class Nonce$1 implements NonceArgs$1 {
    readonly bump: number;
    readonly outboundNonce: beet.bignum;
    readonly inboundNonce: beet.bignum;
    private constructor();
    /**
     * Creates a {@link Nonce} instance from the provided args.
     */
    static fromArgs(args: NonceArgs$1): Nonce$1;
    /**
     * Deserializes the {@link Nonce} from the data of the provided {@link web3.AccountInfo}.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static fromAccountInfo(accountInfo: web3.AccountInfo<Buffer>, offset?: number): [Nonce$1, number];
    /**
     * Retrieves the account info from the provided address and deserializes
     * the {@link Nonce} from its data.
     *
     * @throws Error if no account info is found at the address or if deserialization fails
     */
    static fromAccountAddress(connection: web3.Connection, address: web3.PublicKey, commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig): Promise<Nonce$1>;
    /**
     * Provides a {@link web3.Connection.getProgramAccounts} config builder,
     * to fetch accounts matching filters that can be specified via that builder.
     *
     * @param programId - the program that owns the accounts we are filtering
     */
    static gpaBuilder(programId?: web3.PublicKey): beetSolana.GpaBuilder<{
        bump: any;
        outboundNonce: any;
        inboundNonce: any;
        accountDiscriminator: any;
    }>;
    /**
     * Deserializes the {@link Nonce} from the provided data Buffer.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static deserialize(buf: Buffer, offset?: number): [Nonce$1, number];
    /**
     * Serializes the {@link Nonce} into a Buffer.
     * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
     */
    serialize(): [Buffer, number];
    /**
     * Returns the byteSize of a {@link Buffer} holding the serialized data of
     * {@link Nonce}
     */
    static get byteSize(): number;
    /**
     * Fetches the minimum balance needed to exempt an account holding
     * {@link Nonce} data from rent
     *
     * @param connection used to retrieve the rent exemption information
     */
    static getMinimumBalanceForRentExemption(connection: web3.Connection, commitment?: web3.Commitment): Promise<number>;
    /**
     * Determines if the provided {@link Buffer} has the correct byte size to
     * hold {@link Nonce} data.
     */
    static hasCorrectByteSize(buf: Buffer, offset?: number): boolean;
    /**
     * Returns a readable version of {@link Nonce} properties
     * and can be used to convert to JSON and/or logging
     */
    pretty(): {
        bump: number;
        outboundNonce: number | {
            toNumber: () => number;
        };
        inboundNonce: number | {
            toNumber: () => number;
        };
    };
}
/**
 * @category Accounts
 * @category generated
 */
declare const nonceBeet$1: beet.BeetStruct<Nonce$1, NonceArgs$1 & {
    accountDiscriminator: number[];
}>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * Arguments used to create {@link OAppRegistry}
 * @category Accounts
 * @category generated
 */
type OAppRegistryArgs = {
    delegate: web3.PublicKey;
    bump: number;
};
declare const oAppRegistryDiscriminator: number[];
/**
 * Holds the data for the {@link OAppRegistry} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
declare class OAppRegistry implements OAppRegistryArgs {
    readonly delegate: web3.PublicKey;
    readonly bump: number;
    private constructor();
    /**
     * Creates a {@link OAppRegistry} instance from the provided args.
     */
    static fromArgs(args: OAppRegistryArgs): OAppRegistry;
    /**
     * Deserializes the {@link OAppRegistry} from the data of the provided {@link web3.AccountInfo}.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static fromAccountInfo(accountInfo: web3.AccountInfo<Buffer>, offset?: number): [OAppRegistry, number];
    /**
     * Retrieves the account info from the provided address and deserializes
     * the {@link OAppRegistry} from its data.
     *
     * @throws Error if no account info is found at the address or if deserialization fails
     */
    static fromAccountAddress(connection: web3.Connection, address: web3.PublicKey, commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig): Promise<OAppRegistry>;
    /**
     * Provides a {@link web3.Connection.getProgramAccounts} config builder,
     * to fetch accounts matching filters that can be specified via that builder.
     *
     * @param programId - the program that owns the accounts we are filtering
     */
    static gpaBuilder(programId?: web3.PublicKey): beetSolana.GpaBuilder<{
        delegate: any;
        bump: any;
        accountDiscriminator: any;
    }>;
    /**
     * Deserializes the {@link OAppRegistry} from the provided data Buffer.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static deserialize(buf: Buffer, offset?: number): [OAppRegistry, number];
    /**
     * Serializes the {@link OAppRegistry} into a Buffer.
     * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
     */
    serialize(): [Buffer, number];
    /**
     * Returns the byteSize of a {@link Buffer} holding the serialized data of
     * {@link OAppRegistry}
     */
    static get byteSize(): number;
    /**
     * Fetches the minimum balance needed to exempt an account holding
     * {@link OAppRegistry} data from rent
     *
     * @param connection used to retrieve the rent exemption information
     */
    static getMinimumBalanceForRentExemption(connection: web3.Connection, commitment?: web3.Commitment): Promise<number>;
    /**
     * Determines if the provided {@link Buffer} has the correct byte size to
     * hold {@link OAppRegistry} data.
     */
    static hasCorrectByteSize(buf: Buffer, offset?: number): boolean;
    /**
     * Returns a readable version of {@link OAppRegistry} properties
     * and can be used to convert to JSON and/or logging
     */
    pretty(): {
        delegate: string;
        bump: number;
    };
}
/**
 * @category Accounts
 * @category generated
 */
declare const oAppRegistryBeet: beet.BeetStruct<OAppRegistry, OAppRegistryArgs & {
    accountDiscriminator: number[];
}>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * Arguments used to create {@link PayloadHash}
 * @category Accounts
 * @category generated
 */
type PayloadHashArgs = {
    hash: number[];
    bump: number;
};
declare const payloadHashDiscriminator: number[];
/**
 * Holds the data for the {@link PayloadHash} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
declare class PayloadHash implements PayloadHashArgs {
    readonly hash: number[];
    readonly bump: number;
    private constructor();
    /**
     * Creates a {@link PayloadHash} instance from the provided args.
     */
    static fromArgs(args: PayloadHashArgs): PayloadHash;
    /**
     * Deserializes the {@link PayloadHash} from the data of the provided {@link web3.AccountInfo}.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static fromAccountInfo(accountInfo: web3.AccountInfo<Buffer>, offset?: number): [PayloadHash, number];
    /**
     * Retrieves the account info from the provided address and deserializes
     * the {@link PayloadHash} from its data.
     *
     * @throws Error if no account info is found at the address or if deserialization fails
     */
    static fromAccountAddress(connection: web3.Connection, address: web3.PublicKey, commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig): Promise<PayloadHash>;
    /**
     * Provides a {@link web3.Connection.getProgramAccounts} config builder,
     * to fetch accounts matching filters that can be specified via that builder.
     *
     * @param programId - the program that owns the accounts we are filtering
     */
    static gpaBuilder(programId?: web3.PublicKey): beetSolana.GpaBuilder<{
        bump: any;
        hash: any;
        accountDiscriminator: any;
    }>;
    /**
     * Deserializes the {@link PayloadHash} from the provided data Buffer.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static deserialize(buf: Buffer, offset?: number): [PayloadHash, number];
    /**
     * Serializes the {@link PayloadHash} into a Buffer.
     * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
     */
    serialize(): [Buffer, number];
    /**
     * Returns the byteSize of a {@link Buffer} holding the serialized data of
     * {@link PayloadHash}
     */
    static get byteSize(): number;
    /**
     * Fetches the minimum balance needed to exempt an account holding
     * {@link PayloadHash} data from rent
     *
     * @param connection used to retrieve the rent exemption information
     */
    static getMinimumBalanceForRentExemption(connection: web3.Connection, commitment?: web3.Commitment): Promise<number>;
    /**
     * Determines if the provided {@link Buffer} has the correct byte size to
     * hold {@link PayloadHash} data.
     */
    static hasCorrectByteSize(buf: Buffer, offset?: number): boolean;
    /**
     * Returns a readable version of {@link PayloadHash} properties
     * and can be used to convert to JSON and/or logging
     */
    pretty(): {
        hash: number[];
        bump: number;
    };
}
/**
 * @category Accounts
 * @category generated
 */
declare const payloadHashBeet: beet.BeetStruct<PayloadHash, PayloadHashArgs & {
    accountDiscriminator: number[];
}>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * Arguments used to create {@link PendingInboundNonce}
 * @category Accounts
 * @category generated
 */
type PendingInboundNonceArgs = {
    nonces: beet.bignum[];
    bump: number;
};
declare const pendingInboundNonceDiscriminator: number[];
/**
 * Holds the data for the {@link PendingInboundNonce} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
declare class PendingInboundNonce implements PendingInboundNonceArgs {
    readonly nonces: beet.bignum[];
    readonly bump: number;
    private constructor();
    /**
     * Creates a {@link PendingInboundNonce} instance from the provided args.
     */
    static fromArgs(args: PendingInboundNonceArgs): PendingInboundNonce;
    /**
     * Deserializes the {@link PendingInboundNonce} from the data of the provided {@link web3.AccountInfo}.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static fromAccountInfo(accountInfo: web3.AccountInfo<Buffer>, offset?: number): [PendingInboundNonce, number];
    /**
     * Retrieves the account info from the provided address and deserializes
     * the {@link PendingInboundNonce} from its data.
     *
     * @throws Error if no account info is found at the address or if deserialization fails
     */
    static fromAccountAddress(connection: web3.Connection, address: web3.PublicKey, commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig): Promise<PendingInboundNonce>;
    /**
     * Provides a {@link web3.Connection.getProgramAccounts} config builder,
     * to fetch accounts matching filters that can be specified via that builder.
     *
     * @param programId - the program that owns the accounts we are filtering
     */
    static gpaBuilder(programId?: web3.PublicKey): beetSolana.GpaBuilder<PendingInboundNonceArgs & {
        accountDiscriminator: number[];
    }>;
    /**
     * Deserializes the {@link PendingInboundNonce} from the provided data Buffer.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static deserialize(buf: Buffer, offset?: number): [PendingInboundNonce, number];
    /**
     * Serializes the {@link PendingInboundNonce} into a Buffer.
     * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
     */
    serialize(): [Buffer, number];
    /**
     * Returns the byteSize of a {@link Buffer} holding the serialized data of
     * {@link PendingInboundNonce} for the provided args.
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     */
    static byteSize(args: PendingInboundNonceArgs): number;
    /**
     * Fetches the minimum balance needed to exempt an account holding
     * {@link PendingInboundNonce} data from rent
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     * @param connection used to retrieve the rent exemption information
     */
    static getMinimumBalanceForRentExemption(args: PendingInboundNonceArgs, connection: web3.Connection, commitment?: web3.Commitment): Promise<number>;
    /**
     * Returns a readable version of {@link PendingInboundNonce} properties
     * and can be used to convert to JSON and/or logging
     */
    pretty(): {
        nonces: beet.bignum[];
        bump: number;
    };
}
/**
 * @category Accounts
 * @category generated
 */
declare const pendingInboundNonceBeet: beet.FixableBeetStruct<PendingInboundNonce, PendingInboundNonceArgs & {
    accountDiscriminator: number[];
}>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type ReceiveLibraryTimeout = {
    messageLib: web3.PublicKey;
    expiry: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const receiveLibraryTimeoutBeet: beet.BeetArgsStruct<ReceiveLibraryTimeout>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * Arguments used to create {@link ReceiveLibraryConfig}
 * @category Accounts
 * @category generated
 */
type ReceiveLibraryConfigArgs = {
    messageLib: web3.PublicKey;
    timeout: beet.COption<ReceiveLibraryTimeout>;
    bump: number;
};
declare const receiveLibraryConfigDiscriminator: number[];
/**
 * Holds the data for the {@link ReceiveLibraryConfig} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
declare class ReceiveLibraryConfig implements ReceiveLibraryConfigArgs {
    readonly messageLib: web3.PublicKey;
    readonly timeout: beet.COption<ReceiveLibraryTimeout>;
    readonly bump: number;
    private constructor();
    /**
     * Creates a {@link ReceiveLibraryConfig} instance from the provided args.
     */
    static fromArgs(args: ReceiveLibraryConfigArgs): ReceiveLibraryConfig;
    /**
     * Deserializes the {@link ReceiveLibraryConfig} from the data of the provided {@link web3.AccountInfo}.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static fromAccountInfo(accountInfo: web3.AccountInfo<Buffer>, offset?: number): [ReceiveLibraryConfig, number];
    /**
     * Retrieves the account info from the provided address and deserializes
     * the {@link ReceiveLibraryConfig} from its data.
     *
     * @throws Error if no account info is found at the address or if deserialization fails
     */
    static fromAccountAddress(connection: web3.Connection, address: web3.PublicKey, commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig): Promise<ReceiveLibraryConfig>;
    /**
     * Provides a {@link web3.Connection.getProgramAccounts} config builder,
     * to fetch accounts matching filters that can be specified via that builder.
     *
     * @param programId - the program that owns the accounts we are filtering
     */
    static gpaBuilder(programId?: web3.PublicKey): beetSolana.GpaBuilder<ReceiveLibraryConfigArgs & {
        accountDiscriminator: number[];
    }>;
    /**
     * Deserializes the {@link ReceiveLibraryConfig} from the provided data Buffer.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static deserialize(buf: Buffer, offset?: number): [ReceiveLibraryConfig, number];
    /**
     * Serializes the {@link ReceiveLibraryConfig} into a Buffer.
     * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
     */
    serialize(): [Buffer, number];
    /**
     * Returns the byteSize of a {@link Buffer} holding the serialized data of
     * {@link ReceiveLibraryConfig} for the provided args.
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     */
    static byteSize(args: ReceiveLibraryConfigArgs): number;
    /**
     * Fetches the minimum balance needed to exempt an account holding
     * {@link ReceiveLibraryConfig} data from rent
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     * @param connection used to retrieve the rent exemption information
     */
    static getMinimumBalanceForRentExemption(args: ReceiveLibraryConfigArgs, connection: web3.Connection, commitment?: web3.Commitment): Promise<number>;
    /**
     * Returns a readable version of {@link ReceiveLibraryConfig} properties
     * and can be used to convert to JSON and/or logging
     */
    pretty(): {
        messageLib: string;
        timeout: beet.COption<ReceiveLibraryTimeout>;
        bump: number;
    };
}
/**
 * @category Accounts
 * @category generated
 */
declare const receiveLibraryConfigBeet: beet.FixableBeetStruct<ReceiveLibraryConfig, ReceiveLibraryConfigArgs & {
    accountDiscriminator: number[];
}>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * Arguments used to create {@link SendLibraryConfig}
 * @category Accounts
 * @category generated
 */
type SendLibraryConfigArgs = {
    messageLib: web3.PublicKey;
    bump: number;
};
declare const sendLibraryConfigDiscriminator: number[];
/**
 * Holds the data for the {@link SendLibraryConfig} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
declare class SendLibraryConfig implements SendLibraryConfigArgs {
    readonly messageLib: web3.PublicKey;
    readonly bump: number;
    private constructor();
    /**
     * Creates a {@link SendLibraryConfig} instance from the provided args.
     */
    static fromArgs(args: SendLibraryConfigArgs): SendLibraryConfig;
    /**
     * Deserializes the {@link SendLibraryConfig} from the data of the provided {@link web3.AccountInfo}.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static fromAccountInfo(accountInfo: web3.AccountInfo<Buffer>, offset?: number): [SendLibraryConfig, number];
    /**
     * Retrieves the account info from the provided address and deserializes
     * the {@link SendLibraryConfig} from its data.
     *
     * @throws Error if no account info is found at the address or if deserialization fails
     */
    static fromAccountAddress(connection: web3.Connection, address: web3.PublicKey, commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig): Promise<SendLibraryConfig>;
    /**
     * Provides a {@link web3.Connection.getProgramAccounts} config builder,
     * to fetch accounts matching filters that can be specified via that builder.
     *
     * @param programId - the program that owns the accounts we are filtering
     */
    static gpaBuilder(programId?: web3.PublicKey): beetSolana.GpaBuilder<{
        messageLib: any;
        bump: any;
        accountDiscriminator: any;
    }>;
    /**
     * Deserializes the {@link SendLibraryConfig} from the provided data Buffer.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static deserialize(buf: Buffer, offset?: number): [SendLibraryConfig, number];
    /**
     * Serializes the {@link SendLibraryConfig} into a Buffer.
     * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
     */
    serialize(): [Buffer, number];
    /**
     * Returns the byteSize of a {@link Buffer} holding the serialized data of
     * {@link SendLibraryConfig}
     */
    static get byteSize(): number;
    /**
     * Fetches the minimum balance needed to exempt an account holding
     * {@link SendLibraryConfig} data from rent
     *
     * @param connection used to retrieve the rent exemption information
     */
    static getMinimumBalanceForRentExemption(connection: web3.Connection, commitment?: web3.Commitment): Promise<number>;
    /**
     * Determines if the provided {@link Buffer} has the correct byte size to
     * hold {@link SendLibraryConfig} data.
     */
    static hasCorrectByteSize(buf: Buffer, offset?: number): boolean;
    /**
     * Returns a readable version of {@link SendLibraryConfig} properties
     * and can be used to convert to JSON and/or logging
     */
    pretty(): {
        messageLib: string;
        bump: number;
    };
}
/**
 * @category Accounts
 * @category generated
 */
declare const sendLibraryConfigBeet: beet.BeetStruct<SendLibraryConfig, SendLibraryConfigArgs & {
    accountDiscriminator: number[];
}>;

declare const accountProviders$5: {
    ComposeMessageState: typeof ComposeMessageState;
    EndpointSettings: typeof EndpointSettings;
    OAppRegistry: typeof OAppRegistry;
    MessageLibInfo: typeof MessageLibInfo;
    ReceiveLibraryConfig: typeof ReceiveLibraryConfig;
    SendLibraryConfig: typeof SendLibraryConfig;
    Nonce: typeof Nonce$1;
    PayloadHash: typeof PayloadHash;
    PendingInboundNonce: typeof PendingInboundNonce;
};

type index$r_ComposeMessageState = ComposeMessageState;
declare const index$r_ComposeMessageState: typeof ComposeMessageState;
type index$r_ComposeMessageStateArgs = ComposeMessageStateArgs;
type index$r_EndpointSettings = EndpointSettings;
declare const index$r_EndpointSettings: typeof EndpointSettings;
type index$r_EndpointSettingsArgs = EndpointSettingsArgs;
type index$r_MessageLibInfo = MessageLibInfo;
declare const index$r_MessageLibInfo: typeof MessageLibInfo;
type index$r_MessageLibInfoArgs = MessageLibInfoArgs;
type index$r_OAppRegistry = OAppRegistry;
declare const index$r_OAppRegistry: typeof OAppRegistry;
type index$r_OAppRegistryArgs = OAppRegistryArgs;
type index$r_PayloadHash = PayloadHash;
declare const index$r_PayloadHash: typeof PayloadHash;
type index$r_PayloadHashArgs = PayloadHashArgs;
type index$r_PendingInboundNonce = PendingInboundNonce;
declare const index$r_PendingInboundNonce: typeof PendingInboundNonce;
type index$r_PendingInboundNonceArgs = PendingInboundNonceArgs;
type index$r_ReceiveLibraryConfig = ReceiveLibraryConfig;
declare const index$r_ReceiveLibraryConfig: typeof ReceiveLibraryConfig;
type index$r_ReceiveLibraryConfigArgs = ReceiveLibraryConfigArgs;
type index$r_SendLibraryConfig = SendLibraryConfig;
declare const index$r_SendLibraryConfig: typeof SendLibraryConfig;
type index$r_SendLibraryConfigArgs = SendLibraryConfigArgs;
declare const index$r_composeMessageStateBeet: typeof composeMessageStateBeet;
declare const index$r_composeMessageStateDiscriminator: typeof composeMessageStateDiscriminator;
declare const index$r_endpointSettingsBeet: typeof endpointSettingsBeet;
declare const index$r_endpointSettingsDiscriminator: typeof endpointSettingsDiscriminator;
declare const index$r_messageLibInfoBeet: typeof messageLibInfoBeet;
declare const index$r_messageLibInfoDiscriminator: typeof messageLibInfoDiscriminator;
declare const index$r_oAppRegistryBeet: typeof oAppRegistryBeet;
declare const index$r_oAppRegistryDiscriminator: typeof oAppRegistryDiscriminator;
declare const index$r_payloadHashBeet: typeof payloadHashBeet;
declare const index$r_payloadHashDiscriminator: typeof payloadHashDiscriminator;
declare const index$r_pendingInboundNonceBeet: typeof pendingInboundNonceBeet;
declare const index$r_pendingInboundNonceDiscriminator: typeof pendingInboundNonceDiscriminator;
declare const index$r_receiveLibraryConfigBeet: typeof receiveLibraryConfigBeet;
declare const index$r_receiveLibraryConfigDiscriminator: typeof receiveLibraryConfigDiscriminator;
declare const index$r_sendLibraryConfigBeet: typeof sendLibraryConfigBeet;
declare const index$r_sendLibraryConfigDiscriminator: typeof sendLibraryConfigDiscriminator;
declare namespace index$r {
  export { index$r_ComposeMessageState as ComposeMessageState, type index$r_ComposeMessageStateArgs as ComposeMessageStateArgs, index$r_EndpointSettings as EndpointSettings, type index$r_EndpointSettingsArgs as EndpointSettingsArgs, index$r_MessageLibInfo as MessageLibInfo, type index$r_MessageLibInfoArgs as MessageLibInfoArgs, Nonce$1 as Nonce, type NonceArgs$1 as NonceArgs, index$r_OAppRegistry as OAppRegistry, type index$r_OAppRegistryArgs as OAppRegistryArgs, index$r_PayloadHash as PayloadHash, type index$r_PayloadHashArgs as PayloadHashArgs, index$r_PendingInboundNonce as PendingInboundNonce, type index$r_PendingInboundNonceArgs as PendingInboundNonceArgs, index$r_ReceiveLibraryConfig as ReceiveLibraryConfig, type index$r_ReceiveLibraryConfigArgs as ReceiveLibraryConfigArgs, index$r_SendLibraryConfig as SendLibraryConfig, type index$r_SendLibraryConfigArgs as SendLibraryConfigArgs, accountProviders$5 as accountProviders, index$r_composeMessageStateBeet as composeMessageStateBeet, index$r_composeMessageStateDiscriminator as composeMessageStateDiscriminator, index$r_endpointSettingsBeet as endpointSettingsBeet, index$r_endpointSettingsDiscriminator as endpointSettingsDiscriminator, index$r_messageLibInfoBeet as messageLibInfoBeet, index$r_messageLibInfoDiscriminator as messageLibInfoDiscriminator, nonceBeet$1 as nonceBeet, nonceDiscriminator$1 as nonceDiscriminator, index$r_oAppRegistryBeet as oAppRegistryBeet, index$r_oAppRegistryDiscriminator as oAppRegistryDiscriminator, index$r_payloadHashBeet as payloadHashBeet, index$r_payloadHashDiscriminator as payloadHashDiscriminator, index$r_pendingInboundNonceBeet as pendingInboundNonceBeet, index$r_pendingInboundNonceDiscriminator as pendingInboundNonceDiscriminator, index$r_receiveLibraryConfigBeet as receiveLibraryConfigBeet, index$r_receiveLibraryConfigDiscriminator as receiveLibraryConfigDiscriminator, index$r_sendLibraryConfigBeet as sendLibraryConfigBeet, index$r_sendLibraryConfigDiscriminator as sendLibraryConfigDiscriminator };
}

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */
type ErrorWithCode$4 = Error & {
    code: number;
};
type MaybeErrorWithCode$4 = ErrorWithCode$4 | null | undefined;
/**
 * InvalidSendLibrary: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidSendLibraryError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidReceiveLibrary: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidReceiveLibraryError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * SameValue: ''
 *
 * @category Errors
 * @category generated
 */
declare class SameValueError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * AccountNotFound: ''
 *
 * @category Errors
 * @category generated
 */
declare class AccountNotFoundError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * OnlySendLib: ''
 *
 * @category Errors
 * @category generated
 */
declare class OnlySendLibError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * OnlyReceiveLib: ''
 *
 * @category Errors
 * @category generated
 */
declare class OnlyReceiveLibError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidExpiry: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidExpiryError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * OnlyNonDefaultLib: ''
 *
 * @category Errors
 * @category generated
 */
declare class OnlyNonDefaultLibError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidAmount: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidAmountError$3 extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidNonce: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidNonceError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * Unauthorized: ''
 *
 * @category Errors
 * @category generated
 */
declare class UnauthorizedError$1 extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * PayloadHashNotFound: ''
 *
 * @category Errors
 * @category generated
 */
declare class PayloadHashNotFoundError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * ComposeNotFound: ''
 *
 * @category Errors
 * @category generated
 */
declare class ComposeNotFoundError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidPayloadHash: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidPayloadHashError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * LzTokenUnavailable: ''
 *
 * @category Errors
 * @category generated
 */
declare class LzTokenUnavailableError$2 extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * ReadOnlyAccount: ''
 *
 * @category Errors
 * @category generated
 */
declare class ReadOnlyAccountError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidMessageLib: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidMessageLibError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * WritableAccountNotAllowed: ''
 *
 * @category Errors
 * @category generated
 */
declare class WritableAccountNotAllowedError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * Attempts to resolve a custom program error from the provided error code.
 * @category Errors
 * @category generated
 */
declare function errorFromCode$4(code: number): MaybeErrorWithCode$4;
/**
 * Attempts to resolve a custom program error from the provided error name, i.e. 'Unauthorized'.
 * @category Errors
 * @category generated
 */
declare function errorFromName$4(name: string): MaybeErrorWithCode$4;

type index$q_AccountNotFoundError = AccountNotFoundError;
declare const index$q_AccountNotFoundError: typeof AccountNotFoundError;
type index$q_ComposeNotFoundError = ComposeNotFoundError;
declare const index$q_ComposeNotFoundError: typeof ComposeNotFoundError;
type index$q_InvalidExpiryError = InvalidExpiryError;
declare const index$q_InvalidExpiryError: typeof InvalidExpiryError;
type index$q_InvalidMessageLibError = InvalidMessageLibError;
declare const index$q_InvalidMessageLibError: typeof InvalidMessageLibError;
type index$q_InvalidNonceError = InvalidNonceError;
declare const index$q_InvalidNonceError: typeof InvalidNonceError;
type index$q_InvalidPayloadHashError = InvalidPayloadHashError;
declare const index$q_InvalidPayloadHashError: typeof InvalidPayloadHashError;
type index$q_InvalidReceiveLibraryError = InvalidReceiveLibraryError;
declare const index$q_InvalidReceiveLibraryError: typeof InvalidReceiveLibraryError;
type index$q_InvalidSendLibraryError = InvalidSendLibraryError;
declare const index$q_InvalidSendLibraryError: typeof InvalidSendLibraryError;
type index$q_OnlyNonDefaultLibError = OnlyNonDefaultLibError;
declare const index$q_OnlyNonDefaultLibError: typeof OnlyNonDefaultLibError;
type index$q_OnlyReceiveLibError = OnlyReceiveLibError;
declare const index$q_OnlyReceiveLibError: typeof OnlyReceiveLibError;
type index$q_OnlySendLibError = OnlySendLibError;
declare const index$q_OnlySendLibError: typeof OnlySendLibError;
type index$q_PayloadHashNotFoundError = PayloadHashNotFoundError;
declare const index$q_PayloadHashNotFoundError: typeof PayloadHashNotFoundError;
type index$q_ReadOnlyAccountError = ReadOnlyAccountError;
declare const index$q_ReadOnlyAccountError: typeof ReadOnlyAccountError;
type index$q_SameValueError = SameValueError;
declare const index$q_SameValueError: typeof SameValueError;
type index$q_WritableAccountNotAllowedError = WritableAccountNotAllowedError;
declare const index$q_WritableAccountNotAllowedError: typeof WritableAccountNotAllowedError;
declare namespace index$q {
  export { index$q_AccountNotFoundError as AccountNotFoundError, index$q_ComposeNotFoundError as ComposeNotFoundError, InvalidAmountError$3 as InvalidAmountError, index$q_InvalidExpiryError as InvalidExpiryError, index$q_InvalidMessageLibError as InvalidMessageLibError, index$q_InvalidNonceError as InvalidNonceError, index$q_InvalidPayloadHashError as InvalidPayloadHashError, index$q_InvalidReceiveLibraryError as InvalidReceiveLibraryError, index$q_InvalidSendLibraryError as InvalidSendLibraryError, LzTokenUnavailableError$2 as LzTokenUnavailableError, index$q_OnlyNonDefaultLibError as OnlyNonDefaultLibError, index$q_OnlyReceiveLibError as OnlyReceiveLibError, index$q_OnlySendLibError as OnlySendLibError, index$q_PayloadHashNotFoundError as PayloadHashNotFoundError, index$q_ReadOnlyAccountError as ReadOnlyAccountError, index$q_SameValueError as SameValueError, UnauthorizedError$1 as UnauthorizedError, index$q_WritableAccountNotAllowedError as WritableAccountNotAllowedError, errorFromCode$4 as errorFromCode, errorFromName$4 as errorFromName };
}

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type BurnParams = {
    receiver: web3.PublicKey;
    srcEid: number;
    sender: number[];
    nonce: beet.bignum;
    payloadHash: number[];
};
/**
 * @category userTypes
 * @category generated
 */
declare const burnParamsBeet: beet.BeetArgsStruct<BurnParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category Burn
 * @category generated
 */
type BurnInstructionArgs = {
    params: BurnParams;
};
/**
 * @category Instructions
 * @category Burn
 * @category generated
 */
declare const burnStruct: beet.BeetArgsStruct<BurnInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _burn_ instruction
 *
 * @property [**signer**] signer
 * @property [] oappRegistry
 * @property [] nonce
 * @property [_writable_] payloadHash
 * @property [_writable_] endpoint
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category Burn
 * @category generated
 */
type BurnInstructionAccounts = {
    signer: web3.PublicKey;
    oappRegistry: web3.PublicKey;
    nonce: web3.PublicKey;
    payloadHash: web3.PublicKey;
    endpoint: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const burnInstructionDiscriminator: number[];
/**
 * Creates a _Burn_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category Burn
 * @category generated
 */
declare function createBurnInstruction(accounts: BurnInstructionAccounts, args: BurnInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _Burn_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category Burn
 * @category generated
 */
declare function createBurnInstructionAccounts(accounts: BurnInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type ClearParams = {
    receiver: web3.PublicKey;
    srcEid: number;
    sender: number[];
    nonce: beet.bignum;
    guid: number[];
    message: Uint8Array;
};
/**
 * @category userTypes
 * @category generated
 */
declare const clearParamsBeet: beet.FixableBeetArgsStruct<ClearParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category Clear
 * @category generated
 */
type ClearInstructionArgs = {
    params: ClearParams;
};
/**
 * @category Instructions
 * @category Clear
 * @category generated
 */
declare const clearStruct: beet.FixableBeetArgsStruct<ClearInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _clear_ instruction
 *
 * @property [**signer**] signer
 * @property [] oappRegistry
 * @property [] nonce
 * @property [_writable_] payloadHash
 * @property [_writable_] endpoint
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category Clear
 * @category generated
 */
type ClearInstructionAccounts = {
    signer: web3.PublicKey;
    oappRegistry: web3.PublicKey;
    nonce: web3.PublicKey;
    payloadHash: web3.PublicKey;
    endpoint: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const clearInstructionDiscriminator: number[];
/**
 * Creates a _Clear_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category Clear
 * @category generated
 */
declare function createClearInstruction(accounts: ClearInstructionAccounts, args: ClearInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _Clear_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category Clear
 * @category generated
 */
declare function createClearInstructionAccounts(accounts: ClearInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type ClearComposeParams = {
    from: web3.PublicKey;
    guid: number[];
    index: number;
    message: Uint8Array;
};
/**
 * @category userTypes
 * @category generated
 */
declare const clearComposeParamsBeet: beet.FixableBeetArgsStruct<ClearComposeParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category ClearCompose
 * @category generated
 */
type ClearComposeInstructionArgs = {
    params: ClearComposeParams;
};
/**
 * @category Instructions
 * @category ClearCompose
 * @category generated
 */
declare const clearComposeStruct: beet.FixableBeetArgsStruct<ClearComposeInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _clearCompose_ instruction
 *
 * @property [**signer**] to
 * @property [_writable_] composeMessage
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category ClearCompose
 * @category generated
 */
type ClearComposeInstructionAccounts = {
    to: web3.PublicKey;
    composeMessage: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const clearComposeInstructionDiscriminator: number[];
/**
 * Creates a _ClearCompose_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category ClearCompose
 * @category generated
 */
declare function createClearComposeInstruction(accounts: ClearComposeInstructionAccounts, args: ClearComposeInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _ClearCompose_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category ClearCompose
 * @category generated
 */
declare function createClearComposeInstructionAccounts(accounts: ClearComposeInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type InitConfigParams$2 = {
    oapp: web3.PublicKey;
    eid: number;
};
/**
 * @category userTypes
 * @category generated
 */
declare const initConfigParamsBeet$2: beet.BeetArgsStruct<InitConfigParams$2>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category InitConfig
 * @category generated
 */
type InitConfigInstructionArgs$2 = {
    params: InitConfigParams$2;
};
/**
 * @category Instructions
 * @category InitConfig
 * @category generated
 */
declare const initConfigStruct$2: beet.BeetArgsStruct<InitConfigInstructionArgs$2 & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _initConfig_ instruction
 *
 * @property [**signer**] delegate
 * @property [] oappRegistry
 * @property [] messageLibInfo
 * @property [] messageLib
 * @property [] messageLibProgram
 * @category Instructions
 * @category InitConfig
 * @category generated
 */
type InitConfigInstructionAccounts$2 = {
    delegate: web3.PublicKey;
    oappRegistry: web3.PublicKey;
    messageLibInfo: web3.PublicKey;
    messageLib: web3.PublicKey;
    messageLibProgram: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const initConfigInstructionDiscriminator$2: number[];
/**
 * Creates a _InitConfig_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category InitConfig
 * @category generated
 */
declare function createInitConfigInstruction$2(accounts: InitConfigInstructionAccounts$2, args: InitConfigInstructionArgs$2, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _InitConfig_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category InitConfig
 * @category generated
 */
declare function createInitConfigInstructionAccounts$2(accounts: InitConfigInstructionAccounts$2, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type InitDefaultReceiveLibraryParams = {
    eid: number;
    newLib: web3.PublicKey;
};
/**
 * @category userTypes
 * @category generated
 */
declare const initDefaultReceiveLibraryParamsBeet: beet.BeetArgsStruct<InitDefaultReceiveLibraryParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category InitDefaultReceiveLibrary
 * @category generated
 */
type InitDefaultReceiveLibraryInstructionArgs = {
    params: InitDefaultReceiveLibraryParams;
};
/**
 * @category Instructions
 * @category InitDefaultReceiveLibrary
 * @category generated
 */
declare const initDefaultReceiveLibraryStruct: beet.BeetArgsStruct<InitDefaultReceiveLibraryInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _initDefaultReceiveLibrary_ instruction
 *
 * @property [_writable_, **signer**] admin
 * @property [] endpoint
 * @property [_writable_] defaultReceiveLibraryConfig
 * @property [] messageLibInfo
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category InitDefaultReceiveLibrary
 * @category generated
 */
type InitDefaultReceiveLibraryInstructionAccounts = {
    admin: web3.PublicKey;
    endpoint: web3.PublicKey;
    defaultReceiveLibraryConfig: web3.PublicKey;
    messageLibInfo: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const initDefaultReceiveLibraryInstructionDiscriminator: number[];
/**
 * Creates a _InitDefaultReceiveLibrary_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category InitDefaultReceiveLibrary
 * @category generated
 */
declare function createInitDefaultReceiveLibraryInstruction(accounts: InitDefaultReceiveLibraryInstructionAccounts, args: InitDefaultReceiveLibraryInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _InitDefaultReceiveLibrary_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category InitDefaultReceiveLibrary
 * @category generated
 */
declare function createInitDefaultReceiveLibraryInstructionAccounts(accounts: InitDefaultReceiveLibraryInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type InitDefaultSendLibraryParams = {
    eid: number;
    newLib: web3.PublicKey;
};
/**
 * @category userTypes
 * @category generated
 */
declare const initDefaultSendLibraryParamsBeet: beet.BeetArgsStruct<InitDefaultSendLibraryParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category InitDefaultSendLibrary
 * @category generated
 */
type InitDefaultSendLibraryInstructionArgs = {
    params: InitDefaultSendLibraryParams;
};
/**
 * @category Instructions
 * @category InitDefaultSendLibrary
 * @category generated
 */
declare const initDefaultSendLibraryStruct: beet.BeetArgsStruct<InitDefaultSendLibraryInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _initDefaultSendLibrary_ instruction
 *
 * @property [_writable_, **signer**] admin
 * @property [] endpoint
 * @property [_writable_] defaultSendLibraryConfig
 * @property [] messageLibInfo
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category InitDefaultSendLibrary
 * @category generated
 */
type InitDefaultSendLibraryInstructionAccounts = {
    admin: web3.PublicKey;
    endpoint: web3.PublicKey;
    defaultSendLibraryConfig: web3.PublicKey;
    messageLibInfo: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const initDefaultSendLibraryInstructionDiscriminator: number[];
/**
 * Creates a _InitDefaultSendLibrary_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category InitDefaultSendLibrary
 * @category generated
 */
declare function createInitDefaultSendLibraryInstruction(accounts: InitDefaultSendLibraryInstructionAccounts, args: InitDefaultSendLibraryInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _InitDefaultSendLibrary_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category InitDefaultSendLibrary
 * @category generated
 */
declare function createInitDefaultSendLibraryInstructionAccounts(accounts: InitDefaultSendLibraryInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type InitEndpointParams = {
    eid: number;
    admin: web3.PublicKey;
};
/**
 * @category userTypes
 * @category generated
 */
declare const initEndpointParamsBeet: beet.BeetArgsStruct<InitEndpointParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category InitEndpoint
 * @category generated
 */
type InitEndpointInstructionArgs = {
    params: InitEndpointParams;
};
/**
 * @category Instructions
 * @category InitEndpoint
 * @category generated
 */
declare const initEndpointStruct: beet.BeetArgsStruct<InitEndpointInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _initEndpoint_ instruction
 *
 * @property [_writable_, **signer**] payer
 * @property [_writable_] endpoint
 * @category Instructions
 * @category InitEndpoint
 * @category generated
 */
type InitEndpointInstructionAccounts = {
    payer: web3.PublicKey;
    endpoint: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const initEndpointInstructionDiscriminator: number[];
/**
 * Creates a _InitEndpoint_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category InitEndpoint
 * @category generated
 */
declare function createInitEndpointInstruction(accounts: InitEndpointInstructionAccounts, args: InitEndpointInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _InitEndpoint_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category InitEndpoint
 * @category generated
 */
declare function createInitEndpointInstructionAccounts(accounts: InitEndpointInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type InitNonceParams = {
    localOapp: web3.PublicKey;
    remoteEid: number;
    remoteOapp: number[];
};
/**
 * @category userTypes
 * @category generated
 */
declare const initNonceParamsBeet: beet.BeetArgsStruct<InitNonceParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category InitNonce
 * @category generated
 */
type InitNonceInstructionArgs = {
    params: InitNonceParams;
};
/**
 * @category Instructions
 * @category InitNonce
 * @category generated
 */
declare const initNonceStruct: beet.BeetArgsStruct<InitNonceInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _initNonce_ instruction
 *
 * @property [_writable_, **signer**] delegate
 * @property [] oappRegistry
 * @property [_writable_] nonce
 * @property [_writable_] pendingInboundNonce
 * @category Instructions
 * @category InitNonce
 * @category generated
 */
type InitNonceInstructionAccounts = {
    delegate: web3.PublicKey;
    oappRegistry: web3.PublicKey;
    nonce: web3.PublicKey;
    pendingInboundNonce: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const initNonceInstructionDiscriminator: number[];
/**
 * Creates a _InitNonce_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category InitNonce
 * @category generated
 */
declare function createInitNonceInstruction(accounts: InitNonceInstructionAccounts, args: InitNonceInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _InitNonce_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category InitNonce
 * @category generated
 */
declare function createInitNonceInstructionAccounts(accounts: InitNonceInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type InitReceiveLibraryParams = {
    receiver: web3.PublicKey;
    eid: number;
};
/**
 * @category userTypes
 * @category generated
 */
declare const initReceiveLibraryParamsBeet: beet.BeetArgsStruct<InitReceiveLibraryParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category InitReceiveLibrary
 * @category generated
 */
type InitReceiveLibraryInstructionArgs = {
    params: InitReceiveLibraryParams;
};
/**
 * @category Instructions
 * @category InitReceiveLibrary
 * @category generated
 */
declare const initReceiveLibraryStruct: beet.BeetArgsStruct<InitReceiveLibraryInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _initReceiveLibrary_ instruction
 *
 * @property [_writable_, **signer**] delegate
 * @property [] oappRegistry
 * @property [_writable_] receiveLibraryConfig
 * @category Instructions
 * @category InitReceiveLibrary
 * @category generated
 */
type InitReceiveLibraryInstructionAccounts = {
    delegate: web3.PublicKey;
    oappRegistry: web3.PublicKey;
    receiveLibraryConfig: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const initReceiveLibraryInstructionDiscriminator: number[];
/**
 * Creates a _InitReceiveLibrary_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category InitReceiveLibrary
 * @category generated
 */
declare function createInitReceiveLibraryInstruction(accounts: InitReceiveLibraryInstructionAccounts, args: InitReceiveLibraryInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _InitReceiveLibrary_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category InitReceiveLibrary
 * @category generated
 */
declare function createInitReceiveLibraryInstructionAccounts(accounts: InitReceiveLibraryInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type InitSendLibraryParams = {
    sender: web3.PublicKey;
    eid: number;
};
/**
 * @category userTypes
 * @category generated
 */
declare const initSendLibraryParamsBeet: beet.BeetArgsStruct<InitSendLibraryParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category InitSendLibrary
 * @category generated
 */
type InitSendLibraryInstructionArgs = {
    params: InitSendLibraryParams;
};
/**
 * @category Instructions
 * @category InitSendLibrary
 * @category generated
 */
declare const initSendLibraryStruct: beet.BeetArgsStruct<InitSendLibraryInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _initSendLibrary_ instruction
 *
 * @property [_writable_, **signer**] delegate
 * @property [] oappRegistry
 * @property [_writable_] sendLibraryConfig
 * @category Instructions
 * @category InitSendLibrary
 * @category generated
 */
type InitSendLibraryInstructionAccounts = {
    delegate: web3.PublicKey;
    oappRegistry: web3.PublicKey;
    sendLibraryConfig: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const initSendLibraryInstructionDiscriminator: number[];
/**
 * Creates a _InitSendLibrary_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category InitSendLibrary
 * @category generated
 */
declare function createInitSendLibraryInstruction(accounts: InitSendLibraryInstructionAccounts, args: InitSendLibraryInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _InitSendLibrary_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category InitSendLibrary
 * @category generated
 */
declare function createInitSendLibraryInstructionAccounts(accounts: InitSendLibraryInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type InitVerifyParams$1 = {
    srcEid: number;
    sender: number[];
    receiver: web3.PublicKey;
    nonce: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const initVerifyParamsBeet$1: beet.BeetArgsStruct<InitVerifyParams$1>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category InitVerify
 * @category generated
 */
type InitVerifyInstructionArgs$1 = {
    params: InitVerifyParams$1;
};
/**
 * @category Instructions
 * @category InitVerify
 * @category generated
 */
declare const initVerifyStruct$1: beet.BeetArgsStruct<InitVerifyInstructionArgs$1 & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _initVerify_ instruction
 *
 * @property [_writable_, **signer**] payer
 * @property [] nonce
 * @property [_writable_] payloadHash
 * @category Instructions
 * @category InitVerify
 * @category generated
 */
type InitVerifyInstructionAccounts$1 = {
    payer: web3.PublicKey;
    nonce: web3.PublicKey;
    payloadHash: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const initVerifyInstructionDiscriminator$1: number[];
/**
 * Creates a _InitVerify_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category InitVerify
 * @category generated
 */
declare function createInitVerifyInstruction$1(accounts: InitVerifyInstructionAccounts$1, args: InitVerifyInstructionArgs$1, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _InitVerify_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category InitVerify
 * @category generated
 */
declare function createInitVerifyInstructionAccounts$1(accounts: InitVerifyInstructionAccounts$1, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type LzComposeAlertParams = {
    from: web3.PublicKey;
    to: web3.PublicKey;
    guid: number[];
    index: number;
    computeUnits: beet.bignum;
    value: beet.bignum;
    message: Uint8Array;
    extraData: Uint8Array;
    reason: Uint8Array;
};
/**
 * @category userTypes
 * @category generated
 */
declare const lzComposeAlertParamsBeet: beet.FixableBeetArgsStruct<LzComposeAlertParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category LzComposeAlert
 * @category generated
 */
type LzComposeAlertInstructionArgs = {
    params: LzComposeAlertParams;
};
/**
 * @category Instructions
 * @category LzComposeAlert
 * @category generated
 */
declare const lzComposeAlertStruct: beet.FixableBeetArgsStruct<LzComposeAlertInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _lzComposeAlert_ instruction
 *
 * @property [**signer**] executor
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category LzComposeAlert
 * @category generated
 */
type LzComposeAlertInstructionAccounts = {
    executor: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const lzComposeAlertInstructionDiscriminator: number[];
/**
 * Creates a _LzComposeAlert_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category LzComposeAlert
 * @category generated
 */
declare function createLzComposeAlertInstruction(accounts: LzComposeAlertInstructionAccounts, args: LzComposeAlertInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _LzComposeAlert_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category LzComposeAlert
 * @category generated
 */
declare function createLzComposeAlertInstructionAccounts(accounts: LzComposeAlertInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type LzReceiveAlertParams = {
    receiver: web3.PublicKey;
    srcEid: number;
    sender: number[];
    nonce: beet.bignum;
    guid: number[];
    computeUnits: beet.bignum;
    value: beet.bignum;
    message: Uint8Array;
    extraData: Uint8Array;
    reason: Uint8Array;
};
/**
 * @category userTypes
 * @category generated
 */
declare const lzReceiveAlertParamsBeet: beet.FixableBeetArgsStruct<LzReceiveAlertParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category LzReceiveAlert
 * @category generated
 */
type LzReceiveAlertInstructionArgs = {
    params: LzReceiveAlertParams;
};
/**
 * @category Instructions
 * @category LzReceiveAlert
 * @category generated
 */
declare const lzReceiveAlertStruct: beet.FixableBeetArgsStruct<LzReceiveAlertInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _lzReceiveAlert_ instruction
 *
 * @property [**signer**] executor
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category LzReceiveAlert
 * @category generated
 */
type LzReceiveAlertInstructionAccounts = {
    executor: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const lzReceiveAlertInstructionDiscriminator: number[];
/**
 * Creates a _LzReceiveAlert_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category LzReceiveAlert
 * @category generated
 */
declare function createLzReceiveAlertInstruction(accounts: LzReceiveAlertInstructionAccounts, args: LzReceiveAlertInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _LzReceiveAlert_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category LzReceiveAlert
 * @category generated
 */
declare function createLzReceiveAlertInstructionAccounts(accounts: LzReceiveAlertInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type NilifyParams = {
    receiver: web3.PublicKey;
    srcEid: number;
    sender: number[];
    nonce: beet.bignum;
    payloadHash: number[];
};
/**
 * @category userTypes
 * @category generated
 */
declare const nilifyParamsBeet: beet.BeetArgsStruct<NilifyParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category Nilify
 * @category generated
 */
type NilifyInstructionArgs = {
    params: NilifyParams;
};
/**
 * @category Instructions
 * @category Nilify
 * @category generated
 */
declare const nilifyStruct: beet.BeetArgsStruct<NilifyInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _nilify_ instruction
 *
 * @property [**signer**] signer
 * @property [] oappRegistry
 * @property [_writable_] nonce
 * @property [_writable_] pendingInboundNonce
 * @property [_writable_] payloadHash
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category Nilify
 * @category generated
 */
type NilifyInstructionAccounts = {
    signer: web3.PublicKey;
    oappRegistry: web3.PublicKey;
    nonce: web3.PublicKey;
    pendingInboundNonce: web3.PublicKey;
    payloadHash: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const nilifyInstructionDiscriminator: number[];
/**
 * Creates a _Nilify_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category Nilify
 * @category generated
 */
declare function createNilifyInstruction(accounts: NilifyInstructionAccounts, args: NilifyInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _Nilify_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category Nilify
 * @category generated
 */
declare function createNilifyInstructionAccounts(accounts: NilifyInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type QuoteParams$2 = {
    sender: web3.PublicKey;
    dstEid: number;
    receiver: number[];
    message: Uint8Array;
    options: Uint8Array;
    payInLzToken: boolean;
};
/**
 * @category userTypes
 * @category generated
 */
declare const quoteParamsBeet$2: beet.FixableBeetArgsStruct<QuoteParams$2>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category Quote
 * @category generated
 */
type QuoteInstructionArgs$2 = {
    params: QuoteParams$2;
};
/**
 * @category Instructions
 * @category Quote
 * @category generated
 */
declare const quoteStruct$2: beet.FixableBeetArgsStruct<QuoteInstructionArgs$2 & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _quote_ instruction
 *
 * @property [] sendLibraryProgram
 * @property [] sendLibraryConfig
 * @property [] defaultSendLibraryConfig
 * @property [] sendLibraryInfo
 * @property [] endpoint
 * @property [] nonce
 * @category Instructions
 * @category Quote
 * @category generated
 */
type QuoteInstructionAccounts$2 = {
    sendLibraryProgram: web3.PublicKey;
    sendLibraryConfig: web3.PublicKey;
    defaultSendLibraryConfig: web3.PublicKey;
    sendLibraryInfo: web3.PublicKey;
    endpoint: web3.PublicKey;
    nonce: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const quoteInstructionDiscriminator$2: number[];
/**
 * Creates a _Quote_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category Quote
 * @category generated
 */
declare function createQuoteInstruction$2(accounts: QuoteInstructionAccounts$2, args: QuoteInstructionArgs$2, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _Quote_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category Quote
 * @category generated
 */
declare function createQuoteInstructionAccounts$2(accounts: QuoteInstructionAccounts$2, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type RegisterLibraryParams = {
    libProgram: web3.PublicKey;
    libType: MessageLibType;
};
/**
 * @category userTypes
 * @category generated
 */
declare const registerLibraryParamsBeet: beet.BeetArgsStruct<RegisterLibraryParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category RegisterLibrary
 * @category generated
 */
type RegisterLibraryInstructionArgs = {
    params: RegisterLibraryParams;
};
/**
 * @category Instructions
 * @category RegisterLibrary
 * @category generated
 */
declare const registerLibraryStruct: beet.BeetArgsStruct<RegisterLibraryInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _registerLibrary_ instruction
 *
 * @property [_writable_, **signer**] admin
 * @property [] endpoint
 * @property [_writable_] messageLibInfo
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category RegisterLibrary
 * @category generated
 */
type RegisterLibraryInstructionAccounts = {
    admin: web3.PublicKey;
    endpoint: web3.PublicKey;
    messageLibInfo: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const registerLibraryInstructionDiscriminator: number[];
/**
 * Creates a _RegisterLibrary_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category RegisterLibrary
 * @category generated
 */
declare function createRegisterLibraryInstruction(accounts: RegisterLibraryInstructionAccounts, args: RegisterLibraryInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _RegisterLibrary_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category RegisterLibrary
 * @category generated
 */
declare function createRegisterLibraryInstructionAccounts(accounts: RegisterLibraryInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type RegisterOAppParams = {
    delegate: web3.PublicKey;
};
/**
 * @category userTypes
 * @category generated
 */
declare const registerOAppParamsBeet: beet.BeetArgsStruct<RegisterOAppParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category RegisterOapp
 * @category generated
 */
type RegisterOappInstructionArgs = {
    params: RegisterOAppParams;
};
/**
 * @category Instructions
 * @category RegisterOapp
 * @category generated
 */
declare const registerOappStruct: beet.BeetArgsStruct<RegisterOappInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _registerOapp_ instruction
 *
 * @property [_writable_, **signer**] payer
 * @property [**signer**] oapp
 * @property [_writable_] oappRegistry
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category RegisterOapp
 * @category generated
 */
type RegisterOappInstructionAccounts = {
    payer: web3.PublicKey;
    oapp: web3.PublicKey;
    oappRegistry: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const registerOappInstructionDiscriminator: number[];
/**
 * Creates a _RegisterOapp_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category RegisterOapp
 * @category generated
 */
declare function createRegisterOappInstruction(accounts: RegisterOappInstructionAccounts, args: RegisterOappInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _RegisterOapp_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category RegisterOapp
 * @category generated
 */
declare function createRegisterOappInstructionAccounts(accounts: RegisterOappInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type SendParams$2 = {
    dstEid: number;
    receiver: number[];
    message: Uint8Array;
    options: Uint8Array;
    nativeFee: beet.bignum;
    lzTokenFee: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const sendParamsBeet$2: beet.FixableBeetArgsStruct<SendParams$2>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category Send
 * @category generated
 */
type SendInstructionArgs$2 = {
    params: SendParams$2;
};
/**
 * @category Instructions
 * @category Send
 * @category generated
 */
declare const sendStruct$2: beet.FixableBeetArgsStruct<SendInstructionArgs$2 & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _send_ instruction
 *
 * @property [**signer**] sender
 * @property [] sendLibraryProgram
 * @property [] sendLibraryConfig
 * @property [] defaultSendLibraryConfig
 * @property [] sendLibraryInfo
 * @property [] endpoint
 * @property [_writable_] nonce
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category Send
 * @category generated
 */
type SendInstructionAccounts$2 = {
    sender: web3.PublicKey;
    sendLibraryProgram: web3.PublicKey;
    sendLibraryConfig: web3.PublicKey;
    defaultSendLibraryConfig: web3.PublicKey;
    sendLibraryInfo: web3.PublicKey;
    endpoint: web3.PublicKey;
    nonce: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const sendInstructionDiscriminator$2: number[];
/**
 * Creates a _Send_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category Send
 * @category generated
 */
declare function createSendInstruction$2(accounts: SendInstructionAccounts$2, args: SendInstructionArgs$2, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _Send_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category Send
 * @category generated
 */
declare function createSendInstructionAccounts$2(accounts: SendInstructionAccounts$2, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type SendComposeParams = {
    to: web3.PublicKey;
    guid: number[];
    index: number;
    message: Uint8Array;
};
/**
 * @category userTypes
 * @category generated
 */
declare const sendComposeParamsBeet: beet.FixableBeetArgsStruct<SendComposeParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category SendCompose
 * @category generated
 */
type SendComposeInstructionArgs = {
    params: SendComposeParams;
};
/**
 * @category Instructions
 * @category SendCompose
 * @category generated
 */
declare const sendComposeStruct: beet.FixableBeetArgsStruct<SendComposeInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _sendCompose_ instruction
 *
 * @property [**signer**] from
 * @property [_writable_, **signer**] payer
 * @property [_writable_] composeMessage
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category SendCompose
 * @category generated
 */
type SendComposeInstructionAccounts = {
    from: web3.PublicKey;
    payer: web3.PublicKey;
    composeMessage: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const sendComposeInstructionDiscriminator: number[];
/**
 * Creates a _SendCompose_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category SendCompose
 * @category generated
 */
declare function createSendComposeInstruction(accounts: SendComposeInstructionAccounts, args: SendComposeInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _SendCompose_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category SendCompose
 * @category generated
 */
declare function createSendComposeInstructionAccounts(accounts: SendComposeInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type SetConfigParams$3 = {
    oapp: web3.PublicKey;
    eid: number;
    configType: number;
    config: Uint8Array;
};
/**
 * @category userTypes
 * @category generated
 */
declare const setConfigParamsBeet$3: beet.FixableBeetArgsStruct<SetConfigParams$3>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category SetConfig
 * @category generated
 */
type SetConfigInstructionArgs$3 = {
    params: SetConfigParams$3;
};
/**
 * @category Instructions
 * @category SetConfig
 * @category generated
 */
declare const setConfigStruct$3: beet.FixableBeetArgsStruct<SetConfigInstructionArgs$3 & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _setConfig_ instruction
 *
 * @property [**signer**] signer
 * @property [] oappRegistry
 * @property [] messageLibInfo
 * @property [] messageLib
 * @property [] messageLibProgram
 * @category Instructions
 * @category SetConfig
 * @category generated
 */
type SetConfigInstructionAccounts$3 = {
    signer: web3.PublicKey;
    oappRegistry: web3.PublicKey;
    messageLibInfo: web3.PublicKey;
    messageLib: web3.PublicKey;
    messageLibProgram: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const setConfigInstructionDiscriminator$3: number[];
/**
 * Creates a _SetConfig_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category SetConfig
 * @category generated
 */
declare function createSetConfigInstruction$3(accounts: SetConfigInstructionAccounts$3, args: SetConfigInstructionArgs$3, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _SetConfig_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category SetConfig
 * @category generated
 */
declare function createSetConfigInstructionAccounts$3(accounts: SetConfigInstructionAccounts$3, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type SetDefaultReceiveLibraryParams = {
    eid: number;
    newLib: web3.PublicKey;
    gracePeriod: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const setDefaultReceiveLibraryParamsBeet: beet.BeetArgsStruct<SetDefaultReceiveLibraryParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category SetDefaultReceiveLibrary
 * @category generated
 */
type SetDefaultReceiveLibraryInstructionArgs = {
    params: SetDefaultReceiveLibraryParams;
};
/**
 * @category Instructions
 * @category SetDefaultReceiveLibrary
 * @category generated
 */
declare const setDefaultReceiveLibraryStruct: beet.BeetArgsStruct<SetDefaultReceiveLibraryInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _setDefaultReceiveLibrary_ instruction
 *
 * @property [**signer**] admin
 * @property [] endpoint
 * @property [_writable_] defaultReceiveLibraryConfig
 * @property [] messageLibInfo
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category SetDefaultReceiveLibrary
 * @category generated
 */
type SetDefaultReceiveLibraryInstructionAccounts = {
    admin: web3.PublicKey;
    endpoint: web3.PublicKey;
    defaultReceiveLibraryConfig: web3.PublicKey;
    messageLibInfo: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const setDefaultReceiveLibraryInstructionDiscriminator: number[];
/**
 * Creates a _SetDefaultReceiveLibrary_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category SetDefaultReceiveLibrary
 * @category generated
 */
declare function createSetDefaultReceiveLibraryInstruction(accounts: SetDefaultReceiveLibraryInstructionAccounts, args: SetDefaultReceiveLibraryInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _SetDefaultReceiveLibrary_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category SetDefaultReceiveLibrary
 * @category generated
 */
declare function createSetDefaultReceiveLibraryInstructionAccounts(accounts: SetDefaultReceiveLibraryInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type SetDefaultReceiveLibraryTimeoutParams = {
    eid: number;
    lib: web3.PublicKey;
    expiry: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const setDefaultReceiveLibraryTimeoutParamsBeet: beet.BeetArgsStruct<SetDefaultReceiveLibraryTimeoutParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category SetDefaultReceiveLibraryTimeout
 * @category generated
 */
type SetDefaultReceiveLibraryTimeoutInstructionArgs = {
    params: SetDefaultReceiveLibraryTimeoutParams;
};
/**
 * @category Instructions
 * @category SetDefaultReceiveLibraryTimeout
 * @category generated
 */
declare const setDefaultReceiveLibraryTimeoutStruct: beet.BeetArgsStruct<SetDefaultReceiveLibraryTimeoutInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _setDefaultReceiveLibraryTimeout_ instruction
 *
 * @property [**signer**] admin
 * @property [] endpoint
 * @property [_writable_] defaultReceiveLibraryConfig
 * @property [] messageLibInfo
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category SetDefaultReceiveLibraryTimeout
 * @category generated
 */
type SetDefaultReceiveLibraryTimeoutInstructionAccounts = {
    admin: web3.PublicKey;
    endpoint: web3.PublicKey;
    defaultReceiveLibraryConfig: web3.PublicKey;
    messageLibInfo: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const setDefaultReceiveLibraryTimeoutInstructionDiscriminator: number[];
/**
 * Creates a _SetDefaultReceiveLibraryTimeout_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category SetDefaultReceiveLibraryTimeout
 * @category generated
 */
declare function createSetDefaultReceiveLibraryTimeoutInstruction(accounts: SetDefaultReceiveLibraryTimeoutInstructionAccounts, args: SetDefaultReceiveLibraryTimeoutInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _SetDefaultReceiveLibraryTimeout_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category SetDefaultReceiveLibraryTimeout
 * @category generated
 */
declare function createSetDefaultReceiveLibraryTimeoutInstructionAccounts(accounts: SetDefaultReceiveLibraryTimeoutInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type SetDefaultSendLibraryParams = {
    eid: number;
    newLib: web3.PublicKey;
};
/**
 * @category userTypes
 * @category generated
 */
declare const setDefaultSendLibraryParamsBeet: beet.BeetArgsStruct<SetDefaultSendLibraryParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category SetDefaultSendLibrary
 * @category generated
 */
type SetDefaultSendLibraryInstructionArgs = {
    params: SetDefaultSendLibraryParams;
};
/**
 * @category Instructions
 * @category SetDefaultSendLibrary
 * @category generated
 */
declare const setDefaultSendLibraryStruct: beet.BeetArgsStruct<SetDefaultSendLibraryInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _setDefaultSendLibrary_ instruction
 *
 * @property [**signer**] admin
 * @property [] endpoint
 * @property [_writable_] defaultSendLibraryConfig
 * @property [] messageLibInfo
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category SetDefaultSendLibrary
 * @category generated
 */
type SetDefaultSendLibraryInstructionAccounts = {
    admin: web3.PublicKey;
    endpoint: web3.PublicKey;
    defaultSendLibraryConfig: web3.PublicKey;
    messageLibInfo: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const setDefaultSendLibraryInstructionDiscriminator: number[];
/**
 * Creates a _SetDefaultSendLibrary_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category SetDefaultSendLibrary
 * @category generated
 */
declare function createSetDefaultSendLibraryInstruction(accounts: SetDefaultSendLibraryInstructionAccounts, args: SetDefaultSendLibraryInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _SetDefaultSendLibrary_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category SetDefaultSendLibrary
 * @category generated
 */
declare function createSetDefaultSendLibraryInstructionAccounts(accounts: SetDefaultSendLibraryInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type SetDelegateParams = {
    delegate: web3.PublicKey;
};
/**
 * @category userTypes
 * @category generated
 */
declare const setDelegateParamsBeet: beet.BeetArgsStruct<SetDelegateParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category SetDelegate
 * @category generated
 */
type SetDelegateInstructionArgs = {
    params: SetDelegateParams;
};
/**
 * @category Instructions
 * @category SetDelegate
 * @category generated
 */
declare const setDelegateStruct: beet.BeetArgsStruct<SetDelegateInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _setDelegate_ instruction
 *
 * @property [**signer**] oapp
 * @property [_writable_] oappRegistry
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category SetDelegate
 * @category generated
 */
type SetDelegateInstructionAccounts = {
    oapp: web3.PublicKey;
    oappRegistry: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const setDelegateInstructionDiscriminator: number[];
/**
 * Creates a _SetDelegate_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category SetDelegate
 * @category generated
 */
declare function createSetDelegateInstruction(accounts: SetDelegateInstructionAccounts, args: SetDelegateInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _SetDelegate_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category SetDelegate
 * @category generated
 */
declare function createSetDelegateInstructionAccounts(accounts: SetDelegateInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type SetLzTokenParams = {
    lzToken: beet.COption<web3.PublicKey>;
};
/**
 * @category userTypes
 * @category generated
 */
declare const setLzTokenParamsBeet: beet.FixableBeetArgsStruct<SetLzTokenParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category SetLzToken
 * @category generated
 */
type SetLzTokenInstructionArgs = {
    params: SetLzTokenParams;
};
/**
 * @category Instructions
 * @category SetLzToken
 * @category generated
 */
declare const setLzTokenStruct: beet.FixableBeetArgsStruct<SetLzTokenInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _setLzToken_ instruction
 *
 * @property [**signer**] admin
 * @property [_writable_] endpoint
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category SetLzToken
 * @category generated
 */
type SetLzTokenInstructionAccounts = {
    admin: web3.PublicKey;
    endpoint: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const setLzTokenInstructionDiscriminator: number[];
/**
 * Creates a _SetLzToken_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category SetLzToken
 * @category generated
 */
declare function createSetLzTokenInstruction(accounts: SetLzTokenInstructionAccounts, args: SetLzTokenInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _SetLzToken_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category SetLzToken
 * @category generated
 */
declare function createSetLzTokenInstructionAccounts(accounts: SetLzTokenInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type SetReceiveLibraryParams = {
    receiver: web3.PublicKey;
    eid: number;
    newLib: web3.PublicKey;
    gracePeriod: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const setReceiveLibraryParamsBeet: beet.BeetArgsStruct<SetReceiveLibraryParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category SetReceiveLibrary
 * @category generated
 */
type SetReceiveLibraryInstructionArgs = {
    params: SetReceiveLibraryParams;
};
/**
 * @category Instructions
 * @category SetReceiveLibrary
 * @category generated
 */
declare const setReceiveLibraryStruct: beet.BeetArgsStruct<SetReceiveLibraryInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _setReceiveLibrary_ instruction
 *
 * @property [**signer**] signer
 * @property [] oappRegistry
 * @property [_writable_] receiveLibraryConfig
 * @property [] messageLibInfo (optional)
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category SetReceiveLibrary
 * @category generated
 */
type SetReceiveLibraryInstructionAccounts = {
    signer: web3.PublicKey;
    oappRegistry: web3.PublicKey;
    receiveLibraryConfig: web3.PublicKey;
    messageLibInfo?: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const setReceiveLibraryInstructionDiscriminator: number[];
/**
 * Creates a _SetReceiveLibrary_ instruction.
 *
 * Optional accounts that are not provided default to the program ID since
 * this was indicated in the IDL from which this instruction was generated.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category SetReceiveLibrary
 * @category generated
 */
declare function createSetReceiveLibraryInstruction(accounts: SetReceiveLibraryInstructionAccounts, args: SetReceiveLibraryInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _SetReceiveLibrary_ instructionAccounts.
 *
 * Optional accounts that are not provided default to the program ID since
 * this was indicated in the IDL from which this instruction was generated.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category SetReceiveLibrary
 * @category generated
 */
declare function createSetReceiveLibraryInstructionAccounts(accounts: SetReceiveLibraryInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type SetReceiveLibraryTimeoutParams = {
    receiver: web3.PublicKey;
    eid: number;
    lib: web3.PublicKey;
    expiry: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const setReceiveLibraryTimeoutParamsBeet: beet.BeetArgsStruct<SetReceiveLibraryTimeoutParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category SetReceiveLibraryTimeout
 * @category generated
 */
type SetReceiveLibraryTimeoutInstructionArgs = {
    params: SetReceiveLibraryTimeoutParams;
};
/**
 * @category Instructions
 * @category SetReceiveLibraryTimeout
 * @category generated
 */
declare const setReceiveLibraryTimeoutStruct: beet.BeetArgsStruct<SetReceiveLibraryTimeoutInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _setReceiveLibraryTimeout_ instruction
 *
 * @property [**signer**] signer
 * @property [] oappRegistry
 * @property [_writable_] receiveLibraryConfig
 * @property [] messageLibInfo
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category SetReceiveLibraryTimeout
 * @category generated
 */
type SetReceiveLibraryTimeoutInstructionAccounts = {
    signer: web3.PublicKey;
    oappRegistry: web3.PublicKey;
    receiveLibraryConfig: web3.PublicKey;
    messageLibInfo: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const setReceiveLibraryTimeoutInstructionDiscriminator: number[];
/**
 * Creates a _SetReceiveLibraryTimeout_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category SetReceiveLibraryTimeout
 * @category generated
 */
declare function createSetReceiveLibraryTimeoutInstruction(accounts: SetReceiveLibraryTimeoutInstructionAccounts, args: SetReceiveLibraryTimeoutInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _SetReceiveLibraryTimeout_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category SetReceiveLibraryTimeout
 * @category generated
 */
declare function createSetReceiveLibraryTimeoutInstructionAccounts(accounts: SetReceiveLibraryTimeoutInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type SetSendLibraryParams = {
    sender: web3.PublicKey;
    eid: number;
    newLib: web3.PublicKey;
};
/**
 * @category userTypes
 * @category generated
 */
declare const setSendLibraryParamsBeet: beet.BeetArgsStruct<SetSendLibraryParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category SetSendLibrary
 * @category generated
 */
type SetSendLibraryInstructionArgs = {
    params: SetSendLibraryParams;
};
/**
 * @category Instructions
 * @category SetSendLibrary
 * @category generated
 */
declare const setSendLibraryStruct: beet.BeetArgsStruct<SetSendLibraryInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _setSendLibrary_ instruction
 *
 * @property [**signer**] signer
 * @property [] oappRegistry
 * @property [_writable_] sendLibraryConfig
 * @property [] messageLibInfo (optional)
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category SetSendLibrary
 * @category generated
 */
type SetSendLibraryInstructionAccounts = {
    signer: web3.PublicKey;
    oappRegistry: web3.PublicKey;
    sendLibraryConfig: web3.PublicKey;
    messageLibInfo?: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const setSendLibraryInstructionDiscriminator: number[];
/**
 * Creates a _SetSendLibrary_ instruction.
 *
 * Optional accounts that are not provided default to the program ID since
 * this was indicated in the IDL from which this instruction was generated.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category SetSendLibrary
 * @category generated
 */
declare function createSetSendLibraryInstruction(accounts: SetSendLibraryInstructionAccounts, args: SetSendLibraryInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _SetSendLibrary_ instructionAccounts.
 *
 * Optional accounts that are not provided default to the program ID since
 * this was indicated in the IDL from which this instruction was generated.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category SetSendLibrary
 * @category generated
 */
declare function createSetSendLibraryInstructionAccounts(accounts: SetSendLibraryInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type SkipParams = {
    receiver: web3.PublicKey;
    srcEid: number;
    sender: number[];
    nonce: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const skipParamsBeet: beet.BeetArgsStruct<SkipParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category Skip
 * @category generated
 */
type SkipInstructionArgs = {
    params: SkipParams;
};
/**
 * @category Instructions
 * @category Skip
 * @category generated
 */
declare const skipStruct: beet.BeetArgsStruct<SkipInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _skip_ instruction
 *
 * @property [**signer**] signer
 * @property [] oappRegistry
 * @property [_writable_] nonce
 * @property [_writable_] pendingInboundNonce
 * @property [_writable_] payloadHash
 * @property [_writable_] endpoint
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category Skip
 * @category generated
 */
type SkipInstructionAccounts = {
    signer: web3.PublicKey;
    oappRegistry: web3.PublicKey;
    nonce: web3.PublicKey;
    pendingInboundNonce: web3.PublicKey;
    payloadHash: web3.PublicKey;
    endpoint: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const skipInstructionDiscriminator: number[];
/**
 * Creates a _Skip_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category Skip
 * @category generated
 */
declare function createSkipInstruction(accounts: SkipInstructionAccounts, args: SkipInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _Skip_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category Skip
 * @category generated
 */
declare function createSkipInstructionAccounts(accounts: SkipInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type TransferAdminParams$3 = {
    admin: web3.PublicKey;
};
/**
 * @category userTypes
 * @category generated
 */
declare const transferAdminParamsBeet$3: beet.BeetArgsStruct<TransferAdminParams$3>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category TransferAdmin
 * @category generated
 */
type TransferAdminInstructionArgs$3 = {
    params: TransferAdminParams$3;
};
/**
 * @category Instructions
 * @category TransferAdmin
 * @category generated
 */
declare const transferAdminStruct$3: beet.BeetArgsStruct<TransferAdminInstructionArgs$3 & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _transferAdmin_ instruction
 *
 * @property [**signer**] admin
 * @property [_writable_] endpoint
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category TransferAdmin
 * @category generated
 */
type TransferAdminInstructionAccounts$3 = {
    admin: web3.PublicKey;
    endpoint: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const transferAdminInstructionDiscriminator$3: number[];
/**
 * Creates a _TransferAdmin_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category TransferAdmin
 * @category generated
 */
declare function createTransferAdminInstruction$3(accounts: TransferAdminInstructionAccounts$3, args: TransferAdminInstructionArgs$3, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _TransferAdmin_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category TransferAdmin
 * @category generated
 */
declare function createTransferAdminInstructionAccounts$3(accounts: TransferAdminInstructionAccounts$3, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type VerifyParams$1 = {
    srcEid: number;
    sender: number[];
    receiver: web3.PublicKey;
    nonce: beet.bignum;
    payloadHash: number[];
};
/**
 * @category userTypes
 * @category generated
 */
declare const verifyParamsBeet$1: beet.BeetArgsStruct<VerifyParams$1>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category Verify
 * @category generated
 */
type VerifyInstructionArgs$1 = {
    params: VerifyParams$1;
};
/**
 * @category Instructions
 * @category Verify
 * @category generated
 */
declare const verifyStruct$1: beet.BeetArgsStruct<VerifyInstructionArgs$1 & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _verify_ instruction
 *
 * @property [**signer**] receiveLibrary
 * @property [] receiveLibraryConfig
 * @property [] defaultReceiveLibraryConfig
 * @property [_writable_] nonce
 * @property [_writable_] pendingInboundNonce
 * @property [_writable_] payloadHash
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category Verify
 * @category generated
 */
type VerifyInstructionAccounts$1 = {
    receiveLibrary: web3.PublicKey;
    receiveLibraryConfig: web3.PublicKey;
    defaultReceiveLibraryConfig: web3.PublicKey;
    nonce: web3.PublicKey;
    pendingInboundNonce: web3.PublicKey;
    payloadHash: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const verifyInstructionDiscriminator$1: number[];
/**
 * Creates a _Verify_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category Verify
 * @category generated
 */
declare function createVerifyInstruction$1(accounts: VerifyInstructionAccounts$1, args: VerifyInstructionArgs$1, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _Verify_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category Verify
 * @category generated
 */
declare function createVerifyInstructionAccounts$1(accounts: VerifyInstructionAccounts$1, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type WithdrawRentParams$1 = {
    amount: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const withdrawRentParamsBeet$1: beet.BeetArgsStruct<WithdrawRentParams$1>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category WithdrawRent
 * @category generated
 */
type WithdrawRentInstructionArgs$1 = {
    params: WithdrawRentParams$1;
};
/**
 * @category Instructions
 * @category WithdrawRent
 * @category generated
 */
declare const withdrawRentStruct$1: beet.BeetArgsStruct<WithdrawRentInstructionArgs$1 & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _withdrawRent_ instruction
 *
 * @property [**signer**] admin
 * @property [_writable_] endpoint
 * @property [_writable_] receiver
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category WithdrawRent
 * @category generated
 */
type WithdrawRentInstructionAccounts$1 = {
    admin: web3.PublicKey;
    endpoint: web3.PublicKey;
    receiver: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const withdrawRentInstructionDiscriminator$1: number[];
/**
 * Creates a _WithdrawRent_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category WithdrawRent
 * @category generated
 */
declare function createWithdrawRentInstruction$1(accounts: WithdrawRentInstructionAccounts$1, args: WithdrawRentInstructionArgs$1, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _WithdrawRent_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category WithdrawRent
 * @category generated
 */
declare function createWithdrawRentInstructionAccounts$1(accounts: WithdrawRentInstructionAccounts$1, programId: web3.PublicKey): web3.AccountMeta[];

type index$p_BurnInstructionAccounts = BurnInstructionAccounts;
type index$p_BurnInstructionArgs = BurnInstructionArgs;
type index$p_ClearComposeInstructionAccounts = ClearComposeInstructionAccounts;
type index$p_ClearComposeInstructionArgs = ClearComposeInstructionArgs;
type index$p_ClearInstructionAccounts = ClearInstructionAccounts;
type index$p_ClearInstructionArgs = ClearInstructionArgs;
type index$p_InitDefaultReceiveLibraryInstructionAccounts = InitDefaultReceiveLibraryInstructionAccounts;
type index$p_InitDefaultReceiveLibraryInstructionArgs = InitDefaultReceiveLibraryInstructionArgs;
type index$p_InitDefaultSendLibraryInstructionAccounts = InitDefaultSendLibraryInstructionAccounts;
type index$p_InitDefaultSendLibraryInstructionArgs = InitDefaultSendLibraryInstructionArgs;
type index$p_InitEndpointInstructionAccounts = InitEndpointInstructionAccounts;
type index$p_InitEndpointInstructionArgs = InitEndpointInstructionArgs;
type index$p_InitNonceInstructionAccounts = InitNonceInstructionAccounts;
type index$p_InitNonceInstructionArgs = InitNonceInstructionArgs;
type index$p_InitReceiveLibraryInstructionAccounts = InitReceiveLibraryInstructionAccounts;
type index$p_InitReceiveLibraryInstructionArgs = InitReceiveLibraryInstructionArgs;
type index$p_InitSendLibraryInstructionAccounts = InitSendLibraryInstructionAccounts;
type index$p_InitSendLibraryInstructionArgs = InitSendLibraryInstructionArgs;
type index$p_LzComposeAlertInstructionAccounts = LzComposeAlertInstructionAccounts;
type index$p_LzComposeAlertInstructionArgs = LzComposeAlertInstructionArgs;
type index$p_LzReceiveAlertInstructionAccounts = LzReceiveAlertInstructionAccounts;
type index$p_LzReceiveAlertInstructionArgs = LzReceiveAlertInstructionArgs;
type index$p_NilifyInstructionAccounts = NilifyInstructionAccounts;
type index$p_NilifyInstructionArgs = NilifyInstructionArgs;
type index$p_RegisterLibraryInstructionAccounts = RegisterLibraryInstructionAccounts;
type index$p_RegisterLibraryInstructionArgs = RegisterLibraryInstructionArgs;
type index$p_RegisterOappInstructionAccounts = RegisterOappInstructionAccounts;
type index$p_RegisterOappInstructionArgs = RegisterOappInstructionArgs;
type index$p_SendComposeInstructionAccounts = SendComposeInstructionAccounts;
type index$p_SendComposeInstructionArgs = SendComposeInstructionArgs;
type index$p_SetDefaultReceiveLibraryInstructionAccounts = SetDefaultReceiveLibraryInstructionAccounts;
type index$p_SetDefaultReceiveLibraryInstructionArgs = SetDefaultReceiveLibraryInstructionArgs;
type index$p_SetDefaultReceiveLibraryTimeoutInstructionAccounts = SetDefaultReceiveLibraryTimeoutInstructionAccounts;
type index$p_SetDefaultReceiveLibraryTimeoutInstructionArgs = SetDefaultReceiveLibraryTimeoutInstructionArgs;
type index$p_SetDefaultSendLibraryInstructionAccounts = SetDefaultSendLibraryInstructionAccounts;
type index$p_SetDefaultSendLibraryInstructionArgs = SetDefaultSendLibraryInstructionArgs;
type index$p_SetDelegateInstructionAccounts = SetDelegateInstructionAccounts;
type index$p_SetDelegateInstructionArgs = SetDelegateInstructionArgs;
type index$p_SetLzTokenInstructionAccounts = SetLzTokenInstructionAccounts;
type index$p_SetLzTokenInstructionArgs = SetLzTokenInstructionArgs;
type index$p_SetReceiveLibraryInstructionAccounts = SetReceiveLibraryInstructionAccounts;
type index$p_SetReceiveLibraryInstructionArgs = SetReceiveLibraryInstructionArgs;
type index$p_SetReceiveLibraryTimeoutInstructionAccounts = SetReceiveLibraryTimeoutInstructionAccounts;
type index$p_SetReceiveLibraryTimeoutInstructionArgs = SetReceiveLibraryTimeoutInstructionArgs;
type index$p_SetSendLibraryInstructionAccounts = SetSendLibraryInstructionAccounts;
type index$p_SetSendLibraryInstructionArgs = SetSendLibraryInstructionArgs;
type index$p_SkipInstructionAccounts = SkipInstructionAccounts;
type index$p_SkipInstructionArgs = SkipInstructionArgs;
declare const index$p_burnInstructionDiscriminator: typeof burnInstructionDiscriminator;
declare const index$p_burnStruct: typeof burnStruct;
declare const index$p_clearComposeInstructionDiscriminator: typeof clearComposeInstructionDiscriminator;
declare const index$p_clearComposeStruct: typeof clearComposeStruct;
declare const index$p_clearInstructionDiscriminator: typeof clearInstructionDiscriminator;
declare const index$p_clearStruct: typeof clearStruct;
declare const index$p_createBurnInstruction: typeof createBurnInstruction;
declare const index$p_createBurnInstructionAccounts: typeof createBurnInstructionAccounts;
declare const index$p_createClearComposeInstruction: typeof createClearComposeInstruction;
declare const index$p_createClearComposeInstructionAccounts: typeof createClearComposeInstructionAccounts;
declare const index$p_createClearInstruction: typeof createClearInstruction;
declare const index$p_createClearInstructionAccounts: typeof createClearInstructionAccounts;
declare const index$p_createInitDefaultReceiveLibraryInstruction: typeof createInitDefaultReceiveLibraryInstruction;
declare const index$p_createInitDefaultReceiveLibraryInstructionAccounts: typeof createInitDefaultReceiveLibraryInstructionAccounts;
declare const index$p_createInitDefaultSendLibraryInstruction: typeof createInitDefaultSendLibraryInstruction;
declare const index$p_createInitDefaultSendLibraryInstructionAccounts: typeof createInitDefaultSendLibraryInstructionAccounts;
declare const index$p_createInitEndpointInstruction: typeof createInitEndpointInstruction;
declare const index$p_createInitEndpointInstructionAccounts: typeof createInitEndpointInstructionAccounts;
declare const index$p_createInitNonceInstruction: typeof createInitNonceInstruction;
declare const index$p_createInitNonceInstructionAccounts: typeof createInitNonceInstructionAccounts;
declare const index$p_createInitReceiveLibraryInstruction: typeof createInitReceiveLibraryInstruction;
declare const index$p_createInitReceiveLibraryInstructionAccounts: typeof createInitReceiveLibraryInstructionAccounts;
declare const index$p_createInitSendLibraryInstruction: typeof createInitSendLibraryInstruction;
declare const index$p_createInitSendLibraryInstructionAccounts: typeof createInitSendLibraryInstructionAccounts;
declare const index$p_createLzComposeAlertInstruction: typeof createLzComposeAlertInstruction;
declare const index$p_createLzComposeAlertInstructionAccounts: typeof createLzComposeAlertInstructionAccounts;
declare const index$p_createLzReceiveAlertInstruction: typeof createLzReceiveAlertInstruction;
declare const index$p_createLzReceiveAlertInstructionAccounts: typeof createLzReceiveAlertInstructionAccounts;
declare const index$p_createNilifyInstruction: typeof createNilifyInstruction;
declare const index$p_createNilifyInstructionAccounts: typeof createNilifyInstructionAccounts;
declare const index$p_createRegisterLibraryInstruction: typeof createRegisterLibraryInstruction;
declare const index$p_createRegisterLibraryInstructionAccounts: typeof createRegisterLibraryInstructionAccounts;
declare const index$p_createRegisterOappInstruction: typeof createRegisterOappInstruction;
declare const index$p_createRegisterOappInstructionAccounts: typeof createRegisterOappInstructionAccounts;
declare const index$p_createSendComposeInstruction: typeof createSendComposeInstruction;
declare const index$p_createSendComposeInstructionAccounts: typeof createSendComposeInstructionAccounts;
declare const index$p_createSetDefaultReceiveLibraryInstruction: typeof createSetDefaultReceiveLibraryInstruction;
declare const index$p_createSetDefaultReceiveLibraryInstructionAccounts: typeof createSetDefaultReceiveLibraryInstructionAccounts;
declare const index$p_createSetDefaultReceiveLibraryTimeoutInstruction: typeof createSetDefaultReceiveLibraryTimeoutInstruction;
declare const index$p_createSetDefaultReceiveLibraryTimeoutInstructionAccounts: typeof createSetDefaultReceiveLibraryTimeoutInstructionAccounts;
declare const index$p_createSetDefaultSendLibraryInstruction: typeof createSetDefaultSendLibraryInstruction;
declare const index$p_createSetDefaultSendLibraryInstructionAccounts: typeof createSetDefaultSendLibraryInstructionAccounts;
declare const index$p_createSetDelegateInstruction: typeof createSetDelegateInstruction;
declare const index$p_createSetDelegateInstructionAccounts: typeof createSetDelegateInstructionAccounts;
declare const index$p_createSetLzTokenInstruction: typeof createSetLzTokenInstruction;
declare const index$p_createSetLzTokenInstructionAccounts: typeof createSetLzTokenInstructionAccounts;
declare const index$p_createSetReceiveLibraryInstruction: typeof createSetReceiveLibraryInstruction;
declare const index$p_createSetReceiveLibraryInstructionAccounts: typeof createSetReceiveLibraryInstructionAccounts;
declare const index$p_createSetReceiveLibraryTimeoutInstruction: typeof createSetReceiveLibraryTimeoutInstruction;
declare const index$p_createSetReceiveLibraryTimeoutInstructionAccounts: typeof createSetReceiveLibraryTimeoutInstructionAccounts;
declare const index$p_createSetSendLibraryInstruction: typeof createSetSendLibraryInstruction;
declare const index$p_createSetSendLibraryInstructionAccounts: typeof createSetSendLibraryInstructionAccounts;
declare const index$p_createSkipInstruction: typeof createSkipInstruction;
declare const index$p_createSkipInstructionAccounts: typeof createSkipInstructionAccounts;
declare const index$p_initDefaultReceiveLibraryInstructionDiscriminator: typeof initDefaultReceiveLibraryInstructionDiscriminator;
declare const index$p_initDefaultReceiveLibraryStruct: typeof initDefaultReceiveLibraryStruct;
declare const index$p_initDefaultSendLibraryInstructionDiscriminator: typeof initDefaultSendLibraryInstructionDiscriminator;
declare const index$p_initDefaultSendLibraryStruct: typeof initDefaultSendLibraryStruct;
declare const index$p_initEndpointInstructionDiscriminator: typeof initEndpointInstructionDiscriminator;
declare const index$p_initEndpointStruct: typeof initEndpointStruct;
declare const index$p_initNonceInstructionDiscriminator: typeof initNonceInstructionDiscriminator;
declare const index$p_initNonceStruct: typeof initNonceStruct;
declare const index$p_initReceiveLibraryInstructionDiscriminator: typeof initReceiveLibraryInstructionDiscriminator;
declare const index$p_initReceiveLibraryStruct: typeof initReceiveLibraryStruct;
declare const index$p_initSendLibraryInstructionDiscriminator: typeof initSendLibraryInstructionDiscriminator;
declare const index$p_initSendLibraryStruct: typeof initSendLibraryStruct;
declare const index$p_lzComposeAlertInstructionDiscriminator: typeof lzComposeAlertInstructionDiscriminator;
declare const index$p_lzComposeAlertStruct: typeof lzComposeAlertStruct;
declare const index$p_lzReceiveAlertInstructionDiscriminator: typeof lzReceiveAlertInstructionDiscriminator;
declare const index$p_lzReceiveAlertStruct: typeof lzReceiveAlertStruct;
declare const index$p_nilifyInstructionDiscriminator: typeof nilifyInstructionDiscriminator;
declare const index$p_nilifyStruct: typeof nilifyStruct;
declare const index$p_registerLibraryInstructionDiscriminator: typeof registerLibraryInstructionDiscriminator;
declare const index$p_registerLibraryStruct: typeof registerLibraryStruct;
declare const index$p_registerOappInstructionDiscriminator: typeof registerOappInstructionDiscriminator;
declare const index$p_registerOappStruct: typeof registerOappStruct;
declare const index$p_sendComposeInstructionDiscriminator: typeof sendComposeInstructionDiscriminator;
declare const index$p_sendComposeStruct: typeof sendComposeStruct;
declare const index$p_setDefaultReceiveLibraryInstructionDiscriminator: typeof setDefaultReceiveLibraryInstructionDiscriminator;
declare const index$p_setDefaultReceiveLibraryStruct: typeof setDefaultReceiveLibraryStruct;
declare const index$p_setDefaultReceiveLibraryTimeoutInstructionDiscriminator: typeof setDefaultReceiveLibraryTimeoutInstructionDiscriminator;
declare const index$p_setDefaultReceiveLibraryTimeoutStruct: typeof setDefaultReceiveLibraryTimeoutStruct;
declare const index$p_setDefaultSendLibraryInstructionDiscriminator: typeof setDefaultSendLibraryInstructionDiscriminator;
declare const index$p_setDefaultSendLibraryStruct: typeof setDefaultSendLibraryStruct;
declare const index$p_setDelegateInstructionDiscriminator: typeof setDelegateInstructionDiscriminator;
declare const index$p_setDelegateStruct: typeof setDelegateStruct;
declare const index$p_setLzTokenInstructionDiscriminator: typeof setLzTokenInstructionDiscriminator;
declare const index$p_setLzTokenStruct: typeof setLzTokenStruct;
declare const index$p_setReceiveLibraryInstructionDiscriminator: typeof setReceiveLibraryInstructionDiscriminator;
declare const index$p_setReceiveLibraryStruct: typeof setReceiveLibraryStruct;
declare const index$p_setReceiveLibraryTimeoutInstructionDiscriminator: typeof setReceiveLibraryTimeoutInstructionDiscriminator;
declare const index$p_setReceiveLibraryTimeoutStruct: typeof setReceiveLibraryTimeoutStruct;
declare const index$p_setSendLibraryInstructionDiscriminator: typeof setSendLibraryInstructionDiscriminator;
declare const index$p_setSendLibraryStruct: typeof setSendLibraryStruct;
declare const index$p_skipInstructionDiscriminator: typeof skipInstructionDiscriminator;
declare const index$p_skipStruct: typeof skipStruct;
declare namespace index$p {
  export { type index$p_BurnInstructionAccounts as BurnInstructionAccounts, type index$p_BurnInstructionArgs as BurnInstructionArgs, type index$p_ClearComposeInstructionAccounts as ClearComposeInstructionAccounts, type index$p_ClearComposeInstructionArgs as ClearComposeInstructionArgs, type index$p_ClearInstructionAccounts as ClearInstructionAccounts, type index$p_ClearInstructionArgs as ClearInstructionArgs, type InitConfigInstructionAccounts$2 as InitConfigInstructionAccounts, type InitConfigInstructionArgs$2 as InitConfigInstructionArgs, type index$p_InitDefaultReceiveLibraryInstructionAccounts as InitDefaultReceiveLibraryInstructionAccounts, type index$p_InitDefaultReceiveLibraryInstructionArgs as InitDefaultReceiveLibraryInstructionArgs, type index$p_InitDefaultSendLibraryInstructionAccounts as InitDefaultSendLibraryInstructionAccounts, type index$p_InitDefaultSendLibraryInstructionArgs as InitDefaultSendLibraryInstructionArgs, type index$p_InitEndpointInstructionAccounts as InitEndpointInstructionAccounts, type index$p_InitEndpointInstructionArgs as InitEndpointInstructionArgs, type index$p_InitNonceInstructionAccounts as InitNonceInstructionAccounts, type index$p_InitNonceInstructionArgs as InitNonceInstructionArgs, type index$p_InitReceiveLibraryInstructionAccounts as InitReceiveLibraryInstructionAccounts, type index$p_InitReceiveLibraryInstructionArgs as InitReceiveLibraryInstructionArgs, type index$p_InitSendLibraryInstructionAccounts as InitSendLibraryInstructionAccounts, type index$p_InitSendLibraryInstructionArgs as InitSendLibraryInstructionArgs, type InitVerifyInstructionAccounts$1 as InitVerifyInstructionAccounts, type InitVerifyInstructionArgs$1 as InitVerifyInstructionArgs, type index$p_LzComposeAlertInstructionAccounts as LzComposeAlertInstructionAccounts, type index$p_LzComposeAlertInstructionArgs as LzComposeAlertInstructionArgs, type index$p_LzReceiveAlertInstructionAccounts as LzReceiveAlertInstructionAccounts, type index$p_LzReceiveAlertInstructionArgs as LzReceiveAlertInstructionArgs, type index$p_NilifyInstructionAccounts as NilifyInstructionAccounts, type index$p_NilifyInstructionArgs as NilifyInstructionArgs, type QuoteInstructionAccounts$2 as QuoteInstructionAccounts, type QuoteInstructionArgs$2 as QuoteInstructionArgs, type index$p_RegisterLibraryInstructionAccounts as RegisterLibraryInstructionAccounts, type index$p_RegisterLibraryInstructionArgs as RegisterLibraryInstructionArgs, type index$p_RegisterOappInstructionAccounts as RegisterOappInstructionAccounts, type index$p_RegisterOappInstructionArgs as RegisterOappInstructionArgs, type index$p_SendComposeInstructionAccounts as SendComposeInstructionAccounts, type index$p_SendComposeInstructionArgs as SendComposeInstructionArgs, type SendInstructionAccounts$2 as SendInstructionAccounts, type SendInstructionArgs$2 as SendInstructionArgs, type SetConfigInstructionAccounts$3 as SetConfigInstructionAccounts, type SetConfigInstructionArgs$3 as SetConfigInstructionArgs, type index$p_SetDefaultReceiveLibraryInstructionAccounts as SetDefaultReceiveLibraryInstructionAccounts, type index$p_SetDefaultReceiveLibraryInstructionArgs as SetDefaultReceiveLibraryInstructionArgs, type index$p_SetDefaultReceiveLibraryTimeoutInstructionAccounts as SetDefaultReceiveLibraryTimeoutInstructionAccounts, type index$p_SetDefaultReceiveLibraryTimeoutInstructionArgs as SetDefaultReceiveLibraryTimeoutInstructionArgs, type index$p_SetDefaultSendLibraryInstructionAccounts as SetDefaultSendLibraryInstructionAccounts, type index$p_SetDefaultSendLibraryInstructionArgs as SetDefaultSendLibraryInstructionArgs, type index$p_SetDelegateInstructionAccounts as SetDelegateInstructionAccounts, type index$p_SetDelegateInstructionArgs as SetDelegateInstructionArgs, type index$p_SetLzTokenInstructionAccounts as SetLzTokenInstructionAccounts, type index$p_SetLzTokenInstructionArgs as SetLzTokenInstructionArgs, type index$p_SetReceiveLibraryInstructionAccounts as SetReceiveLibraryInstructionAccounts, type index$p_SetReceiveLibraryInstructionArgs as SetReceiveLibraryInstructionArgs, type index$p_SetReceiveLibraryTimeoutInstructionAccounts as SetReceiveLibraryTimeoutInstructionAccounts, type index$p_SetReceiveLibraryTimeoutInstructionArgs as SetReceiveLibraryTimeoutInstructionArgs, type index$p_SetSendLibraryInstructionAccounts as SetSendLibraryInstructionAccounts, type index$p_SetSendLibraryInstructionArgs as SetSendLibraryInstructionArgs, type index$p_SkipInstructionAccounts as SkipInstructionAccounts, type index$p_SkipInstructionArgs as SkipInstructionArgs, type TransferAdminInstructionAccounts$3 as TransferAdminInstructionAccounts, type TransferAdminInstructionArgs$3 as TransferAdminInstructionArgs, type VerifyInstructionAccounts$1 as VerifyInstructionAccounts, type VerifyInstructionArgs$1 as VerifyInstructionArgs, type WithdrawRentInstructionAccounts$1 as WithdrawRentInstructionAccounts, type WithdrawRentInstructionArgs$1 as WithdrawRentInstructionArgs, index$p_burnInstructionDiscriminator as burnInstructionDiscriminator, index$p_burnStruct as burnStruct, index$p_clearComposeInstructionDiscriminator as clearComposeInstructionDiscriminator, index$p_clearComposeStruct as clearComposeStruct, index$p_clearInstructionDiscriminator as clearInstructionDiscriminator, index$p_clearStruct as clearStruct, index$p_createBurnInstruction as createBurnInstruction, index$p_createBurnInstructionAccounts as createBurnInstructionAccounts, index$p_createClearComposeInstruction as createClearComposeInstruction, index$p_createClearComposeInstructionAccounts as createClearComposeInstructionAccounts, index$p_createClearInstruction as createClearInstruction, index$p_createClearInstructionAccounts as createClearInstructionAccounts, createInitConfigInstruction$2 as createInitConfigInstruction, createInitConfigInstructionAccounts$2 as createInitConfigInstructionAccounts, index$p_createInitDefaultReceiveLibraryInstruction as createInitDefaultReceiveLibraryInstruction, index$p_createInitDefaultReceiveLibraryInstructionAccounts as createInitDefaultReceiveLibraryInstructionAccounts, index$p_createInitDefaultSendLibraryInstruction as createInitDefaultSendLibraryInstruction, index$p_createInitDefaultSendLibraryInstructionAccounts as createInitDefaultSendLibraryInstructionAccounts, index$p_createInitEndpointInstruction as createInitEndpointInstruction, index$p_createInitEndpointInstructionAccounts as createInitEndpointInstructionAccounts, index$p_createInitNonceInstruction as createInitNonceInstruction, index$p_createInitNonceInstructionAccounts as createInitNonceInstructionAccounts, index$p_createInitReceiveLibraryInstruction as createInitReceiveLibraryInstruction, index$p_createInitReceiveLibraryInstructionAccounts as createInitReceiveLibraryInstructionAccounts, index$p_createInitSendLibraryInstruction as createInitSendLibraryInstruction, index$p_createInitSendLibraryInstructionAccounts as createInitSendLibraryInstructionAccounts, createInitVerifyInstruction$1 as createInitVerifyInstruction, createInitVerifyInstructionAccounts$1 as createInitVerifyInstructionAccounts, index$p_createLzComposeAlertInstruction as createLzComposeAlertInstruction, index$p_createLzComposeAlertInstructionAccounts as createLzComposeAlertInstructionAccounts, index$p_createLzReceiveAlertInstruction as createLzReceiveAlertInstruction, index$p_createLzReceiveAlertInstructionAccounts as createLzReceiveAlertInstructionAccounts, index$p_createNilifyInstruction as createNilifyInstruction, index$p_createNilifyInstructionAccounts as createNilifyInstructionAccounts, createQuoteInstruction$2 as createQuoteInstruction, createQuoteInstructionAccounts$2 as createQuoteInstructionAccounts, index$p_createRegisterLibraryInstruction as createRegisterLibraryInstruction, index$p_createRegisterLibraryInstructionAccounts as createRegisterLibraryInstructionAccounts, index$p_createRegisterOappInstruction as createRegisterOappInstruction, index$p_createRegisterOappInstructionAccounts as createRegisterOappInstructionAccounts, index$p_createSendComposeInstruction as createSendComposeInstruction, index$p_createSendComposeInstructionAccounts as createSendComposeInstructionAccounts, createSendInstruction$2 as createSendInstruction, createSendInstructionAccounts$2 as createSendInstructionAccounts, createSetConfigInstruction$3 as createSetConfigInstruction, createSetConfigInstructionAccounts$3 as createSetConfigInstructionAccounts, index$p_createSetDefaultReceiveLibraryInstruction as createSetDefaultReceiveLibraryInstruction, index$p_createSetDefaultReceiveLibraryInstructionAccounts as createSetDefaultReceiveLibraryInstructionAccounts, index$p_createSetDefaultReceiveLibraryTimeoutInstruction as createSetDefaultReceiveLibraryTimeoutInstruction, index$p_createSetDefaultReceiveLibraryTimeoutInstructionAccounts as createSetDefaultReceiveLibraryTimeoutInstructionAccounts, index$p_createSetDefaultSendLibraryInstruction as createSetDefaultSendLibraryInstruction, index$p_createSetDefaultSendLibraryInstructionAccounts as createSetDefaultSendLibraryInstructionAccounts, index$p_createSetDelegateInstruction as createSetDelegateInstruction, index$p_createSetDelegateInstructionAccounts as createSetDelegateInstructionAccounts, index$p_createSetLzTokenInstruction as createSetLzTokenInstruction, index$p_createSetLzTokenInstructionAccounts as createSetLzTokenInstructionAccounts, index$p_createSetReceiveLibraryInstruction as createSetReceiveLibraryInstruction, index$p_createSetReceiveLibraryInstructionAccounts as createSetReceiveLibraryInstructionAccounts, index$p_createSetReceiveLibraryTimeoutInstruction as createSetReceiveLibraryTimeoutInstruction, index$p_createSetReceiveLibraryTimeoutInstructionAccounts as createSetReceiveLibraryTimeoutInstructionAccounts, index$p_createSetSendLibraryInstruction as createSetSendLibraryInstruction, index$p_createSetSendLibraryInstructionAccounts as createSetSendLibraryInstructionAccounts, index$p_createSkipInstruction as createSkipInstruction, index$p_createSkipInstructionAccounts as createSkipInstructionAccounts, createTransferAdminInstruction$3 as createTransferAdminInstruction, createTransferAdminInstructionAccounts$3 as createTransferAdminInstructionAccounts, createVerifyInstruction$1 as createVerifyInstruction, createVerifyInstructionAccounts$1 as createVerifyInstructionAccounts, createWithdrawRentInstruction$1 as createWithdrawRentInstruction, createWithdrawRentInstructionAccounts$1 as createWithdrawRentInstructionAccounts, initConfigInstructionDiscriminator$2 as initConfigInstructionDiscriminator, initConfigStruct$2 as initConfigStruct, index$p_initDefaultReceiveLibraryInstructionDiscriminator as initDefaultReceiveLibraryInstructionDiscriminator, index$p_initDefaultReceiveLibraryStruct as initDefaultReceiveLibraryStruct, index$p_initDefaultSendLibraryInstructionDiscriminator as initDefaultSendLibraryInstructionDiscriminator, index$p_initDefaultSendLibraryStruct as initDefaultSendLibraryStruct, index$p_initEndpointInstructionDiscriminator as initEndpointInstructionDiscriminator, index$p_initEndpointStruct as initEndpointStruct, index$p_initNonceInstructionDiscriminator as initNonceInstructionDiscriminator, index$p_initNonceStruct as initNonceStruct, index$p_initReceiveLibraryInstructionDiscriminator as initReceiveLibraryInstructionDiscriminator, index$p_initReceiveLibraryStruct as initReceiveLibraryStruct, index$p_initSendLibraryInstructionDiscriminator as initSendLibraryInstructionDiscriminator, index$p_initSendLibraryStruct as initSendLibraryStruct, initVerifyInstructionDiscriminator$1 as initVerifyInstructionDiscriminator, initVerifyStruct$1 as initVerifyStruct, index$p_lzComposeAlertInstructionDiscriminator as lzComposeAlertInstructionDiscriminator, index$p_lzComposeAlertStruct as lzComposeAlertStruct, index$p_lzReceiveAlertInstructionDiscriminator as lzReceiveAlertInstructionDiscriminator, index$p_lzReceiveAlertStruct as lzReceiveAlertStruct, index$p_nilifyInstructionDiscriminator as nilifyInstructionDiscriminator, index$p_nilifyStruct as nilifyStruct, quoteInstructionDiscriminator$2 as quoteInstructionDiscriminator, quoteStruct$2 as quoteStruct, index$p_registerLibraryInstructionDiscriminator as registerLibraryInstructionDiscriminator, index$p_registerLibraryStruct as registerLibraryStruct, index$p_registerOappInstructionDiscriminator as registerOappInstructionDiscriminator, index$p_registerOappStruct as registerOappStruct, index$p_sendComposeInstructionDiscriminator as sendComposeInstructionDiscriminator, index$p_sendComposeStruct as sendComposeStruct, sendInstructionDiscriminator$2 as sendInstructionDiscriminator, sendStruct$2 as sendStruct, setConfigInstructionDiscriminator$3 as setConfigInstructionDiscriminator, setConfigStruct$3 as setConfigStruct, index$p_setDefaultReceiveLibraryInstructionDiscriminator as setDefaultReceiveLibraryInstructionDiscriminator, index$p_setDefaultReceiveLibraryStruct as setDefaultReceiveLibraryStruct, index$p_setDefaultReceiveLibraryTimeoutInstructionDiscriminator as setDefaultReceiveLibraryTimeoutInstructionDiscriminator, index$p_setDefaultReceiveLibraryTimeoutStruct as setDefaultReceiveLibraryTimeoutStruct, index$p_setDefaultSendLibraryInstructionDiscriminator as setDefaultSendLibraryInstructionDiscriminator, index$p_setDefaultSendLibraryStruct as setDefaultSendLibraryStruct, index$p_setDelegateInstructionDiscriminator as setDelegateInstructionDiscriminator, index$p_setDelegateStruct as setDelegateStruct, index$p_setLzTokenInstructionDiscriminator as setLzTokenInstructionDiscriminator, index$p_setLzTokenStruct as setLzTokenStruct, index$p_setReceiveLibraryInstructionDiscriminator as setReceiveLibraryInstructionDiscriminator, index$p_setReceiveLibraryStruct as setReceiveLibraryStruct, index$p_setReceiveLibraryTimeoutInstructionDiscriminator as setReceiveLibraryTimeoutInstructionDiscriminator, index$p_setReceiveLibraryTimeoutStruct as setReceiveLibraryTimeoutStruct, index$p_setSendLibraryInstructionDiscriminator as setSendLibraryInstructionDiscriminator, index$p_setSendLibraryStruct as setSendLibraryStruct, index$p_skipInstructionDiscriminator as skipInstructionDiscriminator, index$p_skipStruct as skipStruct, transferAdminInstructionDiscriminator$3 as transferAdminInstructionDiscriminator, transferAdminStruct$3 as transferAdminStruct, verifyInstructionDiscriminator$1 as verifyInstructionDiscriminator, verifyStruct$1 as verifyStruct, withdrawRentInstructionDiscriminator$1 as withdrawRentInstructionDiscriminator, withdrawRentStruct$1 as withdrawRentStruct };
}

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type MessagingFee$2 = {
    nativeFee: beet.bignum;
    lzTokenFee: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const messagingFeeBeet$2: beet.BeetArgsStruct<MessagingFee$2>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type MessagingReceipt = {
    guid: number[];
    nonce: beet.bignum;
    fee: MessagingFee$2;
};
/**
 * @category userTypes
 * @category generated
 */
declare const messagingReceiptBeet: beet.BeetArgsStruct<MessagingReceipt>;

type index$o_BurnParams = BurnParams;
type index$o_ClearComposeParams = ClearComposeParams;
type index$o_ClearParams = ClearParams;
type index$o_InitDefaultReceiveLibraryParams = InitDefaultReceiveLibraryParams;
type index$o_InitDefaultSendLibraryParams = InitDefaultSendLibraryParams;
type index$o_InitEndpointParams = InitEndpointParams;
type index$o_InitNonceParams = InitNonceParams;
type index$o_InitReceiveLibraryParams = InitReceiveLibraryParams;
type index$o_InitSendLibraryParams = InitSendLibraryParams;
type index$o_LzComposeAlertParams = LzComposeAlertParams;
type index$o_LzReceiveAlertParams = LzReceiveAlertParams;
type index$o_MessageLibType = MessageLibType;
declare const index$o_MessageLibType: typeof MessageLibType;
type index$o_MessagingReceipt = MessagingReceipt;
type index$o_NilifyParams = NilifyParams;
type index$o_ReceiveLibraryTimeout = ReceiveLibraryTimeout;
type index$o_RegisterLibraryParams = RegisterLibraryParams;
type index$o_RegisterOAppParams = RegisterOAppParams;
type index$o_SendComposeParams = SendComposeParams;
type index$o_SetDefaultReceiveLibraryParams = SetDefaultReceiveLibraryParams;
type index$o_SetDefaultReceiveLibraryTimeoutParams = SetDefaultReceiveLibraryTimeoutParams;
type index$o_SetDefaultSendLibraryParams = SetDefaultSendLibraryParams;
type index$o_SetDelegateParams = SetDelegateParams;
type index$o_SetLzTokenParams = SetLzTokenParams;
type index$o_SetReceiveLibraryParams = SetReceiveLibraryParams;
type index$o_SetReceiveLibraryTimeoutParams = SetReceiveLibraryTimeoutParams;
type index$o_SetSendLibraryParams = SetSendLibraryParams;
type index$o_SkipParams = SkipParams;
declare const index$o_burnParamsBeet: typeof burnParamsBeet;
declare const index$o_clearComposeParamsBeet: typeof clearComposeParamsBeet;
declare const index$o_clearParamsBeet: typeof clearParamsBeet;
declare const index$o_initDefaultReceiveLibraryParamsBeet: typeof initDefaultReceiveLibraryParamsBeet;
declare const index$o_initDefaultSendLibraryParamsBeet: typeof initDefaultSendLibraryParamsBeet;
declare const index$o_initEndpointParamsBeet: typeof initEndpointParamsBeet;
declare const index$o_initNonceParamsBeet: typeof initNonceParamsBeet;
declare const index$o_initReceiveLibraryParamsBeet: typeof initReceiveLibraryParamsBeet;
declare const index$o_initSendLibraryParamsBeet: typeof initSendLibraryParamsBeet;
declare const index$o_lzComposeAlertParamsBeet: typeof lzComposeAlertParamsBeet;
declare const index$o_lzReceiveAlertParamsBeet: typeof lzReceiveAlertParamsBeet;
declare const index$o_messageLibTypeBeet: typeof messageLibTypeBeet;
declare const index$o_messagingReceiptBeet: typeof messagingReceiptBeet;
declare const index$o_nilifyParamsBeet: typeof nilifyParamsBeet;
declare const index$o_receiveLibraryTimeoutBeet: typeof receiveLibraryTimeoutBeet;
declare const index$o_registerLibraryParamsBeet: typeof registerLibraryParamsBeet;
declare const index$o_registerOAppParamsBeet: typeof registerOAppParamsBeet;
declare const index$o_sendComposeParamsBeet: typeof sendComposeParamsBeet;
declare const index$o_setDefaultReceiveLibraryParamsBeet: typeof setDefaultReceiveLibraryParamsBeet;
declare const index$o_setDefaultReceiveLibraryTimeoutParamsBeet: typeof setDefaultReceiveLibraryTimeoutParamsBeet;
declare const index$o_setDefaultSendLibraryParamsBeet: typeof setDefaultSendLibraryParamsBeet;
declare const index$o_setDelegateParamsBeet: typeof setDelegateParamsBeet;
declare const index$o_setLzTokenParamsBeet: typeof setLzTokenParamsBeet;
declare const index$o_setReceiveLibraryParamsBeet: typeof setReceiveLibraryParamsBeet;
declare const index$o_setReceiveLibraryTimeoutParamsBeet: typeof setReceiveLibraryTimeoutParamsBeet;
declare const index$o_setSendLibraryParamsBeet: typeof setSendLibraryParamsBeet;
declare const index$o_skipParamsBeet: typeof skipParamsBeet;
declare namespace index$o {
  export { type index$o_BurnParams as BurnParams, type index$o_ClearComposeParams as ClearComposeParams, type index$o_ClearParams as ClearParams, type InitConfigParams$2 as InitConfigParams, type index$o_InitDefaultReceiveLibraryParams as InitDefaultReceiveLibraryParams, type index$o_InitDefaultSendLibraryParams as InitDefaultSendLibraryParams, type index$o_InitEndpointParams as InitEndpointParams, type index$o_InitNonceParams as InitNonceParams, type index$o_InitReceiveLibraryParams as InitReceiveLibraryParams, type index$o_InitSendLibraryParams as InitSendLibraryParams, type InitVerifyParams$1 as InitVerifyParams, type index$o_LzComposeAlertParams as LzComposeAlertParams, type index$o_LzReceiveAlertParams as LzReceiveAlertParams, index$o_MessageLibType as MessageLibType, type MessagingFee$2 as MessagingFee, type index$o_MessagingReceipt as MessagingReceipt, type index$o_NilifyParams as NilifyParams, type QuoteParams$2 as QuoteParams, type index$o_ReceiveLibraryTimeout as ReceiveLibraryTimeout, type index$o_RegisterLibraryParams as RegisterLibraryParams, type index$o_RegisterOAppParams as RegisterOAppParams, type index$o_SendComposeParams as SendComposeParams, type SendParams$2 as SendParams, type SetConfigParams$3 as SetConfigParams, type index$o_SetDefaultReceiveLibraryParams as SetDefaultReceiveLibraryParams, type index$o_SetDefaultReceiveLibraryTimeoutParams as SetDefaultReceiveLibraryTimeoutParams, type index$o_SetDefaultSendLibraryParams as SetDefaultSendLibraryParams, type index$o_SetDelegateParams as SetDelegateParams, type index$o_SetLzTokenParams as SetLzTokenParams, type index$o_SetReceiveLibraryParams as SetReceiveLibraryParams, type index$o_SetReceiveLibraryTimeoutParams as SetReceiveLibraryTimeoutParams, type index$o_SetSendLibraryParams as SetSendLibraryParams, type index$o_SkipParams as SkipParams, type TransferAdminParams$3 as TransferAdminParams, type VerifyParams$1 as VerifyParams, type WithdrawRentParams$1 as WithdrawRentParams, index$o_burnParamsBeet as burnParamsBeet, index$o_clearComposeParamsBeet as clearComposeParamsBeet, index$o_clearParamsBeet as clearParamsBeet, initConfigParamsBeet$2 as initConfigParamsBeet, index$o_initDefaultReceiveLibraryParamsBeet as initDefaultReceiveLibraryParamsBeet, index$o_initDefaultSendLibraryParamsBeet as initDefaultSendLibraryParamsBeet, index$o_initEndpointParamsBeet as initEndpointParamsBeet, index$o_initNonceParamsBeet as initNonceParamsBeet, index$o_initReceiveLibraryParamsBeet as initReceiveLibraryParamsBeet, index$o_initSendLibraryParamsBeet as initSendLibraryParamsBeet, initVerifyParamsBeet$1 as initVerifyParamsBeet, index$o_lzComposeAlertParamsBeet as lzComposeAlertParamsBeet, index$o_lzReceiveAlertParamsBeet as lzReceiveAlertParamsBeet, index$o_messageLibTypeBeet as messageLibTypeBeet, messagingFeeBeet$2 as messagingFeeBeet, index$o_messagingReceiptBeet as messagingReceiptBeet, index$o_nilifyParamsBeet as nilifyParamsBeet, quoteParamsBeet$2 as quoteParamsBeet, index$o_receiveLibraryTimeoutBeet as receiveLibraryTimeoutBeet, index$o_registerLibraryParamsBeet as registerLibraryParamsBeet, index$o_registerOAppParamsBeet as registerOAppParamsBeet, index$o_sendComposeParamsBeet as sendComposeParamsBeet, sendParamsBeet$2 as sendParamsBeet, setConfigParamsBeet$3 as setConfigParamsBeet, index$o_setDefaultReceiveLibraryParamsBeet as setDefaultReceiveLibraryParamsBeet, index$o_setDefaultReceiveLibraryTimeoutParamsBeet as setDefaultReceiveLibraryTimeoutParamsBeet, index$o_setDefaultSendLibraryParamsBeet as setDefaultSendLibraryParamsBeet, index$o_setDelegateParamsBeet as setDelegateParamsBeet, index$o_setLzTokenParamsBeet as setLzTokenParamsBeet, index$o_setReceiveLibraryParamsBeet as setReceiveLibraryParamsBeet, index$o_setReceiveLibraryTimeoutParamsBeet as setReceiveLibraryTimeoutParamsBeet, index$o_setSendLibraryParamsBeet as setSendLibraryParamsBeet, index$o_skipParamsBeet as skipParamsBeet, transferAdminParamsBeet$3 as transferAdminParamsBeet, verifyParamsBeet$1 as verifyParamsBeet, withdrawRentParamsBeet$1 as withdrawRentParamsBeet };
}

/**
 * Program public key
 *
 * @category constants
 * @category generated
 */
declare const PROGRAM_ID$6: PublicKey;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type AdminTransferredEvent$1 = {
    newAdmin: web3.PublicKey;
};
/**
 * @category userTypes
 * @category generated
 */
declare const adminTransferredEventBeet$1: beet.BeetArgsStruct<AdminTransferredEvent$1>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type ComposeDeliveredEvent = {
    from: web3.PublicKey;
    to: web3.PublicKey;
    guid: number[];
    index: number;
};
/**
 * @category userTypes
 * @category generated
 */
declare const composeDeliveredEventBeet: beet.BeetArgsStruct<ComposeDeliveredEvent>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type ComposeSentEvent = {
    from: web3.PublicKey;
    to: web3.PublicKey;
    guid: number[];
    index: number;
    message: Uint8Array;
};
/**
 * @category userTypes
 * @category generated
 */
declare const composeSentEventBeet: beet.FixableBeetArgsStruct<ComposeSentEvent>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type DefaultReceiveLibrarySetEvent = {
    eid: number;
    newLib: web3.PublicKey;
};
/**
 * @category userTypes
 * @category generated
 */
declare const defaultReceiveLibrarySetEventBeet: beet.BeetArgsStruct<DefaultReceiveLibrarySetEvent>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type DefaultReceiveLibraryTimeoutSetEvent = {
    eid: number;
    timeout: beet.COption<ReceiveLibraryTimeout>;
};
/**
 * @category userTypes
 * @category generated
 */
declare const defaultReceiveLibraryTimeoutSetEventBeet: beet.FixableBeetArgsStruct<DefaultReceiveLibraryTimeoutSetEvent>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type DefaultSendLibrarySetEvent = {
    eid: number;
    newLib: web3.PublicKey;
};
/**
 * @category userTypes
 * @category generated
 */
declare const defaultSendLibrarySetEventBeet: beet.BeetArgsStruct<DefaultSendLibrarySetEvent>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type DelegateSetEvent = {
    newDelegate: web3.PublicKey;
};
/**
 * @category userTypes
 * @category generated
 */
declare const delegateSetEventBeet: beet.BeetArgsStruct<DelegateSetEvent>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type InboundNonceSkippedEvent = {
    srcEid: number;
    sender: number[];
    receiver: web3.PublicKey;
    nonce: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const inboundNonceSkippedEventBeet: beet.BeetArgsStruct<InboundNonceSkippedEvent>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type LibraryRegisteredEvent = {
    newLib: web3.PublicKey;
    newLibProgram: web3.PublicKey;
};
/**
 * @category userTypes
 * @category generated
 */
declare const libraryRegisteredEventBeet: beet.BeetArgsStruct<LibraryRegisteredEvent>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type LzComposeAlertEvent = {
    executor: web3.PublicKey;
    from: web3.PublicKey;
    to: web3.PublicKey;
    guid: number[];
    index: number;
    computeUnits: beet.bignum;
    value: beet.bignum;
    message: Uint8Array;
    extraData: Uint8Array;
    reason: Uint8Array;
};
/**
 * @category userTypes
 * @category generated
 */
declare const lzComposeAlertEventBeet: beet.FixableBeetArgsStruct<LzComposeAlertEvent>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type LzReceiveAlertEvent = {
    receiver: web3.PublicKey;
    executor: web3.PublicKey;
    srcEid: number;
    sender: number[];
    nonce: beet.bignum;
    guid: number[];
    computeUnits: beet.bignum;
    value: beet.bignum;
    message: Uint8Array;
    extraData: Uint8Array;
    reason: Uint8Array;
};
/**
 * @category userTypes
 * @category generated
 */
declare const lzReceiveAlertEventBeet: beet.FixableBeetArgsStruct<LzReceiveAlertEvent>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type LzTokenSetEvent = {
    token: beet.COption<web3.PublicKey>;
};
/**
 * @category userTypes
 * @category generated
 */
declare const lzTokenSetEventBeet: beet.FixableBeetArgsStruct<LzTokenSetEvent>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type OAppRegisteredEvent = {
    oapp: web3.PublicKey;
    delegate: web3.PublicKey;
};
/**
 * @category userTypes
 * @category generated
 */
declare const oAppRegisteredEventBeet: beet.BeetArgsStruct<OAppRegisteredEvent>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type PacketBurntEvent = {
    srcEid: number;
    sender: number[];
    receiver: web3.PublicKey;
    nonce: beet.bignum;
    payloadHash: number[];
};
/**
 * @category userTypes
 * @category generated
 */
declare const packetBurntEventBeet: beet.BeetArgsStruct<PacketBurntEvent>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type PacketDeliveredEvent = {
    srcEid: number;
    sender: number[];
    receiver: web3.PublicKey;
    nonce: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const packetDeliveredEventBeet: beet.BeetArgsStruct<PacketDeliveredEvent>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type PacketNilifiedEvent = {
    srcEid: number;
    sender: number[];
    receiver: web3.PublicKey;
    nonce: beet.bignum;
    payloadHash: number[];
};
/**
 * @category userTypes
 * @category generated
 */
declare const packetNilifiedEventBeet: beet.BeetArgsStruct<PacketNilifiedEvent>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type PacketSentEvent = {
    encodedPacket: Uint8Array;
    options: Uint8Array;
    sendLibrary: web3.PublicKey;
};
/**
 * @category userTypes
 * @category generated
 */
declare const packetSentEventBeet: beet.FixableBeetArgsStruct<PacketSentEvent>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type PacketVerifiedEvent = {
    srcEid: number;
    sender: number[];
    receiver: web3.PublicKey;
    nonce: beet.bignum;
    payloadHash: number[];
};
/**
 * @category userTypes
 * @category generated
 */
declare const packetVerifiedEventBeet: beet.BeetArgsStruct<PacketVerifiedEvent>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type ReceiveLibrarySetEvent = {
    receiver: web3.PublicKey;
    eid: number;
    newLib: web3.PublicKey;
};
/**
 * @category userTypes
 * @category generated
 */
declare const receiveLibrarySetEventBeet: beet.BeetArgsStruct<ReceiveLibrarySetEvent>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type ReceiveLibraryTimeoutSetEvent = {
    receiver: web3.PublicKey;
    eid: number;
    timeout: beet.COption<ReceiveLibraryTimeout>;
};
/**
 * @category userTypes
 * @category generated
 */
declare const receiveLibraryTimeoutSetEventBeet: beet.FixableBeetArgsStruct<ReceiveLibraryTimeoutSetEvent>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type RentWithdrawnEvent$1 = {
    receiver: web3.PublicKey;
    amount: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const rentWithdrawnEventBeet$1: beet.BeetArgsStruct<RentWithdrawnEvent$1>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type SendLibrarySetEvent = {
    sender: web3.PublicKey;
    eid: number;
    newLib: web3.PublicKey;
};
/**
 * @category userTypes
 * @category generated
 */
declare const sendLibrarySetEventBeet: beet.BeetArgsStruct<SendLibrarySetEvent>;

type index$n_ComposeDeliveredEvent = ComposeDeliveredEvent;
type index$n_ComposeSentEvent = ComposeSentEvent;
type index$n_DefaultReceiveLibrarySetEvent = DefaultReceiveLibrarySetEvent;
type index$n_DefaultReceiveLibraryTimeoutSetEvent = DefaultReceiveLibraryTimeoutSetEvent;
type index$n_DefaultSendLibrarySetEvent = DefaultSendLibrarySetEvent;
type index$n_DelegateSetEvent = DelegateSetEvent;
type index$n_InboundNonceSkippedEvent = InboundNonceSkippedEvent;
type index$n_LibraryRegisteredEvent = LibraryRegisteredEvent;
type index$n_LzComposeAlertEvent = LzComposeAlertEvent;
type index$n_LzReceiveAlertEvent = LzReceiveAlertEvent;
type index$n_LzTokenSetEvent = LzTokenSetEvent;
type index$n_OAppRegisteredEvent = OAppRegisteredEvent;
type index$n_PacketBurntEvent = PacketBurntEvent;
type index$n_PacketDeliveredEvent = PacketDeliveredEvent;
type index$n_PacketNilifiedEvent = PacketNilifiedEvent;
type index$n_PacketSentEvent = PacketSentEvent;
type index$n_PacketVerifiedEvent = PacketVerifiedEvent;
type index$n_ReceiveLibrarySetEvent = ReceiveLibrarySetEvent;
type index$n_ReceiveLibraryTimeoutSetEvent = ReceiveLibraryTimeoutSetEvent;
type index$n_SendLibrarySetEvent = SendLibrarySetEvent;
declare const index$n_composeDeliveredEventBeet: typeof composeDeliveredEventBeet;
declare const index$n_composeSentEventBeet: typeof composeSentEventBeet;
declare const index$n_defaultReceiveLibrarySetEventBeet: typeof defaultReceiveLibrarySetEventBeet;
declare const index$n_defaultReceiveLibraryTimeoutSetEventBeet: typeof defaultReceiveLibraryTimeoutSetEventBeet;
declare const index$n_defaultSendLibrarySetEventBeet: typeof defaultSendLibrarySetEventBeet;
declare const index$n_delegateSetEventBeet: typeof delegateSetEventBeet;
declare const index$n_inboundNonceSkippedEventBeet: typeof inboundNonceSkippedEventBeet;
declare const index$n_libraryRegisteredEventBeet: typeof libraryRegisteredEventBeet;
declare const index$n_lzComposeAlertEventBeet: typeof lzComposeAlertEventBeet;
declare const index$n_lzReceiveAlertEventBeet: typeof lzReceiveAlertEventBeet;
declare const index$n_lzTokenSetEventBeet: typeof lzTokenSetEventBeet;
declare const index$n_oAppRegisteredEventBeet: typeof oAppRegisteredEventBeet;
declare const index$n_packetBurntEventBeet: typeof packetBurntEventBeet;
declare const index$n_packetDeliveredEventBeet: typeof packetDeliveredEventBeet;
declare const index$n_packetNilifiedEventBeet: typeof packetNilifiedEventBeet;
declare const index$n_packetSentEventBeet: typeof packetSentEventBeet;
declare const index$n_packetVerifiedEventBeet: typeof packetVerifiedEventBeet;
declare const index$n_receiveLibrarySetEventBeet: typeof receiveLibrarySetEventBeet;
declare const index$n_receiveLibraryTimeoutSetEventBeet: typeof receiveLibraryTimeoutSetEventBeet;
declare const index$n_sendLibrarySetEventBeet: typeof sendLibrarySetEventBeet;
declare namespace index$n {
  export { type AdminTransferredEvent$1 as AdminTransferredEvent, type index$n_ComposeDeliveredEvent as ComposeDeliveredEvent, type index$n_ComposeSentEvent as ComposeSentEvent, type index$n_DefaultReceiveLibrarySetEvent as DefaultReceiveLibrarySetEvent, type index$n_DefaultReceiveLibraryTimeoutSetEvent as DefaultReceiveLibraryTimeoutSetEvent, type index$n_DefaultSendLibrarySetEvent as DefaultSendLibrarySetEvent, type index$n_DelegateSetEvent as DelegateSetEvent, type index$n_InboundNonceSkippedEvent as InboundNonceSkippedEvent, type index$n_LibraryRegisteredEvent as LibraryRegisteredEvent, type index$n_LzComposeAlertEvent as LzComposeAlertEvent, type index$n_LzReceiveAlertEvent as LzReceiveAlertEvent, type index$n_LzTokenSetEvent as LzTokenSetEvent, type index$n_OAppRegisteredEvent as OAppRegisteredEvent, type index$n_PacketBurntEvent as PacketBurntEvent, type index$n_PacketDeliveredEvent as PacketDeliveredEvent, type index$n_PacketNilifiedEvent as PacketNilifiedEvent, type index$n_PacketSentEvent as PacketSentEvent, type index$n_PacketVerifiedEvent as PacketVerifiedEvent, type index$n_ReceiveLibrarySetEvent as ReceiveLibrarySetEvent, type index$n_ReceiveLibraryTimeoutSetEvent as ReceiveLibraryTimeoutSetEvent, type RentWithdrawnEvent$1 as RentWithdrawnEvent, type index$n_SendLibrarySetEvent as SendLibrarySetEvent, adminTransferredEventBeet$1 as adminTransferredEventBeet, index$n_composeDeliveredEventBeet as composeDeliveredEventBeet, index$n_composeSentEventBeet as composeSentEventBeet, index$n_defaultReceiveLibrarySetEventBeet as defaultReceiveLibrarySetEventBeet, index$n_defaultReceiveLibraryTimeoutSetEventBeet as defaultReceiveLibraryTimeoutSetEventBeet, index$n_defaultSendLibrarySetEventBeet as defaultSendLibrarySetEventBeet, index$n_delegateSetEventBeet as delegateSetEventBeet, index$n_inboundNonceSkippedEventBeet as inboundNonceSkippedEventBeet, index$n_libraryRegisteredEventBeet as libraryRegisteredEventBeet, index$n_lzComposeAlertEventBeet as lzComposeAlertEventBeet, index$n_lzReceiveAlertEventBeet as lzReceiveAlertEventBeet, index$n_lzTokenSetEventBeet as lzTokenSetEventBeet, index$n_oAppRegisteredEventBeet as oAppRegisteredEventBeet, index$n_packetBurntEventBeet as packetBurntEventBeet, index$n_packetDeliveredEventBeet as packetDeliveredEventBeet, index$n_packetNilifiedEventBeet as packetNilifiedEventBeet, index$n_packetSentEventBeet as packetSentEventBeet, index$n_packetVerifiedEventBeet as packetVerifiedEventBeet, index$n_receiveLibrarySetEventBeet as receiveLibrarySetEventBeet, index$n_receiveLibraryTimeoutSetEventBeet as receiveLibraryTimeoutSetEventBeet, rentWithdrawnEventBeet$1 as rentWithdrawnEventBeet, index$n_sendLibrarySetEventBeet as sendLibrarySetEventBeet };
}

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * Arguments used to create {@link MessageLib}
 * @category Accounts
 * @category generated
 */
type MessageLibArgs = {
    eid: number;
    endpoint: web3.PublicKey;
    endpointProgram: web3.PublicKey;
    bump: number;
    admin: web3.PublicKey;
    fee: beet.bignum;
    lzTokenFee: beet.bignum;
    wlCaller: web3.PublicKey;
};
declare const messageLibDiscriminator: number[];
/**
 * Holds the data for the {@link MessageLib} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
declare class MessageLib implements MessageLibArgs {
    readonly eid: number;
    readonly endpoint: web3.PublicKey;
    readonly endpointProgram: web3.PublicKey;
    readonly bump: number;
    readonly admin: web3.PublicKey;
    readonly fee: beet.bignum;
    readonly lzTokenFee: beet.bignum;
    readonly wlCaller: web3.PublicKey;
    private constructor();
    /**
     * Creates a {@link MessageLib} instance from the provided args.
     */
    static fromArgs(args: MessageLibArgs): MessageLib;
    /**
     * Deserializes the {@link MessageLib} from the data of the provided {@link web3.AccountInfo}.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static fromAccountInfo(accountInfo: web3.AccountInfo<Buffer>, offset?: number): [MessageLib, number];
    /**
     * Retrieves the account info from the provided address and deserializes
     * the {@link MessageLib} from its data.
     *
     * @throws Error if no account info is found at the address or if deserialization fails
     */
    static fromAccountAddress(connection: web3.Connection, address: web3.PublicKey, commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig): Promise<MessageLib>;
    /**
     * Provides a {@link web3.Connection.getProgramAccounts} config builder,
     * to fetch accounts matching filters that can be specified via that builder.
     *
     * @param programId - the program that owns the accounts we are filtering
     */
    static gpaBuilder(programId?: web3.PublicKey): beetSolana.GpaBuilder<{
        endpoint: any;
        admin: any;
        bump: any;
        eid: any;
        lzTokenFee: any;
        fee: any;
        accountDiscriminator: any;
        endpointProgram: any;
        wlCaller: any;
    }>;
    /**
     * Deserializes the {@link MessageLib} from the provided data Buffer.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static deserialize(buf: Buffer, offset?: number): [MessageLib, number];
    /**
     * Serializes the {@link MessageLib} into a Buffer.
     * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
     */
    serialize(): [Buffer, number];
    /**
     * Returns the byteSize of a {@link Buffer} holding the serialized data of
     * {@link MessageLib}
     */
    static get byteSize(): number;
    /**
     * Fetches the minimum balance needed to exempt an account holding
     * {@link MessageLib} data from rent
     *
     * @param connection used to retrieve the rent exemption information
     */
    static getMinimumBalanceForRentExemption(connection: web3.Connection, commitment?: web3.Commitment): Promise<number>;
    /**
     * Determines if the provided {@link Buffer} has the correct byte size to
     * hold {@link MessageLib} data.
     */
    static hasCorrectByteSize(buf: Buffer, offset?: number): boolean;
    /**
     * Returns a readable version of {@link MessageLib} properties
     * and can be used to convert to JSON and/or logging
     */
    pretty(): {
        eid: number;
        endpoint: string;
        endpointProgram: string;
        bump: number;
        admin: string;
        fee: number | {
            toNumber: () => number;
        };
        lzTokenFee: number | {
            toNumber: () => number;
        };
        wlCaller: string;
    };
}
/**
 * @category Accounts
 * @category generated
 */
declare const messageLibBeet: beet.BeetStruct<MessageLib, MessageLibArgs & {
    accountDiscriminator: number[];
}>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * Arguments used to create {@link ReceiveConfigStore}
 * @category Accounts
 * @category generated
 */
type ReceiveConfigStoreArgs = {
    bump: number;
    data: Uint8Array;
};
declare const receiveConfigStoreDiscriminator: number[];
/**
 * Holds the data for the {@link ReceiveConfigStore} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
declare class ReceiveConfigStore implements ReceiveConfigStoreArgs {
    readonly bump: number;
    readonly data: Uint8Array;
    private constructor();
    /**
     * Creates a {@link ReceiveConfigStore} instance from the provided args.
     */
    static fromArgs(args: ReceiveConfigStoreArgs): ReceiveConfigStore;
    /**
     * Deserializes the {@link ReceiveConfigStore} from the data of the provided {@link web3.AccountInfo}.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static fromAccountInfo(accountInfo: web3.AccountInfo<Buffer>, offset?: number): [ReceiveConfigStore, number];
    /**
     * Retrieves the account info from the provided address and deserializes
     * the {@link ReceiveConfigStore} from its data.
     *
     * @throws Error if no account info is found at the address or if deserialization fails
     */
    static fromAccountAddress(connection: web3.Connection, address: web3.PublicKey, commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig): Promise<ReceiveConfigStore>;
    /**
     * Provides a {@link web3.Connection.getProgramAccounts} config builder,
     * to fetch accounts matching filters that can be specified via that builder.
     *
     * @param programId - the program that owns the accounts we are filtering
     */
    static gpaBuilder(programId?: web3.PublicKey): beetSolana.GpaBuilder<ReceiveConfigStoreArgs & {
        accountDiscriminator: number[];
    }>;
    /**
     * Deserializes the {@link ReceiveConfigStore} from the provided data Buffer.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static deserialize(buf: Buffer, offset?: number): [ReceiveConfigStore, number];
    /**
     * Serializes the {@link ReceiveConfigStore} into a Buffer.
     * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
     */
    serialize(): [Buffer, number];
    /**
     * Returns the byteSize of a {@link Buffer} holding the serialized data of
     * {@link ReceiveConfigStore} for the provided args.
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     */
    static byteSize(args: ReceiveConfigStoreArgs): number;
    /**
     * Fetches the minimum balance needed to exempt an account holding
     * {@link ReceiveConfigStore} data from rent
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     * @param connection used to retrieve the rent exemption information
     */
    static getMinimumBalanceForRentExemption(args: ReceiveConfigStoreArgs, connection: web3.Connection, commitment?: web3.Commitment): Promise<number>;
    /**
     * Returns a readable version of {@link ReceiveConfigStore} properties
     * and can be used to convert to JSON and/or logging
     */
    pretty(): {
        bump: number;
        data: Uint8Array;
    };
}
/**
 * @category Accounts
 * @category generated
 */
declare const receiveConfigStoreBeet: beet.FixableBeetStruct<ReceiveConfigStore, ReceiveConfigStoreArgs & {
    accountDiscriminator: number[];
}>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * Arguments used to create {@link SendConfigStore}
 * @category Accounts
 * @category generated
 */
type SendConfigStoreArgs = {
    bump: number;
    data: Uint8Array;
};
declare const sendConfigStoreDiscriminator: number[];
/**
 * Holds the data for the {@link SendConfigStore} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
declare class SendConfigStore implements SendConfigStoreArgs {
    readonly bump: number;
    readonly data: Uint8Array;
    private constructor();
    /**
     * Creates a {@link SendConfigStore} instance from the provided args.
     */
    static fromArgs(args: SendConfigStoreArgs): SendConfigStore;
    /**
     * Deserializes the {@link SendConfigStore} from the data of the provided {@link web3.AccountInfo}.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static fromAccountInfo(accountInfo: web3.AccountInfo<Buffer>, offset?: number): [SendConfigStore, number];
    /**
     * Retrieves the account info from the provided address and deserializes
     * the {@link SendConfigStore} from its data.
     *
     * @throws Error if no account info is found at the address or if deserialization fails
     */
    static fromAccountAddress(connection: web3.Connection, address: web3.PublicKey, commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig): Promise<SendConfigStore>;
    /**
     * Provides a {@link web3.Connection.getProgramAccounts} config builder,
     * to fetch accounts matching filters that can be specified via that builder.
     *
     * @param programId - the program that owns the accounts we are filtering
     */
    static gpaBuilder(programId?: web3.PublicKey): beetSolana.GpaBuilder<SendConfigStoreArgs & {
        accountDiscriminator: number[];
    }>;
    /**
     * Deserializes the {@link SendConfigStore} from the provided data Buffer.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static deserialize(buf: Buffer, offset?: number): [SendConfigStore, number];
    /**
     * Serializes the {@link SendConfigStore} into a Buffer.
     * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
     */
    serialize(): [Buffer, number];
    /**
     * Returns the byteSize of a {@link Buffer} holding the serialized data of
     * {@link SendConfigStore} for the provided args.
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     */
    static byteSize(args: SendConfigStoreArgs): number;
    /**
     * Fetches the minimum balance needed to exempt an account holding
     * {@link SendConfigStore} data from rent
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     * @param connection used to retrieve the rent exemption information
     */
    static getMinimumBalanceForRentExemption(args: SendConfigStoreArgs, connection: web3.Connection, commitment?: web3.Commitment): Promise<number>;
    /**
     * Returns a readable version of {@link SendConfigStore} properties
     * and can be used to convert to JSON and/or logging
     */
    pretty(): {
        bump: number;
        data: Uint8Array;
    };
}
/**
 * @category Accounts
 * @category generated
 */
declare const sendConfigStoreBeet: beet.FixableBeetStruct<SendConfigStore, SendConfigStoreArgs & {
    accountDiscriminator: number[];
}>;

declare const accountProviders$4: {
    MessageLib: typeof MessageLib;
    ReceiveConfigStore: typeof ReceiveConfigStore;
    SendConfigStore: typeof SendConfigStore;
};

type index$m_MessageLib = MessageLib;
declare const index$m_MessageLib: typeof MessageLib;
type index$m_MessageLibArgs = MessageLibArgs;
type index$m_ReceiveConfigStore = ReceiveConfigStore;
declare const index$m_ReceiveConfigStore: typeof ReceiveConfigStore;
type index$m_ReceiveConfigStoreArgs = ReceiveConfigStoreArgs;
type index$m_SendConfigStore = SendConfigStore;
declare const index$m_SendConfigStore: typeof SendConfigStore;
type index$m_SendConfigStoreArgs = SendConfigStoreArgs;
declare const index$m_messageLibBeet: typeof messageLibBeet;
declare const index$m_messageLibDiscriminator: typeof messageLibDiscriminator;
declare const index$m_receiveConfigStoreBeet: typeof receiveConfigStoreBeet;
declare const index$m_receiveConfigStoreDiscriminator: typeof receiveConfigStoreDiscriminator;
declare const index$m_sendConfigStoreBeet: typeof sendConfigStoreBeet;
declare const index$m_sendConfigStoreDiscriminator: typeof sendConfigStoreDiscriminator;
declare namespace index$m {
  export { index$m_MessageLib as MessageLib, type index$m_MessageLibArgs as MessageLibArgs, index$m_ReceiveConfigStore as ReceiveConfigStore, type index$m_ReceiveConfigStoreArgs as ReceiveConfigStoreArgs, index$m_SendConfigStore as SendConfigStore, type index$m_SendConfigStoreArgs as SendConfigStoreArgs, accountProviders$4 as accountProviders, index$m_messageLibBeet as messageLibBeet, index$m_messageLibDiscriminator as messageLibDiscriminator, index$m_receiveConfigStoreBeet as receiveConfigStoreBeet, index$m_receiveConfigStoreDiscriminator as receiveConfigStoreDiscriminator, index$m_sendConfigStoreBeet as sendConfigStoreBeet, index$m_sendConfigStoreDiscriminator as sendConfigStoreDiscriminator };
}

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */
type ErrorWithCode$3 = Error & {
    code: number;
};
type MaybeErrorWithCode$3 = ErrorWithCode$3 | null | undefined;
/**
 * OnlyWhitelistedCaller: ''
 *
 * @category Errors
 * @category generated
 */
declare class OnlyWhitelistedCallerError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InsufficientFee: ''
 *
 * @category Errors
 * @category generated
 */
declare class InsufficientFeeError$1 extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidAmount: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidAmountError$2 extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidConfigType: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidConfigTypeError$1 extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidLzTokenMint: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidLzTokenMintError$1 extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * LzTokenUnavailable: ''
 *
 * @category Errors
 * @category generated
 */
declare class LzTokenUnavailableError$1 extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * SendReentrancy: ''
 *
 * @category Errors
 * @category generated
 */
declare class SendReentrancyError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * OnlyRevert: ''
 *
 * @category Errors
 * @category generated
 */
declare class OnlyRevertError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * Attempts to resolve a custom program error from the provided error code.
 * @category Errors
 * @category generated
 */
declare function errorFromCode$3(code: number): MaybeErrorWithCode$3;
/**
 * Attempts to resolve a custom program error from the provided error name, i.e. 'Unauthorized'.
 * @category Errors
 * @category generated
 */
declare function errorFromName$3(name: string): MaybeErrorWithCode$3;

type index$l_OnlyRevertError = OnlyRevertError;
declare const index$l_OnlyRevertError: typeof OnlyRevertError;
type index$l_OnlyWhitelistedCallerError = OnlyWhitelistedCallerError;
declare const index$l_OnlyWhitelistedCallerError: typeof OnlyWhitelistedCallerError;
type index$l_SendReentrancyError = SendReentrancyError;
declare const index$l_SendReentrancyError: typeof SendReentrancyError;
declare namespace index$l {
  export { InsufficientFeeError$1 as InsufficientFeeError, InvalidAmountError$2 as InvalidAmountError, InvalidConfigTypeError$1 as InvalidConfigTypeError, InvalidLzTokenMintError$1 as InvalidLzTokenMintError, LzTokenUnavailableError$1 as LzTokenUnavailableError, index$l_OnlyRevertError as OnlyRevertError, index$l_OnlyWhitelistedCallerError as OnlyWhitelistedCallerError, index$l_SendReentrancyError as SendReentrancyError, errorFromCode$3 as errorFromCode, errorFromName$3 as errorFromName };
}

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type InitConfigParams$1 = {
    oapp: web3.PublicKey;
    eid: number;
};
/**
 * @category userTypes
 * @category generated
 */
declare const initConfigParamsBeet$1: beet.BeetArgsStruct<InitConfigParams$1>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category InitConfig
 * @category generated
 */
type InitConfigInstructionArgs$1 = {
    params: InitConfigParams$1;
};
/**
 * @category Instructions
 * @category InitConfig
 * @category generated
 */
declare const initConfigStruct$1: beet.BeetArgsStruct<InitConfigInstructionArgs$1 & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _initConfig_ instruction
 *
 * @property [**signer**] endpoint
 * @property [_writable_, **signer**] payer
 * @property [] messageLib
 * @property [_writable_] sendConfig
 * @property [_writable_] receiveConfig
 * @category Instructions
 * @category InitConfig
 * @category generated
 */
type InitConfigInstructionAccounts$1 = {
    endpoint: web3.PublicKey;
    payer: web3.PublicKey;
    messageLib: web3.PublicKey;
    sendConfig: web3.PublicKey;
    receiveConfig: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const initConfigInstructionDiscriminator$1: number[];
/**
 * Creates a _InitConfig_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category InitConfig
 * @category generated
 */
declare function createInitConfigInstruction$1(accounts: InitConfigInstructionAccounts$1, args: InitConfigInstructionArgs$1, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _InitConfig_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category InitConfig
 * @category generated
 */
declare function createInitConfigInstructionAccounts$1(accounts: InitConfigInstructionAccounts$1, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type InitDefaultConfigParams$1 = {
    eid: number;
    sendConfig: beet.COption<Uint8Array>;
    receiveConfig: beet.COption<Uint8Array>;
};
/**
 * @category userTypes
 * @category generated
 */
declare const initDefaultConfigParamsBeet$1: beet.FixableBeetArgsStruct<InitDefaultConfigParams$1>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category InitDefaultConfig
 * @category generated
 */
type InitDefaultConfigInstructionArgs$1 = {
    params: InitDefaultConfigParams$1;
};
/**
 * @category Instructions
 * @category InitDefaultConfig
 * @category generated
 */
declare const initDefaultConfigStruct$1: beet.FixableBeetArgsStruct<InitDefaultConfigInstructionArgs$1 & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _initDefaultConfig_ instruction
 *
 * @property [_writable_, **signer**] admin
 * @property [] messageLib
 * @property [_writable_] sendConfig
 * @property [_writable_] receiveConfig
 * @category Instructions
 * @category InitDefaultConfig
 * @category generated
 */
type InitDefaultConfigInstructionAccounts$1 = {
    admin: web3.PublicKey;
    messageLib: web3.PublicKey;
    sendConfig: web3.PublicKey;
    receiveConfig: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const initDefaultConfigInstructionDiscriminator$1: number[];
/**
 * Creates a _InitDefaultConfig_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category InitDefaultConfig
 * @category generated
 */
declare function createInitDefaultConfigInstruction$1(accounts: InitDefaultConfigInstructionAccounts$1, args: InitDefaultConfigInstructionArgs$1, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _InitDefaultConfig_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category InitDefaultConfig
 * @category generated
 */
declare function createInitDefaultConfigInstructionAccounts$1(accounts: InitDefaultConfigInstructionAccounts$1, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type InitMessageLibParams = {
    eid: number;
    endpoint: web3.PublicKey;
    endpointProgram: web3.PublicKey;
    admin: web3.PublicKey;
    fee: beet.bignum;
    lzTokenFee: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const initMessageLibParamsBeet: beet.BeetArgsStruct<InitMessageLibParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category InitMessageLib
 * @category generated
 */
type InitMessageLibInstructionArgs = {
    params: InitMessageLibParams;
};
/**
 * @category Instructions
 * @category InitMessageLib
 * @category generated
 */
declare const initMessageLibStruct: beet.BeetArgsStruct<InitMessageLibInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _initMessageLib_ instruction
 *
 * @property [_writable_, **signer**] payer
 * @property [_writable_] messageLib
 * @category Instructions
 * @category InitMessageLib
 * @category generated
 */
type InitMessageLibInstructionAccounts = {
    payer: web3.PublicKey;
    messageLib: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const initMessageLibInstructionDiscriminator: number[];
/**
 * Creates a _InitMessageLib_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category InitMessageLib
 * @category generated
 */
declare function createInitMessageLibInstruction(accounts: InitMessageLibInstructionAccounts, args: InitMessageLibInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _InitMessageLib_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category InitMessageLib
 * @category generated
 */
declare function createInitMessageLibInstructionAccounts(accounts: InitMessageLibInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type Packet$1 = {
    nonce: beet.bignum;
    srcEid: number;
    sender: web3.PublicKey;
    dstEid: number;
    receiver: number[];
    guid: number[];
    message: Uint8Array;
};
/**
 * @category userTypes
 * @category generated
 */
declare const packetBeet$1: beet.FixableBeetArgsStruct<Packet$1>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type QuoteParams$1 = {
    packet: Packet$1;
    options: Uint8Array;
    payInLzToken: boolean;
};
/**
 * @category userTypes
 * @category generated
 */
declare const quoteParamsBeet$1: beet.FixableBeetArgsStruct<QuoteParams$1>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category Quote
 * @category generated
 */
type QuoteInstructionArgs$1 = {
    params: QuoteParams$1;
};
/**
 * @category Instructions
 * @category Quote
 * @category generated
 */
declare const quoteStruct$1: beet.FixableBeetArgsStruct<QuoteInstructionArgs$1 & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _quote_ instruction
 *
 * @property [**signer**] endpoint
 * @property [] messageLib
 * @category Instructions
 * @category Quote
 * @category generated
 */
type QuoteInstructionAccounts$1 = {
    endpoint: web3.PublicKey;
    messageLib: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const quoteInstructionDiscriminator$1: number[];
/**
 * Creates a _Quote_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category Quote
 * @category generated
 */
declare function createQuoteInstruction$1(accounts: QuoteInstructionAccounts$1, args: QuoteInstructionArgs$1, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _Quote_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category Quote
 * @category generated
 */
declare function createQuoteInstructionAccounts$1(accounts: QuoteInstructionAccounts$1, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category RevertCall
 * @category generated
 */
declare const revertCallStruct: beet.BeetArgsStruct<{
    instructionDiscriminator: number[];
}>;
declare const revertCallInstructionDiscriminator: number[];
/**
 * Creates a _RevertCall_ instruction.
 *
 * @category Instructions
 * @category RevertCall
 * @category generated
 */
declare function createRevertCallInstruction(programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _RevertCall_ instructionAccounts.
 *
 * @category Instructions
 * @category RevertCall
 * @category generated
 */
declare function createRevertCallInstructionAccounts(programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type SendParams$1 = {
    packet: Packet$1;
    options: Uint8Array;
    nativeFee: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const sendParamsBeet$1: beet.FixableBeetArgsStruct<SendParams$1>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category Send
 * @category generated
 */
type SendInstructionArgs$1 = {
    params: SendParams$1;
};
/**
 * @category Instructions
 * @category Send
 * @category generated
 */
declare const sendStruct$1: beet.FixableBeetArgsStruct<SendInstructionArgs$1 & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _send_ instruction
 *
 * @property [**signer**] endpoint
 * @property [_writable_] messageLib
 * @property [_writable_, **signer**] payer
 * @category Instructions
 * @category Send
 * @category generated
 */
type SendInstructionAccounts$1 = {
    endpoint: web3.PublicKey;
    messageLib: web3.PublicKey;
    payer: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const sendInstructionDiscriminator$1: number[];
/**
 * Creates a _Send_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category Send
 * @category generated
 */
declare function createSendInstruction$1(accounts: SendInstructionAccounts$1, args: SendInstructionArgs$1, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _Send_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category Send
 * @category generated
 */
declare function createSendInstructionAccounts$1(accounts: SendInstructionAccounts$1, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type SendWithLzTokenParams$1 = {
    packet: Packet$1;
    options: Uint8Array;
    nativeFee: beet.bignum;
    lzTokenFee: beet.bignum;
    lzTokenMint: web3.PublicKey;
};
/**
 * @category userTypes
 * @category generated
 */
declare const sendWithLzTokenParamsBeet$1: beet.FixableBeetArgsStruct<SendWithLzTokenParams$1>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category SendWithLzToken
 * @category generated
 */
type SendWithLzTokenInstructionArgs$1 = {
    params: SendWithLzTokenParams$1;
};
/**
 * @category Instructions
 * @category SendWithLzToken
 * @category generated
 */
declare const sendWithLzTokenStruct$1: beet.FixableBeetArgsStruct<SendWithLzTokenInstructionArgs$1 & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _sendWithLzToken_ instruction
 *
 * @property [**signer**] endpoint
 * @property [_writable_] messageLib
 * @property [_writable_] messageLibLzToken
 * @property [_writable_, **signer**] payer
 * @property [_writable_] lzTokenSource
 * @property [] lzTokenMint
 * @category Instructions
 * @category SendWithLzToken
 * @category generated
 */
type SendWithLzTokenInstructionAccounts$1 = {
    endpoint: web3.PublicKey;
    messageLib: web3.PublicKey;
    messageLibLzToken: web3.PublicKey;
    payer: web3.PublicKey;
    lzTokenSource: web3.PublicKey;
    lzTokenMint: web3.PublicKey;
    tokenProgram?: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const sendWithLzTokenInstructionDiscriminator$1: number[];
/**
 * Creates a _SendWithLzToken_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category SendWithLzToken
 * @category generated
 */
declare function createSendWithLzTokenInstruction$1(accounts: SendWithLzTokenInstructionAccounts$1, args: SendWithLzTokenInstructionArgs$1, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _SendWithLzToken_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category SendWithLzToken
 * @category generated
 */
declare function createSendWithLzTokenInstructionAccounts$1(accounts: SendWithLzTokenInstructionAccounts$1, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type SetConfigParams$2 = {
    oapp: web3.PublicKey;
    eid: number;
    configType: number;
    config: Uint8Array;
};
/**
 * @category userTypes
 * @category generated
 */
declare const setConfigParamsBeet$2: beet.FixableBeetArgsStruct<SetConfigParams$2>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category SetConfig
 * @category generated
 */
type SetConfigInstructionArgs$2 = {
    params: SetConfigParams$2;
};
/**
 * @category Instructions
 * @category SetConfig
 * @category generated
 */
declare const setConfigStruct$2: beet.FixableBeetArgsStruct<SetConfigInstructionArgs$2 & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _setConfig_ instruction
 *
 * @property [**signer**] endpoint
 * @property [] messageLib
 * @property [_writable_] sendConfig
 * @property [_writable_] receiveConfig
 * @category Instructions
 * @category SetConfig
 * @category generated
 */
type SetConfigInstructionAccounts$2 = {
    endpoint: web3.PublicKey;
    messageLib: web3.PublicKey;
    sendConfig: web3.PublicKey;
    receiveConfig: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const setConfigInstructionDiscriminator$2: number[];
/**
 * Creates a _SetConfig_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category SetConfig
 * @category generated
 */
declare function createSetConfigInstruction$2(accounts: SetConfigInstructionAccounts$2, args: SetConfigInstructionArgs$2, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _SetConfig_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category SetConfig
 * @category generated
 */
declare function createSetConfigInstructionAccounts$2(accounts: SetConfigInstructionAccounts$2, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type SetDefaultConfigParams$1 = {
    eid: number;
    sendConfig: beet.COption<Uint8Array>;
    receiveConfig: beet.COption<Uint8Array>;
};
/**
 * @category userTypes
 * @category generated
 */
declare const setDefaultConfigParamsBeet$1: beet.FixableBeetArgsStruct<SetDefaultConfigParams$1>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category SetDefaultConfig
 * @category generated
 */
type SetDefaultConfigInstructionArgs$1 = {
    params: SetDefaultConfigParams$1;
};
/**
 * @category Instructions
 * @category SetDefaultConfig
 * @category generated
 */
declare const setDefaultConfigStruct$1: beet.FixableBeetArgsStruct<SetDefaultConfigInstructionArgs$1 & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _setDefaultConfig_ instruction
 *
 * @property [**signer**] admin
 * @property [] messageLib
 * @property [_writable_] sendConfig
 * @property [_writable_] receiveConfig
 * @category Instructions
 * @category SetDefaultConfig
 * @category generated
 */
type SetDefaultConfigInstructionAccounts$1 = {
    admin: web3.PublicKey;
    messageLib: web3.PublicKey;
    sendConfig: web3.PublicKey;
    receiveConfig: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const setDefaultConfigInstructionDiscriminator$1: number[];
/**
 * Creates a _SetDefaultConfig_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category SetDefaultConfig
 * @category generated
 */
declare function createSetDefaultConfigInstruction$1(accounts: SetDefaultConfigInstructionAccounts$1, args: SetDefaultConfigInstructionArgs$1, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _SetDefaultConfig_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category SetDefaultConfig
 * @category generated
 */
declare function createSetDefaultConfigInstructionAccounts$1(accounts: SetDefaultConfigInstructionAccounts$1, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type SetFeeParams = {
    fee: beet.bignum;
    lzTokenFee: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const setFeeParamsBeet: beet.BeetArgsStruct<SetFeeParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category SetFee
 * @category generated
 */
type SetFeeInstructionArgs = {
    params: SetFeeParams;
};
/**
 * @category Instructions
 * @category SetFee
 * @category generated
 */
declare const setFeeStruct: beet.BeetArgsStruct<SetFeeInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _setFee_ instruction
 *
 * @property [**signer**] admin
 * @property [_writable_] messageLib
 * @category Instructions
 * @category SetFee
 * @category generated
 */
type SetFeeInstructionAccounts = {
    admin: web3.PublicKey;
    messageLib: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const setFeeInstructionDiscriminator: number[];
/**
 * Creates a _SetFee_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category SetFee
 * @category generated
 */
declare function createSetFeeInstruction(accounts: SetFeeInstructionAccounts, args: SetFeeInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _SetFee_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category SetFee
 * @category generated
 */
declare function createSetFeeInstructionAccounts(accounts: SetFeeInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type SetWlCallerParams = {
    newCaller: web3.PublicKey;
};
/**
 * @category userTypes
 * @category generated
 */
declare const setWlCallerParamsBeet: beet.BeetArgsStruct<SetWlCallerParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category SetWlCaller
 * @category generated
 */
type SetWlCallerInstructionArgs = {
    params: SetWlCallerParams;
};
/**
 * @category Instructions
 * @category SetWlCaller
 * @category generated
 */
declare const setWlCallerStruct: beet.BeetArgsStruct<SetWlCallerInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _setWlCaller_ instruction
 *
 * @property [**signer**] admin
 * @property [_writable_] messageLib
 * @category Instructions
 * @category SetWlCaller
 * @category generated
 */
type SetWlCallerInstructionAccounts = {
    admin: web3.PublicKey;
    messageLib: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const setWlCallerInstructionDiscriminator: number[];
/**
 * Creates a _SetWlCaller_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category SetWlCaller
 * @category generated
 */
declare function createSetWlCallerInstruction(accounts: SetWlCallerInstructionAccounts, args: SetWlCallerInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _SetWlCaller_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category SetWlCaller
 * @category generated
 */
declare function createSetWlCallerInstructionAccounts(accounts: SetWlCallerInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type TransferAdminParams$2 = {
    admin: web3.PublicKey;
};
/**
 * @category userTypes
 * @category generated
 */
declare const transferAdminParamsBeet$2: beet.BeetArgsStruct<TransferAdminParams$2>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category TransferAdmin
 * @category generated
 */
type TransferAdminInstructionArgs$2 = {
    params: TransferAdminParams$2;
};
/**
 * @category Instructions
 * @category TransferAdmin
 * @category generated
 */
declare const transferAdminStruct$2: beet.BeetArgsStruct<TransferAdminInstructionArgs$2 & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _transferAdmin_ instruction
 *
 * @property [**signer**] admin
 * @property [_writable_] messageLib
 * @category Instructions
 * @category TransferAdmin
 * @category generated
 */
type TransferAdminInstructionAccounts$2 = {
    admin: web3.PublicKey;
    messageLib: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const transferAdminInstructionDiscriminator$2: number[];
/**
 * Creates a _TransferAdmin_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category TransferAdmin
 * @category generated
 */
declare function createTransferAdminInstruction$2(accounts: TransferAdminInstructionAccounts$2, args: TransferAdminInstructionArgs$2, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _TransferAdmin_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category TransferAdmin
 * @category generated
 */
declare function createTransferAdminInstructionAccounts$2(accounts: TransferAdminInstructionAccounts$2, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type ValidatePacketParams = {
    packet: Uint8Array;
};
/**
 * @category userTypes
 * @category generated
 */
declare const validatePacketParamsBeet: beet.FixableBeetArgsStruct<ValidatePacketParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category ValidatePacket
 * @category generated
 */
type ValidatePacketInstructionArgs = {
    params: ValidatePacketParams;
};
/**
 * @category Instructions
 * @category ValidatePacket
 * @category generated
 */
declare const validatePacketStruct: beet.FixableBeetArgsStruct<ValidatePacketInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _validatePacket_ instruction
 *
 * @property [**signer**] payer
 * @property [] receiveLibrary
 * @category Instructions
 * @category ValidatePacket
 * @category generated
 */
type ValidatePacketInstructionAccounts = {
    payer: web3.PublicKey;
    receiveLibrary: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const validatePacketInstructionDiscriminator: number[];
/**
 * Creates a _ValidatePacket_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category ValidatePacket
 * @category generated
 */
declare function createValidatePacketInstruction(accounts: ValidatePacketInstructionAccounts, args: ValidatePacketInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _ValidatePacket_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category ValidatePacket
 * @category generated
 */
declare function createValidatePacketInstructionAccounts(accounts: ValidatePacketInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category Version
 * @category generated
 */
declare const versionStruct$2: beet.BeetArgsStruct<{
    instructionDiscriminator: number[];
}>;
declare const versionInstructionDiscriminator$2: number[];
/**
 * Creates a _Version_ instruction.
 *
 * @category Instructions
 * @category Version
 * @category generated
 */
declare function createVersionInstruction$2(programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _Version_ instructionAccounts.
 *
 * @category Instructions
 * @category Version
 * @category generated
 */
declare function createVersionInstructionAccounts$2(programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type WithdrawFeesParams = {
    amount: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const withdrawFeesParamsBeet: beet.BeetArgsStruct<WithdrawFeesParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category WithdrawFees
 * @category generated
 */
type WithdrawFeesInstructionArgs = {
    params: WithdrawFeesParams;
};
/**
 * @category Instructions
 * @category WithdrawFees
 * @category generated
 */
declare const withdrawFeesStruct: beet.BeetArgsStruct<WithdrawFeesInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _withdrawFees_ instruction
 *
 * @property [**signer**] admin
 * @property [_writable_] messageLib
 * @property [_writable_] receiver
 * @category Instructions
 * @category WithdrawFees
 * @category generated
 */
type WithdrawFeesInstructionAccounts = {
    admin: web3.PublicKey;
    messageLib: web3.PublicKey;
    receiver: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const withdrawFeesInstructionDiscriminator: number[];
/**
 * Creates a _WithdrawFees_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category WithdrawFees
 * @category generated
 */
declare function createWithdrawFeesInstruction(accounts: WithdrawFeesInstructionAccounts, args: WithdrawFeesInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _WithdrawFees_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category WithdrawFees
 * @category generated
 */
declare function createWithdrawFeesInstructionAccounts(accounts: WithdrawFeesInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

type index$k_InitMessageLibInstructionAccounts = InitMessageLibInstructionAccounts;
type index$k_InitMessageLibInstructionArgs = InitMessageLibInstructionArgs;
type index$k_SetFeeInstructionAccounts = SetFeeInstructionAccounts;
type index$k_SetFeeInstructionArgs = SetFeeInstructionArgs;
type index$k_SetWlCallerInstructionAccounts = SetWlCallerInstructionAccounts;
type index$k_SetWlCallerInstructionArgs = SetWlCallerInstructionArgs;
type index$k_ValidatePacketInstructionAccounts = ValidatePacketInstructionAccounts;
type index$k_ValidatePacketInstructionArgs = ValidatePacketInstructionArgs;
type index$k_WithdrawFeesInstructionAccounts = WithdrawFeesInstructionAccounts;
type index$k_WithdrawFeesInstructionArgs = WithdrawFeesInstructionArgs;
declare const index$k_createInitMessageLibInstruction: typeof createInitMessageLibInstruction;
declare const index$k_createInitMessageLibInstructionAccounts: typeof createInitMessageLibInstructionAccounts;
declare const index$k_createRevertCallInstruction: typeof createRevertCallInstruction;
declare const index$k_createRevertCallInstructionAccounts: typeof createRevertCallInstructionAccounts;
declare const index$k_createSetFeeInstruction: typeof createSetFeeInstruction;
declare const index$k_createSetFeeInstructionAccounts: typeof createSetFeeInstructionAccounts;
declare const index$k_createSetWlCallerInstruction: typeof createSetWlCallerInstruction;
declare const index$k_createSetWlCallerInstructionAccounts: typeof createSetWlCallerInstructionAccounts;
declare const index$k_createValidatePacketInstruction: typeof createValidatePacketInstruction;
declare const index$k_createValidatePacketInstructionAccounts: typeof createValidatePacketInstructionAccounts;
declare const index$k_createWithdrawFeesInstruction: typeof createWithdrawFeesInstruction;
declare const index$k_createWithdrawFeesInstructionAccounts: typeof createWithdrawFeesInstructionAccounts;
declare const index$k_initMessageLibInstructionDiscriminator: typeof initMessageLibInstructionDiscriminator;
declare const index$k_initMessageLibStruct: typeof initMessageLibStruct;
declare const index$k_revertCallInstructionDiscriminator: typeof revertCallInstructionDiscriminator;
declare const index$k_revertCallStruct: typeof revertCallStruct;
declare const index$k_setFeeInstructionDiscriminator: typeof setFeeInstructionDiscriminator;
declare const index$k_setFeeStruct: typeof setFeeStruct;
declare const index$k_setWlCallerInstructionDiscriminator: typeof setWlCallerInstructionDiscriminator;
declare const index$k_setWlCallerStruct: typeof setWlCallerStruct;
declare const index$k_validatePacketInstructionDiscriminator: typeof validatePacketInstructionDiscriminator;
declare const index$k_validatePacketStruct: typeof validatePacketStruct;
declare const index$k_withdrawFeesInstructionDiscriminator: typeof withdrawFeesInstructionDiscriminator;
declare const index$k_withdrawFeesStruct: typeof withdrawFeesStruct;
declare namespace index$k {
  export { type InitConfigInstructionAccounts$1 as InitConfigInstructionAccounts, type InitConfigInstructionArgs$1 as InitConfigInstructionArgs, type InitDefaultConfigInstructionAccounts$1 as InitDefaultConfigInstructionAccounts, type InitDefaultConfigInstructionArgs$1 as InitDefaultConfigInstructionArgs, type index$k_InitMessageLibInstructionAccounts as InitMessageLibInstructionAccounts, type index$k_InitMessageLibInstructionArgs as InitMessageLibInstructionArgs, type QuoteInstructionAccounts$1 as QuoteInstructionAccounts, type QuoteInstructionArgs$1 as QuoteInstructionArgs, type SendInstructionAccounts$1 as SendInstructionAccounts, type SendInstructionArgs$1 as SendInstructionArgs, type SendWithLzTokenInstructionAccounts$1 as SendWithLzTokenInstructionAccounts, type SendWithLzTokenInstructionArgs$1 as SendWithLzTokenInstructionArgs, type SetConfigInstructionAccounts$2 as SetConfigInstructionAccounts, type SetConfigInstructionArgs$2 as SetConfigInstructionArgs, type SetDefaultConfigInstructionAccounts$1 as SetDefaultConfigInstructionAccounts, type SetDefaultConfigInstructionArgs$1 as SetDefaultConfigInstructionArgs, type index$k_SetFeeInstructionAccounts as SetFeeInstructionAccounts, type index$k_SetFeeInstructionArgs as SetFeeInstructionArgs, type index$k_SetWlCallerInstructionAccounts as SetWlCallerInstructionAccounts, type index$k_SetWlCallerInstructionArgs as SetWlCallerInstructionArgs, type TransferAdminInstructionAccounts$2 as TransferAdminInstructionAccounts, type TransferAdminInstructionArgs$2 as TransferAdminInstructionArgs, type index$k_ValidatePacketInstructionAccounts as ValidatePacketInstructionAccounts, type index$k_ValidatePacketInstructionArgs as ValidatePacketInstructionArgs, type index$k_WithdrawFeesInstructionAccounts as WithdrawFeesInstructionAccounts, type index$k_WithdrawFeesInstructionArgs as WithdrawFeesInstructionArgs, createInitConfigInstruction$1 as createInitConfigInstruction, createInitConfigInstructionAccounts$1 as createInitConfigInstructionAccounts, createInitDefaultConfigInstruction$1 as createInitDefaultConfigInstruction, createInitDefaultConfigInstructionAccounts$1 as createInitDefaultConfigInstructionAccounts, index$k_createInitMessageLibInstruction as createInitMessageLibInstruction, index$k_createInitMessageLibInstructionAccounts as createInitMessageLibInstructionAccounts, createQuoteInstruction$1 as createQuoteInstruction, createQuoteInstructionAccounts$1 as createQuoteInstructionAccounts, index$k_createRevertCallInstruction as createRevertCallInstruction, index$k_createRevertCallInstructionAccounts as createRevertCallInstructionAccounts, createSendInstruction$1 as createSendInstruction, createSendInstructionAccounts$1 as createSendInstructionAccounts, createSendWithLzTokenInstruction$1 as createSendWithLzTokenInstruction, createSendWithLzTokenInstructionAccounts$1 as createSendWithLzTokenInstructionAccounts, createSetConfigInstruction$2 as createSetConfigInstruction, createSetConfigInstructionAccounts$2 as createSetConfigInstructionAccounts, createSetDefaultConfigInstruction$1 as createSetDefaultConfigInstruction, createSetDefaultConfigInstructionAccounts$1 as createSetDefaultConfigInstructionAccounts, index$k_createSetFeeInstruction as createSetFeeInstruction, index$k_createSetFeeInstructionAccounts as createSetFeeInstructionAccounts, index$k_createSetWlCallerInstruction as createSetWlCallerInstruction, index$k_createSetWlCallerInstructionAccounts as createSetWlCallerInstructionAccounts, createTransferAdminInstruction$2 as createTransferAdminInstruction, createTransferAdminInstructionAccounts$2 as createTransferAdminInstructionAccounts, index$k_createValidatePacketInstruction as createValidatePacketInstruction, index$k_createValidatePacketInstructionAccounts as createValidatePacketInstructionAccounts, createVersionInstruction$2 as createVersionInstruction, createVersionInstructionAccounts$2 as createVersionInstructionAccounts, index$k_createWithdrawFeesInstruction as createWithdrawFeesInstruction, index$k_createWithdrawFeesInstructionAccounts as createWithdrawFeesInstructionAccounts, initConfigInstructionDiscriminator$1 as initConfigInstructionDiscriminator, initConfigStruct$1 as initConfigStruct, initDefaultConfigInstructionDiscriminator$1 as initDefaultConfigInstructionDiscriminator, initDefaultConfigStruct$1 as initDefaultConfigStruct, index$k_initMessageLibInstructionDiscriminator as initMessageLibInstructionDiscriminator, index$k_initMessageLibStruct as initMessageLibStruct, quoteInstructionDiscriminator$1 as quoteInstructionDiscriminator, quoteStruct$1 as quoteStruct, index$k_revertCallInstructionDiscriminator as revertCallInstructionDiscriminator, index$k_revertCallStruct as revertCallStruct, sendInstructionDiscriminator$1 as sendInstructionDiscriminator, sendStruct$1 as sendStruct, sendWithLzTokenInstructionDiscriminator$1 as sendWithLzTokenInstructionDiscriminator, sendWithLzTokenStruct$1 as sendWithLzTokenStruct, setConfigInstructionDiscriminator$2 as setConfigInstructionDiscriminator, setConfigStruct$2 as setConfigStruct, setDefaultConfigInstructionDiscriminator$1 as setDefaultConfigInstructionDiscriminator, setDefaultConfigStruct$1 as setDefaultConfigStruct, index$k_setFeeInstructionDiscriminator as setFeeInstructionDiscriminator, index$k_setFeeStruct as setFeeStruct, index$k_setWlCallerInstructionDiscriminator as setWlCallerInstructionDiscriminator, index$k_setWlCallerStruct as setWlCallerStruct, transferAdminInstructionDiscriminator$2 as transferAdminInstructionDiscriminator, transferAdminStruct$2 as transferAdminStruct, index$k_validatePacketInstructionDiscriminator as validatePacketInstructionDiscriminator, index$k_validatePacketStruct as validatePacketStruct, versionInstructionDiscriminator$2 as versionInstructionDiscriminator, versionStruct$2 as versionStruct, index$k_withdrawFeesInstructionDiscriminator as withdrawFeesInstructionDiscriminator, index$k_withdrawFeesStruct as withdrawFeesStruct };
}

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type MessagingFee$1 = {
    nativeFee: beet.bignum;
    lzTokenFee: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const messagingFeeBeet$1: beet.BeetArgsStruct<MessagingFee$1>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type Version$1 = {
    major: beet.bignum;
    minor: number;
    endpointVersion: number;
};
/**
 * @category userTypes
 * @category generated
 */
declare const versionBeet$1: beet.BeetArgsStruct<Version$1>;

type index$j_InitMessageLibParams = InitMessageLibParams;
type index$j_SetFeeParams = SetFeeParams;
type index$j_SetWlCallerParams = SetWlCallerParams;
type index$j_ValidatePacketParams = ValidatePacketParams;
type index$j_WithdrawFeesParams = WithdrawFeesParams;
declare const index$j_initMessageLibParamsBeet: typeof initMessageLibParamsBeet;
declare const index$j_setFeeParamsBeet: typeof setFeeParamsBeet;
declare const index$j_setWlCallerParamsBeet: typeof setWlCallerParamsBeet;
declare const index$j_validatePacketParamsBeet: typeof validatePacketParamsBeet;
declare const index$j_withdrawFeesParamsBeet: typeof withdrawFeesParamsBeet;
declare namespace index$j {
  export { type InitConfigParams$1 as InitConfigParams, type InitDefaultConfigParams$1 as InitDefaultConfigParams, type index$j_InitMessageLibParams as InitMessageLibParams, type MessagingFee$1 as MessagingFee, type Packet$1 as Packet, type QuoteParams$1 as QuoteParams, type SendParams$1 as SendParams, type SendWithLzTokenParams$1 as SendWithLzTokenParams, type SetConfigParams$2 as SetConfigParams, type SetDefaultConfigParams$1 as SetDefaultConfigParams, type index$j_SetFeeParams as SetFeeParams, type index$j_SetWlCallerParams as SetWlCallerParams, type TransferAdminParams$2 as TransferAdminParams, type index$j_ValidatePacketParams as ValidatePacketParams, type Version$1 as Version, type index$j_WithdrawFeesParams as WithdrawFeesParams, initConfigParamsBeet$1 as initConfigParamsBeet, initDefaultConfigParamsBeet$1 as initDefaultConfigParamsBeet, index$j_initMessageLibParamsBeet as initMessageLibParamsBeet, messagingFeeBeet$1 as messagingFeeBeet, packetBeet$1 as packetBeet, quoteParamsBeet$1 as quoteParamsBeet, sendParamsBeet$1 as sendParamsBeet, sendWithLzTokenParamsBeet$1 as sendWithLzTokenParamsBeet, setConfigParamsBeet$2 as setConfigParamsBeet, setDefaultConfigParamsBeet$1 as setDefaultConfigParamsBeet, index$j_setFeeParamsBeet as setFeeParamsBeet, index$j_setWlCallerParamsBeet as setWlCallerParamsBeet, transferAdminParamsBeet$2 as transferAdminParamsBeet, index$j_validatePacketParamsBeet as validatePacketParamsBeet, versionBeet$1 as versionBeet, index$j_withdrawFeesParamsBeet as withdrawFeesParamsBeet };
}

/**
 * Program public key
 *
 * @category constants
 * @category generated
 */
declare const PROGRAM_ID$5: PublicKey;

declare const EventEmitDiscriminator = "e445a52e51cb9a1d";
declare const DefaultMessageLib: PublicKey;
declare class Endpoint {
    program: PublicKey;
    deriver: EndpointPDADeriver;
    eventAuthorityPDA: PublicKey;
    constructor(program: PublicKey);
    /**
     * init endpoint settings, including eid, admin, it also registers the blocked message lib
     */
    initEndpoint(endpointId: number, payer: PublicKey, admin: PublicKey): TransactionInstruction;
    /***
     * call this function after endpoint initialized. Only admin can call this function.
     */
    registerLibrary(admin: PublicKey, messageLibProgram: PublicKey, libType?: MessageLibType): TransactionInstruction;
    setDefaultSendLibrary(connection: Connection, admin: PublicKey, messageLibProgram: PublicKey, dstEid: number, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<TransactionInstruction | null>;
    setDefaultReceiveLibrary(connection: Connection, admin: PublicKey, messageLibProgram: PublicKey, srcEid: number, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<TransactionInstruction | null>;
    initOAppConfig(delegate: PublicKey, msgLibSDK: MessageLibInterface, payer: PublicKey, oappID: PublicKey, eid: number): TransactionInstruction;
    initOAppNonce(delegate: PublicKey, // payer
    dstEid: number, oappIDPDA: PublicKey, remoteOappAddr: Uint8Array): TransactionInstruction;
    initSendLibrary(delegate: PublicKey, sender: PublicKey, dstEid: number): TransactionInstruction;
    setSendLibrary(oappAdmin: PublicKey, oappIDPDA: PublicKey, newSendLibProgram: PublicKey, dstEid: number): TransactionInstruction;
    initReceiveLibrary(delegate: PublicKey, receiver: PublicKey, srcEid: number): TransactionInstruction;
    setReceiveLibrary(oappAdmin: PublicKey, oappIDPDA: PublicKey, newReceiveLibProgram: PublicKey, srcEid: number, gracePeriod?: bigint | number): TransactionInstruction;
    setOappConfig(connection: Connection, oappDelegate: PublicKey, oappID: PublicKey, msgLibProgram: PublicKey, eid: number, config: {
        configType: SetConfigType;
        value: ExecutorConfig | UlnConfig;
    }, commitment?: Commitment): Promise<TransactionInstruction>;
    /***
     *
     * caculate the fee for sending a message with ULN:
     *  1. executorFee: feeForGas + feeForOptionType
     *      * feeForGas: ((gas + gasForCalldata) * gasPriceInUnit * priceRatio / priceRatioDenominator) * multiplier_bps / 10000
     *      * feeForOptionType: nativeDrop/lzReceive/lzCompose
     *  2. oracleFee: feeForGas
     *      * feeForGas: same above
     *
     *  The priceRatioDenominator is 10^20
     *  totalFee = executorFee + oracleFee * numOracles(requiredOracles + optionalOracles)
     */
    getQuoteIXAccountMetaForCPI(connection: Connection, payer: PublicKey, path: PacketPath, msgLibProgram: MessageLibInterface): Promise<AccountMeta[]>;
    /***
     * Get the account meta of the send instruction for CPI(Cross-Program Invocation )
     */
    getSendIXAccountMetaForCPI(connection: Connection, payer: PublicKey, path: PacketPath, msgLibProgram: MessageLibInterface, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<AccountMeta[]>;
    skip(payer: PublicKey, sender: PublicKey, receiver: PublicKey, srcEid: number, nonce: string): Promise<TransactionInstruction | null>;
    initVerify(connection: Connection, payer: PublicKey, sender: PublicKey, receiver: PublicKey, srcEid: number, nonce: string, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<TransactionInstruction | null>;
    getVerifyIXAccountMetaForCPI(packet: PacketV1Codec, receiveLibrary: PublicKey): AccountMeta[];
    /***
     * resetConfig is only supported by ULN
     */
    /**
     * snapshotConfig is only supported by ULN
     */
    /**
     * @param composer. The composer is usually the PDA of the app's ID. It depends on the oapp's implementation.
     */
    /**
     * @param composer. The composer is usually the PDA of the app's ID. It depends on the oapp's implementation.
     */
    getRegisterOappIxAccountMetaForCPI(payer: PublicKey, oapp: PublicKey): AccountMeta[];
    getSkipIxAccountMetaForCPI(receiver: PublicKey, sender: Uint8Array, srcEid: number, nonce: number): AccountMeta[];
    isDefaultSendLibrary(connection: Connection, messageLibProgram: PublicKey, dstEid: number, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<boolean>;
    isDefaultReceiveLibrary(connection: Connection, messageLibProgram: PublicKey, srcEid: number, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<boolean>;
    getSetting(connection: Connection, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<EndpointSettings | null>;
    /**
     *
     * @param messageLib  It is a PDA of the message library program
     */
    getMessageLibInfo(connection: Connection, messageLibProgram: PublicKey, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<MessageLibInfo | null>;
    getDefaultReceiveLibrary(connection: Connection, srcEid: number, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<{
        msgLib: PublicKey;
        owner?: PublicKey;
    } | null>;
    getDefaultSendLibrary(connection: Connection, dstEid: number, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<{
        msgLib: PublicKey;
        owner?: PublicKey;
    } | null>;
    /**
     * get app configured send library
     * 2 RPC calls
     */
    getSendLibrary(connection: Connection, oappPda: PublicKey, dstEid: number, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<{
        msgLib: PublicKey;
        programId?: PublicKey;
        isDefault: boolean;
    } | null>;
    /**
     * get app configured receive library
     */
    getReceiveLibrary(connection: Connection, oappPda: PublicKey, srcEid: number, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<{
        msgLib: PublicKey;
        programId?: PublicKey;
        isDefault: boolean;
        timeout: {
            msgLib: PublicKey;
            expiry: bigint;
        } | null;
    } | null>;
    getInboundPayloadHash(connection: Connection, receiver: PublicKey, srcEid: number, sender: Uint8Array, nonce: number, _payloadHash: Uint8Array, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<PayloadHash | null>;
    getComposedMessageState(connection: Connection, from: PublicKey, params: SendComposeParams, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<ComposeMessageState | null>;
    getNonce(connection: Connection, oappIDPDA: PublicKey, remoteEid: number, remoteOappAddr: Uint8Array, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<Nonce$1 | null>;
    getPendingInboundNonce(connection: Connection, oappIDPDA: PublicKey, remoteEid: number, remoteOappAddr: Uint8Array, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<PendingInboundNonce | null>;
    getMessageLibVersion(connection: Connection, payer: PublicKey, messageLibProgram: PublicKey, commitment?: Commitment): Promise<Version$1 | null>;
    transferAdmin(connection: Connection, admin: PublicKey, newAdmin: PublicKey, commitment?: Commitment): Promise<TransactionInstruction | null>;
}

declare const endpoint_DefaultMessageLib: typeof DefaultMessageLib;
type endpoint_Endpoint = Endpoint;
declare const endpoint_Endpoint: typeof Endpoint;
declare const endpoint_EventEmitDiscriminator: typeof EventEmitDiscriminator;
declare namespace endpoint {
  export { endpoint_DefaultMessageLib as DefaultMessageLib, endpoint_Endpoint as Endpoint, endpoint_EventEmitDiscriminator as EventEmitDiscriminator, PROGRAM_ID$6 as PROGRAM_ID, index$r as accounts, index$q as errors, index$n as events, index$p as instructions, index$o as types };
}

declare class SimpleMessageLib implements MessageLibInterface {
    program: PublicKey;
    deriver: MessageLibPDADeriver;
    constructor(program: PublicKey);
    initSimpleMessageLib(endpointProgram: PublicKey, payer: PublicKey, admin: PublicKey, eid: number, nativeFee: number, lzTokenFee?: number): TransactionInstruction;
    setWhitelistCaller(admin: PublicKey, newCaller: PublicKey): TransactionInstruction;
    isWhiteListed(connection: Connection, caller: PublicKey, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<boolean>;
    getWhiteListCaller(connection: Connection, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<PublicKey>;
    validatePacket(_connection: Connection, endpointProgram: PublicKey, payer: PublicKey, encodedPacket: Uint8Array): TransactionInstruction;
    /***
     * Get the account meta of the send instruction for CPI(Cross-Program Invocation )
     */
    getSendIXAccountMetaForCPI(_connection: Connection, payer: PublicKey, _path: PacketPath): Promise<AccountMeta[]>;
    getQuoteIXAccountMetaForCPI(_connection: Connection, _payer: PublicKey, _path: PacketPath, _commitment?: Commitment): Promise<AccountMeta[]>;
    /***
     * Get the account meta of the send instruction for CPI(Cross-Program Invocation )
     */
    getInitConfigIXAccountMetaForCPI(payer: PublicKey, oappID: PublicKey, eid: number): AccountMeta[];
    getSetConfigIXAccountMetaForCPI(endpointProgram: PublicKey, oappID: PublicKey, eid: number): Promise<AccountMeta[]>;
}

type simpleMessageLib_SimpleMessageLib = SimpleMessageLib;
declare const simpleMessageLib_SimpleMessageLib: typeof SimpleMessageLib;
declare namespace simpleMessageLib {
  export { PROGRAM_ID$5 as PROGRAM_ID, simpleMessageLib_SimpleMessageLib as SimpleMessageLib, index$m as accounts, index$l as errors, index$k as instructions, index$j as types };
}

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type Multisig = {
    signers: number[][];
    quorum: number;
};
/**
 * @category userTypes
 * @category generated
 */
declare const multisigBeet: beet.FixableBeetArgsStruct<Multisig>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type Acl$1 = {
    allowList: web3.PublicKey[];
    denyList: web3.PublicKey[];
};
/**
 * @category userTypes
 * @category generated
 */
declare const aclBeet$1: beet.FixableBeetArgsStruct<Acl$1>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type DstConfig$1 = {
    eid: number;
    dstGas: number;
    multiplierBps: beet.COption<number>;
    floorMarginUsd: beet.COption<beet.bignum>;
};
/**
 * @category userTypes
 * @category generated
 */
declare const dstConfigBeet$1: beet.FixableBeetArgsStruct<DstConfig$1>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * Arguments used to create {@link DvnConfig}
 * @category Accounts
 * @category generated
 */
type DvnConfigArgs = {
    vid: number;
    bump: number;
    multisig: Multisig;
    acl: Acl$1;
    paused: boolean;
    msglibs: web3.PublicKey[];
    admins: web3.PublicKey[];
    priceFeed: web3.PublicKey;
    dstConfigs: DstConfig$1[];
    defaultMultiplierBps: number;
};
declare const dvnConfigDiscriminator: number[];
/**
 * Holds the data for the {@link DvnConfig} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
declare class DvnConfig implements DvnConfigArgs {
    readonly vid: number;
    readonly bump: number;
    readonly multisig: Multisig;
    readonly acl: Acl$1;
    readonly paused: boolean;
    readonly msglibs: web3.PublicKey[];
    readonly admins: web3.PublicKey[];
    readonly priceFeed: web3.PublicKey;
    readonly dstConfigs: DstConfig$1[];
    readonly defaultMultiplierBps: number;
    private constructor();
    /**
     * Creates a {@link DvnConfig} instance from the provided args.
     */
    static fromArgs(args: DvnConfigArgs): DvnConfig;
    /**
     * Deserializes the {@link DvnConfig} from the data of the provided {@link web3.AccountInfo}.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static fromAccountInfo(accountInfo: web3.AccountInfo<Buffer>, offset?: number): [DvnConfig, number];
    /**
     * Retrieves the account info from the provided address and deserializes
     * the {@link DvnConfig} from its data.
     *
     * @throws Error if no account info is found at the address or if deserialization fails
     */
    static fromAccountAddress(connection: web3.Connection, address: web3.PublicKey, commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig): Promise<DvnConfig>;
    /**
     * Provides a {@link web3.Connection.getProgramAccounts} config builder,
     * to fetch accounts matching filters that can be specified via that builder.
     *
     * @param programId - the program that owns the accounts we are filtering
     */
    static gpaBuilder(programId?: web3.PublicKey): beetSolana.GpaBuilder<DvnConfigArgs & {
        accountDiscriminator: number[];
    }>;
    /**
     * Deserializes the {@link DvnConfig} from the provided data Buffer.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static deserialize(buf: Buffer, offset?: number): [DvnConfig, number];
    /**
     * Serializes the {@link DvnConfig} into a Buffer.
     * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
     */
    serialize(): [Buffer, number];
    /**
     * Returns the byteSize of a {@link Buffer} holding the serialized data of
     * {@link DvnConfig} for the provided args.
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     */
    static byteSize(args: DvnConfigArgs): number;
    /**
     * Fetches the minimum balance needed to exempt an account holding
     * {@link DvnConfig} data from rent
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     * @param connection used to retrieve the rent exemption information
     */
    static getMinimumBalanceForRentExemption(args: DvnConfigArgs, connection: web3.Connection, commitment?: web3.Commitment): Promise<number>;
    /**
     * Returns a readable version of {@link DvnConfig} properties
     * and can be used to convert to JSON and/or logging
     */
    pretty(): {
        vid: number;
        bump: number;
        multisig: Multisig;
        acl: Acl$1;
        paused: boolean;
        msglibs: web3.PublicKey[];
        admins: web3.PublicKey[];
        priceFeed: string;
        dstConfigs: DstConfig$1[];
        defaultMultiplierBps: number;
    };
}
/**
 * @category Accounts
 * @category generated
 */
declare const dvnConfigBeet: beet.FixableBeetStruct<DvnConfig, DvnConfigArgs & {
    accountDiscriminator: number[];
}>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * Arguments used to create {@link ExecuteHash}
 * @category Accounts
 * @category generated
 */
type ExecuteHashArgs = {
    expiration: beet.bignum;
    bump: number;
};
declare const executeHashDiscriminator: number[];
/**
 * Holds the data for the {@link ExecuteHash} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
declare class ExecuteHash implements ExecuteHashArgs {
    readonly expiration: beet.bignum;
    readonly bump: number;
    private constructor();
    /**
     * Creates a {@link ExecuteHash} instance from the provided args.
     */
    static fromArgs(args: ExecuteHashArgs): ExecuteHash;
    /**
     * Deserializes the {@link ExecuteHash} from the data of the provided {@link web3.AccountInfo}.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static fromAccountInfo(accountInfo: web3.AccountInfo<Buffer>, offset?: number): [ExecuteHash, number];
    /**
     * Retrieves the account info from the provided address and deserializes
     * the {@link ExecuteHash} from its data.
     *
     * @throws Error if no account info is found at the address or if deserialization fails
     */
    static fromAccountAddress(connection: web3.Connection, address: web3.PublicKey, commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig): Promise<ExecuteHash>;
    /**
     * Provides a {@link web3.Connection.getProgramAccounts} config builder,
     * to fetch accounts matching filters that can be specified via that builder.
     *
     * @param programId - the program that owns the accounts we are filtering
     */
    static gpaBuilder(programId?: web3.PublicKey): beetSolana.GpaBuilder<{
        bump: any;
        accountDiscriminator: any;
        expiration: any;
    }>;
    /**
     * Deserializes the {@link ExecuteHash} from the provided data Buffer.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static deserialize(buf: Buffer, offset?: number): [ExecuteHash, number];
    /**
     * Serializes the {@link ExecuteHash} into a Buffer.
     * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
     */
    serialize(): [Buffer, number];
    /**
     * Returns the byteSize of a {@link Buffer} holding the serialized data of
     * {@link ExecuteHash}
     */
    static get byteSize(): number;
    /**
     * Fetches the minimum balance needed to exempt an account holding
     * {@link ExecuteHash} data from rent
     *
     * @param connection used to retrieve the rent exemption information
     */
    static getMinimumBalanceForRentExemption(connection: web3.Connection, commitment?: web3.Commitment): Promise<number>;
    /**
     * Determines if the provided {@link Buffer} has the correct byte size to
     * hold {@link ExecuteHash} data.
     */
    static hasCorrectByteSize(buf: Buffer, offset?: number): boolean;
    /**
     * Returns a readable version of {@link ExecuteHash} properties
     * and can be used to convert to JSON and/or logging
     */
    pretty(): {
        expiration: number | {
            toNumber: () => number;
        };
        bump: number;
    };
}
/**
 * @category Accounts
 * @category generated
 */
declare const executeHashBeet: beet.BeetStruct<ExecuteHash, ExecuteHashArgs & {
    accountDiscriminator: number[];
}>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type UlnConfig$1 = {
    confirmations: beet.bignum;
    requiredDvnCount: number;
    optionalDvnCount: number;
    optionalDvnThreshold: number;
    requiredDvns: web3.PublicKey[];
    optionalDvns: web3.PublicKey[];
};
/**
 * @category userTypes
 * @category generated
 */
declare const ulnConfigBeet$1: beet.FixableBeetArgsStruct<UlnConfig$1>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * Arguments used to create {@link ReceiveConfig}
 * @category Accounts
 * @category generated
 */
type ReceiveConfigArgs$1 = {
    bump: number;
    uln: UlnConfig$1;
};
declare const receiveConfigDiscriminator$1: number[];
/**
 * Holds the data for the {@link ReceiveConfig} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
declare class ReceiveConfig$1 implements ReceiveConfigArgs$1 {
    readonly bump: number;
    readonly uln: UlnConfig$1;
    private constructor();
    /**
     * Creates a {@link ReceiveConfig} instance from the provided args.
     */
    static fromArgs(args: ReceiveConfigArgs$1): ReceiveConfig$1;
    /**
     * Deserializes the {@link ReceiveConfig} from the data of the provided {@link web3.AccountInfo}.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static fromAccountInfo(accountInfo: web3.AccountInfo<Buffer>, offset?: number): [ReceiveConfig$1, number];
    /**
     * Retrieves the account info from the provided address and deserializes
     * the {@link ReceiveConfig} from its data.
     *
     * @throws Error if no account info is found at the address or if deserialization fails
     */
    static fromAccountAddress(connection: web3.Connection, address: web3.PublicKey, commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig): Promise<ReceiveConfig$1>;
    /**
     * Provides a {@link web3.Connection.getProgramAccounts} config builder,
     * to fetch accounts matching filters that can be specified via that builder.
     *
     * @param programId - the program that owns the accounts we are filtering
     */
    static gpaBuilder(programId?: web3.PublicKey): beetSolana.GpaBuilder<ReceiveConfigArgs$1 & {
        accountDiscriminator: number[];
    }>;
    /**
     * Deserializes the {@link ReceiveConfig} from the provided data Buffer.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static deserialize(buf: Buffer, offset?: number): [ReceiveConfig$1, number];
    /**
     * Serializes the {@link ReceiveConfig} into a Buffer.
     * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
     */
    serialize(): [Buffer, number];
    /**
     * Returns the byteSize of a {@link Buffer} holding the serialized data of
     * {@link ReceiveConfig} for the provided args.
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     */
    static byteSize(args: ReceiveConfigArgs$1): number;
    /**
     * Fetches the minimum balance needed to exempt an account holding
     * {@link ReceiveConfig} data from rent
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     * @param connection used to retrieve the rent exemption information
     */
    static getMinimumBalanceForRentExemption(args: ReceiveConfigArgs$1, connection: web3.Connection, commitment?: web3.Commitment): Promise<number>;
    /**
     * Returns a readable version of {@link ReceiveConfig} properties
     * and can be used to convert to JSON and/or logging
     */
    pretty(): {
        bump: number;
        uln: UlnConfig$1;
    };
}
/**
 * @category Accounts
 * @category generated
 */
declare const receiveConfigBeet$1: beet.FixableBeetStruct<ReceiveConfig$1, ReceiveConfigArgs$1 & {
    accountDiscriminator: number[];
}>;

declare const accountProviders$3: {
    DvnConfig: typeof DvnConfig;
    ExecuteHash: typeof ExecuteHash;
    ReceiveConfig: typeof ReceiveConfig$1;
};

type index$i_DvnConfig = DvnConfig;
declare const index$i_DvnConfig: typeof DvnConfig;
type index$i_DvnConfigArgs = DvnConfigArgs;
type index$i_ExecuteHash = ExecuteHash;
declare const index$i_ExecuteHash: typeof ExecuteHash;
type index$i_ExecuteHashArgs = ExecuteHashArgs;
declare const index$i_dvnConfigBeet: typeof dvnConfigBeet;
declare const index$i_dvnConfigDiscriminator: typeof dvnConfigDiscriminator;
declare const index$i_executeHashBeet: typeof executeHashBeet;
declare const index$i_executeHashDiscriminator: typeof executeHashDiscriminator;
declare namespace index$i {
  export { index$i_DvnConfig as DvnConfig, type index$i_DvnConfigArgs as DvnConfigArgs, index$i_ExecuteHash as ExecuteHash, type index$i_ExecuteHashArgs as ExecuteHashArgs, ReceiveConfig$1 as ReceiveConfig, type ReceiveConfigArgs$1 as ReceiveConfigArgs, accountProviders$3 as accountProviders, index$i_dvnConfigBeet as dvnConfigBeet, index$i_dvnConfigDiscriminator as dvnConfigDiscriminator, index$i_executeHashBeet as executeHashBeet, index$i_executeHashDiscriminator as executeHashDiscriminator, receiveConfigBeet$1 as receiveConfigBeet, receiveConfigDiscriminator$1 as receiveConfigDiscriminator };
}

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */
type ErrorWithCode$2 = Error & {
    code: number;
};
type MaybeErrorWithCode$2 = ErrorWithCode$2 | null | undefined;
/**
 * InvalidSignatureLen: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidSignatureLenError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * NotAdmin: ''
 *
 * @category Errors
 * @category generated
 */
declare class NotAdminError$1 extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * MsgLibNotAllowed: ''
 *
 * @category Errors
 * @category generated
 */
declare class MsgLibNotAllowedError$1 extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidQuorum: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidQuorumError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidSignersLen: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidSignersLenError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * UniqueOwners: ''
 *
 * @category Errors
 * @category generated
 */
declare class UniqueOwnersError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * SignatureError: ''
 *
 * @category Errors
 * @category generated
 */
declare class SignatureErrorError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * SignerNotInCommittee: ''
 *
 * @category Errors
 * @category generated
 */
declare class SignerNotInCommitteeError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * TooManyAdmins: ''
 *
 * @category Errors
 * @category generated
 */
declare class TooManyAdminsError$1 extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * TooManyOptionTypes: ''
 *
 * @category Errors
 * @category generated
 */
declare class TooManyOptionTypesError$1 extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * DuplicateSignature: ''
 *
 * @category Errors
 * @category generated
 */
declare class DuplicateSignatureError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * Expired: ''
 *
 * @category Errors
 * @category generated
 */
declare class ExpiredError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidVid: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidVidError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * Paused: ''
 *
 * @category Errors
 * @category generated
 */
declare class PausedError$1 extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * UnexpiredExecuteHash: ''
 *
 * @category Errors
 * @category generated
 */
declare class UnexpiredExecuteHashError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidAmount: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidAmountError$1 extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * EidNotSupported: ''
 *
 * @category Errors
 * @category generated
 */
declare class EidNotSupportedError$1 extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * Attempts to resolve a custom program error from the provided error code.
 * @category Errors
 * @category generated
 */
declare function errorFromCode$2(code: number): MaybeErrorWithCode$2;
/**
 * Attempts to resolve a custom program error from the provided error name, i.e. 'Unauthorized'.
 * @category Errors
 * @category generated
 */
declare function errorFromName$2(name: string): MaybeErrorWithCode$2;

type index$h_DuplicateSignatureError = DuplicateSignatureError;
declare const index$h_DuplicateSignatureError: typeof DuplicateSignatureError;
type index$h_ExpiredError = ExpiredError;
declare const index$h_ExpiredError: typeof ExpiredError;
type index$h_InvalidQuorumError = InvalidQuorumError;
declare const index$h_InvalidQuorumError: typeof InvalidQuorumError;
type index$h_InvalidSignatureLenError = InvalidSignatureLenError;
declare const index$h_InvalidSignatureLenError: typeof InvalidSignatureLenError;
type index$h_InvalidSignersLenError = InvalidSignersLenError;
declare const index$h_InvalidSignersLenError: typeof InvalidSignersLenError;
type index$h_InvalidVidError = InvalidVidError;
declare const index$h_InvalidVidError: typeof InvalidVidError;
type index$h_SignatureErrorError = SignatureErrorError;
declare const index$h_SignatureErrorError: typeof SignatureErrorError;
type index$h_SignerNotInCommitteeError = SignerNotInCommitteeError;
declare const index$h_SignerNotInCommitteeError: typeof SignerNotInCommitteeError;
type index$h_UnexpiredExecuteHashError = UnexpiredExecuteHashError;
declare const index$h_UnexpiredExecuteHashError: typeof UnexpiredExecuteHashError;
type index$h_UniqueOwnersError = UniqueOwnersError;
declare const index$h_UniqueOwnersError: typeof UniqueOwnersError;
declare namespace index$h {
  export { index$h_DuplicateSignatureError as DuplicateSignatureError, EidNotSupportedError$1 as EidNotSupportedError, index$h_ExpiredError as ExpiredError, InvalidAmountError$1 as InvalidAmountError, index$h_InvalidQuorumError as InvalidQuorumError, index$h_InvalidSignatureLenError as InvalidSignatureLenError, index$h_InvalidSignersLenError as InvalidSignersLenError, index$h_InvalidVidError as InvalidVidError, MsgLibNotAllowedError$1 as MsgLibNotAllowedError, NotAdminError$1 as NotAdminError, PausedError$1 as PausedError, index$h_SignatureErrorError as SignatureErrorError, index$h_SignerNotInCommitteeError as SignerNotInCommitteeError, TooManyAdminsError$1 as TooManyAdminsError, TooManyOptionTypesError$1 as TooManyOptionTypesError, index$h_UnexpiredExecuteHashError as UnexpiredExecuteHashError, index$h_UniqueOwnersError as UniqueOwnersError, errorFromCode$2 as errorFromCode, errorFromName$2 as errorFromName };
}

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type CloseExecuteParams = {
    digestHash: number[];
};
/**
 * @category userTypes
 * @category generated
 */
declare const closeExecuteParamsBeet: beet.BeetArgsStruct<CloseExecuteParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category CloseExecute
 * @category generated
 */
type CloseExecuteInstructionArgs = {
    params: CloseExecuteParams;
};
/**
 * @category Instructions
 * @category CloseExecute
 * @category generated
 */
declare const closeExecuteStruct: beet.BeetArgsStruct<CloseExecuteInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _closeExecute_ instruction
 *
 * @property [**signer**] admin
 * @property [_writable_] config
 * @property [_writable_] executeHash
 * @category Instructions
 * @category CloseExecute
 * @category generated
 */
type CloseExecuteInstructionAccounts = {
    admin: web3.PublicKey;
    config: web3.PublicKey;
    executeHash: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const closeExecuteInstructionDiscriminator: number[];
/**
 * Creates a _CloseExecute_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category CloseExecute
 * @category generated
 */
declare function createCloseExecuteInstruction(accounts: CloseExecuteInstructionAccounts, args: CloseExecuteInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _CloseExecute_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category CloseExecute
 * @category generated
 */
declare function createCloseExecuteInstructionAccounts(accounts: CloseExecuteInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type InitDvnParams = {
    vid: number;
    msglibs: web3.PublicKey[];
    priceFeed: web3.PublicKey;
    signers: number[][];
    quorum: number;
    admins: web3.PublicKey[];
};
/**
 * @category userTypes
 * @category generated
 */
declare const initDvnParamsBeet: beet.FixableBeetArgsStruct<InitDvnParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category InitDvn
 * @category generated
 */
type InitDvnInstructionArgs = {
    params: InitDvnParams;
};
/**
 * @category Instructions
 * @category InitDvn
 * @category generated
 */
declare const initDvnStruct: beet.FixableBeetArgsStruct<InitDvnInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _initDvn_ instruction
 *
 * @property [_writable_, **signer**] payer
 * @property [_writable_] config
 * @category Instructions
 * @category InitDvn
 * @category generated
 */
type InitDvnInstructionAccounts = {
    payer: web3.PublicKey;
    config: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const initDvnInstructionDiscriminator: number[];
/**
 * Creates a _InitDvn_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category InitDvn
 * @category generated
 */
declare function createInitDvnInstruction(accounts: InitDvnInstructionAccounts, args: InitDvnInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _InitDvn_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category InitDvn
 * @category generated
 */
declare function createInitDvnInstructionAccounts(accounts: InitDvnInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type TransactionAccount = {
    pubkey: web3.PublicKey;
    isSigner: boolean;
    isWritable: boolean;
};
/**
 * @category userTypes
 * @category generated
 */
declare const transactionAccountBeet: beet.BeetArgsStruct<TransactionAccount>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type ExecuteTransactionDigest = {
    vid: number;
    programId: web3.PublicKey;
    accounts: TransactionAccount[];
    data: Uint8Array;
    expiration: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const executeTransactionDigestBeet: beet.FixableBeetArgsStruct<ExecuteTransactionDigest>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type InvokeParams = {
    digest: ExecuteTransactionDigest;
    signatures: number[][];
};
/**
 * @category userTypes
 * @category generated
 */
declare const invokeParamsBeet: beet.FixableBeetArgsStruct<InvokeParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category Invoke
 * @category generated
 */
type InvokeInstructionArgs = {
    params: InvokeParams;
};
/**
 * @category Instructions
 * @category Invoke
 * @category generated
 */
declare const invokeStruct: beet.FixableBeetArgsStruct<InvokeInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _invoke_ instruction
 *
 * @property [_writable_, **signer**] signer
 * @property [_writable_] config
 * @property [_writable_] executeHash
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category Invoke
 * @category generated
 */
type InvokeInstructionAccounts = {
    signer: web3.PublicKey;
    config: web3.PublicKey;
    executeHash: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const invokeInstructionDiscriminator: number[];
/**
 * Creates a _Invoke_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category Invoke
 * @category generated
 */
declare function createInvokeInstruction(accounts: InvokeInstructionAccounts, args: InvokeInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _Invoke_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category Invoke
 * @category generated
 */
declare function createInvokeInstructionAccounts(accounts: InvokeInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type LzOption$1 = {
    optionType: number;
    params: Uint8Array;
};
/**
 * @category userTypes
 * @category generated
 */
declare const lzOptionBeet$1: beet.FixableBeetArgsStruct<LzOption$1>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type QuoteDvnParams = {
    msglib: web3.PublicKey;
    dstEid: number;
    sender: web3.PublicKey;
    packetHeader: Uint8Array;
    payloadHash: number[];
    confirmations: beet.bignum;
    options: LzOption$1[];
};
/**
 * @category userTypes
 * @category generated
 */
declare const quoteDvnParamsBeet: beet.FixableBeetArgsStruct<QuoteDvnParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category QuoteDvn
 * @category generated
 */
type QuoteDvnInstructionArgs = {
    params: QuoteDvnParams;
};
/**
 * @category Instructions
 * @category QuoteDvn
 * @category generated
 */
declare const quoteDvnStruct: beet.FixableBeetArgsStruct<QuoteDvnInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _quoteDvn_ instruction
 *
 * @property [] dvnConfig
 * @property [] priceFeedProgram
 * @property [] priceFeedConfig
 * @category Instructions
 * @category QuoteDvn
 * @category generated
 */
type QuoteDvnInstructionAccounts = {
    dvnConfig: web3.PublicKey;
    priceFeedProgram: web3.PublicKey;
    priceFeedConfig: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const quoteDvnInstructionDiscriminator: number[];
/**
 * Creates a _QuoteDvn_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category QuoteDvn
 * @category generated
 */
declare function createQuoteDvnInstruction(accounts: QuoteDvnInstructionAccounts, args: QuoteDvnInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _QuoteDvn_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category QuoteDvn
 * @category generated
 */
declare function createQuoteDvnInstructionAccounts(accounts: QuoteDvnInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * This type is used to derive the {@link AdminConfig} type as well as the de/serializer.
 * However don't refer to it in your code but use the {@link AdminConfig} type instead.
 *
 * @category userTypes
 * @category enums
 * @category generated
 * @private
 */
type AdminConfigRecord = {
    Admins: {
        fields: [web3.PublicKey[]];
    };
    DefaultMultiplierBps: {
        fields: [number];
    };
    DstConfigs: {
        fields: [DstConfig$1[]];
    };
    PriceFeed: {
        fields: [web3.PublicKey];
    };
};
/**
 * Union type respresenting the AdminConfig data enum defined in Rust.
 *
 * NOTE: that it includes a `__kind` property which allows to narrow types in
 * switch/if statements.
 * Additionally `isAdminConfig*` type guards are exposed below to narrow to a specific variant.
 *
 * @category userTypes
 * @category enums
 * @category generated
 */
type AdminConfig = beet.DataEnumKeyAsKind<AdminConfigRecord>;
declare const isAdminConfigAdmins: (x: AdminConfig) => x is {
    __kind: "Admins";
} & Omit<{
    fields: [web3.PublicKey[]];
}, "void"> & {
    __kind: 'Admins';
};
declare const isAdminConfigDefaultMultiplierBps: (x: AdminConfig) => x is {
    __kind: "DefaultMultiplierBps";
} & Omit<{
    fields: [number];
}, "void"> & {
    __kind: 'DefaultMultiplierBps';
};
declare const isAdminConfigDstConfigs: (x: AdminConfig) => x is {
    __kind: "DstConfigs";
} & Omit<{
    fields: [DstConfig$1[]];
}, "void"> & {
    __kind: 'DstConfigs';
};
declare const isAdminConfigPriceFeed: (x: AdminConfig) => x is {
    __kind: "PriceFeed";
} & Omit<{
    fields: [web3.PublicKey];
}, "void"> & {
    __kind: 'PriceFeed';
};
/**
 * @category userTypes
 * @category generated
 */
declare const adminConfigBeet: beet.FixableBeet<AdminConfig, AdminConfig>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type SetConfigParams$1 = {
    config: AdminConfig;
};
/**
 * @category userTypes
 * @category generated
 */
declare const setConfigParamsBeet$1: beet.FixableBeetArgsStruct<SetConfigParams$1>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category SetConfig
 * @category generated
 */
type SetConfigInstructionArgs$1 = {
    params: SetConfigParams$1;
};
/**
 * @category Instructions
 * @category SetConfig
 * @category generated
 */
declare const setConfigStruct$1: beet.FixableBeetArgsStruct<SetConfigInstructionArgs$1 & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _setConfig_ instruction
 *
 * @property [**signer**] admin
 * @property [_writable_] config
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category SetConfig
 * @category generated
 */
type SetConfigInstructionAccounts$1 = {
    admin: web3.PublicKey;
    config: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const setConfigInstructionDiscriminator$1: number[];
/**
 * Creates a _SetConfig_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category SetConfig
 * @category generated
 */
declare function createSetConfigInstruction$1(accounts: SetConfigInstructionAccounts$1, args: SetConfigInstructionArgs$1, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _SetConfig_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category SetConfig
 * @category generated
 */
declare function createSetConfigInstructionAccounts$1(accounts: SetConfigInstructionAccounts$1, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type VerifiableParams = {
    packetHeader: number[];
    payloadHash: number[];
};
/**
 * @category userTypes
 * @category generated
 */
declare const verifiableParamsBeet: beet.BeetArgsStruct<VerifiableParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category Verifiable
 * @category generated
 */
type VerifiableInstructionArgs = {
    params: VerifiableParams;
};
/**
 * @category Instructions
 * @category Verifiable
 * @category generated
 */
declare const verifiableStruct: beet.BeetArgsStruct<VerifiableInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _verifiable_ instruction
 *
 * @property [] nonce
 * @property [] payloadHash
 * @property [] receiveConfig
 * @property [] defaultReceiveConfig
 * @category Instructions
 * @category Verifiable
 * @category generated
 */
type VerifiableInstructionAccounts = {
    nonce: web3.PublicKey;
    payloadHash: web3.PublicKey;
    receiveConfig: web3.PublicKey;
    defaultReceiveConfig: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const verifiableInstructionDiscriminator: number[];
/**
 * Creates a _Verifiable_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category Verifiable
 * @category generated
 */
declare function createVerifiableInstruction(accounts: VerifiableInstructionAccounts, args: VerifiableInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _Verifiable_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category Verifiable
 * @category generated
 */
declare function createVerifiableInstructionAccounts(accounts: VerifiableInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type WithdrawFeeParams = {
    amount: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const withdrawFeeParamsBeet: beet.BeetArgsStruct<WithdrawFeeParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category WithdrawFee
 * @category generated
 */
type WithdrawFeeInstructionArgs = {
    params: WithdrawFeeParams;
};
/**
 * @category Instructions
 * @category WithdrawFee
 * @category generated
 */
declare const withdrawFeeStruct: beet.BeetArgsStruct<WithdrawFeeInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _withdrawFee_ instruction
 *
 * @property [**signer**] admin
 * @property [_writable_] config
 * @property [_writable_] receiver
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category WithdrawFee
 * @category generated
 */
type WithdrawFeeInstructionAccounts = {
    admin: web3.PublicKey;
    config: web3.PublicKey;
    receiver: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const withdrawFeeInstructionDiscriminator: number[];
/**
 * Creates a _WithdrawFee_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category WithdrawFee
 * @category generated
 */
declare function createWithdrawFeeInstruction(accounts: WithdrawFeeInstructionAccounts, args: WithdrawFeeInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _WithdrawFee_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category WithdrawFee
 * @category generated
 */
declare function createWithdrawFeeInstructionAccounts(accounts: WithdrawFeeInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

type index$g_CloseExecuteInstructionAccounts = CloseExecuteInstructionAccounts;
type index$g_CloseExecuteInstructionArgs = CloseExecuteInstructionArgs;
type index$g_InitDvnInstructionAccounts = InitDvnInstructionAccounts;
type index$g_InitDvnInstructionArgs = InitDvnInstructionArgs;
type index$g_InvokeInstructionAccounts = InvokeInstructionAccounts;
type index$g_InvokeInstructionArgs = InvokeInstructionArgs;
type index$g_QuoteDvnInstructionAccounts = QuoteDvnInstructionAccounts;
type index$g_QuoteDvnInstructionArgs = QuoteDvnInstructionArgs;
type index$g_VerifiableInstructionAccounts = VerifiableInstructionAccounts;
type index$g_VerifiableInstructionArgs = VerifiableInstructionArgs;
type index$g_WithdrawFeeInstructionAccounts = WithdrawFeeInstructionAccounts;
type index$g_WithdrawFeeInstructionArgs = WithdrawFeeInstructionArgs;
declare const index$g_closeExecuteInstructionDiscriminator: typeof closeExecuteInstructionDiscriminator;
declare const index$g_closeExecuteStruct: typeof closeExecuteStruct;
declare const index$g_createCloseExecuteInstruction: typeof createCloseExecuteInstruction;
declare const index$g_createCloseExecuteInstructionAccounts: typeof createCloseExecuteInstructionAccounts;
declare const index$g_createInitDvnInstruction: typeof createInitDvnInstruction;
declare const index$g_createInitDvnInstructionAccounts: typeof createInitDvnInstructionAccounts;
declare const index$g_createInvokeInstruction: typeof createInvokeInstruction;
declare const index$g_createInvokeInstructionAccounts: typeof createInvokeInstructionAccounts;
declare const index$g_createQuoteDvnInstruction: typeof createQuoteDvnInstruction;
declare const index$g_createQuoteDvnInstructionAccounts: typeof createQuoteDvnInstructionAccounts;
declare const index$g_createVerifiableInstruction: typeof createVerifiableInstruction;
declare const index$g_createVerifiableInstructionAccounts: typeof createVerifiableInstructionAccounts;
declare const index$g_createWithdrawFeeInstruction: typeof createWithdrawFeeInstruction;
declare const index$g_createWithdrawFeeInstructionAccounts: typeof createWithdrawFeeInstructionAccounts;
declare const index$g_initDvnInstructionDiscriminator: typeof initDvnInstructionDiscriminator;
declare const index$g_initDvnStruct: typeof initDvnStruct;
declare const index$g_invokeInstructionDiscriminator: typeof invokeInstructionDiscriminator;
declare const index$g_invokeStruct: typeof invokeStruct;
declare const index$g_quoteDvnInstructionDiscriminator: typeof quoteDvnInstructionDiscriminator;
declare const index$g_quoteDvnStruct: typeof quoteDvnStruct;
declare const index$g_verifiableInstructionDiscriminator: typeof verifiableInstructionDiscriminator;
declare const index$g_verifiableStruct: typeof verifiableStruct;
declare const index$g_withdrawFeeInstructionDiscriminator: typeof withdrawFeeInstructionDiscriminator;
declare const index$g_withdrawFeeStruct: typeof withdrawFeeStruct;
declare namespace index$g {
  export { type index$g_CloseExecuteInstructionAccounts as CloseExecuteInstructionAccounts, type index$g_CloseExecuteInstructionArgs as CloseExecuteInstructionArgs, type index$g_InitDvnInstructionAccounts as InitDvnInstructionAccounts, type index$g_InitDvnInstructionArgs as InitDvnInstructionArgs, type index$g_InvokeInstructionAccounts as InvokeInstructionAccounts, type index$g_InvokeInstructionArgs as InvokeInstructionArgs, type index$g_QuoteDvnInstructionAccounts as QuoteDvnInstructionAccounts, type index$g_QuoteDvnInstructionArgs as QuoteDvnInstructionArgs, type SetConfigInstructionAccounts$1 as SetConfigInstructionAccounts, type SetConfigInstructionArgs$1 as SetConfigInstructionArgs, type index$g_VerifiableInstructionAccounts as VerifiableInstructionAccounts, type index$g_VerifiableInstructionArgs as VerifiableInstructionArgs, type index$g_WithdrawFeeInstructionAccounts as WithdrawFeeInstructionAccounts, type index$g_WithdrawFeeInstructionArgs as WithdrawFeeInstructionArgs, index$g_closeExecuteInstructionDiscriminator as closeExecuteInstructionDiscriminator, index$g_closeExecuteStruct as closeExecuteStruct, index$g_createCloseExecuteInstruction as createCloseExecuteInstruction, index$g_createCloseExecuteInstructionAccounts as createCloseExecuteInstructionAccounts, index$g_createInitDvnInstruction as createInitDvnInstruction, index$g_createInitDvnInstructionAccounts as createInitDvnInstructionAccounts, index$g_createInvokeInstruction as createInvokeInstruction, index$g_createInvokeInstructionAccounts as createInvokeInstructionAccounts, index$g_createQuoteDvnInstruction as createQuoteDvnInstruction, index$g_createQuoteDvnInstructionAccounts as createQuoteDvnInstructionAccounts, createSetConfigInstruction$1 as createSetConfigInstruction, createSetConfigInstructionAccounts$1 as createSetConfigInstructionAccounts, index$g_createVerifiableInstruction as createVerifiableInstruction, index$g_createVerifiableInstructionAccounts as createVerifiableInstructionAccounts, index$g_createWithdrawFeeInstruction as createWithdrawFeeInstruction, index$g_createWithdrawFeeInstructionAccounts as createWithdrawFeeInstructionAccounts, index$g_initDvnInstructionDiscriminator as initDvnInstructionDiscriminator, index$g_initDvnStruct as initDvnStruct, index$g_invokeInstructionDiscriminator as invokeInstructionDiscriminator, index$g_invokeStruct as invokeStruct, index$g_quoteDvnInstructionDiscriminator as quoteDvnInstructionDiscriminator, index$g_quoteDvnStruct as quoteDvnStruct, setConfigInstructionDiscriminator$1 as setConfigInstructionDiscriminator, setConfigStruct$1 as setConfigStruct, index$g_verifiableInstructionDiscriminator as verifiableInstructionDiscriminator, index$g_verifiableStruct as verifiableStruct, index$g_withdrawFeeInstructionDiscriminator as withdrawFeeInstructionDiscriminator, index$g_withdrawFeeStruct as withdrawFeeStruct };
}

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * This type is used to derive the {@link MultisigConfig} type as well as the de/serializer.
 * However don't refer to it in your code but use the {@link MultisigConfig} type instead.
 *
 * @category userTypes
 * @category enums
 * @category generated
 * @private
 */
type MultisigConfigRecord = {
    Admins: {
        fields: [web3.PublicKey[]];
    };
    Allowlist: {
        fields: [web3.PublicKey[]];
    };
    Denylist: {
        fields: [web3.PublicKey[]];
    };
    Msglibs: {
        fields: [web3.PublicKey[]];
    };
    Paused: {
        fields: [boolean];
    };
    Quorum: {
        fields: [number];
    };
    Signers: {
        fields: [number[][]];
    };
};
/**
 * Union type respresenting the MultisigConfig data enum defined in Rust.
 *
 * NOTE: that it includes a `__kind` property which allows to narrow types in
 * switch/if statements.
 * Additionally `isMultisigConfig*` type guards are exposed below to narrow to a specific variant.
 *
 * @category userTypes
 * @category enums
 * @category generated
 */
type MultisigConfig = beet.DataEnumKeyAsKind<MultisigConfigRecord>;
declare const isMultisigConfigAdmins: (x: MultisigConfig) => x is {
    __kind: "Admins";
} & Omit<{
    fields: [web3.PublicKey[]];
}, "void"> & {
    __kind: 'Admins';
};
declare const isMultisigConfigAllowlist: (x: MultisigConfig) => x is {
    __kind: "Allowlist";
} & Omit<{
    fields: [web3.PublicKey[]];
}, "void"> & {
    __kind: 'Allowlist';
};
declare const isMultisigConfigDenylist: (x: MultisigConfig) => x is {
    __kind: "Denylist";
} & Omit<{
    fields: [web3.PublicKey[]];
}, "void"> & {
    __kind: 'Denylist';
};
declare const isMultisigConfigMsglibs: (x: MultisigConfig) => x is {
    __kind: "Msglibs";
} & Omit<{
    fields: [web3.PublicKey[]];
}, "void"> & {
    __kind: 'Msglibs';
};
declare const isMultisigConfigPaused: (x: MultisigConfig) => x is {
    __kind: "Paused";
} & Omit<{
    fields: [boolean];
}, "void"> & {
    __kind: 'Paused';
};
declare const isMultisigConfigQuorum: (x: MultisigConfig) => x is {
    __kind: "Quorum";
} & Omit<{
    fields: [number];
}, "void"> & {
    __kind: 'Quorum';
};
declare const isMultisigConfigSigners: (x: MultisigConfig) => x is {
    __kind: "Signers";
} & Omit<{
    fields: [number[][]];
}, "void"> & {
    __kind: 'Signers';
};
/**
 * @category userTypes
 * @category generated
 */
declare const multisigConfigBeet: beet.FixableBeet<MultisigConfig, MultisigConfig>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category enums
 * @category generated
 */
declare enum VerificationState {
    Verifying = 0,
    Verifiable = 1,
    Verified = 2,
    NotInitializable = 3,
    VerifiableButCapExceeded = 4
}
/**
 * @category userTypes
 * @category generated
 */
declare const verificationStateBeet: beet.FixedSizeBeet<VerificationState, VerificationState>;

type index$f_AdminConfig = AdminConfig;
type index$f_AdminConfigRecord = AdminConfigRecord;
type index$f_CloseExecuteParams = CloseExecuteParams;
type index$f_ExecuteTransactionDigest = ExecuteTransactionDigest;
type index$f_InitDvnParams = InitDvnParams;
type index$f_InvokeParams = InvokeParams;
type index$f_Multisig = Multisig;
type index$f_MultisigConfig = MultisigConfig;
type index$f_MultisigConfigRecord = MultisigConfigRecord;
type index$f_QuoteDvnParams = QuoteDvnParams;
type index$f_TransactionAccount = TransactionAccount;
type index$f_VerifiableParams = VerifiableParams;
type index$f_VerificationState = VerificationState;
declare const index$f_VerificationState: typeof VerificationState;
type index$f_WithdrawFeeParams = WithdrawFeeParams;
declare const index$f_adminConfigBeet: typeof adminConfigBeet;
declare const index$f_closeExecuteParamsBeet: typeof closeExecuteParamsBeet;
declare const index$f_executeTransactionDigestBeet: typeof executeTransactionDigestBeet;
declare const index$f_initDvnParamsBeet: typeof initDvnParamsBeet;
declare const index$f_invokeParamsBeet: typeof invokeParamsBeet;
declare const index$f_isAdminConfigAdmins: typeof isAdminConfigAdmins;
declare const index$f_isAdminConfigDefaultMultiplierBps: typeof isAdminConfigDefaultMultiplierBps;
declare const index$f_isAdminConfigDstConfigs: typeof isAdminConfigDstConfigs;
declare const index$f_isAdminConfigPriceFeed: typeof isAdminConfigPriceFeed;
declare const index$f_isMultisigConfigAdmins: typeof isMultisigConfigAdmins;
declare const index$f_isMultisigConfigAllowlist: typeof isMultisigConfigAllowlist;
declare const index$f_isMultisigConfigDenylist: typeof isMultisigConfigDenylist;
declare const index$f_isMultisigConfigMsglibs: typeof isMultisigConfigMsglibs;
declare const index$f_isMultisigConfigPaused: typeof isMultisigConfigPaused;
declare const index$f_isMultisigConfigQuorum: typeof isMultisigConfigQuorum;
declare const index$f_isMultisigConfigSigners: typeof isMultisigConfigSigners;
declare const index$f_multisigBeet: typeof multisigBeet;
declare const index$f_multisigConfigBeet: typeof multisigConfigBeet;
declare const index$f_quoteDvnParamsBeet: typeof quoteDvnParamsBeet;
declare const index$f_transactionAccountBeet: typeof transactionAccountBeet;
declare const index$f_verifiableParamsBeet: typeof verifiableParamsBeet;
declare const index$f_verificationStateBeet: typeof verificationStateBeet;
declare const index$f_withdrawFeeParamsBeet: typeof withdrawFeeParamsBeet;
declare namespace index$f {
  export { type Acl$1 as Acl, type index$f_AdminConfig as AdminConfig, type index$f_AdminConfigRecord as AdminConfigRecord, type index$f_CloseExecuteParams as CloseExecuteParams, type DstConfig$1 as DstConfig, type index$f_ExecuteTransactionDigest as ExecuteTransactionDigest, type index$f_InitDvnParams as InitDvnParams, type index$f_InvokeParams as InvokeParams, type LzOption$1 as LzOption, type index$f_Multisig as Multisig, type index$f_MultisigConfig as MultisigConfig, type index$f_MultisigConfigRecord as MultisigConfigRecord, type index$f_QuoteDvnParams as QuoteDvnParams, type SetConfigParams$1 as SetConfigParams, type index$f_TransactionAccount as TransactionAccount, type UlnConfig$1 as UlnConfig, type index$f_VerifiableParams as VerifiableParams, index$f_VerificationState as VerificationState, type index$f_WithdrawFeeParams as WithdrawFeeParams, aclBeet$1 as aclBeet, index$f_adminConfigBeet as adminConfigBeet, index$f_closeExecuteParamsBeet as closeExecuteParamsBeet, dstConfigBeet$1 as dstConfigBeet, index$f_executeTransactionDigestBeet as executeTransactionDigestBeet, index$f_initDvnParamsBeet as initDvnParamsBeet, index$f_invokeParamsBeet as invokeParamsBeet, index$f_isAdminConfigAdmins as isAdminConfigAdmins, index$f_isAdminConfigDefaultMultiplierBps as isAdminConfigDefaultMultiplierBps, index$f_isAdminConfigDstConfigs as isAdminConfigDstConfigs, index$f_isAdminConfigPriceFeed as isAdminConfigPriceFeed, index$f_isMultisigConfigAdmins as isMultisigConfigAdmins, index$f_isMultisigConfigAllowlist as isMultisigConfigAllowlist, index$f_isMultisigConfigDenylist as isMultisigConfigDenylist, index$f_isMultisigConfigMsglibs as isMultisigConfigMsglibs, index$f_isMultisigConfigPaused as isMultisigConfigPaused, index$f_isMultisigConfigQuorum as isMultisigConfigQuorum, index$f_isMultisigConfigSigners as isMultisigConfigSigners, lzOptionBeet$1 as lzOptionBeet, index$f_multisigBeet as multisigBeet, index$f_multisigConfigBeet as multisigConfigBeet, index$f_quoteDvnParamsBeet as quoteDvnParamsBeet, setConfigParamsBeet$1 as setConfigParamsBeet, index$f_transactionAccountBeet as transactionAccountBeet, ulnConfigBeet$1 as ulnConfigBeet, index$f_verifiableParamsBeet as verifiableParamsBeet, index$f_verificationStateBeet as verificationStateBeet, index$f_withdrawFeeParamsBeet as withdrawFeeParamsBeet };
}

/**
 * Program address
 *
 * @category constants
 * @category generated
 */
declare const PROGRAM_ADDRESS$3 = "HtEYV4xB4wvsj5fgTkcfuChYpvGYzgzwvNhgDZQNh7wW";
/**
 * Program public key
 *
 * @category constants
 * @category generated
 */
declare const PROGRAM_ID$4: PublicKey;

type index$e_AdminConfig = AdminConfig;
type index$e_AdminConfigRecord = AdminConfigRecord;
type index$e_CloseExecuteInstructionAccounts = CloseExecuteInstructionAccounts;
type index$e_CloseExecuteInstructionArgs = CloseExecuteInstructionArgs;
type index$e_CloseExecuteParams = CloseExecuteParams;
type index$e_DuplicateSignatureError = DuplicateSignatureError;
declare const index$e_DuplicateSignatureError: typeof DuplicateSignatureError;
type index$e_DvnConfig = DvnConfig;
declare const index$e_DvnConfig: typeof DvnConfig;
type index$e_DvnConfigArgs = DvnConfigArgs;
type index$e_ExecuteHash = ExecuteHash;
declare const index$e_ExecuteHash: typeof ExecuteHash;
type index$e_ExecuteHashArgs = ExecuteHashArgs;
type index$e_ExecuteTransactionDigest = ExecuteTransactionDigest;
type index$e_ExpiredError = ExpiredError;
declare const index$e_ExpiredError: typeof ExpiredError;
type index$e_InitDvnInstructionAccounts = InitDvnInstructionAccounts;
type index$e_InitDvnInstructionArgs = InitDvnInstructionArgs;
type index$e_InitDvnParams = InitDvnParams;
type index$e_InvalidQuorumError = InvalidQuorumError;
declare const index$e_InvalidQuorumError: typeof InvalidQuorumError;
type index$e_InvalidSignatureLenError = InvalidSignatureLenError;
declare const index$e_InvalidSignatureLenError: typeof InvalidSignatureLenError;
type index$e_InvalidSignersLenError = InvalidSignersLenError;
declare const index$e_InvalidSignersLenError: typeof InvalidSignersLenError;
type index$e_InvalidVidError = InvalidVidError;
declare const index$e_InvalidVidError: typeof InvalidVidError;
type index$e_InvokeInstructionAccounts = InvokeInstructionAccounts;
type index$e_InvokeInstructionArgs = InvokeInstructionArgs;
type index$e_InvokeParams = InvokeParams;
type index$e_Multisig = Multisig;
type index$e_MultisigConfig = MultisigConfig;
type index$e_MultisigConfigRecord = MultisigConfigRecord;
type index$e_QuoteDvnInstructionAccounts = QuoteDvnInstructionAccounts;
type index$e_QuoteDvnInstructionArgs = QuoteDvnInstructionArgs;
type index$e_QuoteDvnParams = QuoteDvnParams;
type index$e_SignatureErrorError = SignatureErrorError;
declare const index$e_SignatureErrorError: typeof SignatureErrorError;
type index$e_SignerNotInCommitteeError = SignerNotInCommitteeError;
declare const index$e_SignerNotInCommitteeError: typeof SignerNotInCommitteeError;
type index$e_TransactionAccount = TransactionAccount;
type index$e_UnexpiredExecuteHashError = UnexpiredExecuteHashError;
declare const index$e_UnexpiredExecuteHashError: typeof UnexpiredExecuteHashError;
type index$e_UniqueOwnersError = UniqueOwnersError;
declare const index$e_UniqueOwnersError: typeof UniqueOwnersError;
type index$e_VerifiableInstructionAccounts = VerifiableInstructionAccounts;
type index$e_VerifiableInstructionArgs = VerifiableInstructionArgs;
type index$e_VerifiableParams = VerifiableParams;
type index$e_VerificationState = VerificationState;
declare const index$e_VerificationState: typeof VerificationState;
type index$e_WithdrawFeeInstructionAccounts = WithdrawFeeInstructionAccounts;
type index$e_WithdrawFeeInstructionArgs = WithdrawFeeInstructionArgs;
type index$e_WithdrawFeeParams = WithdrawFeeParams;
declare const index$e_adminConfigBeet: typeof adminConfigBeet;
declare const index$e_closeExecuteInstructionDiscriminator: typeof closeExecuteInstructionDiscriminator;
declare const index$e_closeExecuteParamsBeet: typeof closeExecuteParamsBeet;
declare const index$e_closeExecuteStruct: typeof closeExecuteStruct;
declare const index$e_createCloseExecuteInstruction: typeof createCloseExecuteInstruction;
declare const index$e_createCloseExecuteInstructionAccounts: typeof createCloseExecuteInstructionAccounts;
declare const index$e_createInitDvnInstruction: typeof createInitDvnInstruction;
declare const index$e_createInitDvnInstructionAccounts: typeof createInitDvnInstructionAccounts;
declare const index$e_createInvokeInstruction: typeof createInvokeInstruction;
declare const index$e_createInvokeInstructionAccounts: typeof createInvokeInstructionAccounts;
declare const index$e_createQuoteDvnInstruction: typeof createQuoteDvnInstruction;
declare const index$e_createQuoteDvnInstructionAccounts: typeof createQuoteDvnInstructionAccounts;
declare const index$e_createVerifiableInstruction: typeof createVerifiableInstruction;
declare const index$e_createVerifiableInstructionAccounts: typeof createVerifiableInstructionAccounts;
declare const index$e_createWithdrawFeeInstruction: typeof createWithdrawFeeInstruction;
declare const index$e_createWithdrawFeeInstructionAccounts: typeof createWithdrawFeeInstructionAccounts;
declare const index$e_dvnConfigBeet: typeof dvnConfigBeet;
declare const index$e_dvnConfigDiscriminator: typeof dvnConfigDiscriminator;
declare const index$e_executeHashBeet: typeof executeHashBeet;
declare const index$e_executeHashDiscriminator: typeof executeHashDiscriminator;
declare const index$e_executeTransactionDigestBeet: typeof executeTransactionDigestBeet;
declare const index$e_initDvnInstructionDiscriminator: typeof initDvnInstructionDiscriminator;
declare const index$e_initDvnParamsBeet: typeof initDvnParamsBeet;
declare const index$e_initDvnStruct: typeof initDvnStruct;
declare const index$e_invokeInstructionDiscriminator: typeof invokeInstructionDiscriminator;
declare const index$e_invokeParamsBeet: typeof invokeParamsBeet;
declare const index$e_invokeStruct: typeof invokeStruct;
declare const index$e_isAdminConfigAdmins: typeof isAdminConfigAdmins;
declare const index$e_isAdminConfigDefaultMultiplierBps: typeof isAdminConfigDefaultMultiplierBps;
declare const index$e_isAdminConfigDstConfigs: typeof isAdminConfigDstConfigs;
declare const index$e_isAdminConfigPriceFeed: typeof isAdminConfigPriceFeed;
declare const index$e_isMultisigConfigAdmins: typeof isMultisigConfigAdmins;
declare const index$e_isMultisigConfigAllowlist: typeof isMultisigConfigAllowlist;
declare const index$e_isMultisigConfigDenylist: typeof isMultisigConfigDenylist;
declare const index$e_isMultisigConfigMsglibs: typeof isMultisigConfigMsglibs;
declare const index$e_isMultisigConfigPaused: typeof isMultisigConfigPaused;
declare const index$e_isMultisigConfigQuorum: typeof isMultisigConfigQuorum;
declare const index$e_isMultisigConfigSigners: typeof isMultisigConfigSigners;
declare const index$e_multisigBeet: typeof multisigBeet;
declare const index$e_multisigConfigBeet: typeof multisigConfigBeet;
declare const index$e_quoteDvnInstructionDiscriminator: typeof quoteDvnInstructionDiscriminator;
declare const index$e_quoteDvnParamsBeet: typeof quoteDvnParamsBeet;
declare const index$e_quoteDvnStruct: typeof quoteDvnStruct;
declare const index$e_transactionAccountBeet: typeof transactionAccountBeet;
declare const index$e_verifiableInstructionDiscriminator: typeof verifiableInstructionDiscriminator;
declare const index$e_verifiableParamsBeet: typeof verifiableParamsBeet;
declare const index$e_verifiableStruct: typeof verifiableStruct;
declare const index$e_verificationStateBeet: typeof verificationStateBeet;
declare const index$e_withdrawFeeInstructionDiscriminator: typeof withdrawFeeInstructionDiscriminator;
declare const index$e_withdrawFeeParamsBeet: typeof withdrawFeeParamsBeet;
declare const index$e_withdrawFeeStruct: typeof withdrawFeeStruct;
declare namespace index$e {
  export { type Acl$1 as Acl, type index$e_AdminConfig as AdminConfig, type index$e_AdminConfigRecord as AdminConfigRecord, type index$e_CloseExecuteInstructionAccounts as CloseExecuteInstructionAccounts, type index$e_CloseExecuteInstructionArgs as CloseExecuteInstructionArgs, type index$e_CloseExecuteParams as CloseExecuteParams, type DstConfig$1 as DstConfig, index$e_DuplicateSignatureError as DuplicateSignatureError, index$e_DvnConfig as DvnConfig, type index$e_DvnConfigArgs as DvnConfigArgs, EidNotSupportedError$1 as EidNotSupportedError, index$e_ExecuteHash as ExecuteHash, type index$e_ExecuteHashArgs as ExecuteHashArgs, type index$e_ExecuteTransactionDigest as ExecuteTransactionDigest, index$e_ExpiredError as ExpiredError, type index$e_InitDvnInstructionAccounts as InitDvnInstructionAccounts, type index$e_InitDvnInstructionArgs as InitDvnInstructionArgs, type index$e_InitDvnParams as InitDvnParams, InvalidAmountError$1 as InvalidAmountError, index$e_InvalidQuorumError as InvalidQuorumError, index$e_InvalidSignatureLenError as InvalidSignatureLenError, index$e_InvalidSignersLenError as InvalidSignersLenError, index$e_InvalidVidError as InvalidVidError, type index$e_InvokeInstructionAccounts as InvokeInstructionAccounts, type index$e_InvokeInstructionArgs as InvokeInstructionArgs, type index$e_InvokeParams as InvokeParams, type LzOption$1 as LzOption, MsgLibNotAllowedError$1 as MsgLibNotAllowedError, type index$e_Multisig as Multisig, type index$e_MultisigConfig as MultisigConfig, type index$e_MultisigConfigRecord as MultisigConfigRecord, NotAdminError$1 as NotAdminError, PROGRAM_ADDRESS$3 as PROGRAM_ADDRESS, PROGRAM_ID$4 as PROGRAM_ID, PausedError$1 as PausedError, type index$e_QuoteDvnInstructionAccounts as QuoteDvnInstructionAccounts, type index$e_QuoteDvnInstructionArgs as QuoteDvnInstructionArgs, type index$e_QuoteDvnParams as QuoteDvnParams, ReceiveConfig$1 as ReceiveConfig, type ReceiveConfigArgs$1 as ReceiveConfigArgs, type SetConfigInstructionAccounts$1 as SetConfigInstructionAccounts, type SetConfigInstructionArgs$1 as SetConfigInstructionArgs, type SetConfigParams$1 as SetConfigParams, index$e_SignatureErrorError as SignatureErrorError, index$e_SignerNotInCommitteeError as SignerNotInCommitteeError, TooManyAdminsError$1 as TooManyAdminsError, TooManyOptionTypesError$1 as TooManyOptionTypesError, type index$e_TransactionAccount as TransactionAccount, type UlnConfig$1 as UlnConfig, index$e_UnexpiredExecuteHashError as UnexpiredExecuteHashError, index$e_UniqueOwnersError as UniqueOwnersError, type index$e_VerifiableInstructionAccounts as VerifiableInstructionAccounts, type index$e_VerifiableInstructionArgs as VerifiableInstructionArgs, type index$e_VerifiableParams as VerifiableParams, index$e_VerificationState as VerificationState, type index$e_WithdrawFeeInstructionAccounts as WithdrawFeeInstructionAccounts, type index$e_WithdrawFeeInstructionArgs as WithdrawFeeInstructionArgs, type index$e_WithdrawFeeParams as WithdrawFeeParams, accountProviders$3 as accountProviders, aclBeet$1 as aclBeet, index$e_adminConfigBeet as adminConfigBeet, index$e_closeExecuteInstructionDiscriminator as closeExecuteInstructionDiscriminator, index$e_closeExecuteParamsBeet as closeExecuteParamsBeet, index$e_closeExecuteStruct as closeExecuteStruct, index$e_createCloseExecuteInstruction as createCloseExecuteInstruction, index$e_createCloseExecuteInstructionAccounts as createCloseExecuteInstructionAccounts, index$e_createInitDvnInstruction as createInitDvnInstruction, index$e_createInitDvnInstructionAccounts as createInitDvnInstructionAccounts, index$e_createInvokeInstruction as createInvokeInstruction, index$e_createInvokeInstructionAccounts as createInvokeInstructionAccounts, index$e_createQuoteDvnInstruction as createQuoteDvnInstruction, index$e_createQuoteDvnInstructionAccounts as createQuoteDvnInstructionAccounts, createSetConfigInstruction$1 as createSetConfigInstruction, createSetConfigInstructionAccounts$1 as createSetConfigInstructionAccounts, index$e_createVerifiableInstruction as createVerifiableInstruction, index$e_createVerifiableInstructionAccounts as createVerifiableInstructionAccounts, index$e_createWithdrawFeeInstruction as createWithdrawFeeInstruction, index$e_createWithdrawFeeInstructionAccounts as createWithdrawFeeInstructionAccounts, dstConfigBeet$1 as dstConfigBeet, index$e_dvnConfigBeet as dvnConfigBeet, index$e_dvnConfigDiscriminator as dvnConfigDiscriminator, errorFromCode$2 as errorFromCode, errorFromName$2 as errorFromName, index$e_executeHashBeet as executeHashBeet, index$e_executeHashDiscriminator as executeHashDiscriminator, index$e_executeTransactionDigestBeet as executeTransactionDigestBeet, index$e_initDvnInstructionDiscriminator as initDvnInstructionDiscriminator, index$e_initDvnParamsBeet as initDvnParamsBeet, index$e_initDvnStruct as initDvnStruct, index$e_invokeInstructionDiscriminator as invokeInstructionDiscriminator, index$e_invokeParamsBeet as invokeParamsBeet, index$e_invokeStruct as invokeStruct, index$e_isAdminConfigAdmins as isAdminConfigAdmins, index$e_isAdminConfigDefaultMultiplierBps as isAdminConfigDefaultMultiplierBps, index$e_isAdminConfigDstConfigs as isAdminConfigDstConfigs, index$e_isAdminConfigPriceFeed as isAdminConfigPriceFeed, index$e_isMultisigConfigAdmins as isMultisigConfigAdmins, index$e_isMultisigConfigAllowlist as isMultisigConfigAllowlist, index$e_isMultisigConfigDenylist as isMultisigConfigDenylist, index$e_isMultisigConfigMsglibs as isMultisigConfigMsglibs, index$e_isMultisigConfigPaused as isMultisigConfigPaused, index$e_isMultisigConfigQuorum as isMultisigConfigQuorum, index$e_isMultisigConfigSigners as isMultisigConfigSigners, lzOptionBeet$1 as lzOptionBeet, index$e_multisigBeet as multisigBeet, index$e_multisigConfigBeet as multisigConfigBeet, index$e_quoteDvnInstructionDiscriminator as quoteDvnInstructionDiscriminator, index$e_quoteDvnParamsBeet as quoteDvnParamsBeet, index$e_quoteDvnStruct as quoteDvnStruct, receiveConfigBeet$1 as receiveConfigBeet, receiveConfigDiscriminator$1 as receiveConfigDiscriminator, setConfigInstructionDiscriminator$1 as setConfigInstructionDiscriminator, setConfigParamsBeet$1 as setConfigParamsBeet, setConfigStruct$1 as setConfigStruct, index$e_transactionAccountBeet as transactionAccountBeet, ulnConfigBeet$1 as ulnConfigBeet, index$e_verifiableInstructionDiscriminator as verifiableInstructionDiscriminator, index$e_verifiableParamsBeet as verifiableParamsBeet, index$e_verifiableStruct as verifiableStruct, index$e_verificationStateBeet as verificationStateBeet, index$e_withdrawFeeInstructionDiscriminator as withdrawFeeInstructionDiscriminator, index$e_withdrawFeeParamsBeet as withdrawFeeParamsBeet, index$e_withdrawFeeStruct as withdrawFeeStruct };
}

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type AdminConfigSetEvent = {
    config: AdminConfig;
};
/**
 * @category userTypes
 * @category generated
 */
declare const adminConfigSetEventBeet: beet.FixableBeetArgsStruct<AdminConfigSetEvent>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type FeeWithdrawnEvent = {
    receiver: web3.PublicKey;
    amount: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const feeWithdrawnEventBeet: beet.BeetArgsStruct<FeeWithdrawnEvent>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type MultisigConfigSetEvent = {
    config: MultisigConfig;
};
/**
 * @category userTypes
 * @category generated
 */
declare const multisigConfigSetEventBeet: beet.FixableBeetArgsStruct<MultisigConfigSetEvent>;

type index$d_AdminConfigSetEvent = AdminConfigSetEvent;
type index$d_FeeWithdrawnEvent = FeeWithdrawnEvent;
type index$d_MultisigConfigSetEvent = MultisigConfigSetEvent;
declare const index$d_adminConfigSetEventBeet: typeof adminConfigSetEventBeet;
declare const index$d_feeWithdrawnEventBeet: typeof feeWithdrawnEventBeet;
declare const index$d_multisigConfigSetEventBeet: typeof multisigConfigSetEventBeet;
declare namespace index$d {
  export { type index$d_AdminConfigSetEvent as AdminConfigSetEvent, type index$d_FeeWithdrawnEvent as FeeWithdrawnEvent, type index$d_MultisigConfigSetEvent as MultisigConfigSetEvent, index$d_adminConfigSetEventBeet as adminConfigSetEventBeet, index$d_feeWithdrawnEventBeet as feeWithdrawnEventBeet, index$d_multisigConfigSetEventBeet as multisigConfigSetEventBeet };
}

interface SignFunc {
    sign(message: Buffer): Promise<{
        signature: Uint8Array;
        recoveryId: number;
    }[]>;
}
declare class DVN {
    readonly programId: PublicKey;
    dvnDeriver: DVNDeriver;
    vid: number;
    eventAuthority: PublicKey;
    constructor(programId: PublicKey, endpointId?: EndpointId);
    initDVN(connection: Connection, payer: PublicKey, params: InitDvnParams): Promise<TransactionInstruction>;
    getDigest(vid: number, instruction: TransactionInstruction, expiration: number): ExecuteTransactionDigest;
    getExecuteHash(hashBytes: Buffer): PublicKey;
    getHashBytes(digest: ExecuteTransactionDigest): Buffer;
    invoke(connection: Connection, vid: number, payer: PublicKey, instruction: TransactionInstruction, expiration: number, sign: SignFunc): Promise<TransactionInstruction>;
    createSetQuorumInstruction(quorum: number): TransactionInstruction;
    createSetAdminsInstruction(admins: PublicKey[]): TransactionInstruction;
    createSetSignersInstruction(signers: Uint8Array[]): TransactionInstruction;
    createSetAllowlistInstruction(allowlist: PublicKey[]): TransactionInstruction;
    createSetDenylistInstruction(denylist: PublicKey[]): TransactionInstruction;
    createSetPauseInstruction(pause: boolean): TransactionInstruction;
    createSetDefaultMultiplierBpsInstruction(admin: PublicKey, defaultMultiplierBps: number): TransactionInstruction;
    createChangeAdminsInstruction(admin: PublicKey, admins: PublicKey[]): TransactionInstruction;
    createSetDstConfigInstruction(admin: PublicKey, dstConfigs: DstConfig$1[]): TransactionInstruction;
    createSetMsgLibsInstruction(msglibPrograms: PublicKey[]): TransactionInstruction;
    _getExpiration(): number;
    setMsgLibs(connection: Connection, payer: PublicKey, msgLibs: PublicKey[], sign: SignFunc): Promise<TransactionInstruction>;
    createSetPriceFeedInstruction(admin: PublicKey, priceFeedProgram: PublicKey): TransactionInstruction;
    getQuoteIXAccountMetaForCPI(priceFeedConfig: PublicKey, priceFeedProgram: PublicKey, payment: boolean): AccountMeta[];
    getConfigState(connection: Connection, commitment?: Commitment | GetAccountInfoConfig): Promise<DvnConfig | null>;
}

type dvn_DVN = DVN;
declare const dvn_DVN: typeof DVN;
type dvn_SignFunc = SignFunc;
declare namespace dvn {
  export { dvn_DVN as DVN, PROGRAM_ID$4 as PROGRAM_ID, type dvn_SignFunc as SignFunc, index$i as accounts, index$h as errors, index$d as events, index$g as instructions, index$f as types };
}

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type Acl = {
    allowList: web3.PublicKey[];
    denyList: web3.PublicKey[];
};
/**
 * @category userTypes
 * @category generated
 */
declare const aclBeet: beet.FixableBeetArgsStruct<Acl>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type DstConfig = {
    eid: number;
    lzReceiveBaseGas: number;
    lzComposeBaseGas: number;
    multiplierBps: beet.COption<number>;
    floorMarginUsd: beet.COption<beet.bignum>;
    nativeDropCap: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const dstConfigBeet: beet.FixableBeetArgsStruct<DstConfig>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * Arguments used to create {@link ExecutorConfig}
 * @category Accounts
 * @category generated
 */
type ExecutorConfigArgs = {
    bump: number;
    owner: web3.PublicKey;
    acl: Acl;
    admins: web3.PublicKey[];
    executors: web3.PublicKey[];
    msglibs: web3.PublicKey[];
    paused: boolean;
    defaultMultiplierBps: number;
    priceFeed: web3.PublicKey;
    dstConfigs: DstConfig[];
};
declare const executorConfigDiscriminator: number[];
/**
 * Holds the data for the {@link ExecutorConfig} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
declare class ExecutorConfig$1 implements ExecutorConfigArgs {
    readonly bump: number;
    readonly owner: web3.PublicKey;
    readonly acl: Acl;
    readonly admins: web3.PublicKey[];
    readonly executors: web3.PublicKey[];
    readonly msglibs: web3.PublicKey[];
    readonly paused: boolean;
    readonly defaultMultiplierBps: number;
    readonly priceFeed: web3.PublicKey;
    readonly dstConfigs: DstConfig[];
    private constructor();
    /**
     * Creates a {@link ExecutorConfig} instance from the provided args.
     */
    static fromArgs(args: ExecutorConfigArgs): ExecutorConfig$1;
    /**
     * Deserializes the {@link ExecutorConfig} from the data of the provided {@link web3.AccountInfo}.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static fromAccountInfo(accountInfo: web3.AccountInfo<Buffer>, offset?: number): [ExecutorConfig$1, number];
    /**
     * Retrieves the account info from the provided address and deserializes
     * the {@link ExecutorConfig} from its data.
     *
     * @throws Error if no account info is found at the address or if deserialization fails
     */
    static fromAccountAddress(connection: web3.Connection, address: web3.PublicKey, commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig): Promise<ExecutorConfig$1>;
    /**
     * Provides a {@link web3.Connection.getProgramAccounts} config builder,
     * to fetch accounts matching filters that can be specified via that builder.
     *
     * @param programId - the program that owns the accounts we are filtering
     */
    static gpaBuilder(programId?: web3.PublicKey): beetSolana.GpaBuilder<ExecutorConfigArgs & {
        accountDiscriminator: number[];
    }>;
    /**
     * Deserializes the {@link ExecutorConfig} from the provided data Buffer.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static deserialize(buf: Buffer, offset?: number): [ExecutorConfig$1, number];
    /**
     * Serializes the {@link ExecutorConfig} into a Buffer.
     * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
     */
    serialize(): [Buffer, number];
    /**
     * Returns the byteSize of a {@link Buffer} holding the serialized data of
     * {@link ExecutorConfig} for the provided args.
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     */
    static byteSize(args: ExecutorConfigArgs): number;
    /**
     * Fetches the minimum balance needed to exempt an account holding
     * {@link ExecutorConfig} data from rent
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     * @param connection used to retrieve the rent exemption information
     */
    static getMinimumBalanceForRentExemption(args: ExecutorConfigArgs, connection: web3.Connection, commitment?: web3.Commitment): Promise<number>;
    /**
     * Returns a readable version of {@link ExecutorConfig} properties
     * and can be used to convert to JSON and/or logging
     */
    pretty(): {
        bump: number;
        owner: string;
        acl: Acl;
        admins: web3.PublicKey[];
        executors: web3.PublicKey[];
        msglibs: web3.PublicKey[];
        paused: boolean;
        defaultMultiplierBps: number;
        priceFeed: string;
        dstConfigs: DstConfig[];
    };
}
/**
 * @category Accounts
 * @category generated
 */
declare const executorConfigBeet$1: beet.FixableBeetStruct<ExecutorConfig$1, ExecutorConfigArgs & {
    accountDiscriminator: number[];
}>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * Arguments used to create {@link Nonce}
 * @category Accounts
 * @category generated
 */
type NonceArgs = {
    bump: number;
    outboundNonce: beet.bignum;
    inboundNonce: beet.bignum;
};
declare const nonceDiscriminator: number[];
/**
 * Holds the data for the {@link Nonce} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
declare class Nonce implements NonceArgs {
    readonly bump: number;
    readonly outboundNonce: beet.bignum;
    readonly inboundNonce: beet.bignum;
    private constructor();
    /**
     * Creates a {@link Nonce} instance from the provided args.
     */
    static fromArgs(args: NonceArgs): Nonce;
    /**
     * Deserializes the {@link Nonce} from the data of the provided {@link web3.AccountInfo}.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static fromAccountInfo(accountInfo: web3.AccountInfo<Buffer>, offset?: number): [Nonce, number];
    /**
     * Retrieves the account info from the provided address and deserializes
     * the {@link Nonce} from its data.
     *
     * @throws Error if no account info is found at the address or if deserialization fails
     */
    static fromAccountAddress(connection: web3.Connection, address: web3.PublicKey, commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig): Promise<Nonce>;
    /**
     * Provides a {@link web3.Connection.getProgramAccounts} config builder,
     * to fetch accounts matching filters that can be specified via that builder.
     *
     * @param programId - the program that owns the accounts we are filtering
     */
    static gpaBuilder(programId?: web3.PublicKey): beetSolana.GpaBuilder<{
        bump: any;
        outboundNonce: any;
        inboundNonce: any;
        accountDiscriminator: any;
    }>;
    /**
     * Deserializes the {@link Nonce} from the provided data Buffer.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static deserialize(buf: Buffer, offset?: number): [Nonce, number];
    /**
     * Serializes the {@link Nonce} into a Buffer.
     * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
     */
    serialize(): [Buffer, number];
    /**
     * Returns the byteSize of a {@link Buffer} holding the serialized data of
     * {@link Nonce}
     */
    static get byteSize(): number;
    /**
     * Fetches the minimum balance needed to exempt an account holding
     * {@link Nonce} data from rent
     *
     * @param connection used to retrieve the rent exemption information
     */
    static getMinimumBalanceForRentExemption(connection: web3.Connection, commitment?: web3.Commitment): Promise<number>;
    /**
     * Determines if the provided {@link Buffer} has the correct byte size to
     * hold {@link Nonce} data.
     */
    static hasCorrectByteSize(buf: Buffer, offset?: number): boolean;
    /**
     * Returns a readable version of {@link Nonce} properties
     * and can be used to convert to JSON and/or logging
     */
    pretty(): {
        bump: number;
        outboundNonce: number | {
            toNumber: () => number;
        };
        inboundNonce: number | {
            toNumber: () => number;
        };
    };
}
/**
 * @category Accounts
 * @category generated
 */
declare const nonceBeet: beet.BeetStruct<Nonce, NonceArgs & {
    accountDiscriminator: number[];
}>;

declare const accountProviders$2: {
    Nonce: typeof Nonce;
    ExecutorConfig: typeof ExecutorConfig$1;
};

type index$c_ExecutorConfigArgs = ExecutorConfigArgs;
type index$c_Nonce = Nonce;
declare const index$c_Nonce: typeof Nonce;
type index$c_NonceArgs = NonceArgs;
declare const index$c_executorConfigDiscriminator: typeof executorConfigDiscriminator;
declare const index$c_nonceBeet: typeof nonceBeet;
declare const index$c_nonceDiscriminator: typeof nonceDiscriminator;
declare namespace index$c {
  export { ExecutorConfig$1 as ExecutorConfig, type index$c_ExecutorConfigArgs as ExecutorConfigArgs, index$c_Nonce as Nonce, type index$c_NonceArgs as NonceArgs, accountProviders$2 as accountProviders, executorConfigBeet$1 as executorConfigBeet, index$c_executorConfigDiscriminator as executorConfigDiscriminator, index$c_nonceBeet as nonceBeet, index$c_nonceDiscriminator as nonceDiscriminator };
}

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type NativeDropRequest = {
    receiver: web3.PublicKey;
    amount: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const nativeDropRequestBeet: beet.BeetArgsStruct<NativeDropRequest>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type NativeDropAppliedEvent = {
    srcEid: number;
    sender: number[];
    nonce: beet.bignum;
    dstEid: number;
    oapp: web3.PublicKey;
    nativeDropRequests: NativeDropRequest[];
    successes: boolean[];
};
/**
 * @category userTypes
 * @category generated
 */
declare const nativeDropAppliedEventBeet: beet.FixableBeetArgsStruct<NativeDropAppliedEvent>;

type index$b_NativeDropAppliedEvent = NativeDropAppliedEvent;
declare const index$b_nativeDropAppliedEventBeet: typeof nativeDropAppliedEventBeet;
declare namespace index$b {
  export { type index$b_NativeDropAppliedEvent as NativeDropAppliedEvent, index$b_nativeDropAppliedEventBeet as nativeDropAppliedEventBeet };
}

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * This type is used to derive the {@link AdminSetConfigParams} type as well as the de/serializer.
 * However don't refer to it in your code but use the {@link AdminSetConfigParams} type instead.
 *
 * @category userTypes
 * @category enums
 * @category generated
 * @private
 */
type AdminSetConfigParamsRecord = {
    PriceFeed: {
        fields: [web3.PublicKey];
    };
    DefaultMultiplierBps: {
        fields: [number];
    };
    DstConfigs: {
        fields: [DstConfig[]];
    };
};
/**
 * Union type respresenting the AdminSetConfigParams data enum defined in Rust.
 *
 * NOTE: that it includes a `__kind` property which allows to narrow types in
 * switch/if statements.
 * Additionally `isAdminSetConfigParams*` type guards are exposed below to narrow to a specific variant.
 *
 * @category userTypes
 * @category enums
 * @category generated
 */
type AdminSetConfigParams = beet.DataEnumKeyAsKind<AdminSetConfigParamsRecord>;
declare const isAdminSetConfigParamsPriceFeed: (x: AdminSetConfigParams) => x is {
    __kind: "PriceFeed";
} & Omit<{
    fields: [web3.PublicKey];
}, "void"> & {
    __kind: 'PriceFeed';
};
declare const isAdminSetConfigParamsDefaultMultiplierBps: (x: AdminSetConfigParams) => x is {
    __kind: "DefaultMultiplierBps";
} & Omit<{
    fields: [number];
}, "void"> & {
    __kind: 'DefaultMultiplierBps';
};
declare const isAdminSetConfigParamsDstConfigs: (x: AdminSetConfigParams) => x is {
    __kind: "DstConfigs";
} & Omit<{
    fields: [DstConfig[]];
}, "void"> & {
    __kind: 'DstConfigs';
};
/**
 * @category userTypes
 * @category generated
 */
declare const adminSetConfigParamsBeet: beet.FixableBeet<AdminSetConfigParams, AdminSetConfigParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category AdminSetConfig
 * @category generated
 */
type AdminSetConfigInstructionArgs = {
    params: AdminSetConfigParams;
};
/**
 * @category Instructions
 * @category AdminSetConfig
 * @category generated
 */
declare const adminSetConfigStruct: beet.FixableBeetArgsStruct<AdminSetConfigInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _adminSetConfig_ instruction
 *
 * @property [**signer**] admin
 * @property [_writable_] config
 * @category Instructions
 * @category AdminSetConfig
 * @category generated
 */
type AdminSetConfigInstructionAccounts = {
    admin: web3.PublicKey;
    config: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const adminSetConfigInstructionDiscriminator: number[];
/**
 * Creates a _AdminSetConfig_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category AdminSetConfig
 * @category generated
 */
declare function createAdminSetConfigInstruction(accounts: AdminSetConfigInstructionAccounts, args: AdminSetConfigInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _AdminSetConfig_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category AdminSetConfig
 * @category generated
 */
declare function createAdminSetConfigInstructionAccounts(accounts: AdminSetConfigInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type LzComposeParams$1 = {
    from: web3.PublicKey;
    to: web3.PublicKey;
    guid: number[];
    index: number;
    message: Uint8Array;
    extraData: Uint8Array;
};
/**
 * @category userTypes
 * @category generated
 */
declare const lzComposeParamsBeet: beet.FixableBeetArgsStruct<LzComposeParams$1>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type ComposeParams = {
    lzCompose: LzComposeParams$1;
    computeUnits: beet.bignum;
    value: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const composeParamsBeet: beet.FixableBeetArgsStruct<ComposeParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category Compose
 * @category generated
 */
type ComposeInstructionArgs = {
    params: ComposeParams;
};
/**
 * @category Instructions
 * @category Compose
 * @category generated
 */
declare const composeStruct: beet.FixableBeetArgsStruct<ComposeInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _compose_ instruction
 *
 * @property [_writable_, **signer**] executor
 * @property [] config
 * @property [] endpointProgram
 * @property [] endpointEventAuthority
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category Compose
 * @category generated
 */
type ComposeInstructionAccounts = {
    executor: web3.PublicKey;
    config: web3.PublicKey;
    endpointProgram: web3.PublicKey;
    endpointEventAuthority: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const composeInstructionDiscriminator: number[];
/**
 * Creates a _Compose_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category Compose
 * @category generated
 */
declare function createComposeInstruction(accounts: ComposeInstructionAccounts, args: ComposeInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _Compose_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category Compose
 * @category generated
 */
declare function createComposeInstructionAccounts(accounts: ComposeInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type ExecutableParams = {
    receiver: web3.PublicKey;
    srcEid: number;
    sender: number[];
    nonce: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const executableParamsBeet: beet.BeetArgsStruct<ExecutableParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category Executable
 * @category generated
 */
type ExecutableInstructionArgs = {
    params: ExecutableParams;
};
/**
 * @category Instructions
 * @category Executable
 * @category generated
 */
declare const executableStruct: beet.BeetArgsStruct<ExecutableInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _executable_ instruction
 *
 * @property [] nonce
 * @property [] payloadHash
 * @category Instructions
 * @category Executable
 * @category generated
 */
type ExecutableInstructionAccounts = {
    nonce: web3.PublicKey;
    payloadHash: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const executableInstructionDiscriminator: number[];
/**
 * Creates a _Executable_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category Executable
 * @category generated
 */
declare function createExecutableInstruction(accounts: ExecutableInstructionAccounts, args: ExecutableInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _Executable_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category Executable
 * @category generated
 */
declare function createExecutableInstructionAccounts(accounts: ExecutableInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type LzReceiveParams$1 = {
    srcEid: number;
    sender: number[];
    nonce: beet.bignum;
    guid: number[];
    message: Uint8Array;
    extraData: Uint8Array;
};
/**
 * @category userTypes
 * @category generated
 */
declare const lzReceiveParamsBeet: beet.FixableBeetArgsStruct<LzReceiveParams$1>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type ExecuteParams = {
    receiver: web3.PublicKey;
    lzReceive: LzReceiveParams$1;
    value: beet.bignum;
    computeUnits: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const executeParamsBeet: beet.FixableBeetArgsStruct<ExecuteParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category Execute
 * @category generated
 */
type ExecuteInstructionArgs = {
    params: ExecuteParams;
};
/**
 * @category Instructions
 * @category Execute
 * @category generated
 */
declare const executeStruct: beet.FixableBeetArgsStruct<ExecuteInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _execute_ instruction
 *
 * @property [_writable_, **signer**] executor
 * @property [] config
 * @property [] endpointProgram
 * @property [] endpointEventAuthority
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category Execute
 * @category generated
 */
type ExecuteInstructionAccounts = {
    executor: web3.PublicKey;
    config: web3.PublicKey;
    endpointProgram: web3.PublicKey;
    endpointEventAuthority: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const executeInstructionDiscriminator: number[];
/**
 * Creates a _Execute_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category Execute
 * @category generated
 */
declare function createExecuteInstruction(accounts: ExecuteInstructionAccounts, args: ExecuteInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _Execute_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category Execute
 * @category generated
 */
declare function createExecuteInstructionAccounts(accounts: ExecuteInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type InitExecutorParams = {
    owner: web3.PublicKey;
    admins: web3.PublicKey[];
    executors: web3.PublicKey[];
    msglibs: web3.PublicKey[];
    priceFeed: web3.PublicKey;
};
/**
 * @category userTypes
 * @category generated
 */
declare const initExecutorParamsBeet: beet.FixableBeetArgsStruct<InitExecutorParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category InitExecutor
 * @category generated
 */
type InitExecutorInstructionArgs = {
    params: InitExecutorParams;
};
/**
 * @category Instructions
 * @category InitExecutor
 * @category generated
 */
declare const initExecutorStruct: beet.FixableBeetArgsStruct<InitExecutorInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _initExecutor_ instruction
 *
 * @property [_writable_, **signer**] payer
 * @property [_writable_] config
 * @category Instructions
 * @category InitExecutor
 * @category generated
 */
type InitExecutorInstructionAccounts = {
    payer: web3.PublicKey;
    config: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const initExecutorInstructionDiscriminator: number[];
/**
 * Creates a _InitExecutor_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category InitExecutor
 * @category generated
 */
declare function createInitExecutorInstruction(accounts: InitExecutorInstructionAccounts, args: InitExecutorInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _InitExecutor_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category InitExecutor
 * @category generated
 */
declare function createInitExecutorInstructionAccounts(accounts: InitExecutorInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type NativeDropParams = {
    srcEid: number;
    sender: number[];
    nonce: beet.bignum;
    dstEid: number;
    oapp: web3.PublicKey;
    nativeDropRequests: NativeDropRequest[];
};
/**
 * @category userTypes
 * @category generated
 */
declare const nativeDropParamsBeet: beet.FixableBeetArgsStruct<NativeDropParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category NativeDrop
 * @category generated
 */
type NativeDropInstructionArgs = {
    params: NativeDropParams;
};
/**
 * @category Instructions
 * @category NativeDrop
 * @category generated
 */
declare const nativeDropStruct: beet.FixableBeetArgsStruct<NativeDropInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _nativeDrop_ instruction
 *
 * @property [_writable_, **signer**] executor
 * @property [_writable_] config
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category NativeDrop
 * @category generated
 */
type NativeDropInstructionAccounts = {
    executor: web3.PublicKey;
    config: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const nativeDropInstructionDiscriminator: number[];
/**
 * Creates a _NativeDrop_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category NativeDrop
 * @category generated
 */
declare function createNativeDropInstruction(accounts: NativeDropInstructionAccounts, args: NativeDropInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _NativeDrop_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category NativeDrop
 * @category generated
 */
declare function createNativeDropInstructionAccounts(accounts: NativeDropInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * This type is used to derive the {@link OwnerSetConfigParams} type as well as the de/serializer.
 * However don't refer to it in your code but use the {@link OwnerSetConfigParams} type instead.
 *
 * @category userTypes
 * @category enums
 * @category generated
 * @private
 */
type OwnerSetConfigParamsRecord = {
    Admins: {
        fields: [web3.PublicKey[]];
    };
    Executors: {
        fields: [web3.PublicKey[]];
    };
    Msglibs: {
        fields: [web3.PublicKey[]];
    };
    Owner: {
        fields: [web3.PublicKey];
    };
    Paused: {
        fields: [boolean];
    };
    Allowlist: {
        fields: [web3.PublicKey[]];
    };
    Denylist: {
        fields: [web3.PublicKey[]];
    };
};
/**
 * Union type respresenting the OwnerSetConfigParams data enum defined in Rust.
 *
 * NOTE: that it includes a `__kind` property which allows to narrow types in
 * switch/if statements.
 * Additionally `isOwnerSetConfigParams*` type guards are exposed below to narrow to a specific variant.
 *
 * @category userTypes
 * @category enums
 * @category generated
 */
type OwnerSetConfigParams = beet.DataEnumKeyAsKind<OwnerSetConfigParamsRecord>;
declare const isOwnerSetConfigParamsAdmins: (x: OwnerSetConfigParams) => x is {
    __kind: "Admins";
} & Omit<{
    fields: [web3.PublicKey[]];
}, "void"> & {
    __kind: 'Admins';
};
declare const isOwnerSetConfigParamsExecutors: (x: OwnerSetConfigParams) => x is {
    __kind: "Executors";
} & Omit<{
    fields: [web3.PublicKey[]];
}, "void"> & {
    __kind: 'Executors';
};
declare const isOwnerSetConfigParamsMsglibs: (x: OwnerSetConfigParams) => x is {
    __kind: "Msglibs";
} & Omit<{
    fields: [web3.PublicKey[]];
}, "void"> & {
    __kind: 'Msglibs';
};
declare const isOwnerSetConfigParamsOwner: (x: OwnerSetConfigParams) => x is {
    __kind: "Owner";
} & Omit<{
    fields: [web3.PublicKey];
}, "void"> & {
    __kind: 'Owner';
};
declare const isOwnerSetConfigParamsPaused: (x: OwnerSetConfigParams) => x is {
    __kind: "Paused";
} & Omit<{
    fields: [boolean];
}, "void"> & {
    __kind: 'Paused';
};
declare const isOwnerSetConfigParamsAllowlist: (x: OwnerSetConfigParams) => x is {
    __kind: "Allowlist";
} & Omit<{
    fields: [web3.PublicKey[]];
}, "void"> & {
    __kind: 'Allowlist';
};
declare const isOwnerSetConfigParamsDenylist: (x: OwnerSetConfigParams) => x is {
    __kind: "Denylist";
} & Omit<{
    fields: [web3.PublicKey[]];
}, "void"> & {
    __kind: 'Denylist';
};
/**
 * @category userTypes
 * @category generated
 */
declare const ownerSetConfigParamsBeet: beet.FixableBeet<OwnerSetConfigParams, OwnerSetConfigParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category OwnerSetConfig
 * @category generated
 */
type OwnerSetConfigInstructionArgs = {
    params: OwnerSetConfigParams;
};
/**
 * @category Instructions
 * @category OwnerSetConfig
 * @category generated
 */
declare const ownerSetConfigStruct: beet.FixableBeetArgsStruct<OwnerSetConfigInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _ownerSetConfig_ instruction
 *
 * @property [**signer**] owner
 * @property [_writable_] config
 * @category Instructions
 * @category OwnerSetConfig
 * @category generated
 */
type OwnerSetConfigInstructionAccounts = {
    owner: web3.PublicKey;
    config: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const ownerSetConfigInstructionDiscriminator: number[];
/**
 * Creates a _OwnerSetConfig_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category OwnerSetConfig
 * @category generated
 */
declare function createOwnerSetConfigInstruction(accounts: OwnerSetConfigInstructionAccounts, args: OwnerSetConfigInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _OwnerSetConfig_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category OwnerSetConfig
 * @category generated
 */
declare function createOwnerSetConfigInstructionAccounts(accounts: OwnerSetConfigInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type LzOption = {
    optionType: number;
    params: Uint8Array;
};
/**
 * @category userTypes
 * @category generated
 */
declare const lzOptionBeet: beet.FixableBeetArgsStruct<LzOption>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type QuoteExecutorParams = {
    msglib: web3.PublicKey;
    dstEid: number;
    sender: web3.PublicKey;
    calldataSize: beet.bignum;
    options: LzOption[];
};
/**
 * @category userTypes
 * @category generated
 */
declare const quoteExecutorParamsBeet: beet.FixableBeetArgsStruct<QuoteExecutorParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category QuoteExecutor
 * @category generated
 */
type QuoteExecutorInstructionArgs = {
    params: QuoteExecutorParams;
};
/**
 * @category Instructions
 * @category QuoteExecutor
 * @category generated
 */
declare const quoteExecutorStruct: beet.FixableBeetArgsStruct<QuoteExecutorInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _quoteExecutor_ instruction
 *
 * @property [] executorConfig
 * @property [] priceFeedProgram
 * @property [] priceFeedConfig
 * @category Instructions
 * @category QuoteExecutor
 * @category generated
 */
type QuoteExecutorInstructionAccounts = {
    executorConfig: web3.PublicKey;
    priceFeedProgram: web3.PublicKey;
    priceFeedConfig: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const quoteExecutorInstructionDiscriminator: number[];
/**
 * Creates a _QuoteExecutor_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category QuoteExecutor
 * @category generated
 */
declare function createQuoteExecutorInstruction(accounts: QuoteExecutorInstructionAccounts, args: QuoteExecutorInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _QuoteExecutor_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category QuoteExecutor
 * @category generated
 */
declare function createQuoteExecutorInstructionAccounts(accounts: QuoteExecutorInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

type index$a_AdminSetConfigInstructionAccounts = AdminSetConfigInstructionAccounts;
type index$a_AdminSetConfigInstructionArgs = AdminSetConfigInstructionArgs;
type index$a_ComposeInstructionAccounts = ComposeInstructionAccounts;
type index$a_ComposeInstructionArgs = ComposeInstructionArgs;
type index$a_ExecutableInstructionAccounts = ExecutableInstructionAccounts;
type index$a_ExecutableInstructionArgs = ExecutableInstructionArgs;
type index$a_ExecuteInstructionAccounts = ExecuteInstructionAccounts;
type index$a_ExecuteInstructionArgs = ExecuteInstructionArgs;
type index$a_InitExecutorInstructionAccounts = InitExecutorInstructionAccounts;
type index$a_InitExecutorInstructionArgs = InitExecutorInstructionArgs;
type index$a_NativeDropInstructionAccounts = NativeDropInstructionAccounts;
type index$a_NativeDropInstructionArgs = NativeDropInstructionArgs;
type index$a_OwnerSetConfigInstructionAccounts = OwnerSetConfigInstructionAccounts;
type index$a_OwnerSetConfigInstructionArgs = OwnerSetConfigInstructionArgs;
type index$a_QuoteExecutorInstructionAccounts = QuoteExecutorInstructionAccounts;
type index$a_QuoteExecutorInstructionArgs = QuoteExecutorInstructionArgs;
declare const index$a_adminSetConfigInstructionDiscriminator: typeof adminSetConfigInstructionDiscriminator;
declare const index$a_adminSetConfigStruct: typeof adminSetConfigStruct;
declare const index$a_composeInstructionDiscriminator: typeof composeInstructionDiscriminator;
declare const index$a_composeStruct: typeof composeStruct;
declare const index$a_createAdminSetConfigInstruction: typeof createAdminSetConfigInstruction;
declare const index$a_createAdminSetConfigInstructionAccounts: typeof createAdminSetConfigInstructionAccounts;
declare const index$a_createComposeInstruction: typeof createComposeInstruction;
declare const index$a_createComposeInstructionAccounts: typeof createComposeInstructionAccounts;
declare const index$a_createExecutableInstruction: typeof createExecutableInstruction;
declare const index$a_createExecutableInstructionAccounts: typeof createExecutableInstructionAccounts;
declare const index$a_createExecuteInstruction: typeof createExecuteInstruction;
declare const index$a_createExecuteInstructionAccounts: typeof createExecuteInstructionAccounts;
declare const index$a_createInitExecutorInstruction: typeof createInitExecutorInstruction;
declare const index$a_createInitExecutorInstructionAccounts: typeof createInitExecutorInstructionAccounts;
declare const index$a_createNativeDropInstruction: typeof createNativeDropInstruction;
declare const index$a_createNativeDropInstructionAccounts: typeof createNativeDropInstructionAccounts;
declare const index$a_createOwnerSetConfigInstruction: typeof createOwnerSetConfigInstruction;
declare const index$a_createOwnerSetConfigInstructionAccounts: typeof createOwnerSetConfigInstructionAccounts;
declare const index$a_createQuoteExecutorInstruction: typeof createQuoteExecutorInstruction;
declare const index$a_createQuoteExecutorInstructionAccounts: typeof createQuoteExecutorInstructionAccounts;
declare const index$a_executableInstructionDiscriminator: typeof executableInstructionDiscriminator;
declare const index$a_executableStruct: typeof executableStruct;
declare const index$a_executeInstructionDiscriminator: typeof executeInstructionDiscriminator;
declare const index$a_executeStruct: typeof executeStruct;
declare const index$a_initExecutorInstructionDiscriminator: typeof initExecutorInstructionDiscriminator;
declare const index$a_initExecutorStruct: typeof initExecutorStruct;
declare const index$a_nativeDropInstructionDiscriminator: typeof nativeDropInstructionDiscriminator;
declare const index$a_nativeDropStruct: typeof nativeDropStruct;
declare const index$a_ownerSetConfigInstructionDiscriminator: typeof ownerSetConfigInstructionDiscriminator;
declare const index$a_ownerSetConfigStruct: typeof ownerSetConfigStruct;
declare const index$a_quoteExecutorInstructionDiscriminator: typeof quoteExecutorInstructionDiscriminator;
declare const index$a_quoteExecutorStruct: typeof quoteExecutorStruct;
declare namespace index$a {
  export { type index$a_AdminSetConfigInstructionAccounts as AdminSetConfigInstructionAccounts, type index$a_AdminSetConfigInstructionArgs as AdminSetConfigInstructionArgs, type index$a_ComposeInstructionAccounts as ComposeInstructionAccounts, type index$a_ComposeInstructionArgs as ComposeInstructionArgs, type index$a_ExecutableInstructionAccounts as ExecutableInstructionAccounts, type index$a_ExecutableInstructionArgs as ExecutableInstructionArgs, type index$a_ExecuteInstructionAccounts as ExecuteInstructionAccounts, type index$a_ExecuteInstructionArgs as ExecuteInstructionArgs, type index$a_InitExecutorInstructionAccounts as InitExecutorInstructionAccounts, type index$a_InitExecutorInstructionArgs as InitExecutorInstructionArgs, type index$a_NativeDropInstructionAccounts as NativeDropInstructionAccounts, type index$a_NativeDropInstructionArgs as NativeDropInstructionArgs, type index$a_OwnerSetConfigInstructionAccounts as OwnerSetConfigInstructionAccounts, type index$a_OwnerSetConfigInstructionArgs as OwnerSetConfigInstructionArgs, type index$a_QuoteExecutorInstructionAccounts as QuoteExecutorInstructionAccounts, type index$a_QuoteExecutorInstructionArgs as QuoteExecutorInstructionArgs, index$a_adminSetConfigInstructionDiscriminator as adminSetConfigInstructionDiscriminator, index$a_adminSetConfigStruct as adminSetConfigStruct, index$a_composeInstructionDiscriminator as composeInstructionDiscriminator, index$a_composeStruct as composeStruct, index$a_createAdminSetConfigInstruction as createAdminSetConfigInstruction, index$a_createAdminSetConfigInstructionAccounts as createAdminSetConfigInstructionAccounts, index$a_createComposeInstruction as createComposeInstruction, index$a_createComposeInstructionAccounts as createComposeInstructionAccounts, index$a_createExecutableInstruction as createExecutableInstruction, index$a_createExecutableInstructionAccounts as createExecutableInstructionAccounts, index$a_createExecuteInstruction as createExecuteInstruction, index$a_createExecuteInstructionAccounts as createExecuteInstructionAccounts, index$a_createInitExecutorInstruction as createInitExecutorInstruction, index$a_createInitExecutorInstructionAccounts as createInitExecutorInstructionAccounts, index$a_createNativeDropInstruction as createNativeDropInstruction, index$a_createNativeDropInstructionAccounts as createNativeDropInstructionAccounts, index$a_createOwnerSetConfigInstruction as createOwnerSetConfigInstruction, index$a_createOwnerSetConfigInstructionAccounts as createOwnerSetConfigInstructionAccounts, index$a_createQuoteExecutorInstruction as createQuoteExecutorInstruction, index$a_createQuoteExecutorInstructionAccounts as createQuoteExecutorInstructionAccounts, index$a_executableInstructionDiscriminator as executableInstructionDiscriminator, index$a_executableStruct as executableStruct, index$a_executeInstructionDiscriminator as executeInstructionDiscriminator, index$a_executeStruct as executeStruct, index$a_initExecutorInstructionDiscriminator as initExecutorInstructionDiscriminator, index$a_initExecutorStruct as initExecutorStruct, index$a_nativeDropInstructionDiscriminator as nativeDropInstructionDiscriminator, index$a_nativeDropStruct as nativeDropStruct, index$a_ownerSetConfigInstructionDiscriminator as ownerSetConfigInstructionDiscriminator, index$a_ownerSetConfigStruct as ownerSetConfigStruct, index$a_quoteExecutorInstructionDiscriminator as quoteExecutorInstructionDiscriminator, index$a_quoteExecutorStruct as quoteExecutorStruct };
}

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category enums
 * @category generated
 */
declare enum ExecutionState {
    NotExecutable = 0,
    VerifiedButNotExecutable = 1,
    Executable = 2,
    Executed = 3
}
/**
 * @category userTypes
 * @category generated
 */
declare const executionStateBeet: beet.FixedSizeBeet<ExecutionState, ExecutionState>;

type index$9_Acl = Acl;
type index$9_AdminSetConfigParams = AdminSetConfigParams;
type index$9_AdminSetConfigParamsRecord = AdminSetConfigParamsRecord;
type index$9_ComposeParams = ComposeParams;
type index$9_DstConfig = DstConfig;
type index$9_ExecutableParams = ExecutableParams;
type index$9_ExecuteParams = ExecuteParams;
type index$9_ExecutionState = ExecutionState;
declare const index$9_ExecutionState: typeof ExecutionState;
type index$9_InitExecutorParams = InitExecutorParams;
type index$9_LzOption = LzOption;
type index$9_NativeDropParams = NativeDropParams;
type index$9_NativeDropRequest = NativeDropRequest;
type index$9_OwnerSetConfigParams = OwnerSetConfigParams;
type index$9_OwnerSetConfigParamsRecord = OwnerSetConfigParamsRecord;
type index$9_QuoteExecutorParams = QuoteExecutorParams;
declare const index$9_aclBeet: typeof aclBeet;
declare const index$9_adminSetConfigParamsBeet: typeof adminSetConfigParamsBeet;
declare const index$9_composeParamsBeet: typeof composeParamsBeet;
declare const index$9_dstConfigBeet: typeof dstConfigBeet;
declare const index$9_executableParamsBeet: typeof executableParamsBeet;
declare const index$9_executeParamsBeet: typeof executeParamsBeet;
declare const index$9_executionStateBeet: typeof executionStateBeet;
declare const index$9_initExecutorParamsBeet: typeof initExecutorParamsBeet;
declare const index$9_isAdminSetConfigParamsDefaultMultiplierBps: typeof isAdminSetConfigParamsDefaultMultiplierBps;
declare const index$9_isAdminSetConfigParamsDstConfigs: typeof isAdminSetConfigParamsDstConfigs;
declare const index$9_isAdminSetConfigParamsPriceFeed: typeof isAdminSetConfigParamsPriceFeed;
declare const index$9_isOwnerSetConfigParamsAdmins: typeof isOwnerSetConfigParamsAdmins;
declare const index$9_isOwnerSetConfigParamsAllowlist: typeof isOwnerSetConfigParamsAllowlist;
declare const index$9_isOwnerSetConfigParamsDenylist: typeof isOwnerSetConfigParamsDenylist;
declare const index$9_isOwnerSetConfigParamsExecutors: typeof isOwnerSetConfigParamsExecutors;
declare const index$9_isOwnerSetConfigParamsMsglibs: typeof isOwnerSetConfigParamsMsglibs;
declare const index$9_isOwnerSetConfigParamsOwner: typeof isOwnerSetConfigParamsOwner;
declare const index$9_isOwnerSetConfigParamsPaused: typeof isOwnerSetConfigParamsPaused;
declare const index$9_lzComposeParamsBeet: typeof lzComposeParamsBeet;
declare const index$9_lzOptionBeet: typeof lzOptionBeet;
declare const index$9_lzReceiveParamsBeet: typeof lzReceiveParamsBeet;
declare const index$9_nativeDropParamsBeet: typeof nativeDropParamsBeet;
declare const index$9_nativeDropRequestBeet: typeof nativeDropRequestBeet;
declare const index$9_ownerSetConfigParamsBeet: typeof ownerSetConfigParamsBeet;
declare const index$9_quoteExecutorParamsBeet: typeof quoteExecutorParamsBeet;
declare namespace index$9 {
  export { type index$9_Acl as Acl, type index$9_AdminSetConfigParams as AdminSetConfigParams, type index$9_AdminSetConfigParamsRecord as AdminSetConfigParamsRecord, type index$9_ComposeParams as ComposeParams, type index$9_DstConfig as DstConfig, type index$9_ExecutableParams as ExecutableParams, type index$9_ExecuteParams as ExecuteParams, index$9_ExecutionState as ExecutionState, type index$9_InitExecutorParams as InitExecutorParams, type LzComposeParams$1 as LzComposeParams, type index$9_LzOption as LzOption, type LzReceiveParams$1 as LzReceiveParams, type index$9_NativeDropParams as NativeDropParams, type index$9_NativeDropRequest as NativeDropRequest, type index$9_OwnerSetConfigParams as OwnerSetConfigParams, type index$9_OwnerSetConfigParamsRecord as OwnerSetConfigParamsRecord, type index$9_QuoteExecutorParams as QuoteExecutorParams, index$9_aclBeet as aclBeet, index$9_adminSetConfigParamsBeet as adminSetConfigParamsBeet, index$9_composeParamsBeet as composeParamsBeet, index$9_dstConfigBeet as dstConfigBeet, index$9_executableParamsBeet as executableParamsBeet, index$9_executeParamsBeet as executeParamsBeet, index$9_executionStateBeet as executionStateBeet, index$9_initExecutorParamsBeet as initExecutorParamsBeet, index$9_isAdminSetConfigParamsDefaultMultiplierBps as isAdminSetConfigParamsDefaultMultiplierBps, index$9_isAdminSetConfigParamsDstConfigs as isAdminSetConfigParamsDstConfigs, index$9_isAdminSetConfigParamsPriceFeed as isAdminSetConfigParamsPriceFeed, index$9_isOwnerSetConfigParamsAdmins as isOwnerSetConfigParamsAdmins, index$9_isOwnerSetConfigParamsAllowlist as isOwnerSetConfigParamsAllowlist, index$9_isOwnerSetConfigParamsDenylist as isOwnerSetConfigParamsDenylist, index$9_isOwnerSetConfigParamsExecutors as isOwnerSetConfigParamsExecutors, index$9_isOwnerSetConfigParamsMsglibs as isOwnerSetConfigParamsMsglibs, index$9_isOwnerSetConfigParamsOwner as isOwnerSetConfigParamsOwner, index$9_isOwnerSetConfigParamsPaused as isOwnerSetConfigParamsPaused, index$9_lzComposeParamsBeet as lzComposeParamsBeet, index$9_lzOptionBeet as lzOptionBeet, index$9_lzReceiveParamsBeet as lzReceiveParamsBeet, index$9_nativeDropParamsBeet as nativeDropParamsBeet, index$9_nativeDropRequestBeet as nativeDropRequestBeet, index$9_ownerSetConfigParamsBeet as ownerSetConfigParamsBeet, index$9_quoteExecutorParamsBeet as quoteExecutorParamsBeet };
}

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */
type ErrorWithCode$1 = Error & {
    code: number;
};
type MaybeErrorWithCode$1 = ErrorWithCode$1 | null | undefined;
/**
 * InvalidSize: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidSizeError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * Paused: ''
 *
 * @category Errors
 * @category generated
 */
declare class PausedError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * UnsupportedOptionType: ''
 *
 * @category Errors
 * @category generated
 */
declare class UnsupportedOptionTypeError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * ZeroLzComposeGasProvided: ''
 *
 * @category Errors
 * @category generated
 */
declare class ZeroLzComposeGasProvidedError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * ZeroLzReceiveGasProvided: ''
 *
 * @category Errors
 * @category generated
 */
declare class ZeroLzReceiveGasProvidedError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * NativeAmountExceedsCap: ''
 *
 * @category Errors
 * @category generated
 */
declare class NativeAmountExceedsCapError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * NotAdmin: ''
 *
 * @category Errors
 * @category generated
 */
declare class NotAdminError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * NotExecutor: ''
 *
 * @category Errors
 * @category generated
 */
declare class NotExecutorError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * MsgLibNotAllowed: ''
 *
 * @category Errors
 * @category generated
 */
declare class MsgLibNotAllowedError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * TooManyAdmins: ''
 *
 * @category Errors
 * @category generated
 */
declare class TooManyAdminsError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * TooManyExecutors: ''
 *
 * @category Errors
 * @category generated
 */
declare class TooManyExecutorsError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * TooManyOptionTypes: ''
 *
 * @category Errors
 * @category generated
 */
declare class TooManyOptionTypesError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidNativeDropRequestsLength: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidNativeDropRequestsLengthError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidNativeDropReceiver: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidNativeDropReceiverError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InsufficientBalance: ''
 *
 * @category Errors
 * @category generated
 */
declare class InsufficientBalanceError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * EidNotSupported: ''
 *
 * @category Errors
 * @category generated
 */
declare class EidNotSupportedError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * ExecutorIsAdmin: ''
 *
 * @category Errors
 * @category generated
 */
declare class ExecutorIsAdminError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidOwner: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidOwnerError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * Attempts to resolve a custom program error from the provided error code.
 * @category Errors
 * @category generated
 */
declare function errorFromCode$1(code: number): MaybeErrorWithCode$1;
/**
 * Attempts to resolve a custom program error from the provided error name, i.e. 'Unauthorized'.
 * @category Errors
 * @category generated
 */
declare function errorFromName$1(name: string): MaybeErrorWithCode$1;

/**
 * Program address
 *
 * @category constants
 * @category generated
 */
declare const PROGRAM_ADDRESS$2 = "6doghB248px58JSSwG4qejQ46kFMW4AMj7vzJnWZHNZn";
/**
 * Program public key
 *
 * @category constants
 * @category generated
 */
declare const PROGRAM_ID$3: PublicKey;

declare class Executor {
    program: PublicKey;
    deriver: ExecutorPDADeriver;
    constructor(program: PublicKey);
    initExecutor(payer: PublicKey, owner: PublicKey, admins: PublicKey[], executors: PublicKey[], msglibs: PublicKey[], priceFeed: PublicKey): TransactionInstruction;
    setOwner(owner: PublicKey, newOwner: PublicKey): TransactionInstruction;
    setAdmins(owner: PublicKey, admins: PublicKey[]): TransactionInstruction;
    setAllowList(owner: PublicKey, allowlist: PublicKey[]): TransactionInstruction;
    setDenyList(owner: PublicKey, denylist: PublicKey[]): TransactionInstruction;
    setPaused(owner: PublicKey, paused: boolean): TransactionInstruction;
    setExecutors(owner: PublicKey, executors: PublicKey[]): TransactionInstruction;
    setMsglibByPrograms(owner: PublicKey, msglibPrograms: PublicKey[]): TransactionInstruction;
    setMsglibByPDAs(owner: PublicKey, msglibPDAs: PublicKey[]): TransactionInstruction;
    setDefaultMultiplierBps(admin: PublicKey, defaultMultiplierBps: number): TransactionInstruction;
    setDstConfig(admin: PublicKey, dstConfigs: DstConfig[]): TransactionInstruction;
    setPriceFeed(admin: PublicKey, priceFeedProgram: PublicKey): TransactionInstruction;
    getExecutorConfig(connection: Connection, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<ExecutorConfig$1 | null>;
    getQuoteIXAccountMetaForCPI(priceFeedConfig: PublicKey, priceFeedProgram: PublicKey, payment: boolean): AccountMeta[];
    execute(connection: Connection, executor: PublicKey, endpointProgram: PublicKey, packet: Packet$2, extraData: Uint8Array, value?: BN, computeUnits?: number, commitmentOrConfig?: Commitment): Promise<TransactionInstruction>;
    compose(connection: Connection, executor: PublicKey, endpointProgram: PublicKey, event: ComposeSentEvent, extraData: Uint8Array, value?: BN, computeUnits?: number, commitmentOrConfig?: Commitment): Promise<TransactionInstruction>;
}

type executor_Acl = Acl;
type executor_AdminSetConfigInstructionAccounts = AdminSetConfigInstructionAccounts;
type executor_AdminSetConfigInstructionArgs = AdminSetConfigInstructionArgs;
type executor_AdminSetConfigParams = AdminSetConfigParams;
type executor_AdminSetConfigParamsRecord = AdminSetConfigParamsRecord;
type executor_ComposeInstructionAccounts = ComposeInstructionAccounts;
type executor_ComposeInstructionArgs = ComposeInstructionArgs;
type executor_ComposeParams = ComposeParams;
type executor_DstConfig = DstConfig;
type executor_EidNotSupportedError = EidNotSupportedError;
declare const executor_EidNotSupportedError: typeof EidNotSupportedError;
type executor_ExecutableInstructionAccounts = ExecutableInstructionAccounts;
type executor_ExecutableInstructionArgs = ExecutableInstructionArgs;
type executor_ExecutableParams = ExecutableParams;
type executor_ExecuteInstructionAccounts = ExecuteInstructionAccounts;
type executor_ExecuteInstructionArgs = ExecuteInstructionArgs;
type executor_ExecuteParams = ExecuteParams;
type executor_ExecutionState = ExecutionState;
declare const executor_ExecutionState: typeof ExecutionState;
type executor_Executor = Executor;
declare const executor_Executor: typeof Executor;
type executor_ExecutorConfigArgs = ExecutorConfigArgs;
type executor_ExecutorIsAdminError = ExecutorIsAdminError;
declare const executor_ExecutorIsAdminError: typeof ExecutorIsAdminError;
type executor_InitExecutorInstructionAccounts = InitExecutorInstructionAccounts;
type executor_InitExecutorInstructionArgs = InitExecutorInstructionArgs;
type executor_InitExecutorParams = InitExecutorParams;
type executor_InsufficientBalanceError = InsufficientBalanceError;
declare const executor_InsufficientBalanceError: typeof InsufficientBalanceError;
type executor_InvalidNativeDropReceiverError = InvalidNativeDropReceiverError;
declare const executor_InvalidNativeDropReceiverError: typeof InvalidNativeDropReceiverError;
type executor_InvalidNativeDropRequestsLengthError = InvalidNativeDropRequestsLengthError;
declare const executor_InvalidNativeDropRequestsLengthError: typeof InvalidNativeDropRequestsLengthError;
type executor_InvalidOwnerError = InvalidOwnerError;
declare const executor_InvalidOwnerError: typeof InvalidOwnerError;
type executor_InvalidSizeError = InvalidSizeError;
declare const executor_InvalidSizeError: typeof InvalidSizeError;
type executor_LzOption = LzOption;
type executor_MsgLibNotAllowedError = MsgLibNotAllowedError;
declare const executor_MsgLibNotAllowedError: typeof MsgLibNotAllowedError;
type executor_NativeAmountExceedsCapError = NativeAmountExceedsCapError;
declare const executor_NativeAmountExceedsCapError: typeof NativeAmountExceedsCapError;
type executor_NativeDropInstructionAccounts = NativeDropInstructionAccounts;
type executor_NativeDropInstructionArgs = NativeDropInstructionArgs;
type executor_NativeDropParams = NativeDropParams;
type executor_NativeDropRequest = NativeDropRequest;
type executor_Nonce = Nonce;
declare const executor_Nonce: typeof Nonce;
type executor_NonceArgs = NonceArgs;
type executor_NotAdminError = NotAdminError;
declare const executor_NotAdminError: typeof NotAdminError;
type executor_NotExecutorError = NotExecutorError;
declare const executor_NotExecutorError: typeof NotExecutorError;
type executor_OwnerSetConfigInstructionAccounts = OwnerSetConfigInstructionAccounts;
type executor_OwnerSetConfigInstructionArgs = OwnerSetConfigInstructionArgs;
type executor_OwnerSetConfigParams = OwnerSetConfigParams;
type executor_OwnerSetConfigParamsRecord = OwnerSetConfigParamsRecord;
type executor_PausedError = PausedError;
declare const executor_PausedError: typeof PausedError;
type executor_QuoteExecutorInstructionAccounts = QuoteExecutorInstructionAccounts;
type executor_QuoteExecutorInstructionArgs = QuoteExecutorInstructionArgs;
type executor_QuoteExecutorParams = QuoteExecutorParams;
type executor_TooManyAdminsError = TooManyAdminsError;
declare const executor_TooManyAdminsError: typeof TooManyAdminsError;
type executor_TooManyExecutorsError = TooManyExecutorsError;
declare const executor_TooManyExecutorsError: typeof TooManyExecutorsError;
type executor_TooManyOptionTypesError = TooManyOptionTypesError;
declare const executor_TooManyOptionTypesError: typeof TooManyOptionTypesError;
type executor_UnsupportedOptionTypeError = UnsupportedOptionTypeError;
declare const executor_UnsupportedOptionTypeError: typeof UnsupportedOptionTypeError;
type executor_ZeroLzComposeGasProvidedError = ZeroLzComposeGasProvidedError;
declare const executor_ZeroLzComposeGasProvidedError: typeof ZeroLzComposeGasProvidedError;
type executor_ZeroLzReceiveGasProvidedError = ZeroLzReceiveGasProvidedError;
declare const executor_ZeroLzReceiveGasProvidedError: typeof ZeroLzReceiveGasProvidedError;
declare const executor_aclBeet: typeof aclBeet;
declare const executor_adminSetConfigInstructionDiscriminator: typeof adminSetConfigInstructionDiscriminator;
declare const executor_adminSetConfigParamsBeet: typeof adminSetConfigParamsBeet;
declare const executor_adminSetConfigStruct: typeof adminSetConfigStruct;
declare const executor_composeInstructionDiscriminator: typeof composeInstructionDiscriminator;
declare const executor_composeParamsBeet: typeof composeParamsBeet;
declare const executor_composeStruct: typeof composeStruct;
declare const executor_createAdminSetConfigInstruction: typeof createAdminSetConfigInstruction;
declare const executor_createAdminSetConfigInstructionAccounts: typeof createAdminSetConfigInstructionAccounts;
declare const executor_createComposeInstruction: typeof createComposeInstruction;
declare const executor_createComposeInstructionAccounts: typeof createComposeInstructionAccounts;
declare const executor_createExecutableInstruction: typeof createExecutableInstruction;
declare const executor_createExecutableInstructionAccounts: typeof createExecutableInstructionAccounts;
declare const executor_createExecuteInstruction: typeof createExecuteInstruction;
declare const executor_createExecuteInstructionAccounts: typeof createExecuteInstructionAccounts;
declare const executor_createInitExecutorInstruction: typeof createInitExecutorInstruction;
declare const executor_createInitExecutorInstructionAccounts: typeof createInitExecutorInstructionAccounts;
declare const executor_createNativeDropInstruction: typeof createNativeDropInstruction;
declare const executor_createNativeDropInstructionAccounts: typeof createNativeDropInstructionAccounts;
declare const executor_createOwnerSetConfigInstruction: typeof createOwnerSetConfigInstruction;
declare const executor_createOwnerSetConfigInstructionAccounts: typeof createOwnerSetConfigInstructionAccounts;
declare const executor_createQuoteExecutorInstruction: typeof createQuoteExecutorInstruction;
declare const executor_createQuoteExecutorInstructionAccounts: typeof createQuoteExecutorInstructionAccounts;
declare const executor_dstConfigBeet: typeof dstConfigBeet;
declare const executor_executableInstructionDiscriminator: typeof executableInstructionDiscriminator;
declare const executor_executableParamsBeet: typeof executableParamsBeet;
declare const executor_executableStruct: typeof executableStruct;
declare const executor_executeInstructionDiscriminator: typeof executeInstructionDiscriminator;
declare const executor_executeParamsBeet: typeof executeParamsBeet;
declare const executor_executeStruct: typeof executeStruct;
declare const executor_executionStateBeet: typeof executionStateBeet;
declare const executor_executorConfigDiscriminator: typeof executorConfigDiscriminator;
declare const executor_initExecutorInstructionDiscriminator: typeof initExecutorInstructionDiscriminator;
declare const executor_initExecutorParamsBeet: typeof initExecutorParamsBeet;
declare const executor_initExecutorStruct: typeof initExecutorStruct;
declare const executor_isAdminSetConfigParamsDefaultMultiplierBps: typeof isAdminSetConfigParamsDefaultMultiplierBps;
declare const executor_isAdminSetConfigParamsDstConfigs: typeof isAdminSetConfigParamsDstConfigs;
declare const executor_isAdminSetConfigParamsPriceFeed: typeof isAdminSetConfigParamsPriceFeed;
declare const executor_isOwnerSetConfigParamsAdmins: typeof isOwnerSetConfigParamsAdmins;
declare const executor_isOwnerSetConfigParamsAllowlist: typeof isOwnerSetConfigParamsAllowlist;
declare const executor_isOwnerSetConfigParamsDenylist: typeof isOwnerSetConfigParamsDenylist;
declare const executor_isOwnerSetConfigParamsExecutors: typeof isOwnerSetConfigParamsExecutors;
declare const executor_isOwnerSetConfigParamsMsglibs: typeof isOwnerSetConfigParamsMsglibs;
declare const executor_isOwnerSetConfigParamsOwner: typeof isOwnerSetConfigParamsOwner;
declare const executor_isOwnerSetConfigParamsPaused: typeof isOwnerSetConfigParamsPaused;
declare const executor_lzComposeParamsBeet: typeof lzComposeParamsBeet;
declare const executor_lzOptionBeet: typeof lzOptionBeet;
declare const executor_lzReceiveParamsBeet: typeof lzReceiveParamsBeet;
declare const executor_nativeDropInstructionDiscriminator: typeof nativeDropInstructionDiscriminator;
declare const executor_nativeDropParamsBeet: typeof nativeDropParamsBeet;
declare const executor_nativeDropRequestBeet: typeof nativeDropRequestBeet;
declare const executor_nativeDropStruct: typeof nativeDropStruct;
declare const executor_nonceBeet: typeof nonceBeet;
declare const executor_nonceDiscriminator: typeof nonceDiscriminator;
declare const executor_ownerSetConfigInstructionDiscriminator: typeof ownerSetConfigInstructionDiscriminator;
declare const executor_ownerSetConfigParamsBeet: typeof ownerSetConfigParamsBeet;
declare const executor_ownerSetConfigStruct: typeof ownerSetConfigStruct;
declare const executor_quoteExecutorInstructionDiscriminator: typeof quoteExecutorInstructionDiscriminator;
declare const executor_quoteExecutorParamsBeet: typeof quoteExecutorParamsBeet;
declare const executor_quoteExecutorStruct: typeof quoteExecutorStruct;
declare namespace executor {
  export { type executor_Acl as Acl, type executor_AdminSetConfigInstructionAccounts as AdminSetConfigInstructionAccounts, type executor_AdminSetConfigInstructionArgs as AdminSetConfigInstructionArgs, type executor_AdminSetConfigParams as AdminSetConfigParams, type executor_AdminSetConfigParamsRecord as AdminSetConfigParamsRecord, type executor_ComposeInstructionAccounts as ComposeInstructionAccounts, type executor_ComposeInstructionArgs as ComposeInstructionArgs, type executor_ComposeParams as ComposeParams, type executor_DstConfig as DstConfig, executor_EidNotSupportedError as EidNotSupportedError, type executor_ExecutableInstructionAccounts as ExecutableInstructionAccounts, type executor_ExecutableInstructionArgs as ExecutableInstructionArgs, type executor_ExecutableParams as ExecutableParams, type executor_ExecuteInstructionAccounts as ExecuteInstructionAccounts, type executor_ExecuteInstructionArgs as ExecuteInstructionArgs, type executor_ExecuteParams as ExecuteParams, executor_ExecutionState as ExecutionState, executor_Executor as Executor, ExecutorConfig$1 as ExecutorConfig, type executor_ExecutorConfigArgs as ExecutorConfigArgs, executor_ExecutorIsAdminError as ExecutorIsAdminError, type executor_InitExecutorInstructionAccounts as InitExecutorInstructionAccounts, type executor_InitExecutorInstructionArgs as InitExecutorInstructionArgs, type executor_InitExecutorParams as InitExecutorParams, executor_InsufficientBalanceError as InsufficientBalanceError, executor_InvalidNativeDropReceiverError as InvalidNativeDropReceiverError, executor_InvalidNativeDropRequestsLengthError as InvalidNativeDropRequestsLengthError, executor_InvalidOwnerError as InvalidOwnerError, executor_InvalidSizeError as InvalidSizeError, type LzComposeParams$1 as LzComposeParams, type executor_LzOption as LzOption, type LzReceiveParams$1 as LzReceiveParams, executor_MsgLibNotAllowedError as MsgLibNotAllowedError, executor_NativeAmountExceedsCapError as NativeAmountExceedsCapError, type executor_NativeDropInstructionAccounts as NativeDropInstructionAccounts, type executor_NativeDropInstructionArgs as NativeDropInstructionArgs, type executor_NativeDropParams as NativeDropParams, type executor_NativeDropRequest as NativeDropRequest, executor_Nonce as Nonce, type executor_NonceArgs as NonceArgs, executor_NotAdminError as NotAdminError, executor_NotExecutorError as NotExecutorError, type executor_OwnerSetConfigInstructionAccounts as OwnerSetConfigInstructionAccounts, type executor_OwnerSetConfigInstructionArgs as OwnerSetConfigInstructionArgs, type executor_OwnerSetConfigParams as OwnerSetConfigParams, type executor_OwnerSetConfigParamsRecord as OwnerSetConfigParamsRecord, PROGRAM_ADDRESS$2 as PROGRAM_ADDRESS, PROGRAM_ID$3 as PROGRAM_ID, executor_PausedError as PausedError, type executor_QuoteExecutorInstructionAccounts as QuoteExecutorInstructionAccounts, type executor_QuoteExecutorInstructionArgs as QuoteExecutorInstructionArgs, type executor_QuoteExecutorParams as QuoteExecutorParams, executor_TooManyAdminsError as TooManyAdminsError, executor_TooManyExecutorsError as TooManyExecutorsError, executor_TooManyOptionTypesError as TooManyOptionTypesError, executor_UnsupportedOptionTypeError as UnsupportedOptionTypeError, executor_ZeroLzComposeGasProvidedError as ZeroLzComposeGasProvidedError, executor_ZeroLzReceiveGasProvidedError as ZeroLzReceiveGasProvidedError, accountProviders$2 as accountProviders, index$c as accounts, executor_aclBeet as aclBeet, executor_adminSetConfigInstructionDiscriminator as adminSetConfigInstructionDiscriminator, executor_adminSetConfigParamsBeet as adminSetConfigParamsBeet, executor_adminSetConfigStruct as adminSetConfigStruct, executor_composeInstructionDiscriminator as composeInstructionDiscriminator, executor_composeParamsBeet as composeParamsBeet, executor_composeStruct as composeStruct, executor_createAdminSetConfigInstruction as createAdminSetConfigInstruction, executor_createAdminSetConfigInstructionAccounts as createAdminSetConfigInstructionAccounts, executor_createComposeInstruction as createComposeInstruction, executor_createComposeInstructionAccounts as createComposeInstructionAccounts, executor_createExecutableInstruction as createExecutableInstruction, executor_createExecutableInstructionAccounts as createExecutableInstructionAccounts, executor_createExecuteInstruction as createExecuteInstruction, executor_createExecuteInstructionAccounts as createExecuteInstructionAccounts, executor_createInitExecutorInstruction as createInitExecutorInstruction, executor_createInitExecutorInstructionAccounts as createInitExecutorInstructionAccounts, executor_createNativeDropInstruction as createNativeDropInstruction, executor_createNativeDropInstructionAccounts as createNativeDropInstructionAccounts, executor_createOwnerSetConfigInstruction as createOwnerSetConfigInstruction, executor_createOwnerSetConfigInstructionAccounts as createOwnerSetConfigInstructionAccounts, executor_createQuoteExecutorInstruction as createQuoteExecutorInstruction, executor_createQuoteExecutorInstructionAccounts as createQuoteExecutorInstructionAccounts, executor_dstConfigBeet as dstConfigBeet, errorFromCode$1 as errorFromCode, errorFromName$1 as errorFromName, index$b as events, executor_executableInstructionDiscriminator as executableInstructionDiscriminator, executor_executableParamsBeet as executableParamsBeet, executor_executableStruct as executableStruct, executor_executeInstructionDiscriminator as executeInstructionDiscriminator, executor_executeParamsBeet as executeParamsBeet, executor_executeStruct as executeStruct, executor_executionStateBeet as executionStateBeet, executorConfigBeet$1 as executorConfigBeet, executor_executorConfigDiscriminator as executorConfigDiscriminator, executor_initExecutorInstructionDiscriminator as initExecutorInstructionDiscriminator, executor_initExecutorParamsBeet as initExecutorParamsBeet, executor_initExecutorStruct as initExecutorStruct, index$a as instructions, executor_isAdminSetConfigParamsDefaultMultiplierBps as isAdminSetConfigParamsDefaultMultiplierBps, executor_isAdminSetConfigParamsDstConfigs as isAdminSetConfigParamsDstConfigs, executor_isAdminSetConfigParamsPriceFeed as isAdminSetConfigParamsPriceFeed, executor_isOwnerSetConfigParamsAdmins as isOwnerSetConfigParamsAdmins, executor_isOwnerSetConfigParamsAllowlist as isOwnerSetConfigParamsAllowlist, executor_isOwnerSetConfigParamsDenylist as isOwnerSetConfigParamsDenylist, executor_isOwnerSetConfigParamsExecutors as isOwnerSetConfigParamsExecutors, executor_isOwnerSetConfigParamsMsglibs as isOwnerSetConfigParamsMsglibs, executor_isOwnerSetConfigParamsOwner as isOwnerSetConfigParamsOwner, executor_isOwnerSetConfigParamsPaused as isOwnerSetConfigParamsPaused, executor_lzComposeParamsBeet as lzComposeParamsBeet, executor_lzOptionBeet as lzOptionBeet, executor_lzReceiveParamsBeet as lzReceiveParamsBeet, executor_nativeDropInstructionDiscriminator as nativeDropInstructionDiscriminator, executor_nativeDropParamsBeet as nativeDropParamsBeet, executor_nativeDropRequestBeet as nativeDropRequestBeet, executor_nativeDropStruct as nativeDropStruct, executor_nonceBeet as nonceBeet, executor_nonceDiscriminator as nonceDiscriminator, executor_ownerSetConfigInstructionDiscriminator as ownerSetConfigInstructionDiscriminator, executor_ownerSetConfigParamsBeet as ownerSetConfigParamsBeet, executor_ownerSetConfigStruct as ownerSetConfigStruct, executor_quoteExecutorInstructionDiscriminator as quoteExecutorInstructionDiscriminator, executor_quoteExecutorParamsBeet as quoteExecutorParamsBeet, executor_quoteExecutorStruct as quoteExecutorStruct, index$9 as types };
}

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * Arguments used to create {@link Confirmations}
 * @category Accounts
 * @category generated
 */
type ConfirmationsArgs = {
    value: beet.COption<beet.bignum>;
    bump: number;
};
declare const confirmationsDiscriminator: number[];
/**
 * Holds the data for the {@link Confirmations} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
declare class Confirmations implements ConfirmationsArgs {
    readonly value: beet.COption<beet.bignum>;
    readonly bump: number;
    private constructor();
    /**
     * Creates a {@link Confirmations} instance from the provided args.
     */
    static fromArgs(args: ConfirmationsArgs): Confirmations;
    /**
     * Deserializes the {@link Confirmations} from the data of the provided {@link web3.AccountInfo}.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static fromAccountInfo(accountInfo: web3.AccountInfo<Buffer>, offset?: number): [Confirmations, number];
    /**
     * Retrieves the account info from the provided address and deserializes
     * the {@link Confirmations} from its data.
     *
     * @throws Error if no account info is found at the address or if deserialization fails
     */
    static fromAccountAddress(connection: web3.Connection, address: web3.PublicKey, commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig): Promise<Confirmations>;
    /**
     * Provides a {@link web3.Connection.getProgramAccounts} config builder,
     * to fetch accounts matching filters that can be specified via that builder.
     *
     * @param programId - the program that owns the accounts we are filtering
     */
    static gpaBuilder(programId?: web3.PublicKey): beetSolana.GpaBuilder<ConfirmationsArgs & {
        accountDiscriminator: number[];
    }>;
    /**
     * Deserializes the {@link Confirmations} from the provided data Buffer.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static deserialize(buf: Buffer, offset?: number): [Confirmations, number];
    /**
     * Serializes the {@link Confirmations} into a Buffer.
     * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
     */
    serialize(): [Buffer, number];
    /**
     * Returns the byteSize of a {@link Buffer} holding the serialized data of
     * {@link Confirmations} for the provided args.
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     */
    static byteSize(args: ConfirmationsArgs): number;
    /**
     * Fetches the minimum balance needed to exempt an account holding
     * {@link Confirmations} data from rent
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     * @param connection used to retrieve the rent exemption information
     */
    static getMinimumBalanceForRentExemption(args: ConfirmationsArgs, connection: web3.Connection, commitment?: web3.Commitment): Promise<number>;
    /**
     * Returns a readable version of {@link Confirmations} properties
     * and can be used to convert to JSON and/or logging
     */
    pretty(): {
        value: beet.COption<beet.bignum>;
        bump: number;
    };
}
/**
 * @category Accounts
 * @category generated
 */
declare const confirmationsBeet: beet.FixableBeetStruct<Confirmations, ConfirmationsArgs & {
    accountDiscriminator: number[];
}>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type UlnConfig = {
    confirmations: beet.bignum;
    requiredDvnCount: number;
    optionalDvnCount: number;
    optionalDvnThreshold: number;
    requiredDvns: web3.PublicKey[];
    optionalDvns: web3.PublicKey[];
};
/**
 * @category userTypes
 * @category generated
 */
declare const ulnConfigBeet: beet.FixableBeetArgsStruct<UlnConfig>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * Arguments used to create {@link ReceiveConfig}
 * @category Accounts
 * @category generated
 */
type ReceiveConfigArgs = {
    bump: number;
    uln: UlnConfig;
};
declare const receiveConfigDiscriminator: number[];
/**
 * Holds the data for the {@link ReceiveConfig} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
declare class ReceiveConfig implements ReceiveConfigArgs {
    readonly bump: number;
    readonly uln: UlnConfig;
    private constructor();
    /**
     * Creates a {@link ReceiveConfig} instance from the provided args.
     */
    static fromArgs(args: ReceiveConfigArgs): ReceiveConfig;
    /**
     * Deserializes the {@link ReceiveConfig} from the data of the provided {@link web3.AccountInfo}.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static fromAccountInfo(accountInfo: web3.AccountInfo<Buffer>, offset?: number): [ReceiveConfig, number];
    /**
     * Retrieves the account info from the provided address and deserializes
     * the {@link ReceiveConfig} from its data.
     *
     * @throws Error if no account info is found at the address or if deserialization fails
     */
    static fromAccountAddress(connection: web3.Connection, address: web3.PublicKey, commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig): Promise<ReceiveConfig>;
    /**
     * Provides a {@link web3.Connection.getProgramAccounts} config builder,
     * to fetch accounts matching filters that can be specified via that builder.
     *
     * @param programId - the program that owns the accounts we are filtering
     */
    static gpaBuilder(programId?: web3.PublicKey): beetSolana.GpaBuilder<ReceiveConfigArgs & {
        accountDiscriminator: number[];
    }>;
    /**
     * Deserializes the {@link ReceiveConfig} from the provided data Buffer.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static deserialize(buf: Buffer, offset?: number): [ReceiveConfig, number];
    /**
     * Serializes the {@link ReceiveConfig} into a Buffer.
     * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
     */
    serialize(): [Buffer, number];
    /**
     * Returns the byteSize of a {@link Buffer} holding the serialized data of
     * {@link ReceiveConfig} for the provided args.
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     */
    static byteSize(args: ReceiveConfigArgs): number;
    /**
     * Fetches the minimum balance needed to exempt an account holding
     * {@link ReceiveConfig} data from rent
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     * @param connection used to retrieve the rent exemption information
     */
    static getMinimumBalanceForRentExemption(args: ReceiveConfigArgs, connection: web3.Connection, commitment?: web3.Commitment): Promise<number>;
    /**
     * Returns a readable version of {@link ReceiveConfig} properties
     * and can be used to convert to JSON and/or logging
     */
    pretty(): {
        bump: number;
        uln: UlnConfig;
    };
}
/**
 * @category Accounts
 * @category generated
 */
declare const receiveConfigBeet: beet.FixableBeetStruct<ReceiveConfig, ReceiveConfigArgs & {
    accountDiscriminator: number[];
}>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type ExecutorConfig = {
    maxMessageSize: number;
    executor: web3.PublicKey;
};
/**
 * @category userTypes
 * @category generated
 */
declare const executorConfigBeet: beet.BeetArgsStruct<ExecutorConfig>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * Arguments used to create {@link SendConfig}
 * @category Accounts
 * @category generated
 */
type SendConfigArgs = {
    bump: number;
    uln: UlnConfig;
    executor: ExecutorConfig;
};
declare const sendConfigDiscriminator: number[];
/**
 * Holds the data for the {@link SendConfig} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
declare class SendConfig implements SendConfigArgs {
    readonly bump: number;
    readonly uln: UlnConfig;
    readonly executor: ExecutorConfig;
    private constructor();
    /**
     * Creates a {@link SendConfig} instance from the provided args.
     */
    static fromArgs(args: SendConfigArgs): SendConfig;
    /**
     * Deserializes the {@link SendConfig} from the data of the provided {@link web3.AccountInfo}.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static fromAccountInfo(accountInfo: web3.AccountInfo<Buffer>, offset?: number): [SendConfig, number];
    /**
     * Retrieves the account info from the provided address and deserializes
     * the {@link SendConfig} from its data.
     *
     * @throws Error if no account info is found at the address or if deserialization fails
     */
    static fromAccountAddress(connection: web3.Connection, address: web3.PublicKey, commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig): Promise<SendConfig>;
    /**
     * Provides a {@link web3.Connection.getProgramAccounts} config builder,
     * to fetch accounts matching filters that can be specified via that builder.
     *
     * @param programId - the program that owns the accounts we are filtering
     */
    static gpaBuilder(programId?: web3.PublicKey): beetSolana.GpaBuilder<SendConfigArgs & {
        accountDiscriminator: number[];
    }>;
    /**
     * Deserializes the {@link SendConfig} from the provided data Buffer.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static deserialize(buf: Buffer, offset?: number): [SendConfig, number];
    /**
     * Serializes the {@link SendConfig} into a Buffer.
     * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
     */
    serialize(): [Buffer, number];
    /**
     * Returns the byteSize of a {@link Buffer} holding the serialized data of
     * {@link SendConfig} for the provided args.
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     */
    static byteSize(args: SendConfigArgs): number;
    /**
     * Fetches the minimum balance needed to exempt an account holding
     * {@link SendConfig} data from rent
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     * @param connection used to retrieve the rent exemption information
     */
    static getMinimumBalanceForRentExemption(args: SendConfigArgs, connection: web3.Connection, commitment?: web3.Commitment): Promise<number>;
    /**
     * Returns a readable version of {@link SendConfig} properties
     * and can be used to convert to JSON and/or logging
     */
    pretty(): {
        bump: number;
        uln: UlnConfig;
        executor: ExecutorConfig;
    };
}
/**
 * @category Accounts
 * @category generated
 */
declare const sendConfigBeet: beet.FixableBeetStruct<SendConfig, SendConfigArgs & {
    accountDiscriminator: number[];
}>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type LzTokenTreasury = {
    receiver: web3.PublicKey;
    fee: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const lzTokenTreasuryBeet: beet.BeetArgsStruct<LzTokenTreasury>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type Treasury = {
    admin: beet.COption<web3.PublicKey>;
    nativeReceiver: web3.PublicKey;
    nativeFeeBps: beet.bignum;
    lzToken: beet.COption<LzTokenTreasury>;
};
/**
 * @category userTypes
 * @category generated
 */
declare const treasuryBeet: beet.FixableBeetArgsStruct<Treasury>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * Arguments used to create {@link UlnSettings}
 * @category Accounts
 * @category generated
 */
type UlnSettingsArgs = {
    eid: number;
    endpoint: web3.PublicKey;
    endpointProgram: web3.PublicKey;
    bump: number;
    admin: web3.PublicKey;
    treasury: beet.COption<Treasury>;
};
declare const ulnSettingsDiscriminator: number[];
/**
 * Holds the data for the {@link UlnSettings} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
declare class UlnSettings implements UlnSettingsArgs {
    readonly eid: number;
    readonly endpoint: web3.PublicKey;
    readonly endpointProgram: web3.PublicKey;
    readonly bump: number;
    readonly admin: web3.PublicKey;
    readonly treasury: beet.COption<Treasury>;
    private constructor();
    /**
     * Creates a {@link UlnSettings} instance from the provided args.
     */
    static fromArgs(args: UlnSettingsArgs): UlnSettings;
    /**
     * Deserializes the {@link UlnSettings} from the data of the provided {@link web3.AccountInfo}.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static fromAccountInfo(accountInfo: web3.AccountInfo<Buffer>, offset?: number): [UlnSettings, number];
    /**
     * Retrieves the account info from the provided address and deserializes
     * the {@link UlnSettings} from its data.
     *
     * @throws Error if no account info is found at the address or if deserialization fails
     */
    static fromAccountAddress(connection: web3.Connection, address: web3.PublicKey, commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig): Promise<UlnSettings>;
    /**
     * Provides a {@link web3.Connection.getProgramAccounts} config builder,
     * to fetch accounts matching filters that can be specified via that builder.
     *
     * @param programId - the program that owns the accounts we are filtering
     */
    static gpaBuilder(programId?: web3.PublicKey): beetSolana.GpaBuilder<UlnSettingsArgs & {
        accountDiscriminator: number[];
    }>;
    /**
     * Deserializes the {@link UlnSettings} from the provided data Buffer.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static deserialize(buf: Buffer, offset?: number): [UlnSettings, number];
    /**
     * Serializes the {@link UlnSettings} into a Buffer.
     * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
     */
    serialize(): [Buffer, number];
    /**
     * Returns the byteSize of a {@link Buffer} holding the serialized data of
     * {@link UlnSettings} for the provided args.
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     */
    static byteSize(args: UlnSettingsArgs): number;
    /**
     * Fetches the minimum balance needed to exempt an account holding
     * {@link UlnSettings} data from rent
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     * @param connection used to retrieve the rent exemption information
     */
    static getMinimumBalanceForRentExemption(args: UlnSettingsArgs, connection: web3.Connection, commitment?: web3.Commitment): Promise<number>;
    /**
     * Returns a readable version of {@link UlnSettings} properties
     * and can be used to convert to JSON and/or logging
     */
    pretty(): {
        eid: number;
        endpoint: string;
        endpointProgram: string;
        bump: number;
        admin: string;
        treasury: beet.COption<Treasury>;
    };
}
/**
 * @category Accounts
 * @category generated
 */
declare const ulnSettingsBeet: beet.FixableBeetStruct<UlnSettings, UlnSettingsArgs & {
    accountDiscriminator: number[];
}>;

declare const accountProviders$1: {
    Confirmations: typeof Confirmations;
    ReceiveConfig: typeof ReceiveConfig;
    SendConfig: typeof SendConfig;
    UlnSettings: typeof UlnSettings;
};

type index$8_Confirmations = Confirmations;
declare const index$8_Confirmations: typeof Confirmations;
type index$8_ConfirmationsArgs = ConfirmationsArgs;
type index$8_ReceiveConfig = ReceiveConfig;
declare const index$8_ReceiveConfig: typeof ReceiveConfig;
type index$8_ReceiveConfigArgs = ReceiveConfigArgs;
type index$8_SendConfig = SendConfig;
declare const index$8_SendConfig: typeof SendConfig;
type index$8_SendConfigArgs = SendConfigArgs;
type index$8_UlnSettings = UlnSettings;
declare const index$8_UlnSettings: typeof UlnSettings;
type index$8_UlnSettingsArgs = UlnSettingsArgs;
declare const index$8_confirmationsBeet: typeof confirmationsBeet;
declare const index$8_confirmationsDiscriminator: typeof confirmationsDiscriminator;
declare const index$8_receiveConfigBeet: typeof receiveConfigBeet;
declare const index$8_receiveConfigDiscriminator: typeof receiveConfigDiscriminator;
declare const index$8_sendConfigBeet: typeof sendConfigBeet;
declare const index$8_sendConfigDiscriminator: typeof sendConfigDiscriminator;
declare const index$8_ulnSettingsBeet: typeof ulnSettingsBeet;
declare const index$8_ulnSettingsDiscriminator: typeof ulnSettingsDiscriminator;
declare namespace index$8 {
  export { index$8_Confirmations as Confirmations, type index$8_ConfirmationsArgs as ConfirmationsArgs, index$8_ReceiveConfig as ReceiveConfig, type index$8_ReceiveConfigArgs as ReceiveConfigArgs, index$8_SendConfig as SendConfig, type index$8_SendConfigArgs as SendConfigArgs, index$8_UlnSettings as UlnSettings, type index$8_UlnSettingsArgs as UlnSettingsArgs, accountProviders$1 as accountProviders, index$8_confirmationsBeet as confirmationsBeet, index$8_confirmationsDiscriminator as confirmationsDiscriminator, index$8_receiveConfigBeet as receiveConfigBeet, index$8_receiveConfigDiscriminator as receiveConfigDiscriminator, index$8_sendConfigBeet as sendConfigBeet, index$8_sendConfigDiscriminator as sendConfigDiscriminator, index$8_ulnSettingsBeet as ulnSettingsBeet, index$8_ulnSettingsDiscriminator as ulnSettingsDiscriminator };
}

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */
type ErrorWithCode = Error & {
    code: number;
};
type MaybeErrorWithCode = ErrorWithCode | null | undefined;
/**
 * Unauthorized: ''
 *
 * @category Errors
 * @category generated
 */
declare class UnauthorizedError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidAmount: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidAmountError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidExecutor: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidExecutorError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * ZeroMessageSize: ''
 *
 * @category Errors
 * @category generated
 */
declare class ZeroMessageSizeError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidRequiredDVNCount: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidRequiredDVNCountError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidOptionalDVNCount: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidOptionalDVNCountError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidOptionalDVNThreshold: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidOptionalDVNThresholdError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidConfirmations: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidConfirmationsError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * AtLeastOneDVN: ''
 *
 * @category Errors
 * @category generated
 */
declare class AtLeastOneDVNError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * Unsorted: ''
 *
 * @category Errors
 * @category generated
 */
declare class UnsortedError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidTreasuryFeeCap: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidTreasuryFeeCapError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidPacketVersion: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidPacketVersionError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidEid: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidEidError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * Verifying: ''
 *
 * @category Errors
 * @category generated
 */
declare class VerifyingError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidWorkerId: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidWorkerIdError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidOptionType: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidOptionTypeError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidBps: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidBpsError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * ExceededMaxMessageSize: ''
 *
 * @category Errors
 * @category generated
 */
declare class ExceededMaxMessageSizeError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidExecutorProgram: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidExecutorProgramError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidAccountLength: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidAccountLengthError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidDvnProgram: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidDvnProgramError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidDvn: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidDvnError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * LzTokenUnavailable: ''
 *
 * @category Errors
 * @category generated
 */
declare class LzTokenUnavailableError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InsufficientFee: ''
 *
 * @category Errors
 * @category generated
 */
declare class InsufficientFeeError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidTreasury: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidTreasuryError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidLzTokenMint: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidLzTokenMintError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidConfigType: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidConfigTypeError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidConfirmation: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidConfirmationError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidType1Size: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidType1SizeError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidType2Size: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidType2SizeError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * ExceededU128: ''
 *
 * @category Errors
 * @category generated
 */
declare class ExceededU128Error extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * NonSigner: ''
 *
 * @category Errors
 * @category generated
 */
declare class NonSignerError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * InvalidPayer: ''
 *
 * @category Errors
 * @category generated
 */
declare class InvalidPayerError extends Error {
    readonly code: number;
    readonly name: string;
    constructor();
}
/**
 * Attempts to resolve a custom program error from the provided error code.
 * @category Errors
 * @category generated
 */
declare function errorFromCode(code: number): MaybeErrorWithCode;
/**
 * Attempts to resolve a custom program error from the provided error name, i.e. 'Unauthorized'.
 * @category Errors
 * @category generated
 */
declare function errorFromName(name: string): MaybeErrorWithCode;

type index$7_AtLeastOneDVNError = AtLeastOneDVNError;
declare const index$7_AtLeastOneDVNError: typeof AtLeastOneDVNError;
type index$7_ExceededMaxMessageSizeError = ExceededMaxMessageSizeError;
declare const index$7_ExceededMaxMessageSizeError: typeof ExceededMaxMessageSizeError;
type index$7_ExceededU128Error = ExceededU128Error;
declare const index$7_ExceededU128Error: typeof ExceededU128Error;
type index$7_InsufficientFeeError = InsufficientFeeError;
declare const index$7_InsufficientFeeError: typeof InsufficientFeeError;
type index$7_InvalidAccountLengthError = InvalidAccountLengthError;
declare const index$7_InvalidAccountLengthError: typeof InvalidAccountLengthError;
type index$7_InvalidAmountError = InvalidAmountError;
declare const index$7_InvalidAmountError: typeof InvalidAmountError;
type index$7_InvalidBpsError = InvalidBpsError;
declare const index$7_InvalidBpsError: typeof InvalidBpsError;
type index$7_InvalidConfigTypeError = InvalidConfigTypeError;
declare const index$7_InvalidConfigTypeError: typeof InvalidConfigTypeError;
type index$7_InvalidConfirmationError = InvalidConfirmationError;
declare const index$7_InvalidConfirmationError: typeof InvalidConfirmationError;
type index$7_InvalidConfirmationsError = InvalidConfirmationsError;
declare const index$7_InvalidConfirmationsError: typeof InvalidConfirmationsError;
type index$7_InvalidDvnError = InvalidDvnError;
declare const index$7_InvalidDvnError: typeof InvalidDvnError;
type index$7_InvalidDvnProgramError = InvalidDvnProgramError;
declare const index$7_InvalidDvnProgramError: typeof InvalidDvnProgramError;
type index$7_InvalidEidError = InvalidEidError;
declare const index$7_InvalidEidError: typeof InvalidEidError;
type index$7_InvalidExecutorError = InvalidExecutorError;
declare const index$7_InvalidExecutorError: typeof InvalidExecutorError;
type index$7_InvalidExecutorProgramError = InvalidExecutorProgramError;
declare const index$7_InvalidExecutorProgramError: typeof InvalidExecutorProgramError;
type index$7_InvalidLzTokenMintError = InvalidLzTokenMintError;
declare const index$7_InvalidLzTokenMintError: typeof InvalidLzTokenMintError;
type index$7_InvalidOptionTypeError = InvalidOptionTypeError;
declare const index$7_InvalidOptionTypeError: typeof InvalidOptionTypeError;
type index$7_InvalidOptionalDVNCountError = InvalidOptionalDVNCountError;
declare const index$7_InvalidOptionalDVNCountError: typeof InvalidOptionalDVNCountError;
type index$7_InvalidOptionalDVNThresholdError = InvalidOptionalDVNThresholdError;
declare const index$7_InvalidOptionalDVNThresholdError: typeof InvalidOptionalDVNThresholdError;
type index$7_InvalidPacketVersionError = InvalidPacketVersionError;
declare const index$7_InvalidPacketVersionError: typeof InvalidPacketVersionError;
type index$7_InvalidPayerError = InvalidPayerError;
declare const index$7_InvalidPayerError: typeof InvalidPayerError;
type index$7_InvalidRequiredDVNCountError = InvalidRequiredDVNCountError;
declare const index$7_InvalidRequiredDVNCountError: typeof InvalidRequiredDVNCountError;
type index$7_InvalidTreasuryError = InvalidTreasuryError;
declare const index$7_InvalidTreasuryError: typeof InvalidTreasuryError;
type index$7_InvalidTreasuryFeeCapError = InvalidTreasuryFeeCapError;
declare const index$7_InvalidTreasuryFeeCapError: typeof InvalidTreasuryFeeCapError;
type index$7_InvalidType1SizeError = InvalidType1SizeError;
declare const index$7_InvalidType1SizeError: typeof InvalidType1SizeError;
type index$7_InvalidType2SizeError = InvalidType2SizeError;
declare const index$7_InvalidType2SizeError: typeof InvalidType2SizeError;
type index$7_InvalidWorkerIdError = InvalidWorkerIdError;
declare const index$7_InvalidWorkerIdError: typeof InvalidWorkerIdError;
type index$7_LzTokenUnavailableError = LzTokenUnavailableError;
declare const index$7_LzTokenUnavailableError: typeof LzTokenUnavailableError;
type index$7_NonSignerError = NonSignerError;
declare const index$7_NonSignerError: typeof NonSignerError;
type index$7_UnauthorizedError = UnauthorizedError;
declare const index$7_UnauthorizedError: typeof UnauthorizedError;
type index$7_UnsortedError = UnsortedError;
declare const index$7_UnsortedError: typeof UnsortedError;
type index$7_VerifyingError = VerifyingError;
declare const index$7_VerifyingError: typeof VerifyingError;
type index$7_ZeroMessageSizeError = ZeroMessageSizeError;
declare const index$7_ZeroMessageSizeError: typeof ZeroMessageSizeError;
declare const index$7_errorFromCode: typeof errorFromCode;
declare const index$7_errorFromName: typeof errorFromName;
declare namespace index$7 {
  export { index$7_AtLeastOneDVNError as AtLeastOneDVNError, index$7_ExceededMaxMessageSizeError as ExceededMaxMessageSizeError, index$7_ExceededU128Error as ExceededU128Error, index$7_InsufficientFeeError as InsufficientFeeError, index$7_InvalidAccountLengthError as InvalidAccountLengthError, index$7_InvalidAmountError as InvalidAmountError, index$7_InvalidBpsError as InvalidBpsError, index$7_InvalidConfigTypeError as InvalidConfigTypeError, index$7_InvalidConfirmationError as InvalidConfirmationError, index$7_InvalidConfirmationsError as InvalidConfirmationsError, index$7_InvalidDvnError as InvalidDvnError, index$7_InvalidDvnProgramError as InvalidDvnProgramError, index$7_InvalidEidError as InvalidEidError, index$7_InvalidExecutorError as InvalidExecutorError, index$7_InvalidExecutorProgramError as InvalidExecutorProgramError, index$7_InvalidLzTokenMintError as InvalidLzTokenMintError, index$7_InvalidOptionTypeError as InvalidOptionTypeError, index$7_InvalidOptionalDVNCountError as InvalidOptionalDVNCountError, index$7_InvalidOptionalDVNThresholdError as InvalidOptionalDVNThresholdError, index$7_InvalidPacketVersionError as InvalidPacketVersionError, index$7_InvalidPayerError as InvalidPayerError, index$7_InvalidRequiredDVNCountError as InvalidRequiredDVNCountError, index$7_InvalidTreasuryError as InvalidTreasuryError, index$7_InvalidTreasuryFeeCapError as InvalidTreasuryFeeCapError, index$7_InvalidType1SizeError as InvalidType1SizeError, index$7_InvalidType2SizeError as InvalidType2SizeError, index$7_InvalidWorkerIdError as InvalidWorkerIdError, index$7_LzTokenUnavailableError as LzTokenUnavailableError, index$7_NonSignerError as NonSignerError, index$7_UnauthorizedError as UnauthorizedError, index$7_UnsortedError as UnsortedError, index$7_VerifyingError as VerifyingError, index$7_ZeroMessageSizeError as ZeroMessageSizeError, index$7_errorFromCode as errorFromCode, index$7_errorFromName as errorFromName };
}

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type AdminTransferredEvent = {
    newAdmin: web3.PublicKey;
};
/**
 * @category userTypes
 * @category generated
 */
declare const adminTransferredEventBeet: beet.BeetArgsStruct<AdminTransferredEvent>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * This type is used to derive the {@link Config} type as well as the de/serializer.
 * However don't refer to it in your code but use the {@link Config} type instead.
 *
 * @category userTypes
 * @category enums
 * @category generated
 * @private
 */
type ConfigRecord = {
    SendUln: {
        fields: [UlnConfig];
    };
    ReceiveUln: {
        fields: [UlnConfig];
    };
    Executor: {
        fields: [ExecutorConfig];
    };
};
/**
 * Union type respresenting the Config data enum defined in Rust.
 *
 * NOTE: that it includes a `__kind` property which allows to narrow types in
 * switch/if statements.
 * Additionally `isConfig*` type guards are exposed below to narrow to a specific variant.
 *
 * @category userTypes
 * @category enums
 * @category generated
 */
type Config = beet.DataEnumKeyAsKind<ConfigRecord>;
declare const isConfigSendUln: (x: Config) => x is {
    __kind: "SendUln";
} & Omit<{
    fields: [UlnConfig];
}, "void"> & {
    __kind: 'SendUln';
};
declare const isConfigReceiveUln: (x: Config) => x is {
    __kind: "ReceiveUln";
} & Omit<{
    fields: [UlnConfig];
}, "void"> & {
    __kind: 'ReceiveUln';
};
declare const isConfigExecutor: (x: Config) => x is {
    __kind: "Executor";
} & Omit<{
    fields: [ExecutorConfig];
}, "void"> & {
    __kind: 'Executor';
};
/**
 * @category userTypes
 * @category generated
 */
declare const configBeet: beet.FixableBeet<Config, Config>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type ConfigSetEvent = {
    oapp: web3.PublicKey;
    eid: number;
    config: Config;
};
/**
 * @category userTypes
 * @category generated
 */
declare const configSetEventBeet: beet.FixableBeetArgsStruct<ConfigSetEvent>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type DefaultConfigSetEvent = {
    eid: number;
    sendUlnConfig: beet.COption<UlnConfig>;
    receiveUlnConfig: beet.COption<UlnConfig>;
    executorConfig: beet.COption<ExecutorConfig>;
};
/**
 * @category userTypes
 * @category generated
 */
declare const defaultConfigSetEventBeet: beet.FixableBeetArgsStruct<DefaultConfigSetEvent>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type WorkerFee = {
    worker: web3.PublicKey;
    fee: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const workerFeeBeet: beet.BeetArgsStruct<WorkerFee>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type TreasuryFee = {
    treasury: web3.PublicKey;
    fee: beet.bignum;
    payInLzToken: boolean;
};
/**
 * @category userTypes
 * @category generated
 */
declare const treasuryFeeBeet: beet.BeetArgsStruct<TreasuryFee>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type FeesPaidEvent = {
    executor: WorkerFee;
    dvns: WorkerFee[];
    treasury: beet.COption<TreasuryFee>;
};
/**
 * @category userTypes
 * @category generated
 */
declare const feesPaidEventBeet: beet.FixableBeetArgsStruct<FeesPaidEvent>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type PayloadVerifiedEvent = {
    dvn: web3.PublicKey;
    header: number[];
    confirmations: beet.bignum;
    proofHash: number[];
};
/**
 * @category userTypes
 * @category generated
 */
declare const payloadVerifiedEventBeet: beet.BeetArgsStruct<PayloadVerifiedEvent>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type RentWithdrawnEvent = {
    receiver: web3.PublicKey;
    amount: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const rentWithdrawnEventBeet: beet.BeetArgsStruct<RentWithdrawnEvent>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type TreasurySetEvent = {
    treasury: beet.COption<Treasury>;
};
/**
 * @category userTypes
 * @category generated
 */
declare const treasurySetEventBeet: beet.FixableBeetArgsStruct<TreasurySetEvent>;

type index$6_AdminTransferredEvent = AdminTransferredEvent;
type index$6_ConfigSetEvent = ConfigSetEvent;
type index$6_DefaultConfigSetEvent = DefaultConfigSetEvent;
type index$6_FeesPaidEvent = FeesPaidEvent;
type index$6_PayloadVerifiedEvent = PayloadVerifiedEvent;
type index$6_RentWithdrawnEvent = RentWithdrawnEvent;
type index$6_TreasurySetEvent = TreasurySetEvent;
declare const index$6_adminTransferredEventBeet: typeof adminTransferredEventBeet;
declare const index$6_configSetEventBeet: typeof configSetEventBeet;
declare const index$6_defaultConfigSetEventBeet: typeof defaultConfigSetEventBeet;
declare const index$6_feesPaidEventBeet: typeof feesPaidEventBeet;
declare const index$6_payloadVerifiedEventBeet: typeof payloadVerifiedEventBeet;
declare const index$6_rentWithdrawnEventBeet: typeof rentWithdrawnEventBeet;
declare const index$6_treasurySetEventBeet: typeof treasurySetEventBeet;
declare namespace index$6 {
  export { type index$6_AdminTransferredEvent as AdminTransferredEvent, type index$6_ConfigSetEvent as ConfigSetEvent, type index$6_DefaultConfigSetEvent as DefaultConfigSetEvent, type index$6_FeesPaidEvent as FeesPaidEvent, type index$6_PayloadVerifiedEvent as PayloadVerifiedEvent, type index$6_RentWithdrawnEvent as RentWithdrawnEvent, type index$6_TreasurySetEvent as TreasurySetEvent, index$6_adminTransferredEventBeet as adminTransferredEventBeet, index$6_configSetEventBeet as configSetEventBeet, index$6_defaultConfigSetEventBeet as defaultConfigSetEventBeet, index$6_feesPaidEventBeet as feesPaidEventBeet, index$6_payloadVerifiedEventBeet as payloadVerifiedEventBeet, index$6_rentWithdrawnEventBeet as rentWithdrawnEventBeet, index$6_treasurySetEventBeet as treasurySetEventBeet };
}

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type CloseVerifyParams = {
    packetHeaderHash: number[];
    payloadHash: number[];
};
/**
 * @category userTypes
 * @category generated
 */
declare const closeVerifyParamsBeet: beet.BeetArgsStruct<CloseVerifyParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category CloseVerify
 * @category generated
 */
type CloseVerifyInstructionArgs = {
    params: CloseVerifyParams;
};
/**
 * @category Instructions
 * @category CloseVerify
 * @category generated
 */
declare const closeVerifyStruct: beet.BeetArgsStruct<CloseVerifyInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _closeVerify_ instruction
 *
 * @property [**signer**] dvn
 * @property [_writable_] receiver
 * @property [_writable_] confirmations
 * @category Instructions
 * @category CloseVerify
 * @category generated
 */
type CloseVerifyInstructionAccounts = {
    dvn: web3.PublicKey;
    receiver: web3.PublicKey;
    confirmations: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const closeVerifyInstructionDiscriminator: number[];
/**
 * Creates a _CloseVerify_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category CloseVerify
 * @category generated
 */
declare function createCloseVerifyInstruction(accounts: CloseVerifyInstructionAccounts, args: CloseVerifyInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _CloseVerify_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category CloseVerify
 * @category generated
 */
declare function createCloseVerifyInstructionAccounts(accounts: CloseVerifyInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type CommitVerificationParams = {
    packetHeader: number[];
    payloadHash: number[];
};
/**
 * @category userTypes
 * @category generated
 */
declare const commitVerificationParamsBeet: beet.BeetArgsStruct<CommitVerificationParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category CommitVerification
 * @category generated
 */
type CommitVerificationInstructionArgs = {
    params: CommitVerificationParams;
};
/**
 * @category Instructions
 * @category CommitVerification
 * @category generated
 */
declare const commitVerificationStruct: beet.BeetArgsStruct<CommitVerificationInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _commitVerification_ instruction
 *
 * @property [] receiveConfig
 * @property [] defaultReceiveConfig
 * @property [] uln
 * @category Instructions
 * @category CommitVerification
 * @category generated
 */
type CommitVerificationInstructionAccounts = {
    receiveConfig: web3.PublicKey;
    defaultReceiveConfig: web3.PublicKey;
    uln: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const commitVerificationInstructionDiscriminator: number[];
/**
 * Creates a _CommitVerification_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category CommitVerification
 * @category generated
 */
declare function createCommitVerificationInstruction(accounts: CommitVerificationInstructionAccounts, args: CommitVerificationInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _CommitVerification_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category CommitVerification
 * @category generated
 */
declare function createCommitVerificationInstructionAccounts(accounts: CommitVerificationInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type InitConfigParams = {
    oapp: web3.PublicKey;
    eid: number;
};
/**
 * @category userTypes
 * @category generated
 */
declare const initConfigParamsBeet: beet.BeetArgsStruct<InitConfigParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category InitConfig
 * @category generated
 */
type InitConfigInstructionArgs = {
    params: InitConfigParams;
};
/**
 * @category Instructions
 * @category InitConfig
 * @category generated
 */
declare const initConfigStruct: beet.BeetArgsStruct<InitConfigInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _initConfig_ instruction
 *
 * @property [**signer**] endpoint
 * @property [_writable_, **signer**] payer
 * @property [] uln
 * @property [_writable_] sendConfig
 * @property [_writable_] receiveConfig
 * @category Instructions
 * @category InitConfig
 * @category generated
 */
type InitConfigInstructionAccounts = {
    endpoint: web3.PublicKey;
    payer: web3.PublicKey;
    uln: web3.PublicKey;
    sendConfig: web3.PublicKey;
    receiveConfig: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const initConfigInstructionDiscriminator: number[];
/**
 * Creates a _InitConfig_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category InitConfig
 * @category generated
 */
declare function createInitConfigInstruction(accounts: InitConfigInstructionAccounts, args: InitConfigInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _InitConfig_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category InitConfig
 * @category generated
 */
declare function createInitConfigInstructionAccounts(accounts: InitConfigInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type InitDefaultConfigParams = {
    eid: number;
    sendUlnConfig: UlnConfig;
    receiveUlnConfig: UlnConfig;
    executorConfig: ExecutorConfig;
};
/**
 * @category userTypes
 * @category generated
 */
declare const initDefaultConfigParamsBeet: beet.FixableBeetArgsStruct<InitDefaultConfigParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category InitDefaultConfig
 * @category generated
 */
type InitDefaultConfigInstructionArgs = {
    params: InitDefaultConfigParams;
};
/**
 * @category Instructions
 * @category InitDefaultConfig
 * @category generated
 */
declare const initDefaultConfigStruct: beet.FixableBeetArgsStruct<InitDefaultConfigInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _initDefaultConfig_ instruction
 *
 * @property [_writable_, **signer**] admin
 * @property [] uln
 * @property [_writable_] sendConfig
 * @property [_writable_] receiveConfig
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category InitDefaultConfig
 * @category generated
 */
type InitDefaultConfigInstructionAccounts = {
    admin: web3.PublicKey;
    uln: web3.PublicKey;
    sendConfig: web3.PublicKey;
    receiveConfig: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const initDefaultConfigInstructionDiscriminator: number[];
/**
 * Creates a _InitDefaultConfig_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category InitDefaultConfig
 * @category generated
 */
declare function createInitDefaultConfigInstruction(accounts: InitDefaultConfigInstructionAccounts, args: InitDefaultConfigInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _InitDefaultConfig_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category InitDefaultConfig
 * @category generated
 */
declare function createInitDefaultConfigInstructionAccounts(accounts: InitDefaultConfigInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type InitUlnParams = {
    eid: number;
    endpoint: web3.PublicKey;
    endpointProgram: web3.PublicKey;
    admin: web3.PublicKey;
};
/**
 * @category userTypes
 * @category generated
 */
declare const initUlnParamsBeet: beet.BeetArgsStruct<InitUlnParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category InitUln
 * @category generated
 */
type InitUlnInstructionArgs = {
    params: InitUlnParams;
};
/**
 * @category Instructions
 * @category InitUln
 * @category generated
 */
declare const initUlnStruct: beet.BeetArgsStruct<InitUlnInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _initUln_ instruction
 *
 * @property [_writable_, **signer**] payer
 * @property [_writable_] uln
 * @category Instructions
 * @category InitUln
 * @category generated
 */
type InitUlnInstructionAccounts = {
    payer: web3.PublicKey;
    uln: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const initUlnInstructionDiscriminator: number[];
/**
 * Creates a _InitUln_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category InitUln
 * @category generated
 */
declare function createInitUlnInstruction(accounts: InitUlnInstructionAccounts, args: InitUlnInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _InitUln_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category InitUln
 * @category generated
 */
declare function createInitUlnInstructionAccounts(accounts: InitUlnInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type InitVerifyParams = {
    packetHeader: number[];
    payloadHash: number[];
    dvn: web3.PublicKey;
};
/**
 * @category userTypes
 * @category generated
 */
declare const initVerifyParamsBeet: beet.BeetArgsStruct<InitVerifyParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category InitVerify
 * @category generated
 */
type InitVerifyInstructionArgs = {
    params: InitVerifyParams;
};
/**
 * @category Instructions
 * @category InitVerify
 * @category generated
 */
declare const initVerifyStruct: beet.BeetArgsStruct<InitVerifyInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _initVerify_ instruction
 *
 * @property [_writable_, **signer**] payer
 * @property [_writable_] confirmations
 * @category Instructions
 * @category InitVerify
 * @category generated
 */
type InitVerifyInstructionAccounts = {
    payer: web3.PublicKey;
    confirmations: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const initVerifyInstructionDiscriminator: number[];
/**
 * Creates a _InitVerify_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category InitVerify
 * @category generated
 */
declare function createInitVerifyInstruction(accounts: InitVerifyInstructionAccounts, args: InitVerifyInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _InitVerify_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category InitVerify
 * @category generated
 */
declare function createInitVerifyInstructionAccounts(accounts: InitVerifyInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type Packet = {
    nonce: beet.bignum;
    srcEid: number;
    sender: web3.PublicKey;
    dstEid: number;
    receiver: number[];
    guid: number[];
    message: Uint8Array;
};
/**
 * @category userTypes
 * @category generated
 */
declare const packetBeet: beet.FixableBeetArgsStruct<Packet>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type QuoteParams = {
    packet: Packet;
    options: Uint8Array;
    payInLzToken: boolean;
};
/**
 * @category userTypes
 * @category generated
 */
declare const quoteParamsBeet: beet.FixableBeetArgsStruct<QuoteParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category Quote
 * @category generated
 */
type QuoteInstructionArgs = {
    params: QuoteParams;
};
/**
 * @category Instructions
 * @category Quote
 * @category generated
 */
declare const quoteStruct: beet.FixableBeetArgsStruct<QuoteInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _quote_ instruction
 *
 * @property [**signer**] endpoint
 * @property [] uln
 * @property [] sendConfig
 * @property [] defaultSendConfig
 * @category Instructions
 * @category Quote
 * @category generated
 */
type QuoteInstructionAccounts = {
    endpoint: web3.PublicKey;
    uln: web3.PublicKey;
    sendConfig: web3.PublicKey;
    defaultSendConfig: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const quoteInstructionDiscriminator: number[];
/**
 * Creates a _Quote_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category Quote
 * @category generated
 */
declare function createQuoteInstruction(accounts: QuoteInstructionAccounts, args: QuoteInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _Quote_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category Quote
 * @category generated
 */
declare function createQuoteInstructionAccounts(accounts: QuoteInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type SendParams = {
    packet: Packet;
    options: Uint8Array;
    nativeFee: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const sendParamsBeet: beet.FixableBeetArgsStruct<SendParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category Send
 * @category generated
 */
type SendInstructionArgs = {
    params: SendParams;
};
/**
 * @category Instructions
 * @category Send
 * @category generated
 */
declare const sendStruct: beet.FixableBeetArgsStruct<SendInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _send_ instruction
 *
 * @property [**signer**] endpoint
 * @property [] uln
 * @property [] sendConfig
 * @property [] defaultSendConfig
 * @property [_writable_, **signer**] payer
 * @property [_writable_] treasury (optional)
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category Send
 * @category generated
 */
type SendInstructionAccounts = {
    endpoint: web3.PublicKey;
    uln: web3.PublicKey;
    sendConfig: web3.PublicKey;
    defaultSendConfig: web3.PublicKey;
    payer: web3.PublicKey;
    treasury?: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const sendInstructionDiscriminator: number[];
/**
 * Creates a _Send_ instruction.
 *
 * Optional accounts that are not provided default to the program ID since
 * this was indicated in the IDL from which this instruction was generated.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category Send
 * @category generated
 */
declare function createSendInstruction(accounts: SendInstructionAccounts, args: SendInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _Send_ instructionAccounts.
 *
 * Optional accounts that are not provided default to the program ID since
 * this was indicated in the IDL from which this instruction was generated.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category Send
 * @category generated
 */
declare function createSendInstructionAccounts(accounts: SendInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type SendWithLzTokenParams = {
    packet: Packet;
    options: Uint8Array;
    nativeFee: beet.bignum;
    lzTokenFee: beet.bignum;
    lzTokenMint: web3.PublicKey;
};
/**
 * @category userTypes
 * @category generated
 */
declare const sendWithLzTokenParamsBeet: beet.FixableBeetArgsStruct<SendWithLzTokenParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category SendWithLzToken
 * @category generated
 */
type SendWithLzTokenInstructionArgs = {
    params: SendWithLzTokenParams;
};
/**
 * @category Instructions
 * @category SendWithLzToken
 * @category generated
 */
declare const sendWithLzTokenStruct: beet.FixableBeetArgsStruct<SendWithLzTokenInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _sendWithLzToken_ instruction
 *
 * @property [**signer**] endpoint
 * @property [] uln
 * @property [] sendConfig
 * @property [] defaultSendConfig
 * @property [_writable_, **signer**] payer
 * @property [_writable_] lzTokenSource
 * @property [_writable_] lzTokenTreasury
 * @property [] lzTokenMint
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category SendWithLzToken
 * @category generated
 */
type SendWithLzTokenInstructionAccounts = {
    endpoint: web3.PublicKey;
    uln: web3.PublicKey;
    sendConfig: web3.PublicKey;
    defaultSendConfig: web3.PublicKey;
    payer: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    lzTokenSource: web3.PublicKey;
    lzTokenTreasury: web3.PublicKey;
    lzTokenMint: web3.PublicKey;
    tokenProgram?: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const sendWithLzTokenInstructionDiscriminator: number[];
/**
 * Creates a _SendWithLzToken_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category SendWithLzToken
 * @category generated
 */
declare function createSendWithLzTokenInstruction(accounts: SendWithLzTokenInstructionAccounts, args: SendWithLzTokenInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _SendWithLzToken_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category SendWithLzToken
 * @category generated
 */
declare function createSendWithLzTokenInstructionAccounts(accounts: SendWithLzTokenInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type SetConfigParams = {
    oapp: web3.PublicKey;
    eid: number;
    configType: number;
    config: Uint8Array;
};
/**
 * @category userTypes
 * @category generated
 */
declare const setConfigParamsBeet: beet.FixableBeetArgsStruct<SetConfigParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category SetConfig
 * @category generated
 */
type SetConfigInstructionArgs = {
    params: SetConfigParams;
};
/**
 * @category Instructions
 * @category SetConfig
 * @category generated
 */
declare const setConfigStruct: beet.FixableBeetArgsStruct<SetConfigInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _setConfig_ instruction
 *
 * @property [**signer**] endpoint
 * @property [] uln
 * @property [_writable_] sendConfig
 * @property [_writable_] receiveConfig
 * @property [] defaultSendConfig
 * @property [] defaultReceiveConfig
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category SetConfig
 * @category generated
 */
type SetConfigInstructionAccounts = {
    endpoint: web3.PublicKey;
    uln: web3.PublicKey;
    sendConfig: web3.PublicKey;
    receiveConfig: web3.PublicKey;
    defaultSendConfig: web3.PublicKey;
    defaultReceiveConfig: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const setConfigInstructionDiscriminator: number[];
/**
 * Creates a _SetConfig_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category SetConfig
 * @category generated
 */
declare function createSetConfigInstruction(accounts: SetConfigInstructionAccounts, args: SetConfigInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _SetConfig_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category SetConfig
 * @category generated
 */
declare function createSetConfigInstructionAccounts(accounts: SetConfigInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type SetDefaultConfigParams = {
    eid: number;
    sendUlnConfig: beet.COption<UlnConfig>;
    receiveUlnConfig: beet.COption<UlnConfig>;
    executorConfig: beet.COption<ExecutorConfig>;
};
/**
 * @category userTypes
 * @category generated
 */
declare const setDefaultConfigParamsBeet: beet.FixableBeetArgsStruct<SetDefaultConfigParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category SetDefaultConfig
 * @category generated
 */
type SetDefaultConfigInstructionArgs = {
    params: SetDefaultConfigParams;
};
/**
 * @category Instructions
 * @category SetDefaultConfig
 * @category generated
 */
declare const setDefaultConfigStruct: beet.FixableBeetArgsStruct<SetDefaultConfigInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _setDefaultConfig_ instruction
 *
 * @property [**signer**] admin
 * @property [] uln
 * @property [_writable_] sendConfig
 * @property [_writable_] receiveConfig
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category SetDefaultConfig
 * @category generated
 */
type SetDefaultConfigInstructionAccounts = {
    admin: web3.PublicKey;
    uln: web3.PublicKey;
    sendConfig: web3.PublicKey;
    receiveConfig: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const setDefaultConfigInstructionDiscriminator: number[];
/**
 * Creates a _SetDefaultConfig_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category SetDefaultConfig
 * @category generated
 */
declare function createSetDefaultConfigInstruction(accounts: SetDefaultConfigInstructionAccounts, args: SetDefaultConfigInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _SetDefaultConfig_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category SetDefaultConfig
 * @category generated
 */
declare function createSetDefaultConfigInstructionAccounts(accounts: SetDefaultConfigInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type SetTreasuryParams = {
    treasury: beet.COption<Treasury>;
};
/**
 * @category userTypes
 * @category generated
 */
declare const setTreasuryParamsBeet: beet.FixableBeetArgsStruct<SetTreasuryParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category SetTreasury
 * @category generated
 */
type SetTreasuryInstructionArgs = {
    params: SetTreasuryParams;
};
/**
 * @category Instructions
 * @category SetTreasury
 * @category generated
 */
declare const setTreasuryStruct: beet.FixableBeetArgsStruct<SetTreasuryInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _setTreasury_ instruction
 *
 * @property [**signer**] signer
 * @property [_writable_] uln
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category SetTreasury
 * @category generated
 */
type SetTreasuryInstructionAccounts = {
    signer: web3.PublicKey;
    uln: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const setTreasuryInstructionDiscriminator: number[];
/**
 * Creates a _SetTreasury_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category SetTreasury
 * @category generated
 */
declare function createSetTreasuryInstruction(accounts: SetTreasuryInstructionAccounts, args: SetTreasuryInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _SetTreasury_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category SetTreasury
 * @category generated
 */
declare function createSetTreasuryInstructionAccounts(accounts: SetTreasuryInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type TransferAdminParams$1 = {
    admin: web3.PublicKey;
};
/**
 * @category userTypes
 * @category generated
 */
declare const transferAdminParamsBeet$1: beet.BeetArgsStruct<TransferAdminParams$1>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category TransferAdmin
 * @category generated
 */
type TransferAdminInstructionArgs$1 = {
    params: TransferAdminParams$1;
};
/**
 * @category Instructions
 * @category TransferAdmin
 * @category generated
 */
declare const transferAdminStruct$1: beet.BeetArgsStruct<TransferAdminInstructionArgs$1 & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _transferAdmin_ instruction
 *
 * @property [**signer**] admin
 * @property [_writable_] uln
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category TransferAdmin
 * @category generated
 */
type TransferAdminInstructionAccounts$1 = {
    admin: web3.PublicKey;
    uln: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const transferAdminInstructionDiscriminator$1: number[];
/**
 * Creates a _TransferAdmin_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category TransferAdmin
 * @category generated
 */
declare function createTransferAdminInstruction$1(accounts: TransferAdminInstructionAccounts$1, args: TransferAdminInstructionArgs$1, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _TransferAdmin_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category TransferAdmin
 * @category generated
 */
declare function createTransferAdminInstructionAccounts$1(accounts: TransferAdminInstructionAccounts$1, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type VerifyParams = {
    packetHeader: number[];
    payloadHash: number[];
    confirmations: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const verifyParamsBeet: beet.BeetArgsStruct<VerifyParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category Verify
 * @category generated
 */
type VerifyInstructionArgs = {
    params: VerifyParams;
};
/**
 * @category Instructions
 * @category Verify
 * @category generated
 */
declare const verifyStruct: beet.BeetArgsStruct<VerifyInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _verify_ instruction
 *
 * @property [**signer**] dvn
 * @property [_writable_] confirmations
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category Verify
 * @category generated
 */
type VerifyInstructionAccounts = {
    dvn: web3.PublicKey;
    confirmations: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const verifyInstructionDiscriminator: number[];
/**
 * Creates a _Verify_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category Verify
 * @category generated
 */
declare function createVerifyInstruction(accounts: VerifyInstructionAccounts, args: VerifyInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _Verify_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category Verify
 * @category generated
 */
declare function createVerifyInstructionAccounts(accounts: VerifyInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category Version
 * @category generated
 */
declare const versionStruct$1: beet.BeetArgsStruct<{
    instructionDiscriminator: number[];
}>;
declare const versionInstructionDiscriminator$1: number[];
/**
 * Creates a _Version_ instruction.
 *
 * @category Instructions
 * @category Version
 * @category generated
 */
declare function createVersionInstruction$1(programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _Version_ instructionAccounts.
 *
 * @category Instructions
 * @category Version
 * @category generated
 */
declare function createVersionInstructionAccounts$1(programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type WithdrawRentParams = {
    amount: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const withdrawRentParamsBeet: beet.BeetArgsStruct<WithdrawRentParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category WithdrawRent
 * @category generated
 */
type WithdrawRentInstructionArgs = {
    params: WithdrawRentParams;
};
/**
 * @category Instructions
 * @category WithdrawRent
 * @category generated
 */
declare const withdrawRentStruct: beet.BeetArgsStruct<WithdrawRentInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _withdrawRent_ instruction
 *
 * @property [**signer**] admin
 * @property [_writable_] uln
 * @property [_writable_] receiver
 * @property [] eventAuthority
 * @property [] program
 * @category Instructions
 * @category WithdrawRent
 * @category generated
 */
type WithdrawRentInstructionAccounts = {
    admin: web3.PublicKey;
    uln: web3.PublicKey;
    receiver: web3.PublicKey;
    eventAuthority: web3.PublicKey;
    program: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const withdrawRentInstructionDiscriminator: number[];
/**
 * Creates a _WithdrawRent_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category WithdrawRent
 * @category generated
 */
declare function createWithdrawRentInstruction(accounts: WithdrawRentInstructionAccounts, args: WithdrawRentInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _WithdrawRent_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category WithdrawRent
 * @category generated
 */
declare function createWithdrawRentInstructionAccounts(accounts: WithdrawRentInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

type index$5_CloseVerifyInstructionAccounts = CloseVerifyInstructionAccounts;
type index$5_CloseVerifyInstructionArgs = CloseVerifyInstructionArgs;
type index$5_CommitVerificationInstructionAccounts = CommitVerificationInstructionAccounts;
type index$5_CommitVerificationInstructionArgs = CommitVerificationInstructionArgs;
type index$5_InitConfigInstructionAccounts = InitConfigInstructionAccounts;
type index$5_InitConfigInstructionArgs = InitConfigInstructionArgs;
type index$5_InitDefaultConfigInstructionAccounts = InitDefaultConfigInstructionAccounts;
type index$5_InitDefaultConfigInstructionArgs = InitDefaultConfigInstructionArgs;
type index$5_InitUlnInstructionAccounts = InitUlnInstructionAccounts;
type index$5_InitUlnInstructionArgs = InitUlnInstructionArgs;
type index$5_InitVerifyInstructionAccounts = InitVerifyInstructionAccounts;
type index$5_InitVerifyInstructionArgs = InitVerifyInstructionArgs;
type index$5_QuoteInstructionAccounts = QuoteInstructionAccounts;
type index$5_QuoteInstructionArgs = QuoteInstructionArgs;
type index$5_SendInstructionAccounts = SendInstructionAccounts;
type index$5_SendInstructionArgs = SendInstructionArgs;
type index$5_SendWithLzTokenInstructionAccounts = SendWithLzTokenInstructionAccounts;
type index$5_SendWithLzTokenInstructionArgs = SendWithLzTokenInstructionArgs;
type index$5_SetConfigInstructionAccounts = SetConfigInstructionAccounts;
type index$5_SetConfigInstructionArgs = SetConfigInstructionArgs;
type index$5_SetDefaultConfigInstructionAccounts = SetDefaultConfigInstructionAccounts;
type index$5_SetDefaultConfigInstructionArgs = SetDefaultConfigInstructionArgs;
type index$5_SetTreasuryInstructionAccounts = SetTreasuryInstructionAccounts;
type index$5_SetTreasuryInstructionArgs = SetTreasuryInstructionArgs;
type index$5_VerifyInstructionAccounts = VerifyInstructionAccounts;
type index$5_VerifyInstructionArgs = VerifyInstructionArgs;
type index$5_WithdrawRentInstructionAccounts = WithdrawRentInstructionAccounts;
type index$5_WithdrawRentInstructionArgs = WithdrawRentInstructionArgs;
declare const index$5_closeVerifyInstructionDiscriminator: typeof closeVerifyInstructionDiscriminator;
declare const index$5_closeVerifyStruct: typeof closeVerifyStruct;
declare const index$5_commitVerificationInstructionDiscriminator: typeof commitVerificationInstructionDiscriminator;
declare const index$5_commitVerificationStruct: typeof commitVerificationStruct;
declare const index$5_createCloseVerifyInstruction: typeof createCloseVerifyInstruction;
declare const index$5_createCloseVerifyInstructionAccounts: typeof createCloseVerifyInstructionAccounts;
declare const index$5_createCommitVerificationInstruction: typeof createCommitVerificationInstruction;
declare const index$5_createCommitVerificationInstructionAccounts: typeof createCommitVerificationInstructionAccounts;
declare const index$5_createInitConfigInstruction: typeof createInitConfigInstruction;
declare const index$5_createInitConfigInstructionAccounts: typeof createInitConfigInstructionAccounts;
declare const index$5_createInitDefaultConfigInstruction: typeof createInitDefaultConfigInstruction;
declare const index$5_createInitDefaultConfigInstructionAccounts: typeof createInitDefaultConfigInstructionAccounts;
declare const index$5_createInitUlnInstruction: typeof createInitUlnInstruction;
declare const index$5_createInitUlnInstructionAccounts: typeof createInitUlnInstructionAccounts;
declare const index$5_createInitVerifyInstruction: typeof createInitVerifyInstruction;
declare const index$5_createInitVerifyInstructionAccounts: typeof createInitVerifyInstructionAccounts;
declare const index$5_createQuoteInstruction: typeof createQuoteInstruction;
declare const index$5_createQuoteInstructionAccounts: typeof createQuoteInstructionAccounts;
declare const index$5_createSendInstruction: typeof createSendInstruction;
declare const index$5_createSendInstructionAccounts: typeof createSendInstructionAccounts;
declare const index$5_createSendWithLzTokenInstruction: typeof createSendWithLzTokenInstruction;
declare const index$5_createSendWithLzTokenInstructionAccounts: typeof createSendWithLzTokenInstructionAccounts;
declare const index$5_createSetConfigInstruction: typeof createSetConfigInstruction;
declare const index$5_createSetConfigInstructionAccounts: typeof createSetConfigInstructionAccounts;
declare const index$5_createSetDefaultConfigInstruction: typeof createSetDefaultConfigInstruction;
declare const index$5_createSetDefaultConfigInstructionAccounts: typeof createSetDefaultConfigInstructionAccounts;
declare const index$5_createSetTreasuryInstruction: typeof createSetTreasuryInstruction;
declare const index$5_createSetTreasuryInstructionAccounts: typeof createSetTreasuryInstructionAccounts;
declare const index$5_createVerifyInstruction: typeof createVerifyInstruction;
declare const index$5_createVerifyInstructionAccounts: typeof createVerifyInstructionAccounts;
declare const index$5_createWithdrawRentInstruction: typeof createWithdrawRentInstruction;
declare const index$5_createWithdrawRentInstructionAccounts: typeof createWithdrawRentInstructionAccounts;
declare const index$5_initConfigInstructionDiscriminator: typeof initConfigInstructionDiscriminator;
declare const index$5_initConfigStruct: typeof initConfigStruct;
declare const index$5_initDefaultConfigInstructionDiscriminator: typeof initDefaultConfigInstructionDiscriminator;
declare const index$5_initDefaultConfigStruct: typeof initDefaultConfigStruct;
declare const index$5_initUlnInstructionDiscriminator: typeof initUlnInstructionDiscriminator;
declare const index$5_initUlnStruct: typeof initUlnStruct;
declare const index$5_initVerifyInstructionDiscriminator: typeof initVerifyInstructionDiscriminator;
declare const index$5_initVerifyStruct: typeof initVerifyStruct;
declare const index$5_quoteInstructionDiscriminator: typeof quoteInstructionDiscriminator;
declare const index$5_quoteStruct: typeof quoteStruct;
declare const index$5_sendInstructionDiscriminator: typeof sendInstructionDiscriminator;
declare const index$5_sendStruct: typeof sendStruct;
declare const index$5_sendWithLzTokenInstructionDiscriminator: typeof sendWithLzTokenInstructionDiscriminator;
declare const index$5_sendWithLzTokenStruct: typeof sendWithLzTokenStruct;
declare const index$5_setConfigInstructionDiscriminator: typeof setConfigInstructionDiscriminator;
declare const index$5_setConfigStruct: typeof setConfigStruct;
declare const index$5_setDefaultConfigInstructionDiscriminator: typeof setDefaultConfigInstructionDiscriminator;
declare const index$5_setDefaultConfigStruct: typeof setDefaultConfigStruct;
declare const index$5_setTreasuryInstructionDiscriminator: typeof setTreasuryInstructionDiscriminator;
declare const index$5_setTreasuryStruct: typeof setTreasuryStruct;
declare const index$5_verifyInstructionDiscriminator: typeof verifyInstructionDiscriminator;
declare const index$5_verifyStruct: typeof verifyStruct;
declare const index$5_withdrawRentInstructionDiscriminator: typeof withdrawRentInstructionDiscriminator;
declare const index$5_withdrawRentStruct: typeof withdrawRentStruct;
declare namespace index$5 {
  export { type index$5_CloseVerifyInstructionAccounts as CloseVerifyInstructionAccounts, type index$5_CloseVerifyInstructionArgs as CloseVerifyInstructionArgs, type index$5_CommitVerificationInstructionAccounts as CommitVerificationInstructionAccounts, type index$5_CommitVerificationInstructionArgs as CommitVerificationInstructionArgs, type index$5_InitConfigInstructionAccounts as InitConfigInstructionAccounts, type index$5_InitConfigInstructionArgs as InitConfigInstructionArgs, type index$5_InitDefaultConfigInstructionAccounts as InitDefaultConfigInstructionAccounts, type index$5_InitDefaultConfigInstructionArgs as InitDefaultConfigInstructionArgs, type index$5_InitUlnInstructionAccounts as InitUlnInstructionAccounts, type index$5_InitUlnInstructionArgs as InitUlnInstructionArgs, type index$5_InitVerifyInstructionAccounts as InitVerifyInstructionAccounts, type index$5_InitVerifyInstructionArgs as InitVerifyInstructionArgs, type index$5_QuoteInstructionAccounts as QuoteInstructionAccounts, type index$5_QuoteInstructionArgs as QuoteInstructionArgs, type index$5_SendInstructionAccounts as SendInstructionAccounts, type index$5_SendInstructionArgs as SendInstructionArgs, type index$5_SendWithLzTokenInstructionAccounts as SendWithLzTokenInstructionAccounts, type index$5_SendWithLzTokenInstructionArgs as SendWithLzTokenInstructionArgs, type index$5_SetConfigInstructionAccounts as SetConfigInstructionAccounts, type index$5_SetConfigInstructionArgs as SetConfigInstructionArgs, type index$5_SetDefaultConfigInstructionAccounts as SetDefaultConfigInstructionAccounts, type index$5_SetDefaultConfigInstructionArgs as SetDefaultConfigInstructionArgs, type index$5_SetTreasuryInstructionAccounts as SetTreasuryInstructionAccounts, type index$5_SetTreasuryInstructionArgs as SetTreasuryInstructionArgs, type TransferAdminInstructionAccounts$1 as TransferAdminInstructionAccounts, type TransferAdminInstructionArgs$1 as TransferAdminInstructionArgs, type index$5_VerifyInstructionAccounts as VerifyInstructionAccounts, type index$5_VerifyInstructionArgs as VerifyInstructionArgs, type index$5_WithdrawRentInstructionAccounts as WithdrawRentInstructionAccounts, type index$5_WithdrawRentInstructionArgs as WithdrawRentInstructionArgs, index$5_closeVerifyInstructionDiscriminator as closeVerifyInstructionDiscriminator, index$5_closeVerifyStruct as closeVerifyStruct, index$5_commitVerificationInstructionDiscriminator as commitVerificationInstructionDiscriminator, index$5_commitVerificationStruct as commitVerificationStruct, index$5_createCloseVerifyInstruction as createCloseVerifyInstruction, index$5_createCloseVerifyInstructionAccounts as createCloseVerifyInstructionAccounts, index$5_createCommitVerificationInstruction as createCommitVerificationInstruction, index$5_createCommitVerificationInstructionAccounts as createCommitVerificationInstructionAccounts, index$5_createInitConfigInstruction as createInitConfigInstruction, index$5_createInitConfigInstructionAccounts as createInitConfigInstructionAccounts, index$5_createInitDefaultConfigInstruction as createInitDefaultConfigInstruction, index$5_createInitDefaultConfigInstructionAccounts as createInitDefaultConfigInstructionAccounts, index$5_createInitUlnInstruction as createInitUlnInstruction, index$5_createInitUlnInstructionAccounts as createInitUlnInstructionAccounts, index$5_createInitVerifyInstruction as createInitVerifyInstruction, index$5_createInitVerifyInstructionAccounts as createInitVerifyInstructionAccounts, index$5_createQuoteInstruction as createQuoteInstruction, index$5_createQuoteInstructionAccounts as createQuoteInstructionAccounts, index$5_createSendInstruction as createSendInstruction, index$5_createSendInstructionAccounts as createSendInstructionAccounts, index$5_createSendWithLzTokenInstruction as createSendWithLzTokenInstruction, index$5_createSendWithLzTokenInstructionAccounts as createSendWithLzTokenInstructionAccounts, index$5_createSetConfigInstruction as createSetConfigInstruction, index$5_createSetConfigInstructionAccounts as createSetConfigInstructionAccounts, index$5_createSetDefaultConfigInstruction as createSetDefaultConfigInstruction, index$5_createSetDefaultConfigInstructionAccounts as createSetDefaultConfigInstructionAccounts, index$5_createSetTreasuryInstruction as createSetTreasuryInstruction, index$5_createSetTreasuryInstructionAccounts as createSetTreasuryInstructionAccounts, createTransferAdminInstruction$1 as createTransferAdminInstruction, createTransferAdminInstructionAccounts$1 as createTransferAdminInstructionAccounts, index$5_createVerifyInstruction as createVerifyInstruction, index$5_createVerifyInstructionAccounts as createVerifyInstructionAccounts, createVersionInstruction$1 as createVersionInstruction, createVersionInstructionAccounts$1 as createVersionInstructionAccounts, index$5_createWithdrawRentInstruction as createWithdrawRentInstruction, index$5_createWithdrawRentInstructionAccounts as createWithdrawRentInstructionAccounts, index$5_initConfigInstructionDiscriminator as initConfigInstructionDiscriminator, index$5_initConfigStruct as initConfigStruct, index$5_initDefaultConfigInstructionDiscriminator as initDefaultConfigInstructionDiscriminator, index$5_initDefaultConfigStruct as initDefaultConfigStruct, index$5_initUlnInstructionDiscriminator as initUlnInstructionDiscriminator, index$5_initUlnStruct as initUlnStruct, index$5_initVerifyInstructionDiscriminator as initVerifyInstructionDiscriminator, index$5_initVerifyStruct as initVerifyStruct, index$5_quoteInstructionDiscriminator as quoteInstructionDiscriminator, index$5_quoteStruct as quoteStruct, index$5_sendInstructionDiscriminator as sendInstructionDiscriminator, index$5_sendStruct as sendStruct, index$5_sendWithLzTokenInstructionDiscriminator as sendWithLzTokenInstructionDiscriminator, index$5_sendWithLzTokenStruct as sendWithLzTokenStruct, index$5_setConfigInstructionDiscriminator as setConfigInstructionDiscriminator, index$5_setConfigStruct as setConfigStruct, index$5_setDefaultConfigInstructionDiscriminator as setDefaultConfigInstructionDiscriminator, index$5_setDefaultConfigStruct as setDefaultConfigStruct, index$5_setTreasuryInstructionDiscriminator as setTreasuryInstructionDiscriminator, index$5_setTreasuryStruct as setTreasuryStruct, transferAdminInstructionDiscriminator$1 as transferAdminInstructionDiscriminator, transferAdminStruct$1 as transferAdminStruct, index$5_verifyInstructionDiscriminator as verifyInstructionDiscriminator, index$5_verifyStruct as verifyStruct, versionInstructionDiscriminator$1 as versionInstructionDiscriminator, versionStruct$1 as versionStruct, index$5_withdrawRentInstructionDiscriminator as withdrawRentInstructionDiscriminator, index$5_withdrawRentStruct as withdrawRentStruct };
}

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type MessagingFee = {
    nativeFee: beet.bignum;
    lzTokenFee: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const messagingFeeBeet: beet.BeetArgsStruct<MessagingFee>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type Version = {
    major: beet.bignum;
    minor: number;
    endpointVersion: number;
};
/**
 * @category userTypes
 * @category generated
 */
declare const versionBeet: beet.BeetArgsStruct<Version>;

type index$4_CloseVerifyParams = CloseVerifyParams;
type index$4_CommitVerificationParams = CommitVerificationParams;
type index$4_Config = Config;
type index$4_ConfigRecord = ConfigRecord;
type index$4_ExecutorConfig = ExecutorConfig;
type index$4_InitConfigParams = InitConfigParams;
type index$4_InitDefaultConfigParams = InitDefaultConfigParams;
type index$4_InitUlnParams = InitUlnParams;
type index$4_InitVerifyParams = InitVerifyParams;
type index$4_LzTokenTreasury = LzTokenTreasury;
type index$4_MessagingFee = MessagingFee;
type index$4_Packet = Packet;
type index$4_QuoteParams = QuoteParams;
type index$4_SendParams = SendParams;
type index$4_SendWithLzTokenParams = SendWithLzTokenParams;
type index$4_SetConfigParams = SetConfigParams;
type index$4_SetDefaultConfigParams = SetDefaultConfigParams;
type index$4_SetTreasuryParams = SetTreasuryParams;
type index$4_Treasury = Treasury;
type index$4_TreasuryFee = TreasuryFee;
type index$4_UlnConfig = UlnConfig;
type index$4_VerifyParams = VerifyParams;
type index$4_Version = Version;
type index$4_WithdrawRentParams = WithdrawRentParams;
type index$4_WorkerFee = WorkerFee;
declare const index$4_closeVerifyParamsBeet: typeof closeVerifyParamsBeet;
declare const index$4_commitVerificationParamsBeet: typeof commitVerificationParamsBeet;
declare const index$4_configBeet: typeof configBeet;
declare const index$4_executorConfigBeet: typeof executorConfigBeet;
declare const index$4_initConfigParamsBeet: typeof initConfigParamsBeet;
declare const index$4_initDefaultConfigParamsBeet: typeof initDefaultConfigParamsBeet;
declare const index$4_initUlnParamsBeet: typeof initUlnParamsBeet;
declare const index$4_initVerifyParamsBeet: typeof initVerifyParamsBeet;
declare const index$4_isConfigExecutor: typeof isConfigExecutor;
declare const index$4_isConfigReceiveUln: typeof isConfigReceiveUln;
declare const index$4_isConfigSendUln: typeof isConfigSendUln;
declare const index$4_lzTokenTreasuryBeet: typeof lzTokenTreasuryBeet;
declare const index$4_messagingFeeBeet: typeof messagingFeeBeet;
declare const index$4_packetBeet: typeof packetBeet;
declare const index$4_quoteParamsBeet: typeof quoteParamsBeet;
declare const index$4_sendParamsBeet: typeof sendParamsBeet;
declare const index$4_sendWithLzTokenParamsBeet: typeof sendWithLzTokenParamsBeet;
declare const index$4_setConfigParamsBeet: typeof setConfigParamsBeet;
declare const index$4_setDefaultConfigParamsBeet: typeof setDefaultConfigParamsBeet;
declare const index$4_setTreasuryParamsBeet: typeof setTreasuryParamsBeet;
declare const index$4_treasuryBeet: typeof treasuryBeet;
declare const index$4_treasuryFeeBeet: typeof treasuryFeeBeet;
declare const index$4_ulnConfigBeet: typeof ulnConfigBeet;
declare const index$4_verifyParamsBeet: typeof verifyParamsBeet;
declare const index$4_versionBeet: typeof versionBeet;
declare const index$4_withdrawRentParamsBeet: typeof withdrawRentParamsBeet;
declare const index$4_workerFeeBeet: typeof workerFeeBeet;
declare namespace index$4 {
  export { type index$4_CloseVerifyParams as CloseVerifyParams, type index$4_CommitVerificationParams as CommitVerificationParams, type index$4_Config as Config, type index$4_ConfigRecord as ConfigRecord, type index$4_ExecutorConfig as ExecutorConfig, type index$4_InitConfigParams as InitConfigParams, type index$4_InitDefaultConfigParams as InitDefaultConfigParams, type index$4_InitUlnParams as InitUlnParams, type index$4_InitVerifyParams as InitVerifyParams, type index$4_LzTokenTreasury as LzTokenTreasury, type index$4_MessagingFee as MessagingFee, type index$4_Packet as Packet, type index$4_QuoteParams as QuoteParams, type index$4_SendParams as SendParams, type index$4_SendWithLzTokenParams as SendWithLzTokenParams, type index$4_SetConfigParams as SetConfigParams, type index$4_SetDefaultConfigParams as SetDefaultConfigParams, type index$4_SetTreasuryParams as SetTreasuryParams, type TransferAdminParams$1 as TransferAdminParams, type index$4_Treasury as Treasury, type index$4_TreasuryFee as TreasuryFee, type index$4_UlnConfig as UlnConfig, type index$4_VerifyParams as VerifyParams, type index$4_Version as Version, type index$4_WithdrawRentParams as WithdrawRentParams, type index$4_WorkerFee as WorkerFee, index$4_closeVerifyParamsBeet as closeVerifyParamsBeet, index$4_commitVerificationParamsBeet as commitVerificationParamsBeet, index$4_configBeet as configBeet, index$4_executorConfigBeet as executorConfigBeet, index$4_initConfigParamsBeet as initConfigParamsBeet, index$4_initDefaultConfigParamsBeet as initDefaultConfigParamsBeet, index$4_initUlnParamsBeet as initUlnParamsBeet, index$4_initVerifyParamsBeet as initVerifyParamsBeet, index$4_isConfigExecutor as isConfigExecutor, index$4_isConfigReceiveUln as isConfigReceiveUln, index$4_isConfigSendUln as isConfigSendUln, index$4_lzTokenTreasuryBeet as lzTokenTreasuryBeet, index$4_messagingFeeBeet as messagingFeeBeet, index$4_packetBeet as packetBeet, index$4_quoteParamsBeet as quoteParamsBeet, index$4_sendParamsBeet as sendParamsBeet, index$4_sendWithLzTokenParamsBeet as sendWithLzTokenParamsBeet, index$4_setConfigParamsBeet as setConfigParamsBeet, index$4_setDefaultConfigParamsBeet as setDefaultConfigParamsBeet, index$4_setTreasuryParamsBeet as setTreasuryParamsBeet, transferAdminParamsBeet$1 as transferAdminParamsBeet, index$4_treasuryBeet as treasuryBeet, index$4_treasuryFeeBeet as treasuryFeeBeet, index$4_ulnConfigBeet as ulnConfigBeet, index$4_verifyParamsBeet as verifyParamsBeet, index$4_versionBeet as versionBeet, index$4_withdrawRentParamsBeet as withdrawRentParamsBeet, index$4_workerFeeBeet as workerFeeBeet };
}

/**
 * Program address
 *
 * @category constants
 * @category generated
 */
declare const PROGRAM_ADDRESS$1 = "7a4WjyR8VZ7yZz5XJAKm39BUGn5iT9CKcv2pmG9tdXVH";
/**
 * Program public key
 *
 * @category constants
 * @category generated
 */
declare const PROGRAM_ID$2: PublicKey;

interface MaxMessageSize {
    size: number;
    __kind: 'MaxMessageSize';
}
interface OutboundConfirmations {
    confirmations: number;
    __kind: 'OutboundConfirmations';
}
interface InboundConfirmations {
    confirmations: number;
    __kind: 'InboundConfirmations';
}
interface Oracles {
    useCustomOracles: boolean;
    oracles: PublicKey[];
    __kind: 'Oracles';
}
interface OptionalOracles {
    useCustomOptionalOracles: boolean;
    optionalOracles: PublicKey[];
    threshold: number;
    __kind: 'OptionalOracles';
}
declare class Uln implements MessageLibInterface {
    program: PublicKey;
    deriver: UlnPDADeriver;
    eventAuthorityPDA: PublicKey;
    constructor(program: PublicKey);
    initUln(endpointProgram: PublicKey, payer: PublicKey, admin: PublicKey, eid: number): TransactionInstruction;
    /**
     * before calling this function, you should call initUln to initialize the uln
     */
    initOrUpdateDefaultConfig(connection: Connection, admin: PublicKey, eid: number, sendUlnConfig: UlnConfig, receiveUlnConfig: UlnConfig, executorConfig: ExecutorConfig, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<TransactionInstruction>;
    /**
     * before calling this function, you should call initUln to initialize the uln
     */
    setTreasury(admin: PublicKey, treasury: {
        admin: PublicKey;
        nativeReceiver: PublicKey;
        nativeFeeBps: number;
        lzToken: {
            receiver: PublicKey;
            fee: number;
        } | null;
    } | null): Promise<TransactionInstruction>;
    transferAdmin(connection: Connection, admin: PublicKey, newAdmin: PublicKey, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<TransactionInstruction>;
    /**
     *
     * @param connection
     *
     * @param sender the oApp PDA
     * @param sendLibraryAuthority
     * @param dstEid
     * @param payInLzToken
     * @param commitment
     * @returns
     */
    getQuoteIXAccountMetaForCPI(connection: Connection, _payer: PublicKey, path: PacketPath, commitment?: Commitment): Promise<AccountMeta[]>;
    /***
     * Get the account meta of the send instruction for CPI(Cross-Program Invocation )
     */
    getSendIXAccountMetaForCPI(connection: Connection, payer: PublicKey, path: PacketPath, commitment?: Commitment): Promise<AccountMeta[]>;
    getSendIxRemainingAccounts(connection: Connection, sender: PublicKey, dstEid: number, payment: boolean, commitment?: Commitment | GetAccountInfoConfig): Promise<AccountMeta[]>;
    /***
     * Get all workers(executor&DVN)
     * 2 RPC requests
     */
    getWorkers(connection: Connection, sender: PublicKey, eid: number, commitment?: Commitment | GetAccountInfoConfig): Promise<{
        executor: {
            config: ExecutorConfig$1;
            owner: PublicKey;
        };
        dvns: {
            config: DvnConfig;
            owner: PublicKey;
        }[];
    }>;
    initVerify(connection: Connection, payer: PublicKey, dvn: PublicKey, packetBytes: Uint8Array, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<TransactionInstruction | null>;
    verify(dvn: PublicKey, packetBytes: Uint8Array, confirmations: number | string): TransactionInstruction;
    closeVerify(dvn: PublicKey, receiver: PublicKey, packetBytes: Uint8Array): TransactionInstruction;
    isDvnVerified(connection: Connection, endpointProgram: PublicKey, dvn: PublicKey, packetBytes: Uint8Array, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<boolean>;
    commitVerification(connection: Connection, endpointProgram: PublicKey, packetBytes: Uint8Array): Promise<TransactionInstruction>;
    /***
     * Get the account meta of the send instruction for CPI(Cross-Program Invocation )
     */
    getInitConfigIXAccountMetaForCPI(payer: PublicKey, oappID: PublicKey, eid: number): AccountMeta[];
    static constructSetConfigData(configType: SetConfigType, configData: ExecutorConfig | UlnConfig): Uint8Array;
    /**
     * @param oappID the oApp PDA
     *
     */
    getSetConfigIXAccountMetaForCPI(endpointProgram: PublicKey, oappID: PublicKey, eid: number): Promise<AccountMeta[]>;
    getSetting(connection: Connection, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<UlnSettings | null>;
    getDefaultSendConfigState(connection: Connection, eid: number, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<SendConfig | null>;
    getSendConfigState(connection: Connection, sender: PublicKey, eid: number, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<SendConfig | null>;
    getDefaultReceiveConfigState(connection: Connection, eid: number, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<ReceiveConfig | null>;
    getReceiveConfigState(connection: Connection, receiver: PublicKey, eid: number, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<ReceiveConfig | null>;
    getFinalReceiveConfigState(connection: Connection, receiver: PublicKey, eid: number, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<ReceiveConfig>;
}

type uln_AtLeastOneDVNError = AtLeastOneDVNError;
declare const uln_AtLeastOneDVNError: typeof AtLeastOneDVNError;
type uln_CloseVerifyInstructionAccounts = CloseVerifyInstructionAccounts;
type uln_CloseVerifyInstructionArgs = CloseVerifyInstructionArgs;
type uln_CloseVerifyParams = CloseVerifyParams;
type uln_CommitVerificationInstructionAccounts = CommitVerificationInstructionAccounts;
type uln_CommitVerificationInstructionArgs = CommitVerificationInstructionArgs;
type uln_CommitVerificationParams = CommitVerificationParams;
type uln_Config = Config;
type uln_ConfigRecord = ConfigRecord;
type uln_Confirmations = Confirmations;
declare const uln_Confirmations: typeof Confirmations;
type uln_ConfirmationsArgs = ConfirmationsArgs;
type uln_ExceededMaxMessageSizeError = ExceededMaxMessageSizeError;
declare const uln_ExceededMaxMessageSizeError: typeof ExceededMaxMessageSizeError;
type uln_ExceededU128Error = ExceededU128Error;
declare const uln_ExceededU128Error: typeof ExceededU128Error;
type uln_ExecutorConfig = ExecutorConfig;
type uln_InboundConfirmations = InboundConfirmations;
type uln_InitConfigInstructionAccounts = InitConfigInstructionAccounts;
type uln_InitConfigInstructionArgs = InitConfigInstructionArgs;
type uln_InitConfigParams = InitConfigParams;
type uln_InitDefaultConfigInstructionAccounts = InitDefaultConfigInstructionAccounts;
type uln_InitDefaultConfigInstructionArgs = InitDefaultConfigInstructionArgs;
type uln_InitDefaultConfigParams = InitDefaultConfigParams;
type uln_InitUlnInstructionAccounts = InitUlnInstructionAccounts;
type uln_InitUlnInstructionArgs = InitUlnInstructionArgs;
type uln_InitUlnParams = InitUlnParams;
type uln_InitVerifyInstructionAccounts = InitVerifyInstructionAccounts;
type uln_InitVerifyInstructionArgs = InitVerifyInstructionArgs;
type uln_InitVerifyParams = InitVerifyParams;
type uln_InsufficientFeeError = InsufficientFeeError;
declare const uln_InsufficientFeeError: typeof InsufficientFeeError;
type uln_InvalidAccountLengthError = InvalidAccountLengthError;
declare const uln_InvalidAccountLengthError: typeof InvalidAccountLengthError;
type uln_InvalidAmountError = InvalidAmountError;
declare const uln_InvalidAmountError: typeof InvalidAmountError;
type uln_InvalidBpsError = InvalidBpsError;
declare const uln_InvalidBpsError: typeof InvalidBpsError;
type uln_InvalidConfigTypeError = InvalidConfigTypeError;
declare const uln_InvalidConfigTypeError: typeof InvalidConfigTypeError;
type uln_InvalidConfirmationError = InvalidConfirmationError;
declare const uln_InvalidConfirmationError: typeof InvalidConfirmationError;
type uln_InvalidConfirmationsError = InvalidConfirmationsError;
declare const uln_InvalidConfirmationsError: typeof InvalidConfirmationsError;
type uln_InvalidDvnError = InvalidDvnError;
declare const uln_InvalidDvnError: typeof InvalidDvnError;
type uln_InvalidDvnProgramError = InvalidDvnProgramError;
declare const uln_InvalidDvnProgramError: typeof InvalidDvnProgramError;
type uln_InvalidEidError = InvalidEidError;
declare const uln_InvalidEidError: typeof InvalidEidError;
type uln_InvalidExecutorError = InvalidExecutorError;
declare const uln_InvalidExecutorError: typeof InvalidExecutorError;
type uln_InvalidExecutorProgramError = InvalidExecutorProgramError;
declare const uln_InvalidExecutorProgramError: typeof InvalidExecutorProgramError;
type uln_InvalidLzTokenMintError = InvalidLzTokenMintError;
declare const uln_InvalidLzTokenMintError: typeof InvalidLzTokenMintError;
type uln_InvalidOptionTypeError = InvalidOptionTypeError;
declare const uln_InvalidOptionTypeError: typeof InvalidOptionTypeError;
type uln_InvalidOptionalDVNCountError = InvalidOptionalDVNCountError;
declare const uln_InvalidOptionalDVNCountError: typeof InvalidOptionalDVNCountError;
type uln_InvalidOptionalDVNThresholdError = InvalidOptionalDVNThresholdError;
declare const uln_InvalidOptionalDVNThresholdError: typeof InvalidOptionalDVNThresholdError;
type uln_InvalidPacketVersionError = InvalidPacketVersionError;
declare const uln_InvalidPacketVersionError: typeof InvalidPacketVersionError;
type uln_InvalidPayerError = InvalidPayerError;
declare const uln_InvalidPayerError: typeof InvalidPayerError;
type uln_InvalidRequiredDVNCountError = InvalidRequiredDVNCountError;
declare const uln_InvalidRequiredDVNCountError: typeof InvalidRequiredDVNCountError;
type uln_InvalidTreasuryError = InvalidTreasuryError;
declare const uln_InvalidTreasuryError: typeof InvalidTreasuryError;
type uln_InvalidTreasuryFeeCapError = InvalidTreasuryFeeCapError;
declare const uln_InvalidTreasuryFeeCapError: typeof InvalidTreasuryFeeCapError;
type uln_InvalidType1SizeError = InvalidType1SizeError;
declare const uln_InvalidType1SizeError: typeof InvalidType1SizeError;
type uln_InvalidType2SizeError = InvalidType2SizeError;
declare const uln_InvalidType2SizeError: typeof InvalidType2SizeError;
type uln_InvalidWorkerIdError = InvalidWorkerIdError;
declare const uln_InvalidWorkerIdError: typeof InvalidWorkerIdError;
type uln_LzTokenTreasury = LzTokenTreasury;
type uln_LzTokenUnavailableError = LzTokenUnavailableError;
declare const uln_LzTokenUnavailableError: typeof LzTokenUnavailableError;
type uln_MaxMessageSize = MaxMessageSize;
type uln_MessagingFee = MessagingFee;
type uln_NonSignerError = NonSignerError;
declare const uln_NonSignerError: typeof NonSignerError;
type uln_OptionalOracles = OptionalOracles;
type uln_Oracles = Oracles;
type uln_OutboundConfirmations = OutboundConfirmations;
type uln_Packet = Packet;
type uln_QuoteInstructionAccounts = QuoteInstructionAccounts;
type uln_QuoteInstructionArgs = QuoteInstructionArgs;
type uln_QuoteParams = QuoteParams;
type uln_ReceiveConfig = ReceiveConfig;
declare const uln_ReceiveConfig: typeof ReceiveConfig;
type uln_ReceiveConfigArgs = ReceiveConfigArgs;
type uln_SendConfig = SendConfig;
declare const uln_SendConfig: typeof SendConfig;
type uln_SendConfigArgs = SendConfigArgs;
type uln_SendInstructionAccounts = SendInstructionAccounts;
type uln_SendInstructionArgs = SendInstructionArgs;
type uln_SendParams = SendParams;
type uln_SendWithLzTokenInstructionAccounts = SendWithLzTokenInstructionAccounts;
type uln_SendWithLzTokenInstructionArgs = SendWithLzTokenInstructionArgs;
type uln_SendWithLzTokenParams = SendWithLzTokenParams;
type uln_SetConfigInstructionAccounts = SetConfigInstructionAccounts;
type uln_SetConfigInstructionArgs = SetConfigInstructionArgs;
type uln_SetConfigParams = SetConfigParams;
type uln_SetDefaultConfigInstructionAccounts = SetDefaultConfigInstructionAccounts;
type uln_SetDefaultConfigInstructionArgs = SetDefaultConfigInstructionArgs;
type uln_SetDefaultConfigParams = SetDefaultConfigParams;
type uln_SetTreasuryInstructionAccounts = SetTreasuryInstructionAccounts;
type uln_SetTreasuryInstructionArgs = SetTreasuryInstructionArgs;
type uln_SetTreasuryParams = SetTreasuryParams;
type uln_Treasury = Treasury;
type uln_TreasuryFee = TreasuryFee;
type uln_Uln = Uln;
declare const uln_Uln: typeof Uln;
type uln_UlnConfig = UlnConfig;
type uln_UlnSettings = UlnSettings;
declare const uln_UlnSettings: typeof UlnSettings;
type uln_UlnSettingsArgs = UlnSettingsArgs;
type uln_UnauthorizedError = UnauthorizedError;
declare const uln_UnauthorizedError: typeof UnauthorizedError;
type uln_UnsortedError = UnsortedError;
declare const uln_UnsortedError: typeof UnsortedError;
type uln_VerifyInstructionAccounts = VerifyInstructionAccounts;
type uln_VerifyInstructionArgs = VerifyInstructionArgs;
type uln_VerifyParams = VerifyParams;
type uln_VerifyingError = VerifyingError;
declare const uln_VerifyingError: typeof VerifyingError;
type uln_Version = Version;
type uln_WithdrawRentInstructionAccounts = WithdrawRentInstructionAccounts;
type uln_WithdrawRentInstructionArgs = WithdrawRentInstructionArgs;
type uln_WithdrawRentParams = WithdrawRentParams;
type uln_WorkerFee = WorkerFee;
type uln_ZeroMessageSizeError = ZeroMessageSizeError;
declare const uln_ZeroMessageSizeError: typeof ZeroMessageSizeError;
declare const uln_closeVerifyInstructionDiscriminator: typeof closeVerifyInstructionDiscriminator;
declare const uln_closeVerifyParamsBeet: typeof closeVerifyParamsBeet;
declare const uln_closeVerifyStruct: typeof closeVerifyStruct;
declare const uln_commitVerificationInstructionDiscriminator: typeof commitVerificationInstructionDiscriminator;
declare const uln_commitVerificationParamsBeet: typeof commitVerificationParamsBeet;
declare const uln_commitVerificationStruct: typeof commitVerificationStruct;
declare const uln_configBeet: typeof configBeet;
declare const uln_confirmationsBeet: typeof confirmationsBeet;
declare const uln_confirmationsDiscriminator: typeof confirmationsDiscriminator;
declare const uln_createCloseVerifyInstruction: typeof createCloseVerifyInstruction;
declare const uln_createCloseVerifyInstructionAccounts: typeof createCloseVerifyInstructionAccounts;
declare const uln_createCommitVerificationInstruction: typeof createCommitVerificationInstruction;
declare const uln_createCommitVerificationInstructionAccounts: typeof createCommitVerificationInstructionAccounts;
declare const uln_createInitConfigInstruction: typeof createInitConfigInstruction;
declare const uln_createInitConfigInstructionAccounts: typeof createInitConfigInstructionAccounts;
declare const uln_createInitDefaultConfigInstruction: typeof createInitDefaultConfigInstruction;
declare const uln_createInitDefaultConfigInstructionAccounts: typeof createInitDefaultConfigInstructionAccounts;
declare const uln_createInitUlnInstruction: typeof createInitUlnInstruction;
declare const uln_createInitUlnInstructionAccounts: typeof createInitUlnInstructionAccounts;
declare const uln_createInitVerifyInstruction: typeof createInitVerifyInstruction;
declare const uln_createInitVerifyInstructionAccounts: typeof createInitVerifyInstructionAccounts;
declare const uln_createQuoteInstruction: typeof createQuoteInstruction;
declare const uln_createQuoteInstructionAccounts: typeof createQuoteInstructionAccounts;
declare const uln_createSendInstruction: typeof createSendInstruction;
declare const uln_createSendInstructionAccounts: typeof createSendInstructionAccounts;
declare const uln_createSendWithLzTokenInstruction: typeof createSendWithLzTokenInstruction;
declare const uln_createSendWithLzTokenInstructionAccounts: typeof createSendWithLzTokenInstructionAccounts;
declare const uln_createSetConfigInstruction: typeof createSetConfigInstruction;
declare const uln_createSetConfigInstructionAccounts: typeof createSetConfigInstructionAccounts;
declare const uln_createSetDefaultConfigInstruction: typeof createSetDefaultConfigInstruction;
declare const uln_createSetDefaultConfigInstructionAccounts: typeof createSetDefaultConfigInstructionAccounts;
declare const uln_createSetTreasuryInstruction: typeof createSetTreasuryInstruction;
declare const uln_createSetTreasuryInstructionAccounts: typeof createSetTreasuryInstructionAccounts;
declare const uln_createVerifyInstruction: typeof createVerifyInstruction;
declare const uln_createVerifyInstructionAccounts: typeof createVerifyInstructionAccounts;
declare const uln_createWithdrawRentInstruction: typeof createWithdrawRentInstruction;
declare const uln_createWithdrawRentInstructionAccounts: typeof createWithdrawRentInstructionAccounts;
declare const uln_errorFromCode: typeof errorFromCode;
declare const uln_errorFromName: typeof errorFromName;
declare const uln_executorConfigBeet: typeof executorConfigBeet;
declare const uln_initConfigInstructionDiscriminator: typeof initConfigInstructionDiscriminator;
declare const uln_initConfigParamsBeet: typeof initConfigParamsBeet;
declare const uln_initConfigStruct: typeof initConfigStruct;
declare const uln_initDefaultConfigInstructionDiscriminator: typeof initDefaultConfigInstructionDiscriminator;
declare const uln_initDefaultConfigParamsBeet: typeof initDefaultConfigParamsBeet;
declare const uln_initDefaultConfigStruct: typeof initDefaultConfigStruct;
declare const uln_initUlnInstructionDiscriminator: typeof initUlnInstructionDiscriminator;
declare const uln_initUlnParamsBeet: typeof initUlnParamsBeet;
declare const uln_initUlnStruct: typeof initUlnStruct;
declare const uln_initVerifyInstructionDiscriminator: typeof initVerifyInstructionDiscriminator;
declare const uln_initVerifyParamsBeet: typeof initVerifyParamsBeet;
declare const uln_initVerifyStruct: typeof initVerifyStruct;
declare const uln_isConfigExecutor: typeof isConfigExecutor;
declare const uln_isConfigReceiveUln: typeof isConfigReceiveUln;
declare const uln_isConfigSendUln: typeof isConfigSendUln;
declare const uln_lzTokenTreasuryBeet: typeof lzTokenTreasuryBeet;
declare const uln_messagingFeeBeet: typeof messagingFeeBeet;
declare const uln_packetBeet: typeof packetBeet;
declare const uln_quoteInstructionDiscriminator: typeof quoteInstructionDiscriminator;
declare const uln_quoteParamsBeet: typeof quoteParamsBeet;
declare const uln_quoteStruct: typeof quoteStruct;
declare const uln_receiveConfigBeet: typeof receiveConfigBeet;
declare const uln_receiveConfigDiscriminator: typeof receiveConfigDiscriminator;
declare const uln_sendConfigBeet: typeof sendConfigBeet;
declare const uln_sendConfigDiscriminator: typeof sendConfigDiscriminator;
declare const uln_sendInstructionDiscriminator: typeof sendInstructionDiscriminator;
declare const uln_sendParamsBeet: typeof sendParamsBeet;
declare const uln_sendStruct: typeof sendStruct;
declare const uln_sendWithLzTokenInstructionDiscriminator: typeof sendWithLzTokenInstructionDiscriminator;
declare const uln_sendWithLzTokenParamsBeet: typeof sendWithLzTokenParamsBeet;
declare const uln_sendWithLzTokenStruct: typeof sendWithLzTokenStruct;
declare const uln_setConfigInstructionDiscriminator: typeof setConfigInstructionDiscriminator;
declare const uln_setConfigParamsBeet: typeof setConfigParamsBeet;
declare const uln_setConfigStruct: typeof setConfigStruct;
declare const uln_setDefaultConfigInstructionDiscriminator: typeof setDefaultConfigInstructionDiscriminator;
declare const uln_setDefaultConfigParamsBeet: typeof setDefaultConfigParamsBeet;
declare const uln_setDefaultConfigStruct: typeof setDefaultConfigStruct;
declare const uln_setTreasuryInstructionDiscriminator: typeof setTreasuryInstructionDiscriminator;
declare const uln_setTreasuryParamsBeet: typeof setTreasuryParamsBeet;
declare const uln_setTreasuryStruct: typeof setTreasuryStruct;
declare const uln_treasuryBeet: typeof treasuryBeet;
declare const uln_treasuryFeeBeet: typeof treasuryFeeBeet;
declare const uln_ulnConfigBeet: typeof ulnConfigBeet;
declare const uln_ulnSettingsBeet: typeof ulnSettingsBeet;
declare const uln_ulnSettingsDiscriminator: typeof ulnSettingsDiscriminator;
declare const uln_verifyInstructionDiscriminator: typeof verifyInstructionDiscriminator;
declare const uln_verifyParamsBeet: typeof verifyParamsBeet;
declare const uln_verifyStruct: typeof verifyStruct;
declare const uln_versionBeet: typeof versionBeet;
declare const uln_withdrawRentInstructionDiscriminator: typeof withdrawRentInstructionDiscriminator;
declare const uln_withdrawRentParamsBeet: typeof withdrawRentParamsBeet;
declare const uln_withdrawRentStruct: typeof withdrawRentStruct;
declare const uln_workerFeeBeet: typeof workerFeeBeet;
declare namespace uln {
  export { uln_AtLeastOneDVNError as AtLeastOneDVNError, type uln_CloseVerifyInstructionAccounts as CloseVerifyInstructionAccounts, type uln_CloseVerifyInstructionArgs as CloseVerifyInstructionArgs, type uln_CloseVerifyParams as CloseVerifyParams, type uln_CommitVerificationInstructionAccounts as CommitVerificationInstructionAccounts, type uln_CommitVerificationInstructionArgs as CommitVerificationInstructionArgs, type uln_CommitVerificationParams as CommitVerificationParams, type uln_Config as Config, type uln_ConfigRecord as ConfigRecord, uln_Confirmations as Confirmations, type uln_ConfirmationsArgs as ConfirmationsArgs, uln_ExceededMaxMessageSizeError as ExceededMaxMessageSizeError, uln_ExceededU128Error as ExceededU128Error, type uln_ExecutorConfig as ExecutorConfig, type uln_InboundConfirmations as InboundConfirmations, type uln_InitConfigInstructionAccounts as InitConfigInstructionAccounts, type uln_InitConfigInstructionArgs as InitConfigInstructionArgs, type uln_InitConfigParams as InitConfigParams, type uln_InitDefaultConfigInstructionAccounts as InitDefaultConfigInstructionAccounts, type uln_InitDefaultConfigInstructionArgs as InitDefaultConfigInstructionArgs, type uln_InitDefaultConfigParams as InitDefaultConfigParams, type uln_InitUlnInstructionAccounts as InitUlnInstructionAccounts, type uln_InitUlnInstructionArgs as InitUlnInstructionArgs, type uln_InitUlnParams as InitUlnParams, type uln_InitVerifyInstructionAccounts as InitVerifyInstructionAccounts, type uln_InitVerifyInstructionArgs as InitVerifyInstructionArgs, type uln_InitVerifyParams as InitVerifyParams, uln_InsufficientFeeError as InsufficientFeeError, uln_InvalidAccountLengthError as InvalidAccountLengthError, uln_InvalidAmountError as InvalidAmountError, uln_InvalidBpsError as InvalidBpsError, uln_InvalidConfigTypeError as InvalidConfigTypeError, uln_InvalidConfirmationError as InvalidConfirmationError, uln_InvalidConfirmationsError as InvalidConfirmationsError, uln_InvalidDvnError as InvalidDvnError, uln_InvalidDvnProgramError as InvalidDvnProgramError, uln_InvalidEidError as InvalidEidError, uln_InvalidExecutorError as InvalidExecutorError, uln_InvalidExecutorProgramError as InvalidExecutorProgramError, uln_InvalidLzTokenMintError as InvalidLzTokenMintError, uln_InvalidOptionTypeError as InvalidOptionTypeError, uln_InvalidOptionalDVNCountError as InvalidOptionalDVNCountError, uln_InvalidOptionalDVNThresholdError as InvalidOptionalDVNThresholdError, uln_InvalidPacketVersionError as InvalidPacketVersionError, uln_InvalidPayerError as InvalidPayerError, uln_InvalidRequiredDVNCountError as InvalidRequiredDVNCountError, uln_InvalidTreasuryError as InvalidTreasuryError, uln_InvalidTreasuryFeeCapError as InvalidTreasuryFeeCapError, uln_InvalidType1SizeError as InvalidType1SizeError, uln_InvalidType2SizeError as InvalidType2SizeError, uln_InvalidWorkerIdError as InvalidWorkerIdError, type uln_LzTokenTreasury as LzTokenTreasury, uln_LzTokenUnavailableError as LzTokenUnavailableError, type uln_MaxMessageSize as MaxMessageSize, type uln_MessagingFee as MessagingFee, uln_NonSignerError as NonSignerError, type uln_OptionalOracles as OptionalOracles, type uln_Oracles as Oracles, type uln_OutboundConfirmations as OutboundConfirmations, PROGRAM_ADDRESS$1 as PROGRAM_ADDRESS, PROGRAM_ID$2 as PROGRAM_ID, type uln_Packet as Packet, type uln_QuoteInstructionAccounts as QuoteInstructionAccounts, type uln_QuoteInstructionArgs as QuoteInstructionArgs, type uln_QuoteParams as QuoteParams, uln_ReceiveConfig as ReceiveConfig, type uln_ReceiveConfigArgs as ReceiveConfigArgs, uln_SendConfig as SendConfig, type uln_SendConfigArgs as SendConfigArgs, type uln_SendInstructionAccounts as SendInstructionAccounts, type uln_SendInstructionArgs as SendInstructionArgs, type uln_SendParams as SendParams, type uln_SendWithLzTokenInstructionAccounts as SendWithLzTokenInstructionAccounts, type uln_SendWithLzTokenInstructionArgs as SendWithLzTokenInstructionArgs, type uln_SendWithLzTokenParams as SendWithLzTokenParams, type uln_SetConfigInstructionAccounts as SetConfigInstructionAccounts, type uln_SetConfigInstructionArgs as SetConfigInstructionArgs, type uln_SetConfigParams as SetConfigParams, type uln_SetDefaultConfigInstructionAccounts as SetDefaultConfigInstructionAccounts, type uln_SetDefaultConfigInstructionArgs as SetDefaultConfigInstructionArgs, type uln_SetDefaultConfigParams as SetDefaultConfigParams, type uln_SetTreasuryInstructionAccounts as SetTreasuryInstructionAccounts, type uln_SetTreasuryInstructionArgs as SetTreasuryInstructionArgs, type uln_SetTreasuryParams as SetTreasuryParams, type TransferAdminInstructionAccounts$1 as TransferAdminInstructionAccounts, type TransferAdminInstructionArgs$1 as TransferAdminInstructionArgs, type TransferAdminParams$1 as TransferAdminParams, type uln_Treasury as Treasury, type uln_TreasuryFee as TreasuryFee, uln_Uln as Uln, type uln_UlnConfig as UlnConfig, uln_UlnSettings as UlnSettings, type uln_UlnSettingsArgs as UlnSettingsArgs, uln_UnauthorizedError as UnauthorizedError, uln_UnsortedError as UnsortedError, type uln_VerifyInstructionAccounts as VerifyInstructionAccounts, type uln_VerifyInstructionArgs as VerifyInstructionArgs, type uln_VerifyParams as VerifyParams, uln_VerifyingError as VerifyingError, type uln_Version as Version, type uln_WithdrawRentInstructionAccounts as WithdrawRentInstructionAccounts, type uln_WithdrawRentInstructionArgs as WithdrawRentInstructionArgs, type uln_WithdrawRentParams as WithdrawRentParams, type uln_WorkerFee as WorkerFee, uln_ZeroMessageSizeError as ZeroMessageSizeError, accountProviders$1 as accountProviders, index$8 as accounts, uln_closeVerifyInstructionDiscriminator as closeVerifyInstructionDiscriminator, uln_closeVerifyParamsBeet as closeVerifyParamsBeet, uln_closeVerifyStruct as closeVerifyStruct, uln_commitVerificationInstructionDiscriminator as commitVerificationInstructionDiscriminator, uln_commitVerificationParamsBeet as commitVerificationParamsBeet, uln_commitVerificationStruct as commitVerificationStruct, uln_configBeet as configBeet, uln_confirmationsBeet as confirmationsBeet, uln_confirmationsDiscriminator as confirmationsDiscriminator, uln_createCloseVerifyInstruction as createCloseVerifyInstruction, uln_createCloseVerifyInstructionAccounts as createCloseVerifyInstructionAccounts, uln_createCommitVerificationInstruction as createCommitVerificationInstruction, uln_createCommitVerificationInstructionAccounts as createCommitVerificationInstructionAccounts, uln_createInitConfigInstruction as createInitConfigInstruction, uln_createInitConfigInstructionAccounts as createInitConfigInstructionAccounts, uln_createInitDefaultConfigInstruction as createInitDefaultConfigInstruction, uln_createInitDefaultConfigInstructionAccounts as createInitDefaultConfigInstructionAccounts, uln_createInitUlnInstruction as createInitUlnInstruction, uln_createInitUlnInstructionAccounts as createInitUlnInstructionAccounts, uln_createInitVerifyInstruction as createInitVerifyInstruction, uln_createInitVerifyInstructionAccounts as createInitVerifyInstructionAccounts, uln_createQuoteInstruction as createQuoteInstruction, uln_createQuoteInstructionAccounts as createQuoteInstructionAccounts, uln_createSendInstruction as createSendInstruction, uln_createSendInstructionAccounts as createSendInstructionAccounts, uln_createSendWithLzTokenInstruction as createSendWithLzTokenInstruction, uln_createSendWithLzTokenInstructionAccounts as createSendWithLzTokenInstructionAccounts, uln_createSetConfigInstruction as createSetConfigInstruction, uln_createSetConfigInstructionAccounts as createSetConfigInstructionAccounts, uln_createSetDefaultConfigInstruction as createSetDefaultConfigInstruction, uln_createSetDefaultConfigInstructionAccounts as createSetDefaultConfigInstructionAccounts, uln_createSetTreasuryInstruction as createSetTreasuryInstruction, uln_createSetTreasuryInstructionAccounts as createSetTreasuryInstructionAccounts, createTransferAdminInstruction$1 as createTransferAdminInstruction, createTransferAdminInstructionAccounts$1 as createTransferAdminInstructionAccounts, uln_createVerifyInstruction as createVerifyInstruction, uln_createVerifyInstructionAccounts as createVerifyInstructionAccounts, createVersionInstruction$1 as createVersionInstruction, createVersionInstructionAccounts$1 as createVersionInstructionAccounts, uln_createWithdrawRentInstruction as createWithdrawRentInstruction, uln_createWithdrawRentInstructionAccounts as createWithdrawRentInstructionAccounts, uln_errorFromCode as errorFromCode, uln_errorFromName as errorFromName, index$7 as errors, index$6 as events, uln_executorConfigBeet as executorConfigBeet, uln_initConfigInstructionDiscriminator as initConfigInstructionDiscriminator, uln_initConfigParamsBeet as initConfigParamsBeet, uln_initConfigStruct as initConfigStruct, uln_initDefaultConfigInstructionDiscriminator as initDefaultConfigInstructionDiscriminator, uln_initDefaultConfigParamsBeet as initDefaultConfigParamsBeet, uln_initDefaultConfigStruct as initDefaultConfigStruct, uln_initUlnInstructionDiscriminator as initUlnInstructionDiscriminator, uln_initUlnParamsBeet as initUlnParamsBeet, uln_initUlnStruct as initUlnStruct, uln_initVerifyInstructionDiscriminator as initVerifyInstructionDiscriminator, uln_initVerifyParamsBeet as initVerifyParamsBeet, uln_initVerifyStruct as initVerifyStruct, index$5 as instructions, uln_isConfigExecutor as isConfigExecutor, uln_isConfigReceiveUln as isConfigReceiveUln, uln_isConfigSendUln as isConfigSendUln, uln_lzTokenTreasuryBeet as lzTokenTreasuryBeet, uln_messagingFeeBeet as messagingFeeBeet, uln_packetBeet as packetBeet, uln_quoteInstructionDiscriminator as quoteInstructionDiscriminator, uln_quoteParamsBeet as quoteParamsBeet, uln_quoteStruct as quoteStruct, uln_receiveConfigBeet as receiveConfigBeet, uln_receiveConfigDiscriminator as receiveConfigDiscriminator, uln_sendConfigBeet as sendConfigBeet, uln_sendConfigDiscriminator as sendConfigDiscriminator, uln_sendInstructionDiscriminator as sendInstructionDiscriminator, uln_sendParamsBeet as sendParamsBeet, uln_sendStruct as sendStruct, uln_sendWithLzTokenInstructionDiscriminator as sendWithLzTokenInstructionDiscriminator, uln_sendWithLzTokenParamsBeet as sendWithLzTokenParamsBeet, uln_sendWithLzTokenStruct as sendWithLzTokenStruct, uln_setConfigInstructionDiscriminator as setConfigInstructionDiscriminator, uln_setConfigParamsBeet as setConfigParamsBeet, uln_setConfigStruct as setConfigStruct, uln_setDefaultConfigInstructionDiscriminator as setDefaultConfigInstructionDiscriminator, uln_setDefaultConfigParamsBeet as setDefaultConfigParamsBeet, uln_setDefaultConfigStruct as setDefaultConfigStruct, uln_setTreasuryInstructionDiscriminator as setTreasuryInstructionDiscriminator, uln_setTreasuryParamsBeet as setTreasuryParamsBeet, uln_setTreasuryStruct as setTreasuryStruct, transferAdminInstructionDiscriminator$1 as transferAdminInstructionDiscriminator, transferAdminParamsBeet$1 as transferAdminParamsBeet, transferAdminStruct$1 as transferAdminStruct, uln_treasuryBeet as treasuryBeet, uln_treasuryFeeBeet as treasuryFeeBeet, index$4 as types, uln_ulnConfigBeet as ulnConfigBeet, uln_ulnSettingsBeet as ulnSettingsBeet, uln_ulnSettingsDiscriminator as ulnSettingsDiscriminator, uln_verifyInstructionDiscriminator as verifyInstructionDiscriminator, uln_verifyParamsBeet as verifyParamsBeet, uln_verifyStruct as verifyStruct, uln_versionBeet as versionBeet, versionInstructionDiscriminator$1 as versionInstructionDiscriminator, versionStruct$1 as versionStruct, uln_withdrawRentInstructionDiscriminator as withdrawRentInstructionDiscriminator, uln_withdrawRentParamsBeet as withdrawRentParamsBeet, uln_withdrawRentStruct as withdrawRentStruct, uln_workerFeeBeet as workerFeeBeet };
}

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * This type is used to derive the {@link ModelType} type as well as the de/serializer.
 * However don't refer to it in your code but use the {@link ModelType} type instead.
 *
 * @category userTypes
 * @category enums
 * @category generated
 * @private
 */
type ModelTypeRecord = {
    Arbitrum: {
        gasPerL2Tx: beet.bignum;
        gasPerL1CalldataByte: number;
    };
    Optimism: {
        l1Eid: number;
    };
};
/**
 * Union type respresenting the ModelType data enum defined in Rust.
 *
 * NOTE: that it includes a `__kind` property which allows to narrow types in
 * switch/if statements.
 * Additionally `isModelType*` type guards are exposed below to narrow to a specific variant.
 *
 * @category userTypes
 * @category enums
 * @category generated
 */
type ModelType = beet.DataEnumKeyAsKind<ModelTypeRecord>;
declare const isModelTypeArbitrum: (x: ModelType) => x is {
    __kind: "Arbitrum";
} & Omit<{
    gasPerL2Tx: beet.bignum;
    gasPerL1CalldataByte: number;
}, "void"> & {
    __kind: 'Arbitrum';
};
declare const isModelTypeOptimism: (x: ModelType) => x is {
    __kind: "Optimism";
} & Omit<{
    l1Eid: number;
}, "void"> & {
    __kind: 'Optimism';
};
/**
 * @category userTypes
 * @category generated
 */
declare const modelTypeBeet: beet.FixableBeet<ModelType, ModelType>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type Price = {
    eid: number;
    priceRatio: beet.bignum;
    gasPriceInUnit: beet.bignum;
    gasPerByte: number;
    modelType: beet.COption<ModelType>;
};
/**
 * @category userTypes
 * @category generated
 */
declare const priceBeet: beet.FixableBeetArgsStruct<Price>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * Arguments used to create {@link PriceFeed}
 * @category Accounts
 * @category generated
 */
type PriceFeedArgs = {
    admin: web3.PublicKey;
    updaters: web3.PublicKey[];
    priceRatioDenominator: beet.bignum;
    arbitrumCompressionPercent: beet.bignum;
    nativeTokenPriceUsd: beet.COption<beet.bignum>;
    prices: Price[];
    bump: number;
};
declare const priceFeedDiscriminator: number[];
/**
 * Holds the data for the {@link PriceFeed} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
declare class PriceFeed$1 implements PriceFeedArgs {
    readonly admin: web3.PublicKey;
    readonly updaters: web3.PublicKey[];
    readonly priceRatioDenominator: beet.bignum;
    readonly arbitrumCompressionPercent: beet.bignum;
    readonly nativeTokenPriceUsd: beet.COption<beet.bignum>;
    readonly prices: Price[];
    readonly bump: number;
    private constructor();
    /**
     * Creates a {@link PriceFeed} instance from the provided args.
     */
    static fromArgs(args: PriceFeedArgs): PriceFeed$1;
    /**
     * Deserializes the {@link PriceFeed} from the data of the provided {@link web3.AccountInfo}.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static fromAccountInfo(accountInfo: web3.AccountInfo<Buffer>, offset?: number): [PriceFeed$1, number];
    /**
     * Retrieves the account info from the provided address and deserializes
     * the {@link PriceFeed} from its data.
     *
     * @throws Error if no account info is found at the address or if deserialization fails
     */
    static fromAccountAddress(connection: web3.Connection, address: web3.PublicKey, commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig): Promise<PriceFeed$1>;
    /**
     * Provides a {@link web3.Connection.getProgramAccounts} config builder,
     * to fetch accounts matching filters that can be specified via that builder.
     *
     * @param programId - the program that owns the accounts we are filtering
     */
    static gpaBuilder(programId?: web3.PublicKey): beetSolana.GpaBuilder<PriceFeedArgs & {
        accountDiscriminator: number[];
    }>;
    /**
     * Deserializes the {@link PriceFeed} from the provided data Buffer.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static deserialize(buf: Buffer, offset?: number): [PriceFeed$1, number];
    /**
     * Serializes the {@link PriceFeed} into a Buffer.
     * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
     */
    serialize(): [Buffer, number];
    /**
     * Returns the byteSize of a {@link Buffer} holding the serialized data of
     * {@link PriceFeed} for the provided args.
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     */
    static byteSize(args: PriceFeedArgs): number;
    /**
     * Fetches the minimum balance needed to exempt an account holding
     * {@link PriceFeed} data from rent
     *
     * @param args need to be provided since the byte size for this account
     * depends on them
     * @param connection used to retrieve the rent exemption information
     */
    static getMinimumBalanceForRentExemption(args: PriceFeedArgs, connection: web3.Connection, commitment?: web3.Commitment): Promise<number>;
    /**
     * Returns a readable version of {@link PriceFeed} properties
     * and can be used to convert to JSON and/or logging
     */
    pretty(): {
        admin: string;
        updaters: web3.PublicKey[];
        priceRatioDenominator: number | {
            toNumber: () => number;
        };
        arbitrumCompressionPercent: number | {
            toNumber: () => number;
        };
        nativeTokenPriceUsd: beet.COption<beet.bignum>;
        prices: Price[];
        bump: number;
    };
}
/**
 * @category Accounts
 * @category generated
 */
declare const priceFeedBeet: beet.FixableBeetStruct<PriceFeed$1, PriceFeedArgs & {
    accountDiscriminator: number[];
}>;

declare const accountProviders: {
    PriceFeed: typeof PriceFeed$1;
};

type index$3_PriceFeedArgs = PriceFeedArgs;
declare const index$3_accountProviders: typeof accountProviders;
declare const index$3_priceFeedBeet: typeof priceFeedBeet;
declare const index$3_priceFeedDiscriminator: typeof priceFeedDiscriminator;
declare namespace index$3 {
  export { PriceFeed$1 as PriceFeed, type index$3_PriceFeedArgs as PriceFeedArgs, index$3_accountProviders as accountProviders, index$3_priceFeedBeet as priceFeedBeet, index$3_priceFeedDiscriminator as priceFeedDiscriminator };
}

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type GetFeeParams = {
    dstEid: number;
    calldataSize: beet.bignum;
    totalGas: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const getFeeParamsBeet: beet.BeetArgsStruct<GetFeeParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category GetFee
 * @category generated
 */
type GetFeeInstructionArgs = {
    params: GetFeeParams;
};
/**
 * @category Instructions
 * @category GetFee
 * @category generated
 */
declare const getFeeStruct: beet.BeetArgsStruct<GetFeeInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _getFee_ instruction
 *
 * @property [] priceFeed
 * @category Instructions
 * @category GetFee
 * @category generated
 */
type GetFeeInstructionAccounts = {
    priceFeed: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const getFeeInstructionDiscriminator: number[];
/**
 * Creates a _GetFee_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category GetFee
 * @category generated
 */
declare function createGetFeeInstruction(accounts: GetFeeInstructionAccounts, args: GetFeeInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _GetFee_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category GetFee
 * @category generated
 */
declare function createGetFeeInstructionAccounts(accounts: GetFeeInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type InitPriceFeedParams = {
    admin: web3.PublicKey;
    updaters: web3.PublicKey[];
};
/**
 * @category userTypes
 * @category generated
 */
declare const initPriceFeedParamsBeet: beet.FixableBeetArgsStruct<InitPriceFeedParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category InitPriceFeed
 * @category generated
 */
type InitPriceFeedInstructionArgs = {
    params: InitPriceFeedParams;
};
/**
 * @category Instructions
 * @category InitPriceFeed
 * @category generated
 */
declare const initPriceFeedStruct: beet.FixableBeetArgsStruct<InitPriceFeedInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _initPriceFeed_ instruction
 *
 * @property [_writable_, **signer**] payer
 * @property [_writable_] priceFeed
 * @category Instructions
 * @category InitPriceFeed
 * @category generated
 */
type InitPriceFeedInstructionAccounts = {
    payer: web3.PublicKey;
    priceFeed: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const initPriceFeedInstructionDiscriminator: number[];
/**
 * Creates a _InitPriceFeed_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category InitPriceFeed
 * @category generated
 */
declare function createInitPriceFeedInstruction(accounts: InitPriceFeedInstructionAccounts, args: InitPriceFeedInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _InitPriceFeed_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category InitPriceFeed
 * @category generated
 */
declare function createInitPriceFeedInstructionAccounts(accounts: InitPriceFeedInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type PriceParams = {
    priceRatio: beet.bignum;
    gasPriceInUnit: beet.bignum;
    gasPerByte: number;
    modelType: beet.COption<ModelType>;
};
/**
 * @category userTypes
 * @category generated
 */
declare const priceParamsBeet: beet.FixableBeetArgsStruct<PriceParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type SetPriceParams = {
    dstEid: number;
    params: beet.COption<PriceParams>;
};
/**
 * @category userTypes
 * @category generated
 */
declare const setPriceParamsBeet: beet.FixableBeetArgsStruct<SetPriceParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category SetPrice
 * @category generated
 */
type SetPriceInstructionArgs = {
    params: SetPriceParams;
};
/**
 * @category Instructions
 * @category SetPrice
 * @category generated
 */
declare const setPriceStruct: beet.FixableBeetArgsStruct<SetPriceInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _setPrice_ instruction
 *
 * @property [**signer**] updater
 * @property [_writable_] priceFeed
 * @category Instructions
 * @category SetPrice
 * @category generated
 */
type SetPriceInstructionAccounts = {
    updater: web3.PublicKey;
    priceFeed: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const setPriceInstructionDiscriminator: number[];
/**
 * Creates a _SetPrice_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category SetPrice
 * @category generated
 */
declare function createSetPriceInstruction(accounts: SetPriceInstructionAccounts, args: SetPriceInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _SetPrice_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category SetPrice
 * @category generated
 */
declare function createSetPriceInstructionAccounts(accounts: SetPriceInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type SetPriceFeedParams = {
    updaters: web3.PublicKey[];
    priceRatioDenominator: beet.bignum;
    arbitrumCompressionPercent: beet.bignum;
};
/**
 * @category userTypes
 * @category generated
 */
declare const setPriceFeedParamsBeet: beet.FixableBeetArgsStruct<SetPriceFeedParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category SetPriceFeed
 * @category generated
 */
type SetPriceFeedInstructionArgs = {
    params: SetPriceFeedParams;
};
/**
 * @category Instructions
 * @category SetPriceFeed
 * @category generated
 */
declare const setPriceFeedStruct: beet.FixableBeetArgsStruct<SetPriceFeedInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _setPriceFeed_ instruction
 *
 * @property [_writable_, **signer**] admin
 * @property [_writable_] priceFeed
 * @category Instructions
 * @category SetPriceFeed
 * @category generated
 */
type SetPriceFeedInstructionAccounts = {
    admin: web3.PublicKey;
    priceFeed: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const setPriceFeedInstructionDiscriminator: number[];
/**
 * Creates a _SetPriceFeed_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category SetPriceFeed
 * @category generated
 */
declare function createSetPriceFeedInstruction(accounts: SetPriceFeedInstructionAccounts, args: SetPriceFeedInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _SetPriceFeed_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category SetPriceFeed
 * @category generated
 */
declare function createSetPriceFeedInstructionAccounts(accounts: SetPriceFeedInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type SetSolPriceParams = {
    nativeTokenPriceUsd: beet.COption<beet.bignum>;
};
/**
 * @category userTypes
 * @category generated
 */
declare const setSolPriceParamsBeet: beet.FixableBeetArgsStruct<SetSolPriceParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category SetSolPrice
 * @category generated
 */
type SetSolPriceInstructionArgs = {
    params: SetSolPriceParams;
};
/**
 * @category Instructions
 * @category SetSolPrice
 * @category generated
 */
declare const setSolPriceStruct: beet.FixableBeetArgsStruct<SetSolPriceInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _setSolPrice_ instruction
 *
 * @property [**signer**] updater
 * @property [_writable_] priceFeed
 * @category Instructions
 * @category SetSolPrice
 * @category generated
 */
type SetSolPriceInstructionAccounts = {
    updater: web3.PublicKey;
    priceFeed: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const setSolPriceInstructionDiscriminator: number[];
/**
 * Creates a _SetSolPrice_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category SetSolPrice
 * @category generated
 */
declare function createSetSolPriceInstruction(accounts: SetSolPriceInstructionAccounts, args: SetSolPriceInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _SetSolPrice_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category SetSolPrice
 * @category generated
 */
declare function createSetSolPriceInstructionAccounts(accounts: SetSolPriceInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type TransferAdminParams = {
    admin: web3.PublicKey;
};
/**
 * @category userTypes
 * @category generated
 */
declare const transferAdminParamsBeet: beet.BeetArgsStruct<TransferAdminParams>;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category TransferAdmin
 * @category generated
 */
type TransferAdminInstructionArgs = {
    params: TransferAdminParams;
};
/**
 * @category Instructions
 * @category TransferAdmin
 * @category generated
 */
declare const transferAdminStruct: beet.BeetArgsStruct<TransferAdminInstructionArgs & {
    instructionDiscriminator: number[];
}>;
/**
 * Accounts required by the _transferAdmin_ instruction
 *
 * @property [**signer**] admin
 * @property [_writable_] priceFeed
 * @category Instructions
 * @category TransferAdmin
 * @category generated
 */
type TransferAdminInstructionAccounts = {
    admin: web3.PublicKey;
    priceFeed: web3.PublicKey;
    anchorRemainingAccounts?: web3.AccountMeta[];
};
declare const transferAdminInstructionDiscriminator: number[];
/**
 * Creates a _TransferAdmin_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category TransferAdmin
 * @category generated
 */
declare function createTransferAdminInstruction(accounts: TransferAdminInstructionAccounts, args: TransferAdminInstructionArgs, programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _TransferAdmin_ instructionAccounts.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category TransferAdmin
 * @category generated
 */
declare function createTransferAdminInstructionAccounts(accounts: TransferAdminInstructionAccounts, programId: web3.PublicKey): web3.AccountMeta[];

type index$2_GetFeeInstructionAccounts = GetFeeInstructionAccounts;
type index$2_GetFeeInstructionArgs = GetFeeInstructionArgs;
type index$2_InitPriceFeedInstructionAccounts = InitPriceFeedInstructionAccounts;
type index$2_InitPriceFeedInstructionArgs = InitPriceFeedInstructionArgs;
type index$2_SetPriceFeedInstructionAccounts = SetPriceFeedInstructionAccounts;
type index$2_SetPriceFeedInstructionArgs = SetPriceFeedInstructionArgs;
type index$2_SetPriceInstructionAccounts = SetPriceInstructionAccounts;
type index$2_SetPriceInstructionArgs = SetPriceInstructionArgs;
type index$2_SetSolPriceInstructionAccounts = SetSolPriceInstructionAccounts;
type index$2_SetSolPriceInstructionArgs = SetSolPriceInstructionArgs;
type index$2_TransferAdminInstructionAccounts = TransferAdminInstructionAccounts;
type index$2_TransferAdminInstructionArgs = TransferAdminInstructionArgs;
declare const index$2_createGetFeeInstruction: typeof createGetFeeInstruction;
declare const index$2_createGetFeeInstructionAccounts: typeof createGetFeeInstructionAccounts;
declare const index$2_createInitPriceFeedInstruction: typeof createInitPriceFeedInstruction;
declare const index$2_createInitPriceFeedInstructionAccounts: typeof createInitPriceFeedInstructionAccounts;
declare const index$2_createSetPriceFeedInstruction: typeof createSetPriceFeedInstruction;
declare const index$2_createSetPriceFeedInstructionAccounts: typeof createSetPriceFeedInstructionAccounts;
declare const index$2_createSetPriceInstruction: typeof createSetPriceInstruction;
declare const index$2_createSetPriceInstructionAccounts: typeof createSetPriceInstructionAccounts;
declare const index$2_createSetSolPriceInstruction: typeof createSetSolPriceInstruction;
declare const index$2_createSetSolPriceInstructionAccounts: typeof createSetSolPriceInstructionAccounts;
declare const index$2_createTransferAdminInstruction: typeof createTransferAdminInstruction;
declare const index$2_createTransferAdminInstructionAccounts: typeof createTransferAdminInstructionAccounts;
declare const index$2_getFeeInstructionDiscriminator: typeof getFeeInstructionDiscriminator;
declare const index$2_getFeeStruct: typeof getFeeStruct;
declare const index$2_initPriceFeedInstructionDiscriminator: typeof initPriceFeedInstructionDiscriminator;
declare const index$2_initPriceFeedStruct: typeof initPriceFeedStruct;
declare const index$2_setPriceFeedInstructionDiscriminator: typeof setPriceFeedInstructionDiscriminator;
declare const index$2_setPriceFeedStruct: typeof setPriceFeedStruct;
declare const index$2_setPriceInstructionDiscriminator: typeof setPriceInstructionDiscriminator;
declare const index$2_setPriceStruct: typeof setPriceStruct;
declare const index$2_setSolPriceInstructionDiscriminator: typeof setSolPriceInstructionDiscriminator;
declare const index$2_setSolPriceStruct: typeof setSolPriceStruct;
declare const index$2_transferAdminInstructionDiscriminator: typeof transferAdminInstructionDiscriminator;
declare const index$2_transferAdminStruct: typeof transferAdminStruct;
declare namespace index$2 {
  export { type index$2_GetFeeInstructionAccounts as GetFeeInstructionAccounts, type index$2_GetFeeInstructionArgs as GetFeeInstructionArgs, type index$2_InitPriceFeedInstructionAccounts as InitPriceFeedInstructionAccounts, type index$2_InitPriceFeedInstructionArgs as InitPriceFeedInstructionArgs, type index$2_SetPriceFeedInstructionAccounts as SetPriceFeedInstructionAccounts, type index$2_SetPriceFeedInstructionArgs as SetPriceFeedInstructionArgs, type index$2_SetPriceInstructionAccounts as SetPriceInstructionAccounts, type index$2_SetPriceInstructionArgs as SetPriceInstructionArgs, type index$2_SetSolPriceInstructionAccounts as SetSolPriceInstructionAccounts, type index$2_SetSolPriceInstructionArgs as SetSolPriceInstructionArgs, type index$2_TransferAdminInstructionAccounts as TransferAdminInstructionAccounts, type index$2_TransferAdminInstructionArgs as TransferAdminInstructionArgs, index$2_createGetFeeInstruction as createGetFeeInstruction, index$2_createGetFeeInstructionAccounts as createGetFeeInstructionAccounts, index$2_createInitPriceFeedInstruction as createInitPriceFeedInstruction, index$2_createInitPriceFeedInstructionAccounts as createInitPriceFeedInstructionAccounts, index$2_createSetPriceFeedInstruction as createSetPriceFeedInstruction, index$2_createSetPriceFeedInstructionAccounts as createSetPriceFeedInstructionAccounts, index$2_createSetPriceInstruction as createSetPriceInstruction, index$2_createSetPriceInstructionAccounts as createSetPriceInstructionAccounts, index$2_createSetSolPriceInstruction as createSetSolPriceInstruction, index$2_createSetSolPriceInstructionAccounts as createSetSolPriceInstructionAccounts, index$2_createTransferAdminInstruction as createTransferAdminInstruction, index$2_createTransferAdminInstructionAccounts as createTransferAdminInstructionAccounts, index$2_getFeeInstructionDiscriminator as getFeeInstructionDiscriminator, index$2_getFeeStruct as getFeeStruct, index$2_initPriceFeedInstructionDiscriminator as initPriceFeedInstructionDiscriminator, index$2_initPriceFeedStruct as initPriceFeedStruct, index$2_setPriceFeedInstructionDiscriminator as setPriceFeedInstructionDiscriminator, index$2_setPriceFeedStruct as setPriceFeedStruct, index$2_setPriceInstructionDiscriminator as setPriceInstructionDiscriminator, index$2_setPriceStruct as setPriceStruct, index$2_setSolPriceInstructionDiscriminator as setSolPriceInstructionDiscriminator, index$2_setSolPriceStruct as setSolPriceStruct, index$2_transferAdminInstructionDiscriminator as transferAdminInstructionDiscriminator, index$2_transferAdminStruct as transferAdminStruct };
}

type index$1_GetFeeParams = GetFeeParams;
type index$1_InitPriceFeedParams = InitPriceFeedParams;
type index$1_ModelType = ModelType;
type index$1_ModelTypeRecord = ModelTypeRecord;
type index$1_Price = Price;
type index$1_PriceParams = PriceParams;
type index$1_SetPriceFeedParams = SetPriceFeedParams;
type index$1_SetPriceParams = SetPriceParams;
type index$1_SetSolPriceParams = SetSolPriceParams;
type index$1_TransferAdminParams = TransferAdminParams;
declare const index$1_getFeeParamsBeet: typeof getFeeParamsBeet;
declare const index$1_initPriceFeedParamsBeet: typeof initPriceFeedParamsBeet;
declare const index$1_isModelTypeArbitrum: typeof isModelTypeArbitrum;
declare const index$1_isModelTypeOptimism: typeof isModelTypeOptimism;
declare const index$1_modelTypeBeet: typeof modelTypeBeet;
declare const index$1_priceBeet: typeof priceBeet;
declare const index$1_priceParamsBeet: typeof priceParamsBeet;
declare const index$1_setPriceFeedParamsBeet: typeof setPriceFeedParamsBeet;
declare const index$1_setPriceParamsBeet: typeof setPriceParamsBeet;
declare const index$1_setSolPriceParamsBeet: typeof setSolPriceParamsBeet;
declare const index$1_transferAdminParamsBeet: typeof transferAdminParamsBeet;
declare namespace index$1 {
  export { type index$1_GetFeeParams as GetFeeParams, type index$1_InitPriceFeedParams as InitPriceFeedParams, type index$1_ModelType as ModelType, type index$1_ModelTypeRecord as ModelTypeRecord, type index$1_Price as Price, type index$1_PriceParams as PriceParams, type index$1_SetPriceFeedParams as SetPriceFeedParams, type index$1_SetPriceParams as SetPriceParams, type index$1_SetSolPriceParams as SetSolPriceParams, type index$1_TransferAdminParams as TransferAdminParams, index$1_getFeeParamsBeet as getFeeParamsBeet, index$1_initPriceFeedParamsBeet as initPriceFeedParamsBeet, index$1_isModelTypeArbitrum as isModelTypeArbitrum, index$1_isModelTypeOptimism as isModelTypeOptimism, index$1_modelTypeBeet as modelTypeBeet, index$1_priceBeet as priceBeet, index$1_priceParamsBeet as priceParamsBeet, index$1_setPriceFeedParamsBeet as setPriceFeedParamsBeet, index$1_setPriceParamsBeet as setPriceParamsBeet, index$1_setSolPriceParamsBeet as setSolPriceParamsBeet, index$1_transferAdminParamsBeet as transferAdminParamsBeet };
}

/**
 * Program public key
 *
 * @category constants
 * @category generated
 */
declare const PROGRAM_ID$1: PublicKey;

declare class PriceFeed {
    readonly program: PublicKey;
    deriver: PriceFeedPDADeriver;
    constructor(program: PublicKey);
    initPriceFeed(connection: Connection, payer: PublicKey, admin: PublicKey, updaters: PublicKey[], commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<TransactionInstruction>;
    setPriceFeed(admin: PublicKey, updaters: PublicKey[], priceRatioDenominator: bignum, arbitrumCompressionPercent: number): TransactionInstruction;
    setPrice(updater: PublicKey, dstEid: number, priceRatio: bignum, gasPriceInUnit: bignum, gasPerByte: number, modelType: ModelType | null): TransactionInstruction;
    setSolPrice(updater: PublicKey, nativeTokenPriceUsd: bignum | null): TransactionInstruction;
    transferAdmin(admin: PublicKey, newAdmin: PublicKey): TransactionInstruction;
    getPriceFeed(connection: Connection, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<PriceFeed$1 | null>;
}

type pricefeed_PriceFeed = PriceFeed;
declare const pricefeed_PriceFeed: typeof PriceFeed;
declare namespace pricefeed {
  export { PROGRAM_ID$1 as PROGRAM_ID, pricefeed_PriceFeed as PriceFeed, index$3 as accounts, index$2 as instructions, index$1 as types };
}

declare function oappIDPDA(program: PublicKey, seed?: string, id?: number): [PublicKey, number];
declare function deriveLzReceiveTypesAccountsPDA(program: PublicKey, oappId?: PublicKey): [PublicKey, number];
declare function deriveLzComposeTypesAccountsPDA(program: PublicKey, oappId?: PublicKey): [PublicKey, number];
declare abstract class BaseOApp {
    program: PublicKey;
    oappBaseDeriver: OAppBasePDADeriver;
    constructor(program: PublicKey);
    abstract getEndpoint(connection: Connection): Promise<Endpoint>;
    abstract getSendLibraryProgram(connection: Connection, payer: PublicKey, dstEid: number, endpoint?: Endpoint): Promise<SimpleMessageLib | Uln>;
    queryIDPDAInfo(connection: Connection, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<AccountInfo<Buffer> | null>;
    queryPDAInfo(connection: Connection, pda: PublicKey, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<AccountInfo<Buffer> | null>;
    idPDA(): [PublicKey, number];
    getRemote(connection: Connection, dstEid: number, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<Uint8Array | null>;
}

declare function extractSentPacketEventByTxHash(connection: Connection, program: PublicKey, signature: TransactionSignature | Awaited<ReturnType<typeof connection.getParsedTransaction>>, commitment?: Finality | GetVersionedTransactionConfig, unsafeParseErr?: boolean): Promise<PacketSentEvent[] | null>;
declare function extractVerifiedPacketEventByTxHash(connection: Connection, program: PublicKey, signature: TransactionSignature | Awaited<ReturnType<typeof connection.getParsedTransaction>>, commitment?: Finality | GetVersionedTransactionConfig, unsafeParseErr?: boolean): Promise<PacketVerifiedEvent[] | null>;
declare function extractReceivedPacketEventByTxHash(connection: Connection, program: PublicKey, signature: TransactionSignature | Awaited<ReturnType<typeof connection.getParsedTransaction>>, commitment?: Finality | GetVersionedTransactionConfig, unsafeParseErr?: boolean): Promise<PacketDeliveredEvent[] | null>;
declare function extractComposeSentEventByTxHash(connection: Connection, program: PublicKey, signature: TransactionSignature | Awaited<ReturnType<typeof connection.getParsedTransaction>>, commitment?: Finality | GetVersionedTransactionConfig, unsafeParseErr?: boolean): Promise<ComposeSentEvent[] | null>;
declare function extractComposeDeliveredEventByTxHash(connection: Connection, program: PublicKey, signature: TransactionSignature | Awaited<ReturnType<typeof connection.getParsedTransaction>>, commitment?: Finality | GetVersionedTransactionConfig, unsafeParseErr?: boolean): Promise<ComposeDeliveredEvent[] | null>;
declare function extractWorkerFeePaidEventByTxHash(connection: Connection, program: PublicKey, signature: TransactionSignature | Awaited<ReturnType<typeof connection.getParsedTransaction>>, commitment?: Finality | GetVersionedTransactionConfig, unsafeParseErr?: boolean): Promise<FeesPaidEvent[] | null>;
/**
 * @param connection
 * @param program extract event from specific program id
 * @signature transaction signature(tx hash) or parsed transaction
 * @eventBeet beet struct for event
 * @commitment commitment level
 * @unsafeParseErr Default is false, only parse event if transaction succeeded. if true, will parse event even if transaction failed. Please set this to false if you want to ignore failed transaction and set `true` with caution as it may lead to unexpected behavior.
 * @returns array of events or null if no event found
 */
declare function extractEventFromTransactionSignature<E>(connection: Connection, program: PublicKey, signature: TransactionSignature | Awaited<ReturnType<typeof connection.getParsedTransaction>>, eventBeet: beet.FixableBeetArgsStruct<E> | beet.BeetArgsStruct<E>, commitment?: Finality | GetVersionedTransactionConfig, unsafeParseErr?: boolean): Promise<E[] | null>;
declare function generateAddressLookupTable(connection: Connection, payer: PublicKey, authority: PublicKey, addresses: PublicKey[]): Promise<{
    instructions: TransactionInstruction[];
    address: PublicKey;
}>;
declare function deactivateLookupTable(authority: PublicKey, lookupTable: PublicKey): TransactionInstruction;
declare function closeLookupTable(recipient: PublicKey, authority: PublicKey, lookupTable: PublicKey): TransactionInstruction;
declare function txWithAddressLookupTable(connection: Connection, payer: PublicKey, instructions: TransactionInstruction[], recentBlockHash?: Blockhash, tableAddr?: PublicKey): Promise<VersionedTransaction>;
declare function createNonceAccountTX(connection: Connection, auth: PublicKey, lamportsForRent?: number): Promise<{
    tx: Transaction;
    nonceAccount: Keypair;
}>;
declare function txWithNonce(connection: Connection, noncePubkey: PublicKey, instructions: TransactionInstruction[], nonceInfo?: NonceAccount): Promise<Transaction | null>;
declare function isAccountInitialized(connection: Connection, account: PublicKey, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<boolean>;
declare function buildMessageV0(connection: Connection, payerKey: PublicKey, instructions: TransactionInstruction[], commitmentOrConfig?: Commitment | GetAccountInfoConfig, blockhash?: Blockhash): Promise<MessageV0>;
declare function buildVersionedTransaction(connection: Connection, payerKey: PublicKey, instructions: TransactionInstruction[], commitmentOrConfig?: Commitment | GetAccountInfoConfig, blockhash?: Blockhash, lookupTableAddress?: PublicKey): Promise<VersionedTransaction>;
declare function instructionDiscriminator(method: string): Buffer;
declare function simulateTransaction(connection: Connection, instructions: TransactionInstruction[], programId: PublicKey, payer: PublicKey, commitment?: Commitment, blockhash?: Blockhash, lookupTableAddress?: PublicKey): Promise<Buffer>;

declare const idlTypes: string[];
declare const messageLibs: string[];
declare const FAUCET_URL: {
    [env in Environment]: string;
};

declare const AddressType: beet.ElementCollectionBeet & beet.BeetBase & beet.BeetReadWrite<number[], number[]>;
declare const MSG_TYPE_OFFSET = 0;
declare enum MessageType {
    VANILLA = 1,
    COMPOSED_TYPE = 2
}
interface LzReceiveParams {
    srcEid: number;
    sender: number[];
    nonce: bignum;
    guid: number[];
    message: Uint8Array;
    callerParams: Uint8Array;
}
declare const LzReceiveParamsBeet: FixableBeetArgsStruct<LzReceiveParams>;
/**
 *
pub from: Pubkey,
pub to: Pubkey,
pub guid: [u8; 32],
pub index: u16,
pub message: Vec<u8>,
pub extra_data: Vec<u8>,
**/
interface LzComposeParams {
    from: PublicKey;
    to: PublicKey;
    guid: number[];
    index: number;
    message: Uint8Array;
    extraData: Uint8Array;
}
/**
 * @category userTypes
 * @category generated
 */
declare const LzComposeParamsBeet: FixableBeetArgsStruct<LzComposeParams>;
interface LzReceiveAccount {
    pubkey: PublicKey;
    isSigner: boolean;
    isWritable: boolean;
}
/**
 * @category userTypes
 * @category generated
 */
declare const LzReceiveAccountBeet: BeetArgsStruct<LzReceiveAccount>;
declare enum ExecutorOptionType {
    PlaceHolder = 0,
    LzReceive = 1,
    NativeDrop = 2,
    LzCompose = 3,
    OrderExecution = 4
}
declare const MaxExecutorOptionTypeLength = 10;

/**
 * @param payer. If the msgType is COMPOSED_TYPE, then the payer is required to pay for initializing the account.
 */
declare function lzReceive(connection: Connection, payer: PublicKey, packet: Packet$2, callerParams?: Uint8Array, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<TransactionInstruction>;
declare function lzCompose(connection: Connection, payer: PublicKey, event: ComposeSentEvent, extraData?: Uint8Array, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<TransactionInstruction>;
declare function getLzReceiveAccounts(connection: Connection, payer: PublicKey, receiver: PublicKey, receiverProgram: PublicKey, params: LzReceiveParams, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<AccountMeta[]>;
declare function getLzComposeAccountMeta(connection: Connection, payer: PublicKey, to: PublicKey, composerProgram: PublicKey, params: LzComposeParams, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<AccountMeta[]>;

type SupportedPrograms = 'endpoint' | 'simple_messagelib' | 'uln' | 'blocked_messagelib' | 'executor' | 'pricefeed' | 'dvn';
interface Deployment {
    name: SupportedPrograms;
    network: Network;
    address: string;
    compatibleVersions: string[];
    deployer: string;
}
declare function getProgramKeypair(network: Network | 'default', program: SupportedPrograms): PublicKey;
declare function getEndpointProgramId(network: Network | 'default'): PublicKey;
declare function getSimpleMessageLibProgramId(network: Network | 'default'): PublicKey;
declare function getULNProgramId(network: Network | 'default'): PublicKey;
declare function getDVNProgramId(network: Network | 'default'): PublicKey;
declare function getBlockedMessageLibProgramId(network: Network | 'default'): PublicKey;
declare function getExecutorProgramId(network: Network | 'default'): PublicKey;
declare function getPricefeedProgramId(network: Network | 'default'): PublicKey;

/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

/**
 * @category Instructions
 * @category Version
 * @category generated
 */
declare const versionStruct: beet.BeetArgsStruct<{
    instructionDiscriminator: number[];
}>;
declare const versionInstructionDiscriminator: number[];
/**
 * Creates a _Version_ instruction.
 *
 * @category Instructions
 * @category Version
 * @category generated
 */
declare function createVersionInstruction(programId: web3.PublicKey): web3.TransactionInstruction;
/**
 * Creates a _Version_ instructionAccounts.
 *
 * @category Instructions
 * @category Version
 * @category generated
 */
declare function createVersionInstructionAccounts(programId: web3.PublicKey): web3.AccountMeta[];

/**
 * Program address
 *
 * @category constants
 * @category generated
 */
declare const PROGRAM_ADDRESS = "2XrYqmhBMPJgDsb4SVbjV1PnJBprurd5bzRCkHwiFCJB";
/**
 * Program public key
 *
 * @category constants
 * @category generated
 */
declare const PROGRAM_ID: PublicKey;

declare const index_PROGRAM_ADDRESS: typeof PROGRAM_ADDRESS;
declare const index_PROGRAM_ID: typeof PROGRAM_ID;
declare const index_createVersionInstruction: typeof createVersionInstruction;
declare const index_createVersionInstructionAccounts: typeof createVersionInstructionAccounts;
declare const index_versionInstructionDiscriminator: typeof versionInstructionDiscriminator;
declare const index_versionStruct: typeof versionStruct;
declare namespace index {
  export { index_PROGRAM_ADDRESS as PROGRAM_ADDRESS, index_PROGRAM_ID as PROGRAM_ID, index_createVersionInstruction as createVersionInstruction, index_createVersionInstructionAccounts as createVersionInstructionAccounts, index_versionInstructionDiscriminator as versionInstructionDiscriminator, index_versionStruct as versionStruct };
}

declare class SendHelper {
    readonly endpointProgram: PublicKey;
    readonly ulnProgram: PublicKey;
    readonly simpleMsgLibProgram: PublicKey;
    private endpoint;
    private uln;
    private simpleMsgLib;
    private accounts;
    constructor(endpointProgram?: PublicKey, ulnProgram?: PublicKey, simpleMsgLibProgram?: PublicKey);
    private getMultipleAccountsInfo;
    getQuoteAccounts(connection: Connection, payer: PublicKey, sender: PublicKey, dstEid: number, receiver: string, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<AccountMeta[]>;
    /**
     * @param connection
     * @param payer
     * @param sender the PDA of the oApp
     * @param dstEid the destination endpoint id
     * @param receiver the remote peer's address
     * @param commitmentOrConfig
     * 1 or 3(1+2) RPC calls
     * */
    getSendAccounts(connection: Connection, payer: PublicKey, sender: PublicKey, dstEid: number, receiver: string, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<AccountMeta[]>;
    private getEndpointAccounts;
    private getSimpleMsgLibAccounts;
    private getUlnAccounts;
}

declare const IdlTypes: {
    endpoint: ({
        name: string;
        type: {
            kind: string;
            fields: {
                name: string;
                type: {
                    option: string;
                };
            }[];
            variants?: undefined;
        };
    } | {
        name: string;
        type: {
            kind: string;
            variants: {
                name: string;
            }[];
            fields?: undefined;
        };
    } | {
        name: string;
        type: {
            kind: string;
            fields: ({
                name: string;
                type: {
                    array: (string | number)[];
                    defined?: undefined;
                };
            } | {
                name: string;
                type: string;
            } | {
                name: string;
                type: {
                    defined: string;
                    array?: undefined;
                };
            })[];
            variants?: undefined;
        };
    } | {
        name: string;
        type: {
            kind: string;
            fields: ({
                name: string;
                type: string;
                index: boolean;
            } | {
                name: string;
                type: {
                    array: (string | number)[];
                };
                index: boolean;
            })[];
            variants?: undefined;
        };
    } | {
        name: string;
        type: {
            kind: string;
            fields: ({
                name: string;
                type: string;
                index: boolean;
            } | {
                name: string;
                type: {
                    option: {
                        defined: string;
                    };
                };
                index: boolean;
            })[];
            variants?: undefined;
        };
    } | {
        name: string;
        type: {
            kind: string;
            fields: {
                name: string;
                type: {
                    option: string;
                };
                index: boolean;
            }[];
            variants?: undefined;
        };
    })[];
};
declare enum SetConfigType {
    EXECUTOR = 1,
    SEND_ULN = 2,
    RECEIVE_ULN = 3
}
interface MessageLibInterface {
    program: PublicKey;
    getQuoteIXAccountMetaForCPI(connection: Connection, payer: PublicKey, path: PacketPath, commitment?: Commitment): Promise<AccountMeta[]>;
    getSendIXAccountMetaForCPI(connection: Connection, payer: PublicKey, path: PacketPath): Promise<AccountMeta[]>;
    getInitConfigIXAccountMetaForCPI(payer: PublicKey, oappID: PublicKey, eid: number): AccountMeta[];
    getSetConfigIXAccountMetaForCPI(endpointProgram: PublicKey, oappID: PublicKey, eid: number): Promise<AccountMeta[]>;
}

export { AddressType, BaseOApp, index as BlockedMessageLibProgram, COMPOSED_MESSAGE_HASH_SEED, CONFIRMATIONS_SEED, COUNT_SEED, DVNDeriver, dvn as DVNProgram, DVN_CONFIG_SEED, type Deployment, index$e as DvnProgram, ENDPOINT_SEED, ENFORCED_OPTIONS_SEED, EVENT_SEED, EXECUTOR_CONFIG_SEED, EndpointPDADeriver, endpoint as EndpointProgram, EventPDADeriver, ExecutorOptionType, ExecutorPDADeriver, executor as ExecutorProgram, FAUCET_URL, IdlTypes, LZ_COMPOSE_TYPES_SEED, LZ_RECEIVE_TYPES_SEED, type LzComposeParams, LzComposeParamsBeet, type LzReceiveAccount, LzReceiveAccountBeet, type LzReceiveParams, LzReceiveParamsBeet, MESSAGE_LIB_SEED, MINT_SEED, MSG_TYPE_OFFSET, MaxExecutorOptionTypeLength, type MessageLibInterface, MessageLibPDADeriver, MessageType, NONCE_SEED, OAPP_SEED, OAppBasePDADeriver, OPTIONS_SEED, PAYLOAD_HASH_SEED, PEER_SEED, PENDING_NONCE_SEED, PRICE_FEED_SEED, PriceFeedPDADeriver, pricefeed as PriceFeedProgram, RECEIVE_CONFIG_SEED, RECEIVE_LIBRARY_CONFIG_SEED, REMOTE_SEED, SEND_CONFIG_SEED, SEND_LIBRARY_CONFIG_SEED, SendHelper, SetConfigType, simpleMessageLib as SimpleMessageLibProgram, type SupportedPrograms, ULN_CONFIG_SEED, ULN_SEED, UlnPDADeriver, uln as UlnProgram, WORKER_SEED, buildMessageV0, buildVersionedTransaction, closeLookupTable, createNonceAccountTX, deactivateLookupTable, deriveLzComposeTypesAccountsPDA, deriveLzReceiveTypesAccountsPDA, extractComposeDeliveredEventByTxHash, extractComposeSentEventByTxHash, extractEventFromTransactionSignature, extractReceivedPacketEventByTxHash, extractSentPacketEventByTxHash, extractVerifiedPacketEventByTxHash, extractWorkerFeePaidEventByTxHash, generateAddressLookupTable, getBlockedMessageLibProgramId, getDVNProgramId, getEndpointProgramId, getExecutorProgramId, getLzComposeAccountMeta, getLzReceiveAccounts, getPricefeedProgramId, getProgramKeypair, getSimpleMessageLibProgramId, getULNProgramId, idlTypes, instructionDiscriminator, isAccountInitialized, lzCompose, lzReceive, messageLibs, oappIDPDA, simulateTransaction, txWithAddressLookupTable, txWithNonce };
