use anchor_lang::prelude::*;

use crate::errors::ErrorCode;

pub const ADMIN_AUTH_MAX_LEN: usize = 5;
pub const FEE_AUTH_MAX_LEN: usize = 5;
pub const GUARDIAN_AUTH_MAX_LEN: usize = 5;
pub const PAUSE_AUTH_MAX_LEN: usize = 5;

#[account]
#[derive(InitSpace)]
pub struct WooConfig {
    pub authority: Pubkey,

    pub paused: bool,

    #[max_len(ADMIN_AUTH_MAX_LEN)]
    pub woopool_admin_authority: Vec<Pubkey>,

    #[max_len(ADMIN_AUTH_MAX_LEN)]
    pub wooracle_admin_authority: Vec<Pubkey>,

    #[max_len(FEE_AUTH_MAX_LEN)]
    pub fee_authority: Vec<Pubkey>,

    #[max_len(GUARDIAN_AUTH_MAX_LEN)]
    pub guardian_authority: Vec<Pubkey>,

    #[max_len(PAUSE_AUTH_MAX_LEN)]
    pub pause_authority: Vec<Pubkey>,
}

impl WooConfig {
    pub fn set_paused(&mut self, paused: bool) -> Result<()> {
        self.paused = paused;

        Ok(())
    }

    pub fn set_woopool_admin_authority(&mut self, admin_authority: Vec<Pubkey>) -> Result<()> {
        require!(
            admin_authority.len() <= ADMIN_AUTH_MAX_LEN,
            ErrorCode::TooManyAuthorities
        );
        self.woopool_admin_authority = admin_authority;

        Ok(())
    }

    pub fn set_wooracle_admin_authority(&mut self, admin_authority: Vec<Pubkey>) -> Result<()> {
        require!(
            admin_authority.len() <= ADMIN_AUTH_MAX_LEN,
            ErrorCode::TooManyAuthorities
        );
        self.wooracle_admin_authority = admin_authority;

        Ok(())
    }

    pub fn set_fee_authority(&mut self, fee_authority: Vec<Pubkey>) -> Result<()> {
        require!(
            fee_authority.len() <= FEE_AUTH_MAX_LEN,
            ErrorCode::TooManyAuthorities
        );
        self.fee_authority = fee_authority;

        Ok(())
    }

    pub fn set_guardian_authority(&mut self, guardian_authority: Vec<Pubkey>) -> Result<()> {
        require!(
            guardian_authority.len() <= GUARDIAN_AUTH_MAX_LEN,
            ErrorCode::TooManyAuthorities
        );
        self.guardian_authority = guardian_authority;

        Ok(())
    }

    pub fn set_pause_authority(&mut self, pause_authority: Vec<Pubkey>) -> Result<()> {
        require!(
            pause_authority.len() <= PAUSE_AUTH_MAX_LEN,
            ErrorCode::TooManyAuthorities
        );
        self.pause_authority = pause_authority;

        Ok(())
    }
}
