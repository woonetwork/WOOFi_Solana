use std::num::TryFromIntError;

use anchor_lang::prelude::*;

#[error_code]
#[derive(PartialEq)]
pub enum ErrorCode {
    #[msg("Unable to divide by zero")]
    DivideByZero, // 0x1776
    #[msg("Unable to cast number into BigInt")]
    NumberCastError, //  0x1777
    #[msg("Unable to down cast number")]
    NumberDownCastError, //  0x1778

    #[msg("Exceeded max fee rate")]
    FeeRateMaxExceeded, // 0x178a
    #[msg("Cap balance smaller than 2 times target balance")]
    CapBalanceSmallerThanTargetBalance, // 0x178b
    #[msg("Integer overflow")]
    IntegerOverflow, // 0x178c
    #[msg("Conversion failure")]
    ConversionFailure, // 0x178d
    #[msg("Mathematical operation with overflow")]
    MathOverflow, // 0x178e
    #[msg("Muldiv overflow")]
    MulDivOverflow, // 0x178f
    #[msg("Invalid div_u256 input")]
    MulDivInvalidInput, //0x1790
    #[msg("Multiplication overflow")]
    MultiplicationOverflow, //0x1791
    #[msg("Exceeded max protocol fee")]
    ProtocolFeeMaxExceeded, // 0x1792
    #[msg("Protocol fee not enough")]
    ProtocolFeeNotEnough, // 0x1793
    #[msg("Exceeded max rebate fee")]
    RebateFeeMaxExceeded, // 0x1792
    #[msg("Rebate fee not enough")]
    RebateFeeNotEnough, // 0x1793
    #[msg("Exceeded max reserve")]
    ReserveMaxExceeded, // 0x1794
    #[msg("Reserve not enough")]
    ReserveNotEnough, // 0x1795

    #[msg("Woo oracle is not feasible")]
    WooOracleNotFeasible, //0x1794
    #[msg("Woo oracle price is not valid")]
    WooOraclePriceNotValid, //0x1795
    #[msg("Woo oracle price below range MIN")]
    WooOraclePriceRangeMin, //0x1796
    #[msg("Woo oracle price exceed range MAX")]
    WooOraclePriceRangeMax, //0x1797
    #[msg("Woo oracle spread exceed 1E18")]
    WooOracleSpreadExceed, //0x1797

    #[msg("Woo pp exceed max notional value")]
    WooPoolExceedMaxNotionalValue, //0x1798
    #[msg("Woo pp exceed max gamma")]
    WooPoolExceedMaxGamma, //0x1799

    #[msg("Src Balance < LP Deposit Amount.")]
    NotEnoughBalance,
    #[msg("Pool Mint Amount < 0 on LP Deposit")]
    NoPoolMintOutput,
    #[msg("Trying to burn too much")]
    BurnTooMuch,
    #[msg("Not enough out")]
    NotEnoughOut,
    #[msg("Amount out below minimum threshold")]
    AmountOutBelowMinimum,
}

impl From<TryFromIntError> for ErrorCode {
    fn from(_: TryFromIntError) -> Self {
        ErrorCode::NumberCastError
    }
}
