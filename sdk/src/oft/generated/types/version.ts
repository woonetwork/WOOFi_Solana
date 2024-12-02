/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/kinobi-so/kinobi
 */

import { Serializer, struct, u64 } from '@metaplex-foundation/umi/serializers';

export type Version = { interface: bigint; message: bigint };

export type VersionArgs = {
  interface: number | bigint;
  message: number | bigint;
};

export function getVersionSerializer(): Serializer<VersionArgs, Version> {
  return struct<Version>(
    [
      ['interface', u64()],
      ['message', u64()],
    ],
    { description: 'Version' }
  ) as Serializer<VersionArgs, Version>;
}