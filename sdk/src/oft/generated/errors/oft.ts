/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/kinobi-so/kinobi
 */

import { Program, ProgramError } from '@metaplex-foundation/umi';

type ProgramErrorConstructor = new (
  program: Program,
  cause?: Error
) => ProgramError;
const codeToErrorMap: Map<number, ProgramErrorConstructor> = new Map();
const nameToErrorMap: Map<string, ProgramErrorConstructor> = new Map();

/** Unauthorized */
export class UnauthorizedError extends ProgramError {
  override readonly name: string = 'Unauthorized';

  readonly code: number = 0x1770; // 6000

  constructor(program: Program, cause?: Error) {
    super('', program, cause);
  }
}
codeToErrorMap.set(0x1770, UnauthorizedError);
nameToErrorMap.set('Unauthorized', UnauthorizedError);

/** InvalidSender */
export class InvalidSenderError extends ProgramError {
  override readonly name: string = 'InvalidSender';

  readonly code: number = 0x1771; // 6001

  constructor(program: Program, cause?: Error) {
    super('', program, cause);
  }
}
codeToErrorMap.set(0x1771, InvalidSenderError);
nameToErrorMap.set('InvalidSender', InvalidSenderError);

/** InvalidDecimals */
export class InvalidDecimalsError extends ProgramError {
  override readonly name: string = 'InvalidDecimals';

  readonly code: number = 0x1772; // 6002

  constructor(program: Program, cause?: Error) {
    super('', program, cause);
  }
}
codeToErrorMap.set(0x1772, InvalidDecimalsError);
nameToErrorMap.set('InvalidDecimals', InvalidDecimalsError);

/** SlippageExceeded */
export class SlippageExceededError extends ProgramError {
  override readonly name: string = 'SlippageExceeded';

  readonly code: number = 0x1773; // 6003

  constructor(program: Program, cause?: Error) {
    super('', program, cause);
  }
}
codeToErrorMap.set(0x1773, SlippageExceededError);
nameToErrorMap.set('SlippageExceeded', SlippageExceededError);

/** InvalidTokenDest */
export class InvalidTokenDestError extends ProgramError {
  override readonly name: string = 'InvalidTokenDest';

  readonly code: number = 0x1774; // 6004

  constructor(program: Program, cause?: Error) {
    super('', program, cause);
  }
}
codeToErrorMap.set(0x1774, InvalidTokenDestError);
nameToErrorMap.set('InvalidTokenDest', InvalidTokenDestError);

/** RateLimitExceeded */
export class RateLimitExceededError extends ProgramError {
  override readonly name: string = 'RateLimitExceeded';

  readonly code: number = 0x1775; // 6005

  constructor(program: Program, cause?: Error) {
    super('', program, cause);
  }
}
codeToErrorMap.set(0x1775, RateLimitExceededError);
nameToErrorMap.set('RateLimitExceeded', RateLimitExceededError);

/** InvalidFee */
export class InvalidFeeError extends ProgramError {
  override readonly name: string = 'InvalidFee';

  readonly code: number = 0x1776; // 6006

  constructor(program: Program, cause?: Error) {
    super('', program, cause);
  }
}
codeToErrorMap.set(0x1776, InvalidFeeError);
nameToErrorMap.set('InvalidFee', InvalidFeeError);

/** InvalidMintAuthority */
export class InvalidMintAuthorityError extends ProgramError {
  override readonly name: string = 'InvalidMintAuthority';

  readonly code: number = 0x1777; // 6007

  constructor(program: Program, cause?: Error) {
    super('', program, cause);
  }
}
codeToErrorMap.set(0x1777, InvalidMintAuthorityError);
nameToErrorMap.set('InvalidMintAuthority', InvalidMintAuthorityError);

/** Paused */
export class PausedError extends ProgramError {
  override readonly name: string = 'Paused';

  readonly code: number = 0x1778; // 6008

  constructor(program: Program, cause?: Error) {
    super('', program, cause);
  }
}
codeToErrorMap.set(0x1778, PausedError);
nameToErrorMap.set('Paused', PausedError);

/**
 * Attempts to resolve a custom program error from the provided error code.
 * @category Errors
 */
export function getOftErrorFromCode(
  code: number,
  program: Program,
  cause?: Error
): ProgramError | null {
  const constructor = codeToErrorMap.get(code);
  return constructor ? new constructor(program, cause) : null;
}

/**
 * Attempts to resolve a custom program error from the provided error name, i.e. 'Unauthorized'.
 * @category Errors
 */
export function getOftErrorFromName(
  name: string,
  program: Program,
  cause?: Error
): ProgramError | null {
  const constructor = nameToErrorMap.get(name);
  return constructor ? new constructor(program, cause) : null;
}
