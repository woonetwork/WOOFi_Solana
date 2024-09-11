use anchor_lang::prelude::*;

use crate::errors::ErrorCode;

pub const ADMIN_AUTH_MAX_LEN: usize = 5;

#[account]
#[derive(InitSpace)]
pub struct WooConfig {
    pub authority: Pubkey,

    pub paused: bool,

    #[max_len(ADMIN_AUTH_MAX_LEN)]
    pub admin_authority: Vec<Pubkey>,
}

impl WooConfig {
    pub fn set_paused(&mut self, paused: bool) -> Result<()> {
        self.paused = paused;

        Ok(())
    }

    pub fn set_admin_authority(&mut self, admin_authority: Vec<Pubkey>) -> Result<()> {
        require!(
            admin_authority.len() <= ADMIN_AUTH_MAX_LEN,
            ErrorCode::TooManyAuthorities
        );
        self.admin_authority = admin_authority;

        Ok(())
    }
}
