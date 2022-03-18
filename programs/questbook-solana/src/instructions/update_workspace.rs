use crate::state::{Workspace, WorkspaceAdmin};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct UpdateWorkspace<'info> {
    #[account(mut)]
    pub workspace: Account<'info, Workspace>,

    #[account(
        constraint = workspace_admin.workspace == workspace.key(),
        has_one = authority
    )]
    pub workspace_admin: Account<'info, WorkspaceAdmin>,
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<UpdateWorkspace>, metadata_hash: String) -> Result<()> {
    let workspace = &mut ctx.accounts.workspace;
    workspace.metadata_hash = metadata_hash;

    Ok(())
}
