use std::num::TryFromIntError;

use anchor_lang::prelude::*;

#[error_code]
#[derive(PartialEq)]
pub enum ErrorCode {
    #[msg("Too Many Authorities")]
    TooManyAuthorities, // 0x1770
    #[msg("Unable to cast number into BigInt")]
    NumberCastError, //  0x1771
    #[msg("Exceeded max rebate fee")]
    RebateFeeMaxExceeded, // 0x1772
    #[msg("Rebate fee not enough")]
    RebateFeeNotEnough, // 0x1773
    #[msg("Src Balance < LP Deposit Amount.")]
    NotEnoughBalance, //0x1774
}

impl From<TryFromIntError> for ErrorCode {
    fn from(_: TryFromIntError) -> Self {
        ErrorCode::NumberCastError
    }
}
