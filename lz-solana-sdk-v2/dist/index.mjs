// WOOFi Customized

import * as web314 from '@solana/web3.js';
import { PublicKey, TransactionInstruction, AddressLookupTableProgram, VersionedTransaction, TransactionMessage, Keypair, NONCE_ACCOUNT_LENGTH, Transaction, SystemProgram, NonceAccount } from '@solana/web3.js';
import BN from 'bn.js';
import { arrayify, hexZeroPad, hexlify } from '@ethersproject/bytes';
import { keccak256 } from '@ethersproject/keccak256';
import invariant4 from 'tiny-invariant';
import { getAddress } from '@ethersproject/address';
import base58 from 'bs58';
import '@ethersproject/abi';
import { BigNumber } from '@ethersproject/bignumber';
import '@ethersproject/solidity';
import * as beet159 from '@metaplex-foundation/beet';
import { uniformFixedSizeArray, u8, FixableBeetArgsStruct, u32, u64, bytes, u16, BeetArgsStruct, bool, array } from '@metaplex-foundation/beet';
import * as beetSolana85 from '@metaplex-foundation/beet-solana';
import * as splToken from '@solana/spl-token';
import { Environment, EndpointId } from '@layerzerolabs/lz-definitions';
import crypto from 'crypto';
import { sha256 } from '@ethersproject/sha2';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var ENDPOINT_SEED = "Endpoint";
var MESSAGE_LIB_SEED = "MessageLib";
var SEND_LIBRARY_CONFIG_SEED = "SendLibraryConfig";
var RECEIVE_LIBRARY_CONFIG_SEED = "ReceiveLibraryConfig";
var NONCE_SEED = "Nonce";
var PENDING_NONCE_SEED = "PendingNonce";
var PAYLOAD_HASH_SEED = "PayloadHash";
var COMPOSED_MESSAGE_HASH_SEED = "ComposedMessageHash";
var OAPP_SEED = "OApp";
var COUNT_SEED = "Count";
var REMOTE_SEED = "Remote";
var LZ_RECEIVE_TYPES_SEED = "LzReceiveTypes";
var LZ_COMPOSE_TYPES_SEED = "LzComposeTypes";
var ULN_SEED = MESSAGE_LIB_SEED;
var ULN_CONFIG_SEED = "UlnConfig";
var SEND_CONFIG_SEED = "SendConfig";
var RECEIVE_CONFIG_SEED = "ReceiveConfig";
var OPTIONS_SEED = "Options";
var CONFIRMATIONS_SEED = "Confirmations";
var WORKER_SEED = "Worker";
var DVN_CONFIG_SEED = "DvnConfig";
var EVENT_SEED = "__event_authority";
var EXECUTOR_CONFIG_SEED = "ExecutorConfig";
var PRICE_FEED_SEED = "PriceFeed";
var PEER_SEED = "Peer";
var MINT_SEED = "Mint";
var ENFORCED_OPTIONS_SEED = "EnforcedOptions";
var EndpointPDADeriver = class {
  constructor(program) {
    this.program = program;
  }
  setting() {
    return PublicKey.findProgramAddressSync([Buffer.from(ENDPOINT_SEED, "utf8")], this.program);
  }
  defaultSendLibraryConfig(dstEndpointId) {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from(SEND_LIBRARY_CONFIG_SEED, "utf8"),
        // U32 to Uint8Array([0,0,0,0])
        new BN(dstEndpointId).toArrayLike(Buffer, "be", 4)
      ],
      this.program
    );
  }
  sendLibraryConfig(sender, dstEndpointId) {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from(SEND_LIBRARY_CONFIG_SEED, "utf8"),
        sender.toBytes(),
        // U32 to Uint8Array([0,0,0,0])
        new BN(dstEndpointId).toArrayLike(Buffer, "be", 4)
      ],
      this.program
    );
  }
  /**
   * @param messageLibrary PDA(derive by message lib program)
   */
  messageLibraryInfo(messageLibrary) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(MESSAGE_LIB_SEED, "utf8"), messageLibrary.toBytes()],
      this.program
    );
  }
  defaultReceiveLibraryConfig(srcEndpointId) {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from(RECEIVE_LIBRARY_CONFIG_SEED, "utf8"),
        // U32 to Uint8Array([0,0,0,0])
        new BN(srcEndpointId).toArrayLike(Buffer, "be", 4)
      ],
      this.program
    );
  }
  receiveLibraryConfig(receiver, srcEndpointId) {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from(RECEIVE_LIBRARY_CONFIG_SEED, "utf8"),
        receiver.toBytes(),
        // U32 to Uint8Array([0,0,0,0])
        new BN(srcEndpointId).toArrayLike(Buffer, "be", 4)
      ],
      this.program
    );
  }
  receiveLibraryTimeout(_dstEndpointId) {
    return [this.program, 0];
  }
  defaultMessageLib() {
    return this.messageLibraryInfo(PublicKey.default);
  }
  blockMessageLib(blockMsgLib) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(MESSAGE_LIB_SEED, "utf8"), blockMsgLib.toBytes()],
      this.program
    );
  }
  /**
   * @param localOapp
   * @param remoteChainId
   * @param remoteOapp
   */
  nonce(localOapp, remoteChainId, remoteOapp) {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from(NONCE_SEED, "utf8"),
        localOapp.toBytes(),
        // U32 to Uint8Array([0,0,0,0])
        new BN(remoteChainId).toArrayLike(Buffer, "be", 4),
        remoteOapp
      ],
      this.program
    );
  }
  pendingNonce(localOapp, remoteChainId, remoteOapp) {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from(PENDING_NONCE_SEED, "utf8"),
        localOapp.toBytes(),
        new BN(remoteChainId).toArrayLike(Buffer, "be", 4),
        remoteOapp
      ],
      this.program
    );
  }
  oappRegistry(localOapp) {
    return PublicKey.findProgramAddressSync([Buffer.from(OAPP_SEED, "utf8"), localOapp.toBytes()], this.program);
  }
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
  payloadHash(receiver, srcEid, sender, nonce) {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from(PAYLOAD_HASH_SEED, "utf8"),
        receiver.toBytes(),
        new BN(srcEid).toArrayLike(Buffer, "be", 4),
        sender,
        new BN(nonce).toArrayLike(Buffer, "be", 8)
      ],
      this.program
    );
  }
  composedMessage(from, guid, index, to, messageHash) {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from(COMPOSED_MESSAGE_HASH_SEED, "utf8"),
        from.toBytes(),
        to.toBytes(),
        guid,
        new BN(index).toArrayLike(Buffer, "be", 2),
        messageHash
      ],
      this.program
    );
  }
};
var MessageLibPDADeriver = class {
  constructor(program) {
    this.program = program;
  }
  messageLib() {
    return PublicKey.findProgramAddressSync([Buffer.from(MESSAGE_LIB_SEED, "utf8")], this.program);
  }
  sendConfig(eid, oapp) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(SEND_CONFIG_SEED, "utf8"), new BN(eid).toArrayLike(Buffer, "be", 4), oapp.toBuffer()],
      this.program
    );
  }
  receiveConfig(eid, oapp) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(RECEIVE_CONFIG_SEED, "utf8"), new BN(eid).toArrayLike(Buffer, "be", 4), oapp.toBuffer()],
      this.program
    );
  }
};
var UlnPDADeriver = class extends MessageLibPDADeriver {
  setting() {
    return PublicKey.findProgramAddressSync([Buffer.from(ULN_SEED, "utf8")], this.program);
  }
  config(eid) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(ULN_CONFIG_SEED, "utf8"), new BN(eid).toArrayLike(Buffer, "be", 4)],
      this.program
    );
  }
  defaultSendConfig(eid) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(SEND_CONFIG_SEED, "utf8"), new BN(eid).toArrayLike(Buffer, "be", 4)],
      this.program
    );
  }
  defaultReceiveConfig(eid) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(RECEIVE_CONFIG_SEED, "utf8"), new BN(eid).toArrayLike(Buffer, "be", 4)],
      this.program
    );
  }
  options(eit) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(OPTIONS_SEED, "utf8"), new BN(eit).toArrayLike(Buffer, "be", 4)],
      this.program
    );
  }
  workerConfig(worker) {
    return PublicKey.findProgramAddressSync([Buffer.from(WORKER_SEED, "utf8"), worker.toBuffer()], this.program);
  }
  confirmations(headerHash, payloadHash, dvn) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(CONFIRMATIONS_SEED, "utf8"), headerHash, payloadHash, dvn.toBytes()],
      this.program
    );
  }
};
var OAppBasePDADeriver = class {
  constructor(program) {
    this.program = program;
  }
  remote(dstChainId) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(REMOTE_SEED), new BN(dstChainId).toArrayLike(Buffer, "be", 4)],
      this.program
    );
  }
  lzReceiveTypesAccounts() {
    return PublicKey.findProgramAddressSync([Buffer.from(LZ_RECEIVE_TYPES_SEED, "utf8")], this.program);
  }
  lzComposeTypesAccounts() {
    return PublicKey.findProgramAddressSync([Buffer.from(LZ_COMPOSE_TYPES_SEED, "utf8")], this.program);
  }
};
var DVNDeriver = class {
  constructor(program) {
    this.program = program;
  }
  authority() {
    return PublicKey.findProgramAddressSync([Buffer.from("dvn", "utf8")], this.program);
  }
  config() {
    return PublicKey.findProgramAddressSync([Buffer.from(DVN_CONFIG_SEED, "utf8")], this.program);
  }
  executeHash(digestHash) {
    return PublicKey.findProgramAddressSync([Buffer.from("ExecuteHash", "utf8"), digestHash], this.program);
  }
};
var EventPDADeriver = class {
  constructor(program) {
    this.program = program;
  }
  eventAuthority() {
    return PublicKey.findProgramAddressSync([Buffer.from(EVENT_SEED, "utf8")], this.program);
  }
};
var ExecutorPDADeriver = class {
  constructor(program) {
    this.program = program;
  }
  config() {
    return PublicKey.findProgramAddressSync([Buffer.from(EXECUTOR_CONFIG_SEED, "utf8")], this.program);
  }
};
var PriceFeedPDADeriver = class {
  constructor(program) {
    this.program = program;
  }
  priceFeed() {
    return PublicKey.findProgramAddressSync([Buffer.from(PRICE_FEED_SEED, "utf8")], this.program);
  }
};

// src/endpoint.ts
var endpoint_exports = {};
__export(endpoint_exports, {
  DefaultMessageLib: () => DefaultMessageLib,
  Endpoint: () => Endpoint,
  EventEmitDiscriminator: () => EventEmitDiscriminator,
  PROGRAM_ID: () => PROGRAM_ID,
  accounts: () => accounts_exports,
  errors: () => errors_exports,
  events: () => events_exports,
  instructions: () => instructions_exports,
  types: () => types_exports
});
function hexZeroPadTo32(addr) {
  return hexZeroPad(addr, 32);
}
function bytes32ToEthAddress(bytes322) {
  if (bytes322 instanceof Uint8Array) {
    bytes322 = hexlify(bytes322);
  }
  return getAddress(bytes322.slice(-40));
}
function trim0x(str) {
  return str.replace(/^0x/, "");
}
function addressToBytes32(address) {
  if (isSolanaAddress(address)) {
    return base58.decode(address);
  } else if (address.startsWith("0x") && address.length <= 66) {
    return arrayify(hexZeroPadTo32(address));
  }
  throw new Error("Invalid address");
}
var solanaAddressRegex = /^([1-9A-HJ-NP-Za-km-z]{32,44})$/;
function isSolanaAddress(address) {
  return solanaAddressRegex.test(address);
}
BigNumber.from("0xffffffffffffffffffffffffffffffff");
var PACKET_VERSION_OFFSET = 0;
var NONCE_OFFSET = 1;
var SRC_CHAIN_OFFSET = 9;
var SRC_ADDRESS_OFFSET = 13;
var DST_CHAIN_OFFSET = 45;
var DST_ADDRESS_OFFSET = 49;
var GUID_OFFSET = 81;
var MESSAGE_OFFSET = 113;
var PacketV1Codec = class _PacketV1Codec {
  constructor(payloadEncoded) {
    __publicField(this, "buffer");
    this.buffer = Buffer.from(trim0x(payloadEncoded), "hex");
  }
  static from(payloadEncoded) {
    return new _PacketV1Codec(payloadEncoded);
  }
  static fromBytes(payload) {
    return new _PacketV1Codec("0x" + Buffer.from(payload).toString("hex"));
  }
  /**
   * encode packet to hex string
   */
  static encode(packet) {
    const buff = this.encodeBytes(packet);
    return "0x" + Buffer.from(buff).toString("hex");
  }
  /**
   * encode packet to Uint8Array
   * @param packet
   */
  static encodeBytes(packet) {
    const message = trim0x(packet.message);
    const buffer = Buffer.alloc(MESSAGE_OFFSET + message.length / 2);
    buffer.writeUInt8(packet.version, PACKET_VERSION_OFFSET);
    buffer.writeBigUInt64BE(BigInt(packet.nonce), NONCE_OFFSET);
    buffer.writeUInt32BE(packet.srcEid, SRC_CHAIN_OFFSET);
    buffer.write(Buffer.from(addressToBytes32(packet.sender)).toString("hex"), SRC_ADDRESS_OFFSET, 32, "hex");
    buffer.writeUInt32BE(packet.dstEid, DST_CHAIN_OFFSET);
    buffer.write(Buffer.from(addressToBytes32(packet.receiver)).toString("hex"), DST_ADDRESS_OFFSET, 32, "hex");
    buffer.write(trim0x(packet.guid), GUID_OFFSET, 32, "hex");
    buffer.write(message, MESSAGE_OFFSET, message.length / 2, "hex");
    return new Uint8Array(buffer);
  }
  version() {
    return this.buffer.readUInt8(PACKET_VERSION_OFFSET);
  }
  nonce() {
    return this.buffer.readBigUint64BE(NONCE_OFFSET).toString();
  }
  srcEid() {
    return this.buffer.readUint32BE(SRC_CHAIN_OFFSET);
  }
  sender() {
    return "0x" + this.buffer.slice(SRC_ADDRESS_OFFSET, DST_CHAIN_OFFSET).toString("hex");
  }
  senderAddressB20() {
    return bytes32ToEthAddress(this.sender());
  }
  dstEid() {
    return this.buffer.readUint32BE(DST_CHAIN_OFFSET);
  }
  receiver() {
    return "0x" + this.buffer.slice(DST_ADDRESS_OFFSET, GUID_OFFSET).toString("hex");
  }
  receiverAddressB20() {
    return bytes32ToEthAddress(this.receiver());
  }
  guid() {
    return "0x" + this.buffer.slice(GUID_OFFSET, MESSAGE_OFFSET).toString("hex");
  }
  message() {
    return "0x" + this.buffer.slice(MESSAGE_OFFSET).toString("hex");
  }
  payloadHash() {
    return keccak256(this.payload());
  }
  payload() {
    return "0x" + this.buffer.slice(GUID_OFFSET).toString("hex");
  }
  header() {
    return "0x" + this.buffer.slice(0, GUID_OFFSET).toString("hex");
  }
  headerHash() {
    return keccak256(this.header());
  }
  /**
   * deserialize packet from hex string
   * @deprecated use toPacket instead
   */
  decode() {
    return this.toPacket();
  }
  toPacket() {
    return {
      version: this.version(),
      nonce: this.nonce(),
      srcEid: this.srcEid(),
      sender: this.sender(),
      dstEid: this.dstEid(),
      receiver: this.receiver(),
      guid: this.guid(),
      message: this.message(),
      // derived
      payload: this.payload()
    };
  }
};

// src/generated/endpoint/accounts/index.ts
var accounts_exports = {};
__export(accounts_exports, {
  ComposeMessageState: () => ComposeMessageState,
  EndpointSettings: () => EndpointSettings,
  MessageLibInfo: () => MessageLibInfo,
  Nonce: () => Nonce,
  OAppRegistry: () => OAppRegistry,
  PayloadHash: () => PayloadHash,
  PendingInboundNonce: () => PendingInboundNonce,
  ReceiveLibraryConfig: () => ReceiveLibraryConfig,
  SendLibraryConfig: () => SendLibraryConfig,
  accountProviders: () => accountProviders,
  composeMessageStateBeet: () => composeMessageStateBeet,
  composeMessageStateDiscriminator: () => composeMessageStateDiscriminator,
  endpointSettingsBeet: () => endpointSettingsBeet,
  endpointSettingsDiscriminator: () => endpointSettingsDiscriminator,
  messageLibInfoBeet: () => messageLibInfoBeet,
  messageLibInfoDiscriminator: () => messageLibInfoDiscriminator,
  nonceBeet: () => nonceBeet,
  nonceDiscriminator: () => nonceDiscriminator,
  oAppRegistryBeet: () => oAppRegistryBeet,
  oAppRegistryDiscriminator: () => oAppRegistryDiscriminator,
  payloadHashBeet: () => payloadHashBeet,
  payloadHashDiscriminator: () => payloadHashDiscriminator,
  pendingInboundNonceBeet: () => pendingInboundNonceBeet,
  pendingInboundNonceDiscriminator: () => pendingInboundNonceDiscriminator,
  receiveLibraryConfigBeet: () => receiveLibraryConfigBeet,
  receiveLibraryConfigDiscriminator: () => receiveLibraryConfigDiscriminator,
  sendLibraryConfigBeet: () => sendLibraryConfigBeet,
  sendLibraryConfigDiscriminator: () => sendLibraryConfigDiscriminator
});
var composeMessageStateDiscriminator = [
  55,
  107,
  79,
  254,
  243,
  22,
  172,
  240
];
var ComposeMessageState = class _ComposeMessageState {
  constructor(received, bump) {
    this.received = received;
    this.bump = bump;
  }
  /**
   * Creates a {@link ComposeMessageState} instance from the provided args.
   */
  static fromArgs(args) {
    return new _ComposeMessageState(args.received, args.bump);
  }
  /**
   * Deserializes the {@link ComposeMessageState} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(accountInfo, offset = 0) {
    return _ComposeMessageState.deserialize(accountInfo.data, offset);
  }
  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link ComposeMessageState} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(connection, address, commitmentOrConfig) {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    );
    if (accountInfo == null) {
      throw new Error(
        `Unable to find ComposeMessageState account at ${address}`
      );
    }
    return _ComposeMessageState.fromAccountInfo(accountInfo, 0)[0];
  }
  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(programId = new web314.PublicKey(
    "76y77prsiCMvXMjuoZ5VRrhG5qYBrUMYTE5WgHqgjEn6"
  )) {
    return beetSolana85.GpaBuilder.fromStruct(programId, composeMessageStateBeet);
  }
  /**
   * Deserializes the {@link ComposeMessageState} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf, offset = 0) {
    return composeMessageStateBeet.deserialize(buf, offset);
  }
  /**
   * Serializes the {@link ComposeMessageState} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize() {
    return composeMessageStateBeet.serialize({
      accountDiscriminator: composeMessageStateDiscriminator,
      ...this
    });
  }
  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link ComposeMessageState}
   */
  static get byteSize() {
    return composeMessageStateBeet.byteSize;
  }
  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link ComposeMessageState} data from rent
   *
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(connection, commitment) {
    return connection.getMinimumBalanceForRentExemption(
      _ComposeMessageState.byteSize,
      commitment
    );
  }
  /**
   * Determines if the provided {@link Buffer} has the correct byte size to
   * hold {@link ComposeMessageState} data.
   */
  static hasCorrectByteSize(buf, offset = 0) {
    return buf.byteLength - offset === _ComposeMessageState.byteSize;
  }
  /**
   * Returns a readable version of {@link ComposeMessageState} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      received: this.received,
      bump: this.bump
    };
  }
};
var composeMessageStateBeet = new beet159.BeetStruct(
  [
    ["accountDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["received", beet159.bool],
    ["bump", beet159.u8]
  ],
  ComposeMessageState.fromArgs,
  "ComposeMessageState"
);
var endpointSettingsDiscriminator = [221, 232, 73, 56, 10, 66, 72, 14];
var EndpointSettings = class _EndpointSettings {
  constructor(eid, bump, admin, lzTokenMint) {
    this.eid = eid;
    this.bump = bump;
    this.admin = admin;
    this.lzTokenMint = lzTokenMint;
  }
  /**
   * Creates a {@link EndpointSettings} instance from the provided args.
   */
  static fromArgs(args) {
    return new _EndpointSettings(
      args.eid,
      args.bump,
      args.admin,
      args.lzTokenMint
    );
  }
  /**
   * Deserializes the {@link EndpointSettings} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(accountInfo, offset = 0) {
    return _EndpointSettings.deserialize(accountInfo.data, offset);
  }
  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link EndpointSettings} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(connection, address, commitmentOrConfig) {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    );
    if (accountInfo == null) {
      throw new Error(`Unable to find EndpointSettings account at ${address}`);
    }
    return _EndpointSettings.fromAccountInfo(accountInfo, 0)[0];
  }
  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(programId = new web314.PublicKey(
    "76y77prsiCMvXMjuoZ5VRrhG5qYBrUMYTE5WgHqgjEn6"
  )) {
    return beetSolana85.GpaBuilder.fromStruct(programId, endpointSettingsBeet);
  }
  /**
   * Deserializes the {@link EndpointSettings} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf, offset = 0) {
    return endpointSettingsBeet.deserialize(buf, offset);
  }
  /**
   * Serializes the {@link EndpointSettings} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize() {
    return endpointSettingsBeet.serialize({
      accountDiscriminator: endpointSettingsDiscriminator,
      ...this
    });
  }
  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link EndpointSettings} for the provided args.
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   */
  static byteSize(args) {
    const instance = _EndpointSettings.fromArgs(args);
    return endpointSettingsBeet.toFixedFromValue({
      accountDiscriminator: endpointSettingsDiscriminator,
      ...instance
    }).byteSize;
  }
  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link EndpointSettings} data from rent
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(args, connection, commitment) {
    return connection.getMinimumBalanceForRentExemption(
      _EndpointSettings.byteSize(args),
      commitment
    );
  }
  /**
   * Returns a readable version of {@link EndpointSettings} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      eid: this.eid,
      bump: this.bump,
      admin: this.admin.toBase58(),
      lzTokenMint: this.lzTokenMint
    };
  }
};
var endpointSettingsBeet = new beet159.FixableBeetStruct(
  [
    ["accountDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["eid", beet159.u32],
    ["bump", beet159.u8],
    ["admin", beetSolana85.publicKey],
    ["lzTokenMint", beet159.coption(beetSolana85.publicKey)]
  ],
  EndpointSettings.fromArgs,
  "EndpointSettings"
);
var MessageLibType = /* @__PURE__ */ ((MessageLibType3) => {
  MessageLibType3[MessageLibType3["Send"] = 0] = "Send";
  MessageLibType3[MessageLibType3["Receive"] = 1] = "Receive";
  MessageLibType3[MessageLibType3["SendAndReceive"] = 2] = "SendAndReceive";
  return MessageLibType3;
})(MessageLibType || {});
var messageLibTypeBeet = beet159.fixedScalarEnum(
  MessageLibType
);

// src/generated/endpoint/accounts/MessageLibInfo.ts
var messageLibInfoDiscriminator = [103, 102, 218, 28, 204, 135, 71, 14];
var MessageLibInfo = class _MessageLibInfo {
  constructor(messageLibType, bump, messageLibBump) {
    this.messageLibType = messageLibType;
    this.bump = bump;
    this.messageLibBump = messageLibBump;
  }
  /**
   * Creates a {@link MessageLibInfo} instance from the provided args.
   */
  static fromArgs(args) {
    return new _MessageLibInfo(
      args.messageLibType,
      args.bump,
      args.messageLibBump
    );
  }
  /**
   * Deserializes the {@link MessageLibInfo} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(accountInfo, offset = 0) {
    return _MessageLibInfo.deserialize(accountInfo.data, offset);
  }
  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link MessageLibInfo} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(connection, address, commitmentOrConfig) {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    );
    if (accountInfo == null) {
      throw new Error(`Unable to find MessageLibInfo account at ${address}`);
    }
    return _MessageLibInfo.fromAccountInfo(accountInfo, 0)[0];
  }
  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(programId = new web314.PublicKey(
    "76y77prsiCMvXMjuoZ5VRrhG5qYBrUMYTE5WgHqgjEn6"
  )) {
    return beetSolana85.GpaBuilder.fromStruct(programId, messageLibInfoBeet);
  }
  /**
   * Deserializes the {@link MessageLibInfo} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf, offset = 0) {
    return messageLibInfoBeet.deserialize(buf, offset);
  }
  /**
   * Serializes the {@link MessageLibInfo} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize() {
    return messageLibInfoBeet.serialize({
      accountDiscriminator: messageLibInfoDiscriminator,
      ...this
    });
  }
  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link MessageLibInfo}
   */
  static get byteSize() {
    return messageLibInfoBeet.byteSize;
  }
  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link MessageLibInfo} data from rent
   *
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(connection, commitment) {
    return connection.getMinimumBalanceForRentExemption(
      _MessageLibInfo.byteSize,
      commitment
    );
  }
  /**
   * Determines if the provided {@link Buffer} has the correct byte size to
   * hold {@link MessageLibInfo} data.
   */
  static hasCorrectByteSize(buf, offset = 0) {
    return buf.byteLength - offset === _MessageLibInfo.byteSize;
  }
  /**
   * Returns a readable version of {@link MessageLibInfo} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      messageLibType: "MessageLibType." + MessageLibType[this.messageLibType],
      bump: this.bump,
      messageLibBump: this.messageLibBump
    };
  }
};
var messageLibInfoBeet = new beet159.BeetStruct(
  [
    ["accountDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["messageLibType", messageLibTypeBeet],
    ["bump", beet159.u8],
    ["messageLibBump", beet159.u8]
  ],
  MessageLibInfo.fromArgs,
  "MessageLibInfo"
);
var nonceDiscriminator = [143, 197, 147, 95, 106, 165, 50, 43];
var Nonce = class _Nonce {
  constructor(bump, outboundNonce, inboundNonce) {
    this.bump = bump;
    this.outboundNonce = outboundNonce;
    this.inboundNonce = inboundNonce;
  }
  /**
   * Creates a {@link Nonce} instance from the provided args.
   */
  static fromArgs(args) {
    return new _Nonce(args.bump, args.outboundNonce, args.inboundNonce);
  }
  /**
   * Deserializes the {@link Nonce} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(accountInfo, offset = 0) {
    return _Nonce.deserialize(accountInfo.data, offset);
  }
  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link Nonce} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(connection, address, commitmentOrConfig) {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    );
    if (accountInfo == null) {
      throw new Error(`Unable to find Nonce account at ${address}`);
    }
    return _Nonce.fromAccountInfo(accountInfo, 0)[0];
  }
  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(programId = new web314.PublicKey(
    "76y77prsiCMvXMjuoZ5VRrhG5qYBrUMYTE5WgHqgjEn6"
  )) {
    return beetSolana85.GpaBuilder.fromStruct(programId, nonceBeet);
  }
  /**
   * Deserializes the {@link Nonce} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf, offset = 0) {
    return nonceBeet.deserialize(buf, offset);
  }
  /**
   * Serializes the {@link Nonce} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize() {
    return nonceBeet.serialize({
      accountDiscriminator: nonceDiscriminator,
      ...this
    });
  }
  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link Nonce}
   */
  static get byteSize() {
    return nonceBeet.byteSize;
  }
  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link Nonce} data from rent
   *
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(connection, commitment) {
    return connection.getMinimumBalanceForRentExemption(
      _Nonce.byteSize,
      commitment
    );
  }
  /**
   * Determines if the provided {@link Buffer} has the correct byte size to
   * hold {@link Nonce} data.
   */
  static hasCorrectByteSize(buf, offset = 0) {
    return buf.byteLength - offset === _Nonce.byteSize;
  }
  /**
   * Returns a readable version of {@link Nonce} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      bump: this.bump,
      outboundNonce: (() => {
        const x = this.outboundNonce;
        if (typeof x.toNumber === "function") {
          try {
            return x.toNumber();
          } catch (_) {
            return x;
          }
        }
        return x;
      })(),
      inboundNonce: (() => {
        const x = this.inboundNonce;
        if (typeof x.toNumber === "function") {
          try {
            return x.toNumber();
          } catch (_) {
            return x;
          }
        }
        return x;
      })()
    };
  }
};
var nonceBeet = new beet159.BeetStruct(
  [
    ["accountDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["bump", beet159.u8],
    ["outboundNonce", beet159.u64],
    ["inboundNonce", beet159.u64]
  ],
  Nonce.fromArgs,
  "Nonce"
);
var oAppRegistryDiscriminator = [6, 152, 199, 30, 217, 50, 69, 149];
var OAppRegistry = class _OAppRegistry {
  constructor(delegate, bump) {
    this.delegate = delegate;
    this.bump = bump;
  }
  /**
   * Creates a {@link OAppRegistry} instance from the provided args.
   */
  static fromArgs(args) {
    return new _OAppRegistry(args.delegate, args.bump);
  }
  /**
   * Deserializes the {@link OAppRegistry} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(accountInfo, offset = 0) {
    return _OAppRegistry.deserialize(accountInfo.data, offset);
  }
  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link OAppRegistry} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(connection, address, commitmentOrConfig) {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    );
    if (accountInfo == null) {
      throw new Error(`Unable to find OAppRegistry account at ${address}`);
    }
    return _OAppRegistry.fromAccountInfo(accountInfo, 0)[0];
  }
  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(programId = new web314.PublicKey(
    "76y77prsiCMvXMjuoZ5VRrhG5qYBrUMYTE5WgHqgjEn6"
  )) {
    return beetSolana85.GpaBuilder.fromStruct(programId, oAppRegistryBeet);
  }
  /**
   * Deserializes the {@link OAppRegistry} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf, offset = 0) {
    return oAppRegistryBeet.deserialize(buf, offset);
  }
  /**
   * Serializes the {@link OAppRegistry} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize() {
    return oAppRegistryBeet.serialize({
      accountDiscriminator: oAppRegistryDiscriminator,
      ...this
    });
  }
  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link OAppRegistry}
   */
  static get byteSize() {
    return oAppRegistryBeet.byteSize;
  }
  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link OAppRegistry} data from rent
   *
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(connection, commitment) {
    return connection.getMinimumBalanceForRentExemption(
      _OAppRegistry.byteSize,
      commitment
    );
  }
  /**
   * Determines if the provided {@link Buffer} has the correct byte size to
   * hold {@link OAppRegistry} data.
   */
  static hasCorrectByteSize(buf, offset = 0) {
    return buf.byteLength - offset === _OAppRegistry.byteSize;
  }
  /**
   * Returns a readable version of {@link OAppRegistry} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      delegate: this.delegate.toBase58(),
      bump: this.bump
    };
  }
};
var oAppRegistryBeet = new beet159.BeetStruct(
  [
    ["accountDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["delegate", beetSolana85.publicKey],
    ["bump", beet159.u8]
  ],
  OAppRegistry.fromArgs,
  "OAppRegistry"
);
var payloadHashDiscriminator = [96, 28, 106, 145, 103, 32, 186, 70];
var PayloadHash = class _PayloadHash {
  constructor(hash, bump) {
    this.hash = hash;
    this.bump = bump;
  }
  /**
   * Creates a {@link PayloadHash} instance from the provided args.
   */
  static fromArgs(args) {
    return new _PayloadHash(args.hash, args.bump);
  }
  /**
   * Deserializes the {@link PayloadHash} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(accountInfo, offset = 0) {
    return _PayloadHash.deserialize(accountInfo.data, offset);
  }
  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link PayloadHash} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(connection, address, commitmentOrConfig) {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    );
    if (accountInfo == null) {
      throw new Error(`Unable to find PayloadHash account at ${address}`);
    }
    return _PayloadHash.fromAccountInfo(accountInfo, 0)[0];
  }
  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(programId = new web314.PublicKey(
    "76y77prsiCMvXMjuoZ5VRrhG5qYBrUMYTE5WgHqgjEn6"
  )) {
    return beetSolana85.GpaBuilder.fromStruct(programId, payloadHashBeet);
  }
  /**
   * Deserializes the {@link PayloadHash} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf, offset = 0) {
    return payloadHashBeet.deserialize(buf, offset);
  }
  /**
   * Serializes the {@link PayloadHash} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize() {
    return payloadHashBeet.serialize({
      accountDiscriminator: payloadHashDiscriminator,
      ...this
    });
  }
  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link PayloadHash}
   */
  static get byteSize() {
    return payloadHashBeet.byteSize;
  }
  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link PayloadHash} data from rent
   *
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(connection, commitment) {
    return connection.getMinimumBalanceForRentExemption(
      _PayloadHash.byteSize,
      commitment
    );
  }
  /**
   * Determines if the provided {@link Buffer} has the correct byte size to
   * hold {@link PayloadHash} data.
   */
  static hasCorrectByteSize(buf, offset = 0) {
    return buf.byteLength - offset === _PayloadHash.byteSize;
  }
  /**
   * Returns a readable version of {@link PayloadHash} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      hash: this.hash,
      bump: this.bump
    };
  }
};
var payloadHashBeet = new beet159.BeetStruct(
  [
    ["accountDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["hash", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["bump", beet159.u8]
  ],
  PayloadHash.fromArgs,
  "PayloadHash"
);
var pendingInboundNonceDiscriminator = [
  170,
  176,
  95,
  240,
  120,
  231,
  241,
  218
];
var PendingInboundNonce = class _PendingInboundNonce {
  constructor(nonces, bump) {
    this.nonces = nonces;
    this.bump = bump;
  }
  /**
   * Creates a {@link PendingInboundNonce} instance from the provided args.
   */
  static fromArgs(args) {
    return new _PendingInboundNonce(args.nonces, args.bump);
  }
  /**
   * Deserializes the {@link PendingInboundNonce} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(accountInfo, offset = 0) {
    return _PendingInboundNonce.deserialize(accountInfo.data, offset);
  }
  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link PendingInboundNonce} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(connection, address, commitmentOrConfig) {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    );
    if (accountInfo == null) {
      throw new Error(
        `Unable to find PendingInboundNonce account at ${address}`
      );
    }
    return _PendingInboundNonce.fromAccountInfo(accountInfo, 0)[0];
  }
  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(programId = new web314.PublicKey(
    "76y77prsiCMvXMjuoZ5VRrhG5qYBrUMYTE5WgHqgjEn6"
  )) {
    return beetSolana85.GpaBuilder.fromStruct(programId, pendingInboundNonceBeet);
  }
  /**
   * Deserializes the {@link PendingInboundNonce} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf, offset = 0) {
    return pendingInboundNonceBeet.deserialize(buf, offset);
  }
  /**
   * Serializes the {@link PendingInboundNonce} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize() {
    return pendingInboundNonceBeet.serialize({
      accountDiscriminator: pendingInboundNonceDiscriminator,
      ...this
    });
  }
  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link PendingInboundNonce} for the provided args.
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   */
  static byteSize(args) {
    const instance = _PendingInboundNonce.fromArgs(args);
    return pendingInboundNonceBeet.toFixedFromValue({
      accountDiscriminator: pendingInboundNonceDiscriminator,
      ...instance
    }).byteSize;
  }
  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link PendingInboundNonce} data from rent
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(args, connection, commitment) {
    return connection.getMinimumBalanceForRentExemption(
      _PendingInboundNonce.byteSize(args),
      commitment
    );
  }
  /**
   * Returns a readable version of {@link PendingInboundNonce} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      nonces: this.nonces,
      bump: this.bump
    };
  }
};
var pendingInboundNonceBeet = new beet159.FixableBeetStruct(
  [
    ["accountDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["nonces", beet159.array(beet159.u64)],
    ["bump", beet159.u8]
  ],
  PendingInboundNonce.fromArgs,
  "PendingInboundNonce"
);
var receiveLibraryTimeoutBeet = new beet159.BeetArgsStruct(
  [
    ["messageLib", beetSolana85.publicKey],
    ["expiry", beet159.u64]
  ],
  "ReceiveLibraryTimeout"
);

// src/generated/endpoint/accounts/ReceiveLibraryConfig.ts
var receiveLibraryConfigDiscriminator = [
  142,
  226,
  251,
  138,
  1,
  206,
  91,
  193
];
var ReceiveLibraryConfig = class _ReceiveLibraryConfig {
  constructor(messageLib, timeout, bump) {
    this.messageLib = messageLib;
    this.timeout = timeout;
    this.bump = bump;
  }
  /**
   * Creates a {@link ReceiveLibraryConfig} instance from the provided args.
   */
  static fromArgs(args) {
    return new _ReceiveLibraryConfig(args.messageLib, args.timeout, args.bump);
  }
  /**
   * Deserializes the {@link ReceiveLibraryConfig} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(accountInfo, offset = 0) {
    return _ReceiveLibraryConfig.deserialize(accountInfo.data, offset);
  }
  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link ReceiveLibraryConfig} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(connection, address, commitmentOrConfig) {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    );
    if (accountInfo == null) {
      throw new Error(
        `Unable to find ReceiveLibraryConfig account at ${address}`
      );
    }
    return _ReceiveLibraryConfig.fromAccountInfo(accountInfo, 0)[0];
  }
  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(programId = new web314.PublicKey(
    "76y77prsiCMvXMjuoZ5VRrhG5qYBrUMYTE5WgHqgjEn6"
  )) {
    return beetSolana85.GpaBuilder.fromStruct(programId, receiveLibraryConfigBeet);
  }
  /**
   * Deserializes the {@link ReceiveLibraryConfig} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf, offset = 0) {
    return receiveLibraryConfigBeet.deserialize(buf, offset);
  }
  /**
   * Serializes the {@link ReceiveLibraryConfig} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize() {
    return receiveLibraryConfigBeet.serialize({
      accountDiscriminator: receiveLibraryConfigDiscriminator,
      ...this
    });
  }
  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link ReceiveLibraryConfig} for the provided args.
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   */
  static byteSize(args) {
    const instance = _ReceiveLibraryConfig.fromArgs(args);
    return receiveLibraryConfigBeet.toFixedFromValue({
      accountDiscriminator: receiveLibraryConfigDiscriminator,
      ...instance
    }).byteSize;
  }
  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link ReceiveLibraryConfig} data from rent
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(args, connection, commitment) {
    return connection.getMinimumBalanceForRentExemption(
      _ReceiveLibraryConfig.byteSize(args),
      commitment
    );
  }
  /**
   * Returns a readable version of {@link ReceiveLibraryConfig} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      messageLib: this.messageLib.toBase58(),
      timeout: this.timeout,
      bump: this.bump
    };
  }
};
var receiveLibraryConfigBeet = new beet159.FixableBeetStruct(
  [
    ["accountDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["messageLib", beetSolana85.publicKey],
    ["timeout", beet159.coption(receiveLibraryTimeoutBeet)],
    ["bump", beet159.u8]
  ],
  ReceiveLibraryConfig.fromArgs,
  "ReceiveLibraryConfig"
);
var sendLibraryConfigDiscriminator = [
  61,
  238,
  31,
  72,
  251,
  117,
  66,
  176
];
var SendLibraryConfig = class _SendLibraryConfig {
  constructor(messageLib, bump) {
    this.messageLib = messageLib;
    this.bump = bump;
  }
  /**
   * Creates a {@link SendLibraryConfig} instance from the provided args.
   */
  static fromArgs(args) {
    return new _SendLibraryConfig(args.messageLib, args.bump);
  }
  /**
   * Deserializes the {@link SendLibraryConfig} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(accountInfo, offset = 0) {
    return _SendLibraryConfig.deserialize(accountInfo.data, offset);
  }
  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link SendLibraryConfig} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(connection, address, commitmentOrConfig) {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    );
    if (accountInfo == null) {
      throw new Error(`Unable to find SendLibraryConfig account at ${address}`);
    }
    return _SendLibraryConfig.fromAccountInfo(accountInfo, 0)[0];
  }
  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(programId = new web314.PublicKey(
    "76y77prsiCMvXMjuoZ5VRrhG5qYBrUMYTE5WgHqgjEn6"
  )) {
    return beetSolana85.GpaBuilder.fromStruct(programId, sendLibraryConfigBeet);
  }
  /**
   * Deserializes the {@link SendLibraryConfig} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf, offset = 0) {
    return sendLibraryConfigBeet.deserialize(buf, offset);
  }
  /**
   * Serializes the {@link SendLibraryConfig} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize() {
    return sendLibraryConfigBeet.serialize({
      accountDiscriminator: sendLibraryConfigDiscriminator,
      ...this
    });
  }
  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link SendLibraryConfig}
   */
  static get byteSize() {
    return sendLibraryConfigBeet.byteSize;
  }
  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link SendLibraryConfig} data from rent
   *
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(connection, commitment) {
    return connection.getMinimumBalanceForRentExemption(
      _SendLibraryConfig.byteSize,
      commitment
    );
  }
  /**
   * Determines if the provided {@link Buffer} has the correct byte size to
   * hold {@link SendLibraryConfig} data.
   */
  static hasCorrectByteSize(buf, offset = 0) {
    return buf.byteLength - offset === _SendLibraryConfig.byteSize;
  }
  /**
   * Returns a readable version of {@link SendLibraryConfig} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      messageLib: this.messageLib.toBase58(),
      bump: this.bump
    };
  }
};
var sendLibraryConfigBeet = new beet159.BeetStruct(
  [
    ["accountDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["messageLib", beetSolana85.publicKey],
    ["bump", beet159.u8]
  ],
  SendLibraryConfig.fromArgs,
  "SendLibraryConfig"
);

// src/generated/endpoint/accounts/index.ts
var accountProviders = {
  ComposeMessageState,
  EndpointSettings,
  OAppRegistry,
  MessageLibInfo,
  ReceiveLibraryConfig,
  SendLibraryConfig,
  Nonce,
  PayloadHash,
  PendingInboundNonce
};

// src/generated/endpoint/errors/index.ts
var errors_exports = {};
__export(errors_exports, {
  AccountNotFoundError: () => AccountNotFoundError,
  ComposeNotFoundError: () => ComposeNotFoundError,
  InvalidAmountError: () => InvalidAmountError,
  InvalidExpiryError: () => InvalidExpiryError,
  InvalidMessageLibError: () => InvalidMessageLibError,
  InvalidNonceError: () => InvalidNonceError,
  InvalidPayloadHashError: () => InvalidPayloadHashError,
  InvalidReceiveLibraryError: () => InvalidReceiveLibraryError,
  InvalidSendLibraryError: () => InvalidSendLibraryError,
  LzTokenUnavailableError: () => LzTokenUnavailableError,
  OnlyNonDefaultLibError: () => OnlyNonDefaultLibError,
  OnlyReceiveLibError: () => OnlyReceiveLibError,
  OnlySendLibError: () => OnlySendLibError,
  PayloadHashNotFoundError: () => PayloadHashNotFoundError,
  ReadOnlyAccountError: () => ReadOnlyAccountError,
  SameValueError: () => SameValueError,
  UnauthorizedError: () => UnauthorizedError,
  WritableAccountNotAllowedError: () => WritableAccountNotAllowedError,
  errorFromCode: () => errorFromCode,
  errorFromName: () => errorFromName
});
var createErrorFromCodeLookup = /* @__PURE__ */ new Map();
var createErrorFromNameLookup = /* @__PURE__ */ new Map();
var InvalidSendLibraryError = class _InvalidSendLibraryError extends Error {
  constructor() {
    super("");
    this.code = 6e3;
    this.name = "InvalidSendLibrary";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidSendLibraryError);
    }
  }
};
createErrorFromCodeLookup.set(6e3, () => new InvalidSendLibraryError());
createErrorFromNameLookup.set(
  "InvalidSendLibrary",
  () => new InvalidSendLibraryError()
);
var InvalidReceiveLibraryError = class _InvalidReceiveLibraryError extends Error {
  constructor() {
    super("");
    this.code = 6001;
    this.name = "InvalidReceiveLibrary";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidReceiveLibraryError);
    }
  }
};
createErrorFromCodeLookup.set(6001, () => new InvalidReceiveLibraryError());
createErrorFromNameLookup.set(
  "InvalidReceiveLibrary",
  () => new InvalidReceiveLibraryError()
);
var SameValueError = class _SameValueError extends Error {
  constructor() {
    super("");
    this.code = 6002;
    this.name = "SameValue";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _SameValueError);
    }
  }
};
createErrorFromCodeLookup.set(6002, () => new SameValueError());
createErrorFromNameLookup.set("SameValue", () => new SameValueError());
var AccountNotFoundError = class _AccountNotFoundError extends Error {
  constructor() {
    super("");
    this.code = 6003;
    this.name = "AccountNotFound";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _AccountNotFoundError);
    }
  }
};
createErrorFromCodeLookup.set(6003, () => new AccountNotFoundError());
createErrorFromNameLookup.set(
  "AccountNotFound",
  () => new AccountNotFoundError()
);
var OnlySendLibError = class _OnlySendLibError extends Error {
  constructor() {
    super("");
    this.code = 6004;
    this.name = "OnlySendLib";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _OnlySendLibError);
    }
  }
};
createErrorFromCodeLookup.set(6004, () => new OnlySendLibError());
createErrorFromNameLookup.set("OnlySendLib", () => new OnlySendLibError());
var OnlyReceiveLibError = class _OnlyReceiveLibError extends Error {
  constructor() {
    super("");
    this.code = 6005;
    this.name = "OnlyReceiveLib";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _OnlyReceiveLibError);
    }
  }
};
createErrorFromCodeLookup.set(6005, () => new OnlyReceiveLibError());
createErrorFromNameLookup.set("OnlyReceiveLib", () => new OnlyReceiveLibError());
var InvalidExpiryError = class _InvalidExpiryError extends Error {
  constructor() {
    super("");
    this.code = 6006;
    this.name = "InvalidExpiry";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidExpiryError);
    }
  }
};
createErrorFromCodeLookup.set(6006, () => new InvalidExpiryError());
createErrorFromNameLookup.set("InvalidExpiry", () => new InvalidExpiryError());
var OnlyNonDefaultLibError = class _OnlyNonDefaultLibError extends Error {
  constructor() {
    super("");
    this.code = 6007;
    this.name = "OnlyNonDefaultLib";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _OnlyNonDefaultLibError);
    }
  }
};
createErrorFromCodeLookup.set(6007, () => new OnlyNonDefaultLibError());
createErrorFromNameLookup.set(
  "OnlyNonDefaultLib",
  () => new OnlyNonDefaultLibError()
);
var InvalidAmountError = class _InvalidAmountError extends Error {
  constructor() {
    super("");
    this.code = 6008;
    this.name = "InvalidAmount";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidAmountError);
    }
  }
};
createErrorFromCodeLookup.set(6008, () => new InvalidAmountError());
createErrorFromNameLookup.set("InvalidAmount", () => new InvalidAmountError());
var InvalidNonceError = class _InvalidNonceError extends Error {
  constructor() {
    super("");
    this.code = 6009;
    this.name = "InvalidNonce";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidNonceError);
    }
  }
};
createErrorFromCodeLookup.set(6009, () => new InvalidNonceError());
createErrorFromNameLookup.set("InvalidNonce", () => new InvalidNonceError());
var UnauthorizedError = class _UnauthorizedError extends Error {
  constructor() {
    super("");
    this.code = 6010;
    this.name = "Unauthorized";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _UnauthorizedError);
    }
  }
};
createErrorFromCodeLookup.set(6010, () => new UnauthorizedError());
createErrorFromNameLookup.set("Unauthorized", () => new UnauthorizedError());
var PayloadHashNotFoundError = class _PayloadHashNotFoundError extends Error {
  constructor() {
    super("");
    this.code = 6011;
    this.name = "PayloadHashNotFound";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _PayloadHashNotFoundError);
    }
  }
};
createErrorFromCodeLookup.set(6011, () => new PayloadHashNotFoundError());
createErrorFromNameLookup.set(
  "PayloadHashNotFound",
  () => new PayloadHashNotFoundError()
);
var ComposeNotFoundError = class _ComposeNotFoundError extends Error {
  constructor() {
    super("");
    this.code = 6012;
    this.name = "ComposeNotFound";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _ComposeNotFoundError);
    }
  }
};
createErrorFromCodeLookup.set(6012, () => new ComposeNotFoundError());
createErrorFromNameLookup.set(
  "ComposeNotFound",
  () => new ComposeNotFoundError()
);
var InvalidPayloadHashError = class _InvalidPayloadHashError extends Error {
  constructor() {
    super("");
    this.code = 6013;
    this.name = "InvalidPayloadHash";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidPayloadHashError);
    }
  }
};
createErrorFromCodeLookup.set(6013, () => new InvalidPayloadHashError());
createErrorFromNameLookup.set(
  "InvalidPayloadHash",
  () => new InvalidPayloadHashError()
);
var LzTokenUnavailableError = class _LzTokenUnavailableError extends Error {
  constructor() {
    super("");
    this.code = 6014;
    this.name = "LzTokenUnavailable";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _LzTokenUnavailableError);
    }
  }
};
createErrorFromCodeLookup.set(6014, () => new LzTokenUnavailableError());
createErrorFromNameLookup.set(
  "LzTokenUnavailable",
  () => new LzTokenUnavailableError()
);
var ReadOnlyAccountError = class _ReadOnlyAccountError extends Error {
  constructor() {
    super("");
    this.code = 6015;
    this.name = "ReadOnlyAccount";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _ReadOnlyAccountError);
    }
  }
};
createErrorFromCodeLookup.set(6015, () => new ReadOnlyAccountError());
createErrorFromNameLookup.set(
  "ReadOnlyAccount",
  () => new ReadOnlyAccountError()
);
var InvalidMessageLibError = class _InvalidMessageLibError extends Error {
  constructor() {
    super("");
    this.code = 6016;
    this.name = "InvalidMessageLib";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidMessageLibError);
    }
  }
};
createErrorFromCodeLookup.set(6016, () => new InvalidMessageLibError());
createErrorFromNameLookup.set(
  "InvalidMessageLib",
  () => new InvalidMessageLibError()
);
var WritableAccountNotAllowedError = class _WritableAccountNotAllowedError extends Error {
  constructor() {
    super("");
    this.code = 6017;
    this.name = "WritableAccountNotAllowed";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _WritableAccountNotAllowedError);
    }
  }
};
createErrorFromCodeLookup.set(
  6017,
  () => new WritableAccountNotAllowedError()
);
createErrorFromNameLookup.set(
  "WritableAccountNotAllowed",
  () => new WritableAccountNotAllowedError()
);
function errorFromCode(code) {
  const createError = createErrorFromCodeLookup.get(code);
  return createError != null ? createError() : null;
}
function errorFromName(name) {
  const createError = createErrorFromNameLookup.get(name);
  return createError != null ? createError() : null;
}

// src/generated/endpoint/instructions/index.ts
var instructions_exports = {};
__export(instructions_exports, {
  burnInstructionDiscriminator: () => burnInstructionDiscriminator,
  burnStruct: () => burnStruct,
  clearComposeInstructionDiscriminator: () => clearComposeInstructionDiscriminator,
  clearComposeStruct: () => clearComposeStruct,
  clearInstructionDiscriminator: () => clearInstructionDiscriminator,
  clearStruct: () => clearStruct,
  createBurnInstruction: () => createBurnInstruction,
  createBurnInstructionAccounts: () => createBurnInstructionAccounts,
  createClearComposeInstruction: () => createClearComposeInstruction,
  createClearComposeInstructionAccounts: () => createClearComposeInstructionAccounts,
  createClearInstruction: () => createClearInstruction,
  createClearInstructionAccounts: () => createClearInstructionAccounts,
  createInitConfigInstruction: () => createInitConfigInstruction,
  createInitConfigInstructionAccounts: () => createInitConfigInstructionAccounts,
  createInitDefaultReceiveLibraryInstruction: () => createInitDefaultReceiveLibraryInstruction,
  createInitDefaultReceiveLibraryInstructionAccounts: () => createInitDefaultReceiveLibraryInstructionAccounts,
  createInitDefaultSendLibraryInstruction: () => createInitDefaultSendLibraryInstruction,
  createInitDefaultSendLibraryInstructionAccounts: () => createInitDefaultSendLibraryInstructionAccounts,
  createInitEndpointInstruction: () => createInitEndpointInstruction,
  createInitEndpointInstructionAccounts: () => createInitEndpointInstructionAccounts,
  createInitNonceInstruction: () => createInitNonceInstruction,
  createInitNonceInstructionAccounts: () => createInitNonceInstructionAccounts,
  createInitReceiveLibraryInstruction: () => createInitReceiveLibraryInstruction,
  createInitReceiveLibraryInstructionAccounts: () => createInitReceiveLibraryInstructionAccounts,
  createInitSendLibraryInstruction: () => createInitSendLibraryInstruction,
  createInitSendLibraryInstructionAccounts: () => createInitSendLibraryInstructionAccounts,
  createInitVerifyInstruction: () => createInitVerifyInstruction,
  createInitVerifyInstructionAccounts: () => createInitVerifyInstructionAccounts,
  createLzComposeAlertInstruction: () => createLzComposeAlertInstruction,
  createLzComposeAlertInstructionAccounts: () => createLzComposeAlertInstructionAccounts,
  createLzReceiveAlertInstruction: () => createLzReceiveAlertInstruction,
  createLzReceiveAlertInstructionAccounts: () => createLzReceiveAlertInstructionAccounts,
  createNilifyInstruction: () => createNilifyInstruction,
  createNilifyInstructionAccounts: () => createNilifyInstructionAccounts,
  createQuoteInstruction: () => createQuoteInstruction,
  createQuoteInstructionAccounts: () => createQuoteInstructionAccounts,
  createRegisterLibraryInstruction: () => createRegisterLibraryInstruction,
  createRegisterLibraryInstructionAccounts: () => createRegisterLibraryInstructionAccounts,
  createRegisterOappInstruction: () => createRegisterOappInstruction,
  createRegisterOappInstructionAccounts: () => createRegisterOappInstructionAccounts,
  createSendComposeInstruction: () => createSendComposeInstruction,
  createSendComposeInstructionAccounts: () => createSendComposeInstructionAccounts,
  createSendInstruction: () => createSendInstruction,
  createSendInstructionAccounts: () => createSendInstructionAccounts,
  createSetConfigInstruction: () => createSetConfigInstruction,
  createSetConfigInstructionAccounts: () => createSetConfigInstructionAccounts,
  createSetDefaultReceiveLibraryInstruction: () => createSetDefaultReceiveLibraryInstruction,
  createSetDefaultReceiveLibraryInstructionAccounts: () => createSetDefaultReceiveLibraryInstructionAccounts,
  createSetDefaultReceiveLibraryTimeoutInstruction: () => createSetDefaultReceiveLibraryTimeoutInstruction,
  createSetDefaultReceiveLibraryTimeoutInstructionAccounts: () => createSetDefaultReceiveLibraryTimeoutInstructionAccounts,
  createSetDefaultSendLibraryInstruction: () => createSetDefaultSendLibraryInstruction,
  createSetDefaultSendLibraryInstructionAccounts: () => createSetDefaultSendLibraryInstructionAccounts,
  createSetDelegateInstruction: () => createSetDelegateInstruction,
  createSetDelegateInstructionAccounts: () => createSetDelegateInstructionAccounts,
  createSetLzTokenInstruction: () => createSetLzTokenInstruction,
  createSetLzTokenInstructionAccounts: () => createSetLzTokenInstructionAccounts,
  createSetReceiveLibraryInstruction: () => createSetReceiveLibraryInstruction,
  createSetReceiveLibraryInstructionAccounts: () => createSetReceiveLibraryInstructionAccounts,
  createSetReceiveLibraryTimeoutInstruction: () => createSetReceiveLibraryTimeoutInstruction,
  createSetReceiveLibraryTimeoutInstructionAccounts: () => createSetReceiveLibraryTimeoutInstructionAccounts,
  createSetSendLibraryInstruction: () => createSetSendLibraryInstruction,
  createSetSendLibraryInstructionAccounts: () => createSetSendLibraryInstructionAccounts,
  createSkipInstruction: () => createSkipInstruction,
  createSkipInstructionAccounts: () => createSkipInstructionAccounts,
  createTransferAdminInstruction: () => createTransferAdminInstruction,
  createTransferAdminInstructionAccounts: () => createTransferAdminInstructionAccounts,
  createVerifyInstruction: () => createVerifyInstruction,
  createVerifyInstructionAccounts: () => createVerifyInstructionAccounts,
  createWithdrawRentInstruction: () => createWithdrawRentInstruction,
  createWithdrawRentInstructionAccounts: () => createWithdrawRentInstructionAccounts,
  initConfigInstructionDiscriminator: () => initConfigInstructionDiscriminator,
  initConfigStruct: () => initConfigStruct,
  initDefaultReceiveLibraryInstructionDiscriminator: () => initDefaultReceiveLibraryInstructionDiscriminator,
  initDefaultReceiveLibraryStruct: () => initDefaultReceiveLibraryStruct,
  initDefaultSendLibraryInstructionDiscriminator: () => initDefaultSendLibraryInstructionDiscriminator,
  initDefaultSendLibraryStruct: () => initDefaultSendLibraryStruct,
  initEndpointInstructionDiscriminator: () => initEndpointInstructionDiscriminator,
  initEndpointStruct: () => initEndpointStruct,
  initNonceInstructionDiscriminator: () => initNonceInstructionDiscriminator,
  initNonceStruct: () => initNonceStruct,
  initReceiveLibraryInstructionDiscriminator: () => initReceiveLibraryInstructionDiscriminator,
  initReceiveLibraryStruct: () => initReceiveLibraryStruct,
  initSendLibraryInstructionDiscriminator: () => initSendLibraryInstructionDiscriminator,
  initSendLibraryStruct: () => initSendLibraryStruct,
  initVerifyInstructionDiscriminator: () => initVerifyInstructionDiscriminator,
  initVerifyStruct: () => initVerifyStruct,
  lzComposeAlertInstructionDiscriminator: () => lzComposeAlertInstructionDiscriminator,
  lzComposeAlertStruct: () => lzComposeAlertStruct,
  lzReceiveAlertInstructionDiscriminator: () => lzReceiveAlertInstructionDiscriminator,
  lzReceiveAlertStruct: () => lzReceiveAlertStruct,
  nilifyInstructionDiscriminator: () => nilifyInstructionDiscriminator,
  nilifyStruct: () => nilifyStruct,
  quoteInstructionDiscriminator: () => quoteInstructionDiscriminator,
  quoteStruct: () => quoteStruct,
  registerLibraryInstructionDiscriminator: () => registerLibraryInstructionDiscriminator,
  registerLibraryStruct: () => registerLibraryStruct,
  registerOappInstructionDiscriminator: () => registerOappInstructionDiscriminator,
  registerOappStruct: () => registerOappStruct,
  sendComposeInstructionDiscriminator: () => sendComposeInstructionDiscriminator,
  sendComposeStruct: () => sendComposeStruct,
  sendInstructionDiscriminator: () => sendInstructionDiscriminator,
  sendStruct: () => sendStruct,
  setConfigInstructionDiscriminator: () => setConfigInstructionDiscriminator,
  setConfigStruct: () => setConfigStruct,
  setDefaultReceiveLibraryInstructionDiscriminator: () => setDefaultReceiveLibraryInstructionDiscriminator,
  setDefaultReceiveLibraryStruct: () => setDefaultReceiveLibraryStruct,
  setDefaultReceiveLibraryTimeoutInstructionDiscriminator: () => setDefaultReceiveLibraryTimeoutInstructionDiscriminator,
  setDefaultReceiveLibraryTimeoutStruct: () => setDefaultReceiveLibraryTimeoutStruct,
  setDefaultSendLibraryInstructionDiscriminator: () => setDefaultSendLibraryInstructionDiscriminator,
  setDefaultSendLibraryStruct: () => setDefaultSendLibraryStruct,
  setDelegateInstructionDiscriminator: () => setDelegateInstructionDiscriminator,
  setDelegateStruct: () => setDelegateStruct,
  setLzTokenInstructionDiscriminator: () => setLzTokenInstructionDiscriminator,
  setLzTokenStruct: () => setLzTokenStruct,
  setReceiveLibraryInstructionDiscriminator: () => setReceiveLibraryInstructionDiscriminator,
  setReceiveLibraryStruct: () => setReceiveLibraryStruct,
  setReceiveLibraryTimeoutInstructionDiscriminator: () => setReceiveLibraryTimeoutInstructionDiscriminator,
  setReceiveLibraryTimeoutStruct: () => setReceiveLibraryTimeoutStruct,
  setSendLibraryInstructionDiscriminator: () => setSendLibraryInstructionDiscriminator,
  setSendLibraryStruct: () => setSendLibraryStruct,
  skipInstructionDiscriminator: () => skipInstructionDiscriminator,
  skipStruct: () => skipStruct,
  transferAdminInstructionDiscriminator: () => transferAdminInstructionDiscriminator,
  transferAdminStruct: () => transferAdminStruct,
  verifyInstructionDiscriminator: () => verifyInstructionDiscriminator,
  verifyStruct: () => verifyStruct,
  withdrawRentInstructionDiscriminator: () => withdrawRentInstructionDiscriminator,
  withdrawRentStruct: () => withdrawRentStruct
});
var burnParamsBeet = new beet159.BeetArgsStruct(
  [
    ["receiver", beetSolana85.publicKey],
    ["srcEid", beet159.u32],
    ["sender", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["nonce", beet159.u64],
    ["payloadHash", beet159.uniformFixedSizeArray(beet159.u8, 32)]
  ],
  "BurnParams"
);

// src/generated/endpoint/instructions/burn.ts
var burnStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", burnParamsBeet]
  ],
  "BurnInstructionArgs"
);
var burnInstructionDiscriminator = [116, 110, 29, 56, 107, 219, 42, 93];
function createBurnInstruction(accounts, args, programId) {
  const [data] = burnStruct.serialize({
    instructionDiscriminator: burnInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.signer,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.oappRegistry,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.nonce,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.payloadHash,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.endpoint,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createBurnInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.signer,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.oappRegistry,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.nonce,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.payloadHash,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.endpoint,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var clearParamsBeet = new beet159.FixableBeetArgsStruct(
  [
    ["receiver", beetSolana85.publicKey],
    ["srcEid", beet159.u32],
    ["sender", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["nonce", beet159.u64],
    ["guid", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["message", beet159.bytes]
  ],
  "ClearParams"
);

// src/generated/endpoint/instructions/clear.ts
var clearStruct = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", clearParamsBeet]
  ],
  "ClearInstructionArgs"
);
var clearInstructionDiscriminator = [
  250,
  39,
  28,
  213,
  123,
  163,
  133,
  5
];
function createClearInstruction(accounts, args, programId) {
  const [data] = clearStruct.serialize({
    instructionDiscriminator: clearInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.signer,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.oappRegistry,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.nonce,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.payloadHash,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.endpoint,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createClearInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.signer,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.oappRegistry,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.nonce,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.payloadHash,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.endpoint,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var clearComposeParamsBeet = new beet159.FixableBeetArgsStruct(
  [
    ["from", beetSolana85.publicKey],
    ["guid", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["index", beet159.u16],
    ["message", beet159.bytes]
  ],
  "ClearComposeParams"
);

// src/generated/endpoint/instructions/clearCompose.ts
var clearComposeStruct = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", clearComposeParamsBeet]
  ],
  "ClearComposeInstructionArgs"
);
var clearComposeInstructionDiscriminator = [
  118,
  1,
  18,
  142,
  95,
  175,
  21,
  125
];
function createClearComposeInstruction(accounts, args, programId) {
  const [data] = clearComposeStruct.serialize({
    instructionDiscriminator: clearComposeInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.to,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.composeMessage,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createClearComposeInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.to,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.composeMessage,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var initConfigParamsBeet = new beet159.BeetArgsStruct(
  [
    ["oapp", beetSolana85.publicKey],
    ["eid", beet159.u32]
  ],
  "InitConfigParams"
);

// src/generated/endpoint/instructions/initConfig.ts
var initConfigStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", initConfigParamsBeet]
  ],
  "InitConfigInstructionArgs"
);
var initConfigInstructionDiscriminator = [
  23,
  235,
  115,
  232,
  168,
  96,
  1,
  231
];
function createInitConfigInstruction(accounts, args, programId) {
  const [data] = initConfigStruct.serialize({
    instructionDiscriminator: initConfigInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.delegate,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.oappRegistry,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.messageLibInfo,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.messageLib,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.messageLibProgram,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createInitConfigInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.delegate,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.oappRegistry,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.messageLibInfo,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.messageLib,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.messageLibProgram,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var initDefaultReceiveLibraryParamsBeet = new beet159.BeetArgsStruct(
  [
    ["eid", beet159.u32],
    ["newLib", beetSolana85.publicKey]
  ],
  "InitDefaultReceiveLibraryParams"
);

// src/generated/endpoint/instructions/initDefaultReceiveLibrary.ts
var initDefaultReceiveLibraryStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", initDefaultReceiveLibraryParamsBeet]
  ],
  "InitDefaultReceiveLibraryInstructionArgs"
);
var initDefaultReceiveLibraryInstructionDiscriminator = [
  32,
  202,
  76,
  22,
  42,
  249,
  227,
  109
];
function createInitDefaultReceiveLibraryInstruction(accounts, args, programId) {
  const [data] = initDefaultReceiveLibraryStruct.serialize({
    instructionDiscriminator: initDefaultReceiveLibraryInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.defaultReceiveLibraryConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.messageLibInfo,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createInitDefaultReceiveLibraryInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.defaultReceiveLibraryConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.messageLibInfo,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var initDefaultSendLibraryParamsBeet = new beet159.BeetArgsStruct(
  [
    ["eid", beet159.u32],
    ["newLib", beetSolana85.publicKey]
  ],
  "InitDefaultSendLibraryParams"
);

// src/generated/endpoint/instructions/initDefaultSendLibrary.ts
var initDefaultSendLibraryStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", initDefaultSendLibraryParamsBeet]
  ],
  "InitDefaultSendLibraryInstructionArgs"
);
var initDefaultSendLibraryInstructionDiscriminator = [
  120,
  187,
  15,
  31,
  174,
  97,
  138,
  58
];
function createInitDefaultSendLibraryInstruction(accounts, args, programId) {
  const [data] = initDefaultSendLibraryStruct.serialize({
    instructionDiscriminator: initDefaultSendLibraryInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.defaultSendLibraryConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.messageLibInfo,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createInitDefaultSendLibraryInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.defaultSendLibraryConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.messageLibInfo,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var initEndpointParamsBeet = new beet159.BeetArgsStruct(
  [
    ["eid", beet159.u32],
    ["admin", beetSolana85.publicKey]
  ],
  "InitEndpointParams"
);

// src/generated/endpoint/instructions/initEndpoint.ts
var initEndpointStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", initEndpointParamsBeet]
  ],
  "InitEndpointInstructionArgs"
);
var initEndpointInstructionDiscriminator = [
  178,
  30,
  29,
  207,
  120,
  225,
  246,
  134
];
function createInitEndpointInstruction(accounts, args, programId) {
  const [data] = initEndpointStruct.serialize({
    instructionDiscriminator: initEndpointInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.endpoint,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createInitEndpointInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.endpoint,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var initNonceParamsBeet = new beet159.BeetArgsStruct(
  [
    ["localOapp", beetSolana85.publicKey],
    ["remoteEid", beet159.u32],
    ["remoteOapp", beet159.uniformFixedSizeArray(beet159.u8, 32)]
  ],
  "InitNonceParams"
);

// src/generated/endpoint/instructions/initNonce.ts
var initNonceStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", initNonceParamsBeet]
  ],
  "InitNonceInstructionArgs"
);
var initNonceInstructionDiscriminator = [
  204,
  171,
  16,
  214,
  182,
  191,
  27,
  196
];
function createInitNonceInstruction(accounts, args, programId) {
  const [data] = initNonceStruct.serialize({
    instructionDiscriminator: initNonceInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.delegate,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.oappRegistry,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.nonce,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.pendingInboundNonce,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createInitNonceInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.delegate,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.oappRegistry,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.nonce,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.pendingInboundNonce,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var initReceiveLibraryParamsBeet = new beet159.BeetArgsStruct(
  [
    ["receiver", beetSolana85.publicKey],
    ["eid", beet159.u32]
  ],
  "InitReceiveLibraryParams"
);

// src/generated/endpoint/instructions/initReceiveLibrary.ts
var initReceiveLibraryStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", initReceiveLibraryParamsBeet]
  ],
  "InitReceiveLibraryInstructionArgs"
);
var initReceiveLibraryInstructionDiscriminator = [
  197,
  114,
  81,
  100,
  45,
  233,
  36,
  230
];
function createInitReceiveLibraryInstruction(accounts, args, programId) {
  const [data] = initReceiveLibraryStruct.serialize({
    instructionDiscriminator: initReceiveLibraryInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.delegate,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.oappRegistry,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.receiveLibraryConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createInitReceiveLibraryInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.delegate,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.oappRegistry,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.receiveLibraryConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var initSendLibraryParamsBeet = new beet159.BeetArgsStruct(
  [
    ["sender", beetSolana85.publicKey],
    ["eid", beet159.u32]
  ],
  "InitSendLibraryParams"
);

// src/generated/endpoint/instructions/initSendLibrary.ts
var initSendLibraryStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", initSendLibraryParamsBeet]
  ],
  "InitSendLibraryInstructionArgs"
);
var initSendLibraryInstructionDiscriminator = [
  156,
  24,
  235,
  120,
  73,
  193,
  144,
  19
];
function createInitSendLibraryInstruction(accounts, args, programId) {
  const [data] = initSendLibraryStruct.serialize({
    instructionDiscriminator: initSendLibraryInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.delegate,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.oappRegistry,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendLibraryConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createInitSendLibraryInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.delegate,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.oappRegistry,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendLibraryConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var initVerifyParamsBeet = new beet159.BeetArgsStruct(
  [
    ["srcEid", beet159.u32],
    ["sender", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["receiver", beetSolana85.publicKey],
    ["nonce", beet159.u64]
  ],
  "InitVerifyParams"
);

// src/generated/endpoint/instructions/initVerify.ts
var initVerifyStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", initVerifyParamsBeet]
  ],
  "InitVerifyInstructionArgs"
);
var initVerifyInstructionDiscriminator = [
  76,
  246,
  244,
  124,
  115,
  17,
  235,
  91
];
function createInitVerifyInstruction(accounts, args, programId) {
  const [data] = initVerifyStruct.serialize({
    instructionDiscriminator: initVerifyInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.nonce,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.payloadHash,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createInitVerifyInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.nonce,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.payloadHash,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var lzComposeAlertParamsBeet = new beet159.FixableBeetArgsStruct(
  [
    ["from", beetSolana85.publicKey],
    ["to", beetSolana85.publicKey],
    ["guid", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["index", beet159.u16],
    ["computeUnits", beet159.u64],
    ["value", beet159.u64],
    ["message", beet159.bytes],
    ["extraData", beet159.bytes],
    ["reason", beet159.bytes]
  ],
  "LzComposeAlertParams"
);

// src/generated/endpoint/instructions/lzComposeAlert.ts
var lzComposeAlertStruct = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", lzComposeAlertParamsBeet]
  ],
  "LzComposeAlertInstructionArgs"
);
var lzComposeAlertInstructionDiscriminator = [
  27,
  91,
  198,
  77,
  66,
  92,
  122,
  167
];
function createLzComposeAlertInstruction(accounts, args, programId) {
  const [data] = lzComposeAlertStruct.serialize({
    instructionDiscriminator: lzComposeAlertInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.executor,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createLzComposeAlertInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.executor,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var lzReceiveAlertParamsBeet = new beet159.FixableBeetArgsStruct(
  [
    ["receiver", beetSolana85.publicKey],
    ["srcEid", beet159.u32],
    ["sender", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["nonce", beet159.u64],
    ["guid", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["computeUnits", beet159.u64],
    ["value", beet159.u64],
    ["message", beet159.bytes],
    ["extraData", beet159.bytes],
    ["reason", beet159.bytes]
  ],
  "LzReceiveAlertParams"
);

// src/generated/endpoint/instructions/lzReceiveAlert.ts
var lzReceiveAlertStruct = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", lzReceiveAlertParamsBeet]
  ],
  "LzReceiveAlertInstructionArgs"
);
var lzReceiveAlertInstructionDiscriminator = [
  131,
  141,
  48,
  222,
  15,
  235,
  141,
  160
];
function createLzReceiveAlertInstruction(accounts, args, programId) {
  const [data] = lzReceiveAlertStruct.serialize({
    instructionDiscriminator: lzReceiveAlertInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.executor,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createLzReceiveAlertInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.executor,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var nilifyParamsBeet = new beet159.BeetArgsStruct(
  [
    ["receiver", beetSolana85.publicKey],
    ["srcEid", beet159.u32],
    ["sender", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["nonce", beet159.u64],
    ["payloadHash", beet159.uniformFixedSizeArray(beet159.u8, 32)]
  ],
  "NilifyParams"
);

// src/generated/endpoint/instructions/nilify.ts
var nilifyStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", nilifyParamsBeet]
  ],
  "NilifyInstructionArgs"
);
var nilifyInstructionDiscriminator = [
  143,
  136,
  129,
  199,
  36,
  35,
  160,
  85
];
function createNilifyInstruction(accounts, args, programId) {
  const [data] = nilifyStruct.serialize({
    instructionDiscriminator: nilifyInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.signer,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.oappRegistry,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.nonce,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.pendingInboundNonce,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.payloadHash,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createNilifyInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.signer,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.oappRegistry,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.nonce,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.pendingInboundNonce,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.payloadHash,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var quoteParamsBeet = new beet159.FixableBeetArgsStruct(
  [
    ["sender", beetSolana85.publicKey],
    ["dstEid", beet159.u32],
    ["receiver", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["message", beet159.bytes],
    ["options", beet159.bytes],
    ["payInLzToken", beet159.bool]
  ],
  "QuoteParams"
);

// src/generated/endpoint/instructions/quote.ts
var quoteStruct = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", quoteParamsBeet]
  ],
  "QuoteInstructionArgs"
);
var quoteInstructionDiscriminator = [
  149,
  42,
  109,
  247,
  134,
  146,
  213,
  123
];
function createQuoteInstruction(accounts, args, programId) {
  const [data] = quoteStruct.serialize({
    instructionDiscriminator: quoteInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.sendLibraryProgram,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendLibraryConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.defaultSendLibraryConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendLibraryInfo,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.nonce,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createQuoteInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.sendLibraryProgram,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendLibraryConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.defaultSendLibraryConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendLibraryInfo,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.nonce,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var registerLibraryParamsBeet = new beet159.BeetArgsStruct(
  [
    ["libProgram", beetSolana85.publicKey],
    ["libType", messageLibTypeBeet]
  ],
  "RegisterLibraryParams"
);

// src/generated/endpoint/instructions/registerLibrary.ts
var registerLibraryStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", registerLibraryParamsBeet]
  ],
  "RegisterLibraryInstructionArgs"
);
var registerLibraryInstructionDiscriminator = [
  23,
  171,
  28,
  116,
  111,
  193,
  238,
  142
];
function createRegisterLibraryInstruction(accounts, args, programId) {
  const [data] = registerLibraryStruct.serialize({
    instructionDiscriminator: registerLibraryInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.messageLibInfo,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createRegisterLibraryInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.messageLibInfo,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var registerOAppParamsBeet = new beet159.BeetArgsStruct(
  [["delegate", beetSolana85.publicKey]],
  "RegisterOAppParams"
);

// src/generated/endpoint/instructions/registerOapp.ts
var registerOappStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", registerOAppParamsBeet]
  ],
  "RegisterOappInstructionArgs"
);
var registerOappInstructionDiscriminator = [
  129,
  89,
  71,
  68,
  11,
  82,
  210,
  125
];
function createRegisterOappInstruction(accounts, args, programId) {
  const [data] = registerOappStruct.serialize({
    instructionDiscriminator: registerOappInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.oapp,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.oappRegistry,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createRegisterOappInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.oapp,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.oappRegistry,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var sendParamsBeet = new beet159.FixableBeetArgsStruct(
  [
    ["dstEid", beet159.u32],
    ["receiver", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["message", beet159.bytes],
    ["options", beet159.bytes],
    ["nativeFee", beet159.u64],
    ["lzTokenFee", beet159.u64]
  ],
  "SendParams"
);

// src/generated/endpoint/instructions/send.ts
var sendStruct = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", sendParamsBeet]
  ],
  "SendInstructionArgs"
);
var sendInstructionDiscriminator = [102, 251, 20, 187, 65, 75, 12, 69];
function createSendInstruction(accounts, args, programId) {
  const [data] = sendStruct.serialize({
    instructionDiscriminator: sendInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.sender,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.sendLibraryProgram,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendLibraryConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.defaultSendLibraryConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendLibraryInfo,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.nonce,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createSendInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.sender,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.sendLibraryProgram,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendLibraryConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.defaultSendLibraryConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendLibraryInfo,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.nonce,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var sendComposeParamsBeet = new beet159.FixableBeetArgsStruct(
  [
    ["to", beetSolana85.publicKey],
    ["guid", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["index", beet159.u16],
    ["message", beet159.bytes]
  ],
  "SendComposeParams"
);

// src/generated/endpoint/instructions/sendCompose.ts
var sendComposeStruct = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", sendComposeParamsBeet]
  ],
  "SendComposeInstructionArgs"
);
var sendComposeInstructionDiscriminator = [
  75,
  38,
  228,
  168,
  43,
  39,
  238,
  229
];
function createSendComposeInstruction(accounts, args, programId) {
  const [data] = sendComposeStruct.serialize({
    instructionDiscriminator: sendComposeInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.from,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.composeMessage,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createSendComposeInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.from,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.composeMessage,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var setConfigParamsBeet = new beet159.FixableBeetArgsStruct(
  [
    ["oapp", beetSolana85.publicKey],
    ["eid", beet159.u32],
    ["configType", beet159.u32],
    ["config", beet159.bytes]
  ],
  "SetConfigParams"
);

// src/generated/endpoint/instructions/setConfig.ts
var setConfigStruct = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", setConfigParamsBeet]
  ],
  "SetConfigInstructionArgs"
);
var setConfigInstructionDiscriminator = [
  108,
  158,
  154,
  175,
  212,
  98,
  52,
  66
];
function createSetConfigInstruction(accounts, args, programId) {
  const [data] = setConfigStruct.serialize({
    instructionDiscriminator: setConfigInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.signer,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.oappRegistry,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.messageLibInfo,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.messageLib,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.messageLibProgram,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createSetConfigInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.signer,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.oappRegistry,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.messageLibInfo,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.messageLib,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.messageLibProgram,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var setDefaultReceiveLibraryParamsBeet = new beet159.BeetArgsStruct(
  [
    ["eid", beet159.u32],
    ["newLib", beetSolana85.publicKey],
    ["gracePeriod", beet159.u64]
  ],
  "SetDefaultReceiveLibraryParams"
);

// src/generated/endpoint/instructions/setDefaultReceiveLibrary.ts
var setDefaultReceiveLibraryStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", setDefaultReceiveLibraryParamsBeet]
  ],
  "SetDefaultReceiveLibraryInstructionArgs"
);
var setDefaultReceiveLibraryInstructionDiscriminator = [
  14,
  162,
  167,
  212,
  13,
  20,
  151,
  129
];
function createSetDefaultReceiveLibraryInstruction(accounts, args, programId) {
  const [data] = setDefaultReceiveLibraryStruct.serialize({
    instructionDiscriminator: setDefaultReceiveLibraryInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.defaultReceiveLibraryConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.messageLibInfo,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createSetDefaultReceiveLibraryInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.defaultReceiveLibraryConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.messageLibInfo,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var setDefaultReceiveLibraryTimeoutParamsBeet = new beet159.BeetArgsStruct(
  [
    ["eid", beet159.u32],
    ["lib", beetSolana85.publicKey],
    ["expiry", beet159.u64]
  ],
  "SetDefaultReceiveLibraryTimeoutParams"
);

// src/generated/endpoint/instructions/setDefaultReceiveLibraryTimeout.ts
var setDefaultReceiveLibraryTimeoutStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", setDefaultReceiveLibraryTimeoutParamsBeet]
  ],
  "SetDefaultReceiveLibraryTimeoutInstructionArgs"
);
var setDefaultReceiveLibraryTimeoutInstructionDiscriminator = [
  118,
  32,
  94,
  51,
  25,
  247,
  16,
  232
];
function createSetDefaultReceiveLibraryTimeoutInstruction(accounts, args, programId) {
  const [data] = setDefaultReceiveLibraryTimeoutStruct.serialize({
    instructionDiscriminator: setDefaultReceiveLibraryTimeoutInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.defaultReceiveLibraryConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.messageLibInfo,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createSetDefaultReceiveLibraryTimeoutInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.defaultReceiveLibraryConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.messageLibInfo,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var setDefaultSendLibraryParamsBeet = new beet159.BeetArgsStruct(
  [
    ["eid", beet159.u32],
    ["newLib", beetSolana85.publicKey]
  ],
  "SetDefaultSendLibraryParams"
);

// src/generated/endpoint/instructions/setDefaultSendLibrary.ts
var setDefaultSendLibraryStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", setDefaultSendLibraryParamsBeet]
  ],
  "SetDefaultSendLibraryInstructionArgs"
);
var setDefaultSendLibraryInstructionDiscriminator = [
  220,
  215,
  110,
  127,
  237,
  178,
  215,
  170
];
function createSetDefaultSendLibraryInstruction(accounts, args, programId) {
  const [data] = setDefaultSendLibraryStruct.serialize({
    instructionDiscriminator: setDefaultSendLibraryInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.defaultSendLibraryConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.messageLibInfo,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createSetDefaultSendLibraryInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.defaultSendLibraryConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.messageLibInfo,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var setDelegateParamsBeet = new beet159.BeetArgsStruct(
  [["delegate", beetSolana85.publicKey]],
  "SetDelegateParams"
);

// src/generated/endpoint/instructions/setDelegate.ts
var setDelegateStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", setDelegateParamsBeet]
  ],
  "SetDelegateInstructionArgs"
);
var setDelegateInstructionDiscriminator = [
  242,
  30,
  46,
  76,
  108,
  235,
  128,
  181
];
function createSetDelegateInstruction(accounts, args, programId) {
  const [data] = setDelegateStruct.serialize({
    instructionDiscriminator: setDelegateInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.oapp,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.oappRegistry,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createSetDelegateInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.oapp,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.oappRegistry,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var setLzTokenParamsBeet = new beet159.FixableBeetArgsStruct(
  [["lzToken", beet159.coption(beetSolana85.publicKey)]],
  "SetLzTokenParams"
);

// src/generated/endpoint/instructions/setLzToken.ts
var setLzTokenStruct = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", setLzTokenParamsBeet]
  ],
  "SetLzTokenInstructionArgs"
);
var setLzTokenInstructionDiscriminator = [
  22,
  151,
  112,
  174,
  213,
  225,
  223,
  72
];
function createSetLzTokenInstruction(accounts, args, programId) {
  const [data] = setLzTokenStruct.serialize({
    instructionDiscriminator: setLzTokenInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.endpoint,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createSetLzTokenInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.endpoint,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var setReceiveLibraryParamsBeet = new beet159.BeetArgsStruct(
  [
    ["receiver", beetSolana85.publicKey],
    ["eid", beet159.u32],
    ["newLib", beetSolana85.publicKey],
    ["gracePeriod", beet159.u64]
  ],
  "SetReceiveLibraryParams"
);

// src/generated/endpoint/instructions/setReceiveLibrary.ts
var setReceiveLibraryStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", setReceiveLibraryParamsBeet]
  ],
  "SetReceiveLibraryInstructionArgs"
);
var setReceiveLibraryInstructionDiscriminator = [
  223,
  172,
  180,
  105,
  165,
  161,
  147,
  228
];
function createSetReceiveLibraryInstruction(accounts, args, programId) {
  const [data] = setReceiveLibraryStruct.serialize({
    instructionDiscriminator: setReceiveLibraryInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.signer,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.oappRegistry,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.receiveLibraryConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.messageLibInfo ?? programId,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createSetReceiveLibraryInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.signer,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.oappRegistry,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.receiveLibraryConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.messageLibInfo ?? programId,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var setReceiveLibraryTimeoutParamsBeet = new beet159.BeetArgsStruct(
  [
    ["receiver", beetSolana85.publicKey],
    ["eid", beet159.u32],
    ["lib", beetSolana85.publicKey],
    ["expiry", beet159.u64]
  ],
  "SetReceiveLibraryTimeoutParams"
);

// src/generated/endpoint/instructions/setReceiveLibraryTimeout.ts
var setReceiveLibraryTimeoutStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", setReceiveLibraryTimeoutParamsBeet]
  ],
  "SetReceiveLibraryTimeoutInstructionArgs"
);
var setReceiveLibraryTimeoutInstructionDiscriminator = [
  33,
  159,
  29,
  53,
  218,
  156,
  41,
  192
];
function createSetReceiveLibraryTimeoutInstruction(accounts, args, programId) {
  const [data] = setReceiveLibraryTimeoutStruct.serialize({
    instructionDiscriminator: setReceiveLibraryTimeoutInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.signer,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.oappRegistry,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.receiveLibraryConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.messageLibInfo,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createSetReceiveLibraryTimeoutInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.signer,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.oappRegistry,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.receiveLibraryConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.messageLibInfo,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var setSendLibraryParamsBeet = new beet159.BeetArgsStruct(
  [
    ["sender", beetSolana85.publicKey],
    ["eid", beet159.u32],
    ["newLib", beetSolana85.publicKey]
  ],
  "SetSendLibraryParams"
);

// src/generated/endpoint/instructions/setSendLibrary.ts
var setSendLibraryStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", setSendLibraryParamsBeet]
  ],
  "SetSendLibraryInstructionArgs"
);
var setSendLibraryInstructionDiscriminator = [
  251,
  118,
  78,
  158,
  134,
  149,
  129,
  5
];
function createSetSendLibraryInstruction(accounts, args, programId) {
  const [data] = setSendLibraryStruct.serialize({
    instructionDiscriminator: setSendLibraryInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.signer,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.oappRegistry,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendLibraryConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.messageLibInfo ?? programId,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createSetSendLibraryInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.signer,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.oappRegistry,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendLibraryConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.messageLibInfo ?? programId,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var skipParamsBeet = new beet159.BeetArgsStruct(
  [
    ["receiver", beetSolana85.publicKey],
    ["srcEid", beet159.u32],
    ["sender", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["nonce", beet159.u64]
  ],
  "SkipParams"
);

// src/generated/endpoint/instructions/skip.ts
var skipStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", skipParamsBeet]
  ],
  "SkipInstructionArgs"
);
var skipInstructionDiscriminator = [154, 63, 181, 53, 19, 26, 117, 45];
function createSkipInstruction(accounts, args, programId) {
  const [data] = skipStruct.serialize({
    instructionDiscriminator: skipInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.signer,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.oappRegistry,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.nonce,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.pendingInboundNonce,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.payloadHash,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.endpoint,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createSkipInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.signer,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.oappRegistry,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.nonce,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.pendingInboundNonce,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.payloadHash,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.endpoint,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var transferAdminParamsBeet = new beet159.BeetArgsStruct(
  [["admin", beetSolana85.publicKey]],
  "TransferAdminParams"
);

// src/generated/endpoint/instructions/transferAdmin.ts
var transferAdminStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", transferAdminParamsBeet]
  ],
  "TransferAdminInstructionArgs"
);
var transferAdminInstructionDiscriminator = [
  42,
  242,
  66,
  106,
  228,
  10,
  111,
  156
];
function createTransferAdminInstruction(accounts, args, programId) {
  const [data] = transferAdminStruct.serialize({
    instructionDiscriminator: transferAdminInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.endpoint,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createTransferAdminInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.endpoint,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var verifyParamsBeet = new beet159.BeetArgsStruct(
  [
    ["srcEid", beet159.u32],
    ["sender", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["receiver", beetSolana85.publicKey],
    ["nonce", beet159.u64],
    ["payloadHash", beet159.uniformFixedSizeArray(beet159.u8, 32)]
  ],
  "VerifyParams"
);

// src/generated/endpoint/instructions/verify.ts
var verifyStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", verifyParamsBeet]
  ],
  "VerifyInstructionArgs"
);
var verifyInstructionDiscriminator = [
  133,
  161,
  141,
  48,
  120,
  198,
  88,
  150
];
function createVerifyInstruction(accounts, args, programId) {
  const [data] = verifyStruct.serialize({
    instructionDiscriminator: verifyInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.receiveLibrary,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.receiveLibraryConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.defaultReceiveLibraryConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.nonce,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.pendingInboundNonce,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.payloadHash,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createVerifyInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.receiveLibrary,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.receiveLibraryConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.defaultReceiveLibraryConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.nonce,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.pendingInboundNonce,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.payloadHash,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var withdrawRentParamsBeet = new beet159.BeetArgsStruct(
  [["amount", beet159.u64]],
  "WithdrawRentParams"
);

// src/generated/endpoint/instructions/withdrawRent.ts
var withdrawRentStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", withdrawRentParamsBeet]
  ],
  "WithdrawRentInstructionArgs"
);
var withdrawRentInstructionDiscriminator = [
  226,
  7,
  41,
  158,
  173,
  111,
  192,
  107
];
function createWithdrawRentInstruction(accounts, args, programId) {
  const [data] = withdrawRentStruct.serialize({
    instructionDiscriminator: withdrawRentInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.endpoint,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.receiver,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createWithdrawRentInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.endpoint,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.receiver,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}

// src/generated/endpoint/types/index.ts
var types_exports = {};
__export(types_exports, {
  MessageLibType: () => MessageLibType,
  burnParamsBeet: () => burnParamsBeet,
  clearComposeParamsBeet: () => clearComposeParamsBeet,
  clearParamsBeet: () => clearParamsBeet,
  initConfigParamsBeet: () => initConfigParamsBeet,
  initDefaultReceiveLibraryParamsBeet: () => initDefaultReceiveLibraryParamsBeet,
  initDefaultSendLibraryParamsBeet: () => initDefaultSendLibraryParamsBeet,
  initEndpointParamsBeet: () => initEndpointParamsBeet,
  initNonceParamsBeet: () => initNonceParamsBeet,
  initReceiveLibraryParamsBeet: () => initReceiveLibraryParamsBeet,
  initSendLibraryParamsBeet: () => initSendLibraryParamsBeet,
  initVerifyParamsBeet: () => initVerifyParamsBeet,
  lzComposeAlertParamsBeet: () => lzComposeAlertParamsBeet,
  lzReceiveAlertParamsBeet: () => lzReceiveAlertParamsBeet,
  messageLibTypeBeet: () => messageLibTypeBeet,
  messagingFeeBeet: () => messagingFeeBeet,
  messagingReceiptBeet: () => messagingReceiptBeet,
  nilifyParamsBeet: () => nilifyParamsBeet,
  quoteParamsBeet: () => quoteParamsBeet,
  receiveLibraryTimeoutBeet: () => receiveLibraryTimeoutBeet,
  registerLibraryParamsBeet: () => registerLibraryParamsBeet,
  registerOAppParamsBeet: () => registerOAppParamsBeet,
  sendComposeParamsBeet: () => sendComposeParamsBeet,
  sendParamsBeet: () => sendParamsBeet,
  setConfigParamsBeet: () => setConfigParamsBeet,
  setDefaultReceiveLibraryParamsBeet: () => setDefaultReceiveLibraryParamsBeet,
  setDefaultReceiveLibraryTimeoutParamsBeet: () => setDefaultReceiveLibraryTimeoutParamsBeet,
  setDefaultSendLibraryParamsBeet: () => setDefaultSendLibraryParamsBeet,
  setDelegateParamsBeet: () => setDelegateParamsBeet,
  setLzTokenParamsBeet: () => setLzTokenParamsBeet,
  setReceiveLibraryParamsBeet: () => setReceiveLibraryParamsBeet,
  setReceiveLibraryTimeoutParamsBeet: () => setReceiveLibraryTimeoutParamsBeet,
  setSendLibraryParamsBeet: () => setSendLibraryParamsBeet,
  skipParamsBeet: () => skipParamsBeet,
  transferAdminParamsBeet: () => transferAdminParamsBeet,
  verifyParamsBeet: () => verifyParamsBeet,
  withdrawRentParamsBeet: () => withdrawRentParamsBeet
});
var messagingFeeBeet = new beet159.BeetArgsStruct(
  [
    ["nativeFee", beet159.u64],
    ["lzTokenFee", beet159.u64]
  ],
  "MessagingFee"
);
var messagingReceiptBeet = new beet159.BeetArgsStruct(
  [
    ["guid", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["nonce", beet159.u64],
    ["fee", messagingFeeBeet]
  ],
  "MessagingReceipt"
);

// src/generated/endpoint/index.ts
var PROGRAM_ADDRESS = "76y77prsiCMvXMjuoZ5VRrhG5qYBrUMYTE5WgHqgjEn6";
var PROGRAM_ID = new PublicKey(PROGRAM_ADDRESS);

// src/generated/endpoint/events/index.ts
var events_exports = {};
__export(events_exports, {
  adminTransferredEventBeet: () => adminTransferredEventBeet,
  composeDeliveredEventBeet: () => composeDeliveredEventBeet,
  composeSentEventBeet: () => composeSentEventBeet,
  defaultReceiveLibrarySetEventBeet: () => defaultReceiveLibrarySetEventBeet,
  defaultReceiveLibraryTimeoutSetEventBeet: () => defaultReceiveLibraryTimeoutSetEventBeet,
  defaultSendLibrarySetEventBeet: () => defaultSendLibrarySetEventBeet,
  delegateSetEventBeet: () => delegateSetEventBeet,
  inboundNonceSkippedEventBeet: () => inboundNonceSkippedEventBeet,
  libraryRegisteredEventBeet: () => libraryRegisteredEventBeet,
  lzComposeAlertEventBeet: () => lzComposeAlertEventBeet,
  lzReceiveAlertEventBeet: () => lzReceiveAlertEventBeet,
  lzTokenSetEventBeet: () => lzTokenSetEventBeet,
  oAppRegisteredEventBeet: () => oAppRegisteredEventBeet,
  packetBurntEventBeet: () => packetBurntEventBeet,
  packetDeliveredEventBeet: () => packetDeliveredEventBeet,
  packetNilifiedEventBeet: () => packetNilifiedEventBeet,
  packetSentEventBeet: () => packetSentEventBeet,
  packetVerifiedEventBeet: () => packetVerifiedEventBeet,
  receiveLibrarySetEventBeet: () => receiveLibrarySetEventBeet,
  receiveLibraryTimeoutSetEventBeet: () => receiveLibraryTimeoutSetEventBeet,
  rentWithdrawnEventBeet: () => rentWithdrawnEventBeet,
  sendLibrarySetEventBeet: () => sendLibrarySetEventBeet
});
var adminTransferredEventBeet = new beet159.BeetArgsStruct(
  [["newAdmin", beetSolana85.publicKey]],
  "AdminTransferredEvent"
);
var composeDeliveredEventBeet = new beet159.BeetArgsStruct(
  [
    ["from", beetSolana85.publicKey],
    ["to", beetSolana85.publicKey],
    ["guid", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["index", beet159.u16]
  ],
  "ComposeDeliveredEvent"
);
var composeSentEventBeet = new beet159.FixableBeetArgsStruct(
  [
    ["from", beetSolana85.publicKey],
    ["to", beetSolana85.publicKey],
    ["guid", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["index", beet159.u16],
    ["message", beet159.bytes]
  ],
  "ComposeSentEvent"
);
var defaultReceiveLibrarySetEventBeet = new beet159.BeetArgsStruct(
  [
    ["eid", beet159.u32],
    ["newLib", beetSolana85.publicKey]
  ],
  "DefaultReceiveLibrarySetEvent"
);
var defaultReceiveLibraryTimeoutSetEventBeet = new beet159.FixableBeetArgsStruct(
  [
    ["eid", beet159.u32],
    ["timeout", beet159.coption(receiveLibraryTimeoutBeet)]
  ],
  "DefaultReceiveLibraryTimeoutSetEvent"
);
var defaultSendLibrarySetEventBeet = new beet159.BeetArgsStruct(
  [
    ["eid", beet159.u32],
    ["newLib", beetSolana85.publicKey]
  ],
  "DefaultSendLibrarySetEvent"
);
var delegateSetEventBeet = new beet159.BeetArgsStruct(
  [["newDelegate", beetSolana85.publicKey]],
  "DelegateSetEvent"
);
var inboundNonceSkippedEventBeet = new beet159.BeetArgsStruct(
  [
    ["srcEid", beet159.u32],
    ["sender", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["receiver", beetSolana85.publicKey],
    ["nonce", beet159.u64]
  ],
  "InboundNonceSkippedEvent"
);
var libraryRegisteredEventBeet = new beet159.BeetArgsStruct(
  [
    ["newLib", beetSolana85.publicKey],
    ["newLibProgram", beetSolana85.publicKey]
  ],
  "LibraryRegisteredEvent"
);
var lzComposeAlertEventBeet = new beet159.FixableBeetArgsStruct(
  [
    ["executor", beetSolana85.publicKey],
    ["from", beetSolana85.publicKey],
    ["to", beetSolana85.publicKey],
    ["guid", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["index", beet159.u16],
    ["computeUnits", beet159.u64],
    ["value", beet159.u64],
    ["message", beet159.bytes],
    ["extraData", beet159.bytes],
    ["reason", beet159.bytes]
  ],
  "LzComposeAlertEvent"
);
var lzReceiveAlertEventBeet = new beet159.FixableBeetArgsStruct(
  [
    ["receiver", beetSolana85.publicKey],
    ["executor", beetSolana85.publicKey],
    ["srcEid", beet159.u32],
    ["sender", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["nonce", beet159.u64],
    ["guid", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["computeUnits", beet159.u64],
    ["value", beet159.u64],
    ["message", beet159.bytes],
    ["extraData", beet159.bytes],
    ["reason", beet159.bytes]
  ],
  "LzReceiveAlertEvent"
);
var lzTokenSetEventBeet = new beet159.FixableBeetArgsStruct(
  [["token", beet159.coption(beetSolana85.publicKey)]],
  "LzTokenSetEvent"
);
var oAppRegisteredEventBeet = new beet159.BeetArgsStruct(
  [
    ["oapp", beetSolana85.publicKey],
    ["delegate", beetSolana85.publicKey]
  ],
  "OAppRegisteredEvent"
);
var packetBurntEventBeet = new beet159.BeetArgsStruct(
  [
    ["srcEid", beet159.u32],
    ["sender", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["receiver", beetSolana85.publicKey],
    ["nonce", beet159.u64],
    ["payloadHash", beet159.uniformFixedSizeArray(beet159.u8, 32)]
  ],
  "PacketBurntEvent"
);
var packetDeliveredEventBeet = new beet159.BeetArgsStruct(
  [
    ["srcEid", beet159.u32],
    ["sender", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["receiver", beetSolana85.publicKey],
    ["nonce", beet159.u64]
  ],
  "PacketDeliveredEvent"
);
var packetNilifiedEventBeet = new beet159.BeetArgsStruct(
  [
    ["srcEid", beet159.u32],
    ["sender", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["receiver", beetSolana85.publicKey],
    ["nonce", beet159.u64],
    ["payloadHash", beet159.uniformFixedSizeArray(beet159.u8, 32)]
  ],
  "PacketNilifiedEvent"
);
var packetSentEventBeet = new beet159.FixableBeetArgsStruct(
  [
    ["encodedPacket", beet159.bytes],
    ["options", beet159.bytes],
    ["sendLibrary", beetSolana85.publicKey]
  ],
  "PacketSentEvent"
);
var packetVerifiedEventBeet = new beet159.BeetArgsStruct(
  [
    ["srcEid", beet159.u32],
    ["sender", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["receiver", beetSolana85.publicKey],
    ["nonce", beet159.u64],
    ["payloadHash", beet159.uniformFixedSizeArray(beet159.u8, 32)]
  ],
  "PacketVerifiedEvent"
);
var receiveLibrarySetEventBeet = new beet159.BeetArgsStruct(
  [
    ["receiver", beetSolana85.publicKey],
    ["eid", beet159.u32],
    ["newLib", beetSolana85.publicKey]
  ],
  "ReceiveLibrarySetEvent"
);
var receiveLibraryTimeoutSetEventBeet = new beet159.FixableBeetArgsStruct(
  [
    ["receiver", beetSolana85.publicKey],
    ["eid", beet159.u32],
    ["timeout", beet159.coption(receiveLibraryTimeoutBeet)]
  ],
  "ReceiveLibraryTimeoutSetEvent"
);
var rentWithdrawnEventBeet = new beet159.BeetArgsStruct(
  [
    ["receiver", beetSolana85.publicKey],
    ["amount", beet159.u64]
  ],
  "RentWithdrawnEvent"
);
var sendLibrarySetEventBeet = new beet159.BeetArgsStruct(
  [
    ["sender", beetSolana85.publicKey],
    ["eid", beet159.u32],
    ["newLib", beetSolana85.publicKey]
  ],
  "SendLibrarySetEvent"
);

// src/endpoint.ts
var EventEmitDiscriminator = "e445a52e51cb9a1d";
var DefaultMessageLib = PublicKey.default;
var Endpoint = class {
  constructor(program) {
    this.program = program;
    this.deriver = new EndpointPDADeriver(program);
    const [eventAuthorityPDA] = new EventPDADeriver(program).eventAuthority();
    this.eventAuthorityPDA = eventAuthorityPDA;
  }
  /**
   * init endpoint settings, including eid, admin, it also registers the blocked message lib
   */
  initEndpoint(endpointId, payer, admin) {
    const [settingPDA] = this.deriver.setting();
    return createInitEndpointInstruction(
      {
        payer,
        endpoint: settingPDA
      },
      {
        params: {
          eid: endpointId,
          admin
        }
      },
      this.program
    );
  }
  // async initOrUpdateConfig(connection:Connection,)
  /***
   * call this function after endpoint initialized. Only admin can call this function.
   */
  registerLibrary(admin, messageLibProgram, libType = 2 /* SendAndReceive */) {
    const [msgLibPda] = new MessageLibPDADeriver(messageLibProgram).messageLib();
    const [msgLibInfoPda] = this.deriver.messageLibraryInfo(msgLibPda);
    const [settingPDA] = this.deriver.setting();
    return createRegisterLibraryInstruction(
      {
        admin,
        endpoint: settingPDA,
        messageLibInfo: msgLibInfoPda,
        eventAuthority: this.eventAuthorityPDA,
        program: this.program
      },
      {
        params: {
          libProgram: messageLibProgram,
          libType
        }
      },
      this.program
    );
  }
  async setDefaultSendLibrary(connection, admin, messageLibProgram, dstEid, commitmentOrConfig) {
    const [msgLib] = new MessageLibPDADeriver(messageLibProgram).messageLib();
    const [defaultSendLibConfig] = this.deriver.defaultSendLibraryConfig(dstEid);
    const [settingPDA] = this.deriver.setting();
    const [msgLibInfo] = this.deriver.messageLibraryInfo(msgLib);
    const info = await connection.getAccountInfo(defaultSendLibConfig, commitmentOrConfig);
    if (!info) {
      return createInitDefaultSendLibraryInstruction(
        {
          admin,
          endpoint: settingPDA,
          defaultSendLibraryConfig: defaultSendLibConfig,
          messageLibInfo: msgLibInfo,
          program: this.program,
          eventAuthority: this.eventAuthorityPDA
        },
        {
          params: {
            eid: dstEid,
            newLib: msgLib
          }
        },
        this.program
      );
    } else {
      const sendLibConfig = await SendLibraryConfig.fromAccountAddress(
        connection,
        defaultSendLibConfig,
        commitmentOrConfig
      );
      if (sendLibConfig.messageLib.toBase58() === msgLib.toBase58()) {
        return null;
      }
      return createSetDefaultSendLibraryInstruction(
        {
          admin,
          endpoint: settingPDA,
          defaultSendLibraryConfig: defaultSendLibConfig,
          messageLibInfo: msgLibInfo,
          program: this.program,
          eventAuthority: this.eventAuthorityPDA
        },
        {
          params: {
            eid: dstEid,
            newLib: msgLib
          }
        },
        this.program
      );
    }
  }
  async setDefaultReceiveLibrary(connection, admin, messageLibProgram, srcEid, commitmentOrConfig) {
    const [msgLib] = new MessageLibPDADeriver(messageLibProgram).messageLib();
    const [defaultReceiveLibConfig] = this.deriver.defaultReceiveLibraryConfig(srcEid);
    const [settingPDA] = this.deriver.setting();
    const [defaultMsgLibInfo] = this.deriver.messageLibraryInfo(msgLib);
    const info = await connection.getAccountInfo(defaultReceiveLibConfig, commitmentOrConfig);
    if (!info) {
      return createInitDefaultReceiveLibraryInstruction(
        {
          admin,
          endpoint: settingPDA,
          defaultReceiveLibraryConfig: defaultReceiveLibConfig,
          messageLibInfo: defaultMsgLibInfo,
          program: this.program,
          eventAuthority: this.eventAuthorityPDA
        },
        {
          params: {
            eid: srcEid,
            newLib: msgLib
          }
        },
        this.program
      );
    } else {
      const receiveLibConfig = await ReceiveLibraryConfig.fromAccountAddress(
        connection,
        defaultReceiveLibConfig,
        commitmentOrConfig
      );
      if (receiveLibConfig.messageLib.toBase58() === msgLib.toBase58()) {
        return null;
      }
      return createSetDefaultReceiveLibraryInstruction(
        {
          admin,
          endpoint: settingPDA,
          defaultReceiveLibraryConfig: defaultReceiveLibConfig,
          messageLibInfo: defaultMsgLibInfo,
          program: this.program,
          eventAuthority: this.eventAuthorityPDA
        },
        {
          params: {
            eid: srcEid,
            newLib: msgLib,
            gracePeriod: 0
            // TODO: set grace period
          }
        },
        this.program
      );
    }
  }
  initOAppConfig(delegate, msgLibSDK, payer, oappID, eid) {
    const [msgLib] = new MessageLibPDADeriver(msgLibSDK.program).messageLib();
    const [oappRegistry] = this.deriver.oappRegistry(oappID);
    const [msgLibInfo] = this.deriver.messageLibraryInfo(msgLib);
    return createInitConfigInstruction(
      {
        delegate,
        oappRegistry,
        messageLib: msgLib,
        messageLibInfo: msgLibInfo,
        messageLibProgram: msgLibSDK.program,
        anchorRemainingAccounts: msgLibSDK.getInitConfigIXAccountMetaForCPI(payer, oappID, eid)
      },
      {
        params: {
          eid,
          oapp: oappID
        }
      },
      this.program
    );
  }
  initOAppNonce(delegate, dstEid, oappIDPDA2, remoteOappAddr) {
    const [nonce] = this.deriver.nonce(oappIDPDA2, dstEid, remoteOappAddr);
    const [pendingNonce] = this.deriver.pendingNonce(oappIDPDA2, dstEid, remoteOappAddr);
    const [oappRegistry] = this.deriver.oappRegistry(oappIDPDA2);
    return createInitNonceInstruction(
      {
        nonce,
        pendingInboundNonce: pendingNonce,
        oappRegistry,
        delegate
      },
      {
        params: {
          localOapp: oappIDPDA2,
          remoteOapp: Array.from(remoteOappAddr),
          remoteEid: dstEid
        }
      },
      this.program
    );
  }
  initSendLibrary(delegate, sender, dstEid) {
    const [oappRegistry] = this.deriver.oappRegistry(sender);
    const [sendLibraryConfig] = this.deriver.sendLibraryConfig(sender, dstEid);
    return createInitSendLibraryInstruction(
      {
        delegate,
        oappRegistry,
        sendLibraryConfig
      },
      {
        params: {
          sender,
          eid: dstEid
        }
      },
      this.program
    );
  }
  setSendLibrary(oappAdmin, oappIDPDA2, newSendLibProgram, dstEid) {
    const [newSendLib] = new MessageLibPDADeriver(newSendLibProgram).messageLib();
    const [sendLibraryConfig] = this.deriver.sendLibraryConfig(oappIDPDA2, dstEid);
    const [sendLibraryInfo] = this.deriver.messageLibraryInfo(newSendLib);
    const [oappRegistry] = this.deriver.oappRegistry(oappIDPDA2);
    const ix = createSetSendLibraryInstruction(
      {
        signer: oappAdmin,
        sendLibraryConfig,
        messageLibInfo: sendLibraryInfo,
        oappRegistry,
        program: this.program,
        eventAuthority: this.eventAuthorityPDA
      },
      {
        params: {
          sender: oappIDPDA2,
          eid: dstEid,
          newLib: newSendLib
        }
      },
      this.program
    );
    return ix;
  }
  initReceiveLibrary(delegate, receiver, srcEid) {
    const [oappRegistry] = this.deriver.oappRegistry(receiver);
    const [receiveLibraryConfig] = this.deriver.receiveLibraryConfig(receiver, srcEid);
    return createInitReceiveLibraryInstruction(
      {
        delegate,
        oappRegistry,
        receiveLibraryConfig
      },
      {
        params: {
          receiver,
          eid: srcEid
        }
      },
      this.program
    );
  }
  setReceiveLibrary(oappAdmin, oappIDPDA2, newReceiveLibProgram, srcEid, gracePeriod) {
    const [newReceiveLib] = new MessageLibPDADeriver(newReceiveLibProgram).messageLib();
    const [receiveLibraryConfig] = this.deriver.receiveLibraryConfig(oappIDPDA2, srcEid);
    const [receiveLibraryInfo] = this.deriver.messageLibraryInfo(newReceiveLib);
    const [oappRegistry] = this.deriver.oappRegistry(oappIDPDA2);
    const ix = createSetReceiveLibraryInstruction(
      {
        signer: oappAdmin,
        receiveLibraryConfig,
        messageLibInfo: receiveLibraryInfo,
        oappRegistry,
        program: this.program,
        eventAuthority: this.eventAuthorityPDA
      },
      {
        params: {
          receiver: oappIDPDA2,
          eid: srcEid,
          newLib: newReceiveLib,
          gracePeriod: gracePeriod === void 0 ? 0 : new BN(gracePeriod.toString())
        }
      },
      this.program
    );
    return ix;
  }
  async setOappConfig(connection, oappDelegate, oappID, msgLibProgram, eid, config, commitment = "confirmed") {
    const [msgLib] = new MessageLibPDADeriver(msgLibProgram).messageLib();
    const [msgLibInfo] = this.deriver.messageLibraryInfo(msgLib);
    const msgLibVersion = await this.getMessageLibVersion(connection, oappDelegate, msgLibProgram, commitment);
    let msgLibClient;
    if (msgLibVersion?.major.toString() === "0" && msgLibVersion.minor == 0 && msgLibVersion.endpointVersion == 2) {
      msgLibClient = new simple_message_lib_exports.SimpleMessageLib(msgLibProgram);
    } else if (msgLibVersion?.major.toString() === "3" && msgLibVersion.minor == 0 && msgLibVersion.endpointVersion == 2) {
      msgLibClient = new uln_exports.Uln(msgLibProgram);
    } else {
      throw new Error(
        `unsupported message lib version ${msgLibVersion?.major.toString()}.${msgLibVersion?.minor.toString()}`
      );
    }
    const [oappRegistry] = this.deriver.oappRegistry(oappID);
    const ix = createSetConfigInstruction(
      {
        signer: oappDelegate,
        messageLibInfo: msgLibInfo,
        messageLib: msgLib,
        messageLibProgram: msgLibProgram,
        oappRegistry,
        anchorRemainingAccounts: await msgLibClient.getSetConfigIXAccountMetaForCPI(this.program, oappID, eid)
      },
      {
        params: {
          eid,
          configType: config.configType,
          config: msgLibProgram.toBase58() === simple_message_lib_exports.PROGRAM_ID.toBase58() ? new Uint8Array(10) : uln_exports.Uln.constructSetConfigData(config.configType, config.value),
          oapp: oappID
        }
      },
      this.program
    );
    return ix;
  }
  /// send a simulated transaction to the endpoint to get the fee for sending a message
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
  async getQuoteIXAccountMetaForCPI(connection, payer, path, msgLibProgram) {
    const { sender: sender_, dstEid, receiver: receiver_ } = path;
    const sender = new PublicKey(arrayify(sender_));
    const receiver = addressToBytes32(receiver_);
    const sendLibInfo = await this.getSendLibrary(connection, sender, dstEid);
    if (!sendLibInfo?.programId) {
      throw new Error("default send library not initialized or blocked message lib");
    }
    const { msgLib, programId: owner } = sendLibInfo;
    const [sendLibraryInfo] = this.deriver.messageLibraryInfo(msgLib);
    const remainingAccounts = await msgLibProgram.getQuoteIXAccountMetaForCPI(connection, payer, path);
    const [setting] = this.deriver.setting();
    const [defaultSendLibraryConfig] = this.deriver.defaultSendLibraryConfig(dstEid);
    const [sendLibraryConfig] = this.deriver.sendLibraryConfig(sender, dstEid);
    const [nonce] = this.deriver.nonce(sender, dstEid, receiver);
    const accounts = createQuoteInstructionAccounts(
      {
        sendLibraryConfig,
        sendLibraryProgram: owner,
        defaultSendLibraryConfig,
        endpoint: setting,
        nonce,
        sendLibraryInfo,
        anchorRemainingAccounts: remainingAccounts
      },
      this.program
    );
    return Promise.resolve(
      [
        {
          pubkey: this.program,
          isSigner: false,
          isWritable: false
        }
      ].concat(accounts)
    );
  }
  /***
   * Get the account meta of the send instruction for CPI(Cross-Program Invocation )
   */
  async getSendIXAccountMetaForCPI(connection, payer, path, msgLibProgram, commitmentOrConfig) {
    const { sender: sender_, dstEid, receiver: receiver_ } = path;
    const sender = new PublicKey(arrayify(sender_));
    const receiver = addressToBytes32(receiver_);
    const info = await this.getSendLibrary(connection, sender, dstEid, commitmentOrConfig);
    if (!info?.programId) {
      throw new Error("default send library not initialized or blocked message lib");
    }
    const sendLibrary = info.msgLib;
    const [sendLibraryInfo] = this.deriver.messageLibraryInfo(sendLibrary);
    const remainingAccounts = await msgLibProgram.getSendIXAccountMetaForCPI(connection, payer, path);
    const [defaultSendLibraryConfig] = this.deriver.defaultSendLibraryConfig(dstEid);
    const [sendLibraryConfig] = this.deriver.sendLibraryConfig(sender, dstEid);
    const [nonce] = this.deriver.nonce(sender, dstEid, receiver);
    const accounts = createSendInstructionAccounts(
      {
        sender,
        //signer
        /// this account should be derived from message lib
        sendLibraryProgram: info.programId,
        sendLibraryConfig,
        defaultSendLibraryConfig,
        sendLibraryInfo,
        endpoint: this.deriver.setting()[0],
        program: this.program,
        nonce,
        eventAuthority: this.eventAuthorityPDA,
        anchorRemainingAccounts: remainingAccounts
      },
      this.program
    );
    accounts.forEach((item) => {
      item.isSigner = false;
    });
    return [
      {
        pubkey: this.program,
        isSigner: false,
        isWritable: false
      }
    ].concat(accounts);
  }
  async skip(payer, sender, receiver, srcEid, nonce) {
    const [nonceAccount] = this.deriver.nonce(receiver, srcEid, addressToBytes32(sender.toBase58()));
    const [payloadHash] = this.deriver.payloadHash(receiver, srcEid, sender.toBytes(), parseInt(nonce));
    const [pendingInboundNonce] = this.deriver.pendingNonce(receiver, srcEid, sender.toBytes());
    const [oAppRegistry] = PublicKey.findProgramAddressSync(
      [Buffer.from(OAPP_SEED, "utf-8"), receiver.toBuffer()],
      this.program
    );
    const ix = createSkipInstruction(
      {
        signer: payer,
        oappRegistry: oAppRegistry,
        nonce: nonceAccount,
        pendingInboundNonce,
        payloadHash,
        endpoint: this.deriver.setting()[0],
        eventAuthority: this.eventAuthorityPDA,
        program: this.program
      },
      {
        params: {
          receiver,
          srcEid,
          sender: Array.from(sender.toBytes()),
          nonce: new BN(nonce)
        }
      },
      this.program
    );
    return Promise.resolve(ix);
  }
  async initVerify(connection, payer, sender, receiver, srcEid, nonce, commitmentOrConfig) {
    const [nonceAccount] = this.deriver.nonce(receiver, srcEid, addressToBytes32(sender.toBase58()));
    const [payloadHash] = this.deriver.payloadHash(receiver, srcEid, sender.toBytes(), parseInt(nonce));
    const payloadHashInfo = await connection.getAccountInfo(payloadHash, commitmentOrConfig);
    if (payloadHashInfo) {
      return null;
    }
    return createInitVerifyInstruction(
      {
        payer,
        nonce: nonceAccount,
        payloadHash
      },
      {
        params: {
          srcEid,
          sender: Array.from(sender.toBytes()),
          receiver,
          nonce: new BN(nonce)
        }
      },
      this.program
    );
  }
  getVerifyIXAccountMetaForCPI(packet, receiveLibrary) {
    const receiver = new PublicKey(Buffer.from(packet.receiver().slice(2), "hex"));
    const srcEid = packet.srcEid();
    const sender = addressToBytes32(packet.sender());
    const [payloadHash] = this.deriver.payloadHash(receiver, srcEid, sender, parseInt(packet.nonce()));
    const [defaultReceiveLibraryConfig] = this.deriver.defaultReceiveLibraryConfig(srcEid);
    const [receiveLibraryConfig] = this.deriver.receiveLibraryConfig(receiver, srcEid);
    const [nonce] = this.deriver.nonce(receiver, srcEid, sender);
    const [pendingNonce] = this.deriver.pendingNonce(receiver, srcEid, sender);
    const accounts = createVerifyInstructionAccounts(
      {
        receiveLibrary,
        receiveLibraryConfig,
        defaultReceiveLibraryConfig,
        nonce,
        pendingInboundNonce: pendingNonce,
        payloadHash,
        program: this.program,
        eventAuthority: this.eventAuthorityPDA
      },
      this.program
    );
    accounts.forEach((key) => {
      key.isSigner = false;
    });
    const program = {
      pubkey: this.program,
      isSigner: false,
      isWritable: false
    };
    return [program, ...accounts];
  }
  /***
   * resetConfig is only supported by ULN
   */
  // async getResetConfigIXAccountMetaForCPI(
  //     connection: Connection,
  //     msgLibProgram: PublicKey,
  //     oappID: PublicKey,
  //     eid: number,
  //     commitmentOrConfig: Commitment | GetAccountInfoConfig = 'confirmed'
  // ): Promise<AccountMeta[]> {
  //     const uln = new UlnProgram.Uln(msgLibProgram)
  //     const [msgLib] = uln.ulnDeriver.messageLib()
  //     const [msgLibInfo] = this.endpointDeriver.messageLibraryAuthority(msgLib)
  //     const ix = instructions.createResetConfigInstruction(
  //         {
  //             oapp: oappID,
  //             messageLibAuthority: msgLibInfo,
  //             messageLib: msgLib,
  //             anchorRemainingAccounts: await uln.getResetConfigIXAccountMetaForCPI(
  //                 connection,
  //                 this.program,
  //                 oappID,
  //                 eid,
  //                 commitmentOrConfig
  //             ),
  //         } as instructions.ResetConfigInstructionAccounts,
  //         // Fake params. Just to get the ix.keys
  //         {
  //             params: {
  //                 eid: eid,
  //                 messageLib: msgLib,
  //             } as types.ResetConfigParams,
  //         } as instructions.ResetConfigInstructionArgs
  //     )
  //     ix.keys.forEach((key) => {
  //         key.isSigner = false
  //     })
  //     return [
  //         {
  //             pubkey: this.program,
  //             isWritable: false,
  //             isSigner: false,
  //         } as AccountMeta,
  //     ].concat(ix.keys)
  // }
  /**
   * snapshotConfig is only supported by ULN
   */
  // async getSnapshotConfigIXAccountMetaForCPI(
  //     connection: Connection,
  //     msgLibProgram: PublicKey,
  //     oappID: PublicKey,
  //     eid: number,
  //     commitmentOrConfig: Commitment | GetAccountInfoConfig = 'confirmed'
  // ): Promise<AccountMeta[]> {
  //     const uln = new UlnProgram.Uln(msgLibProgram)
  //     const [msgLib] = uln.ulnDeriver.messageLib()
  //     const [msgLibInfo] = this.endpointDeriver.messageLibraryAuthority(msgLib)
  //     const ix = instructions.createSnapshotConfigInstruction(
  //         {
  //             oapp: oappID,
  //             messageLibAuthority: msgLibInfo,
  //             messageLib: msgLib,
  //             anchorRemainingAccounts: await uln.getSnapshotConfigIXAccountMetaForCPI(
  //                 connection,
  //                 this.program,
  //                 oappID,
  //                 eid,
  //                 commitmentOrConfig
  //             ),
  //         } satisfies instructions.SnapshotConfigInstructionAccounts,
  //         // Fake params. Just to get the ix.keys
  //         {
  //             params: {
  //                 eid: eid,
  //                 messageLib: msgLib,
  //             } as types.SnapshotConfigParams,
  //         } as instructions.SnapshotConfigInstructionArgs
  //     )
  //     ix.keys.forEach((key) => {
  //         key.isSigner = false
  //     })
  //     return [
  //         {
  //             pubkey: this.program,
  //             isWritable: false,
  //             isSigner: false,
  //         },
  //     ].concat(ix.keys)
  // }
  /**
   * @param composer. The composer is usually the PDA of the app's ID. It depends on the oapp's implementation.
   */
  // getDeliverComposedMessageIXAccountMetaForCPI(
  //     payer: PublicKey,
  //     composer: PublicKey,
  //     packet: PacketV1Codec
  // ): AccountMeta[] {
  //     const receiver = new PublicKey(Buffer.from(packet.receiver().slice(2), 'hex'))
  //     const guid = Uint8Array.from(Buffer.from(packet.guid().slice(2), 'hex'))
  //     const message = ethers.utils.arrayify(ethers.utils.keccak256(packet.message()))
  //     const ix = instructions.createDeliverComposedMessageInstruction(
  //         {
  //             payer,
  //             receiver,
  //             composedMessage: this.endpointDeriver.composedMessage(receiver, guid, composer, message)[0],
  //             endpoint: this.endpointDeriver.setting()[0],
  //             endpointProgram: this.program,
  //         } satisfies instructions.DeliverComposedMessageInstructionAccounts,
  //         // Fake params. Just to get the ix.keys
  //         {
  //             params: {
  //                 composer: payer,
  //                 guid: Array.from(guid),
  //                 message: Uint8Array.from([]),
  //             } as types.DeliverComposedMessageParams,
  //         } as instructions.DeliverComposedMessageInstructionArgs
  //     )
  //     ix.keys.forEach((key) => {
  //         key.isSigner = false
  //     })
  //     return [
  //         {
  //             pubkey: this.program,
  //             isWritable: false,
  //             isSigner: false,
  //         },
  //     ].concat(ix.keys)
  // }
  /**
   * @param composer. The composer is usually the PDA of the app's ID. It depends on the oapp's implementation.
   */
  // getClearComposedMessageIXAccountMetaForCPI(composer: PublicKey, packet: PacketV1Codec): AccountMeta[] {
  //     const receiver = new PublicKey(Buffer.from(packet.receiver().slice(2), 'hex'))
  //     const guid = Uint8Array.from(Buffer.from(packet.guid().slice(2), 'hex'))
  //     const message = ethers.utils.arrayify(ethers.utils.keccak256(packet.message()))
  //     const ix = instructions.createClearComposedMessageInstruction(
  //         {
  //             composer,
  //             composedMessage: this.endpointDeriver.composedMessage(receiver, guid, composer, message)[0],
  //             endpoint: this.endpointDeriver.setting()[0],
  //             endpointProgram: this.program,
  //         } satisfies instructions.ClearComposedMessageInstructionAccounts,
  //         // Fake params. Just to get the ix.keys
  //         {
  //             params: {
  //                 receiver: composer,
  //                 guid: Array.from(guid),
  //                 message: Uint8Array.from([]),
  //             } as types.ClearComposedMessageParams,
  //         } as instructions.ClearComposedMessageInstructionArgs
  //     )
  //     ix.keys.forEach((key) => {
  //         key.isSigner = false
  //     })
  //     return [
  //         {
  //             pubkey: this.program,
  //             isWritable: false,
  //             isSigner: false,
  //         } as AccountMeta,
  //     ].concat(ix.keys)
  // }
  getRegisterOappIxAccountMetaForCPI(payer, oapp) {
    const [oappRegistry] = this.deriver.oappRegistry(oapp);
    const eventAuthority = this.eventAuthorityPDA;
    const keys = createRegisterOappInstructionAccounts(
      {
        payer,
        oapp,
        oappRegistry,
        eventAuthority,
        program: this.program
      },
      this.program
    );
    keys.forEach((key) => {
      key.isSigner = false;
    });
    return [
      {
        pubkey: this.program,
        isSigner: false,
        isWritable: false
      }
    ].concat(keys);
  }
  getSkipIxAccountMetaForCPI(receiver, sender, srcEid, nonce) {
    const [noncePDA] = this.deriver.nonce(receiver, srcEid, sender);
    const [pendingNonce] = this.deriver.pendingNonce(receiver, srcEid, sender);
    const [payloadHash] = this.deriver.payloadHash(receiver, srcEid, sender, nonce);
    const [oappRegistry] = this.deriver.oappRegistry(receiver);
    const keys = createSkipInstructionAccounts(
      {
        signer: receiver,
        oappRegistry,
        nonce: noncePDA,
        pendingInboundNonce: pendingNonce,
        payloadHash,
        endpoint: this.deriver.setting()[0],
        program: this.program,
        eventAuthority: this.eventAuthorityPDA
      },
      this.program
    );
    keys.forEach((key) => {
      key.isSigner = false;
    });
    return [
      {
        pubkey: this.program,
        isSigner: false,
        isWritable: false
      }
    ].concat(keys);
  }
  async isDefaultSendLibrary(connection, messageLibProgram, dstEid, commitmentOrConfig) {
    const [msgLib] = new MessageLibPDADeriver(messageLibProgram).messageLib();
    const info = await this.getDefaultSendLibrary(connection, dstEid, commitmentOrConfig);
    if (info) {
      return info.msgLib.equals(msgLib);
    }
    return false;
  }
  async isDefaultReceiveLibrary(connection, messageLibProgram, srcEid, commitmentOrConfig) {
    const [msgLib] = new MessageLibPDADeriver(messageLibProgram).messageLib();
    const info = await this.getDefaultReceiveLibrary(connection, srcEid, commitmentOrConfig);
    if (info) {
      return info.msgLib.equals(msgLib);
    }
    return false;
  }
  // all of below functions are retrieving accounts state
  async getSetting(connection, commitmentOrConfig) {
    const [setting] = this.deriver.setting();
    try {
      return await EndpointSettings.fromAccountAddress(connection, setting, commitmentOrConfig);
    } catch (e) {
      return null;
    }
  }
  /**
   *
   * @param messageLib  It is a PDA of the message library program
   */
  async getMessageLibInfo(connection, messageLibProgram, commitmentOrConfig) {
    const [msgLib] = new MessageLibPDADeriver(messageLibProgram).messageLib();
    const [messageLibInfo] = this.deriver.messageLibraryInfo(msgLib);
    try {
      return await MessageLibInfo.fromAccountAddress(connection, messageLibInfo, commitmentOrConfig);
    } catch (e) {
      return null;
    }
  }
  async getDefaultReceiveLibrary(connection, srcEid, commitmentOrConfig) {
    const [defaultReceiveLibConfig] = this.deriver.defaultReceiveLibraryConfig(srcEid);
    try {
      const defaultInfo = await ReceiveLibraryConfig.fromAccountAddress(
        connection,
        defaultReceiveLibConfig,
        commitmentOrConfig
      );
      const messageLibInfo = await connection.getAccountInfo(defaultInfo.messageLib, commitmentOrConfig);
      if (!messageLibInfo) {
        return {
          msgLib: defaultInfo.messageLib
        };
      }
      return {
        owner: messageLibInfo.owner,
        msgLib: defaultInfo.messageLib
      };
    } catch (e) {
      return null;
    }
  }
  async getDefaultSendLibrary(connection, dstEid, commitmentOrConfig) {
    const [defaultSendLibConfig] = this.deriver.defaultSendLibraryConfig(dstEid);
    try {
      const defaultInfo = await SendLibraryConfig.fromAccountAddress(
        connection,
        defaultSendLibConfig,
        commitmentOrConfig
      );
      const messageLibInfo = await connection.getAccountInfo(defaultInfo.messageLib, commitmentOrConfig);
      if (!messageLibInfo) {
        return {
          msgLib: defaultInfo.messageLib
        };
      }
      return {
        owner: messageLibInfo.owner,
        msgLib: defaultInfo.messageLib
      };
    } catch (e) {
      return null;
    }
  }
  /**
   * get app configured send library
   * 2 RPC calls
   */
  async getSendLibrary(connection, oappPda, dstEid, commitmentOrConfig = "confirmed") {
    const [sendLibConfig] = this.deriver.sendLibraryConfig(oappPda, dstEid);
    const [defaultSendLibConfig] = this.deriver.defaultSendLibraryConfig(dstEid);
    const [defaultSendLibConfigBuf, sendLibConfigBuf] = await connection.getMultipleAccountsInfo(
      [defaultSendLibConfig, sendLibConfig],
      commitmentOrConfig
    );
    if (!defaultSendLibConfigBuf || !sendLibConfigBuf) {
      console.warn("send library not initialized, return empty array");
      return null;
    }
    const [sendLibConfigInfo] = SendLibraryConfig.fromAccountInfo(sendLibConfigBuf, 0);
    const [defaultSendLibConfigInfo] = SendLibraryConfig.fromAccountInfo(defaultSendLibConfigBuf, 0);
    const msgLib = sendLibConfigInfo.messageLib.toString() === DefaultMessageLib.toString() ? defaultSendLibConfigInfo.messageLib : sendLibConfigInfo.messageLib;
    const isDefault = sendLibConfigInfo.messageLib.toString() === DefaultMessageLib.toString();
    const msgLibInfo = await connection.getAccountInfo(msgLib, commitmentOrConfig);
    if (!msgLibInfo) {
      return {
        programId: void 0,
        msgLib,
        isDefault
      };
    } else {
      return {
        programId: msgLibInfo.owner,
        msgLib,
        isDefault
      };
    }
  }
  /**
   * get app configured receive library
   */
  async getReceiveLibrary(connection, oappPda, srcEid, commitmentOrConfig) {
    const [receiveLibConfig] = this.deriver.receiveLibraryConfig(oappPda, srcEid);
    const accountInfo = await connection.getAccountInfo(receiveLibConfig, commitmentOrConfig);
    if (accountInfo == null) {
      return null;
    }
    const [info] = ReceiveLibraryConfig.fromAccountInfo(accountInfo, 0);
    if (info.messageLib.toString() == DefaultMessageLib.toString()) {
      const [defaultReceiveLibConfig] = this.deriver.defaultReceiveLibraryConfig(srcEid);
      const defaultInfo = await ReceiveLibraryConfig.fromAccountAddress(
        connection,
        defaultReceiveLibConfig,
        commitmentOrConfig
      );
      const messageLibInfo2 = await connection.getAccountInfo(defaultInfo.messageLib, commitmentOrConfig);
      if (messageLibInfo2) {
        const { timeout: timeout2 } = defaultInfo;
        if (timeout2) {
          return {
            programId: defaultInfo.messageLib,
            msgLib: defaultInfo.messageLib,
            isDefault: true,
            timeout: { msgLib: timeout2.messageLib, expiry: BigInt(timeout2.expiry.toString()) }
          };
        }
      }
      return {
        programId: messageLibInfo2?.owner,
        msgLib: defaultInfo.messageLib,
        isDefault: true,
        timeout: null
      };
    }
    const messageLibInfo = await connection.getAccountInfo(info.messageLib, commitmentOrConfig);
    invariant4(messageLibInfo, "messageLibInfo should not be null");
    const { timeout } = info;
    if (timeout) {
      return {
        programId: messageLibInfo.owner,
        msgLib: info.messageLib,
        isDefault: false,
        timeout: { msgLib: timeout.messageLib, expiry: BigInt(timeout.expiry.toString()) }
      };
    }
    return { programId: messageLibInfo.owner, msgLib: info.messageLib, isDefault: false, timeout: null };
  }
  // rename to a more generic name
  async getInboundPayloadHash(connection, receiver, srcEid, sender, nonce, _payloadHash, commitmentOrConfig) {
    const [payloadHashPDA] = this.deriver.payloadHash(receiver, srcEid, sender, nonce);
    const accountInfo = await connection.getAccountInfo(payloadHashPDA, commitmentOrConfig);
    if (!accountInfo) {
      return null;
    }
    return PayloadHash.fromAccountInfo(accountInfo, 0)[0];
  }
  async getComposedMessageState(connection, from, params, commitmentOrConfig) {
    const message = arrayify(keccak256(params.message));
    const [composedMessagePDA] = this.deriver.composedMessage(
      from,
      Uint8Array.from(params.guid),
      params.index,
      params.to,
      message
    );
    const accountInfo = await connection.getAccountInfo(composedMessagePDA, commitmentOrConfig);
    if (!accountInfo) {
      return null;
    }
    return ComposeMessageState.fromAccountInfo(accountInfo, 0)[0];
  }
  async getNonce(connection, oappIDPDA2, remoteEid, remoteOappAddr, commitmentOrConfig) {
    const [nonce] = this.deriver.nonce(oappIDPDA2, remoteEid, remoteOappAddr);
    try {
      return await Nonce.fromAccountAddress(connection, nonce, commitmentOrConfig);
    } catch (e) {
      return null;
    }
  }
  async getPendingInboundNonce(connection, oappIDPDA2, remoteEid, remoteOappAddr, commitmentOrConfig) {
    const [nonce] = this.deriver.pendingNonce(oappIDPDA2, remoteEid, remoteOappAddr);
    try {
      return await PendingInboundNonce.fromAccountAddress(connection, nonce, commitmentOrConfig);
    } catch (e) {
      return null;
    }
  }
  async getMessageLibVersion(connection, payer, messageLibProgram, commitment = "confirmed") {
    const ix = simple_message_lib_exports.instructions.createVersionInstruction(messageLibProgram);
    const simulateResp = await simulateTransaction(connection, [ix], messageLibProgram, payer, commitment);
    const version = simple_message_lib_exports.types.versionBeet.read(simulateResp, 0);
    return version;
  }
  async transferAdmin(connection, admin, newAdmin, commitment = "confirmed") {
    const [settingPDA] = this.deriver.setting();
    const endpointSettings = await EndpointSettings.fromAccountAddress(connection, settingPDA, commitment);
    if (endpointSettings.admin.toBase58() === newAdmin.toBase58()) {
      console.warn("endpoint admin not need change");
      return null;
    }
    return createTransferAdminInstruction(
      {
        admin,
        endpoint: settingPDA,
        eventAuthority: this.eventAuthorityPDA,
        program: this.program
      },
      {
        params: {
          admin: newAdmin
        }
      },
      this.program
    );
  }
};

// src/simple-message-lib.ts
var simple_message_lib_exports = {};
__export(simple_message_lib_exports, {
  PROGRAM_ID: () => PROGRAM_ID2,
  SimpleMessageLib: () => SimpleMessageLib,
  accounts: () => accounts_exports2,
  errors: () => errors_exports2,
  instructions: () => instructions_exports2,
  types: () => types_exports2
});

// src/generated/simple_messagelib/accounts/index.ts
var accounts_exports2 = {};
__export(accounts_exports2, {
  MessageLib: () => MessageLib,
  ReceiveConfigStore: () => ReceiveConfigStore,
  SendConfigStore: () => SendConfigStore,
  accountProviders: () => accountProviders2,
  messageLibBeet: () => messageLibBeet,
  messageLibDiscriminator: () => messageLibDiscriminator,
  receiveConfigStoreBeet: () => receiveConfigStoreBeet,
  receiveConfigStoreDiscriminator: () => receiveConfigStoreDiscriminator,
  sendConfigStoreBeet: () => sendConfigStoreBeet,
  sendConfigStoreDiscriminator: () => sendConfigStoreDiscriminator
});
var messageLibDiscriminator = [141, 191, 244, 48, 52, 174, 199, 209];
var MessageLib = class _MessageLib {
  constructor(eid, endpoint, endpointProgram, bump, admin, fee, lzTokenFee, wlCaller) {
    this.eid = eid;
    this.endpoint = endpoint;
    this.endpointProgram = endpointProgram;
    this.bump = bump;
    this.admin = admin;
    this.fee = fee;
    this.lzTokenFee = lzTokenFee;
    this.wlCaller = wlCaller;
  }
  /**
   * Creates a {@link MessageLib} instance from the provided args.
   */
  static fromArgs(args) {
    return new _MessageLib(
      args.eid,
      args.endpoint,
      args.endpointProgram,
      args.bump,
      args.admin,
      args.fee,
      args.lzTokenFee,
      args.wlCaller
    );
  }
  /**
   * Deserializes the {@link MessageLib} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(accountInfo, offset = 0) {
    return _MessageLib.deserialize(accountInfo.data, offset);
  }
  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link MessageLib} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(connection, address, commitmentOrConfig) {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    );
    if (accountInfo == null) {
      throw new Error(`Unable to find MessageLib account at ${address}`);
    }
    return _MessageLib.fromAccountInfo(accountInfo, 0)[0];
  }
  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(programId = new web314.PublicKey(
    "6GsmxMTHAAiFKfemuM4zBjumTjNSX5CAiw4xSSXM2Toy"
  )) {
    return beetSolana85.GpaBuilder.fromStruct(programId, messageLibBeet);
  }
  /**
   * Deserializes the {@link MessageLib} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf, offset = 0) {
    return messageLibBeet.deserialize(buf, offset);
  }
  /**
   * Serializes the {@link MessageLib} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize() {
    return messageLibBeet.serialize({
      accountDiscriminator: messageLibDiscriminator,
      ...this
    });
  }
  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link MessageLib}
   */
  static get byteSize() {
    return messageLibBeet.byteSize;
  }
  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link MessageLib} data from rent
   *
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(connection, commitment) {
    return connection.getMinimumBalanceForRentExemption(
      _MessageLib.byteSize,
      commitment
    );
  }
  /**
   * Determines if the provided {@link Buffer} has the correct byte size to
   * hold {@link MessageLib} data.
   */
  static hasCorrectByteSize(buf, offset = 0) {
    return buf.byteLength - offset === _MessageLib.byteSize;
  }
  /**
   * Returns a readable version of {@link MessageLib} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      eid: this.eid,
      endpoint: this.endpoint.toBase58(),
      endpointProgram: this.endpointProgram.toBase58(),
      bump: this.bump,
      admin: this.admin.toBase58(),
      fee: (() => {
        const x = this.fee;
        if (typeof x.toNumber === "function") {
          try {
            return x.toNumber();
          } catch (_) {
            return x;
          }
        }
        return x;
      })(),
      lzTokenFee: (() => {
        const x = this.lzTokenFee;
        if (typeof x.toNumber === "function") {
          try {
            return x.toNumber();
          } catch (_) {
            return x;
          }
        }
        return x;
      })(),
      wlCaller: this.wlCaller.toBase58()
    };
  }
};
var messageLibBeet = new beet159.BeetStruct(
  [
    ["accountDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["eid", beet159.u32],
    ["endpoint", beetSolana85.publicKey],
    ["endpointProgram", beetSolana85.publicKey],
    ["bump", beet159.u8],
    ["admin", beetSolana85.publicKey],
    ["fee", beet159.u64],
    ["lzTokenFee", beet159.u64],
    ["wlCaller", beetSolana85.publicKey]
  ],
  MessageLib.fromArgs,
  "MessageLib"
);
var receiveConfigStoreDiscriminator = [70, 73, 30, 1, 248, 48, 93, 125];
var ReceiveConfigStore = class _ReceiveConfigStore {
  constructor(bump, data) {
    this.bump = bump;
    this.data = data;
  }
  /**
   * Creates a {@link ReceiveConfigStore} instance from the provided args.
   */
  static fromArgs(args) {
    return new _ReceiveConfigStore(args.bump, args.data);
  }
  /**
   * Deserializes the {@link ReceiveConfigStore} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(accountInfo, offset = 0) {
    return _ReceiveConfigStore.deserialize(accountInfo.data, offset);
  }
  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link ReceiveConfigStore} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(connection, address, commitmentOrConfig) {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    );
    if (accountInfo == null) {
      throw new Error(`Unable to find ReceiveConfigStore account at ${address}`);
    }
    return _ReceiveConfigStore.fromAccountInfo(accountInfo, 0)[0];
  }
  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(programId = new web314.PublicKey(
    "6GsmxMTHAAiFKfemuM4zBjumTjNSX5CAiw4xSSXM2Toy"
  )) {
    return beetSolana85.GpaBuilder.fromStruct(programId, receiveConfigStoreBeet);
  }
  /**
   * Deserializes the {@link ReceiveConfigStore} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf, offset = 0) {
    return receiveConfigStoreBeet.deserialize(buf, offset);
  }
  /**
   * Serializes the {@link ReceiveConfigStore} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize() {
    return receiveConfigStoreBeet.serialize({
      accountDiscriminator: receiveConfigStoreDiscriminator,
      ...this
    });
  }
  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link ReceiveConfigStore} for the provided args.
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   */
  static byteSize(args) {
    const instance = _ReceiveConfigStore.fromArgs(args);
    return receiveConfigStoreBeet.toFixedFromValue({
      accountDiscriminator: receiveConfigStoreDiscriminator,
      ...instance
    }).byteSize;
  }
  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link ReceiveConfigStore} data from rent
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(args, connection, commitment) {
    return connection.getMinimumBalanceForRentExemption(
      _ReceiveConfigStore.byteSize(args),
      commitment
    );
  }
  /**
   * Returns a readable version of {@link ReceiveConfigStore} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      bump: this.bump,
      data: this.data
    };
  }
};
var receiveConfigStoreBeet = new beet159.FixableBeetStruct(
  [
    ["accountDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["bump", beet159.u8],
    ["data", beet159.bytes]
  ],
  ReceiveConfigStore.fromArgs,
  "ReceiveConfigStore"
);
var sendConfigStoreDiscriminator = [
  246,
  55,
  104,
  200,
  90,
  164,
  50,
  196
];
var SendConfigStore = class _SendConfigStore {
  constructor(bump, data) {
    this.bump = bump;
    this.data = data;
  }
  /**
   * Creates a {@link SendConfigStore} instance from the provided args.
   */
  static fromArgs(args) {
    return new _SendConfigStore(args.bump, args.data);
  }
  /**
   * Deserializes the {@link SendConfigStore} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(accountInfo, offset = 0) {
    return _SendConfigStore.deserialize(accountInfo.data, offset);
  }
  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link SendConfigStore} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(connection, address, commitmentOrConfig) {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    );
    if (accountInfo == null) {
      throw new Error(`Unable to find SendConfigStore account at ${address}`);
    }
    return _SendConfigStore.fromAccountInfo(accountInfo, 0)[0];
  }
  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(programId = new web314.PublicKey(
    "6GsmxMTHAAiFKfemuM4zBjumTjNSX5CAiw4xSSXM2Toy"
  )) {
    return beetSolana85.GpaBuilder.fromStruct(programId, sendConfigStoreBeet);
  }
  /**
   * Deserializes the {@link SendConfigStore} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf, offset = 0) {
    return sendConfigStoreBeet.deserialize(buf, offset);
  }
  /**
   * Serializes the {@link SendConfigStore} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize() {
    return sendConfigStoreBeet.serialize({
      accountDiscriminator: sendConfigStoreDiscriminator,
      ...this
    });
  }
  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link SendConfigStore} for the provided args.
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   */
  static byteSize(args) {
    const instance = _SendConfigStore.fromArgs(args);
    return sendConfigStoreBeet.toFixedFromValue({
      accountDiscriminator: sendConfigStoreDiscriminator,
      ...instance
    }).byteSize;
  }
  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link SendConfigStore} data from rent
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(args, connection, commitment) {
    return connection.getMinimumBalanceForRentExemption(
      _SendConfigStore.byteSize(args),
      commitment
    );
  }
  /**
   * Returns a readable version of {@link SendConfigStore} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      bump: this.bump,
      data: this.data
    };
  }
};
var sendConfigStoreBeet = new beet159.FixableBeetStruct(
  [
    ["accountDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["bump", beet159.u8],
    ["data", beet159.bytes]
  ],
  SendConfigStore.fromArgs,
  "SendConfigStore"
);

// src/generated/simple_messagelib/accounts/index.ts
var accountProviders2 = {
  MessageLib,
  ReceiveConfigStore,
  SendConfigStore
};

// src/generated/simple_messagelib/errors/index.ts
var errors_exports2 = {};
__export(errors_exports2, {
  InsufficientFeeError: () => InsufficientFeeError,
  InvalidAmountError: () => InvalidAmountError2,
  InvalidConfigTypeError: () => InvalidConfigTypeError,
  InvalidLzTokenMintError: () => InvalidLzTokenMintError,
  LzTokenUnavailableError: () => LzTokenUnavailableError2,
  OnlyRevertError: () => OnlyRevertError,
  OnlyWhitelistedCallerError: () => OnlyWhitelistedCallerError,
  SendReentrancyError: () => SendReentrancyError,
  errorFromCode: () => errorFromCode2,
  errorFromName: () => errorFromName2
});
var createErrorFromCodeLookup2 = /* @__PURE__ */ new Map();
var createErrorFromNameLookup2 = /* @__PURE__ */ new Map();
var OnlyWhitelistedCallerError = class _OnlyWhitelistedCallerError extends Error {
  constructor() {
    super("");
    this.code = 6e3;
    this.name = "OnlyWhitelistedCaller";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _OnlyWhitelistedCallerError);
    }
  }
};
createErrorFromCodeLookup2.set(6e3, () => new OnlyWhitelistedCallerError());
createErrorFromNameLookup2.set(
  "OnlyWhitelistedCaller",
  () => new OnlyWhitelistedCallerError()
);
var InsufficientFeeError = class _InsufficientFeeError extends Error {
  constructor() {
    super("");
    this.code = 6001;
    this.name = "InsufficientFee";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InsufficientFeeError);
    }
  }
};
createErrorFromCodeLookup2.set(6001, () => new InsufficientFeeError());
createErrorFromNameLookup2.set(
  "InsufficientFee",
  () => new InsufficientFeeError()
);
var InvalidAmountError2 = class _InvalidAmountError extends Error {
  constructor() {
    super("");
    this.code = 6002;
    this.name = "InvalidAmount";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidAmountError);
    }
  }
};
createErrorFromCodeLookup2.set(6002, () => new InvalidAmountError2());
createErrorFromNameLookup2.set("InvalidAmount", () => new InvalidAmountError2());
var InvalidConfigTypeError = class _InvalidConfigTypeError extends Error {
  constructor() {
    super("");
    this.code = 6003;
    this.name = "InvalidConfigType";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidConfigTypeError);
    }
  }
};
createErrorFromCodeLookup2.set(6003, () => new InvalidConfigTypeError());
createErrorFromNameLookup2.set(
  "InvalidConfigType",
  () => new InvalidConfigTypeError()
);
var InvalidLzTokenMintError = class _InvalidLzTokenMintError extends Error {
  constructor() {
    super("");
    this.code = 6004;
    this.name = "InvalidLzTokenMint";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidLzTokenMintError);
    }
  }
};
createErrorFromCodeLookup2.set(6004, () => new InvalidLzTokenMintError());
createErrorFromNameLookup2.set(
  "InvalidLzTokenMint",
  () => new InvalidLzTokenMintError()
);
var LzTokenUnavailableError2 = class _LzTokenUnavailableError extends Error {
  constructor() {
    super("");
    this.code = 6005;
    this.name = "LzTokenUnavailable";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _LzTokenUnavailableError);
    }
  }
};
createErrorFromCodeLookup2.set(6005, () => new LzTokenUnavailableError2());
createErrorFromNameLookup2.set(
  "LzTokenUnavailable",
  () => new LzTokenUnavailableError2()
);
var SendReentrancyError = class _SendReentrancyError extends Error {
  constructor() {
    super("");
    this.code = 6006;
    this.name = "SendReentrancy";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _SendReentrancyError);
    }
  }
};
createErrorFromCodeLookup2.set(6006, () => new SendReentrancyError());
createErrorFromNameLookup2.set("SendReentrancy", () => new SendReentrancyError());
var OnlyRevertError = class _OnlyRevertError extends Error {
  constructor() {
    super("");
    this.code = 6007;
    this.name = "OnlyRevert";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _OnlyRevertError);
    }
  }
};
createErrorFromCodeLookup2.set(6007, () => new OnlyRevertError());
createErrorFromNameLookup2.set("OnlyRevert", () => new OnlyRevertError());
function errorFromCode2(code) {
  const createError = createErrorFromCodeLookup2.get(code);
  return createError != null ? createError() : null;
}
function errorFromName2(name) {
  const createError = createErrorFromNameLookup2.get(name);
  return createError != null ? createError() : null;
}

// src/generated/simple_messagelib/instructions/index.ts
var instructions_exports2 = {};
__export(instructions_exports2, {
  createInitConfigInstruction: () => createInitConfigInstruction2,
  createInitConfigInstructionAccounts: () => createInitConfigInstructionAccounts2,
  createInitDefaultConfigInstruction: () => createInitDefaultConfigInstruction,
  createInitDefaultConfigInstructionAccounts: () => createInitDefaultConfigInstructionAccounts,
  createInitMessageLibInstruction: () => createInitMessageLibInstruction,
  createInitMessageLibInstructionAccounts: () => createInitMessageLibInstructionAccounts,
  createQuoteInstruction: () => createQuoteInstruction2,
  createQuoteInstructionAccounts: () => createQuoteInstructionAccounts2,
  createRevertCallInstruction: () => createRevertCallInstruction,
  createRevertCallInstructionAccounts: () => createRevertCallInstructionAccounts,
  createSendInstruction: () => createSendInstruction2,
  createSendInstructionAccounts: () => createSendInstructionAccounts2,
  createSendWithLzTokenInstruction: () => createSendWithLzTokenInstruction,
  createSendWithLzTokenInstructionAccounts: () => createSendWithLzTokenInstructionAccounts,
  createSetConfigInstruction: () => createSetConfigInstruction2,
  createSetConfigInstructionAccounts: () => createSetConfigInstructionAccounts2,
  createSetDefaultConfigInstruction: () => createSetDefaultConfigInstruction,
  createSetDefaultConfigInstructionAccounts: () => createSetDefaultConfigInstructionAccounts,
  createSetFeeInstruction: () => createSetFeeInstruction,
  createSetFeeInstructionAccounts: () => createSetFeeInstructionAccounts,
  createSetWlCallerInstruction: () => createSetWlCallerInstruction,
  createSetWlCallerInstructionAccounts: () => createSetWlCallerInstructionAccounts,
  createTransferAdminInstruction: () => createTransferAdminInstruction2,
  createTransferAdminInstructionAccounts: () => createTransferAdminInstructionAccounts2,
  createValidatePacketInstruction: () => createValidatePacketInstruction,
  createValidatePacketInstructionAccounts: () => createValidatePacketInstructionAccounts,
  createVersionInstruction: () => createVersionInstruction,
  createVersionInstructionAccounts: () => createVersionInstructionAccounts,
  createWithdrawFeesInstruction: () => createWithdrawFeesInstruction,
  createWithdrawFeesInstructionAccounts: () => createWithdrawFeesInstructionAccounts,
  initConfigInstructionDiscriminator: () => initConfigInstructionDiscriminator2,
  initConfigStruct: () => initConfigStruct2,
  initDefaultConfigInstructionDiscriminator: () => initDefaultConfigInstructionDiscriminator,
  initDefaultConfigStruct: () => initDefaultConfigStruct,
  initMessageLibInstructionDiscriminator: () => initMessageLibInstructionDiscriminator,
  initMessageLibStruct: () => initMessageLibStruct,
  quoteInstructionDiscriminator: () => quoteInstructionDiscriminator2,
  quoteStruct: () => quoteStruct2,
  revertCallInstructionDiscriminator: () => revertCallInstructionDiscriminator,
  revertCallStruct: () => revertCallStruct,
  sendInstructionDiscriminator: () => sendInstructionDiscriminator2,
  sendStruct: () => sendStruct2,
  sendWithLzTokenInstructionDiscriminator: () => sendWithLzTokenInstructionDiscriminator,
  sendWithLzTokenStruct: () => sendWithLzTokenStruct,
  setConfigInstructionDiscriminator: () => setConfigInstructionDiscriminator2,
  setConfigStruct: () => setConfigStruct2,
  setDefaultConfigInstructionDiscriminator: () => setDefaultConfigInstructionDiscriminator,
  setDefaultConfigStruct: () => setDefaultConfigStruct,
  setFeeInstructionDiscriminator: () => setFeeInstructionDiscriminator,
  setFeeStruct: () => setFeeStruct,
  setWlCallerInstructionDiscriminator: () => setWlCallerInstructionDiscriminator,
  setWlCallerStruct: () => setWlCallerStruct,
  transferAdminInstructionDiscriminator: () => transferAdminInstructionDiscriminator2,
  transferAdminStruct: () => transferAdminStruct2,
  validatePacketInstructionDiscriminator: () => validatePacketInstructionDiscriminator,
  validatePacketStruct: () => validatePacketStruct,
  versionInstructionDiscriminator: () => versionInstructionDiscriminator,
  versionStruct: () => versionStruct,
  withdrawFeesInstructionDiscriminator: () => withdrawFeesInstructionDiscriminator,
  withdrawFeesStruct: () => withdrawFeesStruct
});
var initConfigParamsBeet2 = new beet159.BeetArgsStruct(
  [
    ["oapp", beetSolana85.publicKey],
    ["eid", beet159.u32]
  ],
  "InitConfigParams"
);

// src/generated/simple_messagelib/instructions/initConfig.ts
var initConfigStruct2 = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", initConfigParamsBeet2]
  ],
  "InitConfigInstructionArgs"
);
var initConfigInstructionDiscriminator2 = [
  23,
  235,
  115,
  232,
  168,
  96,
  1,
  231
];
function createInitConfigInstruction2(accounts, args, programId) {
  const [data] = initConfigStruct2.serialize({
    instructionDiscriminator: initConfigInstructionDiscriminator2,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.messageLib,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.receiveConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createInitConfigInstructionAccounts2(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.messageLib,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.receiveConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var initDefaultConfigParamsBeet = new beet159.FixableBeetArgsStruct(
  [
    ["eid", beet159.u32],
    ["sendConfig", beet159.coption(beet159.bytes)],
    ["receiveConfig", beet159.coption(beet159.bytes)]
  ],
  "InitDefaultConfigParams"
);

// src/generated/simple_messagelib/instructions/initDefaultConfig.ts
var initDefaultConfigStruct = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", initDefaultConfigParamsBeet]
  ],
  "InitDefaultConfigInstructionArgs"
);
var initDefaultConfigInstructionDiscriminator = [
  98,
  218,
  197,
  194,
  173,
  179,
  112,
  21
];
function createInitDefaultConfigInstruction(accounts, args, programId) {
  const [data] = initDefaultConfigStruct.serialize({
    instructionDiscriminator: initDefaultConfigInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.messageLib,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.receiveConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createInitDefaultConfigInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.messageLib,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.receiveConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var initMessageLibParamsBeet = new beet159.BeetArgsStruct(
  [
    ["eid", beet159.u32],
    ["endpoint", beetSolana85.publicKey],
    ["endpointProgram", beetSolana85.publicKey],
    ["admin", beetSolana85.publicKey],
    ["fee", beet159.u64],
    ["lzTokenFee", beet159.u64]
  ],
  "InitMessageLibParams"
);

// src/generated/simple_messagelib/instructions/initMessageLib.ts
var initMessageLibStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", initMessageLibParamsBeet]
  ],
  "InitMessageLibInstructionArgs"
);
var initMessageLibInstructionDiscriminator = [
  184,
  93,
  59,
  206,
  98,
  238,
  225,
  54
];
function createInitMessageLibInstruction(accounts, args, programId) {
  const [data] = initMessageLibStruct.serialize({
    instructionDiscriminator: initMessageLibInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.messageLib,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createInitMessageLibInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.messageLib,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var packetBeet = new beet159.FixableBeetArgsStruct(
  [
    ["nonce", beet159.u64],
    ["srcEid", beet159.u32],
    ["sender", beetSolana85.publicKey],
    ["dstEid", beet159.u32],
    ["receiver", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["guid", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["message", beet159.bytes]
  ],
  "Packet"
);

// src/generated/simple_messagelib/types/QuoteParams.ts
var quoteParamsBeet2 = new beet159.FixableBeetArgsStruct(
  [
    ["packet", packetBeet],
    ["options", beet159.bytes],
    ["payInLzToken", beet159.bool]
  ],
  "QuoteParams"
);

// src/generated/simple_messagelib/instructions/quote.ts
var quoteStruct2 = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", quoteParamsBeet2]
  ],
  "QuoteInstructionArgs"
);
var quoteInstructionDiscriminator2 = [
  149,
  42,
  109,
  247,
  134,
  146,
  213,
  123
];
function createQuoteInstruction2(accounts, args, programId) {
  const [data] = quoteStruct2.serialize({
    instructionDiscriminator: quoteInstructionDiscriminator2,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.messageLib,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createQuoteInstructionAccounts2(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.messageLib,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var revertCallStruct = new beet159.BeetArgsStruct(
  [["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)]],
  "RevertCallInstructionArgs"
);
var revertCallInstructionDiscriminator = [
  124,
  243,
  145,
  116,
  106,
  203,
  93,
  114
];
function createRevertCallInstruction(programId) {
  const [data] = revertCallStruct.serialize({
    instructionDiscriminator: revertCallInstructionDiscriminator
  });
  const keys = [];
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createRevertCallInstructionAccounts(programId) {
  const keys = [];
  return keys;
}
var sendParamsBeet2 = new beet159.FixableBeetArgsStruct(
  [
    ["packet", packetBeet],
    ["options", beet159.bytes],
    ["nativeFee", beet159.u64]
  ],
  "SendParams"
);

// src/generated/simple_messagelib/instructions/send.ts
var sendStruct2 = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", sendParamsBeet2]
  ],
  "SendInstructionArgs"
);
var sendInstructionDiscriminator2 = [102, 251, 20, 187, 65, 75, 12, 69];
function createSendInstruction2(accounts, args, programId) {
  const [data] = sendStruct2.serialize({
    instructionDiscriminator: sendInstructionDiscriminator2,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.messageLib,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createSendInstructionAccounts2(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.messageLib,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var sendWithLzTokenParamsBeet = new beet159.FixableBeetArgsStruct(
  [
    ["packet", packetBeet],
    ["options", beet159.bytes],
    ["nativeFee", beet159.u64],
    ["lzTokenFee", beet159.u64],
    ["lzTokenMint", beetSolana85.publicKey]
  ],
  "SendWithLzTokenParams"
);

// src/generated/simple_messagelib/instructions/sendWithLzToken.ts
var sendWithLzTokenStruct = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", sendWithLzTokenParamsBeet]
  ],
  "SendWithLzTokenInstructionArgs"
);
var sendWithLzTokenInstructionDiscriminator = [
  165,
  161,
  84,
  48,
  129,
  26,
  193,
  19
];
function createSendWithLzTokenInstruction(accounts, args, programId) {
  const [data] = sendWithLzTokenStruct.serialize({
    instructionDiscriminator: sendWithLzTokenInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.messageLib,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.messageLibLzToken,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.lzTokenSource,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.lzTokenMint,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.tokenProgram ?? splToken.TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createSendWithLzTokenInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.messageLib,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.messageLibLzToken,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.lzTokenSource,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.lzTokenMint,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.tokenProgram ?? splToken.TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var setConfigParamsBeet2 = new beet159.FixableBeetArgsStruct(
  [
    ["oapp", beetSolana85.publicKey],
    ["eid", beet159.u32],
    ["configType", beet159.u32],
    ["config", beet159.bytes]
  ],
  "SetConfigParams"
);

// src/generated/simple_messagelib/instructions/setConfig.ts
var setConfigStruct2 = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", setConfigParamsBeet2]
  ],
  "SetConfigInstructionArgs"
);
var setConfigInstructionDiscriminator2 = [
  108,
  158,
  154,
  175,
  212,
  98,
  52,
  66
];
function createSetConfigInstruction2(accounts, args, programId) {
  const [data] = setConfigStruct2.serialize({
    instructionDiscriminator: setConfigInstructionDiscriminator2,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.messageLib,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.receiveConfig,
      isWritable: true,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createSetConfigInstructionAccounts2(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.messageLib,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.receiveConfig,
      isWritable: true,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var setDefaultConfigParamsBeet = new beet159.FixableBeetArgsStruct(
  [
    ["eid", beet159.u32],
    ["sendConfig", beet159.coption(beet159.bytes)],
    ["receiveConfig", beet159.coption(beet159.bytes)]
  ],
  "SetDefaultConfigParams"
);

// src/generated/simple_messagelib/instructions/setDefaultConfig.ts
var setDefaultConfigStruct = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", setDefaultConfigParamsBeet]
  ],
  "SetDefaultConfigInstructionArgs"
);
var setDefaultConfigInstructionDiscriminator = [
  111,
  228,
  17,
  75,
  5,
  76,
  213,
  169
];
function createSetDefaultConfigInstruction(accounts, args, programId) {
  const [data] = setDefaultConfigStruct.serialize({
    instructionDiscriminator: setDefaultConfigInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.messageLib,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.receiveConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createSetDefaultConfigInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.messageLib,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.receiveConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var setFeeParamsBeet = new beet159.BeetArgsStruct(
  [
    ["fee", beet159.u64],
    ["lzTokenFee", beet159.u64]
  ],
  "SetFeeParams"
);

// src/generated/simple_messagelib/instructions/setFee.ts
var setFeeStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", setFeeParamsBeet]
  ],
  "SetFeeInstructionArgs"
);
var setFeeInstructionDiscriminator = [
  18,
  154,
  24,
  18,
  237,
  214,
  19,
  80
];
function createSetFeeInstruction(accounts, args, programId) {
  const [data] = setFeeStruct.serialize({
    instructionDiscriminator: setFeeInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.messageLib,
      isWritable: true,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createSetFeeInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.messageLib,
      isWritable: true,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var setWlCallerParamsBeet = new beet159.BeetArgsStruct(
  [["newCaller", beetSolana85.publicKey]],
  "SetWlCallerParams"
);

// src/generated/simple_messagelib/instructions/setWlCaller.ts
var setWlCallerStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", setWlCallerParamsBeet]
  ],
  "SetWlCallerInstructionArgs"
);
var setWlCallerInstructionDiscriminator = [
  153,
  41,
  240,
  37,
  126,
  107,
  14,
  253
];
function createSetWlCallerInstruction(accounts, args, programId) {
  const [data] = setWlCallerStruct.serialize({
    instructionDiscriminator: setWlCallerInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.messageLib,
      isWritable: true,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createSetWlCallerInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.messageLib,
      isWritable: true,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var transferAdminParamsBeet2 = new beet159.BeetArgsStruct(
  [["admin", beetSolana85.publicKey]],
  "TransferAdminParams"
);

// src/generated/simple_messagelib/instructions/transferAdmin.ts
var transferAdminStruct2 = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", transferAdminParamsBeet2]
  ],
  "TransferAdminInstructionArgs"
);
var transferAdminInstructionDiscriminator2 = [
  42,
  242,
  66,
  106,
  228,
  10,
  111,
  156
];
function createTransferAdminInstruction2(accounts, args, programId) {
  const [data] = transferAdminStruct2.serialize({
    instructionDiscriminator: transferAdminInstructionDiscriminator2,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.messageLib,
      isWritable: true,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createTransferAdminInstructionAccounts2(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.messageLib,
      isWritable: true,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var validatePacketParamsBeet = new beet159.FixableBeetArgsStruct(
  [["packet", beet159.bytes]],
  "ValidatePacketParams"
);

// src/generated/simple_messagelib/instructions/validatePacket.ts
var validatePacketStruct = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", validatePacketParamsBeet]
  ],
  "ValidatePacketInstructionArgs"
);
var validatePacketInstructionDiscriminator = [
  34,
  146,
  107,
  76,
  157,
  98,
  105,
  211
];
function createValidatePacketInstruction(accounts, args, programId) {
  const [data] = validatePacketStruct.serialize({
    instructionDiscriminator: validatePacketInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.payer,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.receiveLibrary,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createValidatePacketInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.payer,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.receiveLibrary,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var versionStruct = new beet159.BeetArgsStruct(
  [["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)]],
  "VersionInstructionArgs"
);
var versionInstructionDiscriminator = [
  118,
  65,
  195,
  198,
  129,
  216,
  252,
  192
];
function createVersionInstruction(programId) {
  const [data] = versionStruct.serialize({
    instructionDiscriminator: versionInstructionDiscriminator
  });
  const keys = [];
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createVersionInstructionAccounts(programId) {
  const keys = [];
  return keys;
}
var withdrawFeesParamsBeet = new beet159.BeetArgsStruct(
  [["amount", beet159.u64]],
  "WithdrawFeesParams"
);

// src/generated/simple_messagelib/instructions/withdrawFees.ts
var withdrawFeesStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", withdrawFeesParamsBeet]
  ],
  "WithdrawFeesInstructionArgs"
);
var withdrawFeesInstructionDiscriminator = [
  198,
  212,
  171,
  109,
  144,
  215,
  174,
  89
];
function createWithdrawFeesInstruction(accounts, args, programId) {
  const [data] = withdrawFeesStruct.serialize({
    instructionDiscriminator: withdrawFeesInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.messageLib,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.receiver,
      isWritable: true,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createWithdrawFeesInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.messageLib,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.receiver,
      isWritable: true,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}

// src/generated/simple_messagelib/types/index.ts
var types_exports2 = {};
__export(types_exports2, {
  initConfigParamsBeet: () => initConfigParamsBeet2,
  initDefaultConfigParamsBeet: () => initDefaultConfigParamsBeet,
  initMessageLibParamsBeet: () => initMessageLibParamsBeet,
  messagingFeeBeet: () => messagingFeeBeet2,
  packetBeet: () => packetBeet,
  quoteParamsBeet: () => quoteParamsBeet2,
  sendParamsBeet: () => sendParamsBeet2,
  sendWithLzTokenParamsBeet: () => sendWithLzTokenParamsBeet,
  setConfigParamsBeet: () => setConfigParamsBeet2,
  setDefaultConfigParamsBeet: () => setDefaultConfigParamsBeet,
  setFeeParamsBeet: () => setFeeParamsBeet,
  setWlCallerParamsBeet: () => setWlCallerParamsBeet,
  transferAdminParamsBeet: () => transferAdminParamsBeet2,
  validatePacketParamsBeet: () => validatePacketParamsBeet,
  versionBeet: () => versionBeet,
  withdrawFeesParamsBeet: () => withdrawFeesParamsBeet
});
var messagingFeeBeet2 = new beet159.BeetArgsStruct(
  [
    ["nativeFee", beet159.u64],
    ["lzTokenFee", beet159.u64]
  ],
  "MessagingFee"
);
var versionBeet = new beet159.BeetArgsStruct(
  [
    ["major", beet159.u64],
    ["minor", beet159.u8],
    ["endpointVersion", beet159.u8]
  ],
  "Version"
);
var PROGRAM_ADDRESS2 = "6GsmxMTHAAiFKfemuM4zBjumTjNSX5CAiw4xSSXM2Toy";
var PROGRAM_ID2 = new PublicKey(PROGRAM_ADDRESS2);

// src/simple-message-lib.ts
var SimpleMessageLib = class {
  constructor(program) {
    this.program = program;
    this.deriver = new MessageLibPDADeriver(program);
  }
  initSimpleMessageLib(endpointProgram, payer, admin, eid, nativeFee, lzTokenFee = 0) {
    const [messageLibPda] = this.deriver.messageLib();
    const [endpointAuth] = new EndpointPDADeriver(endpointProgram).messageLibraryInfo(messageLibPda);
    return createInitMessageLibInstruction(
      {
        payer,
        messageLib: messageLibPda
      },
      {
        params: {
          endpointProgram,
          endpoint: endpointAuth,
          eid,
          admin,
          fee: nativeFee,
          lzTokenFee
        }
      },
      this.program
    );
  }
  setWhitelistCaller(admin, newCaller) {
    const [messageLibPDA] = this.deriver.messageLib();
    return createSetWlCallerInstruction(
      {
        admin,
        messageLib: messageLibPDA
      },
      {
        params: {
          newCaller
        }
      },
      this.program
    );
  }
  async isWhiteListed(connection, caller, commitmentOrConfig) {
    try {
      const exceptedCaller = await this.getWhiteListCaller(connection, commitmentOrConfig);
      return exceptedCaller.equals(caller);
    } catch (e) {
      return false;
    }
  }
  async getWhiteListCaller(connection, commitmentOrConfig) {
    const [messageLibPDA] = this.deriver.messageLib();
    const messageLibInfo = await MessageLib.fromAccountAddress(
      connection,
      messageLibPDA,
      commitmentOrConfig
    );
    return messageLibInfo.wlCaller;
  }
  validatePacket(_connection, endpointProgram, payer, encodedPacket) {
    const packet = PacketV1Codec.fromBytes(encodedPacket);
    const [receiveLibrary] = this.deriver.messageLib();
    const endpoint = new endpoint_exports.Endpoint(endpointProgram);
    return createValidatePacketInstruction(
      {
        payer,
        receiveLibrary,
        anchorRemainingAccounts: endpoint.getVerifyIXAccountMetaForCPI(packet, receiveLibrary)
      },
      {
        params: { packet: encodedPacket }
      },
      this.program
    );
  }
  /***
   * Get the account meta of the send instruction for CPI(Cross-Program Invocation )
   */
  async getSendIXAccountMetaForCPI(_connection, payer, _path) {
    const [msgLib] = this.deriver.messageLib();
    const cpiAccounts = createSendInstructionAccounts2(
      {
        endpoint: PublicKey.default,
        // useless
        messageLib: msgLib,
        payer
      },
      this.program
    );
    cpiAccounts.forEach((key) => {
      if (!payer.equals(key.pubkey)) {
        key.isSigner = false;
      }
    });
    return Promise.resolve(cpiAccounts.slice(1));
  }
  async getQuoteIXAccountMetaForCPI(_connection, _payer, _path, _commitment) {
    const [msgLib] = this.deriver.messageLib();
    const keys = createQuoteInstructionAccounts2(
      {
        endpoint: PublicKey.default,
        // useless
        messageLib: msgLib
      },
      this.program
    );
    return Promise.resolve(keys.slice(1));
  }
  /***
   * Get the account meta of the send instruction for CPI(Cross-Program Invocation )
   */
  getInitConfigIXAccountMetaForCPI(payer, oappID, eid) {
    const [sendConfig] = this.deriver.sendConfig(eid, oappID);
    const [receiveConfig] = this.deriver.receiveConfig(eid, oappID);
    const [messageLib] = this.deriver.messageLib();
    const keys = createInitConfigInstructionAccounts2(
      {
        endpoint: PublicKey.default,
        // useless
        payer,
        messageLib,
        sendConfig,
        receiveConfig
      },
      this.program
    );
    keys.forEach((key) => {
      if (!payer.equals(key.pubkey)) {
        key.isSigner = false;
      }
    });
    return keys.slice(1);
  }
  async getSetConfigIXAccountMetaForCPI(endpointProgram, oappID, eid) {
    const [sendConfig] = this.deriver.sendConfig(eid, oappID);
    const [receiveConfig] = this.deriver.receiveConfig(eid, oappID);
    const [msgLib] = this.deriver.messageLib();
    const accounts = createSetConfigInstructionAccounts2(
      {
        endpoint: PublicKey.default,
        // useless
        sendConfig,
        receiveConfig,
        messageLib: msgLib
      },
      this.program
    );
    return Promise.resolve(accounts.slice(1));
  }
};

// src/uln.ts
var uln_exports = {};
__export(uln_exports, {
  AtLeastOneDVNError: () => AtLeastOneDVNError,
  Confirmations: () => Confirmations,
  ExceededMaxMessageSizeError: () => ExceededMaxMessageSizeError,
  ExceededU128Error: () => ExceededU128Error,
  InsufficientFeeError: () => InsufficientFeeError2,
  InvalidAccountLengthError: () => InvalidAccountLengthError,
  InvalidAmountError: () => InvalidAmountError4,
  InvalidBpsError: () => InvalidBpsError,
  InvalidConfigTypeError: () => InvalidConfigTypeError2,
  InvalidConfirmationError: () => InvalidConfirmationError,
  InvalidConfirmationsError: () => InvalidConfirmationsError,
  InvalidDvnError: () => InvalidDvnError,
  InvalidDvnProgramError: () => InvalidDvnProgramError,
  InvalidEidError: () => InvalidEidError,
  InvalidExecutorError: () => InvalidExecutorError,
  InvalidExecutorProgramError: () => InvalidExecutorProgramError,
  InvalidLzTokenMintError: () => InvalidLzTokenMintError2,
  InvalidOptionTypeError: () => InvalidOptionTypeError,
  InvalidOptionalDVNCountError: () => InvalidOptionalDVNCountError,
  InvalidOptionalDVNThresholdError: () => InvalidOptionalDVNThresholdError,
  InvalidPacketVersionError: () => InvalidPacketVersionError,
  InvalidPayerError: () => InvalidPayerError,
  InvalidRequiredDVNCountError: () => InvalidRequiredDVNCountError,
  InvalidTreasuryError: () => InvalidTreasuryError,
  InvalidTreasuryFeeCapError: () => InvalidTreasuryFeeCapError,
  InvalidType1SizeError: () => InvalidType1SizeError,
  InvalidType2SizeError: () => InvalidType2SizeError,
  InvalidWorkerIdError: () => InvalidWorkerIdError,
  LzTokenUnavailableError: () => LzTokenUnavailableError3,
  NonSignerError: () => NonSignerError,
  PROGRAM_ADDRESS: () => PROGRAM_ADDRESS5,
  PROGRAM_ID: () => PROGRAM_ID5,
  ReceiveConfig: () => ReceiveConfig2,
  SendConfig: () => SendConfig,
  Uln: () => Uln,
  UlnSettings: () => UlnSettings,
  UnauthorizedError: () => UnauthorizedError2,
  UnsortedError: () => UnsortedError,
  VerifyingError: () => VerifyingError,
  ZeroMessageSizeError: () => ZeroMessageSizeError,
  accountProviders: () => accountProviders5,
  accounts: () => accounts_exports5,
  closeVerifyInstructionDiscriminator: () => closeVerifyInstructionDiscriminator,
  closeVerifyParamsBeet: () => closeVerifyParamsBeet,
  closeVerifyStruct: () => closeVerifyStruct,
  commitVerificationInstructionDiscriminator: () => commitVerificationInstructionDiscriminator,
  commitVerificationParamsBeet: () => commitVerificationParamsBeet,
  commitVerificationStruct: () => commitVerificationStruct,
  configBeet: () => configBeet,
  confirmationsBeet: () => confirmationsBeet,
  confirmationsDiscriminator: () => confirmationsDiscriminator,
  createCloseVerifyInstruction: () => createCloseVerifyInstruction,
  createCloseVerifyInstructionAccounts: () => createCloseVerifyInstructionAccounts,
  createCommitVerificationInstruction: () => createCommitVerificationInstruction,
  createCommitVerificationInstructionAccounts: () => createCommitVerificationInstructionAccounts,
  createInitConfigInstruction: () => createInitConfigInstruction3,
  createInitConfigInstructionAccounts: () => createInitConfigInstructionAccounts3,
  createInitDefaultConfigInstruction: () => createInitDefaultConfigInstruction2,
  createInitDefaultConfigInstructionAccounts: () => createInitDefaultConfigInstructionAccounts2,
  createInitUlnInstruction: () => createInitUlnInstruction,
  createInitUlnInstructionAccounts: () => createInitUlnInstructionAccounts,
  createInitVerifyInstruction: () => createInitVerifyInstruction2,
  createInitVerifyInstructionAccounts: () => createInitVerifyInstructionAccounts2,
  createQuoteInstruction: () => createQuoteInstruction3,
  createQuoteInstructionAccounts: () => createQuoteInstructionAccounts3,
  createSendInstruction: () => createSendInstruction3,
  createSendInstructionAccounts: () => createSendInstructionAccounts3,
  createSendWithLzTokenInstruction: () => createSendWithLzTokenInstruction2,
  createSendWithLzTokenInstructionAccounts: () => createSendWithLzTokenInstructionAccounts2,
  createSetConfigInstruction: () => createSetConfigInstruction4,
  createSetConfigInstructionAccounts: () => createSetConfigInstructionAccounts4,
  createSetDefaultConfigInstruction: () => createSetDefaultConfigInstruction2,
  createSetDefaultConfigInstructionAccounts: () => createSetDefaultConfigInstructionAccounts2,
  createSetTreasuryInstruction: () => createSetTreasuryInstruction,
  createSetTreasuryInstructionAccounts: () => createSetTreasuryInstructionAccounts,
  createTransferAdminInstruction: () => createTransferAdminInstruction3,
  createTransferAdminInstructionAccounts: () => createTransferAdminInstructionAccounts3,
  createVerifyInstruction: () => createVerifyInstruction2,
  createVerifyInstructionAccounts: () => createVerifyInstructionAccounts2,
  createVersionInstruction: () => createVersionInstruction2,
  createVersionInstructionAccounts: () => createVersionInstructionAccounts2,
  createWithdrawRentInstruction: () => createWithdrawRentInstruction2,
  createWithdrawRentInstructionAccounts: () => createWithdrawRentInstructionAccounts2,
  errorFromCode: () => errorFromCode5,
  errorFromName: () => errorFromName5,
  errors: () => errors_exports4,
  events: () => events_exports4,
  executorConfigBeet: () => executorConfigBeet2,
  initConfigInstructionDiscriminator: () => initConfigInstructionDiscriminator3,
  initConfigParamsBeet: () => initConfigParamsBeet3,
  initConfigStruct: () => initConfigStruct3,
  initDefaultConfigInstructionDiscriminator: () => initDefaultConfigInstructionDiscriminator2,
  initDefaultConfigParamsBeet: () => initDefaultConfigParamsBeet2,
  initDefaultConfigStruct: () => initDefaultConfigStruct2,
  initUlnInstructionDiscriminator: () => initUlnInstructionDiscriminator,
  initUlnParamsBeet: () => initUlnParamsBeet,
  initUlnStruct: () => initUlnStruct,
  initVerifyInstructionDiscriminator: () => initVerifyInstructionDiscriminator2,
  initVerifyParamsBeet: () => initVerifyParamsBeet2,
  initVerifyStruct: () => initVerifyStruct2,
  instructions: () => instructions_exports5,
  isConfigExecutor: () => isConfigExecutor,
  isConfigReceiveUln: () => isConfigReceiveUln,
  isConfigSendUln: () => isConfigSendUln,
  lzTokenTreasuryBeet: () => lzTokenTreasuryBeet,
  messagingFeeBeet: () => messagingFeeBeet3,
  packetBeet: () => packetBeet2,
  quoteInstructionDiscriminator: () => quoteInstructionDiscriminator3,
  quoteParamsBeet: () => quoteParamsBeet3,
  quoteStruct: () => quoteStruct3,
  receiveConfigBeet: () => receiveConfigBeet2,
  receiveConfigDiscriminator: () => receiveConfigDiscriminator2,
  sendConfigBeet: () => sendConfigBeet,
  sendConfigDiscriminator: () => sendConfigDiscriminator,
  sendInstructionDiscriminator: () => sendInstructionDiscriminator3,
  sendParamsBeet: () => sendParamsBeet3,
  sendStruct: () => sendStruct3,
  sendWithLzTokenInstructionDiscriminator: () => sendWithLzTokenInstructionDiscriminator2,
  sendWithLzTokenParamsBeet: () => sendWithLzTokenParamsBeet2,
  sendWithLzTokenStruct: () => sendWithLzTokenStruct2,
  setConfigInstructionDiscriminator: () => setConfigInstructionDiscriminator4,
  setConfigParamsBeet: () => setConfigParamsBeet4,
  setConfigStruct: () => setConfigStruct4,
  setDefaultConfigInstructionDiscriminator: () => setDefaultConfigInstructionDiscriminator2,
  setDefaultConfigParamsBeet: () => setDefaultConfigParamsBeet2,
  setDefaultConfigStruct: () => setDefaultConfigStruct2,
  setTreasuryInstructionDiscriminator: () => setTreasuryInstructionDiscriminator,
  setTreasuryParamsBeet: () => setTreasuryParamsBeet,
  setTreasuryStruct: () => setTreasuryStruct,
  transferAdminInstructionDiscriminator: () => transferAdminInstructionDiscriminator3,
  transferAdminParamsBeet: () => transferAdminParamsBeet3,
  transferAdminStruct: () => transferAdminStruct3,
  treasuryBeet: () => treasuryBeet,
  treasuryFeeBeet: () => treasuryFeeBeet,
  types: () => types_exports5,
  ulnConfigBeet: () => ulnConfigBeet2,
  ulnSettingsBeet: () => ulnSettingsBeet,
  ulnSettingsDiscriminator: () => ulnSettingsDiscriminator,
  verifyInstructionDiscriminator: () => verifyInstructionDiscriminator2,
  verifyParamsBeet: () => verifyParamsBeet2,
  verifyStruct: () => verifyStruct2,
  versionBeet: () => versionBeet2,
  versionInstructionDiscriminator: () => versionInstructionDiscriminator2,
  versionStruct: () => versionStruct2,
  withdrawRentInstructionDiscriminator: () => withdrawRentInstructionDiscriminator2,
  withdrawRentParamsBeet: () => withdrawRentParamsBeet2,
  withdrawRentStruct: () => withdrawRentStruct2,
  workerFeeBeet: () => workerFeeBeet
});

// src/dvn.ts
var dvn_exports2 = {};
__export(dvn_exports2, {
  DVN: () => DVN,
  PROGRAM_ID: () => PROGRAM_ID3,
  accounts: () => accounts_exports3,
  errors: () => errors_exports3,
  events: () => events_exports2,
  instructions: () => instructions_exports3,
  types: () => types_exports3
});

// src/generated/dvn/index.ts
var dvn_exports = {};
__export(dvn_exports, {
  DuplicateSignatureError: () => DuplicateSignatureError,
  DvnConfig: () => DvnConfig,
  EidNotSupportedError: () => EidNotSupportedError,
  ExecuteHash: () => ExecuteHash,
  ExpiredError: () => ExpiredError,
  InvalidAmountError: () => InvalidAmountError3,
  InvalidQuorumError: () => InvalidQuorumError,
  InvalidSignatureLenError: () => InvalidSignatureLenError,
  InvalidSignersLenError: () => InvalidSignersLenError,
  InvalidVidError: () => InvalidVidError,
  MsgLibNotAllowedError: () => MsgLibNotAllowedError,
  NotAdminError: () => NotAdminError,
  PROGRAM_ADDRESS: () => PROGRAM_ADDRESS3,
  PROGRAM_ID: () => PROGRAM_ID3,
  PausedError: () => PausedError,
  ReceiveConfig: () => ReceiveConfig,
  SignatureErrorError: () => SignatureErrorError,
  SignerNotInCommitteeError: () => SignerNotInCommitteeError,
  TooManyAdminsError: () => TooManyAdminsError,
  TooManyOptionTypesError: () => TooManyOptionTypesError,
  UnexpiredExecuteHashError: () => UnexpiredExecuteHashError,
  UniqueOwnersError: () => UniqueOwnersError,
  VerificationState: () => VerificationState,
  accountProviders: () => accountProviders3,
  aclBeet: () => aclBeet,
  adminConfigBeet: () => adminConfigBeet,
  closeExecuteInstructionDiscriminator: () => closeExecuteInstructionDiscriminator,
  closeExecuteParamsBeet: () => closeExecuteParamsBeet,
  closeExecuteStruct: () => closeExecuteStruct,
  createCloseExecuteInstruction: () => createCloseExecuteInstruction,
  createCloseExecuteInstructionAccounts: () => createCloseExecuteInstructionAccounts,
  createInitDvnInstruction: () => createInitDvnInstruction,
  createInitDvnInstructionAccounts: () => createInitDvnInstructionAccounts,
  createInvokeInstruction: () => createInvokeInstruction,
  createInvokeInstructionAccounts: () => createInvokeInstructionAccounts,
  createQuoteDvnInstruction: () => createQuoteDvnInstruction,
  createQuoteDvnInstructionAccounts: () => createQuoteDvnInstructionAccounts,
  createSetConfigInstruction: () => createSetConfigInstruction3,
  createSetConfigInstructionAccounts: () => createSetConfigInstructionAccounts3,
  createVerifiableInstruction: () => createVerifiableInstruction,
  createVerifiableInstructionAccounts: () => createVerifiableInstructionAccounts,
  createWithdrawFeeInstruction: () => createWithdrawFeeInstruction,
  createWithdrawFeeInstructionAccounts: () => createWithdrawFeeInstructionAccounts,
  dstConfigBeet: () => dstConfigBeet,
  dvnConfigBeet: () => dvnConfigBeet,
  dvnConfigDiscriminator: () => dvnConfigDiscriminator,
  errorFromCode: () => errorFromCode3,
  errorFromName: () => errorFromName3,
  executeHashBeet: () => executeHashBeet,
  executeHashDiscriminator: () => executeHashDiscriminator,
  executeTransactionDigestBeet: () => executeTransactionDigestBeet,
  initDvnInstructionDiscriminator: () => initDvnInstructionDiscriminator,
  initDvnParamsBeet: () => initDvnParamsBeet,
  initDvnStruct: () => initDvnStruct,
  invokeInstructionDiscriminator: () => invokeInstructionDiscriminator,
  invokeParamsBeet: () => invokeParamsBeet,
  invokeStruct: () => invokeStruct,
  isAdminConfigAdmins: () => isAdminConfigAdmins,
  isAdminConfigDefaultMultiplierBps: () => isAdminConfigDefaultMultiplierBps,
  isAdminConfigDstConfigs: () => isAdminConfigDstConfigs,
  isAdminConfigPriceFeed: () => isAdminConfigPriceFeed,
  isMultisigConfigAdmins: () => isMultisigConfigAdmins,
  isMultisigConfigAllowlist: () => isMultisigConfigAllowlist,
  isMultisigConfigDenylist: () => isMultisigConfigDenylist,
  isMultisigConfigMsglibs: () => isMultisigConfigMsglibs,
  isMultisigConfigPaused: () => isMultisigConfigPaused,
  isMultisigConfigQuorum: () => isMultisigConfigQuorum,
  isMultisigConfigSigners: () => isMultisigConfigSigners,
  lzOptionBeet: () => lzOptionBeet,
  multisigBeet: () => multisigBeet,
  multisigConfigBeet: () => multisigConfigBeet,
  quoteDvnInstructionDiscriminator: () => quoteDvnInstructionDiscriminator,
  quoteDvnParamsBeet: () => quoteDvnParamsBeet,
  quoteDvnStruct: () => quoteDvnStruct,
  receiveConfigBeet: () => receiveConfigBeet,
  receiveConfigDiscriminator: () => receiveConfigDiscriminator,
  setConfigInstructionDiscriminator: () => setConfigInstructionDiscriminator3,
  setConfigParamsBeet: () => setConfigParamsBeet3,
  setConfigStruct: () => setConfigStruct3,
  transactionAccountBeet: () => transactionAccountBeet,
  ulnConfigBeet: () => ulnConfigBeet,
  verifiableInstructionDiscriminator: () => verifiableInstructionDiscriminator,
  verifiableParamsBeet: () => verifiableParamsBeet,
  verifiableStruct: () => verifiableStruct,
  verificationStateBeet: () => verificationStateBeet,
  withdrawFeeInstructionDiscriminator: () => withdrawFeeInstructionDiscriminator,
  withdrawFeeParamsBeet: () => withdrawFeeParamsBeet,
  withdrawFeeStruct: () => withdrawFeeStruct
});

// src/generated/dvn/accounts/index.ts
var accounts_exports3 = {};
__export(accounts_exports3, {
  DvnConfig: () => DvnConfig,
  ExecuteHash: () => ExecuteHash,
  ReceiveConfig: () => ReceiveConfig,
  accountProviders: () => accountProviders3,
  dvnConfigBeet: () => dvnConfigBeet,
  dvnConfigDiscriminator: () => dvnConfigDiscriminator,
  executeHashBeet: () => executeHashBeet,
  executeHashDiscriminator: () => executeHashDiscriminator,
  receiveConfigBeet: () => receiveConfigBeet,
  receiveConfigDiscriminator: () => receiveConfigDiscriminator
});
var multisigBeet = new beet159.FixableBeetArgsStruct(
  [
    ["signers", beet159.array(beet159.uniformFixedSizeArray(beet159.u8, 64))],
    ["quorum", beet159.u8]
  ],
  "Multisig"
);
var aclBeet = new beet159.FixableBeetArgsStruct(
  [
    ["allowList", beet159.array(beetSolana85.publicKey)],
    ["denyList", beet159.array(beetSolana85.publicKey)]
  ],
  "Acl"
);
var dstConfigBeet = new beet159.FixableBeetArgsStruct(
  [
    ["eid", beet159.u32],
    ["dstGas", beet159.u32],
    ["multiplierBps", beet159.coption(beet159.u16)],
    ["floorMarginUsd", beet159.coption(beet159.u128)]
  ],
  "DstConfig"
);

// src/generated/dvn/accounts/DvnConfig.ts
var dvnConfigDiscriminator = [49, 81, 33, 98, 234, 168, 93, 73];
var DvnConfig = class _DvnConfig {
  constructor(vid, bump, multisig, acl, paused, msglibs, admins, priceFeed, dstConfigs, defaultMultiplierBps) {
    this.vid = vid;
    this.bump = bump;
    this.multisig = multisig;
    this.acl = acl;
    this.paused = paused;
    this.msglibs = msglibs;
    this.admins = admins;
    this.priceFeed = priceFeed;
    this.dstConfigs = dstConfigs;
    this.defaultMultiplierBps = defaultMultiplierBps;
  }
  /**
   * Creates a {@link DvnConfig} instance from the provided args.
   */
  static fromArgs(args) {
    return new _DvnConfig(
      args.vid,
      args.bump,
      args.multisig,
      args.acl,
      args.paused,
      args.msglibs,
      args.admins,
      args.priceFeed,
      args.dstConfigs,
      args.defaultMultiplierBps
    );
  }
  /**
   * Deserializes the {@link DvnConfig} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(accountInfo, offset = 0) {
    return _DvnConfig.deserialize(accountInfo.data, offset);
  }
  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link DvnConfig} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(connection, address, commitmentOrConfig) {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    );
    if (accountInfo == null) {
      throw new Error(`Unable to find DvnConfig account at ${address}`);
    }
    return _DvnConfig.fromAccountInfo(accountInfo, 0)[0];
  }
  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(programId = new web314.PublicKey(
    "HtEYV4xB4wvsj5fgTkcfuChYpvGYzgzwvNhgDZQNh7wW"
  )) {
    return beetSolana85.GpaBuilder.fromStruct(programId, dvnConfigBeet);
  }
  /**
   * Deserializes the {@link DvnConfig} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf, offset = 0) {
    return dvnConfigBeet.deserialize(buf, offset);
  }
  /**
   * Serializes the {@link DvnConfig} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize() {
    return dvnConfigBeet.serialize({
      accountDiscriminator: dvnConfigDiscriminator,
      ...this
    });
  }
  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link DvnConfig} for the provided args.
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   */
  static byteSize(args) {
    const instance = _DvnConfig.fromArgs(args);
    return dvnConfigBeet.toFixedFromValue({
      accountDiscriminator: dvnConfigDiscriminator,
      ...instance
    }).byteSize;
  }
  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link DvnConfig} data from rent
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(args, connection, commitment) {
    return connection.getMinimumBalanceForRentExemption(
      _DvnConfig.byteSize(args),
      commitment
    );
  }
  /**
   * Returns a readable version of {@link DvnConfig} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      vid: this.vid,
      bump: this.bump,
      multisig: this.multisig,
      acl: this.acl,
      paused: this.paused,
      msglibs: this.msglibs,
      admins: this.admins,
      priceFeed: this.priceFeed.toBase58(),
      dstConfigs: this.dstConfigs,
      defaultMultiplierBps: this.defaultMultiplierBps
    };
  }
};
var dvnConfigBeet = new beet159.FixableBeetStruct(
  [
    ["accountDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["vid", beet159.u32],
    ["bump", beet159.u8],
    ["multisig", multisigBeet],
    ["acl", aclBeet],
    ["paused", beet159.bool],
    ["msglibs", beet159.array(beetSolana85.publicKey)],
    ["admins", beet159.array(beetSolana85.publicKey)],
    ["priceFeed", beetSolana85.publicKey],
    ["dstConfigs", beet159.array(dstConfigBeet)],
    ["defaultMultiplierBps", beet159.u16]
  ],
  DvnConfig.fromArgs,
  "DvnConfig"
);
var executeHashDiscriminator = [34, 17, 137, 123, 62, 25, 205, 155];
var ExecuteHash = class _ExecuteHash {
  constructor(expiration, bump) {
    this.expiration = expiration;
    this.bump = bump;
  }
  /**
   * Creates a {@link ExecuteHash} instance from the provided args.
   */
  static fromArgs(args) {
    return new _ExecuteHash(args.expiration, args.bump);
  }
  /**
   * Deserializes the {@link ExecuteHash} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(accountInfo, offset = 0) {
    return _ExecuteHash.deserialize(accountInfo.data, offset);
  }
  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link ExecuteHash} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(connection, address, commitmentOrConfig) {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    );
    if (accountInfo == null) {
      throw new Error(`Unable to find ExecuteHash account at ${address}`);
    }
    return _ExecuteHash.fromAccountInfo(accountInfo, 0)[0];
  }
  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(programId = new web314.PublicKey(
    "HtEYV4xB4wvsj5fgTkcfuChYpvGYzgzwvNhgDZQNh7wW"
  )) {
    return beetSolana85.GpaBuilder.fromStruct(programId, executeHashBeet);
  }
  /**
   * Deserializes the {@link ExecuteHash} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf, offset = 0) {
    return executeHashBeet.deserialize(buf, offset);
  }
  /**
   * Serializes the {@link ExecuteHash} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize() {
    return executeHashBeet.serialize({
      accountDiscriminator: executeHashDiscriminator,
      ...this
    });
  }
  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link ExecuteHash}
   */
  static get byteSize() {
    return executeHashBeet.byteSize;
  }
  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link ExecuteHash} data from rent
   *
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(connection, commitment) {
    return connection.getMinimumBalanceForRentExemption(
      _ExecuteHash.byteSize,
      commitment
    );
  }
  /**
   * Determines if the provided {@link Buffer} has the correct byte size to
   * hold {@link ExecuteHash} data.
   */
  static hasCorrectByteSize(buf, offset = 0) {
    return buf.byteLength - offset === _ExecuteHash.byteSize;
  }
  /**
   * Returns a readable version of {@link ExecuteHash} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      expiration: (() => {
        const x = this.expiration;
        if (typeof x.toNumber === "function") {
          try {
            return x.toNumber();
          } catch (_) {
            return x;
          }
        }
        return x;
      })(),
      bump: this.bump
    };
  }
};
var executeHashBeet = new beet159.BeetStruct(
  [
    ["accountDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["expiration", beet159.i64],
    ["bump", beet159.u8]
  ],
  ExecuteHash.fromArgs,
  "ExecuteHash"
);
var ulnConfigBeet = new beet159.FixableBeetArgsStruct(
  [
    ["confirmations", beet159.u64],
    ["requiredDvnCount", beet159.u8],
    ["optionalDvnCount", beet159.u8],
    ["optionalDvnThreshold", beet159.u8],
    ["requiredDvns", beet159.array(beetSolana85.publicKey)],
    ["optionalDvns", beet159.array(beetSolana85.publicKey)]
  ],
  "UlnConfig"
);

// src/generated/dvn/accounts/ReceiveConfig.ts
var receiveConfigDiscriminator = [162, 159, 153, 188, 56, 65, 245, 58];
var ReceiveConfig = class _ReceiveConfig {
  constructor(bump, uln) {
    this.bump = bump;
    this.uln = uln;
  }
  /**
   * Creates a {@link ReceiveConfig} instance from the provided args.
   */
  static fromArgs(args) {
    return new _ReceiveConfig(args.bump, args.uln);
  }
  /**
   * Deserializes the {@link ReceiveConfig} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(accountInfo, offset = 0) {
    return _ReceiveConfig.deserialize(accountInfo.data, offset);
  }
  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link ReceiveConfig} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(connection, address, commitmentOrConfig) {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    );
    if (accountInfo == null) {
      throw new Error(`Unable to find ReceiveConfig account at ${address}`);
    }
    return _ReceiveConfig.fromAccountInfo(accountInfo, 0)[0];
  }
  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(programId = new web314.PublicKey(
    "HtEYV4xB4wvsj5fgTkcfuChYpvGYzgzwvNhgDZQNh7wW"
  )) {
    return beetSolana85.GpaBuilder.fromStruct(programId, receiveConfigBeet);
  }
  /**
   * Deserializes the {@link ReceiveConfig} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf, offset = 0) {
    return receiveConfigBeet.deserialize(buf, offset);
  }
  /**
   * Serializes the {@link ReceiveConfig} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize() {
    return receiveConfigBeet.serialize({
      accountDiscriminator: receiveConfigDiscriminator,
      ...this
    });
  }
  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link ReceiveConfig} for the provided args.
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   */
  static byteSize(args) {
    const instance = _ReceiveConfig.fromArgs(args);
    return receiveConfigBeet.toFixedFromValue({
      accountDiscriminator: receiveConfigDiscriminator,
      ...instance
    }).byteSize;
  }
  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link ReceiveConfig} data from rent
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(args, connection, commitment) {
    return connection.getMinimumBalanceForRentExemption(
      _ReceiveConfig.byteSize(args),
      commitment
    );
  }
  /**
   * Returns a readable version of {@link ReceiveConfig} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      bump: this.bump,
      uln: this.uln
    };
  }
};
var receiveConfigBeet = new beet159.FixableBeetStruct(
  [
    ["accountDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["bump", beet159.u8],
    ["uln", ulnConfigBeet]
  ],
  ReceiveConfig.fromArgs,
  "ReceiveConfig"
);

// src/generated/dvn/accounts/index.ts
var accountProviders3 = { DvnConfig, ExecuteHash, ReceiveConfig };

// src/generated/dvn/errors/index.ts
var errors_exports3 = {};
__export(errors_exports3, {
  DuplicateSignatureError: () => DuplicateSignatureError,
  EidNotSupportedError: () => EidNotSupportedError,
  ExpiredError: () => ExpiredError,
  InvalidAmountError: () => InvalidAmountError3,
  InvalidQuorumError: () => InvalidQuorumError,
  InvalidSignatureLenError: () => InvalidSignatureLenError,
  InvalidSignersLenError: () => InvalidSignersLenError,
  InvalidVidError: () => InvalidVidError,
  MsgLibNotAllowedError: () => MsgLibNotAllowedError,
  NotAdminError: () => NotAdminError,
  PausedError: () => PausedError,
  SignatureErrorError: () => SignatureErrorError,
  SignerNotInCommitteeError: () => SignerNotInCommitteeError,
  TooManyAdminsError: () => TooManyAdminsError,
  TooManyOptionTypesError: () => TooManyOptionTypesError,
  UnexpiredExecuteHashError: () => UnexpiredExecuteHashError,
  UniqueOwnersError: () => UniqueOwnersError,
  errorFromCode: () => errorFromCode3,
  errorFromName: () => errorFromName3
});
var createErrorFromCodeLookup3 = /* @__PURE__ */ new Map();
var createErrorFromNameLookup3 = /* @__PURE__ */ new Map();
var InvalidSignatureLenError = class _InvalidSignatureLenError extends Error {
  constructor() {
    super("");
    this.code = 6e3;
    this.name = "InvalidSignatureLen";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidSignatureLenError);
    }
  }
};
createErrorFromCodeLookup3.set(6e3, () => new InvalidSignatureLenError());
createErrorFromNameLookup3.set(
  "InvalidSignatureLen",
  () => new InvalidSignatureLenError()
);
var NotAdminError = class _NotAdminError extends Error {
  constructor() {
    super("");
    this.code = 6001;
    this.name = "NotAdmin";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _NotAdminError);
    }
  }
};
createErrorFromCodeLookup3.set(6001, () => new NotAdminError());
createErrorFromNameLookup3.set("NotAdmin", () => new NotAdminError());
var MsgLibNotAllowedError = class _MsgLibNotAllowedError extends Error {
  constructor() {
    super("");
    this.code = 6002;
    this.name = "MsgLibNotAllowed";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _MsgLibNotAllowedError);
    }
  }
};
createErrorFromCodeLookup3.set(6002, () => new MsgLibNotAllowedError());
createErrorFromNameLookup3.set(
  "MsgLibNotAllowed",
  () => new MsgLibNotAllowedError()
);
var InvalidQuorumError = class _InvalidQuorumError extends Error {
  constructor() {
    super("");
    this.code = 6003;
    this.name = "InvalidQuorum";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidQuorumError);
    }
  }
};
createErrorFromCodeLookup3.set(6003, () => new InvalidQuorumError());
createErrorFromNameLookup3.set("InvalidQuorum", () => new InvalidQuorumError());
var InvalidSignersLenError = class _InvalidSignersLenError extends Error {
  constructor() {
    super("");
    this.code = 6004;
    this.name = "InvalidSignersLen";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidSignersLenError);
    }
  }
};
createErrorFromCodeLookup3.set(6004, () => new InvalidSignersLenError());
createErrorFromNameLookup3.set(
  "InvalidSignersLen",
  () => new InvalidSignersLenError()
);
var UniqueOwnersError = class _UniqueOwnersError extends Error {
  constructor() {
    super("");
    this.code = 6005;
    this.name = "UniqueOwners";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _UniqueOwnersError);
    }
  }
};
createErrorFromCodeLookup3.set(6005, () => new UniqueOwnersError());
createErrorFromNameLookup3.set("UniqueOwners", () => new UniqueOwnersError());
var SignatureErrorError = class _SignatureErrorError extends Error {
  constructor() {
    super("");
    this.code = 6006;
    this.name = "SignatureError";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _SignatureErrorError);
    }
  }
};
createErrorFromCodeLookup3.set(6006, () => new SignatureErrorError());
createErrorFromNameLookup3.set("SignatureError", () => new SignatureErrorError());
var SignerNotInCommitteeError = class _SignerNotInCommitteeError extends Error {
  constructor() {
    super("");
    this.code = 6007;
    this.name = "SignerNotInCommittee";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _SignerNotInCommitteeError);
    }
  }
};
createErrorFromCodeLookup3.set(6007, () => new SignerNotInCommitteeError());
createErrorFromNameLookup3.set(
  "SignerNotInCommittee",
  () => new SignerNotInCommitteeError()
);
var TooManyAdminsError = class _TooManyAdminsError extends Error {
  constructor() {
    super("");
    this.code = 6008;
    this.name = "TooManyAdmins";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _TooManyAdminsError);
    }
  }
};
createErrorFromCodeLookup3.set(6008, () => new TooManyAdminsError());
createErrorFromNameLookup3.set("TooManyAdmins", () => new TooManyAdminsError());
var TooManyOptionTypesError = class _TooManyOptionTypesError extends Error {
  constructor() {
    super("");
    this.code = 6009;
    this.name = "TooManyOptionTypes";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _TooManyOptionTypesError);
    }
  }
};
createErrorFromCodeLookup3.set(6009, () => new TooManyOptionTypesError());
createErrorFromNameLookup3.set(
  "TooManyOptionTypes",
  () => new TooManyOptionTypesError()
);
var DuplicateSignatureError = class _DuplicateSignatureError extends Error {
  constructor() {
    super("");
    this.code = 6010;
    this.name = "DuplicateSignature";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _DuplicateSignatureError);
    }
  }
};
createErrorFromCodeLookup3.set(6010, () => new DuplicateSignatureError());
createErrorFromNameLookup3.set(
  "DuplicateSignature",
  () => new DuplicateSignatureError()
);
var ExpiredError = class _ExpiredError extends Error {
  constructor() {
    super("");
    this.code = 6011;
    this.name = "Expired";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _ExpiredError);
    }
  }
};
createErrorFromCodeLookup3.set(6011, () => new ExpiredError());
createErrorFromNameLookup3.set("Expired", () => new ExpiredError());
var InvalidVidError = class _InvalidVidError extends Error {
  constructor() {
    super("");
    this.code = 6012;
    this.name = "InvalidVid";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidVidError);
    }
  }
};
createErrorFromCodeLookup3.set(6012, () => new InvalidVidError());
createErrorFromNameLookup3.set("InvalidVid", () => new InvalidVidError());
var PausedError = class _PausedError extends Error {
  constructor() {
    super("");
    this.code = 6013;
    this.name = "Paused";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _PausedError);
    }
  }
};
createErrorFromCodeLookup3.set(6013, () => new PausedError());
createErrorFromNameLookup3.set("Paused", () => new PausedError());
var UnexpiredExecuteHashError = class _UnexpiredExecuteHashError extends Error {
  constructor() {
    super("");
    this.code = 6014;
    this.name = "UnexpiredExecuteHash";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _UnexpiredExecuteHashError);
    }
  }
};
createErrorFromCodeLookup3.set(6014, () => new UnexpiredExecuteHashError());
createErrorFromNameLookup3.set(
  "UnexpiredExecuteHash",
  () => new UnexpiredExecuteHashError()
);
var InvalidAmountError3 = class _InvalidAmountError extends Error {
  constructor() {
    super("");
    this.code = 6015;
    this.name = "InvalidAmount";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidAmountError);
    }
  }
};
createErrorFromCodeLookup3.set(6015, () => new InvalidAmountError3());
createErrorFromNameLookup3.set("InvalidAmount", () => new InvalidAmountError3());
var EidNotSupportedError = class _EidNotSupportedError extends Error {
  constructor() {
    super("");
    this.code = 6016;
    this.name = "EidNotSupported";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _EidNotSupportedError);
    }
  }
};
createErrorFromCodeLookup3.set(6016, () => new EidNotSupportedError());
createErrorFromNameLookup3.set(
  "EidNotSupported",
  () => new EidNotSupportedError()
);
function errorFromCode3(code) {
  const createError = createErrorFromCodeLookup3.get(code);
  return createError != null ? createError() : null;
}
function errorFromName3(name) {
  const createError = createErrorFromNameLookup3.get(name);
  return createError != null ? createError() : null;
}

// src/generated/dvn/instructions/index.ts
var instructions_exports3 = {};
__export(instructions_exports3, {
  closeExecuteInstructionDiscriminator: () => closeExecuteInstructionDiscriminator,
  closeExecuteStruct: () => closeExecuteStruct,
  createCloseExecuteInstruction: () => createCloseExecuteInstruction,
  createCloseExecuteInstructionAccounts: () => createCloseExecuteInstructionAccounts,
  createInitDvnInstruction: () => createInitDvnInstruction,
  createInitDvnInstructionAccounts: () => createInitDvnInstructionAccounts,
  createInvokeInstruction: () => createInvokeInstruction,
  createInvokeInstructionAccounts: () => createInvokeInstructionAccounts,
  createQuoteDvnInstruction: () => createQuoteDvnInstruction,
  createQuoteDvnInstructionAccounts: () => createQuoteDvnInstructionAccounts,
  createSetConfigInstruction: () => createSetConfigInstruction3,
  createSetConfigInstructionAccounts: () => createSetConfigInstructionAccounts3,
  createVerifiableInstruction: () => createVerifiableInstruction,
  createVerifiableInstructionAccounts: () => createVerifiableInstructionAccounts,
  createWithdrawFeeInstruction: () => createWithdrawFeeInstruction,
  createWithdrawFeeInstructionAccounts: () => createWithdrawFeeInstructionAccounts,
  initDvnInstructionDiscriminator: () => initDvnInstructionDiscriminator,
  initDvnStruct: () => initDvnStruct,
  invokeInstructionDiscriminator: () => invokeInstructionDiscriminator,
  invokeStruct: () => invokeStruct,
  quoteDvnInstructionDiscriminator: () => quoteDvnInstructionDiscriminator,
  quoteDvnStruct: () => quoteDvnStruct,
  setConfigInstructionDiscriminator: () => setConfigInstructionDiscriminator3,
  setConfigStruct: () => setConfigStruct3,
  verifiableInstructionDiscriminator: () => verifiableInstructionDiscriminator,
  verifiableStruct: () => verifiableStruct,
  withdrawFeeInstructionDiscriminator: () => withdrawFeeInstructionDiscriminator,
  withdrawFeeStruct: () => withdrawFeeStruct
});
var closeExecuteParamsBeet = new beet159.BeetArgsStruct(
  [["digestHash", beet159.uniformFixedSizeArray(beet159.u8, 32)]],
  "CloseExecuteParams"
);

// src/generated/dvn/instructions/closeExecute.ts
var closeExecuteStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", closeExecuteParamsBeet]
  ],
  "CloseExecuteInstructionArgs"
);
var closeExecuteInstructionDiscriminator = [
  253,
  220,
  23,
  127,
  15,
  171,
  189,
  226
];
function createCloseExecuteInstruction(accounts, args, programId) {
  const [data] = closeExecuteStruct.serialize({
    instructionDiscriminator: closeExecuteInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.config,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.executeHash,
      isWritable: true,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createCloseExecuteInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.config,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.executeHash,
      isWritable: true,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var initDvnParamsBeet = new beet159.FixableBeetArgsStruct(
  [
    ["vid", beet159.u32],
    ["msglibs", beet159.array(beetSolana85.publicKey)],
    ["priceFeed", beetSolana85.publicKey],
    ["signers", beet159.array(beet159.uniformFixedSizeArray(beet159.u8, 64))],
    ["quorum", beet159.u8],
    ["admins", beet159.array(beetSolana85.publicKey)]
  ],
  "InitDvnParams"
);

// src/generated/dvn/instructions/initDvn.ts
var initDvnStruct = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", initDvnParamsBeet]
  ],
  "InitDvnInstructionArgs"
);
var initDvnInstructionDiscriminator = [
  58,
  108,
  132,
  12,
  20,
  10,
  215,
  210
];
function createInitDvnInstruction(accounts, args, programId) {
  const [data] = initDvnStruct.serialize({
    instructionDiscriminator: initDvnInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.config,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createInitDvnInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.config,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var transactionAccountBeet = new beet159.BeetArgsStruct(
  [
    ["pubkey", beetSolana85.publicKey],
    ["isSigner", beet159.bool],
    ["isWritable", beet159.bool]
  ],
  "TransactionAccount"
);

// src/generated/dvn/types/ExecuteTransactionDigest.ts
var executeTransactionDigestBeet = new beet159.FixableBeetArgsStruct(
  [
    ["vid", beet159.u32],
    ["programId", beetSolana85.publicKey],
    ["accounts", beet159.array(transactionAccountBeet)],
    ["data", beet159.bytes],
    ["expiration", beet159.i64]
  ],
  "ExecuteTransactionDigest"
);

// src/generated/dvn/types/InvokeParams.ts
var invokeParamsBeet = new beet159.FixableBeetArgsStruct(
  [
    ["digest", executeTransactionDigestBeet],
    ["signatures", beet159.array(beet159.uniformFixedSizeArray(beet159.u8, 65))]
  ],
  "InvokeParams"
);

// src/generated/dvn/instructions/invoke.ts
var invokeStruct = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", invokeParamsBeet]
  ],
  "InvokeInstructionArgs"
);
var invokeInstructionDiscriminator = [26, 16, 169, 7, 21, 202, 242, 25];
function createInvokeInstruction(accounts, args, programId) {
  const [data] = invokeStruct.serialize({
    instructionDiscriminator: invokeInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.signer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.config,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.executeHash,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createInvokeInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.signer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.config,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.executeHash,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var lzOptionBeet = new beet159.FixableBeetArgsStruct(
  [
    ["optionType", beet159.u8],
    ["params", beet159.bytes]
  ],
  "LzOption"
);

// src/generated/dvn/types/QuoteDvnParams.ts
var quoteDvnParamsBeet = new beet159.FixableBeetArgsStruct(
  [
    ["msglib", beetSolana85.publicKey],
    ["dstEid", beet159.u32],
    ["sender", beetSolana85.publicKey],
    ["packetHeader", beet159.bytes],
    ["payloadHash", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["confirmations", beet159.u64],
    ["options", beet159.array(lzOptionBeet)]
  ],
  "QuoteDvnParams"
);

// src/generated/dvn/instructions/quoteDvn.ts
var quoteDvnStruct = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", quoteDvnParamsBeet]
  ],
  "QuoteDvnInstructionArgs"
);
var quoteDvnInstructionDiscriminator = [
  223,
  98,
  51,
  200,
  123,
  133,
  132,
  194
];
function createQuoteDvnInstruction(accounts, args, programId) {
  const [data] = quoteDvnStruct.serialize({
    instructionDiscriminator: quoteDvnInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.dvnConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.priceFeedProgram,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.priceFeedConfig,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createQuoteDvnInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.dvnConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.priceFeedProgram,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.priceFeedConfig,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var isAdminConfigAdmins = (x) => x.__kind === "Admins";
var isAdminConfigDefaultMultiplierBps = (x) => x.__kind === "DefaultMultiplierBps";
var isAdminConfigDstConfigs = (x) => x.__kind === "DstConfigs";
var isAdminConfigPriceFeed = (x) => x.__kind === "PriceFeed";
var adminConfigBeet = beet159.dataEnum([
  [
    "Admins",
    new beet159.FixableBeetArgsStruct(
      [["fields", beet159.tuple([beet159.array(beetSolana85.publicKey)])]],
      'AdminConfigRecord["Admins"]'
    )
  ],
  [
    "DefaultMultiplierBps",
    new beet159.BeetArgsStruct(
      [["fields", beet159.fixedSizeTuple([beet159.u16])]],
      'AdminConfigRecord["DefaultMultiplierBps"]'
    )
  ],
  [
    "DstConfigs",
    new beet159.FixableBeetArgsStruct(
      [["fields", beet159.tuple([beet159.array(dstConfigBeet)])]],
      'AdminConfigRecord["DstConfigs"]'
    )
  ],
  [
    "PriceFeed",
    new beet159.BeetArgsStruct(
      [["fields", beet159.fixedSizeTuple([beetSolana85.publicKey])]],
      'AdminConfigRecord["PriceFeed"]'
    )
  ]
]);

// src/generated/dvn/types/SetConfigParams.ts
var setConfigParamsBeet3 = new beet159.FixableBeetArgsStruct(
  [["config", adminConfigBeet]],
  "SetConfigParams"
);

// src/generated/dvn/instructions/setConfig.ts
var setConfigStruct3 = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", setConfigParamsBeet3]
  ],
  "SetConfigInstructionArgs"
);
var setConfigInstructionDiscriminator3 = [
  108,
  158,
  154,
  175,
  212,
  98,
  52,
  66
];
function createSetConfigInstruction3(accounts, args, programId) {
  const [data] = setConfigStruct3.serialize({
    instructionDiscriminator: setConfigInstructionDiscriminator3,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.config,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createSetConfigInstructionAccounts3(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.config,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var verifiableParamsBeet = new beet159.BeetArgsStruct(
  [
    ["packetHeader", beet159.uniformFixedSizeArray(beet159.u8, 81)],
    ["payloadHash", beet159.uniformFixedSizeArray(beet159.u8, 32)]
  ],
  "VerifiableParams"
);

// src/generated/dvn/instructions/verifiable.ts
var verifiableStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", verifiableParamsBeet]
  ],
  "VerifiableInstructionArgs"
);
var verifiableInstructionDiscriminator = [
  249,
  50,
  227,
  157,
  238,
  249,
  211,
  90
];
function createVerifiableInstruction(accounts, args, programId) {
  const [data] = verifiableStruct.serialize({
    instructionDiscriminator: verifiableInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.nonce,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.payloadHash,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.receiveConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.defaultReceiveConfig,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createVerifiableInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.nonce,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.payloadHash,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.receiveConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.defaultReceiveConfig,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var withdrawFeeParamsBeet = new beet159.BeetArgsStruct(
  [["amount", beet159.u64]],
  "WithdrawFeeParams"
);

// src/generated/dvn/instructions/withdrawFee.ts
var withdrawFeeStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", withdrawFeeParamsBeet]
  ],
  "WithdrawFeeInstructionArgs"
);
var withdrawFeeInstructionDiscriminator = [
  14,
  122,
  231,
  218,
  31,
  238,
  223,
  150
];
function createWithdrawFeeInstruction(accounts, args, programId) {
  const [data] = withdrawFeeStruct.serialize({
    instructionDiscriminator: withdrawFeeInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.config,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.receiver,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createWithdrawFeeInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.config,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.receiver,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}

// src/generated/dvn/types/index.ts
var types_exports3 = {};
__export(types_exports3, {
  VerificationState: () => VerificationState,
  aclBeet: () => aclBeet,
  adminConfigBeet: () => adminConfigBeet,
  closeExecuteParamsBeet: () => closeExecuteParamsBeet,
  dstConfigBeet: () => dstConfigBeet,
  executeTransactionDigestBeet: () => executeTransactionDigestBeet,
  initDvnParamsBeet: () => initDvnParamsBeet,
  invokeParamsBeet: () => invokeParamsBeet,
  isAdminConfigAdmins: () => isAdminConfigAdmins,
  isAdminConfigDefaultMultiplierBps: () => isAdminConfigDefaultMultiplierBps,
  isAdminConfigDstConfigs: () => isAdminConfigDstConfigs,
  isAdminConfigPriceFeed: () => isAdminConfigPriceFeed,
  isMultisigConfigAdmins: () => isMultisigConfigAdmins,
  isMultisigConfigAllowlist: () => isMultisigConfigAllowlist,
  isMultisigConfigDenylist: () => isMultisigConfigDenylist,
  isMultisigConfigMsglibs: () => isMultisigConfigMsglibs,
  isMultisigConfigPaused: () => isMultisigConfigPaused,
  isMultisigConfigQuorum: () => isMultisigConfigQuorum,
  isMultisigConfigSigners: () => isMultisigConfigSigners,
  lzOptionBeet: () => lzOptionBeet,
  multisigBeet: () => multisigBeet,
  multisigConfigBeet: () => multisigConfigBeet,
  quoteDvnParamsBeet: () => quoteDvnParamsBeet,
  setConfigParamsBeet: () => setConfigParamsBeet3,
  transactionAccountBeet: () => transactionAccountBeet,
  ulnConfigBeet: () => ulnConfigBeet,
  verifiableParamsBeet: () => verifiableParamsBeet,
  verificationStateBeet: () => verificationStateBeet,
  withdrawFeeParamsBeet: () => withdrawFeeParamsBeet
});
var isMultisigConfigAdmins = (x) => x.__kind === "Admins";
var isMultisigConfigAllowlist = (x) => x.__kind === "Allowlist";
var isMultisigConfigDenylist = (x) => x.__kind === "Denylist";
var isMultisigConfigMsglibs = (x) => x.__kind === "Msglibs";
var isMultisigConfigPaused = (x) => x.__kind === "Paused";
var isMultisigConfigQuorum = (x) => x.__kind === "Quorum";
var isMultisigConfigSigners = (x) => x.__kind === "Signers";
var multisigConfigBeet = beet159.dataEnum([
  [
    "Admins",
    new beet159.FixableBeetArgsStruct(
      [["fields", beet159.tuple([beet159.array(beetSolana85.publicKey)])]],
      'MultisigConfigRecord["Admins"]'
    )
  ],
  [
    "Allowlist",
    new beet159.FixableBeetArgsStruct(
      [["fields", beet159.tuple([beet159.array(beetSolana85.publicKey)])]],
      'MultisigConfigRecord["Allowlist"]'
    )
  ],
  [
    "Denylist",
    new beet159.FixableBeetArgsStruct(
      [["fields", beet159.tuple([beet159.array(beetSolana85.publicKey)])]],
      'MultisigConfigRecord["Denylist"]'
    )
  ],
  [
    "Msglibs",
    new beet159.FixableBeetArgsStruct(
      [["fields", beet159.tuple([beet159.array(beetSolana85.publicKey)])]],
      'MultisigConfigRecord["Msglibs"]'
    )
  ],
  [
    "Paused",
    new beet159.BeetArgsStruct(
      [["fields", beet159.fixedSizeTuple([beet159.bool])]],
      'MultisigConfigRecord["Paused"]'
    )
  ],
  [
    "Quorum",
    new beet159.BeetArgsStruct(
      [["fields", beet159.fixedSizeTuple([beet159.u8])]],
      'MultisigConfigRecord["Quorum"]'
    )
  ],
  [
    "Signers",
    new beet159.FixableBeetArgsStruct(
      [
        [
          "fields",
          beet159.tuple([beet159.array(beet159.uniformFixedSizeArray(beet159.u8, 64))])
        ]
      ],
      'MultisigConfigRecord["Signers"]'
    )
  ]
]);
var VerificationState = /* @__PURE__ */ ((VerificationState2) => {
  VerificationState2[VerificationState2["Verifying"] = 0] = "Verifying";
  VerificationState2[VerificationState2["Verifiable"] = 1] = "Verifiable";
  VerificationState2[VerificationState2["Verified"] = 2] = "Verified";
  VerificationState2[VerificationState2["NotInitializable"] = 3] = "NotInitializable";
  VerificationState2[VerificationState2["VerifiableButCapExceeded"] = 4] = "VerifiableButCapExceeded";
  return VerificationState2;
})(VerificationState || {});
var verificationStateBeet = beet159.fixedScalarEnum(
  VerificationState
);

// src/generated/dvn/index.ts
var PROGRAM_ADDRESS3 = "HtEYV4xB4wvsj5fgTkcfuChYpvGYzgzwvNhgDZQNh7wW";
var PROGRAM_ID3 = new PublicKey(PROGRAM_ADDRESS3);

// src/generated/dvn/events/index.ts
var events_exports2 = {};
__export(events_exports2, {
  adminConfigSetEventBeet: () => adminConfigSetEventBeet,
  feeWithdrawnEventBeet: () => feeWithdrawnEventBeet,
  multisigConfigSetEventBeet: () => multisigConfigSetEventBeet
});
var adminConfigSetEventBeet = new beet159.FixableBeetArgsStruct(
  [["config", adminConfigBeet]],
  "AdminConfigSetEvent"
);
var feeWithdrawnEventBeet = new beet159.BeetArgsStruct(
  [
    ["receiver", beetSolana85.publicKey],
    ["amount", beet159.u64]
  ],
  "FeeWithdrawnEvent"
);
var multisigConfigSetEventBeet = new beet159.FixableBeetArgsStruct(
  [["config", multisigConfigBeet]],
  "MultisigConfigSetEvent"
);

// src/dvn.ts
var DVN = class {
  constructor(programId, endpointId = EndpointId.SOLANA_V2_SANDBOX) {
    this.programId = programId;
    this.dvnDeriver = new DVNDeriver(programId);
    this.vid = endpointId % 3e4;
    this.eventAuthority = new EventPDADeriver(programId).eventAuthority()[0];
  }
  async initDVN(connection, payer, params) {
    const [config] = this.dvnDeriver.config();
    const info = await connection.getAccountInfo(config);
    if (info) {
      throw new Error("DVN already initialized");
    }
    return createInitDvnInstruction(
      {
        payer,
        config
      },
      {
        params
      },
      this.programId
    );
  }
  getDigest(vid, instruction, expiration) {
    return {
      vid,
      programId: instruction.programId,
      accounts: instruction.keys.map((key) => {
        return {
          pubkey: key.pubkey,
          isSigner: key.isSigner,
          isWritable: key.isWritable
        };
      }),
      data: instruction.data,
      expiration
    };
  }
  getExecuteHash(hashBytes) {
    const [executeHash] = this.dvnDeriver.executeHash(hashBytes);
    return executeHash;
  }
  getHashBytes(digest) {
    const [digestBytes] = executeTransactionDigestBeet.serialize(digest);
    const hash = keccak256(digestBytes);
    return Buffer.from(hash.slice(2), "hex");
  }
  async invoke(connection, vid, payer, instruction, expiration, sign) {
    const configState = await this.getConfigState(connection, "confirmed");
    if (!configState) {
      throw new Error("DVN not initialized");
    }
    const [config] = this.dvnDeriver.config();
    const digest = this.getDigest(vid, instruction, expiration);
    const hashBytes = this.getHashBytes(digest);
    const executeHash = this.getExecuteHash(hashBytes);
    const signatures = [];
    const signResult = await sign.sign(hashBytes);
    signatures.push(...signResult.map((s) => Array.from(s.signature).concat([s.recoveryId])));
    const param = {
      digest,
      signatures
    };
    const remainingAccounts = instruction.keys.map((key) => {
      key.isSigner = false;
      return key;
    });
    return createInvokeInstruction(
      {
        signer: payer,
        config,
        executeHash,
        program: this.programId,
        eventAuthority: this.eventAuthority,
        anchorRemainingAccounts: [
          {
            pubkey: instruction.programId,
            isSigner: false,
            isWritable: false
          }
        ].concat(remainingAccounts)
      },
      {
        params: param
      },
      this.programId
    );
  }
  createSetQuorumInstruction(quorum) {
    const params = {
      fields: [quorum],
      __kind: "Quorum"
    };
    const fixedBeet = multisigConfigBeet.toFixedFromValue(params);
    const buffer = Buffer.alloc(fixedBeet.byteSize);
    fixedBeet.write(buffer, 0, params);
    return new TransactionInstruction({
      programId: this.programId,
      keys: [],
      data: buffer
    });
  }
  createSetAdminsInstruction(admins) {
    const params = {
      fields: [admins],
      __kind: "Admins"
    };
    const fixedBeet = multisigConfigBeet.toFixedFromValue(params);
    const buffer = Buffer.alloc(fixedBeet.byteSize);
    fixedBeet.write(buffer, 0, params);
    return new TransactionInstruction({
      programId: this.programId,
      keys: [],
      data: buffer
    });
  }
  createSetSignersInstruction(signers) {
    const params = {
      fields: [signers.map((s) => Array.from(s))],
      __kind: "Signers"
    };
    const fixedBeet = multisigConfigBeet.toFixedFromValue(params);
    const buffer = Buffer.alloc(fixedBeet.byteSize);
    fixedBeet.write(buffer, 0, params);
    return new TransactionInstruction({
      programId: this.programId,
      keys: [],
      data: buffer
    });
  }
  createSetAllowlistInstruction(allowlist) {
    const params = {
      fields: [allowlist],
      __kind: "Allowlist"
    };
    const fixedBeet = multisigConfigBeet.toFixedFromValue(params);
    const buffer = Buffer.alloc(fixedBeet.byteSize);
    fixedBeet.write(buffer, 0, params);
    return new TransactionInstruction({
      programId: this.programId,
      keys: [],
      data: buffer
    });
  }
  createSetDenylistInstruction(denylist) {
    const params = {
      fields: [denylist],
      __kind: "Denylist"
    };
    const fixedBeet = multisigConfigBeet.toFixedFromValue(params);
    const buffer = Buffer.alloc(fixedBeet.byteSize);
    fixedBeet.write(buffer, 0, params);
    return new TransactionInstruction({
      programId: this.programId,
      keys: [],
      data: buffer
    });
  }
  createSetPauseInstruction(pause) {
    const params = {
      fields: [pause],
      __kind: "Paused"
    };
    const fixedBeet = multisigConfigBeet.toFixedFromValue(params);
    const buffer = Buffer.alloc(fixedBeet.byteSize);
    fixedBeet.write(buffer, 0, params);
    return new TransactionInstruction({
      programId: this.programId,
      keys: [],
      data: buffer
    });
  }
  createSetDefaultMultiplierBpsInstruction(admin, defaultMultiplierBps) {
    const [configAccount] = this.dvnDeriver.config();
    return createSetConfigInstruction3(
      {
        admin,
        config: configAccount,
        program: this.programId,
        eventAuthority: this.eventAuthority
      },
      {
        params: {
          config: {
            fields: [defaultMultiplierBps],
            __kind: "DefaultMultiplierBps"
          }
        }
      },
      this.programId
    );
  }
  createChangeAdminsInstruction(admin, admins) {
    const [configAccount] = this.dvnDeriver.config();
    return createSetConfigInstruction3(
      {
        admin,
        config: configAccount,
        program: this.programId,
        eventAuthority: this.eventAuthority
      },
      {
        params: {
          config: {
            fields: [admins],
            __kind: "Admins"
          }
        }
      },
      this.programId
    );
  }
  createSetDstConfigInstruction(admin, dstConfigs) {
    const [configAccount] = this.dvnDeriver.config();
    return createSetConfigInstruction3(
      {
        admin,
        config: configAccount,
        program: this.programId,
        eventAuthority: this.eventAuthority
      },
      {
        params: {
          config: {
            fields: [dstConfigs],
            __kind: "DstConfigs"
          }
        }
      },
      this.programId
    );
  }
  createSetMsgLibsInstruction(msglibPrograms) {
    const params = {
      fields: [msglibPrograms],
      __kind: "Msglibs"
    };
    const fixedBeet = multisigConfigBeet.toFixedFromValue(params);
    const buffer = Buffer.alloc(fixedBeet.byteSize);
    fixedBeet.write(buffer, 0, params);
    return new TransactionInstruction({
      programId: this.programId,
      keys: [],
      data: buffer
    });
  }
  _getExpiration() {
    return (/* @__PURE__ */ new Date()).getTime() / 1e3 + 120;
  }
  async setMsgLibs(connection, payer, msgLibs, sign) {
    const expiration = this._getExpiration();
    return this.invoke(connection, this.vid, payer, this.createSetMsgLibsInstruction(msgLibs), expiration, sign);
  }
  createSetPriceFeedInstruction(admin, priceFeedProgram) {
    const [configAccount] = this.dvnDeriver.config();
    const [priceFeedPda] = new PriceFeedPDADeriver(priceFeedProgram).priceFeed();
    return createSetConfigInstruction3(
      {
        admin,
        config: configAccount,
        program: this.programId,
        eventAuthority: this.eventAuthority
      },
      {
        params: {
          config: {
            fields: [priceFeedPda],
            __kind: "PriceFeed"
          }
        }
      },
      this.programId
    );
  }
  getQuoteIXAccountMetaForCPI(priceFeedConfig, priceFeedProgram, payment) {
    const [config] = this.dvnDeriver.config();
    const keys = createQuoteDvnInstructionAccounts(
      {
        dvnConfig: config,
        priceFeedConfig,
        priceFeedProgram
      },
      this.programId
    );
    if (payment) {
      keys[0].isWritable = true;
    }
    return [
      {
        pubkey: this.programId,
        isWritable: false,
        isSigner: false
      }
    ].concat(keys);
  }
  async getConfigState(connection, commitment = "confirmed") {
    const [config] = this.dvnDeriver.config();
    try {
      return await DvnConfig.fromAccountAddress(connection, config, commitment);
    } catch (e) {
      return null;
    }
  }
};

// src/executor.ts
var executor_exports = {};
__export(executor_exports, {
  EidNotSupportedError: () => EidNotSupportedError2,
  ExecutionState: () => ExecutionState,
  Executor: () => Executor,
  ExecutorConfig: () => ExecutorConfig,
  ExecutorIsAdminError: () => ExecutorIsAdminError,
  InsufficientBalanceError: () => InsufficientBalanceError,
  InvalidNativeDropReceiverError: () => InvalidNativeDropReceiverError,
  InvalidNativeDropRequestsLengthError: () => InvalidNativeDropRequestsLengthError,
  InvalidOwnerError: () => InvalidOwnerError,
  InvalidSizeError: () => InvalidSizeError,
  MsgLibNotAllowedError: () => MsgLibNotAllowedError2,
  NativeAmountExceedsCapError: () => NativeAmountExceedsCapError,
  Nonce: () => Nonce2,
  NotAdminError: () => NotAdminError2,
  NotExecutorError: () => NotExecutorError,
  PROGRAM_ADDRESS: () => PROGRAM_ADDRESS4,
  PROGRAM_ID: () => PROGRAM_ID4,
  PausedError: () => PausedError2,
  TooManyAdminsError: () => TooManyAdminsError2,
  TooManyExecutorsError: () => TooManyExecutorsError,
  TooManyOptionTypesError: () => TooManyOptionTypesError2,
  UnsupportedOptionTypeError: () => UnsupportedOptionTypeError,
  ZeroLzComposeGasProvidedError: () => ZeroLzComposeGasProvidedError,
  ZeroLzReceiveGasProvidedError: () => ZeroLzReceiveGasProvidedError,
  accountProviders: () => accountProviders4,
  accounts: () => accounts_exports4,
  aclBeet: () => aclBeet2,
  adminSetConfigInstructionDiscriminator: () => adminSetConfigInstructionDiscriminator,
  adminSetConfigParamsBeet: () => adminSetConfigParamsBeet,
  adminSetConfigStruct: () => adminSetConfigStruct,
  composeInstructionDiscriminator: () => composeInstructionDiscriminator,
  composeParamsBeet: () => composeParamsBeet,
  composeStruct: () => composeStruct,
  createAdminSetConfigInstruction: () => createAdminSetConfigInstruction,
  createAdminSetConfigInstructionAccounts: () => createAdminSetConfigInstructionAccounts,
  createComposeInstruction: () => createComposeInstruction,
  createComposeInstructionAccounts: () => createComposeInstructionAccounts,
  createExecutableInstruction: () => createExecutableInstruction,
  createExecutableInstructionAccounts: () => createExecutableInstructionAccounts,
  createExecuteInstruction: () => createExecuteInstruction,
  createExecuteInstructionAccounts: () => createExecuteInstructionAccounts,
  createInitExecutorInstruction: () => createInitExecutorInstruction,
  createInitExecutorInstructionAccounts: () => createInitExecutorInstructionAccounts,
  createNativeDropInstruction: () => createNativeDropInstruction,
  createNativeDropInstructionAccounts: () => createNativeDropInstructionAccounts,
  createOwnerSetConfigInstruction: () => createOwnerSetConfigInstruction,
  createOwnerSetConfigInstructionAccounts: () => createOwnerSetConfigInstructionAccounts,
  createQuoteExecutorInstruction: () => createQuoteExecutorInstruction,
  createQuoteExecutorInstructionAccounts: () => createQuoteExecutorInstructionAccounts,
  dstConfigBeet: () => dstConfigBeet2,
  errorFromCode: () => errorFromCode4,
  errorFromName: () => errorFromName4,
  events: () => events_exports3,
  executableInstructionDiscriminator: () => executableInstructionDiscriminator,
  executableParamsBeet: () => executableParamsBeet,
  executableStruct: () => executableStruct,
  executeInstructionDiscriminator: () => executeInstructionDiscriminator,
  executeParamsBeet: () => executeParamsBeet,
  executeStruct: () => executeStruct,
  executionStateBeet: () => executionStateBeet,
  executorConfigBeet: () => executorConfigBeet,
  executorConfigDiscriminator: () => executorConfigDiscriminator,
  initExecutorInstructionDiscriminator: () => initExecutorInstructionDiscriminator,
  initExecutorParamsBeet: () => initExecutorParamsBeet,
  initExecutorStruct: () => initExecutorStruct,
  instructions: () => instructions_exports4,
  isAdminSetConfigParamsDefaultMultiplierBps: () => isAdminSetConfigParamsDefaultMultiplierBps,
  isAdminSetConfigParamsDstConfigs: () => isAdminSetConfigParamsDstConfigs,
  isAdminSetConfigParamsPriceFeed: () => isAdminSetConfigParamsPriceFeed,
  isOwnerSetConfigParamsAdmins: () => isOwnerSetConfigParamsAdmins,
  isOwnerSetConfigParamsAllowlist: () => isOwnerSetConfigParamsAllowlist,
  isOwnerSetConfigParamsDenylist: () => isOwnerSetConfigParamsDenylist,
  isOwnerSetConfigParamsExecutors: () => isOwnerSetConfigParamsExecutors,
  isOwnerSetConfigParamsMsglibs: () => isOwnerSetConfigParamsMsglibs,
  isOwnerSetConfigParamsOwner: () => isOwnerSetConfigParamsOwner,
  isOwnerSetConfigParamsPaused: () => isOwnerSetConfigParamsPaused,
  lzComposeParamsBeet: () => lzComposeParamsBeet,
  lzOptionBeet: () => lzOptionBeet2,
  lzReceiveParamsBeet: () => lzReceiveParamsBeet,
  nativeDropInstructionDiscriminator: () => nativeDropInstructionDiscriminator,
  nativeDropParamsBeet: () => nativeDropParamsBeet,
  nativeDropRequestBeet: () => nativeDropRequestBeet,
  nativeDropStruct: () => nativeDropStruct,
  nonceBeet: () => nonceBeet2,
  nonceDiscriminator: () => nonceDiscriminator2,
  ownerSetConfigInstructionDiscriminator: () => ownerSetConfigInstructionDiscriminator,
  ownerSetConfigParamsBeet: () => ownerSetConfigParamsBeet,
  ownerSetConfigStruct: () => ownerSetConfigStruct,
  quoteExecutorInstructionDiscriminator: () => quoteExecutorInstructionDiscriminator,
  quoteExecutorParamsBeet: () => quoteExecutorParamsBeet,
  quoteExecutorStruct: () => quoteExecutorStruct,
  types: () => types_exports4
});

// src/generated/executor/accounts/index.ts
var accounts_exports4 = {};
__export(accounts_exports4, {
  ExecutorConfig: () => ExecutorConfig,
  Nonce: () => Nonce2,
  accountProviders: () => accountProviders4,
  executorConfigBeet: () => executorConfigBeet,
  executorConfigDiscriminator: () => executorConfigDiscriminator,
  nonceBeet: () => nonceBeet2,
  nonceDiscriminator: () => nonceDiscriminator2
});
var aclBeet2 = new beet159.FixableBeetArgsStruct(
  [
    ["allowList", beet159.array(beetSolana85.publicKey)],
    ["denyList", beet159.array(beetSolana85.publicKey)]
  ],
  "Acl"
);
var dstConfigBeet2 = new beet159.FixableBeetArgsStruct(
  [
    ["eid", beet159.u32],
    ["lzReceiveBaseGas", beet159.u32],
    ["lzComposeBaseGas", beet159.u32],
    ["multiplierBps", beet159.coption(beet159.u16)],
    ["floorMarginUsd", beet159.coption(beet159.u128)],
    ["nativeDropCap", beet159.u128]
  ],
  "DstConfig"
);

// src/generated/executor/accounts/ExecutorConfig.ts
var executorConfigDiscriminator = [134, 17, 226, 24, 10, 173, 157, 78];
var ExecutorConfig = class _ExecutorConfig {
  constructor(bump, owner, acl, admins, executors, msglibs, paused, defaultMultiplierBps, priceFeed, dstConfigs) {
    this.bump = bump;
    this.owner = owner;
    this.acl = acl;
    this.admins = admins;
    this.executors = executors;
    this.msglibs = msglibs;
    this.paused = paused;
    this.defaultMultiplierBps = defaultMultiplierBps;
    this.priceFeed = priceFeed;
    this.dstConfigs = dstConfigs;
  }
  /**
   * Creates a {@link ExecutorConfig} instance from the provided args.
   */
  static fromArgs(args) {
    return new _ExecutorConfig(
      args.bump,
      args.owner,
      args.acl,
      args.admins,
      args.executors,
      args.msglibs,
      args.paused,
      args.defaultMultiplierBps,
      args.priceFeed,
      args.dstConfigs
    );
  }
  /**
   * Deserializes the {@link ExecutorConfig} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(accountInfo, offset = 0) {
    return _ExecutorConfig.deserialize(accountInfo.data, offset);
  }
  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link ExecutorConfig} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(connection, address, commitmentOrConfig) {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    );
    if (accountInfo == null) {
      throw new Error(`Unable to find ExecutorConfig account at ${address}`);
    }
    return _ExecutorConfig.fromAccountInfo(accountInfo, 0)[0];
  }
  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(programId = new web314.PublicKey(
    "6doghB248px58JSSwG4qejQ46kFMW4AMj7vzJnWZHNZn"
  )) {
    return beetSolana85.GpaBuilder.fromStruct(programId, executorConfigBeet);
  }
  /**
   * Deserializes the {@link ExecutorConfig} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf, offset = 0) {
    return executorConfigBeet.deserialize(buf, offset);
  }
  /**
   * Serializes the {@link ExecutorConfig} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize() {
    return executorConfigBeet.serialize({
      accountDiscriminator: executorConfigDiscriminator,
      ...this
    });
  }
  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link ExecutorConfig} for the provided args.
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   */
  static byteSize(args) {
    const instance = _ExecutorConfig.fromArgs(args);
    return executorConfigBeet.toFixedFromValue({
      accountDiscriminator: executorConfigDiscriminator,
      ...instance
    }).byteSize;
  }
  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link ExecutorConfig} data from rent
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(args, connection, commitment) {
    return connection.getMinimumBalanceForRentExemption(
      _ExecutorConfig.byteSize(args),
      commitment
    );
  }
  /**
   * Returns a readable version of {@link ExecutorConfig} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      bump: this.bump,
      owner: this.owner.toBase58(),
      acl: this.acl,
      admins: this.admins,
      executors: this.executors,
      msglibs: this.msglibs,
      paused: this.paused,
      defaultMultiplierBps: this.defaultMultiplierBps,
      priceFeed: this.priceFeed.toBase58(),
      dstConfigs: this.dstConfigs
    };
  }
};
var executorConfigBeet = new beet159.FixableBeetStruct(
  [
    ["accountDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["bump", beet159.u8],
    ["owner", beetSolana85.publicKey],
    ["acl", aclBeet2],
    ["admins", beet159.array(beetSolana85.publicKey)],
    ["executors", beet159.array(beetSolana85.publicKey)],
    ["msglibs", beet159.array(beetSolana85.publicKey)],
    ["paused", beet159.bool],
    ["defaultMultiplierBps", beet159.u16],
    ["priceFeed", beetSolana85.publicKey],
    ["dstConfigs", beet159.array(dstConfigBeet2)]
  ],
  ExecutorConfig.fromArgs,
  "ExecutorConfig"
);
var nonceDiscriminator2 = [143, 197, 147, 95, 106, 165, 50, 43];
var Nonce2 = class _Nonce {
  constructor(bump, outboundNonce, inboundNonce) {
    this.bump = bump;
    this.outboundNonce = outboundNonce;
    this.inboundNonce = inboundNonce;
  }
  /**
   * Creates a {@link Nonce} instance from the provided args.
   */
  static fromArgs(args) {
    return new _Nonce(args.bump, args.outboundNonce, args.inboundNonce);
  }
  /**
   * Deserializes the {@link Nonce} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(accountInfo, offset = 0) {
    return _Nonce.deserialize(accountInfo.data, offset);
  }
  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link Nonce} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(connection, address, commitmentOrConfig) {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    );
    if (accountInfo == null) {
      throw new Error(`Unable to find Nonce account at ${address}`);
    }
    return _Nonce.fromAccountInfo(accountInfo, 0)[0];
  }
  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(programId = new web314.PublicKey(
    "6doghB248px58JSSwG4qejQ46kFMW4AMj7vzJnWZHNZn"
  )) {
    return beetSolana85.GpaBuilder.fromStruct(programId, nonceBeet2);
  }
  /**
   * Deserializes the {@link Nonce} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf, offset = 0) {
    return nonceBeet2.deserialize(buf, offset);
  }
  /**
   * Serializes the {@link Nonce} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize() {
    return nonceBeet2.serialize({
      accountDiscriminator: nonceDiscriminator2,
      ...this
    });
  }
  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link Nonce}
   */
  static get byteSize() {
    return nonceBeet2.byteSize;
  }
  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link Nonce} data from rent
   *
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(connection, commitment) {
    return connection.getMinimumBalanceForRentExemption(
      _Nonce.byteSize,
      commitment
    );
  }
  /**
   * Determines if the provided {@link Buffer} has the correct byte size to
   * hold {@link Nonce} data.
   */
  static hasCorrectByteSize(buf, offset = 0) {
    return buf.byteLength - offset === _Nonce.byteSize;
  }
  /**
   * Returns a readable version of {@link Nonce} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      bump: this.bump,
      outboundNonce: (() => {
        const x = this.outboundNonce;
        if (typeof x.toNumber === "function") {
          try {
            return x.toNumber();
          } catch (_) {
            return x;
          }
        }
        return x;
      })(),
      inboundNonce: (() => {
        const x = this.inboundNonce;
        if (typeof x.toNumber === "function") {
          try {
            return x.toNumber();
          } catch (_) {
            return x;
          }
        }
        return x;
      })()
    };
  }
};
var nonceBeet2 = new beet159.BeetStruct(
  [
    ["accountDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["bump", beet159.u8],
    ["outboundNonce", beet159.u64],
    ["inboundNonce", beet159.u64]
  ],
  Nonce2.fromArgs,
  "Nonce"
);

// src/generated/executor/accounts/index.ts
var accountProviders4 = { Nonce: Nonce2, ExecutorConfig };

// src/generated/executor/events/index.ts
var events_exports3 = {};
__export(events_exports3, {
  nativeDropAppliedEventBeet: () => nativeDropAppliedEventBeet
});
var nativeDropRequestBeet = new beet159.BeetArgsStruct(
  [
    ["receiver", beetSolana85.publicKey],
    ["amount", beet159.u64]
  ],
  "NativeDropRequest"
);

// src/generated/executor/events/NativeDropAppliedEvent.ts
var nativeDropAppliedEventBeet = new beet159.FixableBeetArgsStruct(
  [
    ["srcEid", beet159.u32],
    ["sender", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["nonce", beet159.u64],
    ["dstEid", beet159.u32],
    ["oapp", beetSolana85.publicKey],
    ["nativeDropRequests", beet159.array(nativeDropRequestBeet)],
    ["successes", beet159.array(beet159.bool)]
  ],
  "NativeDropAppliedEvent"
);

// src/generated/executor/instructions/index.ts
var instructions_exports4 = {};
__export(instructions_exports4, {
  adminSetConfigInstructionDiscriminator: () => adminSetConfigInstructionDiscriminator,
  adminSetConfigStruct: () => adminSetConfigStruct,
  composeInstructionDiscriminator: () => composeInstructionDiscriminator,
  composeStruct: () => composeStruct,
  createAdminSetConfigInstruction: () => createAdminSetConfigInstruction,
  createAdminSetConfigInstructionAccounts: () => createAdminSetConfigInstructionAccounts,
  createComposeInstruction: () => createComposeInstruction,
  createComposeInstructionAccounts: () => createComposeInstructionAccounts,
  createExecutableInstruction: () => createExecutableInstruction,
  createExecutableInstructionAccounts: () => createExecutableInstructionAccounts,
  createExecuteInstruction: () => createExecuteInstruction,
  createExecuteInstructionAccounts: () => createExecuteInstructionAccounts,
  createInitExecutorInstruction: () => createInitExecutorInstruction,
  createInitExecutorInstructionAccounts: () => createInitExecutorInstructionAccounts,
  createNativeDropInstruction: () => createNativeDropInstruction,
  createNativeDropInstructionAccounts: () => createNativeDropInstructionAccounts,
  createOwnerSetConfigInstruction: () => createOwnerSetConfigInstruction,
  createOwnerSetConfigInstructionAccounts: () => createOwnerSetConfigInstructionAccounts,
  createQuoteExecutorInstruction: () => createQuoteExecutorInstruction,
  createQuoteExecutorInstructionAccounts: () => createQuoteExecutorInstructionAccounts,
  executableInstructionDiscriminator: () => executableInstructionDiscriminator,
  executableStruct: () => executableStruct,
  executeInstructionDiscriminator: () => executeInstructionDiscriminator,
  executeStruct: () => executeStruct,
  initExecutorInstructionDiscriminator: () => initExecutorInstructionDiscriminator,
  initExecutorStruct: () => initExecutorStruct,
  nativeDropInstructionDiscriminator: () => nativeDropInstructionDiscriminator,
  nativeDropStruct: () => nativeDropStruct,
  ownerSetConfigInstructionDiscriminator: () => ownerSetConfigInstructionDiscriminator,
  ownerSetConfigStruct: () => ownerSetConfigStruct,
  quoteExecutorInstructionDiscriminator: () => quoteExecutorInstructionDiscriminator,
  quoteExecutorStruct: () => quoteExecutorStruct
});
var isAdminSetConfigParamsPriceFeed = (x) => x.__kind === "PriceFeed";
var isAdminSetConfigParamsDefaultMultiplierBps = (x) => x.__kind === "DefaultMultiplierBps";
var isAdminSetConfigParamsDstConfigs = (x) => x.__kind === "DstConfigs";
var adminSetConfigParamsBeet = beet159.dataEnum([
  [
    "PriceFeed",
    new beet159.BeetArgsStruct(
      [["fields", beet159.fixedSizeTuple([beetSolana85.publicKey])]],
      'AdminSetConfigParamsRecord["PriceFeed"]'
    )
  ],
  [
    "DefaultMultiplierBps",
    new beet159.BeetArgsStruct(
      [["fields", beet159.fixedSizeTuple([beet159.u16])]],
      'AdminSetConfigParamsRecord["DefaultMultiplierBps"]'
    )
  ],
  [
    "DstConfigs",
    new beet159.FixableBeetArgsStruct(
      [["fields", beet159.tuple([beet159.array(dstConfigBeet2)])]],
      'AdminSetConfigParamsRecord["DstConfigs"]'
    )
  ]
]);

// src/generated/executor/instructions/adminSetConfig.ts
var adminSetConfigStruct = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", adminSetConfigParamsBeet]
  ],
  "AdminSetConfigInstructionArgs"
);
var adminSetConfigInstructionDiscriminator = [
  35,
  56,
  160,
  84,
  132,
  156,
  27,
  79
];
function createAdminSetConfigInstruction(accounts, args, programId) {
  const [data] = adminSetConfigStruct.serialize({
    instructionDiscriminator: adminSetConfigInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.config,
      isWritable: true,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createAdminSetConfigInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.config,
      isWritable: true,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var lzComposeParamsBeet = new beet159.FixableBeetArgsStruct(
  [
    ["from", beetSolana85.publicKey],
    ["to", beetSolana85.publicKey],
    ["guid", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["index", beet159.u16],
    ["message", beet159.bytes],
    ["extraData", beet159.bytes]
  ],
  "LzComposeParams"
);

// src/generated/executor/types/ComposeParams.ts
var composeParamsBeet = new beet159.FixableBeetArgsStruct(
  [
    ["lzCompose", lzComposeParamsBeet],
    ["computeUnits", beet159.u64],
    ["value", beet159.u64]
  ],
  "ComposeParams"
);

// src/generated/executor/instructions/compose.ts
var composeStruct = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", composeParamsBeet]
  ],
  "ComposeInstructionArgs"
);
var composeInstructionDiscriminator = [
  106,
  64,
  131,
  142,
  7,
  159,
  42,
  15
];
function createComposeInstruction(accounts, args, programId) {
  const [data] = composeStruct.serialize({
    instructionDiscriminator: composeInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.executor,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.config,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.endpointProgram,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.endpointEventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createComposeInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.executor,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.config,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.endpointProgram,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.endpointEventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var executableParamsBeet = new beet159.BeetArgsStruct(
  [
    ["receiver", beetSolana85.publicKey],
    ["srcEid", beet159.u32],
    ["sender", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["nonce", beet159.u64]
  ],
  "ExecutableParams"
);

// src/generated/executor/instructions/executable.ts
var executableStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", executableParamsBeet]
  ],
  "ExecutableInstructionArgs"
);
var executableInstructionDiscriminator = [
  57,
  165,
  171,
  234,
  157,
  191,
  156,
  25
];
function createExecutableInstruction(accounts, args, programId) {
  const [data] = executableStruct.serialize({
    instructionDiscriminator: executableInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.nonce,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.payloadHash,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createExecutableInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.nonce,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.payloadHash,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var lzReceiveParamsBeet = new beet159.FixableBeetArgsStruct(
  [
    ["srcEid", beet159.u32],
    ["sender", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["nonce", beet159.u64],
    ["guid", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["message", beet159.bytes],
    ["extraData", beet159.bytes]
  ],
  "LzReceiveParams"
);

// src/generated/executor/types/ExecuteParams.ts
var executeParamsBeet = new beet159.FixableBeetArgsStruct(
  [
    ["receiver", beetSolana85.publicKey],
    ["lzReceive", lzReceiveParamsBeet],
    ["value", beet159.u64],
    ["computeUnits", beet159.u64]
  ],
  "ExecuteParams"
);

// src/generated/executor/instructions/execute.ts
var executeStruct = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", executeParamsBeet]
  ],
  "ExecuteInstructionArgs"
);
var executeInstructionDiscriminator = [
  130,
  221,
  242,
  154,
  13,
  193,
  189,
  29
];
function createExecuteInstruction(accounts, args, programId) {
  const [data] = executeStruct.serialize({
    instructionDiscriminator: executeInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.executor,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.config,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.endpointProgram,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.endpointEventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createExecuteInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.executor,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.config,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.endpointProgram,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.endpointEventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var initExecutorParamsBeet = new beet159.FixableBeetArgsStruct(
  [
    ["owner", beetSolana85.publicKey],
    ["admins", beet159.array(beetSolana85.publicKey)],
    ["executors", beet159.array(beetSolana85.publicKey)],
    ["msglibs", beet159.array(beetSolana85.publicKey)],
    ["priceFeed", beetSolana85.publicKey]
  ],
  "InitExecutorParams"
);

// src/generated/executor/instructions/initExecutor.ts
var initExecutorStruct = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", initExecutorParamsBeet]
  ],
  "InitExecutorInstructionArgs"
);
var initExecutorInstructionDiscriminator = [
  195,
  68,
  116,
  173,
  55,
  173,
  159,
  31
];
function createInitExecutorInstruction(accounts, args, programId) {
  const [data] = initExecutorStruct.serialize({
    instructionDiscriminator: initExecutorInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.config,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createInitExecutorInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.config,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var nativeDropParamsBeet = new beet159.FixableBeetArgsStruct(
  [
    ["srcEid", beet159.u32],
    ["sender", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["nonce", beet159.u64],
    ["dstEid", beet159.u32],
    ["oapp", beetSolana85.publicKey],
    ["nativeDropRequests", beet159.array(nativeDropRequestBeet)]
  ],
  "NativeDropParams"
);

// src/generated/executor/instructions/nativeDrop.ts
var nativeDropStruct = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", nativeDropParamsBeet]
  ],
  "NativeDropInstructionArgs"
);
var nativeDropInstructionDiscriminator = [
  105,
  30,
  218,
  121,
  155,
  234,
  85,
  12
];
function createNativeDropInstruction(accounts, args, programId) {
  const [data] = nativeDropStruct.serialize({
    instructionDiscriminator: nativeDropInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.executor,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.config,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createNativeDropInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.executor,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.config,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var isOwnerSetConfigParamsAdmins = (x) => x.__kind === "Admins";
var isOwnerSetConfigParamsExecutors = (x) => x.__kind === "Executors";
var isOwnerSetConfigParamsMsglibs = (x) => x.__kind === "Msglibs";
var isOwnerSetConfigParamsOwner = (x) => x.__kind === "Owner";
var isOwnerSetConfigParamsPaused = (x) => x.__kind === "Paused";
var isOwnerSetConfigParamsAllowlist = (x) => x.__kind === "Allowlist";
var isOwnerSetConfigParamsDenylist = (x) => x.__kind === "Denylist";
var ownerSetConfigParamsBeet = beet159.dataEnum([
  [
    "Admins",
    new beet159.FixableBeetArgsStruct(
      [["fields", beet159.tuple([beet159.array(beetSolana85.publicKey)])]],
      'OwnerSetConfigParamsRecord["Admins"]'
    )
  ],
  [
    "Executors",
    new beet159.FixableBeetArgsStruct(
      [["fields", beet159.tuple([beet159.array(beetSolana85.publicKey)])]],
      'OwnerSetConfigParamsRecord["Executors"]'
    )
  ],
  [
    "Msglibs",
    new beet159.FixableBeetArgsStruct(
      [["fields", beet159.tuple([beet159.array(beetSolana85.publicKey)])]],
      'OwnerSetConfigParamsRecord["Msglibs"]'
    )
  ],
  [
    "Owner",
    new beet159.BeetArgsStruct(
      [["fields", beet159.fixedSizeTuple([beetSolana85.publicKey])]],
      'OwnerSetConfigParamsRecord["Owner"]'
    )
  ],
  [
    "Paused",
    new beet159.BeetArgsStruct(
      [["fields", beet159.fixedSizeTuple([beet159.bool])]],
      'OwnerSetConfigParamsRecord["Paused"]'
    )
  ],
  [
    "Allowlist",
    new beet159.FixableBeetArgsStruct(
      [["fields", beet159.tuple([beet159.array(beetSolana85.publicKey)])]],
      'OwnerSetConfigParamsRecord["Allowlist"]'
    )
  ],
  [
    "Denylist",
    new beet159.FixableBeetArgsStruct(
      [["fields", beet159.tuple([beet159.array(beetSolana85.publicKey)])]],
      'OwnerSetConfigParamsRecord["Denylist"]'
    )
  ]
]);

// src/generated/executor/instructions/ownerSetConfig.ts
var ownerSetConfigStruct = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", ownerSetConfigParamsBeet]
  ],
  "OwnerSetConfigInstructionArgs"
);
var ownerSetConfigInstructionDiscriminator = [
  99,
  197,
  129,
  19,
  164,
  164,
  183,
  123
];
function createOwnerSetConfigInstruction(accounts, args, programId) {
  const [data] = ownerSetConfigStruct.serialize({
    instructionDiscriminator: ownerSetConfigInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.owner,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.config,
      isWritable: true,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createOwnerSetConfigInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.owner,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.config,
      isWritable: true,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var lzOptionBeet2 = new beet159.FixableBeetArgsStruct(
  [
    ["optionType", beet159.u8],
    ["params", beet159.bytes]
  ],
  "LzOption"
);

// src/generated/executor/types/QuoteExecutorParams.ts
var quoteExecutorParamsBeet = new beet159.FixableBeetArgsStruct(
  [
    ["msglib", beetSolana85.publicKey],
    ["dstEid", beet159.u32],
    ["sender", beetSolana85.publicKey],
    ["calldataSize", beet159.u64],
    ["options", beet159.array(lzOptionBeet2)]
  ],
  "QuoteExecutorParams"
);

// src/generated/executor/instructions/quoteExecutor.ts
var quoteExecutorStruct = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", quoteExecutorParamsBeet]
  ],
  "QuoteExecutorInstructionArgs"
);
var quoteExecutorInstructionDiscriminator = [
  84,
  246,
  255,
  191,
  82,
  65,
  164,
  92
];
function createQuoteExecutorInstruction(accounts, args, programId) {
  const [data] = quoteExecutorStruct.serialize({
    instructionDiscriminator: quoteExecutorInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.executorConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.priceFeedProgram,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.priceFeedConfig,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createQuoteExecutorInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.executorConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.priceFeedProgram,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.priceFeedConfig,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}

// src/generated/executor/types/index.ts
var types_exports4 = {};
__export(types_exports4, {
  ExecutionState: () => ExecutionState,
  aclBeet: () => aclBeet2,
  adminSetConfigParamsBeet: () => adminSetConfigParamsBeet,
  composeParamsBeet: () => composeParamsBeet,
  dstConfigBeet: () => dstConfigBeet2,
  executableParamsBeet: () => executableParamsBeet,
  executeParamsBeet: () => executeParamsBeet,
  executionStateBeet: () => executionStateBeet,
  initExecutorParamsBeet: () => initExecutorParamsBeet,
  isAdminSetConfigParamsDefaultMultiplierBps: () => isAdminSetConfigParamsDefaultMultiplierBps,
  isAdminSetConfigParamsDstConfigs: () => isAdminSetConfigParamsDstConfigs,
  isAdminSetConfigParamsPriceFeed: () => isAdminSetConfigParamsPriceFeed,
  isOwnerSetConfigParamsAdmins: () => isOwnerSetConfigParamsAdmins,
  isOwnerSetConfigParamsAllowlist: () => isOwnerSetConfigParamsAllowlist,
  isOwnerSetConfigParamsDenylist: () => isOwnerSetConfigParamsDenylist,
  isOwnerSetConfigParamsExecutors: () => isOwnerSetConfigParamsExecutors,
  isOwnerSetConfigParamsMsglibs: () => isOwnerSetConfigParamsMsglibs,
  isOwnerSetConfigParamsOwner: () => isOwnerSetConfigParamsOwner,
  isOwnerSetConfigParamsPaused: () => isOwnerSetConfigParamsPaused,
  lzComposeParamsBeet: () => lzComposeParamsBeet,
  lzOptionBeet: () => lzOptionBeet2,
  lzReceiveParamsBeet: () => lzReceiveParamsBeet,
  nativeDropParamsBeet: () => nativeDropParamsBeet,
  nativeDropRequestBeet: () => nativeDropRequestBeet,
  ownerSetConfigParamsBeet: () => ownerSetConfigParamsBeet,
  quoteExecutorParamsBeet: () => quoteExecutorParamsBeet
});
var ExecutionState = /* @__PURE__ */ ((ExecutionState2) => {
  ExecutionState2[ExecutionState2["NotExecutable"] = 0] = "NotExecutable";
  ExecutionState2[ExecutionState2["VerifiedButNotExecutable"] = 1] = "VerifiedButNotExecutable";
  ExecutionState2[ExecutionState2["Executable"] = 2] = "Executable";
  ExecutionState2[ExecutionState2["Executed"] = 3] = "Executed";
  return ExecutionState2;
})(ExecutionState || {});
var executionStateBeet = beet159.fixedScalarEnum(
  ExecutionState
);
var AddressType = uniformFixedSizeArray(u8, 32);
var MSG_TYPE_OFFSET = 0;
var MessageType = /* @__PURE__ */ ((MessageType2) => {
  MessageType2[MessageType2["VANILLA"] = 1] = "VANILLA";
  MessageType2[MessageType2["COMPOSED_TYPE"] = 2] = "COMPOSED_TYPE";
  return MessageType2;
})(MessageType || {});
var LzReceiveParamsBeet = new FixableBeetArgsStruct(
  [
    ["srcEid", u32],
    ["sender", uniformFixedSizeArray(u8, 32)],
    ["nonce", u64],
    ["guid", uniformFixedSizeArray(u8, 32)],
    ["message", bytes],
    ["callerParams", bytes]
  ],
  "LzReceiveParams"
);
var LzComposeParamsBeet = new FixableBeetArgsStruct(
  [
    ["from", beetSolana85.publicKey],
    ["to", beetSolana85.publicKey],
    ["guid", uniformFixedSizeArray(u8, 32)],
    ["index", u16],
    ["message", bytes],
    ["extraData", bytes]
  ],
  "LzComposeParams"
);
var LzReceiveAccountBeet = new BeetArgsStruct(
  [
    ["pubkey", beetSolana85.publicKey],
    ["isSigner", bool],
    ["isWritable", bool]
  ],
  "LzReceiveAccount"
);
var ExecutorOptionType = /* @__PURE__ */ ((ExecutorOptionType2) => {
  ExecutorOptionType2[ExecutorOptionType2["PlaceHolder"] = 0] = "PlaceHolder";
  ExecutorOptionType2[ExecutorOptionType2["LzReceive"] = 1] = "LzReceive";
  ExecutorOptionType2[ExecutorOptionType2["NativeDrop"] = 2] = "NativeDrop";
  ExecutorOptionType2[ExecutorOptionType2["LzCompose"] = 3] = "LzCompose";
  ExecutorOptionType2[ExecutorOptionType2["OrderExecution"] = 4] = "OrderExecution";
  return ExecutorOptionType2;
})(ExecutorOptionType || {});
var MaxExecutorOptionTypeLength = 10;

// src/generated/uln/events/index.ts
var events_exports4 = {};
__export(events_exports4, {
  adminTransferredEventBeet: () => adminTransferredEventBeet2,
  configSetEventBeet: () => configSetEventBeet,
  defaultConfigSetEventBeet: () => defaultConfigSetEventBeet,
  feesPaidEventBeet: () => feesPaidEventBeet,
  payloadVerifiedEventBeet: () => payloadVerifiedEventBeet,
  rentWithdrawnEventBeet: () => rentWithdrawnEventBeet2,
  treasurySetEventBeet: () => treasurySetEventBeet
});
var adminTransferredEventBeet2 = new beet159.BeetArgsStruct(
  [["newAdmin", beetSolana85.publicKey]],
  "AdminTransferredEvent"
);
var ulnConfigBeet2 = new beet159.FixableBeetArgsStruct(
  [
    ["confirmations", beet159.u64],
    ["requiredDvnCount", beet159.u8],
    ["optionalDvnCount", beet159.u8],
    ["optionalDvnThreshold", beet159.u8],
    ["requiredDvns", beet159.array(beetSolana85.publicKey)],
    ["optionalDvns", beet159.array(beetSolana85.publicKey)]
  ],
  "UlnConfig"
);
var executorConfigBeet2 = new beet159.BeetArgsStruct(
  [
    ["maxMessageSize", beet159.u32],
    ["executor", beetSolana85.publicKey]
  ],
  "ExecutorConfig"
);

// src/generated/uln/types/Config.ts
var isConfigSendUln = (x) => x.__kind === "SendUln";
var isConfigReceiveUln = (x) => x.__kind === "ReceiveUln";
var isConfigExecutor = (x) => x.__kind === "Executor";
var configBeet = beet159.dataEnum([
  [
    "SendUln",
    new beet159.FixableBeetArgsStruct(
      [["fields", beet159.tuple([ulnConfigBeet2])]],
      'ConfigRecord["SendUln"]'
    )
  ],
  [
    "ReceiveUln",
    new beet159.FixableBeetArgsStruct(
      [["fields", beet159.tuple([ulnConfigBeet2])]],
      'ConfigRecord["ReceiveUln"]'
    )
  ],
  [
    "Executor",
    new beet159.BeetArgsStruct(
      [["fields", beet159.fixedSizeTuple([executorConfigBeet2])]],
      'ConfigRecord["Executor"]'
    )
  ]
]);

// src/generated/uln/events/ConfigSetEvent.ts
var configSetEventBeet = new beet159.FixableBeetArgsStruct(
  [
    ["oapp", beetSolana85.publicKey],
    ["eid", beet159.u32],
    ["config", configBeet]
  ],
  "ConfigSetEvent"
);
var defaultConfigSetEventBeet = new beet159.FixableBeetArgsStruct(
  [
    ["eid", beet159.u32],
    ["sendUlnConfig", beet159.coption(ulnConfigBeet2)],
    ["receiveUlnConfig", beet159.coption(ulnConfigBeet2)],
    ["executorConfig", beet159.coption(executorConfigBeet2)]
  ],
  "DefaultConfigSetEvent"
);
var workerFeeBeet = new beet159.BeetArgsStruct(
  [
    ["worker", beetSolana85.publicKey],
    ["fee", beet159.u64]
  ],
  "WorkerFee"
);
var treasuryFeeBeet = new beet159.BeetArgsStruct(
  [
    ["treasury", beetSolana85.publicKey],
    ["fee", beet159.u64],
    ["payInLzToken", beet159.bool]
  ],
  "TreasuryFee"
);

// src/generated/uln/events/FeesPaidEvent.ts
var feesPaidEventBeet = new beet159.FixableBeetArgsStruct(
  [
    ["executor", workerFeeBeet],
    ["dvns", beet159.array(workerFeeBeet)],
    ["treasury", beet159.coption(treasuryFeeBeet)]
  ],
  "FeesPaidEvent"
);
var payloadVerifiedEventBeet = new beet159.BeetArgsStruct(
  [
    ["dvn", beetSolana85.publicKey],
    ["header", beet159.uniformFixedSizeArray(beet159.u8, 81)],
    ["confirmations", beet159.u64],
    ["proofHash", beet159.uniformFixedSizeArray(beet159.u8, 32)]
  ],
  "PayloadVerifiedEvent"
);
var rentWithdrawnEventBeet2 = new beet159.BeetArgsStruct(
  [
    ["receiver", beetSolana85.publicKey],
    ["amount", beet159.u64]
  ],
  "RentWithdrawnEvent"
);
var lzTokenTreasuryBeet = new beet159.BeetArgsStruct(
  [
    ["receiver", beetSolana85.publicKey],
    ["fee", beet159.u64]
  ],
  "LzTokenTreasury"
);

// src/generated/uln/types/Treasury.ts
var treasuryBeet = new beet159.FixableBeetArgsStruct(
  [
    ["admin", beet159.coption(beetSolana85.publicKey)],
    ["nativeReceiver", beetSolana85.publicKey],
    ["nativeFeeBps", beet159.u64],
    ["lzToken", beet159.coption(lzTokenTreasuryBeet)]
  ],
  "Treasury"
);

// src/generated/uln/events/TreasurySetEvent.ts
var treasurySetEventBeet = new beet159.FixableBeetArgsStruct(
  [["treasury", beet159.coption(treasuryBeet)]],
  "TreasurySetEvent"
);

// src/utility.ts
function getEventDiscriminator(event) {
  const hash = crypto.createHash("sha256");
  hash.update(`event:${event}`);
  const sha2562 = hash.digest("hex");
  return sha2562.slice(0, 16);
}
async function extractSentPacketEventByTxHash(connection, program, signature, commitment, unsafeParseErr = false) {
  const events = await extractEventFromTransactionSignature(
    connection,
    program,
    signature,
    packetSentEventBeet,
    commitment,
    unsafeParseErr
  );
  if (!events)
    return null;
  return events;
}
async function extractVerifiedPacketEventByTxHash(connection, program, signature, commitment, unsafeParseErr = false) {
  const events = await extractEventFromTransactionSignature(
    connection,
    program,
    signature,
    packetVerifiedEventBeet,
    commitment,
    unsafeParseErr
  );
  if (!events)
    return null;
  return events;
}
async function extractReceivedPacketEventByTxHash(connection, program, signature, commitment, unsafeParseErr = false) {
  const events = await extractEventFromTransactionSignature(
    connection,
    program,
    signature,
    packetDeliveredEventBeet,
    commitment,
    unsafeParseErr
  );
  if (!events)
    return null;
  return events;
}
async function extractComposeSentEventByTxHash(connection, program, signature, commitment, unsafeParseErr = false) {
  const events = await extractEventFromTransactionSignature(
    connection,
    program,
    signature,
    composeSentEventBeet,
    commitment,
    unsafeParseErr
  );
  if (!events)
    return null;
  return events;
}
async function extractComposeDeliveredEventByTxHash(connection, program, signature, commitment, unsafeParseErr = false) {
  const events = await extractEventFromTransactionSignature(
    connection,
    program,
    signature,
    composeDeliveredEventBeet,
    commitment,
    unsafeParseErr
  );
  if (!events)
    return null;
  return events;
}
async function extractWorkerFeePaidEventByTxHash(connection, program, signature, commitment, unsafeParseErr = false) {
  const events = await extractEventFromTransactionSignature(
    connection,
    program,
    signature,
    feesPaidEventBeet,
    commitment,
    unsafeParseErr
  );
  if (!events)
    return null;
  return events;
}
async function extractEventFromTransactionSignature(connection, program, signature, eventBeet, commitment, unsafeParseErr = false) {
  const tx = typeof signature === "string" ? await connection.getParsedTransaction(signature, commitment) : signature;
  if (tx == null)
    return null;
  const events = new Array();
  if (tx.meta?.err !== null && !unsafeParseErr) {
    return null;
  }
  for (const instruction of tx.meta?.innerInstructions ?? []) {
    for (const innerInstruction of instruction.instructions) {
      const inst = innerInstruction;
      if (!inst.programId.equals(program)) {
        continue;
      }
      const decoded = base58.decode(inst.data);
      const discriminator = Buffer.from(decoded.subarray(0, 8)).toString("hex");
      if (discriminator !== EventEmitDiscriminator) {
        continue;
      }
      const eventDiscriminator = Buffer.from(decoded.subarray(8, 16)).toString("hex");
      if (eventDiscriminator !== getEventDiscriminator(eventBeet.description)) {
        continue;
      }
      const dataBuffer = Buffer.from(decoded.subarray(16, decoded.length));
      if (eventBeet instanceof beet159.FixableBeetArgsStruct) {
        const beet260 = eventBeet.toFixedFromData(dataBuffer, 0);
        events.push(beet260.read(dataBuffer, 0));
      } else {
        events.push(eventBeet.read(dataBuffer, 0));
      }
    }
  }
  return events.length > 0 ? events : null;
}
async function generateAddressLookupTable(connection, payer, authority, addresses) {
  const slot = await connection.getSlot("finalized");
  const [createInstruction, lookupTableAddress] = AddressLookupTableProgram.createLookupTable({
    payer,
    authority,
    recentSlot: slot
  });
  const extendInstruction = AddressLookupTableProgram.extendLookupTable({
    payer,
    authority,
    lookupTable: lookupTableAddress,
    addresses
  });
  return {
    instructions: [createInstruction, extendInstruction],
    address: lookupTableAddress
  };
}
function deactivateLookupTable(authority, lookupTable) {
  return AddressLookupTableProgram.deactivateLookupTable({
    authority,
    lookupTable
  });
}
function closeLookupTable(recipient, authority, lookupTable) {
  return AddressLookupTableProgram.closeLookupTable({
    authority,
    recipient,
    lookupTable
  });
}
async function txWithAddressLookupTable(connection, payer, instructions, recentBlockHash, tableAddr) {
  recentBlockHash = recentBlockHash ?? (await connection.getLatestBlockhash()).blockhash;
  if (!tableAddr) {
    return new VersionedTransaction(
      new TransactionMessage({
        instructions,
        payerKey: payer,
        recentBlockhash: recentBlockHash
      }).compileToV0Message()
    );
  }
  const { value: lookupTableAccount } = await connection.getAddressLookupTable(tableAddr);
  return new VersionedTransaction(
    new TransactionMessage({
      instructions,
      payerKey: payer,
      recentBlockhash: recentBlockHash
    }).compileToV0Message(lookupTableAccount ? [lookupTableAccount] : void 0)
  );
}
async function createNonceAccountTX(connection, auth, lamportsForRent) {
  const nonceAccount = Keypair.generate();
  const lamports = lamportsForRent ?? await connection.getMinimumBalanceForRentExemption(NONCE_ACCOUNT_LENGTH);
  const tx = new Transaction();
  tx.add(
    // create nonce account
    SystemProgram.createAccount({
      fromPubkey: auth,
      newAccountPubkey: nonceAccount.publicKey,
      lamports,
      space: NONCE_ACCOUNT_LENGTH,
      programId: SystemProgram.programId
    }),
    // init nonce account
    SystemProgram.nonceInitialize({
      noncePubkey: nonceAccount.publicKey,
      // nonce account pubkey
      authorizedPubkey: auth
      // nonce account auth
    })
  );
  return { tx, nonceAccount };
}
async function txWithNonce(connection, noncePubkey, instructions, nonceInfo) {
  const tx = new Transaction();
  if (!nonceInfo) {
    const accountInfo = await connection.getAccountInfo(noncePubkey);
    if (accountInfo) {
      nonceInfo = NonceAccount.fromAccountData(accountInfo.data);
    } else {
      return null;
    }
  }
  tx.add(
    // nonce advance must be the first insturction
    SystemProgram.nonceAdvance({
      noncePubkey,
      authorizedPubkey: nonceInfo.authorizedPubkey
    })
  );
  tx.add(...instructions);
  tx.recentBlockhash = nonceInfo.nonce;
  return tx;
}
async function isAccountInitialized(connection, account, commitmentOrConfig) {
  return connection.getAccountInfo(account, commitmentOrConfig).then((res) => {
    return res !== null;
  });
}
async function buildMessageV0(connection, payerKey, instructions, commitmentOrConfig = "confirmed", blockhash) {
  return new TransactionMessage({
    payerKey,
    recentBlockhash: blockhash ?? (await connection.getLatestBlockhash(commitmentOrConfig)).blockhash,
    instructions
  }).compileToV0Message();
}
async function buildVersionedTransaction(connection, payerKey, instructions, commitmentOrConfig = "confirmed", blockhash, lookupTableAddress) {
  if (lookupTableAddress) {
    return txWithAddressLookupTable(connection, payerKey, instructions, blockhash, lookupTableAddress);
  }
  return new VersionedTransaction(
    await buildMessageV0(connection, payerKey, instructions, commitmentOrConfig, blockhash)
  );
}
function instructionDiscriminator(method) {
  return Buffer.from(sha256(Buffer.from(`global:${method}`)).substring(2), "hex").subarray(0, 8);
}
async function simulateTransaction(connection, instructions, programId, payer, commitment = "confirmed", blockhash, lookupTableAddress) {
  const tx = await buildVersionedTransaction(
    connection,
    payer,
    instructions,
    commitment,
    blockhash,
    lookupTableAddress
  );
  const simulateResp = await connection.simulateTransaction(tx, { sigVerify: false, commitment });
  const returnPrefix = `Program return: ${programId.toBase58()} `;
  const returnLog = simulateResp.value.logs?.find((l) => l.startsWith(returnPrefix));
  if (returnLog === void 0 || simulateResp.value.returnData?.programId !== programId.toBase58()) {
    throw new Error(`Simulate Fail: ${JSON.stringify(simulateResp)}`);
  } else {
    return Buffer.from(returnLog.slice(returnPrefix.length), "base64");
  }
}

// src/recevie.ts
async function lzReceive(connection, payer, packet, callerParams = Uint8Array.from([0, 0]), commitmentOrConfig = "confirmed") {
  const { message: message_, sender, srcEid, guid, receiver: receiver_ } = packet;
  const receiver = new PublicKey(addressToBytes32(receiver_));
  const message = arrayify(message_);
  const params = {
    srcEid,
    sender: Array.from(arrayify(sender)),
    guid: Array.from(arrayify(guid)),
    message,
    callerParams,
    nonce: parseInt(packet.nonce)
  };
  const receiverInfo = await connection.getParsedAccountInfo(receiver, commitmentOrConfig);
  const receiverProgram = new PublicKey(receiverInfo.value.owner);
  const accounts = await getLzReceiveAccounts(
    connection,
    payer,
    receiver,
    receiverProgram,
    params,
    commitmentOrConfig
  );
  const [data] = LzReceiveParamsBeet.serialize(params);
  return new TransactionInstruction({
    programId: receiverProgram,
    keys: accounts,
    data: Buffer.concat([instructionDiscriminator("lz_receive"), data])
  });
}
async function lzCompose(connection, payer, event, extraData = Uint8Array.from([0, 0]), commitmentOrConfig) {
  const { to, from, guid, index, message } = event;
  const params = {
    from,
    to,
    guid,
    index,
    message,
    extraData
  };
  const accountInfo = await connection.getAccountInfo(to, commitmentOrConfig);
  if (!accountInfo) {
    throw new Error(`Account not found: ${to.toBase58()}`);
  }
  const programId = accountInfo.owner;
  const accounts = await getLzComposeAccountMeta(connection, payer, to, programId, params, commitmentOrConfig);
  const [data] = LzComposeParamsBeet.serialize(params);
  return new TransactionInstruction({
    programId,
    keys: accounts,
    data: Buffer.concat([instructionDiscriminator("lz_compose"), data])
  });
}
async function getLzReceiveAccounts(connection, payer, receiver, receiverProgram, params, commitmentOrConfig = "confirmed") {
  const lzReceiveTypesAccounts = await (async () => {
    const [lzReceiveTypesAccountsPDA] = deriveLzReceiveTypesAccountsPDA(receiverProgram, receiver);
    const info = await connection.getAccountInfo(lzReceiveTypesAccountsPDA, commitmentOrConfig);
    const accounts = [];
    if (info) {
      const buffer = Buffer.from(info.data);
      const len = buffer.length - 8;
      if (len % 32 !== 0) {
        throw new Error(
          `Invalid length of AccountInfo.data. The length must be a multiple of 32 plus 8.(n*32+8). Current length is ${buffer.length}`
        );
      }
      for (let i = 8; i < len; i += 32) {
        const address = AddressType.read(buffer, i);
        accounts.push({
          pubkey: new PublicKey(address),
          isSigner: false,
          isWritable: false
        });
      }
    }
    return accounts;
  })();
  const [data] = LzReceiveParamsBeet.serialize(params);
  const lzReceiveTypesIx = new TransactionInstruction({
    programId: receiverProgram,
    keys: lzReceiveTypesAccounts,
    data: Buffer.concat([instructionDiscriminator("lz_receive_types"), data])
  });
  const response = await simulateTransaction(connection, [lzReceiveTypesIx], receiverProgram, payer);
  const keys = retrieveAccountFromSimulatedResp(response, payer);
  return keys;
}
async function getLzComposeAccountMeta(connection, payer, to, composerProgram, params, commitmentOrConfig = "confirmed") {
  const lzComposeTypesAccounts = await (async () => {
    const [lzComposeTypesAccountsPDA] = deriveLzComposeTypesAccountsPDA(composerProgram, to);
    const info = await connection.getAccountInfo(lzComposeTypesAccountsPDA, commitmentOrConfig);
    const accounts = [];
    if (info) {
      const buffer = Buffer.from(info.data);
      const len = buffer.length - 8;
      if (len % 32 !== 0) {
        throw new Error(
          `Invalid length of AccountInfo.data. The length must be a multiple of 32 plus 8.(n*32+8). Current length is ${buffer.length}`
        );
      }
      for (let i = 8; i < len; i += 32) {
        const address = AddressType.read(buffer, i);
        accounts.push({
          pubkey: new PublicKey(address),
          isSigner: false,
          isWritable: false
        });
      }
    }
    return accounts;
  })();
  const [data] = LzComposeParamsBeet.serialize(params);
  const lzComposeTypesIx = new TransactionInstruction({
    programId: composerProgram,
    keys: lzComposeTypesAccounts,
    data: Buffer.concat([instructionDiscriminator("lz_compose_types"), data])
  });
  const response = await simulateTransaction(connection, [lzComposeTypesIx], composerProgram, payer);
  const keys = retrieveAccountFromSimulatedResp(response, payer);
  return keys;
}
function retrieveAccountFromSimulatedResp(resp, payer) {
  const result = array(LzReceiveAccountBeet);
  const fixedBeet = result.toFixedFromData(resp, 0);
  const results = fixedBeet.read(resp, 0);
  return results.map((r) => {
    if (r.pubkey.toBase58() == PublicKey.default.toBase58() && r.isSigner) {
      if (!payer)
        throw new Error("payer is required");
      return {
        pubkey: payer,
        isSigner: true,
        isWritable: r.isWritable
      };
    } else {
      return {
        pubkey: r.pubkey,
        isSigner: r.isSigner,
        isWritable: r.isWritable
      };
    }
  });
}

// src/generated/executor/errors/index.ts
var createErrorFromCodeLookup4 = /* @__PURE__ */ new Map();
var createErrorFromNameLookup4 = /* @__PURE__ */ new Map();
var InvalidSizeError = class _InvalidSizeError extends Error {
  constructor() {
    super("");
    this.code = 6e3;
    this.name = "InvalidSize";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidSizeError);
    }
  }
};
createErrorFromCodeLookup4.set(6e3, () => new InvalidSizeError());
createErrorFromNameLookup4.set("InvalidSize", () => new InvalidSizeError());
var PausedError2 = class _PausedError extends Error {
  constructor() {
    super("");
    this.code = 6001;
    this.name = "Paused";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _PausedError);
    }
  }
};
createErrorFromCodeLookup4.set(6001, () => new PausedError2());
createErrorFromNameLookup4.set("Paused", () => new PausedError2());
var UnsupportedOptionTypeError = class _UnsupportedOptionTypeError extends Error {
  constructor() {
    super("");
    this.code = 6002;
    this.name = "UnsupportedOptionType";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _UnsupportedOptionTypeError);
    }
  }
};
createErrorFromCodeLookup4.set(6002, () => new UnsupportedOptionTypeError());
createErrorFromNameLookup4.set(
  "UnsupportedOptionType",
  () => new UnsupportedOptionTypeError()
);
var ZeroLzComposeGasProvidedError = class _ZeroLzComposeGasProvidedError extends Error {
  constructor() {
    super("");
    this.code = 6003;
    this.name = "ZeroLzComposeGasProvided";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _ZeroLzComposeGasProvidedError);
    }
  }
};
createErrorFromCodeLookup4.set(6003, () => new ZeroLzComposeGasProvidedError());
createErrorFromNameLookup4.set(
  "ZeroLzComposeGasProvided",
  () => new ZeroLzComposeGasProvidedError()
);
var ZeroLzReceiveGasProvidedError = class _ZeroLzReceiveGasProvidedError extends Error {
  constructor() {
    super("");
    this.code = 6004;
    this.name = "ZeroLzReceiveGasProvided";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _ZeroLzReceiveGasProvidedError);
    }
  }
};
createErrorFromCodeLookup4.set(6004, () => new ZeroLzReceiveGasProvidedError());
createErrorFromNameLookup4.set(
  "ZeroLzReceiveGasProvided",
  () => new ZeroLzReceiveGasProvidedError()
);
var NativeAmountExceedsCapError = class _NativeAmountExceedsCapError extends Error {
  constructor() {
    super("");
    this.code = 6005;
    this.name = "NativeAmountExceedsCap";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _NativeAmountExceedsCapError);
    }
  }
};
createErrorFromCodeLookup4.set(6005, () => new NativeAmountExceedsCapError());
createErrorFromNameLookup4.set(
  "NativeAmountExceedsCap",
  () => new NativeAmountExceedsCapError()
);
var NotAdminError2 = class _NotAdminError extends Error {
  constructor() {
    super("");
    this.code = 6006;
    this.name = "NotAdmin";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _NotAdminError);
    }
  }
};
createErrorFromCodeLookup4.set(6006, () => new NotAdminError2());
createErrorFromNameLookup4.set("NotAdmin", () => new NotAdminError2());
var NotExecutorError = class _NotExecutorError extends Error {
  constructor() {
    super("");
    this.code = 6007;
    this.name = "NotExecutor";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _NotExecutorError);
    }
  }
};
createErrorFromCodeLookup4.set(6007, () => new NotExecutorError());
createErrorFromNameLookup4.set("NotExecutor", () => new NotExecutorError());
var MsgLibNotAllowedError2 = class _MsgLibNotAllowedError extends Error {
  constructor() {
    super("");
    this.code = 6008;
    this.name = "MsgLibNotAllowed";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _MsgLibNotAllowedError);
    }
  }
};
createErrorFromCodeLookup4.set(6008, () => new MsgLibNotAllowedError2());
createErrorFromNameLookup4.set(
  "MsgLibNotAllowed",
  () => new MsgLibNotAllowedError2()
);
var TooManyAdminsError2 = class _TooManyAdminsError extends Error {
  constructor() {
    super("");
    this.code = 6009;
    this.name = "TooManyAdmins";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _TooManyAdminsError);
    }
  }
};
createErrorFromCodeLookup4.set(6009, () => new TooManyAdminsError2());
createErrorFromNameLookup4.set("TooManyAdmins", () => new TooManyAdminsError2());
var TooManyExecutorsError = class _TooManyExecutorsError extends Error {
  constructor() {
    super("");
    this.code = 6010;
    this.name = "TooManyExecutors";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _TooManyExecutorsError);
    }
  }
};
createErrorFromCodeLookup4.set(6010, () => new TooManyExecutorsError());
createErrorFromNameLookup4.set(
  "TooManyExecutors",
  () => new TooManyExecutorsError()
);
var TooManyOptionTypesError2 = class _TooManyOptionTypesError extends Error {
  constructor() {
    super("");
    this.code = 6011;
    this.name = "TooManyOptionTypes";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _TooManyOptionTypesError);
    }
  }
};
createErrorFromCodeLookup4.set(6011, () => new TooManyOptionTypesError2());
createErrorFromNameLookup4.set(
  "TooManyOptionTypes",
  () => new TooManyOptionTypesError2()
);
var InvalidNativeDropRequestsLengthError = class _InvalidNativeDropRequestsLengthError extends Error {
  constructor() {
    super("");
    this.code = 6012;
    this.name = "InvalidNativeDropRequestsLength";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidNativeDropRequestsLengthError);
    }
  }
};
createErrorFromCodeLookup4.set(
  6012,
  () => new InvalidNativeDropRequestsLengthError()
);
createErrorFromNameLookup4.set(
  "InvalidNativeDropRequestsLength",
  () => new InvalidNativeDropRequestsLengthError()
);
var InvalidNativeDropReceiverError = class _InvalidNativeDropReceiverError extends Error {
  constructor() {
    super("");
    this.code = 6013;
    this.name = "InvalidNativeDropReceiver";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidNativeDropReceiverError);
    }
  }
};
createErrorFromCodeLookup4.set(
  6013,
  () => new InvalidNativeDropReceiverError()
);
createErrorFromNameLookup4.set(
  "InvalidNativeDropReceiver",
  () => new InvalidNativeDropReceiverError()
);
var InsufficientBalanceError = class _InsufficientBalanceError extends Error {
  constructor() {
    super("");
    this.code = 6014;
    this.name = "InsufficientBalance";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InsufficientBalanceError);
    }
  }
};
createErrorFromCodeLookup4.set(6014, () => new InsufficientBalanceError());
createErrorFromNameLookup4.set(
  "InsufficientBalance",
  () => new InsufficientBalanceError()
);
var EidNotSupportedError2 = class _EidNotSupportedError extends Error {
  constructor() {
    super("");
    this.code = 6015;
    this.name = "EidNotSupported";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _EidNotSupportedError);
    }
  }
};
createErrorFromCodeLookup4.set(6015, () => new EidNotSupportedError2());
createErrorFromNameLookup4.set(
  "EidNotSupported",
  () => new EidNotSupportedError2()
);
var ExecutorIsAdminError = class _ExecutorIsAdminError extends Error {
  constructor() {
    super("");
    this.code = 6016;
    this.name = "ExecutorIsAdmin";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _ExecutorIsAdminError);
    }
  }
};
createErrorFromCodeLookup4.set(6016, () => new ExecutorIsAdminError());
createErrorFromNameLookup4.set(
  "ExecutorIsAdmin",
  () => new ExecutorIsAdminError()
);
var InvalidOwnerError = class _InvalidOwnerError extends Error {
  constructor() {
    super("");
    this.code = 6017;
    this.name = "InvalidOwner";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidOwnerError);
    }
  }
};
createErrorFromCodeLookup4.set(6017, () => new InvalidOwnerError());
createErrorFromNameLookup4.set("InvalidOwner", () => new InvalidOwnerError());
function errorFromCode4(code) {
  const createError = createErrorFromCodeLookup4.get(code);
  return createError != null ? createError() : null;
}
function errorFromName4(name) {
  const createError = createErrorFromNameLookup4.get(name);
  return createError != null ? createError() : null;
}

// src/generated/executor/index.ts
var PROGRAM_ADDRESS4 = "6doghB248px58JSSwG4qejQ46kFMW4AMj7vzJnWZHNZn";
var PROGRAM_ID4 = new PublicKey(PROGRAM_ADDRESS4);

// src/executor.ts
var Executor = class {
  constructor(program) {
    this.program = program;
    this.deriver = new ExecutorPDADeriver(this.program);
  }
  // owner methods
  initExecutor(payer, owner, admins, executors, msglibs, priceFeed) {
    const [configAccount] = this.deriver.config();
    return createInitExecutorInstruction(
      {
        payer,
        config: configAccount
      },
      {
        params: {
          owner,
          admins,
          executors,
          msglibs,
          priceFeed
        }
      },
      this.program
    );
  }
  setOwner(owner, newOwner) {
    const [configAccount] = this.deriver.config();
    return createOwnerSetConfigInstruction(
      {
        owner,
        config: configAccount
      },
      {
        params: {
          fields: [newOwner],
          __kind: "Owner"
        }
      },
      this.program
    );
  }
  setAdmins(owner, admins) {
    const [configAccount] = this.deriver.config();
    return createOwnerSetConfigInstruction(
      {
        owner,
        config: configAccount
      },
      {
        params: {
          fields: [admins],
          __kind: "Admins"
        }
      },
      this.program
    );
  }
  setAllowList(owner, allowlist) {
    const [configAccount] = this.deriver.config();
    return createOwnerSetConfigInstruction(
      {
        owner,
        config: configAccount
      },
      {
        params: {
          fields: [allowlist],
          __kind: "Allowlist"
        }
      },
      this.program
    );
  }
  setDenyList(owner, denylist) {
    const [configAccount] = this.deriver.config();
    return createOwnerSetConfigInstruction(
      {
        owner,
        config: configAccount
      },
      {
        params: {
          fields: [denylist],
          __kind: "Denylist"
        }
      },
      this.program
    );
  }
  setPaused(owner, paused) {
    const [configAccount] = this.deriver.config();
    return createOwnerSetConfigInstruction(
      {
        owner,
        config: configAccount
      },
      {
        params: {
          fields: [paused],
          __kind: "Paused"
        }
      },
      this.program
    );
  }
  setExecutors(owner, executors) {
    const [configAccount] = this.deriver.config();
    return createOwnerSetConfigInstruction(
      {
        owner,
        config: configAccount
      },
      {
        params: {
          fields: [executors],
          __kind: "Executors"
        }
      },
      this.program
    );
  }
  setMsglibByPrograms(owner, msglibPrograms) {
    this.deriver.config();
    const msglibPdas = msglibPrograms.map((program) => {
      return new MessageLibPDADeriver(program).messageLib()[0];
    });
    return this.setMsglibByPDAs(owner, msglibPdas);
  }
  setMsglibByPDAs(owner, msglibPDAs) {
    const [configAccount] = this.deriver.config();
    return createOwnerSetConfigInstruction(
      {
        owner,
        config: configAccount
      },
      {
        params: {
          fields: [msglibPDAs],
          __kind: "Msglibs"
        }
      },
      this.program
    );
  }
  // admin methods
  setDefaultMultiplierBps(admin, defaultMultiplierBps) {
    const [configAccount] = this.deriver.config();
    return createAdminSetConfigInstruction(
      {
        admin,
        config: configAccount
      },
      {
        params: {
          fields: [defaultMultiplierBps],
          __kind: "DefaultMultiplierBps"
        }
      },
      this.program
    );
  }
  setDstConfig(admin, dstConfigs) {
    const [configAccount] = this.deriver.config();
    return createAdminSetConfigInstruction(
      {
        admin,
        config: configAccount
      },
      {
        params: {
          fields: [dstConfigs],
          __kind: "DstConfigs"
        }
      },
      this.program
    );
  }
  setPriceFeed(admin, priceFeedProgram) {
    const [configAccount] = this.deriver.config();
    const [priceFeed] = new PriceFeedPDADeriver(priceFeedProgram).priceFeed();
    return createAdminSetConfigInstruction(
      {
        admin,
        config: configAccount
      },
      {
        params: {
          fields: [priceFeed],
          __kind: "PriceFeed"
        }
      },
      this.program
    );
  }
  async getExecutorConfig(connection, commitmentOrConfig) {
    const [configAccount] = this.deriver.config();
    try {
      const config = await ExecutorConfig.fromAccountAddress(
        connection,
        configAccount,
        commitmentOrConfig
      );
      return config;
    } catch (error) {
      return null;
    }
  }
  getQuoteIXAccountMetaForCPI(priceFeedConfig, priceFeedProgram, payment) {
    const [config] = this.deriver.config();
    const ixAccounts = createQuoteExecutorInstructionAccounts(
      {
        executorConfig: config,
        priceFeedConfig,
        priceFeedProgram
      },
      this.program
    );
    if (payment) {
      ixAccounts[0].isWritable = true;
    }
    return [
      {
        pubkey: this.program,
        isWritable: false,
        isSigner: false
      }
    ].concat(ixAccounts);
  }
  async execute(connection, executor, endpointProgram, packet, extraData, value = new BN(0), computeUnits = 2e5, commitmentOrConfig) {
    const [config] = this.deriver.config();
    const endpointEventDeriver = new EventPDADeriver(endpointProgram);
    const executorEventDeriver = new EventPDADeriver(this.program);
    const { message: message_, sender, srcEid, guid, receiver: receiver_, nonce } = packet;
    const receiver = new PublicKey(addressToBytes32(receiver_));
    const receiverInfo = await connection.getParsedAccountInfo(receiver, commitmentOrConfig);
    const receiverProgram = new PublicKey(receiverInfo.value.owner);
    const message = arrayify(message_);
    const accounts = await getLzReceiveAccounts(
      connection,
      executor,
      receiver,
      receiverProgram,
      {
        srcEid,
        sender: Array.from(arrayify(sender)),
        guid: Array.from(arrayify(guid)),
        message,
        callerParams: extraData,
        nonce: parseInt(packet.nonce)
      },
      commitmentOrConfig
    );
    return createExecuteInstruction(
      {
        executor,
        config,
        endpointProgram,
        endpointEventAuthority: endpointEventDeriver.eventAuthority()[0],
        program: this.program,
        eventAuthority: executorEventDeriver.eventAuthority()[0],
        anchorRemainingAccounts: [
          {
            pubkey: receiverProgram,
            isWritable: false,
            isSigner: false
          },
          ...accounts
        ]
      },
      {
        params: {
          receiver,
          lzReceive: {
            srcEid,
            sender: Array.from(arrayify(sender)),
            nonce: parseInt(nonce),
            guid: Array.from(arrayify(guid)),
            message,
            extraData
          },
          value,
          computeUnits
        }
      },
      this.program
    );
  }
  async compose(connection, executor, endpointProgram, event, extraData, value = new BN(0), computeUnits = 4e5, commitmentOrConfig) {
    const [config] = this.deriver.config();
    const endpointEventDeriver = new EventPDADeriver(endpointProgram);
    const executorEventDeriver = new EventPDADeriver(this.program);
    const { to, from, guid, index, message } = event;
    const receiverInfo = await connection.getParsedAccountInfo(to, commitmentOrConfig);
    const receiverProgram = new PublicKey(receiverInfo.value.owner);
    const accounts = await getLzComposeAccountMeta(
      connection,
      executor,
      to,
      receiverProgram,
      {
        from,
        to,
        guid,
        index,
        message,
        extraData
      },
      commitmentOrConfig
    );
    return createComposeInstruction(
      {
        executor,
        config,
        endpointProgram,
        endpointEventAuthority: endpointEventDeriver.eventAuthority()[0],
        program: this.program,
        eventAuthority: executorEventDeriver.eventAuthority()[0],
        anchorRemainingAccounts: [
          {
            pubkey: receiverProgram,
            isWritable: false,
            isSigner: false
          },
          ...accounts
        ]
      },
      {
        params: {
          lzCompose: {
            to,
            from,
            guid,
            index,
            message,
            extraData
          },
          computeUnits,
          value
        }
      },
      this.program
    );
  }
};

// src/generated/uln/accounts/index.ts
var accounts_exports5 = {};
__export(accounts_exports5, {
  Confirmations: () => Confirmations,
  ReceiveConfig: () => ReceiveConfig2,
  SendConfig: () => SendConfig,
  UlnSettings: () => UlnSettings,
  accountProviders: () => accountProviders5,
  confirmationsBeet: () => confirmationsBeet,
  confirmationsDiscriminator: () => confirmationsDiscriminator,
  receiveConfigBeet: () => receiveConfigBeet2,
  receiveConfigDiscriminator: () => receiveConfigDiscriminator2,
  sendConfigBeet: () => sendConfigBeet,
  sendConfigDiscriminator: () => sendConfigDiscriminator,
  ulnSettingsBeet: () => ulnSettingsBeet,
  ulnSettingsDiscriminator: () => ulnSettingsDiscriminator
});
var confirmationsDiscriminator = [206, 57, 50, 8, 124, 133, 138, 112];
var Confirmations = class _Confirmations {
  constructor(value, bump) {
    this.value = value;
    this.bump = bump;
  }
  /**
   * Creates a {@link Confirmations} instance from the provided args.
   */
  static fromArgs(args) {
    return new _Confirmations(args.value, args.bump);
  }
  /**
   * Deserializes the {@link Confirmations} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(accountInfo, offset = 0) {
    return _Confirmations.deserialize(accountInfo.data, offset);
  }
  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link Confirmations} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(connection, address, commitmentOrConfig) {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    );
    if (accountInfo == null) {
      throw new Error(`Unable to find Confirmations account at ${address}`);
    }
    return _Confirmations.fromAccountInfo(accountInfo, 0)[0];
  }
  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(programId = new web314.PublicKey(
    "7a4WjyR8VZ7yZz5XJAKm39BUGn5iT9CKcv2pmG9tdXVH"
  )) {
    return beetSolana85.GpaBuilder.fromStruct(programId, confirmationsBeet);
  }
  /**
   * Deserializes the {@link Confirmations} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf, offset = 0) {
    return confirmationsBeet.deserialize(buf, offset);
  }
  /**
   * Serializes the {@link Confirmations} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize() {
    return confirmationsBeet.serialize({
      accountDiscriminator: confirmationsDiscriminator,
      ...this
    });
  }
  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link Confirmations} for the provided args.
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   */
  static byteSize(args) {
    const instance = _Confirmations.fromArgs(args);
    return confirmationsBeet.toFixedFromValue({
      accountDiscriminator: confirmationsDiscriminator,
      ...instance
    }).byteSize;
  }
  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link Confirmations} data from rent
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(args, connection, commitment) {
    return connection.getMinimumBalanceForRentExemption(
      _Confirmations.byteSize(args),
      commitment
    );
  }
  /**
   * Returns a readable version of {@link Confirmations} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      value: this.value,
      bump: this.bump
    };
  }
};
var confirmationsBeet = new beet159.FixableBeetStruct(
  [
    ["accountDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["value", beet159.coption(beet159.u64)],
    ["bump", beet159.u8]
  ],
  Confirmations.fromArgs,
  "Confirmations"
);
var receiveConfigDiscriminator2 = [162, 159, 153, 188, 56, 65, 245, 58];
var ReceiveConfig2 = class _ReceiveConfig {
  constructor(bump, uln) {
    this.bump = bump;
    this.uln = uln;
  }
  /**
   * Creates a {@link ReceiveConfig} instance from the provided args.
   */
  static fromArgs(args) {
    return new _ReceiveConfig(args.bump, args.uln);
  }
  /**
   * Deserializes the {@link ReceiveConfig} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(accountInfo, offset = 0) {
    return _ReceiveConfig.deserialize(accountInfo.data, offset);
  }
  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link ReceiveConfig} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(connection, address, commitmentOrConfig) {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    );
    if (accountInfo == null) {
      throw new Error(`Unable to find ReceiveConfig account at ${address}`);
    }
    return _ReceiveConfig.fromAccountInfo(accountInfo, 0)[0];
  }
  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(programId = new web314.PublicKey(
    "7a4WjyR8VZ7yZz5XJAKm39BUGn5iT9CKcv2pmG9tdXVH"
  )) {
    return beetSolana85.GpaBuilder.fromStruct(programId, receiveConfigBeet2);
  }
  /**
   * Deserializes the {@link ReceiveConfig} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf, offset = 0) {
    return receiveConfigBeet2.deserialize(buf, offset);
  }
  /**
   * Serializes the {@link ReceiveConfig} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize() {
    return receiveConfigBeet2.serialize({
      accountDiscriminator: receiveConfigDiscriminator2,
      ...this
    });
  }
  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link ReceiveConfig} for the provided args.
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   */
  static byteSize(args) {
    const instance = _ReceiveConfig.fromArgs(args);
    return receiveConfigBeet2.toFixedFromValue({
      accountDiscriminator: receiveConfigDiscriminator2,
      ...instance
    }).byteSize;
  }
  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link ReceiveConfig} data from rent
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(args, connection, commitment) {
    return connection.getMinimumBalanceForRentExemption(
      _ReceiveConfig.byteSize(args),
      commitment
    );
  }
  /**
   * Returns a readable version of {@link ReceiveConfig} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      bump: this.bump,
      uln: this.uln
    };
  }
};
var receiveConfigBeet2 = new beet159.FixableBeetStruct(
  [
    ["accountDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["bump", beet159.u8],
    ["uln", ulnConfigBeet2]
  ],
  ReceiveConfig2.fromArgs,
  "ReceiveConfig"
);
var sendConfigDiscriminator = [91, 221, 135, 137, 131, 199, 174, 25];
var SendConfig = class _SendConfig {
  constructor(bump, uln, executor) {
    this.bump = bump;
    this.uln = uln;
    this.executor = executor;
  }
  /**
   * Creates a {@link SendConfig} instance from the provided args.
   */
  static fromArgs(args) {
    return new _SendConfig(args.bump, args.uln, args.executor);
  }
  /**
   * Deserializes the {@link SendConfig} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(accountInfo, offset = 0) {
    return _SendConfig.deserialize(accountInfo.data, offset);
  }
  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link SendConfig} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(connection, address, commitmentOrConfig) {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    );
    if (accountInfo == null) {
      throw new Error(`Unable to find SendConfig account at ${address}`);
    }
    return _SendConfig.fromAccountInfo(accountInfo, 0)[0];
  }
  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(programId = new web314.PublicKey(
    "7a4WjyR8VZ7yZz5XJAKm39BUGn5iT9CKcv2pmG9tdXVH"
  )) {
    return beetSolana85.GpaBuilder.fromStruct(programId, sendConfigBeet);
  }
  /**
   * Deserializes the {@link SendConfig} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf, offset = 0) {
    return sendConfigBeet.deserialize(buf, offset);
  }
  /**
   * Serializes the {@link SendConfig} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize() {
    return sendConfigBeet.serialize({
      accountDiscriminator: sendConfigDiscriminator,
      ...this
    });
  }
  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link SendConfig} for the provided args.
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   */
  static byteSize(args) {
    const instance = _SendConfig.fromArgs(args);
    return sendConfigBeet.toFixedFromValue({
      accountDiscriminator: sendConfigDiscriminator,
      ...instance
    }).byteSize;
  }
  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link SendConfig} data from rent
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(args, connection, commitment) {
    return connection.getMinimumBalanceForRentExemption(
      _SendConfig.byteSize(args),
      commitment
    );
  }
  /**
   * Returns a readable version of {@link SendConfig} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      bump: this.bump,
      uln: this.uln,
      executor: this.executor
    };
  }
};
var sendConfigBeet = new beet159.FixableBeetStruct(
  [
    ["accountDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["bump", beet159.u8],
    ["uln", ulnConfigBeet2],
    ["executor", executorConfigBeet2]
  ],
  SendConfig.fromArgs,
  "SendConfig"
);
var ulnSettingsDiscriminator = [226, 199, 100, 253, 38, 115, 167, 154];
var UlnSettings = class _UlnSettings {
  constructor(eid, endpoint, endpointProgram, bump, admin, treasury) {
    this.eid = eid;
    this.endpoint = endpoint;
    this.endpointProgram = endpointProgram;
    this.bump = bump;
    this.admin = admin;
    this.treasury = treasury;
  }
  /**
   * Creates a {@link UlnSettings} instance from the provided args.
   */
  static fromArgs(args) {
    return new _UlnSettings(
      args.eid,
      args.endpoint,
      args.endpointProgram,
      args.bump,
      args.admin,
      args.treasury
    );
  }
  /**
   * Deserializes the {@link UlnSettings} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(accountInfo, offset = 0) {
    return _UlnSettings.deserialize(accountInfo.data, offset);
  }
  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link UlnSettings} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(connection, address, commitmentOrConfig) {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    );
    if (accountInfo == null) {
      throw new Error(`Unable to find UlnSettings account at ${address}`);
    }
    return _UlnSettings.fromAccountInfo(accountInfo, 0)[0];
  }
  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(programId = new web314.PublicKey(
    "7a4WjyR8VZ7yZz5XJAKm39BUGn5iT9CKcv2pmG9tdXVH"
  )) {
    return beetSolana85.GpaBuilder.fromStruct(programId, ulnSettingsBeet);
  }
  /**
   * Deserializes the {@link UlnSettings} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf, offset = 0) {
    return ulnSettingsBeet.deserialize(buf, offset);
  }
  /**
   * Serializes the {@link UlnSettings} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize() {
    return ulnSettingsBeet.serialize({
      accountDiscriminator: ulnSettingsDiscriminator,
      ...this
    });
  }
  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link UlnSettings} for the provided args.
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   */
  static byteSize(args) {
    const instance = _UlnSettings.fromArgs(args);
    return ulnSettingsBeet.toFixedFromValue({
      accountDiscriminator: ulnSettingsDiscriminator,
      ...instance
    }).byteSize;
  }
  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link UlnSettings} data from rent
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(args, connection, commitment) {
    return connection.getMinimumBalanceForRentExemption(
      _UlnSettings.byteSize(args),
      commitment
    );
  }
  /**
   * Returns a readable version of {@link UlnSettings} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      eid: this.eid,
      endpoint: this.endpoint.toBase58(),
      endpointProgram: this.endpointProgram.toBase58(),
      bump: this.bump,
      admin: this.admin.toBase58(),
      treasury: this.treasury
    };
  }
};
var ulnSettingsBeet = new beet159.FixableBeetStruct(
  [
    ["accountDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["eid", beet159.u32],
    ["endpoint", beetSolana85.publicKey],
    ["endpointProgram", beetSolana85.publicKey],
    ["bump", beet159.u8],
    ["admin", beetSolana85.publicKey],
    ["treasury", beet159.coption(treasuryBeet)]
  ],
  UlnSettings.fromArgs,
  "UlnSettings"
);

// src/generated/uln/accounts/index.ts
var accountProviders5 = {
  Confirmations,
  ReceiveConfig: ReceiveConfig2,
  SendConfig,
  UlnSettings
};

// src/generated/uln/errors/index.ts
var errors_exports4 = {};
__export(errors_exports4, {
  AtLeastOneDVNError: () => AtLeastOneDVNError,
  ExceededMaxMessageSizeError: () => ExceededMaxMessageSizeError,
  ExceededU128Error: () => ExceededU128Error,
  InsufficientFeeError: () => InsufficientFeeError2,
  InvalidAccountLengthError: () => InvalidAccountLengthError,
  InvalidAmountError: () => InvalidAmountError4,
  InvalidBpsError: () => InvalidBpsError,
  InvalidConfigTypeError: () => InvalidConfigTypeError2,
  InvalidConfirmationError: () => InvalidConfirmationError,
  InvalidConfirmationsError: () => InvalidConfirmationsError,
  InvalidDvnError: () => InvalidDvnError,
  InvalidDvnProgramError: () => InvalidDvnProgramError,
  InvalidEidError: () => InvalidEidError,
  InvalidExecutorError: () => InvalidExecutorError,
  InvalidExecutorProgramError: () => InvalidExecutorProgramError,
  InvalidLzTokenMintError: () => InvalidLzTokenMintError2,
  InvalidOptionTypeError: () => InvalidOptionTypeError,
  InvalidOptionalDVNCountError: () => InvalidOptionalDVNCountError,
  InvalidOptionalDVNThresholdError: () => InvalidOptionalDVNThresholdError,
  InvalidPacketVersionError: () => InvalidPacketVersionError,
  InvalidPayerError: () => InvalidPayerError,
  InvalidRequiredDVNCountError: () => InvalidRequiredDVNCountError,
  InvalidTreasuryError: () => InvalidTreasuryError,
  InvalidTreasuryFeeCapError: () => InvalidTreasuryFeeCapError,
  InvalidType1SizeError: () => InvalidType1SizeError,
  InvalidType2SizeError: () => InvalidType2SizeError,
  InvalidWorkerIdError: () => InvalidWorkerIdError,
  LzTokenUnavailableError: () => LzTokenUnavailableError3,
  NonSignerError: () => NonSignerError,
  UnauthorizedError: () => UnauthorizedError2,
  UnsortedError: () => UnsortedError,
  VerifyingError: () => VerifyingError,
  ZeroMessageSizeError: () => ZeroMessageSizeError,
  errorFromCode: () => errorFromCode5,
  errorFromName: () => errorFromName5
});
var createErrorFromCodeLookup5 = /* @__PURE__ */ new Map();
var createErrorFromNameLookup5 = /* @__PURE__ */ new Map();
var UnauthorizedError2 = class _UnauthorizedError extends Error {
  constructor() {
    super("");
    this.code = 6e3;
    this.name = "Unauthorized";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _UnauthorizedError);
    }
  }
};
createErrorFromCodeLookup5.set(6e3, () => new UnauthorizedError2());
createErrorFromNameLookup5.set("Unauthorized", () => new UnauthorizedError2());
var InvalidAmountError4 = class _InvalidAmountError extends Error {
  constructor() {
    super("");
    this.code = 6001;
    this.name = "InvalidAmount";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidAmountError);
    }
  }
};
createErrorFromCodeLookup5.set(6001, () => new InvalidAmountError4());
createErrorFromNameLookup5.set("InvalidAmount", () => new InvalidAmountError4());
var InvalidExecutorError = class _InvalidExecutorError extends Error {
  constructor() {
    super("");
    this.code = 6002;
    this.name = "InvalidExecutor";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidExecutorError);
    }
  }
};
createErrorFromCodeLookup5.set(6002, () => new InvalidExecutorError());
createErrorFromNameLookup5.set(
  "InvalidExecutor",
  () => new InvalidExecutorError()
);
var ZeroMessageSizeError = class _ZeroMessageSizeError extends Error {
  constructor() {
    super("");
    this.code = 6003;
    this.name = "ZeroMessageSize";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _ZeroMessageSizeError);
    }
  }
};
createErrorFromCodeLookup5.set(6003, () => new ZeroMessageSizeError());
createErrorFromNameLookup5.set(
  "ZeroMessageSize",
  () => new ZeroMessageSizeError()
);
var InvalidRequiredDVNCountError = class _InvalidRequiredDVNCountError extends Error {
  constructor() {
    super("");
    this.code = 6004;
    this.name = "InvalidRequiredDVNCount";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidRequiredDVNCountError);
    }
  }
};
createErrorFromCodeLookup5.set(6004, () => new InvalidRequiredDVNCountError());
createErrorFromNameLookup5.set(
  "InvalidRequiredDVNCount",
  () => new InvalidRequiredDVNCountError()
);
var InvalidOptionalDVNCountError = class _InvalidOptionalDVNCountError extends Error {
  constructor() {
    super("");
    this.code = 6005;
    this.name = "InvalidOptionalDVNCount";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidOptionalDVNCountError);
    }
  }
};
createErrorFromCodeLookup5.set(6005, () => new InvalidOptionalDVNCountError());
createErrorFromNameLookup5.set(
  "InvalidOptionalDVNCount",
  () => new InvalidOptionalDVNCountError()
);
var InvalidOptionalDVNThresholdError = class _InvalidOptionalDVNThresholdError extends Error {
  constructor() {
    super("");
    this.code = 6006;
    this.name = "InvalidOptionalDVNThreshold";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidOptionalDVNThresholdError);
    }
  }
};
createErrorFromCodeLookup5.set(
  6006,
  () => new InvalidOptionalDVNThresholdError()
);
createErrorFromNameLookup5.set(
  "InvalidOptionalDVNThreshold",
  () => new InvalidOptionalDVNThresholdError()
);
var InvalidConfirmationsError = class _InvalidConfirmationsError extends Error {
  constructor() {
    super("");
    this.code = 6007;
    this.name = "InvalidConfirmations";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidConfirmationsError);
    }
  }
};
createErrorFromCodeLookup5.set(6007, () => new InvalidConfirmationsError());
createErrorFromNameLookup5.set(
  "InvalidConfirmations",
  () => new InvalidConfirmationsError()
);
var AtLeastOneDVNError = class _AtLeastOneDVNError extends Error {
  constructor() {
    super("");
    this.code = 6008;
    this.name = "AtLeastOneDVN";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _AtLeastOneDVNError);
    }
  }
};
createErrorFromCodeLookup5.set(6008, () => new AtLeastOneDVNError());
createErrorFromNameLookup5.set("AtLeastOneDVN", () => new AtLeastOneDVNError());
var UnsortedError = class _UnsortedError extends Error {
  constructor() {
    super("");
    this.code = 6009;
    this.name = "Unsorted";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _UnsortedError);
    }
  }
};
createErrorFromCodeLookup5.set(6009, () => new UnsortedError());
createErrorFromNameLookup5.set("Unsorted", () => new UnsortedError());
var InvalidTreasuryFeeCapError = class _InvalidTreasuryFeeCapError extends Error {
  constructor() {
    super("");
    this.code = 6010;
    this.name = "InvalidTreasuryFeeCap";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidTreasuryFeeCapError);
    }
  }
};
createErrorFromCodeLookup5.set(6010, () => new InvalidTreasuryFeeCapError());
createErrorFromNameLookup5.set(
  "InvalidTreasuryFeeCap",
  () => new InvalidTreasuryFeeCapError()
);
var InvalidPacketVersionError = class _InvalidPacketVersionError extends Error {
  constructor() {
    super("");
    this.code = 6011;
    this.name = "InvalidPacketVersion";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidPacketVersionError);
    }
  }
};
createErrorFromCodeLookup5.set(6011, () => new InvalidPacketVersionError());
createErrorFromNameLookup5.set(
  "InvalidPacketVersion",
  () => new InvalidPacketVersionError()
);
var InvalidEidError = class _InvalidEidError extends Error {
  constructor() {
    super("");
    this.code = 6012;
    this.name = "InvalidEid";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidEidError);
    }
  }
};
createErrorFromCodeLookup5.set(6012, () => new InvalidEidError());
createErrorFromNameLookup5.set("InvalidEid", () => new InvalidEidError());
var VerifyingError = class _VerifyingError extends Error {
  constructor() {
    super("");
    this.code = 6013;
    this.name = "Verifying";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _VerifyingError);
    }
  }
};
createErrorFromCodeLookup5.set(6013, () => new VerifyingError());
createErrorFromNameLookup5.set("Verifying", () => new VerifyingError());
var InvalidWorkerIdError = class _InvalidWorkerIdError extends Error {
  constructor() {
    super("");
    this.code = 6014;
    this.name = "InvalidWorkerId";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidWorkerIdError);
    }
  }
};
createErrorFromCodeLookup5.set(6014, () => new InvalidWorkerIdError());
createErrorFromNameLookup5.set(
  "InvalidWorkerId",
  () => new InvalidWorkerIdError()
);
var InvalidOptionTypeError = class _InvalidOptionTypeError extends Error {
  constructor() {
    super("");
    this.code = 6015;
    this.name = "InvalidOptionType";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidOptionTypeError);
    }
  }
};
createErrorFromCodeLookup5.set(6015, () => new InvalidOptionTypeError());
createErrorFromNameLookup5.set(
  "InvalidOptionType",
  () => new InvalidOptionTypeError()
);
var InvalidBpsError = class _InvalidBpsError extends Error {
  constructor() {
    super("");
    this.code = 6016;
    this.name = "InvalidBps";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidBpsError);
    }
  }
};
createErrorFromCodeLookup5.set(6016, () => new InvalidBpsError());
createErrorFromNameLookup5.set("InvalidBps", () => new InvalidBpsError());
var ExceededMaxMessageSizeError = class _ExceededMaxMessageSizeError extends Error {
  constructor() {
    super("");
    this.code = 6017;
    this.name = "ExceededMaxMessageSize";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _ExceededMaxMessageSizeError);
    }
  }
};
createErrorFromCodeLookup5.set(6017, () => new ExceededMaxMessageSizeError());
createErrorFromNameLookup5.set(
  "ExceededMaxMessageSize",
  () => new ExceededMaxMessageSizeError()
);
var InvalidExecutorProgramError = class _InvalidExecutorProgramError extends Error {
  constructor() {
    super("");
    this.code = 6018;
    this.name = "InvalidExecutorProgram";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidExecutorProgramError);
    }
  }
};
createErrorFromCodeLookup5.set(6018, () => new InvalidExecutorProgramError());
createErrorFromNameLookup5.set(
  "InvalidExecutorProgram",
  () => new InvalidExecutorProgramError()
);
var InvalidAccountLengthError = class _InvalidAccountLengthError extends Error {
  constructor() {
    super("");
    this.code = 6019;
    this.name = "InvalidAccountLength";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidAccountLengthError);
    }
  }
};
createErrorFromCodeLookup5.set(6019, () => new InvalidAccountLengthError());
createErrorFromNameLookup5.set(
  "InvalidAccountLength",
  () => new InvalidAccountLengthError()
);
var InvalidDvnProgramError = class _InvalidDvnProgramError extends Error {
  constructor() {
    super("");
    this.code = 6020;
    this.name = "InvalidDvnProgram";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidDvnProgramError);
    }
  }
};
createErrorFromCodeLookup5.set(6020, () => new InvalidDvnProgramError());
createErrorFromNameLookup5.set(
  "InvalidDvnProgram",
  () => new InvalidDvnProgramError()
);
var InvalidDvnError = class _InvalidDvnError extends Error {
  constructor() {
    super("");
    this.code = 6021;
    this.name = "InvalidDvn";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidDvnError);
    }
  }
};
createErrorFromCodeLookup5.set(6021, () => new InvalidDvnError());
createErrorFromNameLookup5.set("InvalidDvn", () => new InvalidDvnError());
var LzTokenUnavailableError3 = class _LzTokenUnavailableError extends Error {
  constructor() {
    super("");
    this.code = 6022;
    this.name = "LzTokenUnavailable";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _LzTokenUnavailableError);
    }
  }
};
createErrorFromCodeLookup5.set(6022, () => new LzTokenUnavailableError3());
createErrorFromNameLookup5.set(
  "LzTokenUnavailable",
  () => new LzTokenUnavailableError3()
);
var InsufficientFeeError2 = class _InsufficientFeeError extends Error {
  constructor() {
    super("");
    this.code = 6023;
    this.name = "InsufficientFee";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InsufficientFeeError);
    }
  }
};
createErrorFromCodeLookup5.set(6023, () => new InsufficientFeeError2());
createErrorFromNameLookup5.set(
  "InsufficientFee",
  () => new InsufficientFeeError2()
);
var InvalidTreasuryError = class _InvalidTreasuryError extends Error {
  constructor() {
    super("");
    this.code = 6024;
    this.name = "InvalidTreasury";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidTreasuryError);
    }
  }
};
createErrorFromCodeLookup5.set(6024, () => new InvalidTreasuryError());
createErrorFromNameLookup5.set(
  "InvalidTreasury",
  () => new InvalidTreasuryError()
);
var InvalidLzTokenMintError2 = class _InvalidLzTokenMintError extends Error {
  constructor() {
    super("");
    this.code = 6025;
    this.name = "InvalidLzTokenMint";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidLzTokenMintError);
    }
  }
};
createErrorFromCodeLookup5.set(6025, () => new InvalidLzTokenMintError2());
createErrorFromNameLookup5.set(
  "InvalidLzTokenMint",
  () => new InvalidLzTokenMintError2()
);
var InvalidConfigTypeError2 = class _InvalidConfigTypeError extends Error {
  constructor() {
    super("");
    this.code = 6026;
    this.name = "InvalidConfigType";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidConfigTypeError);
    }
  }
};
createErrorFromCodeLookup5.set(6026, () => new InvalidConfigTypeError2());
createErrorFromNameLookup5.set(
  "InvalidConfigType",
  () => new InvalidConfigTypeError2()
);
var InvalidConfirmationError = class _InvalidConfirmationError extends Error {
  constructor() {
    super("");
    this.code = 6027;
    this.name = "InvalidConfirmation";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidConfirmationError);
    }
  }
};
createErrorFromCodeLookup5.set(6027, () => new InvalidConfirmationError());
createErrorFromNameLookup5.set(
  "InvalidConfirmation",
  () => new InvalidConfirmationError()
);
var InvalidType1SizeError = class _InvalidType1SizeError extends Error {
  constructor() {
    super("");
    this.code = 6028;
    this.name = "InvalidType1Size";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidType1SizeError);
    }
  }
};
createErrorFromCodeLookup5.set(6028, () => new InvalidType1SizeError());
createErrorFromNameLookup5.set(
  "InvalidType1Size",
  () => new InvalidType1SizeError()
);
var InvalidType2SizeError = class _InvalidType2SizeError extends Error {
  constructor() {
    super("");
    this.code = 6029;
    this.name = "InvalidType2Size";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidType2SizeError);
    }
  }
};
createErrorFromCodeLookup5.set(6029, () => new InvalidType2SizeError());
createErrorFromNameLookup5.set(
  "InvalidType2Size",
  () => new InvalidType2SizeError()
);
var ExceededU128Error = class _ExceededU128Error extends Error {
  constructor() {
    super("");
    this.code = 6030;
    this.name = "ExceededU128";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _ExceededU128Error);
    }
  }
};
createErrorFromCodeLookup5.set(6030, () => new ExceededU128Error());
createErrorFromNameLookup5.set("ExceededU128", () => new ExceededU128Error());
var NonSignerError = class _NonSignerError extends Error {
  constructor() {
    super("");
    this.code = 6031;
    this.name = "NonSigner";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _NonSignerError);
    }
  }
};
createErrorFromCodeLookup5.set(6031, () => new NonSignerError());
createErrorFromNameLookup5.set("NonSigner", () => new NonSignerError());
var InvalidPayerError = class _InvalidPayerError extends Error {
  constructor() {
    super("");
    this.code = 6032;
    this.name = "InvalidPayer";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidPayerError);
    }
  }
};
createErrorFromCodeLookup5.set(6032, () => new InvalidPayerError());
createErrorFromNameLookup5.set("InvalidPayer", () => new InvalidPayerError());
function errorFromCode5(code) {
  const createError = createErrorFromCodeLookup5.get(code);
  return createError != null ? createError() : null;
}
function errorFromName5(name) {
  const createError = createErrorFromNameLookup5.get(name);
  return createError != null ? createError() : null;
}

// src/generated/uln/instructions/index.ts
var instructions_exports5 = {};
__export(instructions_exports5, {
  closeVerifyInstructionDiscriminator: () => closeVerifyInstructionDiscriminator,
  closeVerifyStruct: () => closeVerifyStruct,
  commitVerificationInstructionDiscriminator: () => commitVerificationInstructionDiscriminator,
  commitVerificationStruct: () => commitVerificationStruct,
  createCloseVerifyInstruction: () => createCloseVerifyInstruction,
  createCloseVerifyInstructionAccounts: () => createCloseVerifyInstructionAccounts,
  createCommitVerificationInstruction: () => createCommitVerificationInstruction,
  createCommitVerificationInstructionAccounts: () => createCommitVerificationInstructionAccounts,
  createInitConfigInstruction: () => createInitConfigInstruction3,
  createInitConfigInstructionAccounts: () => createInitConfigInstructionAccounts3,
  createInitDefaultConfigInstruction: () => createInitDefaultConfigInstruction2,
  createInitDefaultConfigInstructionAccounts: () => createInitDefaultConfigInstructionAccounts2,
  createInitUlnInstruction: () => createInitUlnInstruction,
  createInitUlnInstructionAccounts: () => createInitUlnInstructionAccounts,
  createInitVerifyInstruction: () => createInitVerifyInstruction2,
  createInitVerifyInstructionAccounts: () => createInitVerifyInstructionAccounts2,
  createQuoteInstruction: () => createQuoteInstruction3,
  createQuoteInstructionAccounts: () => createQuoteInstructionAccounts3,
  createSendInstruction: () => createSendInstruction3,
  createSendInstructionAccounts: () => createSendInstructionAccounts3,
  createSendWithLzTokenInstruction: () => createSendWithLzTokenInstruction2,
  createSendWithLzTokenInstructionAccounts: () => createSendWithLzTokenInstructionAccounts2,
  createSetConfigInstruction: () => createSetConfigInstruction4,
  createSetConfigInstructionAccounts: () => createSetConfigInstructionAccounts4,
  createSetDefaultConfigInstruction: () => createSetDefaultConfigInstruction2,
  createSetDefaultConfigInstructionAccounts: () => createSetDefaultConfigInstructionAccounts2,
  createSetTreasuryInstruction: () => createSetTreasuryInstruction,
  createSetTreasuryInstructionAccounts: () => createSetTreasuryInstructionAccounts,
  createTransferAdminInstruction: () => createTransferAdminInstruction3,
  createTransferAdminInstructionAccounts: () => createTransferAdminInstructionAccounts3,
  createVerifyInstruction: () => createVerifyInstruction2,
  createVerifyInstructionAccounts: () => createVerifyInstructionAccounts2,
  createVersionInstruction: () => createVersionInstruction2,
  createVersionInstructionAccounts: () => createVersionInstructionAccounts2,
  createWithdrawRentInstruction: () => createWithdrawRentInstruction2,
  createWithdrawRentInstructionAccounts: () => createWithdrawRentInstructionAccounts2,
  initConfigInstructionDiscriminator: () => initConfigInstructionDiscriminator3,
  initConfigStruct: () => initConfigStruct3,
  initDefaultConfigInstructionDiscriminator: () => initDefaultConfigInstructionDiscriminator2,
  initDefaultConfigStruct: () => initDefaultConfigStruct2,
  initUlnInstructionDiscriminator: () => initUlnInstructionDiscriminator,
  initUlnStruct: () => initUlnStruct,
  initVerifyInstructionDiscriminator: () => initVerifyInstructionDiscriminator2,
  initVerifyStruct: () => initVerifyStruct2,
  quoteInstructionDiscriminator: () => quoteInstructionDiscriminator3,
  quoteStruct: () => quoteStruct3,
  sendInstructionDiscriminator: () => sendInstructionDiscriminator3,
  sendStruct: () => sendStruct3,
  sendWithLzTokenInstructionDiscriminator: () => sendWithLzTokenInstructionDiscriminator2,
  sendWithLzTokenStruct: () => sendWithLzTokenStruct2,
  setConfigInstructionDiscriminator: () => setConfigInstructionDiscriminator4,
  setConfigStruct: () => setConfigStruct4,
  setDefaultConfigInstructionDiscriminator: () => setDefaultConfigInstructionDiscriminator2,
  setDefaultConfigStruct: () => setDefaultConfigStruct2,
  setTreasuryInstructionDiscriminator: () => setTreasuryInstructionDiscriminator,
  setTreasuryStruct: () => setTreasuryStruct,
  transferAdminInstructionDiscriminator: () => transferAdminInstructionDiscriminator3,
  transferAdminStruct: () => transferAdminStruct3,
  verifyInstructionDiscriminator: () => verifyInstructionDiscriminator2,
  verifyStruct: () => verifyStruct2,
  versionInstructionDiscriminator: () => versionInstructionDiscriminator2,
  versionStruct: () => versionStruct2,
  withdrawRentInstructionDiscriminator: () => withdrawRentInstructionDiscriminator2,
  withdrawRentStruct: () => withdrawRentStruct2
});
var closeVerifyParamsBeet = new beet159.BeetArgsStruct(
  [
    ["packetHeaderHash", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["payloadHash", beet159.uniformFixedSizeArray(beet159.u8, 32)]
  ],
  "CloseVerifyParams"
);

// src/generated/uln/instructions/closeVerify.ts
var closeVerifyStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", closeVerifyParamsBeet]
  ],
  "CloseVerifyInstructionArgs"
);
var closeVerifyInstructionDiscriminator = [
  44,
  133,
  228,
  138,
  169,
  242,
  53,
  36
];
function createCloseVerifyInstruction(accounts, args, programId) {
  const [data] = closeVerifyStruct.serialize({
    instructionDiscriminator: closeVerifyInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.dvn,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.receiver,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.confirmations,
      isWritable: true,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createCloseVerifyInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.dvn,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.receiver,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.confirmations,
      isWritable: true,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var commitVerificationParamsBeet = new beet159.BeetArgsStruct(
  [
    ["packetHeader", beet159.uniformFixedSizeArray(beet159.u8, 81)],
    ["payloadHash", beet159.uniformFixedSizeArray(beet159.u8, 32)]
  ],
  "CommitVerificationParams"
);

// src/generated/uln/instructions/commitVerification.ts
var commitVerificationStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", commitVerificationParamsBeet]
  ],
  "CommitVerificationInstructionArgs"
);
var commitVerificationInstructionDiscriminator = [
  194,
  120,
  44,
  252,
  140,
  215,
  139,
  103
];
function createCommitVerificationInstruction(accounts, args, programId) {
  const [data] = commitVerificationStruct.serialize({
    instructionDiscriminator: commitVerificationInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.receiveConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.defaultReceiveConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.uln,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createCommitVerificationInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.receiveConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.defaultReceiveConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.uln,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var initConfigParamsBeet3 = new beet159.BeetArgsStruct(
  [
    ["oapp", beetSolana85.publicKey],
    ["eid", beet159.u32]
  ],
  "InitConfigParams"
);

// src/generated/uln/instructions/initConfig.ts
var initConfigStruct3 = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", initConfigParamsBeet3]
  ],
  "InitConfigInstructionArgs"
);
var initConfigInstructionDiscriminator3 = [
  23,
  235,
  115,
  232,
  168,
  96,
  1,
  231
];
function createInitConfigInstruction3(accounts, args, programId) {
  const [data] = initConfigStruct3.serialize({
    instructionDiscriminator: initConfigInstructionDiscriminator3,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.uln,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.receiveConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createInitConfigInstructionAccounts3(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.uln,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.receiveConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var initDefaultConfigParamsBeet2 = new beet159.FixableBeetArgsStruct(
  [
    ["eid", beet159.u32],
    ["sendUlnConfig", ulnConfigBeet2],
    ["receiveUlnConfig", ulnConfigBeet2],
    ["executorConfig", executorConfigBeet2]
  ],
  "InitDefaultConfigParams"
);

// src/generated/uln/instructions/initDefaultConfig.ts
var initDefaultConfigStruct2 = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", initDefaultConfigParamsBeet2]
  ],
  "InitDefaultConfigInstructionArgs"
);
var initDefaultConfigInstructionDiscriminator2 = [
  98,
  218,
  197,
  194,
  173,
  179,
  112,
  21
];
function createInitDefaultConfigInstruction2(accounts, args, programId) {
  const [data] = initDefaultConfigStruct2.serialize({
    instructionDiscriminator: initDefaultConfigInstructionDiscriminator2,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.uln,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.receiveConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createInitDefaultConfigInstructionAccounts2(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.uln,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.receiveConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var initUlnParamsBeet = new beet159.BeetArgsStruct(
  [
    ["eid", beet159.u32],
    ["endpoint", beetSolana85.publicKey],
    ["endpointProgram", beetSolana85.publicKey],
    ["admin", beetSolana85.publicKey]
  ],
  "InitUlnParams"
);

// src/generated/uln/instructions/initUln.ts
var initUlnStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", initUlnParamsBeet]
  ],
  "InitUlnInstructionArgs"
);
var initUlnInstructionDiscriminator = [
  19,
  215,
  207,
  92,
  197,
  112,
  119,
  240
];
function createInitUlnInstruction(accounts, args, programId) {
  const [data] = initUlnStruct.serialize({
    instructionDiscriminator: initUlnInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.uln,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createInitUlnInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.uln,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var initVerifyParamsBeet2 = new beet159.BeetArgsStruct(
  [
    ["packetHeader", beet159.uniformFixedSizeArray(beet159.u8, 81)],
    ["payloadHash", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["dvn", beetSolana85.publicKey]
  ],
  "InitVerifyParams"
);

// src/generated/uln/instructions/initVerify.ts
var initVerifyStruct2 = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", initVerifyParamsBeet2]
  ],
  "InitVerifyInstructionArgs"
);
var initVerifyInstructionDiscriminator2 = [
  76,
  246,
  244,
  124,
  115,
  17,
  235,
  91
];
function createInitVerifyInstruction2(accounts, args, programId) {
  const [data] = initVerifyStruct2.serialize({
    instructionDiscriminator: initVerifyInstructionDiscriminator2,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.confirmations,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createInitVerifyInstructionAccounts2(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.confirmations,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var packetBeet2 = new beet159.FixableBeetArgsStruct(
  [
    ["nonce", beet159.u64],
    ["srcEid", beet159.u32],
    ["sender", beetSolana85.publicKey],
    ["dstEid", beet159.u32],
    ["receiver", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["guid", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["message", beet159.bytes]
  ],
  "Packet"
);

// src/generated/uln/types/QuoteParams.ts
var quoteParamsBeet3 = new beet159.FixableBeetArgsStruct(
  [
    ["packet", packetBeet2],
    ["options", beet159.bytes],
    ["payInLzToken", beet159.bool]
  ],
  "QuoteParams"
);

// src/generated/uln/instructions/quote.ts
var quoteStruct3 = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", quoteParamsBeet3]
  ],
  "QuoteInstructionArgs"
);
var quoteInstructionDiscriminator3 = [
  149,
  42,
  109,
  247,
  134,
  146,
  213,
  123
];
function createQuoteInstruction3(accounts, args, programId) {
  const [data] = quoteStruct3.serialize({
    instructionDiscriminator: quoteInstructionDiscriminator3,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.uln,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.defaultSendConfig,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createQuoteInstructionAccounts3(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.uln,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.defaultSendConfig,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var sendParamsBeet3 = new beet159.FixableBeetArgsStruct(
  [
    ["packet", packetBeet2],
    ["options", beet159.bytes],
    ["nativeFee", beet159.u64]
  ],
  "SendParams"
);

// src/generated/uln/instructions/send.ts
var sendStruct3 = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", sendParamsBeet3]
  ],
  "SendInstructionArgs"
);
var sendInstructionDiscriminator3 = [102, 251, 20, 187, 65, 75, 12, 69];
function createSendInstruction3(accounts, args, programId) {
  const [data] = sendStruct3.serialize({
    instructionDiscriminator: sendInstructionDiscriminator3,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.uln,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.defaultSendConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.treasury ?? programId,
      isWritable: accounts.treasury != null,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createSendInstructionAccounts3(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.uln,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.defaultSendConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.treasury ?? programId,
      isWritable: accounts.treasury != null,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var sendWithLzTokenParamsBeet2 = new beet159.FixableBeetArgsStruct(
  [
    ["packet", packetBeet2],
    ["options", beet159.bytes],
    ["nativeFee", beet159.u64],
    ["lzTokenFee", beet159.u64],
    ["lzTokenMint", beetSolana85.publicKey]
  ],
  "SendWithLzTokenParams"
);

// src/generated/uln/instructions/sendWithLzToken.ts
var sendWithLzTokenStruct2 = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", sendWithLzTokenParamsBeet2]
  ],
  "SendWithLzTokenInstructionArgs"
);
var sendWithLzTokenInstructionDiscriminator2 = [
  165,
  161,
  84,
  48,
  129,
  26,
  193,
  19
];
function createSendWithLzTokenInstruction2(accounts, args, programId) {
  const [data] = sendWithLzTokenStruct2.serialize({
    instructionDiscriminator: sendWithLzTokenInstructionDiscriminator2,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.uln,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.defaultSendConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.lzTokenSource,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.lzTokenTreasury,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.lzTokenMint,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.tokenProgram ?? splToken.TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createSendWithLzTokenInstructionAccounts2(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.uln,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.defaultSendConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.lzTokenSource,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.lzTokenTreasury,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.lzTokenMint,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.tokenProgram ?? splToken.TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var setConfigParamsBeet4 = new beet159.FixableBeetArgsStruct(
  [
    ["oapp", beetSolana85.publicKey],
    ["eid", beet159.u32],
    ["configType", beet159.u32],
    ["config", beet159.bytes]
  ],
  "SetConfigParams"
);

// src/generated/uln/instructions/setConfig.ts
var setConfigStruct4 = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", setConfigParamsBeet4]
  ],
  "SetConfigInstructionArgs"
);
var setConfigInstructionDiscriminator4 = [
  108,
  158,
  154,
  175,
  212,
  98,
  52,
  66
];
function createSetConfigInstruction4(accounts, args, programId) {
  const [data] = setConfigStruct4.serialize({
    instructionDiscriminator: setConfigInstructionDiscriminator4,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.uln,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.receiveConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.defaultSendConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.defaultReceiveConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createSetConfigInstructionAccounts4(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.endpoint,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.uln,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.receiveConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.defaultSendConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.defaultReceiveConfig,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var setDefaultConfigParamsBeet2 = new beet159.FixableBeetArgsStruct(
  [
    ["eid", beet159.u32],
    ["sendUlnConfig", beet159.coption(ulnConfigBeet2)],
    ["receiveUlnConfig", beet159.coption(ulnConfigBeet2)],
    ["executorConfig", beet159.coption(executorConfigBeet2)]
  ],
  "SetDefaultConfigParams"
);

// src/generated/uln/instructions/setDefaultConfig.ts
var setDefaultConfigStruct2 = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", setDefaultConfigParamsBeet2]
  ],
  "SetDefaultConfigInstructionArgs"
);
var setDefaultConfigInstructionDiscriminator2 = [
  111,
  228,
  17,
  75,
  5,
  76,
  213,
  169
];
function createSetDefaultConfigInstruction2(accounts, args, programId) {
  const [data] = setDefaultConfigStruct2.serialize({
    instructionDiscriminator: setDefaultConfigInstructionDiscriminator2,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.uln,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.receiveConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createSetDefaultConfigInstructionAccounts2(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.uln,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.sendConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.receiveConfig,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var setTreasuryParamsBeet = new beet159.FixableBeetArgsStruct(
  [["treasury", beet159.coption(treasuryBeet)]],
  "SetTreasuryParams"
);

// src/generated/uln/instructions/setTreasury.ts
var setTreasuryStruct = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", setTreasuryParamsBeet]
  ],
  "SetTreasuryInstructionArgs"
);
var setTreasuryInstructionDiscriminator = [
  57,
  97,
  196,
  95,
  195,
  206,
  106,
  136
];
function createSetTreasuryInstruction(accounts, args, programId) {
  const [data] = setTreasuryStruct.serialize({
    instructionDiscriminator: setTreasuryInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.signer,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.uln,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createSetTreasuryInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.signer,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.uln,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var transferAdminParamsBeet3 = new beet159.BeetArgsStruct(
  [["admin", beetSolana85.publicKey]],
  "TransferAdminParams"
);

// src/generated/uln/instructions/transferAdmin.ts
var transferAdminStruct3 = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", transferAdminParamsBeet3]
  ],
  "TransferAdminInstructionArgs"
);
var transferAdminInstructionDiscriminator3 = [
  42,
  242,
  66,
  106,
  228,
  10,
  111,
  156
];
function createTransferAdminInstruction3(accounts, args, programId) {
  const [data] = transferAdminStruct3.serialize({
    instructionDiscriminator: transferAdminInstructionDiscriminator3,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.uln,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createTransferAdminInstructionAccounts3(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.uln,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var verifyParamsBeet2 = new beet159.BeetArgsStruct(
  [
    ["packetHeader", beet159.uniformFixedSizeArray(beet159.u8, 81)],
    ["payloadHash", beet159.uniformFixedSizeArray(beet159.u8, 32)],
    ["confirmations", beet159.u64]
  ],
  "VerifyParams"
);

// src/generated/uln/instructions/verify.ts
var verifyStruct2 = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", verifyParamsBeet2]
  ],
  "VerifyInstructionArgs"
);
var verifyInstructionDiscriminator2 = [
  133,
  161,
  141,
  48,
  120,
  198,
  88,
  150
];
function createVerifyInstruction2(accounts, args, programId) {
  const [data] = verifyStruct2.serialize({
    instructionDiscriminator: verifyInstructionDiscriminator2,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.dvn,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.confirmations,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createVerifyInstructionAccounts2(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.dvn,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.confirmations,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var versionStruct2 = new beet159.BeetArgsStruct(
  [["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)]],
  "VersionInstructionArgs"
);
var versionInstructionDiscriminator2 = [
  118,
  65,
  195,
  198,
  129,
  216,
  252,
  192
];
function createVersionInstruction2(programId) {
  const [data] = versionStruct2.serialize({
    instructionDiscriminator: versionInstructionDiscriminator2
  });
  const keys = [];
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createVersionInstructionAccounts2(programId) {
  const keys = [];
  return keys;
}
var withdrawRentParamsBeet2 = new beet159.BeetArgsStruct(
  [["amount", beet159.u64]],
  "WithdrawRentParams"
);

// src/generated/uln/instructions/withdrawRent.ts
var withdrawRentStruct2 = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", withdrawRentParamsBeet2]
  ],
  "WithdrawRentInstructionArgs"
);
var withdrawRentInstructionDiscriminator2 = [
  226,
  7,
  41,
  158,
  173,
  111,
  192,
  107
];
function createWithdrawRentInstruction2(accounts, args, programId) {
  const [data] = withdrawRentStruct2.serialize({
    instructionDiscriminator: withdrawRentInstructionDiscriminator2,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.uln,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.receiver,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createWithdrawRentInstructionAccounts2(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.uln,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.receiver,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.eventAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: accounts.program,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}

// src/generated/uln/types/index.ts
var types_exports5 = {};
__export(types_exports5, {
  closeVerifyParamsBeet: () => closeVerifyParamsBeet,
  commitVerificationParamsBeet: () => commitVerificationParamsBeet,
  configBeet: () => configBeet,
  executorConfigBeet: () => executorConfigBeet2,
  initConfigParamsBeet: () => initConfigParamsBeet3,
  initDefaultConfigParamsBeet: () => initDefaultConfigParamsBeet2,
  initUlnParamsBeet: () => initUlnParamsBeet,
  initVerifyParamsBeet: () => initVerifyParamsBeet2,
  isConfigExecutor: () => isConfigExecutor,
  isConfigReceiveUln: () => isConfigReceiveUln,
  isConfigSendUln: () => isConfigSendUln,
  lzTokenTreasuryBeet: () => lzTokenTreasuryBeet,
  messagingFeeBeet: () => messagingFeeBeet3,
  packetBeet: () => packetBeet2,
  quoteParamsBeet: () => quoteParamsBeet3,
  sendParamsBeet: () => sendParamsBeet3,
  sendWithLzTokenParamsBeet: () => sendWithLzTokenParamsBeet2,
  setConfigParamsBeet: () => setConfigParamsBeet4,
  setDefaultConfigParamsBeet: () => setDefaultConfigParamsBeet2,
  setTreasuryParamsBeet: () => setTreasuryParamsBeet,
  transferAdminParamsBeet: () => transferAdminParamsBeet3,
  treasuryBeet: () => treasuryBeet,
  treasuryFeeBeet: () => treasuryFeeBeet,
  ulnConfigBeet: () => ulnConfigBeet2,
  verifyParamsBeet: () => verifyParamsBeet2,
  versionBeet: () => versionBeet2,
  withdrawRentParamsBeet: () => withdrawRentParamsBeet2,
  workerFeeBeet: () => workerFeeBeet
});
var messagingFeeBeet3 = new beet159.BeetArgsStruct(
  [
    ["nativeFee", beet159.u64],
    ["lzTokenFee", beet159.u64]
  ],
  "MessagingFee"
);
var versionBeet2 = new beet159.BeetArgsStruct(
  [
    ["major", beet159.u64],
    ["minor", beet159.u8],
    ["endpointVersion", beet159.u8]
  ],
  "Version"
);
var PROGRAM_ADDRESS5 = "7a4WjyR8VZ7yZz5XJAKm39BUGn5iT9CKcv2pmG9tdXVH";
var PROGRAM_ID5 = new PublicKey(PROGRAM_ADDRESS5);

// src/uln.ts
var Uln = class {
  constructor(program) {
    this.program = program;
    this.deriver = new UlnPDADeriver(program);
    const [eventAuthorityPDA] = new EventPDADeriver(program).eventAuthority();
    this.eventAuthorityPDA = eventAuthorityPDA;
  }
  initUln(endpointProgram, payer, admin, eid) {
    const [setting] = this.deriver.setting();
    const [msgLib] = this.deriver.messageLib();
    const [endpointAuth] = new EndpointPDADeriver(endpointProgram).messageLibraryInfo(msgLib);
    return createInitUlnInstruction(
      {
        payer,
        uln: setting
      },
      {
        params: {
          eid,
          admin,
          endpoint: endpointAuth,
          endpointProgram
        }
      },
      this.program
    );
  }
  /**
   * before calling this function, you should call initUln to initialize the uln
   */
  async initOrUpdateDefaultConfig(connection, admin, eid, sendUlnConfig, receiveUlnConfig, executorConfig, commitmentOrConfig) {
    const [setting] = this.deriver.setting();
    const [sendConfigPDA] = this.deriver.defaultSendConfig(eid);
    const [receiveConfigPDA] = this.deriver.defaultReceiveConfig(eid);
    const configInfo = await connection.getAccountInfo(sendConfigPDA, commitmentOrConfig);
    if (configInfo) {
      return createSetDefaultConfigInstruction2(
        {
          admin,
          uln: setting,
          sendConfig: sendConfigPDA,
          receiveConfig: receiveConfigPDA,
          eventAuthority: this.eventAuthorityPDA,
          program: this.program
        },
        {
          params: {
            eid,
            sendUlnConfig,
            receiveUlnConfig,
            executorConfig
          }
        },
        this.program
      );
    } else {
      return createInitDefaultConfigInstruction2(
        {
          admin,
          uln: setting,
          sendConfig: sendConfigPDA,
          receiveConfig: receiveConfigPDA,
          eventAuthority: this.eventAuthorityPDA,
          program: this.program
        },
        {
          params: {
            eid,
            sendUlnConfig,
            receiveUlnConfig,
            executorConfig
          }
        },
        this.program
      );
    }
  }
  // msg_lib -> msg_lib_program ->
  /**
   * before calling this function, you should call initUln to initialize the uln
   */
  async setTreasury(admin, treasury) {
    const [setting] = this.deriver.setting();
    const ix = createSetTreasuryInstruction(
      {
        signer: admin,
        uln: setting,
        eventAuthority: this.eventAuthorityPDA,
        program: this.program
      },
      {
        params: {
          treasury
        }
      },
      this.program
    );
    return Promise.resolve(ix);
  }
  async transferAdmin(connection, admin, newAdmin, commitmentOrConfig) {
    const [setting] = this.deriver.setting();
    const info = await connection.getAccountInfo(setting, commitmentOrConfig);
    if (!info) {
      throw new Error("uln not initialized");
    }
    return createTransferAdminInstruction3(
      {
        admin,
        uln: setting,
        eventAuthority: this.eventAuthorityPDA,
        program: this.program
      },
      {
        params: {
          admin: newAdmin
        }
      },
      this.program
    );
  }
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
  async getQuoteIXAccountMetaForCPI(connection, _payer, path, commitment) {
    const { sender: sender_, dstEid } = path;
    const sender = new PublicKey(arrayify(sender_));
    const [defaultSendConfig] = this.deriver.defaultSendConfig(dstEid);
    const [sendConfig] = this.deriver.sendConfig(dstEid, sender);
    const [setting] = this.deriver.setting();
    const remainingAccounts = await this.getSendIxRemainingAccounts(connection, sender, dstEid, false, commitment);
    const accounts = createQuoteInstructionAccounts3(
      {
        endpoint: PublicKey.default,
        // useless
        uln: setting,
        sendConfig,
        defaultSendConfig,
        anchorRemainingAccounts: remainingAccounts
      },
      this.program
    );
    return accounts.slice(1);
  }
  /***
   * Get the account meta of the send instruction for CPI(Cross-Program Invocation )
   */
  async getSendIXAccountMetaForCPI(connection, payer, path, commitment = "confirmed") {
    const { sender: sender_, dstEid } = path;
    const sender = new PublicKey(arrayify(sender_));
    const [sendConfig] = this.deriver.sendConfig(dstEid, sender);
    const [defaultSendConfig] = this.deriver.defaultSendConfig(dstEid);
    const [setting] = this.deriver.setting();
    const ulnState = await this.getSetting(connection, commitment);
    const treasury = ulnState?.treasury?.nativeReceiver;
    const remainingAccounts = await this.getSendIxRemainingAccounts(connection, sender, dstEid, true, commitment);
    const accounts = createSendInstructionAccounts3(
      {
        endpoint: PublicKey.default,
        // useless
        uln: setting,
        sendConfig,
        defaultSendConfig,
        payer,
        treasury,
        eventAuthority: this.eventAuthorityPDA,
        program: this.program,
        anchorRemainingAccounts: remainingAccounts
      },
      this.program
    );
    accounts.forEach((key) => {
      if (!payer.equals(key.pubkey)) {
        key.isSigner = false;
      }
    });
    if (treasury) {
      const treasuryIndex = accounts.findIndex((k) => k.pubkey.toBase58() == treasury.toBase58());
      accounts[treasuryIndex].isWritable = true;
    }
    return accounts.slice(1);
  }
  // 3 RPC requests
  async getSendIxRemainingAccounts(connection, sender, dstEid, payment, commitment = "confirmed") {
    const { executor, dvns } = await this.getWorkers(connection, sender, dstEid, commitment);
    const priceFeeds = new Array();
    [executor.config, ...dvns.map((dvn) => dvn.config)].forEach((config) => {
      if (!priceFeeds.find((p) => p.equals(config.priceFeed))) {
        priceFeeds.push(config.priceFeed);
      }
    });
    const priceFeedInfos = await connection.getMultipleAccountsInfo(priceFeeds, commitment);
    const priceFeedDict = priceFeedInfos.reduce((acc, info, i) => {
      invariant4(info, `priceFeed:${priceFeeds[i].toBase58()} not initialized`);
      acc.set(priceFeeds[i].toBase58(), info.owner);
      return acc;
    }, /* @__PURE__ */ new Map());
    const executorAccounts = new Executor(executor.owner).getQuoteIXAccountMetaForCPI(
      executor.config.priceFeed,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      priceFeedDict.get(executor.config.priceFeed.toBase58()),
      payment
    );
    const dvnAccounts = dvns.map((p, i) => {
      return new DVN(p.owner).getQuoteIXAccountMetaForCPI(
        p.config.priceFeed,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        priceFeedDict.get(p.config.priceFeed.toBase58()),
        payment
      );
    });
    return executorAccounts.concat(dvnAccounts.flat());
  }
  /***
   * Get all workers(executor&DVN)
   * 2 RPC requests
   */
  async getWorkers(connection, sender, eid, commitment = "confirmed") {
    const [defaultSendConfig] = this.deriver.defaultSendConfig(eid);
    const [sendConfig] = this.deriver.sendConfig(eid, sender);
    const [defaultSendConfigBuf, sendConfigBuf] = await connection.getMultipleAccountsInfo(
      [defaultSendConfig, sendConfig],
      commitment
    );
    invariant4(defaultSendConfigBuf, "defaultSendConfig not initialized");
    const [defaultSendConfigState] = SendConfig.fromAccountInfo(defaultSendConfigBuf);
    let {
      executor,
      uln: { requiredDvns, optionalDvns }
    } = defaultSendConfigState;
    const sendConfigState = sendConfigBuf ? SendConfig.fromAccountInfo(sendConfigBuf)[0] : null;
    if (sendConfigState?.executor && !sendConfigState.executor.executor.equals(PublicKey.default)) {
      ({ executor } = sendConfigState);
    }
    if (sendConfigState && sendConfigState.uln.requiredDvns.length > 0) {
      requiredDvns = sendConfigState.uln.requiredDvns.filter((p) => {
        return !p.equals(PublicKey.default);
      });
    }
    if (sendConfigState && sendConfigState.uln.optionalDvns.length > 0) {
      optionalDvns = sendConfigState.uln.optionalDvns.filter((p) => {
        return !p.equals(PublicKey.default);
      });
    }
    const dvns = requiredDvns.concat(optionalDvns);
    const [executorBuf, ...dvnBuf] = await connection.getMultipleAccountsInfo(
      [executor.executor, ...dvns],
      commitment
    );
    invariant4(executorBuf, `executor:${executor.executor.toBase58()} not initialized`);
    return {
      executor: {
        config: accounts_exports4.ExecutorConfig.fromAccountInfo(executorBuf)[0],
        owner: executorBuf.owner
      },
      dvns: dvnBuf.map((dvn, i) => {
        invariant4(dvn, `dvn:${dvns[i].toBase58()} not initialized`);
        return {
          config: accounts_exports3.DvnConfig.fromAccountInfo(dvn)[0],
          owner: dvn.owner
        };
      })
    };
  }
  async initVerify(connection, payer, dvn, packetBytes, commitmentOrConfig) {
    const packet = PacketV1Codec.fromBytes(packetBytes);
    const headerHash = packet.headerHash();
    const headerHashBytes = Uint8Array.from(Buffer.from(headerHash.slice(2), "hex"));
    const payloadHash = packet.payloadHash();
    const payloadHashBytes = Uint8Array.from(Buffer.from(payloadHash.slice(2), "hex"));
    const [confirmationsPDA] = this.deriver.confirmations(headerHashBytes, payloadHashBytes, dvn);
    const confirmationsInfo = await connection.getAccountInfo(confirmationsPDA, commitmentOrConfig);
    if (confirmationsInfo) {
      return null;
    }
    return createInitVerifyInstruction2(
      {
        payer,
        confirmations: confirmationsPDA
      },
      {
        params: {
          packetHeader: Array.from(Uint8Array.from(Buffer.from(packet.header().slice(2), "hex"))),
          payloadHash: Array.from(payloadHashBytes),
          dvn
        }
      },
      this.program
    );
  }
  verify(dvn, packetBytes, confirmations) {
    const packet = PacketV1Codec.fromBytes(packetBytes);
    const headerHash = packet.headerHash();
    const headerHashBytes = Uint8Array.from(Buffer.from(headerHash.slice(2), "hex"));
    const payloadHash = packet.payloadHash();
    const payloadHashBytes = Uint8Array.from(Buffer.from(payloadHash.slice(2), "hex"));
    const [confirmationsPDA] = this.deriver.confirmations(headerHashBytes, payloadHashBytes, dvn);
    return createVerifyInstruction2(
      {
        dvn,
        confirmations: confirmationsPDA,
        eventAuthority: this.eventAuthorityPDA,
        program: this.program
      },
      {
        params: {
          packetHeader: Array.from(Uint8Array.from(Buffer.from(packet.header().slice(2), "hex"))),
          payloadHash: Array.from(payloadHashBytes),
          confirmations: typeof confirmations === "string" ? new BN(confirmations) : confirmations
        }
      },
      this.program
    );
  }
  closeVerify(dvn, receiver, packetBytes) {
    const packet = PacketV1Codec.fromBytes(packetBytes);
    const headerHash = packet.headerHash();
    const headerHashBytes = Uint8Array.from(Buffer.from(headerHash.slice(2), "hex"));
    const payloadHash = packet.payloadHash();
    const payloadHashBytes = Uint8Array.from(Buffer.from(payloadHash.slice(2), "hex"));
    const [confirmationsPDA] = this.deriver.confirmations(headerHashBytes, payloadHashBytes, dvn);
    return createCloseVerifyInstruction(
      {
        dvn,
        receiver,
        confirmations: confirmationsPDA
      },
      {
        params: {
          packetHeaderHash: Array.from(headerHashBytes),
          payloadHash: Array.from(payloadHashBytes)
        }
      },
      this.program
    );
  }
  async isDvnVerified(connection, endpointProgram, dvn, packetBytes, commitmentOrConfig = "confirmed") {
    const packet = PacketV1Codec.fromBytes(packetBytes);
    const headerHash = packet.headerHash();
    const headerHashBytes = Uint8Array.from(Buffer.from(headerHash.slice(2), "hex"));
    const payloadHash = packet.payloadHash();
    const payloadHashBytes = Uint8Array.from(Buffer.from(payloadHash.slice(2), "hex"));
    const [confirmationsPDA] = this.deriver.confirmations(headerHashBytes, payloadHashBytes, dvn);
    const endpoint = new endpoint_exports.Endpoint(endpointProgram);
    const receiver = new PublicKey(arrayify(packet.receiver()));
    const sender = arrayify(packet.sender());
    const nonce = await endpoint.getNonce(connection, receiver, packet.srcEid(), sender, commitmentOrConfig);
    const pendingNonce = await endpoint.getPendingInboundNonce(
      connection,
      receiver,
      packet.srcEid(),
      sender,
      commitmentOrConfig
    );
    if (!nonce || !pendingNonce) {
      return false;
    }
    if (parseInt(nonce.inboundNonce.toString()) >= parseInt(packet.nonce())) {
      return true;
    }
    if (pendingNonce.nonces.find((n) => n.toString() === packet.nonce()) !== void 0) {
      return true;
    }
    try {
      const confirmation = await Confirmations.fromAccountAddress(
        connection,
        confirmationsPDA,
        commitmentOrConfig
      );
      if (confirmation.value === null) {
        return false;
      } else {
        return true;
      }
    } catch (e) {
      return false;
    }
  }
  async commitVerification(connection, endpointProgram, packetBytes) {
    const packet = PacketV1Codec.fromBytes(packetBytes);
    const payloadHash = packet.payloadHash();
    const srcEid = packet.srcEid();
    const receiver = new PublicKey(arrayify(packet.receiver()));
    const payloadHashBytes = Uint8Array.from(Buffer.from(payloadHash.slice(2), "hex"));
    const [defaultReceiveConfig] = this.deriver.defaultReceiveConfig(srcEid);
    const [receiveConfig] = this.deriver.receiveConfig(srcEid, receiver);
    const [setting] = this.deriver.setting();
    const [msgLib] = this.deriver.messageLib();
    const receiveConfigState = await this.getFinalReceiveConfigState(connection, receiver, srcEid);
    const headerHash = packet.headerHash();
    const headerHashBytes = Uint8Array.from(Buffer.from(headerHash.slice(2), "hex"));
    const confirmations = receiveConfigState.uln.requiredDvns.concat(receiveConfigState.uln.optionalDvns).map((p) => {
      const [confirmationsPDA] = this.deriver.confirmations(headerHashBytes, payloadHashBytes, p);
      return {
        pubkey: confirmationsPDA,
        isSigner: false,
        isWritable: true
      };
    });
    const endpoint = new endpoint_exports.Endpoint(endpointProgram);
    const verifyAccounts = endpoint.getVerifyIXAccountMetaForCPI(packet, msgLib);
    return createCommitVerificationInstruction(
      {
        uln: setting,
        defaultReceiveConfig,
        receiveConfig,
        anchorRemainingAccounts: confirmations.concat(verifyAccounts)
      },
      {
        params: {
          packetHeader: Array.from(arrayify(packet.header())),
          payloadHash: Array.from(payloadHashBytes)
        }
      },
      this.program
    );
  }
  /***
   * Get the account meta of the send instruction for CPI(Cross-Program Invocation )
   */
  getInitConfigIXAccountMetaForCPI(payer, oappID, eid) {
    const [sendConfig] = this.deriver.sendConfig(eid, oappID);
    const [receiveConfig] = this.deriver.receiveConfig(eid, oappID);
    const [setting] = this.deriver.setting();
    const accounts = createInitConfigInstructionAccounts3(
      {
        endpoint: PublicKey.default,
        // useless
        payer,
        uln: setting,
        sendConfig,
        receiveConfig
      },
      this.program
    );
    accounts.forEach((key) => {
      if (!payer.equals(key.pubkey)) {
        key.isSigner = false;
      }
    });
    return accounts.slice(1);
  }
  static constructSetConfigData(configType, configData) {
    switch (configType) {
      case 1 /* EXECUTOR */: {
        const [data] = executorConfigBeet2.serialize(configData);
        return Uint8Array.from(data);
      }
      case 2 /* SEND_ULN */:
      case 3 /* RECEIVE_ULN */: {
        const [data] = ulnConfigBeet2.serialize(configData);
        return Uint8Array.from(data);
      }
      default:
        throw new Error(`invalid config type: ${configType}`);
    }
  }
  /**
   * @param oappID the oApp PDA
   *
   */
  async getSetConfigIXAccountMetaForCPI(endpointProgram, oappID, eid) {
    const [sendConfig] = this.deriver.sendConfig(eid, oappID);
    const [receiveConfig] = this.deriver.receiveConfig(eid, oappID);
    const [defaultSendConfig] = this.deriver.defaultSendConfig(eid);
    const [defaultReceiveConfig] = this.deriver.defaultReceiveConfig(eid);
    const [setting] = this.deriver.setting();
    const [msgLib] = this.deriver.messageLib();
    const [msgLibInfo] = new EndpointPDADeriver(endpointProgram).messageLibraryInfo(msgLib);
    const accounts = createSetConfigInstructionAccounts4(
      {
        endpoint: msgLibInfo,
        uln: setting,
        sendConfig,
        defaultSendConfig,
        defaultReceiveConfig,
        receiveConfig,
        eventAuthority: this.eventAuthorityPDA,
        program: this.program
      },
      this.program
    );
    return Promise.resolve(accounts.slice(1));
  }
  //
  // all of below functions are retrieving accounts state
  async getSetting(connection, commitmentOrConfig) {
    const [setting] = this.deriver.setting();
    try {
      return await UlnSettings.fromAccountAddress(connection, setting, commitmentOrConfig);
    } catch (e) {
      return null;
    }
  }
  async getDefaultSendConfigState(connection, eid, commitmentOrConfig) {
    const [config] = this.deriver.defaultSendConfig(eid);
    try {
      return await SendConfig.fromAccountAddress(connection, config, commitmentOrConfig);
    } catch (e) {
      return null;
    }
  }
  async getSendConfigState(connection, sender, eid, commitmentOrConfig) {
    const [config] = this.deriver.sendConfig(eid, sender);
    try {
      return await SendConfig.fromAccountAddress(connection, config, commitmentOrConfig);
    } catch (e) {
      return null;
    }
  }
  async getDefaultReceiveConfigState(connection, eid, commitmentOrConfig) {
    const [config] = this.deriver.defaultReceiveConfig(eid);
    try {
      return await ReceiveConfig2.fromAccountAddress(connection, config, commitmentOrConfig);
    } catch (e) {
      return null;
    }
  }
  async getReceiveConfigState(connection, receiver, eid, commitmentOrConfig) {
    const [config] = this.deriver.receiveConfig(eid, receiver);
    try {
      return await ReceiveConfig2.fromAccountAddress(connection, config, commitmentOrConfig);
    } catch (e) {
      return null;
    }
  }
  async getFinalReceiveConfigState(connection, receiver, eid, commitmentOrConfig = "confirmed") {
    const NIL_CONFIRMATIONS = "18446744073709551615";
    const NIL_DVN_COUNT = "255";
    const rtn_config = {
      confirmations: 0,
      requiredDvnCount: 0,
      optionalDvnCount: 0,
      optionalDvnThreshold: 0,
      requiredDvns: [],
      optionalDvns: []
    };
    const [defaultConfig] = this.deriver.defaultReceiveConfig(eid);
    const [customConfig] = this.deriver.receiveConfig(eid, receiver);
    const [defaultConfigInfo, customConfigInfo] = await connection.getMultipleAccountsInfo(
      [defaultConfig, customConfig],
      commitmentOrConfig
    );
    if (defaultConfigInfo == null) {
      throw new Error(`please init default receive config first. ${defaultConfig.toBase58()}`);
    }
    const defaultConfigState = ReceiveConfig2.fromAccountInfo(defaultConfigInfo)[0];
    const customConfigState = customConfigInfo ? ReceiveConfig2.fromAccountInfo(customConfigInfo)[0] : null;
    if (customConfigState == null || customConfigState.uln.confirmations == 0) {
      rtn_config.confirmations = defaultConfigState.uln.confirmations;
    } else if (customConfigState.uln.confirmations.toString() !== NIL_CONFIRMATIONS) {
      rtn_config.confirmations = customConfigState.uln.confirmations;
    }
    if (customConfigState == null || customConfigState.uln.requiredDvnCount == 0) {
      if (defaultConfigState.uln.requiredDvnCount > 0) {
        rtn_config.requiredDvns = defaultConfigState.uln.requiredDvns;
        rtn_config.requiredDvnCount = defaultConfigState.uln.requiredDvnCount;
      }
    } else if (customConfigState.uln.requiredDvnCount.toString() !== NIL_DVN_COUNT) {
      rtn_config.requiredDvns = customConfigState.uln.requiredDvns;
      rtn_config.requiredDvnCount = customConfigState.uln.requiredDvnCount;
    }
    if (customConfigState == null || customConfigState.uln.optionalDvnCount == 0) {
      if (defaultConfigState.uln.optionalDvnCount > 0) {
        rtn_config.optionalDvns = defaultConfigState.uln.optionalDvns;
        rtn_config.optionalDvnCount = defaultConfigState.uln.optionalDvnCount;
        rtn_config.optionalDvnThreshold = defaultConfigState.uln.optionalDvnThreshold;
      }
    } else if (customConfigState.uln.optionalDvnCount.toString() !== NIL_DVN_COUNT) {
      rtn_config.optionalDvns = customConfigState.uln.optionalDvns;
      rtn_config.optionalDvnCount = customConfigState.uln.optionalDvnCount;
      rtn_config.optionalDvnThreshold = customConfigState.uln.optionalDvnThreshold;
    }
    if (rtn_config.requiredDvnCount === 0 && rtn_config.optionalDvnCount === 0) {
      throw new Error("no dvn");
    }
    return ReceiveConfig2.fromArgs({
      bump: defaultConfigState.bump,
      uln: rtn_config
    });
  }
};

// src/pricefeed.ts
var pricefeed_exports = {};
__export(pricefeed_exports, {
  PROGRAM_ID: () => PROGRAM_ID6,
  PriceFeed: () => PriceFeed2,
  accounts: () => accounts_exports6,
  instructions: () => instructions_exports6,
  types: () => types_exports6
});

// src/generated/pricefeed/accounts/index.ts
var accounts_exports6 = {};
__export(accounts_exports6, {
  PriceFeed: () => PriceFeed,
  accountProviders: () => accountProviders6,
  priceFeedBeet: () => priceFeedBeet,
  priceFeedDiscriminator: () => priceFeedDiscriminator
});
var isModelTypeArbitrum = (x) => x.__kind === "Arbitrum";
var isModelTypeOptimism = (x) => x.__kind === "Optimism";
var modelTypeBeet = beet159.dataEnum([
  [
    "Arbitrum",
    new beet159.BeetArgsStruct(
      [
        ["gasPerL2Tx", beet159.u64],
        ["gasPerL1CalldataByte", beet159.u32]
      ],
      'ModelTypeRecord["Arbitrum"]'
    )
  ],
  [
    "Optimism",
    new beet159.BeetArgsStruct(
      [["l1Eid", beet159.u32]],
      'ModelTypeRecord["Optimism"]'
    )
  ]
]);

// src/generated/pricefeed/types/Price.ts
var priceBeet = new beet159.FixableBeetArgsStruct(
  [
    ["eid", beet159.u32],
    ["priceRatio", beet159.u128],
    ["gasPriceInUnit", beet159.u64],
    ["gasPerByte", beet159.u32],
    ["modelType", beet159.coption(modelTypeBeet)]
  ],
  "Price"
);

// src/generated/pricefeed/accounts/PriceFeed.ts
var priceFeedDiscriminator = [189, 103, 252, 23, 152, 35, 243, 156];
var PriceFeed = class _PriceFeed {
  constructor(admin, updaters, priceRatioDenominator, arbitrumCompressionPercent, nativeTokenPriceUsd, prices, bump) {
    this.admin = admin;
    this.updaters = updaters;
    this.priceRatioDenominator = priceRatioDenominator;
    this.arbitrumCompressionPercent = arbitrumCompressionPercent;
    this.nativeTokenPriceUsd = nativeTokenPriceUsd;
    this.prices = prices;
    this.bump = bump;
  }
  /**
   * Creates a {@link PriceFeed} instance from the provided args.
   */
  static fromArgs(args) {
    return new _PriceFeed(
      args.admin,
      args.updaters,
      args.priceRatioDenominator,
      args.arbitrumCompressionPercent,
      args.nativeTokenPriceUsd,
      args.prices,
      args.bump
    );
  }
  /**
   * Deserializes the {@link PriceFeed} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(accountInfo, offset = 0) {
    return _PriceFeed.deserialize(accountInfo.data, offset);
  }
  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link PriceFeed} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(connection, address, commitmentOrConfig) {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    );
    if (accountInfo == null) {
      throw new Error(`Unable to find PriceFeed account at ${address}`);
    }
    return _PriceFeed.fromAccountInfo(accountInfo, 0)[0];
  }
  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(programId = new web314.PublicKey(
    "8ahPGPjEbpgGaZx2NV1iG5Shj7TDwvsjkEDcGWjt94TP"
  )) {
    return beetSolana85.GpaBuilder.fromStruct(programId, priceFeedBeet);
  }
  /**
   * Deserializes the {@link PriceFeed} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf, offset = 0) {
    return priceFeedBeet.deserialize(buf, offset);
  }
  /**
   * Serializes the {@link PriceFeed} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize() {
    return priceFeedBeet.serialize({
      accountDiscriminator: priceFeedDiscriminator,
      ...this
    });
  }
  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link PriceFeed} for the provided args.
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   */
  static byteSize(args) {
    const instance = _PriceFeed.fromArgs(args);
    return priceFeedBeet.toFixedFromValue({
      accountDiscriminator: priceFeedDiscriminator,
      ...instance
    }).byteSize;
  }
  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link PriceFeed} data from rent
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(args, connection, commitment) {
    return connection.getMinimumBalanceForRentExemption(
      _PriceFeed.byteSize(args),
      commitment
    );
  }
  /**
   * Returns a readable version of {@link PriceFeed} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      admin: this.admin.toBase58(),
      updaters: this.updaters,
      priceRatioDenominator: (() => {
        const x = this.priceRatioDenominator;
        if (typeof x.toNumber === "function") {
          try {
            return x.toNumber();
          } catch (_) {
            return x;
          }
        }
        return x;
      })(),
      arbitrumCompressionPercent: (() => {
        const x = this.arbitrumCompressionPercent;
        if (typeof x.toNumber === "function") {
          try {
            return x.toNumber();
          } catch (_) {
            return x;
          }
        }
        return x;
      })(),
      nativeTokenPriceUsd: this.nativeTokenPriceUsd,
      prices: this.prices,
      bump: this.bump
    };
  }
};
var priceFeedBeet = new beet159.FixableBeetStruct(
  [
    ["accountDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["admin", beetSolana85.publicKey],
    ["updaters", beet159.array(beetSolana85.publicKey)],
    ["priceRatioDenominator", beet159.u128],
    ["arbitrumCompressionPercent", beet159.u128],
    ["nativeTokenPriceUsd", beet159.coption(beet159.u128)],
    ["prices", beet159.array(priceBeet)],
    ["bump", beet159.u8]
  ],
  PriceFeed.fromArgs,
  "PriceFeed"
);

// src/generated/pricefeed/accounts/index.ts
var accountProviders6 = { PriceFeed };

// src/generated/pricefeed/instructions/index.ts
var instructions_exports6 = {};
__export(instructions_exports6, {
  createGetFeeInstruction: () => createGetFeeInstruction,
  createGetFeeInstructionAccounts: () => createGetFeeInstructionAccounts,
  createInitPriceFeedInstruction: () => createInitPriceFeedInstruction,
  createInitPriceFeedInstructionAccounts: () => createInitPriceFeedInstructionAccounts,
  createSetPriceFeedInstruction: () => createSetPriceFeedInstruction,
  createSetPriceFeedInstructionAccounts: () => createSetPriceFeedInstructionAccounts,
  createSetPriceInstruction: () => createSetPriceInstruction,
  createSetPriceInstructionAccounts: () => createSetPriceInstructionAccounts,
  createSetSolPriceInstruction: () => createSetSolPriceInstruction,
  createSetSolPriceInstructionAccounts: () => createSetSolPriceInstructionAccounts,
  createTransferAdminInstruction: () => createTransferAdminInstruction4,
  createTransferAdminInstructionAccounts: () => createTransferAdminInstructionAccounts4,
  getFeeInstructionDiscriminator: () => getFeeInstructionDiscriminator,
  getFeeStruct: () => getFeeStruct,
  initPriceFeedInstructionDiscriminator: () => initPriceFeedInstructionDiscriminator,
  initPriceFeedStruct: () => initPriceFeedStruct,
  setPriceFeedInstructionDiscriminator: () => setPriceFeedInstructionDiscriminator,
  setPriceFeedStruct: () => setPriceFeedStruct,
  setPriceInstructionDiscriminator: () => setPriceInstructionDiscriminator,
  setPriceStruct: () => setPriceStruct,
  setSolPriceInstructionDiscriminator: () => setSolPriceInstructionDiscriminator,
  setSolPriceStruct: () => setSolPriceStruct,
  transferAdminInstructionDiscriminator: () => transferAdminInstructionDiscriminator4,
  transferAdminStruct: () => transferAdminStruct4
});
var getFeeParamsBeet = new beet159.BeetArgsStruct(
  [
    ["dstEid", beet159.u32],
    ["calldataSize", beet159.u64],
    ["totalGas", beet159.u128]
  ],
  "GetFeeParams"
);

// src/generated/pricefeed/instructions/getFee.ts
var getFeeStruct = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", getFeeParamsBeet]
  ],
  "GetFeeInstructionArgs"
);
var getFeeInstructionDiscriminator = [
  115,
  195,
  235,
  161,
  25,
  219,
  60,
  29
];
function createGetFeeInstruction(accounts, args, programId) {
  const [data] = getFeeStruct.serialize({
    instructionDiscriminator: getFeeInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.priceFeed,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createGetFeeInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.priceFeed,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var initPriceFeedParamsBeet = new beet159.FixableBeetArgsStruct(
  [
    ["admin", beetSolana85.publicKey],
    ["updaters", beet159.array(beetSolana85.publicKey)]
  ],
  "InitPriceFeedParams"
);

// src/generated/pricefeed/instructions/initPriceFeed.ts
var initPriceFeedStruct = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", initPriceFeedParamsBeet]
  ],
  "InitPriceFeedInstructionArgs"
);
var initPriceFeedInstructionDiscriminator = [
  27,
  209,
  184,
  5,
  152,
  116,
  136,
  16
];
function createInitPriceFeedInstruction(accounts, args, programId) {
  const [data] = initPriceFeedStruct.serialize({
    instructionDiscriminator: initPriceFeedInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.priceFeed,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createInitPriceFeedInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.priceFeed,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: accounts.systemProgram ?? web314.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var priceParamsBeet = new beet159.FixableBeetArgsStruct(
  [
    ["priceRatio", beet159.u128],
    ["gasPriceInUnit", beet159.u64],
    ["gasPerByte", beet159.u32],
    ["modelType", beet159.coption(modelTypeBeet)]
  ],
  "PriceParams"
);

// src/generated/pricefeed/types/SetPriceParams.ts
var setPriceParamsBeet = new beet159.FixableBeetArgsStruct(
  [
    ["dstEid", beet159.u32],
    ["params", beet159.coption(priceParamsBeet)]
  ],
  "SetPriceParams"
);

// src/generated/pricefeed/instructions/setPrice.ts
var setPriceStruct = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", setPriceParamsBeet]
  ],
  "SetPriceInstructionArgs"
);
var setPriceInstructionDiscriminator = [
  16,
  19,
  182,
  8,
  149,
  83,
  72,
  181
];
function createSetPriceInstruction(accounts, args, programId) {
  const [data] = setPriceStruct.serialize({
    instructionDiscriminator: setPriceInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.updater,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.priceFeed,
      isWritable: true,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createSetPriceInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.updater,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.priceFeed,
      isWritable: true,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var setPriceFeedParamsBeet = new beet159.FixableBeetArgsStruct(
  [
    ["updaters", beet159.array(beetSolana85.publicKey)],
    ["priceRatioDenominator", beet159.u128],
    ["arbitrumCompressionPercent", beet159.u128]
  ],
  "SetPriceFeedParams"
);

// src/generated/pricefeed/instructions/setPriceFeed.ts
var setPriceFeedStruct = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", setPriceFeedParamsBeet]
  ],
  "SetPriceFeedInstructionArgs"
);
var setPriceFeedInstructionDiscriminator = [
  13,
  15,
  231,
  129,
  61,
  7,
  28,
  122
];
function createSetPriceFeedInstruction(accounts, args, programId) {
  const [data] = setPriceFeedStruct.serialize({
    instructionDiscriminator: setPriceFeedInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.priceFeed,
      isWritable: true,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createSetPriceFeedInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: true,
      isSigner: true
    },
    {
      pubkey: accounts.priceFeed,
      isWritable: true,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var setSolPriceParamsBeet = new beet159.FixableBeetArgsStruct(
  [["nativeTokenPriceUsd", beet159.coption(beet159.u128)]],
  "SetSolPriceParams"
);

// src/generated/pricefeed/instructions/setSolPrice.ts
var setSolPriceStruct = new beet159.FixableBeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", setSolPriceParamsBeet]
  ],
  "SetSolPriceInstructionArgs"
);
var setSolPriceInstructionDiscriminator = [
  151,
  237,
  70,
  191,
  232,
  81,
  138,
  214
];
function createSetSolPriceInstruction(accounts, args, programId) {
  const [data] = setSolPriceStruct.serialize({
    instructionDiscriminator: setSolPriceInstructionDiscriminator,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.updater,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.priceFeed,
      isWritable: true,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createSetSolPriceInstructionAccounts(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.updater,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.priceFeed,
      isWritable: true,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}
var transferAdminParamsBeet4 = new beet159.BeetArgsStruct(
  [["admin", beetSolana85.publicKey]],
  "TransferAdminParams"
);

// src/generated/pricefeed/instructions/transferAdmin.ts
var transferAdminStruct4 = new beet159.BeetArgsStruct(
  [
    ["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)],
    ["params", transferAdminParamsBeet4]
  ],
  "TransferAdminInstructionArgs"
);
var transferAdminInstructionDiscriminator4 = [
  42,
  242,
  66,
  106,
  228,
  10,
  111,
  156
];
function createTransferAdminInstruction4(accounts, args, programId) {
  const [data] = transferAdminStruct4.serialize({
    instructionDiscriminator: transferAdminInstructionDiscriminator4,
    ...args
  });
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.priceFeed,
      isWritable: true,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createTransferAdminInstructionAccounts4(accounts, programId) {
  const keys = [
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: accounts.priceFeed,
      isWritable: true,
      isSigner: false
    }
  ];
  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }
  return keys;
}

// src/generated/pricefeed/types/index.ts
var types_exports6 = {};
__export(types_exports6, {
  getFeeParamsBeet: () => getFeeParamsBeet,
  initPriceFeedParamsBeet: () => initPriceFeedParamsBeet,
  isModelTypeArbitrum: () => isModelTypeArbitrum,
  isModelTypeOptimism: () => isModelTypeOptimism,
  modelTypeBeet: () => modelTypeBeet,
  priceBeet: () => priceBeet,
  priceParamsBeet: () => priceParamsBeet,
  setPriceFeedParamsBeet: () => setPriceFeedParamsBeet,
  setPriceParamsBeet: () => setPriceParamsBeet,
  setSolPriceParamsBeet: () => setSolPriceParamsBeet,
  transferAdminParamsBeet: () => transferAdminParamsBeet4
});

// src/generated/pricefeed/errors/index.ts
var createErrorFromCodeLookup6 = /* @__PURE__ */ new Map();
var createErrorFromNameLookup6 = /* @__PURE__ */ new Map();
var TooManyUpdatersError = class _TooManyUpdatersError extends Error {
  constructor() {
    super("");
    this.code = 6e3;
    this.name = "TooManyUpdaters";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _TooManyUpdatersError);
    }
  }
};
createErrorFromCodeLookup6.set(6e3, () => new TooManyUpdatersError());
createErrorFromNameLookup6.set(
  "TooManyUpdaters",
  () => new TooManyUpdatersError()
);
var InvalidUpdaterError = class _InvalidUpdaterError extends Error {
  constructor() {
    super("");
    this.code = 6001;
    this.name = "InvalidUpdater";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidUpdaterError);
    }
  }
};
createErrorFromCodeLookup6.set(6001, () => new InvalidUpdaterError());
createErrorFromNameLookup6.set("InvalidUpdater", () => new InvalidUpdaterError());
var NotFoundError = class _NotFoundError extends Error {
  constructor() {
    super("");
    this.code = 6002;
    this.name = "NotFound";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _NotFoundError);
    }
  }
};
createErrorFromCodeLookup6.set(6002, () => new NotFoundError());
createErrorFromNameLookup6.set("NotFound", () => new NotFoundError());
var InvalidSizeError2 = class _InvalidSizeError extends Error {
  constructor() {
    super("");
    this.code = 6003;
    this.name = "InvalidSize";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, _InvalidSizeError);
    }
  }
};
createErrorFromCodeLookup6.set(6003, () => new InvalidSizeError2());
createErrorFromNameLookup6.set("InvalidSize", () => new InvalidSizeError2());

// src/generated/pricefeed/index.ts
var PROGRAM_ADDRESS6 = "8ahPGPjEbpgGaZx2NV1iG5Shj7TDwvsjkEDcGWjt94TP";
var PROGRAM_ID6 = new PublicKey(PROGRAM_ADDRESS6);

// src/pricefeed.ts
var PriceFeed2 = class {
  constructor(program) {
    this.program = program;
    this.deriver = new PriceFeedPDADeriver(this.program);
  }
  async initPriceFeed(connection, payer, admin, updaters, commitmentOrConfig) {
    const [priceFeed] = this.deriver.priceFeed();
    const info = await connection.getAccountInfo(priceFeed, commitmentOrConfig);
    if (info) {
      throw new Error("Pricefeed already initialized");
    }
    return createInitPriceFeedInstruction(
      {
        payer,
        priceFeed
      },
      {
        params: {
          admin,
          updaters
        }
      },
      this.program
    );
  }
  setPriceFeed(admin, updaters, priceRatioDenominator, arbitrumCompressionPercent) {
    const [priceFeed] = this.deriver.priceFeed();
    return createSetPriceFeedInstruction(
      {
        admin,
        priceFeed
      },
      {
        params: {
          updaters,
          priceRatioDenominator,
          arbitrumCompressionPercent
        }
      },
      this.program
    );
  }
  setPrice(updater, dstEid, priceRatio, gasPriceInUnit, gasPerByte, modelType) {
    const EID_MODULUS = 3e4;
    dstEid = dstEid % EID_MODULUS;
    const [priceFeed] = this.deriver.priceFeed();
    return createSetPriceInstruction(
      {
        updater,
        priceFeed
      },
      {
        params: {
          dstEid,
          params: {
            priceRatio,
            gasPriceInUnit,
            gasPerByte,
            modelType
          }
        }
      },
      this.program
    );
  }
  setSolPrice(updater, nativeTokenPriceUsd) {
    const [priceFeed] = this.deriver.priceFeed();
    return createSetSolPriceInstruction(
      {
        priceFeed,
        updater
      },
      {
        params: {
          nativeTokenPriceUsd
        }
      },
      this.program
    );
  }
  transferAdmin(admin, newAdmin) {
    const [priceFeed] = this.deriver.priceFeed();
    return createTransferAdminInstruction4(
      {
        admin,
        priceFeed
      },
      {
        params: {
          admin: newAdmin
        }
      },
      this.program
    );
  }
  async getPriceFeed(connection, commitmentOrConfig) {
    const [priceFeed] = this.deriver.priceFeed();
    try {
      return await PriceFeed.fromAccountAddress(connection, priceFeed, commitmentOrConfig);
    } catch (e) {
      return null;
    }
  }
};
function oappIDPDA(program, seed = COUNT_SEED, id) {
  if (id != void 0) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(seed, "utf8"), new BN(id).toArrayLike(Buffer, "be", 1)],
      program
    );
  } else {
    return PublicKey.findProgramAddressSync([Buffer.from(seed, "utf8")], program);
  }
}
function deriveLzReceiveTypesAccountsPDA(program, oappId) {
  if (oappId != void 0) {
    return PublicKey.findProgramAddressSync([Buffer.from(LZ_RECEIVE_TYPES_SEED, "utf8"), oappId.toBytes()], program);
  }
  return PublicKey.findProgramAddressSync([Buffer.from(LZ_RECEIVE_TYPES_SEED, "utf8")], program);
}
function deriveLzComposeTypesAccountsPDA(program, oappId) {
  if (oappId != void 0) {
    return PublicKey.findProgramAddressSync([Buffer.from(LZ_COMPOSE_TYPES_SEED, "utf8"), oappId.toBytes()], program);
  }
  return PublicKey.findProgramAddressSync([Buffer.from(LZ_COMPOSE_TYPES_SEED, "utf8")], program);
}
var BaseOApp = class {
  constructor(program) {
    this.program = program;
    this.oappBaseDeriver = new OAppBasePDADeriver(program);
  }
  async queryIDPDAInfo(connection, commitmentOrConfig) {
    return this.queryPDAInfo(connection, this.idPDA()[0], commitmentOrConfig);
  }
  async queryPDAInfo(connection, pda, commitmentOrConfig) {
    return connection.getAccountInfo(pda, commitmentOrConfig);
  }
  idPDA() {
    return oappIDPDA(this.program);
  }
  async getRemote(connection, dstEid, commitmentOrConfig) {
    const [remotePDA] = this.oappBaseDeriver.remote(dstEid);
    const info = await this.queryPDAInfo(connection, remotePDA, commitmentOrConfig);
    if (info) {
      const result = AddressType.read(info.data, 8);
      return Uint8Array.from(result);
    }
    return null;
  }
};
var idlTypes = [
  "MessageLibQuoteParams",
  "MessageLibSendParams",
  "MessagingFee",
  "MessagingReceipt",
  "PacketForQuote",
  "Packet",
  "InitConfigParams",
  "MessageLibSetConfigParams",
  "MessageLibSnapshotConfigParams",
  "MessageLibResetConfigParams"
];
var messageLibs = ["uln", "simple_messagelib"];
var FAUCET_URL = {
  [Environment.MAINNET]: "",
  [Environment.TESTNET]: "",
  [Environment.DEVNET]: "",
  [Environment.LOCAL]: "http://127.0.0.1:9900"
};
function getProgramKeypair(network, program) {
  network = network === "default" ? "solana-sandbox-local" : network;
  const deployment = __require(`@layerzerolabs/lz-solana-sdk-v2/deployments/${network}/${program}.json`);
  return new PublicKey(deployment.address);
}
function getEndpointProgramId(network) {
  return getProgramKeypair(network, "endpoint");
}
function getSimpleMessageLibProgramId(network) {
  return getProgramKeypair(network, "simple_messagelib");
}
function getULNProgramId(network) {
  return getProgramKeypair(network, "uln");
}
function getDVNProgramId(network) {
  return getProgramKeypair(network, "dvn");
}
function getBlockedMessageLibProgramId(network) {
  return getProgramKeypair(network, "blocked_messagelib");
}
function getExecutorProgramId(network) {
  return getProgramKeypair(network, "executor");
}
function getPricefeedProgramId(network) {
  return getProgramKeypair(network, "pricefeed");
}

// src/generated/blocked_messagelib/index.ts
var blocked_messagelib_exports = {};
__export(blocked_messagelib_exports, {
  PROGRAM_ADDRESS: () => PROGRAM_ADDRESS7,
  PROGRAM_ID: () => PROGRAM_ID7,
  createVersionInstruction: () => createVersionInstruction3,
  createVersionInstructionAccounts: () => createVersionInstructionAccounts3,
  versionInstructionDiscriminator: () => versionInstructionDiscriminator3,
  versionStruct: () => versionStruct3
});
var versionStruct3 = new beet159.BeetArgsStruct(
  [["instructionDiscriminator", beet159.uniformFixedSizeArray(beet159.u8, 8)]],
  "VersionInstructionArgs"
);
var versionInstructionDiscriminator3 = [
  118,
  65,
  195,
  198,
  129,
  216,
  252,
  192
];
function createVersionInstruction3(programId) {
  const [data] = versionStruct3.serialize({
    instructionDiscriminator: versionInstructionDiscriminator3
  });
  const keys = [];
  const ix = new web314.TransactionInstruction({
    programId,
    keys,
    data
  });
  return ix;
}
function createVersionInstructionAccounts3(programId) {
  const keys = [];
  return keys;
}

// src/generated/blocked_messagelib/index.ts
var PROGRAM_ADDRESS7 = "2XrYqmhBMPJgDsb4SVbjV1PnJBprurd5bzRCkHwiFCJB";
var PROGRAM_ID7 = new PublicKey(PROGRAM_ADDRESS7);
var SendHelper = class {
  constructor(endpointProgram = endpoint_exports.PROGRAM_ID, ulnProgram = uln_exports.PROGRAM_ID, simpleMsgLibProgram = simple_message_lib_exports.PROGRAM_ID) {
    this.endpointProgram = endpointProgram;
    this.ulnProgram = ulnProgram;
    this.simpleMsgLibProgram = simpleMsgLibProgram;
    this.accounts = /* @__PURE__ */ new Map();
    this.endpoint = new endpoint_exports.Endpoint(endpointProgram);
    this.uln = new uln_exports.Uln(ulnProgram);
    this.simpleMsgLib = new simple_message_lib_exports.SimpleMessageLib(simpleMsgLibProgram);
  }
  async getMultipleAccountsInfo(connection, keys, commitment) {
    const missingKeys = keys.filter((key) => !this.accounts.has(key.toBase58()));
    if (missingKeys.length > 0) {
      const infos = await connection.getMultipleAccountsInfo(missingKeys, commitment);
      infos.forEach((info, i) => {
        this.accounts.set(missingKeys[i].toBase58(), info);
      });
    }
    return keys.map((key) => this.accounts.get(key.toBase58()));
  }
  async getQuoteAccounts(connection, payer, sender, dstEid, receiver, commitmentOrConfig = "confirmed") {
    const [sendLibConfig] = this.endpoint.deriver.sendLibraryConfig(sender, dstEid);
    const [defaultSendLibConfig] = this.endpoint.deriver.defaultSendLibraryConfig(dstEid);
    const [simpleMsgLib] = this.simpleMsgLib.deriver.messageLib();
    const [uln] = this.uln.deriver.messageLib();
    const [ulnDefaultSendConfig] = this.uln.deriver.defaultSendConfig(dstEid);
    const [ulnSendConfig] = this.uln.deriver.sendConfig(dstEid, sender);
    const [
      sendLibConfigBuf,
      defaultSendLibConfigBuf,
      _simpleMsgLibBuf,
      ulnBuf,
      ulnDefaultSendConfigBuf,
      ulnSendConfigBuf
    ] = await this.getMultipleAccountsInfo(
      connection,
      [sendLibConfig, defaultSendLibConfig, simpleMsgLib, uln, ulnDefaultSendConfig, ulnSendConfig],
      commitmentOrConfig
    );
    invariant4(defaultSendLibConfigBuf && sendLibConfigBuf, "endpoint send library not initialized");
    const [sendLibConfigInfo] = endpoint_exports.accounts.SendLibraryConfig.fromAccountInfo(sendLibConfigBuf, 0);
    const [defaultSendLibConfigInfo] = endpoint_exports.accounts.SendLibraryConfig.fromAccountInfo(
      defaultSendLibConfigBuf,
      0
    );
    const msgLib = sendLibConfigInfo.messageLib.toString() === DefaultMessageLib.toString() ? defaultSendLibConfigInfo.messageLib : sendLibConfigInfo.messageLib;
    let msgLibProgram = this.ulnProgram;
    if (msgLib.toBase58() === this.simpleMsgLib.deriver.messageLib()[0].toBase58()) {
      msgLibProgram = this.simpleMsgLibProgram;
      return this.getEndpointAccounts(msgLibProgram, msgLib, sender, dstEid, receiver, 0 /* Quote */).concat(
        this.getSimpleMsgLibAccounts(payer, 0 /* Quote */)
      );
    }
    if (msgLib.toBase58() !== this.uln.deriver.messageLib()[0].toBase58()) {
      throw new Error("Invalid message library");
    }
    return this.getEndpointAccounts(msgLibProgram, msgLib, sender, dstEid, receiver, 0 /* Quote */).concat(
      await this.getUlnAccounts(
        connection,
        payer,
        {
          accountId: uln,
          accountInfo: ulnBuf
        },
        {
          accountId: ulnDefaultSendConfig,
          accountInfo: ulnDefaultSendConfigBuf
        },
        {
          accountId: ulnSendConfig,
          accountInfo: ulnSendConfigBuf
        },
        0 /* Quote */,
        commitmentOrConfig
      )
    );
  }
  /**
   * @param connection
   * @param payer
   * @param sender the PDA of the oApp
   * @param dstEid the destination endpoint id
   * @param receiver the remote peer's address
   * @param commitmentOrConfig
   * 1 or 3(1+2) RPC calls
   * */
  async getSendAccounts(connection, payer, sender, dstEid, receiver, commitmentOrConfig = "confirmed") {
    const [sendLibConfig] = this.endpoint.deriver.sendLibraryConfig(sender, dstEid);
    const [defaultSendLibConfig] = this.endpoint.deriver.defaultSendLibraryConfig(dstEid);
    const [simpleMsgLib] = this.simpleMsgLib.deriver.messageLib();
    const [uln] = this.uln.deriver.messageLib();
    const [ulnDefaultSendConfig] = this.uln.deriver.defaultSendConfig(dstEid);
    const [ulnSendConfig] = this.uln.deriver.sendConfig(dstEid, sender);
    const [
      sendLibConfigBuf,
      defaultSendLibConfigBuf,
      _simpleMsgLibBuf,
      ulnBuf,
      ulnDefaultSendConfigBuf,
      ulnSendConfigBuf
    ] = await this.getMultipleAccountsInfo(
      connection,
      [sendLibConfig, defaultSendLibConfig, simpleMsgLib, uln, ulnDefaultSendConfig, ulnSendConfig],
      commitmentOrConfig
    );
    invariant4(defaultSendLibConfigBuf && sendLibConfigBuf, "endpoint send library not initialized");
    const [sendLibConfigInfo] = endpoint_exports.accounts.SendLibraryConfig.fromAccountInfo(sendLibConfigBuf, 0);
    const [defaultSendLibConfigInfo] = endpoint_exports.accounts.SendLibraryConfig.fromAccountInfo(
      defaultSendLibConfigBuf,
      0
    );
    const msgLib = sendLibConfigInfo.messageLib.toString() === DefaultMessageLib.toString() ? defaultSendLibConfigInfo.messageLib : sendLibConfigInfo.messageLib;
    let msgLibProgram = this.ulnProgram;
    if (msgLib.toBase58() === this.simpleMsgLib.deriver.messageLib()[0].toBase58()) {
      msgLibProgram = this.simpleMsgLibProgram;
      return this.getEndpointAccounts(msgLibProgram, msgLib, sender, dstEid, receiver, 1 /* Send */).concat(
        this.getSimpleMsgLibAccounts(payer, 1 /* Send */)
      );
    }
    if (msgLib.toBase58() !== this.uln.deriver.messageLib()[0].toBase58()) {
      throw new Error("Invalid message library");
    }
    return this.getEndpointAccounts(msgLibProgram, msgLib, sender, dstEid, receiver, 1 /* Send */).concat(
      await this.getUlnAccounts(
        connection,
        payer,
        {
          accountId: uln,
          accountInfo: ulnBuf
        },
        {
          accountId: ulnDefaultSendConfig,
          accountInfo: ulnDefaultSendConfigBuf
        },
        {
          accountId: ulnSendConfig,
          accountInfo: ulnSendConfigBuf
        },
        1 /* Send */,
        commitmentOrConfig
      )
    );
  }
  getEndpointAccounts(msgLibProgram, msgLib, sender, dstEid, receiver, quoteOrSend) {
    const [sendLibraryConfig] = this.endpoint.deriver.sendLibraryConfig(sender, dstEid);
    const [defaultSendLibraryConfig] = this.endpoint.deriver.defaultSendLibraryConfig(dstEid);
    const [sendLibraryInfo] = this.endpoint.deriver.messageLibraryInfo(msgLib);
    const [nonce] = this.endpoint.deriver.nonce(sender, dstEid, addressToBytes32(receiver));
    let accounts;
    if (quoteOrSend === 0 /* Quote */) {
      accounts = endpoint_exports.instructions.createQuoteInstructionAccounts(
        {
          sendLibraryProgram: msgLibProgram,
          sendLibraryConfig,
          defaultSendLibraryConfig,
          sendLibraryInfo,
          endpoint: this.endpoint.deriver.setting()[0],
          nonce
        },
        this.endpointProgram
      );
    } else {
      accounts = endpoint_exports.instructions.createSendInstructionAccounts(
        {
          sender,
          //signer
          sendLibraryProgram: msgLibProgram,
          sendLibraryConfig,
          defaultSendLibraryConfig,
          sendLibraryInfo,
          endpoint: this.endpoint.deriver.setting()[0],
          nonce,
          program: this.endpointProgram,
          eventAuthority: this.endpoint.eventAuthorityPDA
        },
        this.endpoint.program
      );
    }
    accounts.forEach((item) => {
      item.isSigner = false;
    });
    return [
      {
        pubkey: this.endpoint.program,
        isSigner: false,
        isWritable: false
      }
    ].concat(accounts);
  }
  getSimpleMsgLibAccounts(payer, quoteOrSend) {
    const [msgLib] = this.simpleMsgLib.deriver.messageLib();
    let accounts;
    if (quoteOrSend === 0 /* Quote */) {
      accounts = simple_message_lib_exports.instructions.createQuoteInstructionAccounts(
        {
          endpoint: PublicKey.default,
          // useless
          messageLib: msgLib
        },
        this.simpleMsgLibProgram
      );
    } else {
      accounts = simple_message_lib_exports.instructions.createSendInstructionAccounts(
        {
          endpoint: PublicKey.default,
          // useless
          messageLib: msgLib,
          payer
        },
        this.simpleMsgLibProgram
      );
    }
    accounts.forEach((key) => {
      if (!payer.equals(key.pubkey)) {
        key.isSigner = false;
      }
    });
    return accounts.slice(1);
  }
  // 2 RPC calls
  async getUlnAccounts(connection, payer, ulnInfo, ulnDefaultSendConfigInfo, ulnSendConfigInfo, quoteOrSend, commitment) {
    invariant4(ulnInfo.accountInfo && ulnDefaultSendConfigInfo.accountInfo, "uln send library not initialized");
    const [ulnState] = uln_exports.accounts.UlnSettings.fromAccountInfo(ulnInfo.accountInfo, 0);
    const [defaultSendConfigState] = uln_exports.accounts.SendConfig.fromAccountInfo(
      ulnDefaultSendConfigInfo.accountInfo,
      0
    );
    const sendConfigState = ulnSendConfigInfo.accountInfo ? uln_exports.accounts.SendConfig.fromAccountInfo(ulnSendConfigInfo.accountInfo)[0] : null;
    let {
      executor,
      uln: { requiredDvns, optionalDvns }
    } = defaultSendConfigState;
    if (sendConfigState?.executor && !sendConfigState.executor.executor.equals(PublicKey.default)) {
      ({ executor } = sendConfigState);
    }
    if (sendConfigState && sendConfigState.uln.requiredDvns.length > 0) {
      requiredDvns = sendConfigState.uln.requiredDvns.filter((p) => {
        return !p.equals(PublicKey.default);
      });
    }
    if (sendConfigState && sendConfigState.uln.optionalDvns.length > 0) {
      optionalDvns = sendConfigState.uln.optionalDvns.filter((p) => {
        return !p.equals(PublicKey.default);
      });
    }
    const dvnsKey = requiredDvns.concat(optionalDvns);
    const [executorBuf, ...dvnBuf] = await this.getMultipleAccountsInfo(
      connection,
      [executor.executor, ...dvnsKey],
      commitment
    );
    invariant4(executorBuf, `executor:${executor.executor.toBase58()} not initialized`);
    let executorAccounts, dvnAccounts;
    {
      const executor2 = {
        config: accounts_exports4.ExecutorConfig.fromAccountInfo(executorBuf)[0],
        owner: executorBuf.owner
      };
      const dvns = dvnBuf.map((dvn, i) => {
        invariant4(dvn, `dvn:${dvnsKey[i].toBase58()} not initialized`);
        return {
          config: accounts_exports3.DvnConfig.fromAccountInfo(dvn)[0],
          owner: dvn.owner
        };
      });
      const priceFeeds = new Array();
      [executor2.config, ...dvns.map((dvn) => dvn.config)].forEach((config) => {
        priceFeeds.push(config.priceFeed);
      });
      const priceFeedInfos = await this.getMultipleAccountsInfo(connection, priceFeeds, commitment);
      priceFeedInfos.forEach((info, i) => {
        invariant4(info, `priceFeed:${priceFeeds[i].toBase58()} not initialized`);
      });
      executorAccounts = new Executor(executor2.owner).getQuoteIXAccountMetaForCPI(
        executor2.config.priceFeed,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (await this.getMultipleAccountsInfo(connection, [executor2.config.priceFeed], commitment))[0].owner,
        quoteOrSend === 1 /* Send */
      );
      dvnAccounts = (await Promise.all(
        dvns.map(async (p, i) => {
          return new DVN(p.owner).getQuoteIXAccountMetaForCPI(
            p.config.priceFeed,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            (await this.getMultipleAccountsInfo(connection, [p.config.priceFeed], commitment))[0].owner,
            quoteOrSend === 1 /* Send */
          );
        })
      )).flat();
    }
    const treasury = ulnState.treasury?.nativeReceiver;
    let accounts;
    if (quoteOrSend === 0 /* Quote */) {
      accounts = uln_exports.instructions.createQuoteInstructionAccounts(
        {
          endpoint: PublicKey.default,
          // useless
          uln: this.uln.deriver.setting()[0],
          sendConfig: ulnSendConfigInfo.accountId,
          defaultSendConfig: ulnDefaultSendConfigInfo.accountId,
          anchorRemainingAccounts: executorAccounts.concat(dvnAccounts)
        },
        this.ulnProgram
      );
    } else {
      accounts = uln_exports.instructions.createSendInstructionAccounts(
        {
          endpoint: PublicKey.default,
          // useless
          uln: this.uln.deriver.setting()[0],
          sendConfig: ulnSendConfigInfo.accountId,
          defaultSendConfig: ulnDefaultSendConfigInfo.accountId,
          payer,
          treasury,
          eventAuthority: this.uln.eventAuthorityPDA,
          program: this.uln.program,
          anchorRemainingAccounts: executorAccounts.concat(dvnAccounts)
        },
        this.ulnProgram
      );
      if (treasury) {
        const treasuryIndex = accounts.findIndex((k) => k.pubkey.toBase58() == treasury.toBase58());
        accounts[treasuryIndex].isWritable = true;
      }
    }
    accounts.forEach((key) => {
      if (!payer.equals(key.pubkey)) {
        key.isSigner = false;
      }
    });
    return accounts.slice(1);
  }
};

// idl/endpoint.json
var types = [
  {
    name: "InitDefaultReceiveLibraryParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "eid",
          type: "u32"
        },
        {
          name: "newLib",
          type: "publicKey"
        }
      ]
    }
  },
  {
    name: "InitDefaultSendLibraryParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "eid",
          type: "u32"
        },
        {
          name: "newLib",
          type: "publicKey"
        }
      ]
    }
  },
  {
    name: "InitEndpointParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "eid",
          type: "u32"
        },
        {
          name: "admin",
          type: "publicKey"
        }
      ]
    }
  },
  {
    name: "RegisterLibraryParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "libProgram",
          type: "publicKey"
        },
        {
          name: "libType",
          type: {
            defined: "MessageLibType"
          }
        }
      ]
    }
  },
  {
    name: "SetDefaultReceiveLibraryParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "eid",
          type: "u32"
        },
        {
          name: "newLib",
          type: "publicKey"
        },
        {
          name: "gracePeriod",
          type: "u64"
        }
      ]
    }
  },
  {
    name: "SetDefaultReceiveLibraryTimeoutParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "eid",
          type: "u32"
        },
        {
          name: "lib",
          type: "publicKey"
        },
        {
          name: "expiry",
          type: "u64"
        }
      ]
    }
  },
  {
    name: "SetDefaultSendLibraryParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "eid",
          type: "u32"
        },
        {
          name: "newLib",
          type: "publicKey"
        }
      ]
    }
  },
  {
    name: "SetLzTokenParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "lzToken",
          type: {
            option: "publicKey"
          }
        }
      ]
    }
  },
  {
    name: "TransferAdminParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "admin",
          type: "publicKey"
        }
      ]
    }
  },
  {
    name: "WithdrawRentParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "amount",
          type: "u64"
        }
      ]
    }
  },
  {
    name: "InitVerifyParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "srcEid",
          type: "u32"
        },
        {
          name: "sender",
          type: {
            array: [
              "u8",
              32
            ]
          }
        },
        {
          name: "receiver",
          type: "publicKey"
        },
        {
          name: "nonce",
          type: "u64"
        }
      ]
    }
  },
  {
    name: "LzComposeAlertParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "from",
          type: "publicKey"
        },
        {
          name: "to",
          type: "publicKey"
        },
        {
          name: "guid",
          type: {
            array: [
              "u8",
              32
            ]
          }
        },
        {
          name: "index",
          type: "u16"
        },
        {
          name: "computeUnits",
          type: "u64"
        },
        {
          name: "value",
          type: "u64"
        },
        {
          name: "message",
          type: "bytes"
        },
        {
          name: "extraData",
          type: "bytes"
        },
        {
          name: "reason",
          type: "bytes"
        }
      ]
    }
  },
  {
    name: "LzReceiveAlertParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "receiver",
          type: "publicKey"
        },
        {
          name: "srcEid",
          type: "u32"
        },
        {
          name: "sender",
          type: {
            array: [
              "u8",
              32
            ]
          }
        },
        {
          name: "nonce",
          type: "u64"
        },
        {
          name: "guid",
          type: {
            array: [
              "u8",
              32
            ]
          }
        },
        {
          name: "computeUnits",
          type: "u64"
        },
        {
          name: "value",
          type: "u64"
        },
        {
          name: "message",
          type: "bytes"
        },
        {
          name: "extraData",
          type: "bytes"
        },
        {
          name: "reason",
          type: "bytes"
        }
      ]
    }
  },
  {
    name: "BurnParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "receiver",
          type: "publicKey"
        },
        {
          name: "srcEid",
          type: "u32"
        },
        {
          name: "sender",
          type: {
            array: [
              "u8",
              32
            ]
          }
        },
        {
          name: "nonce",
          type: "u64"
        },
        {
          name: "payloadHash",
          type: {
            array: [
              "u8",
              32
            ]
          }
        }
      ]
    }
  },
  {
    name: "ClearParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "receiver",
          type: "publicKey"
        },
        {
          name: "srcEid",
          type: "u32"
        },
        {
          name: "sender",
          type: {
            array: [
              "u8",
              32
            ]
          }
        },
        {
          name: "nonce",
          type: "u64"
        },
        {
          name: "guid",
          type: {
            array: [
              "u8",
              32
            ]
          }
        },
        {
          name: "message",
          type: "bytes"
        }
      ]
    }
  },
  {
    name: "ClearComposeParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "from",
          type: "publicKey"
        },
        {
          name: "guid",
          type: {
            array: [
              "u8",
              32
            ]
          }
        },
        {
          name: "index",
          type: "u16"
        },
        {
          name: "message",
          type: "bytes"
        }
      ]
    }
  },
  {
    name: "InitNonceParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "localOapp",
          type: "publicKey"
        },
        {
          name: "remoteEid",
          type: "u32"
        },
        {
          name: "remoteOapp",
          type: {
            array: [
              "u8",
              32
            ]
          }
        }
      ]
    }
  },
  {
    name: "InitReceiveLibraryParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "receiver",
          type: "publicKey"
        },
        {
          name: "eid",
          type: "u32"
        }
      ]
    }
  },
  {
    name: "InitSendLibraryParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "sender",
          type: "publicKey"
        },
        {
          name: "eid",
          type: "u32"
        }
      ]
    }
  },
  {
    name: "NilifyParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "receiver",
          type: "publicKey"
        },
        {
          name: "srcEid",
          type: "u32"
        },
        {
          name: "sender",
          type: {
            array: [
              "u8",
              32
            ]
          }
        },
        {
          name: "nonce",
          type: "u64"
        },
        {
          name: "payloadHash",
          type: {
            array: [
              "u8",
              32
            ]
          }
        }
      ]
    }
  },
  {
    name: "QuoteParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "sender",
          type: "publicKey"
        },
        {
          name: "dstEid",
          type: "u32"
        },
        {
          name: "receiver",
          type: {
            array: [
              "u8",
              32
            ]
          }
        },
        {
          name: "message",
          type: "bytes"
        },
        {
          name: "options",
          type: "bytes"
        },
        {
          name: "payInLzToken",
          type: "bool"
        }
      ]
    }
  },
  {
    name: "RegisterOAppParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "delegate",
          type: "publicKey"
        }
      ]
    }
  },
  {
    name: "SendParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "dstEid",
          type: "u32"
        },
        {
          name: "receiver",
          type: {
            array: [
              "u8",
              32
            ]
          }
        },
        {
          name: "message",
          type: "bytes"
        },
        {
          name: "options",
          type: "bytes"
        },
        {
          name: "nativeFee",
          type: "u64"
        },
        {
          name: "lzTokenFee",
          type: "u64"
        }
      ]
    }
  },
  {
    name: "SendComposeParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "to",
          type: "publicKey"
        },
        {
          name: "guid",
          type: {
            array: [
              "u8",
              32
            ]
          }
        },
        {
          name: "index",
          type: "u16"
        },
        {
          name: "message",
          type: "bytes"
        }
      ]
    }
  },
  {
    name: "SetDelegateParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "delegate",
          type: "publicKey"
        }
      ]
    }
  },
  {
    name: "SetReceiveLibraryParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "receiver",
          type: "publicKey"
        },
        {
          name: "eid",
          type: "u32"
        },
        {
          name: "newLib",
          type: "publicKey"
        },
        {
          name: "gracePeriod",
          type: "u64"
        }
      ]
    }
  },
  {
    name: "SetReceiveLibraryTimeoutParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "receiver",
          type: "publicKey"
        },
        {
          name: "eid",
          type: "u32"
        },
        {
          name: "lib",
          type: "publicKey"
        },
        {
          name: "expiry",
          type: "u64"
        }
      ]
    }
  },
  {
    name: "SetSendLibraryParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "sender",
          type: "publicKey"
        },
        {
          name: "eid",
          type: "u32"
        },
        {
          name: "newLib",
          type: "publicKey"
        }
      ]
    }
  },
  {
    name: "SkipParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "receiver",
          type: "publicKey"
        },
        {
          name: "srcEid",
          type: "u32"
        },
        {
          name: "sender",
          type: {
            array: [
              "u8",
              32
            ]
          }
        },
        {
          name: "nonce",
          type: "u64"
        }
      ]
    }
  },
  {
    name: "VerifyParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "srcEid",
          type: "u32"
        },
        {
          name: "sender",
          type: {
            array: [
              "u8",
              32
            ]
          }
        },
        {
          name: "receiver",
          type: "publicKey"
        },
        {
          name: "nonce",
          type: "u64"
        },
        {
          name: "payloadHash",
          type: {
            array: [
              "u8",
              32
            ]
          }
        }
      ]
    }
  },
  {
    name: "ReceiveLibraryTimeout",
    type: {
      kind: "struct",
      fields: [
        {
          name: "messageLib",
          type: "publicKey"
        },
        {
          name: "expiry",
          type: "u64"
        }
      ]
    }
  },
  {
    name: "InitConfigParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "oapp",
          type: "publicKey"
        },
        {
          name: "eid",
          type: "u32"
        }
      ]
    }
  },
  {
    name: "MessageLibType",
    type: {
      kind: "enum",
      variants: [
        {
          name: "Send"
        },
        {
          name: "Receive"
        },
        {
          name: "SendAndReceive"
        }
      ]
    }
  },
  {
    name: "MessagingFee",
    type: {
      kind: "struct",
      fields: [
        {
          name: "nativeFee",
          type: "u64"
        },
        {
          name: "lzTokenFee",
          type: "u64"
        }
      ]
    }
  },
  {
    name: "MessagingReceipt",
    type: {
      kind: "struct",
      fields: [
        {
          name: "guid",
          type: {
            array: [
              "u8",
              32
            ]
          }
        },
        {
          name: "nonce",
          type: "u64"
        },
        {
          name: "fee",
          type: {
            defined: "MessagingFee"
          }
        }
      ]
    }
  },
  {
    name: "SetConfigParams",
    type: {
      kind: "struct",
      fields: [
        {
          name: "oapp",
          type: "publicKey"
        },
        {
          name: "eid",
          type: "u32"
        },
        {
          name: "configType",
          type: "u32"
        },
        {
          name: "config",
          type: "bytes"
        }
      ]
    }
  },
  {
    name: "AdminTransferredEvent",
    type: {
      kind: "struct",
      fields: [
        {
          name: "newAdmin",
          type: "publicKey",
          index: false
        }
      ]
    }
  },
  {
    name: "ComposeDeliveredEvent",
    type: {
      kind: "struct",
      fields: [
        {
          name: "from",
          type: "publicKey",
          index: false
        },
        {
          name: "to",
          type: "publicKey",
          index: false
        },
        {
          name: "guid",
          type: {
            array: [
              "u8",
              32
            ]
          },
          index: false
        },
        {
          name: "index",
          type: "u16",
          index: false
        }
      ]
    }
  },
  {
    name: "ComposeSentEvent",
    type: {
      kind: "struct",
      fields: [
        {
          name: "from",
          type: "publicKey",
          index: false
        },
        {
          name: "to",
          type: "publicKey",
          index: false
        },
        {
          name: "guid",
          type: {
            array: [
              "u8",
              32
            ]
          },
          index: false
        },
        {
          name: "index",
          type: "u16",
          index: false
        },
        {
          name: "message",
          type: "bytes",
          index: false
        }
      ]
    }
  },
  {
    name: "DefaultReceiveLibrarySetEvent",
    type: {
      kind: "struct",
      fields: [
        {
          name: "eid",
          type: "u32",
          index: false
        },
        {
          name: "newLib",
          type: "publicKey",
          index: false
        }
      ]
    }
  },
  {
    name: "DefaultReceiveLibraryTimeoutSetEvent",
    type: {
      kind: "struct",
      fields: [
        {
          name: "eid",
          type: "u32",
          index: false
        },
        {
          name: "timeout",
          type: {
            option: {
              defined: "ReceiveLibraryTimeout"
            }
          },
          index: false
        }
      ]
    }
  },
  {
    name: "DefaultSendLibrarySetEvent",
    type: {
      kind: "struct",
      fields: [
        {
          name: "eid",
          type: "u32",
          index: false
        },
        {
          name: "newLib",
          type: "publicKey",
          index: false
        }
      ]
    }
  },
  {
    name: "DelegateSetEvent",
    type: {
      kind: "struct",
      fields: [
        {
          name: "newDelegate",
          type: "publicKey",
          index: false
        }
      ]
    }
  },
  {
    name: "InboundNonceSkippedEvent",
    type: {
      kind: "struct",
      fields: [
        {
          name: "srcEid",
          type: "u32",
          index: false
        },
        {
          name: "sender",
          type: {
            array: [
              "u8",
              32
            ]
          },
          index: false
        },
        {
          name: "receiver",
          type: "publicKey",
          index: false
        },
        {
          name: "nonce",
          type: "u64",
          index: false
        }
      ]
    }
  },
  {
    name: "LibraryRegisteredEvent",
    type: {
      kind: "struct",
      fields: [
        {
          name: "newLib",
          type: "publicKey",
          index: false
        },
        {
          name: "newLibProgram",
          type: "publicKey",
          index: false
        }
      ]
    }
  },
  {
    name: "LzComposeAlertEvent",
    type: {
      kind: "struct",
      fields: [
        {
          name: "executor",
          type: "publicKey",
          index: false
        },
        {
          name: "from",
          type: "publicKey",
          index: false
        },
        {
          name: "to",
          type: "publicKey",
          index: false
        },
        {
          name: "guid",
          type: {
            array: [
              "u8",
              32
            ]
          },
          index: false
        },
        {
          name: "index",
          type: "u16",
          index: false
        },
        {
          name: "computeUnits",
          type: "u64",
          index: false
        },
        {
          name: "value",
          type: "u64",
          index: false
        },
        {
          name: "message",
          type: "bytes",
          index: false
        },
        {
          name: "extraData",
          type: "bytes",
          index: false
        },
        {
          name: "reason",
          type: "bytes",
          index: false
        }
      ]
    }
  },
  {
    name: "LzReceiveAlertEvent",
    type: {
      kind: "struct",
      fields: [
        {
          name: "receiver",
          type: "publicKey",
          index: false
        },
        {
          name: "executor",
          type: "publicKey",
          index: false
        },
        {
          name: "srcEid",
          type: "u32",
          index: false
        },
        {
          name: "sender",
          type: {
            array: [
              "u8",
              32
            ]
          },
          index: false
        },
        {
          name: "nonce",
          type: "u64",
          index: false
        },
        {
          name: "guid",
          type: {
            array: [
              "u8",
              32
            ]
          },
          index: false
        },
        {
          name: "computeUnits",
          type: "u64",
          index: false
        },
        {
          name: "value",
          type: "u64",
          index: false
        },
        {
          name: "message",
          type: "bytes",
          index: false
        },
        {
          name: "extraData",
          type: "bytes",
          index: false
        },
        {
          name: "reason",
          type: "bytes",
          index: false
        }
      ]
    }
  },
  {
    name: "LzTokenSetEvent",
    type: {
      kind: "struct",
      fields: [
        {
          name: "token",
          type: {
            option: "publicKey"
          },
          index: false
        }
      ]
    }
  },
  {
    name: "OAppRegisteredEvent",
    type: {
      kind: "struct",
      fields: [
        {
          name: "oapp",
          type: "publicKey",
          index: false
        },
        {
          name: "delegate",
          type: "publicKey",
          index: false
        }
      ]
    }
  },
  {
    name: "PacketBurntEvent",
    type: {
      kind: "struct",
      fields: [
        {
          name: "srcEid",
          type: "u32",
          index: false
        },
        {
          name: "sender",
          type: {
            array: [
              "u8",
              32
            ]
          },
          index: false
        },
        {
          name: "receiver",
          type: "publicKey",
          index: false
        },
        {
          name: "nonce",
          type: "u64",
          index: false
        },
        {
          name: "payloadHash",
          type: {
            array: [
              "u8",
              32
            ]
          },
          index: false
        }
      ]
    }
  },
  {
    name: "PacketDeliveredEvent",
    type: {
      kind: "struct",
      fields: [
        {
          name: "srcEid",
          type: "u32",
          index: false
        },
        {
          name: "sender",
          type: {
            array: [
              "u8",
              32
            ]
          },
          index: false
        },
        {
          name: "receiver",
          type: "publicKey",
          index: false
        },
        {
          name: "nonce",
          type: "u64",
          index: false
        }
      ]
    }
  },
  {
    name: "PacketNilifiedEvent",
    type: {
      kind: "struct",
      fields: [
        {
          name: "srcEid",
          type: "u32",
          index: false
        },
        {
          name: "sender",
          type: {
            array: [
              "u8",
              32
            ]
          },
          index: false
        },
        {
          name: "receiver",
          type: "publicKey",
          index: false
        },
        {
          name: "nonce",
          type: "u64",
          index: false
        },
        {
          name: "payloadHash",
          type: {
            array: [
              "u8",
              32
            ]
          },
          index: false
        }
      ]
    }
  },
  {
    name: "PacketSentEvent",
    type: {
      kind: "struct",
      fields: [
        {
          name: "encodedPacket",
          type: "bytes",
          index: false
        },
        {
          name: "options",
          type: "bytes",
          index: false
        },
        {
          name: "sendLibrary",
          type: "publicKey",
          index: false
        }
      ]
    }
  },
  {
    name: "PacketVerifiedEvent",
    type: {
      kind: "struct",
      fields: [
        {
          name: "srcEid",
          type: "u32",
          index: false
        },
        {
          name: "sender",
          type: {
            array: [
              "u8",
              32
            ]
          },
          index: false
        },
        {
          name: "receiver",
          type: "publicKey",
          index: false
        },
        {
          name: "nonce",
          type: "u64",
          index: false
        },
        {
          name: "payloadHash",
          type: {
            array: [
              "u8",
              32
            ]
          },
          index: false
        }
      ]
    }
  },
  {
    name: "ReceiveLibrarySetEvent",
    type: {
      kind: "struct",
      fields: [
        {
          name: "receiver",
          type: "publicKey",
          index: false
        },
        {
          name: "eid",
          type: "u32",
          index: false
        },
        {
          name: "newLib",
          type: "publicKey",
          index: false
        }
      ]
    }
  },
  {
    name: "ReceiveLibraryTimeoutSetEvent",
    type: {
      kind: "struct",
      fields: [
        {
          name: "receiver",
          type: "publicKey",
          index: false
        },
        {
          name: "eid",
          type: "u32",
          index: false
        },
        {
          name: "timeout",
          type: {
            option: {
              defined: "ReceiveLibraryTimeout"
            }
          },
          index: false
        }
      ]
    }
  },
  {
    name: "RentWithdrawnEvent",
    type: {
      kind: "struct",
      fields: [
        {
          name: "receiver",
          type: "publicKey",
          index: false
        },
        {
          name: "amount",
          type: "u64",
          index: false
        }
      ]
    }
  },
  {
    name: "SendLibrarySetEvent",
    type: {
      kind: "struct",
      fields: [
        {
          name: "sender",
          type: "publicKey",
          index: false
        },
        {
          name: "eid",
          type: "u32",
          index: false
        },
        {
          name: "newLib",
          type: "publicKey",
          index: false
        }
      ]
    }
  }
];

// src/index.ts
var IdlTypes = {
  endpoint: types
};
var SetConfigType2 = /* @__PURE__ */ ((SetConfigType3) => {
  SetConfigType3[SetConfigType3["EXECUTOR"] = 1] = "EXECUTOR";
  SetConfigType3[SetConfigType3["SEND_ULN"] = 2] = "SEND_ULN";
  SetConfigType3[SetConfigType3["RECEIVE_ULN"] = 3] = "RECEIVE_ULN";
  return SetConfigType3;
})(SetConfigType2 || {});

export { AddressType, BaseOApp, blocked_messagelib_exports as BlockedMessageLibProgram, COMPOSED_MESSAGE_HASH_SEED, CONFIRMATIONS_SEED, COUNT_SEED, DVNDeriver, dvn_exports2 as DVNProgram, DVN_CONFIG_SEED, dvn_exports as DvnProgram, ENDPOINT_SEED, ENFORCED_OPTIONS_SEED, EVENT_SEED, EXECUTOR_CONFIG_SEED, EndpointPDADeriver, endpoint_exports as EndpointProgram, EventPDADeriver, ExecutorOptionType, ExecutorPDADeriver, executor_exports as ExecutorProgram, FAUCET_URL, IdlTypes, LZ_COMPOSE_TYPES_SEED, LZ_RECEIVE_TYPES_SEED, LzComposeParamsBeet, LzReceiveAccountBeet, LzReceiveParamsBeet, MESSAGE_LIB_SEED, MINT_SEED, MSG_TYPE_OFFSET, MaxExecutorOptionTypeLength, MessageLibPDADeriver, MessageType, NONCE_SEED, OAPP_SEED, OAppBasePDADeriver, OPTIONS_SEED, PAYLOAD_HASH_SEED, PEER_SEED, PENDING_NONCE_SEED, PRICE_FEED_SEED, PriceFeedPDADeriver, pricefeed_exports as PriceFeedProgram, RECEIVE_CONFIG_SEED, RECEIVE_LIBRARY_CONFIG_SEED, REMOTE_SEED, SEND_CONFIG_SEED, SEND_LIBRARY_CONFIG_SEED, SendHelper, SetConfigType2 as SetConfigType, simple_message_lib_exports as SimpleMessageLibProgram, ULN_CONFIG_SEED, ULN_SEED, UlnPDADeriver, uln_exports as UlnProgram, WORKER_SEED, buildMessageV0, buildVersionedTransaction, closeLookupTable, createNonceAccountTX, deactivateLookupTable, deriveLzComposeTypesAccountsPDA, deriveLzReceiveTypesAccountsPDA, extractComposeDeliveredEventByTxHash, extractComposeSentEventByTxHash, extractEventFromTransactionSignature, extractReceivedPacketEventByTxHash, extractSentPacketEventByTxHash, extractVerifiedPacketEventByTxHash, extractWorkerFeePaidEventByTxHash, generateAddressLookupTable, getBlockedMessageLibProgramId, getDVNProgramId, getEndpointProgramId, getExecutorProgramId, getLzComposeAccountMeta, getLzReceiveAccounts, getPricefeedProgramId, getProgramKeypair, getSimpleMessageLibProgramId, getULNProgramId, idlTypes, instructionDiscriminator, isAccountInitialized, lzCompose, lzReceive, messageLibs, oappIDPDA, simulateTransaction, txWithAddressLookupTable, txWithNonce };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.mjs.map