/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/kinobi-so/kinobi
 */

import { PublicKey } from '@metaplex-foundation/umi';
import {
  Serializer,
  bool,
  publicKey as publicKeySerializer,
  struct,
} from '@metaplex-foundation/umi/serializers';

/** same to anchor_lang::prelude::AccountMeta */
export type LzAccount = {
  pubkey: PublicKey;
  isSigner: boolean;
  isWritable: boolean;
};

export type LzAccountArgs = LzAccount;

export function getLzAccountSerializer(): Serializer<LzAccountArgs, LzAccount> {
  return struct<LzAccount>(
    [
      ['pubkey', publicKeySerializer()],
      ['isSigner', bool()],
      ['isWritable', bool()],
    ],
    { description: 'LzAccount' }
  ) as Serializer<LzAccountArgs, LzAccount>;
}