use anchor_lang::prelude::*;

#[event]
pub struct DepositRebateEvent {
    pub quote_token_mint: Pubkey,
    pub rebate_authority: Pubkey,
    pub from_account: Pubkey,
    pub deposit_amount: u128,
}

#[event]
pub struct WithdrawRebateEvent {
    pub quote_token_mint: Pubkey,
    pub rebate_authority: Pubkey,
    pub to_account: Pubkey,
    pub deposit_amount: u128,
}

#[event]
pub struct ClaimRebateFeeEvent {
    pub quote_token_mint: Pubkey,
    pub rebate_authority: Pubkey,
    pub to_account: Pubkey,
    pub claim_amount: u128,
}
