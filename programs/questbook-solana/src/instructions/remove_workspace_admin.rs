use crate::state::{Workspace, WorkspaceAdmin, WORKSPACE_ADMIN_SEED};
use crate::ErrorCode;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(admin_id: u32, remove_admin_id: u32)]
pub struct RemoveWorkspaceAdmin<'info> {
    #[account(
        mut,
        constraint = workspace.admin_count > 1 @ ErrorCode::NotSupported // workspace needs atleast one admin
    )]
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

    #[account(
        mut,
        seeds=[WORKSPACE_ADMIN_SEED.as_bytes(), &workspace.key().to_bytes(), remove_admin_id.to_string().as_bytes()],
        bump=remove_workspace_admin.bump
    )]
    pub remove_workspace_admin: Account<'info, WorkspaceAdmin>,

    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<RemoveWorkspaceAdmin>,
    _admin_id: u32,
    _remove_admin_id: u32,
) -> Result<()> {
    let workspace = &mut ctx.accounts.workspace;
    let remove_workspace_admin = &mut ctx.accounts.remove_workspace_admin;
    let clock = Clock::get().unwrap();

    workspace.admin_count = workspace.admin_count - 1;

    remove_workspace_admin.is_admin = false;

    msg!(
        "WorkspaceAdminRemoved: {},{},{},{}",
        remove_workspace_admin.workspace,
        remove_workspace_admin.admin_id,
        remove_workspace_admin.authority,
        clock.unix_timestamp,
    );

    Ok(())
}
