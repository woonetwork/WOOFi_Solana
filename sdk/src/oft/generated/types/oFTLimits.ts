/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/kinobi-so/kinobi
 */

import { Serializer, struct, u64 } from '@metaplex-foundation/umi/serializers';

export type OFTLimits = { minAmountLd: bigint; maxAmountLd: bigint };

export type OFTLimitsArgs = {
  minAmountLd: number | bigint;
  maxAmountLd: number | bigint;
};

export function getOFTLimitsSerializer(): Serializer<OFTLimitsArgs, OFTLimits> {
  return struct<OFTLimits>(
    [
      ['minAmountLd', u64()],
      ['maxAmountLd', u64()],
    ],
    { description: 'OFTLimits' }
  ) as Serializer<OFTLimitsArgs, OFTLimits>;
}