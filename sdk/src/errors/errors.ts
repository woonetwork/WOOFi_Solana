export enum MathErrorCode {
  MultiplicationOverflow = `MultiplicationOverflow`,
  MulDivOverflow = `MulDivOverflow`,
  MultiplicationShiftRightOverflow = `MultiplicationShiftRightOverflow`,
  DivideByZero = `DivideByZero`,
}

export enum TokenErrorCode {
  TokenMaxExceeded = `TokenMaxExceeded`,
  TokenMinSubceeded = `TokenMinSubceeded`,
}

export enum SwapErrorCode {
  InvalidDevFeePercentage = `InvalidDevFeePercentage`,
  InvalidSqrtPriceLimitDirection = `InvalidSqrtPriceLimitDirection`,
  SqrtPriceOutOfBounds = `SqrtPriceOutOfBounds`,
  ZeroTradableAmount = `ZeroTradableAmount`,
  AmountOutBelowMinimum = `AmountOutBelowMinimum`,
  AmountInAboveMaximum = `AmountInAboveMaximum`,
  TickArrayCrossingAboveMax = `TickArrayCrossingAboveMax`,
  TickArrayIndexNotInitialized = `TickArrayIndexNotInitialized`,
  TickArraySequenceInvalid = `TickArraySequenceInvalid`,
}

export enum RouteQueryErrorCode {
  RouteDoesNotExist = "RouteDoesNotExist",
  TradeAmountTooHigh = "TradeAmountTooHigh",
  ZeroInputAmount = "ZeroInputAmount",
  General = "General",
}

export type WoospmmErrorCode =
  | TokenErrorCode
  | SwapErrorCode
  | MathErrorCode
  | RouteQueryErrorCode;

export class WoospmmError extends Error {
  message: string;
  errorCode?: WoospmmErrorCode;
  constructor(message: string, errorCode?: WoospmmErrorCode, stack?: string) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.stack = stack;
  }

  public static isWoospmmErrorCode(e: any, code: WoospmmErrorCode): boolean {
    return e instanceof WoospmmError && e.errorCode === code;
  }
}
