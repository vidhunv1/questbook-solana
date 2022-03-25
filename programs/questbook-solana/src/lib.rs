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

    pub fn update_workspace(
        ctx: Context<UpdateWorkspace>,
        metadata_hash: String,
        admin_id: u32,
    ) -> Result<()> {
        instructions::update_workspace::handler(ctx, metadata_hash, admin_id)
    }

    pub fn add_workspace_admin(
        ctx: Context<AddWorkspaceAdmin>,
        workspace_admin_id: u32,
        admin_email: String,
        admin_authority: Pubkey,
    ) -> Result<()> {
        instructions::add_workspace_admin::handler(
            ctx,
            workspace_admin_id,
            admin_email,
            admin_authority,
        )
    }

    pub fn remove_workspace_admin(
        ctx: Context<RemoveWorkspaceAdmin>,
        admin_id: u32,
        remove_admin_id: u32,
    ) -> Result<()> {
        instructions::remove_workspace_admin::handler(ctx, admin_id, remove_admin_id)
    }

    pub fn create_grant(
        ctx: Context<CreateGrant>,
        admin_id: u32,
        metadata_hash: String,
    ) -> Result<()> {
        instructions::create_grant::handler(ctx, admin_id, metadata_hash)
    }
}
