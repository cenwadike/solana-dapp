use anchor_lang::{prelude::*, solana_program::hash::Hash};

declare_id!("6m7zQqFucXQgGxeXDCB3Yg25TeMx41iWrAgWtbBiFXda");

#[program]
pub mod solana_dapp {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let blob_account = &mut ctx.accounts.blob_account;
        blob_account.header = Hash::default();
        blob_account.object = Vec::default();

        Ok(())
    }

    pub fn update_blob(ctx: Context<UpdateBlob>, header: Hash, object: String) -> Result<()> {
        let storage_account = &mut ctx.accounts.storage_account;
        storage_account.header = header;
        storage_account.object = object.as_bytes().to_vec();

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    // account holding the initial state of the contract
    #[account(init, payer=user, space=9000)]
    pub blob_account: Account<'info, Blob>,
    // signer info
    #[account(mut)]
    pub user: Signer<'info>,
    // account holding the contract binary
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateBlob<'info> {
    // account holding the updated state of the contract
    #[account(mut)]
    pub storage_account: Account<'info, Blob>,
}

#[account]
pub struct Blob {
    pub header: Hash,
    pub object: Vec<u8>,
}
