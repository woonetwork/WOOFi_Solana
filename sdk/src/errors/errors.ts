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

export type WoofiErrorCode =
  | TokenErrorCode
  | SwapErrorCode
  | MathErrorCode
  | RouteQueryErrorCode;

export class WoofiError extends Error {
  message: string;
  errorCode?: WoofiErrorCode;
  constructor(message: string, errorCode?: WoofiErrorCode, stack?: string) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.stack = stack;
  }

  public static isWoofiErrorCode(e: any, code: WoofiErrorCode): boolean {
    return e instanceof WoofiError && e.errorCode === code;
  }
}
