use std::num::TryFromIntError;

use anchor_lang::prelude::*;

#[error_code]
#[derive(PartialEq)]
pub enum ErrorCode {
    #[msg("Unable to divide by zero")]
    DivideByZero, // 0x1770
    #[msg("Unable to cast number into BigInt")]
    NumberCastError, //  0x1771
    #[msg("Unable to down cast number")]
    NumberDownCastError, //  0x1772

    #[msg("Exceeded max fee rate")]
    FeeRateMaxExceeded, // 0x1773
    #[msg("Cap balance smaller than 2 times target balance")]
    CapBalanceSmallerThanTargetBalance, // 0x1774
    #[msg("Integer overflow")]
    IntegerOverflow, // 0x1775
    #[msg("Conversion failure")]
    ConversionFailure, // 0x1776
    #[msg("Mathematical operation with overflow")]
    MathOverflow, // 0x1777
    #[msg("Muldiv overflow")]
    MulDivOverflow, // 0x1778
    #[msg("Invalid div_u256 input")]
    MulDivInvalidInput, //0x1779
    #[msg("Multiplication overflow")]
    MultiplicationOverflow, //0x177a
    #[msg("Exceeded max protocol fee")]
    ProtocolFeeMaxExceeded, // 0x177b
    #[msg("Protocol fee not enough")]
    ProtocolFeeNotEnough, // 0x177c
    #[msg("Exceeded max rebate fee")]
    RebateFeeMaxExceeded, // 0x177d
    #[msg("Rebate fee not enough")]
    RebateFeeNotEnough, // 0x177e
    #[msg("Exceeded max reserve")]
    ReserveMaxExceeded, // 0x177f
    #[msg("Reserve not enough")]
    ReserveNotEnough, // 0x1780

    #[msg("Woo oracle is not feasible")]
    WooOracleNotFeasible, //0x1781
    #[msg("Woo oracle price is not valid")]
    WooOraclePriceNotValid, //0x1782
    #[msg("Woo oracle price below range MIN")]
    WooOraclePriceRangeMin, //0x1783
    #[msg("Woo oracle price exceed range MAX")]
    WooOraclePriceRangeMax, //0x1784
    #[msg("Woo oracle spread exceed 1E18")]
    WooOracleSpreadExceed, //0x1785

    #[msg("Woo pp exceed max notional value")]
    WooPoolExceedMaxNotionalValue, //0x1786
    #[msg("Woo pp exceed max gamma")]
    WooPoolExceedMaxGamma, //0x1787

    #[msg("Src Balance < LP Deposit Amount.")]
    NotEnoughBalance, //0x1788
    #[msg("Pool Mint Amount < 0 on LP Deposit")]
    NoPoolMintOutput, //0x1789
    #[msg("Trying to burn too much")]
    BurnTooMuch, //0x178a
    #[msg("Not enough out")]
    NotEnoughOut, //0x178b
    #[msg("Amount out below minimum threshold")]
    AmountOutBelowMinimum, //0x178c
}

impl From<TryFromIntError> for ErrorCode {
    fn from(_: TryFromIntError) -> Self {
        ErrorCode::NumberCastError
    }
}
