use crate::{constants::SUPER_CHARGER_USER_STATE_SEED, errors::ErrorCode, SuperCharger, UserState};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        space = 8 + UserState::INIT_SPACE,
        seeds = [
            SUPER_CHARGER_USER_STATE_SEED.as_bytes(),
            super_charger.key().as_ref(), 
            payer.key().as_ref()
        ],
        bump)]
    pub user_state: Account<'info, UserState>,

    #[account(mut)]
    pub super_charger: Account<'info, SuperCharger>,

    pub system_program: Program<'info, System>,
}

pub fn initialize_user_handler(ctx: Context<InitializeUser>) -> Result<()> {
    let user_state = &mut ctx.accounts.user_state;
    let super_charger = &mut ctx.accounts.super_charger;

    user_state.bump = ctx.bumps.user_state.into();
    user_state.user = ctx.accounts.payer.key();
    user_state.super_charger = super_charger.key();
    user_state.cost_share_price = 0;
    user_state.pending_withdrawal_unstake_scaled = 0;
    user_state.pending_withdrawal_unstake_ts = 0;
    user_state.last_stake_ts = 0;

    let user_id = super_charger.num_users;
    user_state.user_id = user_id;

    super_charger.num_users = super_charger
        .num_users
        .checked_add(1)
        .ok_or(ErrorCode::MathOverflow)?;

    Ok(())
}
