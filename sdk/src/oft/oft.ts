/* eslint-disable @typescript-eslint/require-await */

// 1. init native OFT from existing mint
// 2. init adapter OFT from existing mint, optionally an existing escrow
// 3. Wire a peer
// 4. Set the DVN etc. options
import { hexlify } from '@ethersproject/bytes'
import {
    ProgramRepositoryInterface,
    PublicKey,
    publicKeyBytes,
    createNullRpc,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { createDefaultProgramRepository } from '@metaplex-foundation/umi-program-repository'
import {
    fromWeb3JsPublicKey,
    toWeb3JsInstruction,
    toWeb3JsPublicKey,
} from '@metaplex-foundation/umi-web3js-adapters'
import {
    EndpointProgram,
    SimpleMessageLibProgram,
    UlnProgram,
} from '@layerzerolabs/lz-solana-sdk-v2'
import { PacketPath } from '@layerzerolabs/lz-v2-utilities'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { AccountMeta, Connection } from '@solana/web3.js'

const ENDPOINT_PROGRAM_ID = fromWeb3JsPublicKey(EndpointProgram.PROGRAM_ID)
const ULN_PROGRAM_ID = fromWeb3JsPublicKey(UlnProgram.PROGRAM_ID)

import { accounts as OFTAccounts, OftPDA, instructions, programs } from '.'
import { web3 } from '@coral-xyz/anchor'


export interface SetPeerAddressParam {
    peer: Uint8Array
    __kind: 'PeerAddress'
}

export interface SetPeerFeeBpsParam {
    feeBps: number
    __kind: 'FeeBps'
}

export interface SetPeerEnforcedOptionsParam {
    send: Uint8Array
    sendAndCall: Uint8Array
    __kind: 'EnforcedOptions'
}

export interface SetPeerRateLimitParam {
    rateLimit?: {
        refillPerSecond: bigint
        capacity: bigint
    }
    __kind: 'OutboundRateLimit' | 'InboundRateLimit'
}

export interface SetOFTConfigParams {
    __kind: 'Admin' | 'Delegate' | 'DefaultFee' | 'Paused' | 'Pauser' | 'Unpauser'
    admin?: PublicKey
    delegate?: PublicKey
    defaultFee?: number
    paused?: boolean
    pauser?: PublicKey
    unpauser?: PublicKey
}

export function createOFTProgramRepo(oftProgram: PublicKey): ProgramRepositoryInterface {
    return createDefaultProgramRepository({ rpc: createNullRpc() }, [programs.createOftProgram(oftProgram)])
}

export async function send(
    connection: Connection,
    accounts: {
        payer: PublicKey
        tokenMint: PublicKey
        tokenEscrow: PublicKey
        tokenSource: PublicKey
        peerAddr?: Uint8Array
    },
    sendParams: {
        dstEid: number
        to: Uint8Array
        amountLd: bigint
        minAmountLd: bigint
        options?: Uint8Array
        composeMsg?: Uint8Array
        nativeFee: bigint
        lzTokenFee?: bigint
    },
    programs: {
        oft: PublicKey
        endpoint?: PublicKey // default is ENDPOINT_PROGRAM(76y77prsiCMvXMjuoZ5VRrhG5qYBrUMYTE5WgHqgjEn6)
        token?: PublicKey // default is TOKEN_PROGRAM_ID(TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA)
    },
    remainingAccounts?: AccountMeta[]
): Promise<web3.TransactionInstruction> {
    const { payer, tokenMint, tokenEscrow, tokenSource } = accounts
    const { dstEid, to, amountLd, minAmountLd, options, composeMsg, nativeFee, lzTokenFee } = sendParams
    const deriver = new OftPDA(programs.oft)
    const [oftStore] = deriver.oftStore(tokenEscrow)
    const [peer] = deriver.peer(oftStore, dstEid)

    const umi = createUmi(connection)
    const rpc = umi.rpc

    if (remainingAccounts === undefined || remainingAccounts.length === 0) {
        const peerAddr: Uint8Array =
            accounts.peerAddr ??
            (await OFTAccounts.fetchPeerConfig({ rpc }, peer).then((peerInfo) => peerInfo.peerAddress))

        console.log('peerAddr', peerAddr)

        const endpoint = new EndpointProgram.Endpoint(toWeb3JsPublicKey(programs.endpoint ?? ENDPOINT_PROGRAM_ID))
        const msgLibProgram = await getSendLibraryProgram(connection, endpoint, payer, oftStore, dstEid)
        const packetPath: PacketPath = {
            srcEid: 0,
            dstEid,
            sender: hexlify(publicKeyBytes(oftStore)),
            receiver: hexlify(peerAddr),
        }
        console.log('endpoint', endpoint)
        console.log('msgLibProgram', msgLibProgram)
        console.log('packetPath', packetPath)

        // const [endpointSettings] = endpoint.deriver.setting()
        // invariant(await isAccountInitialized(connection, endpointSettings), 'endpointSettings account not initialized')
        // invariant(await isAccountInitialized(connection, peer), 'peer account not initialized')
        // invariant(await isAccountInitialized(connection, payer), 'payer account not initialized')
        // invariant(
        //     await isAccountInitialized(
        //         connection,
        //         endpoint.deriver.nonce(oftStore, dstEid, Uint8Array.from(peerAddr))[0]
        //     ),
        //     'nonce account not initialized'
        // )
        remainingAccounts = await endpoint.getSendIXAccountMetaForCPI(
            connection,
            toWeb3JsPublicKey(payer),
            packetPath,
            msgLibProgram
        )
        
        console.log('remainingAccounts', remainingAccounts)
    }

    //const [eventAuthorityPDA] = new EventPDADeriver(toWeb3JsPublicKey(programs.oft)).eventAuthority()
    const eventAuthorityPDA = new web3.PublicKey("9yVEnLRugBF5rkKa97uZUWBUwB2ZRjTgi62j4b816XNt");
    const tokenProgram: PublicKey = programs.token ?? fromWeb3JsPublicKey(TOKEN_PROGRAM_ID)
    const txBuilder = instructions.send(
        { programs: createOFTProgramRepo(programs.oft) },
        {
            signer: payer,
            peer: peer,
            oftStore: oftStore,
            tokenSource: tokenSource,
            tokenEscrow: tokenEscrow,
            tokenMint: tokenMint,
            tokenProgram: tokenProgram,
            eventAuthority: fromWeb3JsPublicKey(eventAuthorityPDA),
            program: programs.oft,
            // params
            dstEid: dstEid,
            to: to,
            amountLd,
            minAmountLd,
            options: options ?? new Uint8Array(),
            composeMsg: composeMsg ?? null,
            nativeFee,
            lzTokenFee: lzTokenFee ?? 0,
        }
    )

    // Get remaining accounts from msgLib(simple_msgLib or uln)
    const tx = txBuilder.addRemainingAccounts(
        remainingAccounts.map((acc) => {
            return {
                pubkey: fromWeb3JsPublicKey(acc.pubkey),
                isSigner: acc.isSigner,
                isWritable: acc.isWritable,
            }
        })
    ).items[0]
    return toWeb3JsInstruction(tx.instruction)
}

async function getSendLibraryProgram(
    connection: Connection,
    endpoint: EndpointProgram.Endpoint,
    payer: PublicKey,
    oftStore: PublicKey,
    remoteEid: number
): Promise<SimpleMessageLibProgram.SimpleMessageLib | UlnProgram.Uln> {
    const sendLibInfo = await endpoint.getSendLibrary(connection, toWeb3JsPublicKey(oftStore), remoteEid)
    if (!sendLibInfo?.programId) {
        throw new Error('Send library not initialized or blocked message library')
    }
    const { programId: msgLibProgram } = sendLibInfo
    const msgLibVersion = await endpoint.getMessageLibVersion(connection, toWeb3JsPublicKey(payer), msgLibProgram)
    if (msgLibVersion?.major.toString() === '0' && msgLibVersion.minor == 0 && msgLibVersion.endpointVersion == 2) {
        return new SimpleMessageLibProgram.SimpleMessageLib(msgLibProgram)
    } else if (
        msgLibVersion?.major.toString() === '3' &&
        msgLibVersion.minor == 0 &&
        msgLibVersion.endpointVersion == 2
    ) {
        return new UlnProgram.Uln(msgLibProgram)
    }
    throw new Error(`Unsupported message library version: ${JSON.stringify(msgLibVersion, null, 2)}`)
}

  /***
   * Get the account meta of the send instruction for CPI(Cross-Program Invocation )
   */
// export async function getSendIXAccountMetaForCPI(
//     payer: PublicKey, path: PacketPath, msgLibProgram: MessageLibInterface, commitmentOrConfig?: Commitment | GetAccountInfoConfig): Promise<AccountMeta[]> {
//     const { sender: sender_, dstEid, receiver: receiver_ } = path;
//     const sender = new PublicKey(arrayify(sender_));
//     const receiver = addressToBytes32(receiver_);
//     const info = await this.getSendLibrary(connection, sender, dstEid, commitmentOrConfig);
//     if (!info?.programId) {
//       throw new Error("default send library not initialized or blocked message lib");
//     }
//     const sendLibrary = info.msgLib;
//     const [sendLibraryInfo] = this.deriver.messageLibraryInfo(sendLibrary);
//     const remainingAccounts = await msgLibProgram.getSendIXAccountMetaForCPI(connection, payer, path);
//     const [defaultSendLibraryConfig] = this.deriver.defaultSendLibraryConfig(dstEid);
//     const [sendLibraryConfig] = this.deriver.sendLibraryConfig(sender, dstEid);
//     const [nonce] = this.deriver.nonce(sender, dstEid, receiver);
//     const accounts = createSendInstructionAccounts(
//       {
//         sender,
//         //signer
//         /// this account should be derived from message lib
//         sendLibraryProgram: info.programId,
//         sendLibraryConfig,
//         defaultSendLibraryConfig,
//         sendLibraryInfo,
//         endpoint: this.deriver.setting()[0],
//         program: this.program,
//         nonce,
//         eventAuthority: this.eventAuthorityPDA,
//         anchorRemainingAccounts: remainingAccounts
//       },
//       this.program
//     );
//     accounts.forEach((item) => {
//       item.isSigner = false;
//     });
//     return [
//       {
//         pubkey: this.program,
//         isSigner: false,
//         isWritable: false
//       }
//     ].concat(accounts);
//   }