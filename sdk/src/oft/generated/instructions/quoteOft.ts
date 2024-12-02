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
  TransactionBuilder,
  defaultPublicKey,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import {
  Serializer,
  bool,
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
export type QuoteOftInstructionAccounts = {
  oftStore: PublicKey | Pda;
  peer: PublicKey | Pda;
  tokenMint: PublicKey | Pda;
};

// Data.
export type QuoteOftInstructionData = {
  discriminator: Uint8Array;
  dstEid: number;
  to: Uint8Array;
  amountLd: bigint;
  minAmountLd: bigint;
  options: Uint8Array;
  composeMsg: Option<Uint8Array>;
  payInLzToken: boolean;
};

export type QuoteOftInstructionDataArgs = {
  dstEid: number;
  to: Uint8Array;
  amountLd: number | bigint;
  minAmountLd: number | bigint;
  options: Uint8Array;
  composeMsg: OptionOrNullable<Uint8Array>;
  payInLzToken: boolean;
};

export function getQuoteOftInstructionDataSerializer(): Serializer<
  QuoteOftInstructionDataArgs,
  QuoteOftInstructionData
> {
  return mapSerializer<
    QuoteOftInstructionDataArgs,
    any,
    QuoteOftInstructionData
  >(
    struct<QuoteOftInstructionData>(
      [
        ['discriminator', bytes({ size: 8 })],
        ['dstEid', u32()],
        ['to', bytes({ size: 32 })],
        ['amountLd', u64()],
        ['minAmountLd', u64()],
        ['options', bytes({ size: u32() })],
        ['composeMsg', option(bytes({ size: u32() }))],
        ['payInLzToken', bool()],
      ],
      { description: 'QuoteOftInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: new Uint8Array([179, 255, 92, 202, 251, 82, 82, 118]),
    })
  ) as Serializer<QuoteOftInstructionDataArgs, QuoteOftInstructionData>;
}

// Args.
export type QuoteOftInstructionArgs = QuoteOftInstructionDataArgs;

// Instruction.
export function quoteOft(
  context: Pick<Context, 'programs'>,
  input: QuoteOftInstructionAccounts & QuoteOftInstructionArgs
): TransactionBuilder {
  // Program ID.
  const programId = context.programs.getPublicKey('oft', defaultPublicKey(), 'custom')

  // Accounts.
  const resolvedAccounts = {
    oftStore: {
      index: 0,
      isWritable: false as boolean,
      value: input.oftStore ?? null,
    },
    peer: { index: 1, isWritable: false as boolean, value: input.peer ?? null },
    tokenMint: {
      index: 2,
      isWritable: false as boolean,
      value: input.tokenMint ?? null,
    },
  } satisfies ResolvedAccountsWithIndices;

  // Arguments.
  const resolvedArgs: QuoteOftInstructionArgs = { ...input };

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
  const data = getQuoteOftInstructionDataSerializer().serialize(
    resolvedArgs as QuoteOftInstructionDataArgs
  );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}