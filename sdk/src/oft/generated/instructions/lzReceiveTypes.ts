/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/kinobi-so/kinobi
 */

import {
  Context,
  Pda,
  PublicKey,
  TransactionBuilder,
  defaultPublicKey,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import {
  Serializer,
  bytes,
  mapSerializer,
  struct,
} from '@metaplex-foundation/umi/serializers';
import {
  ResolvedAccount,
  ResolvedAccountsWithIndices,
  getAccountMetasAndSigners,
} from '../shared';
import {
  LzReceiveParams,
  LzReceiveParamsArgs,
  getLzReceiveParamsSerializer,
} from '../types';

// Accounts.
export type LzReceiveTypesInstructionAccounts = {
  oftStore: PublicKey | Pda;
  tokenMint: PublicKey | Pda;
};

// Data.
export type LzReceiveTypesInstructionData = {
  discriminator: Uint8Array;
  params: LzReceiveParams;
};

export type LzReceiveTypesInstructionDataArgs = { params: LzReceiveParamsArgs };

export function getLzReceiveTypesInstructionDataSerializer(): Serializer<
  LzReceiveTypesInstructionDataArgs,
  LzReceiveTypesInstructionData
> {
  return mapSerializer<
    LzReceiveTypesInstructionDataArgs,
    any,
    LzReceiveTypesInstructionData
  >(
    struct<LzReceiveTypesInstructionData>(
      [
        ['discriminator', bytes({ size: 8 })],
        ['params', getLzReceiveParamsSerializer()],
      ],
      { description: 'LzReceiveTypesInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: new Uint8Array([221, 17, 246, 159, 248, 128, 31, 96]),
    })
  ) as Serializer<
    LzReceiveTypesInstructionDataArgs,
    LzReceiveTypesInstructionData
  >;
}

// Args.
export type LzReceiveTypesInstructionArgs = LzReceiveTypesInstructionDataArgs;

// Instruction.
export function lzReceiveTypes(
  context: Pick<Context, 'programs'>,
  input: LzReceiveTypesInstructionAccounts & LzReceiveTypesInstructionArgs
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
    tokenMint: {
      index: 1,
      isWritable: false as boolean,
      value: input.tokenMint ?? null,
    },
  } satisfies ResolvedAccountsWithIndices;

  // Arguments.
  const resolvedArgs: LzReceiveTypesInstructionArgs = { ...input };

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
  const data = getLzReceiveTypesInstructionDataSerializer().serialize(
    resolvedArgs as LzReceiveTypesInstructionDataArgs
  );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
