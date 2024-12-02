/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/kinobi-so/kinobi
 */

import { Option, OptionOrNullable } from '@metaplex-foundation/umi';
import {
  Serializer,
  option,
  struct,
  u64,
} from '@metaplex-foundation/umi/serializers';

export type RateLimitParams = {
  refillPerSecond: Option<bigint>;
  capacity: Option<bigint>;
};

export type RateLimitParamsArgs = {
  refillPerSecond: OptionOrNullable<number | bigint>;
  capacity: OptionOrNullable<number | bigint>;
};

export function getRateLimitParamsSerializer(): Serializer<
  RateLimitParamsArgs,
  RateLimitParams
> {
  return struct<RateLimitParams>(
    [
      ['refillPerSecond', option(u64())],
      ['capacity', option(u64())],
    ],
    { description: 'RateLimitParams' }
  ) as Serializer<RateLimitParamsArgs, RateLimitParams>;
}