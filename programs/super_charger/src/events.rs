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
pub struct ClaimFeeEvent {
    pub quote_token_mint: Pubkey,
    pub authority: Pubkey,
    pub claim_fee_to_account: Pubkey,
    pub claim_amount: u128,
}

#[event]
pub struct SuperChargerAdminUpdatedEvent {
    pub super_charger_config: Pubkey,
    pub authority: Pubkey,
    pub admins: Vec<Pubkey>,
}

#[event]
pub struct PauseRoleUpdatedEvent {
    pub super_charger_config: Pubkey,
    pub authority: Pubkey,
    pub pause_roles: Vec<Pubkey>,
}

#[event]
pub struct BorrowerRoleUpdatedEvent {
    pub super_charger_config: Pubkey,
    pub authority: Pubkey,
    pub borrower_roles: Vec<Pubkey>,
}

#[event]
pub struct LendingManagerRepayEvent {
    pub authority: Pubkey,
    pub token_mint: Pubkey,
    pub perf_fee: u64,
}