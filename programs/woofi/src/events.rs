use anchor_lang::prelude::*;

#[event]
pub struct PauseEvent {
    pub wooconfig: Pubkey,
    pub authority: Pubkey,
}

#[event]
pub struct UnPauseEvent {
    pub wooconfig: Pubkey,
    pub authority: Pubkey,
}


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
pub struct RepayEvent {
    pub token_mint: Pubkey,
    pub authority: Pubkey,
    pub repay_amount: u128,
}

#[event]
pub struct ClaimFeeEvent {
    pub quote_token_mint: Pubkey,
    pub authority: Pubkey,
    pub claim_fee_to_account: Pubkey,
    pub claim_amount: u128,
}

#[event]
pub struct WooPoolAdminUpdatedEvent {
    pub wooconfig: Pubkey,
    pub authority: Pubkey,
    pub admins: Vec<Pubkey>,
}

#[event]
pub struct FeeAdminUpdatedEvent {
    pub wooconfig: Pubkey,
    pub authority: Pubkey,
    pub fee_admins: Vec<Pubkey>,
}

#[event]
pub struct PauseRoleUpdatedEvent {
    pub wooconfig: Pubkey,
    pub authority: Pubkey,
    pub pause_roles: Vec<Pubkey>,
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
