use anchor_lang::prelude::*;
use instructions::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

pub mod errors;
pub mod instructions;
pub mod state;

use errors::ErrorCode;

#[program]
pub mod questbook {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, authority: Pubkey) -> Result<()> {
        instructions::initialize::handler(ctx, authority)
    }

    pub fn create_workspace(
        ctx: Context<CreateWorkspace>,
        metadata_hash: String,
        admin_email: String,
    ) -> Result<()> {
        instructions::create_workspace::handler(ctx, metadata_hash, admin_email)
    }

    pub fn update_workspace(ctx: Context<UpdateWorkspace>, metadata_hash: String) -> Result<()> {
        instructions::update_workspace::handler(ctx, metadata_hash)
    }
}
