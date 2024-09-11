use std::num::TryFromIntError;

use anchor_lang::prelude::*;

#[error_code]
#[derive(PartialEq)]
pub enum ErrorCode {
    #[msg("Unable to cast number into BigInt")]
    NumberCastError, //  0x1771
    #[msg("Rebate pool and vault not match")]
    RebateVaultNotMatch, // 0x177d
    #[msg("Pending rebate not match with vault amount")]
    PendingRebateNotMatch, // 0x177d
    #[msg("Exceeded max rebate fee")]
    RebateFeeMaxExceeded, // 0x177d
    #[msg("Rebate fee not enough")]
    RebateFeeNotEnough, // 0x177e
    #[msg("Src Balance < LP Deposit Amount.")]
    NotEnoughBalance, //0x178b
}

impl From<TryFromIntError> for ErrorCode {
    fn from(_: TryFromIntError) -> Self {
        ErrorCode::NumberCastError
    }
}
