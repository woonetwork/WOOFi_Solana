use anchor_lang::prelude::*;

#[event]
pub struct DepositEvent {
    pub token_mint: Pubkey,
    pub authority: Pubkey,
    pub deposit_amount: u128,
}

#[event]
pub struct WithdrawEvent {
    pub token_mint: Pubkey,
    pub authority: Pubkey,
    pub withdraw_amount: u128,
}

#[event]
pub struct ClaimFeeEvent {
    pub quote_token_mint: Pubkey,
    pub authority: Pubkey,
    pub claim_fee_to_account: Pubkey,
    pub claim_amount: u128,
}

#[event]
pub struct ClaimRebateFeeEvent {
    pub quote_token_mint: Pubkey,
    pub rebate_authority: Pubkey,
    pub claim_fee_to_account: Pubkey,
    pub claim_amount: u128,
}

#[event]
pub struct AdminUpdatedEvent {
    pub woopool: Pubkey,
    pub authority: Pubkey,
    pub admin_authority: Pubkey,
}

#[event]
pub struct FeeAdminUpdatedEvent {
    pub woopool: Pubkey,
    pub authority: Pubkey,
    pub fee_authority: Pubkey,
}

#[event]
pub struct PauseRoleUpdatedEvent {
    pub woopool: Pubkey,
    pub authority: Pubkey,
    pub pause_authority: Vec<Pubkey>,
}

#[event]
pub struct WooracleAdminUpdatedEvent {
    pub wooracle: Pubkey,
    pub authority: Pubkey,
    pub admin_authority: Pubkey,
}

#[event]
pub struct SwapEvent {
    pub sender: Pubkey,
    pub from_token_mint: Pubkey,
    pub to_token_mint: Pubkey,
    pub from_amount: u128,
    pub to_amount: u128,
    pub from_account: Pubkey,
    pub to_account: Pubkey,
    pub rebate_to: Pubkey,
    pub swap_vol: u128,
    pub swap_fee: u128,
}
