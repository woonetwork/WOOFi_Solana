/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/kinobi-so/kinobi
 */

import {
  Context,
  Option,
  OptionOrNullable,
  Pda,
  PublicKey,
  Signer,
  TransactionBuilder,
  defaultPublicKey,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import {
  Serializer,
  bytes,
  mapSerializer,
  option,
  struct,
  u32,
  u64,
} from '@metaplex-foundation/umi/serializers';
import {
  ResolvedAccount,
  ResolvedAccountsWithIndices,
  getAccountMetasAndSigners,
} from '../shared';

// Accounts.
export type SendInstructionAccounts = {
  signer: Signer;
  peer: PublicKey | Pda;
  oftStore: PublicKey | Pda;
  tokenSource: PublicKey | Pda;
  tokenEscrow: PublicKey | Pda;
  tokenMint: PublicKey | Pda;
  tokenProgram?: PublicKey | Pda;
  eventAuthority: PublicKey | Pda;
  program: PublicKey | Pda;
};

// Data.
export type SendInstructionData = {
  discriminator: Uint8Array;
  dstEid: number;
  to: Uint8Array;
  amountLd: bigint;
  minAmountLd: bigint;
  options: Uint8Array;
  composeMsg: Option<Uint8Array>;
  nativeFee: bigint;
  lzTokenFee: bigint;
};

export type SendInstructionDataArgs = {
  dstEid: number;
  to: Uint8Array;
  amountLd: number | bigint;
  minAmountLd: number | bigint;
  options: Uint8Array;
  composeMsg: OptionOrNullable<Uint8Array>;
  nativeFee: number | bigint;
  lzTokenFee: number | bigint;
};

export function getSendInstructionDataSerializer(): Serializer<
  SendInstructionDataArgs,
  SendInstructionData
> {
  return mapSerializer<SendInstructionDataArgs, any, SendInstructionData>(
    struct<SendInstructionData>(
      [
        ['discriminator', bytes({ size: 8 })],
        ['dstEid', u32()],
        ['to', bytes({ size: 32 })],
        ['amountLd', u64()],
        ['minAmountLd', u64()],
        ['options', bytes({ size: u32() })],
        ['composeMsg', option(bytes({ size: u32() }))],
        ['nativeFee', u64()],
        ['lzTokenFee', u64()],
      ],
      { description: 'SendInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: new Uint8Array([102, 251, 20, 187, 65, 75, 12, 69]),
    })
  ) as Serializer<SendInstructionDataArgs, SendInstructionData>;
}

// Args.
export type SendInstructionArgs = SendInstructionDataArgs;

// Instruction.
export function send(
  context: Pick<Context, 'programs'>,
  input: SendInstructionAccounts & SendInstructionArgs
): TransactionBuilder {
  // Program ID.
  const programId = context.programs.getPublicKey('oft', defaultPublicKey(), 'custom')

  // Accounts.
  const resolvedAccounts = {
    signer: {
      index: 0,
      isWritable: false as boolean,
      value: input.signer ?? null,
    },
    peer: { index: 1, isWritable: true as boolean, value: input.peer ?? null },
    oftStore: {
      index: 2,
      isWritable: true as boolean,
      value: input.oftStore ?? null,
    },
    tokenSource: {
      index: 3,
      isWritable: true as boolean,
      value: input.tokenSource ?? null,
    },
    tokenEscrow: {
      index: 4,
      isWritable: true as boolean,
      value: input.tokenEscrow ?? null,
    },
    tokenMint: {
      index: 5,
      isWritable: true as boolean,
      value: input.tokenMint ?? null,
    },
    tokenProgram: {
      index: 6,
      isWritable: false as boolean,
      value: input.tokenProgram ?? null,
    },
    eventAuthority: {
      index: 7,
      isWritable: false as boolean,
      value: input.eventAuthority ?? null,
    },
    program: {
      index: 8,
      isWritable: false as boolean,
      value: input.program ?? null,
    },
  } satisfies ResolvedAccountsWithIndices;

  // Arguments.
  const resolvedArgs: SendInstructionArgs = { ...input };

  // Default values.
  if (!resolvedAccounts.tokenProgram.value) {
    resolvedAccounts.tokenProgram.value = context.programs.getPublicKey(
      'splToken',
      'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
    );
    resolvedAccounts.tokenProgram.isWritable = false;
  }

  // Accounts in order.
  const orderedAccounts: ResolvedAccount[] = Object.values(
    resolvedAccounts
  ).sort((a, b) => a.index - b.index);

  // Keys and Signers.
  const [keys, signers] = getAccountMetasAndSigners(
    orderedAccounts,
    'programId',
    programId
  );

  // Data.
  const data = getSendInstructionDataSerializer().serialize(
    resolvedArgs as SendInstructionDataArgs
  );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
