use std::num::TryFromIntError;

use anchor_lang::prelude::*;

#[error_code]
#[derive(PartialEq)]
pub enum ErrorCode {
    #[msg("Cannot stake 0 amount")]
    StakeZero,
    #[msg("Cannot unstake 0 amount")]
    UnstakeZero,
    #[msg("Nothing to unstake")]
    NothingToUnstake,
    #[msg("Too Many Authorities")]
    TooManyAuthorities,
    #[msg("Unable to cast number into BigInt")]
    NumberCastError,
    #[msg("Unable to divide by zero")]
    DivideByZero,
    #[msg("Mathematical operation with overflow")]
    MathOverflow,
    #[msg("Muldiv overflow")]
    MulDivOverflow,
    #[msg("User ata and reserve token have different mints")]
    UserAtaReserveTokenMintMissmatch,
    #[msg("Token mint and reserve token have different mints")]
    ReserveTokenMintMissmatch,
    #[msg("Src Balance < LP Deposit Amount.")]
    NotEnoughBalance,
    #[msg("Not enough out")]
    NotEnoughOut,

}

impl From<TryFromIntError> for ErrorCode {
    fn from(_: TryFromIntError) -> Self {
        ErrorCode::NumberCastError
    }
}
