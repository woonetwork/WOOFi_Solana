/* eslint-disable @typescript-eslint/require-await */

// 1. init native OFT from existing mint
// 2. init adapter OFT from existing mint, optionally an existing escrow
// 3. Wire a peer
// 4. Set the DVN etc. options
import {
    ProgramRepositoryInterface,
    PublicKey,
    Signer,
    WrappedInstruction,
    createNullRpc,
} from '@metaplex-foundation/umi'
import { createDefaultProgramRepository } from '@metaplex-foundation/umi-program-repository'
import {
    fromWeb3JsPublicKey,
} from '@metaplex-foundation/umi-web3js-adapters'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { AccountMeta } from '@solana/web3.js'

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
): Promise<WrappedInstruction> {
    const { payer, tokenMint, tokenEscrow, tokenSource } = accounts
    const { dstEid, to, amountLd, minAmountLd, options, composeMsg, nativeFee, lzTokenFee } = sendParams
    const deriver = new OftPDA(programs.oft)
    const [oftStore] = deriver.oftStore(tokenEscrow)
    const [peer] = deriver.peer(oftStore, dstEid)

    // if (remainingAccounts === undefined || remainingAccounts.length === 0) {
    //     const peerAddr: Uint8Array =
    //         accounts.peerAddr ??
    //         (await OFTAccounts.fetchPeerConfig({ rpc }, peer).then((peerInfo) => peerInfo.peerAddress))

    //     console.log('peerAddr', peerAddr)

    //     const endpoint = new EndpointProgram.Endpoint(toWeb3JsPublicKey(programs.endpoint ?? ENDPOINT_PROGRAM_ID))
    //     const msgLibProgram = await getSendLibraryProgram(connection, endpoint, payer.publicKey, oftStore, dstEid)
    //     const packetPath: PacketPath = {
    //         srcEid: 0,
    //         dstEid,
    //         sender: hexlify(publicKeyBytes(oftStore)),
    //         receiver: hexlify(peerAddr),
    //     }
    //     console.log('endpoint', endpoint)
    //     console.log('msgLibProgram', msgLibProgram)
    //     console.log('packetPath', packetPath)

    //     // const [endpointSettings] = endpoint.deriver.setting()
    //     // invariant(await isAccountInitialized(connection, endpointSettings), 'endpointSettings account not initialized')
    //     // invariant(await isAccountInitialized(connection, peer), 'peer account not initialized')
    //     // invariant(await isAccountInitialized(connection, payer), 'payer account not initialized')
    //     // invariant(
    //     //     await isAccountInitialized(
    //     //         connection,
    //     //         endpoint.deriver.nonce(oftStore, dstEid, Uint8Array.from(peerAddr))[0]
    //     //     ),
    //     //     'nonce account not initialized'
    //     // )
    //     remainingAccounts = await endpoint.getSendIXAccountMetaForCPI(
    //         connection,
    //         toWeb3JsPublicKey(payer.publicKey),
    //         packetPath,
    //         msgLibProgram
    //     )
        
    //     console.log('remainingAccounts', remainingAccounts)
    // }

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
    // return txBuilder.addRemainingAccounts(
    //     remainingAccounts.map((acc) => {
    //         return {
    //             pubkey: fromWeb3JsPublicKey(acc.pubkey),
    //             isSigner: acc.isSigner,
    //             isWritable: acc.isWritable,
    //         }
    //     })
    // ).items[0]
    return txBuilder.items[0]
}