use anchor_lang::prelude::{msg, AccountInfo, CpiContext, Result};

use anchor_spl::{
    token::{self, Transfer},
    token_interface::TransferChecked,
};

#[allow(clippy::too_many_arguments)]
pub fn transfer_from_vault<'info>(
    amount: u64,
    signer: &[&[&[u8]]],
    to_vault: &AccountInfo<'info>,
    from_vault: &AccountInfo<'info>,
    from_vault_authority: &AccountInfo<'info>,
    token_program: &AccountInfo<'info>,
) -> Result<()> {
    let cpi_transfer_accounts = Transfer {
        from: from_vault.clone(),
        to: to_vault.clone(),
        authority: from_vault_authority.clone(),
    };

    let cpi_ctx = CpiContext::new(token_program.clone(), cpi_transfer_accounts).with_signer(signer);
    token::transfer(cpi_ctx, amount)
}

#[allow(clippy::too_many_arguments)]
pub fn transfer_2022_from_vault<'info>(
    amount: u64,
    signer: &[&[&[u8]]],
    to_vault: &AccountInfo<'info>,
    from_vault: &AccountInfo<'info>,
    from_vault_authority: &AccountInfo<'info>,
    token_program: &AccountInfo<'info>,
    mint: &AccountInfo<'info>,
) -> Result<()> {
    let cpi_transfer_accounts = TransferChecked {
        from: from_vault.clone(),
        to: to_vault.clone(),
        authority: from_vault_authority.clone(),
        mint: mint.clone(),
    };

    let cpi_ctx = CpiContext::new(token_program.clone(), cpi_transfer_accounts).with_signer(signer);
    anchor_spl::token_2022::transfer_checked(cpi_ctx, amount, mint_decimals(mint)?)
}

pub fn transfer_from_user<'info>(
    amount: u64,
    from_ata: &AccountInfo<'info>,
    to: &AccountInfo<'info>,
    authority: &AccountInfo<'info>,
    token_program: &AccountInfo<'info>,
) -> Result<()> {
    let cpi_transfer_accounts = Transfer {
        from: from_ata.clone(),
        to: to.clone(),
        authority: authority.clone(),
    };
    let cpi_ctx = CpiContext::new(token_program.clone(), cpi_transfer_accounts);

    let result = token::transfer(cpi_ctx, amount);
    msg!("Transferred {:?}", result);
    result
}

pub fn mint_decimals(account: &AccountInfo) -> Result<u8> {
    let bytes = account.try_borrow_data()?;
    let mut amount_bytes = [0u8; 1];
    amount_bytes.copy_from_slice(&bytes[0x2C..0x2D]);
    Ok(u8::from_le_bytes(amount_bytes))
}

pub fn mint_we_token<'info>(
    token_program: AccountInfo<'info>,
    token_mint: AccountInfo<'info>,
    token_mint_authority: AccountInfo<'info>,
    user_token_ata: AccountInfo<'info>,
    authority_signer_seeds: &[&[u8]],
    mint_amount: u64,
) -> Result<()> {
    anchor_spl::token::mint_to(
        CpiContext::new_with_signer(
            token_program,
            anchor_spl::token::MintTo {
                mint: token_mint,
                to: user_token_ata,
                authority: token_mint_authority,
            },
            &[authority_signer_seeds],
        ),
        mint_amount,
    )?;

    Ok(())
}

pub fn burn_we_token<'info>(
    token_mint: AccountInfo<'info>,
    user_token_ata: AccountInfo<'info>,
    user: AccountInfo<'info>,
    token_program: AccountInfo<'info>,
    burn_amount: u64,
) -> Result<()> {
    anchor_spl::token::burn(
        CpiContext::new(
            token_program,
            anchor_spl::token::Burn {
                mint: token_mint,
                from: user_token_ata,
                authority: user,
            },
        ),
        burn_amount,
    )?;

    Ok(())
}

pub fn burn_with_signer<'info>(
    token_mint: AccountInfo<'info>,
    token_ata: AccountInfo<'info>,
    authority: AccountInfo<'info>,
    token_program: AccountInfo<'info>,
    burn_amount: u64,
    authority_signer_seeds: &[&[&[u8]]],
) -> Result<()> {
    anchor_spl::token::burn(
        CpiContext::new_with_signer(
            token_program,
            anchor_spl::token::Burn {
                mint: token_mint,
                from: token_ata,
                authority,
            },
            authority_signer_seeds,
        ),
        burn_amount,
    )?;

    Ok(())
}