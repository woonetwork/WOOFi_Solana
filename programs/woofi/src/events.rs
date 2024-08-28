use anchor_lang::prelude::*;

#[event]
pub struct DepositEvent {
    pub authority: Pubkey,

    pub woopool: Pubkey,

    pub token_vault: Pubkey,

    pub deposit_amount: u128,

    pub pool_reserve: u128,

    pub vault_balance: u128,
}

#[event]
pub struct ClaimFeeEvent {
    pub authority: Pubkey,

    pub woopool: Pubkey,

    pub token_vault: Pubkey,

    pub claim_fee_to_account: Pubkey,

    pub claim_amount: u128,
}

#[event]
pub struct ClaimRebateFeeEvent {
    pub rebate_authority: Pubkey,

    pub woopool: Pubkey,

    pub rebate_pool: Pubkey,

    pub rebate_vault: Pubkey,

    pub claim_fee_to_account: Pubkey,

    pub claim_amount: u128,
}

#[event]
pub struct SetPoolAdminEvent {
    pub woopool: Pubkey,

    pub authority: Pubkey,

    pub admin_authority: Pubkey,
}

#[event]
pub struct SetPoolFeeAdminEvent {
    pub woopool: Pubkey,

    pub authority: Pubkey,

    pub fee_authority: Pubkey,
}

#[event]
pub struct SetWooracleAdminEvent {
    pub wooracle: Pubkey,

    pub authority: Pubkey,

    pub admin_authority: Pubkey,
}

#[event]
pub struct SwapEvent {
    pub owner: Pubkey,
    pub wooracle_from: Pubkey,
    pub woopool_from: Pubkey,
    pub token_owner_account_from: Pubkey,
    pub token_vault_from: Pubkey,
    pub price_update_from: Pubkey,
    pub wooracle_to: Pubkey,
    pub woopool_to: Pubkey,
    pub token_owner_account_to: Pubkey,
    pub token_vault_to: Pubkey,
    pub price_update_to: Pubkey,
    pub from_amount: u128,
    pub min_to_amount: u128,
    pub to_amount: u128,
    pub swap_fee: u128,
    pub rebate_to: Pubkey,
}

#[event]
pub struct SwapWithRebateEvent {
    pub owner: Pubkey,
    pub wooracle_from: Pubkey,
    pub woopool_from: Pubkey,
    pub token_owner_account_from: Pubkey,
    pub token_vault_from: Pubkey,
    pub price_update_from: Pubkey,
    pub wooracle_to: Pubkey,
    pub woopool_to: Pubkey,
    pub token_owner_account_to: Pubkey,
    pub token_vault_to: Pubkey,
    pub price_update_to: Pubkey,
    pub rebate_authority: Pubkey,
    pub rebate_pool: Pubkey,
    pub rebate_vault: Pubkey,
    pub from_amount: u128,
    pub min_to_amount: u128,
    pub to_amount: u128,
    pub swap_fee: u128,
    pub swap_fee_after_rebate: u128,
    pub rebate_fee: u128,
}
