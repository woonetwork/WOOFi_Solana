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
    FeeRateMaxExceeded, // 0x178c
    #[msg("Cap balance smaller than 2 times target balance")]
    CapBalanceSmallerThanTargetBalance, // 0x178d
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

    #[msg("Woo oracle is not feasible")]
    WooOracleNotFeasible, //0x1792

    #[msg("Src Balance < LP Deposit Amount.")]
    NotEnoughBalance,
    #[msg("Pool Mint Amount < 0 on LP Deposit")]
    NoPoolMintOutput,
    #[msg("Trying to burn too much")]
    BurnTooMuch,
    #[msg("Not enough out")]
    NotEnoughOut,
}

impl From<TryFromIntError> for ErrorCode {
    fn from(_: TryFromIntError) -> Self {
        ErrorCode::NumberCastError
    }
}
