use crate::state::{Workspace, WorkspaceAdmin, WORKSPACE_ADMIN_SEED};
use crate::ErrorCode;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(metadata_hash: String, admin_id: u32)]
pub struct UpdateWorkspace<'info> {
    #[account(mut)]
    pub workspace: Account<'info, Workspace>,

    #[account(
        constraint = workspace_admin.workspace == workspace.key() @ ErrorCode::AdminNotInWorkspace,
        constraint = workspace_admin.is_admin == true @ ErrorCode::NotAuthorized,
        seeds=[WORKSPACE_ADMIN_SEED.as_bytes(), &workspace.key().to_bytes(), admin_id.to_string().as_bytes()],
        bump=workspace_admin.bump,
        has_one = authority
    )]
    pub workspace_admin: Account<'info, WorkspaceAdmin>,
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<UpdateWorkspace>, metadata_hash: String, _admin_id: u32) -> Result<()> {
    let workspace = &mut ctx.accounts.workspace;
    workspace.metadata_hash = metadata_hash;

    Ok(())
}
