use crate::state::{Workspace, WorkspaceAdmin, WORKSPACE_ADMIN_SEED, WORKSPACE_ADMIN_SIZE};
use crate::ErrorCode;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(workspace_admin_id: u32)]
pub struct AddWorkspaceAdmin<'info> {
    #[account(mut, constraint = workspace.admin_count < 1000)]
    pub workspace: Account<'info, Workspace>,

    #[account(
        constraint = workspace_admin.workspace == workspace.key() @ ErrorCode::AdminNotInWorkspace,
        constraint = workspace_admin.is_admin == true @ ErrorCode::NotAuthorized,
        seeds=[WORKSPACE_ADMIN_SEED.as_bytes(), &workspace.key().to_bytes(), workspace_admin_id.to_string().as_bytes()],
        bump=workspace_admin.bump,
        has_one = authority
    )]
    pub workspace_admin: Account<'info, WorkspaceAdmin>,
    pub authority: Signer<'info>,

    #[account(
        init_if_needed,
        space=8 + WORKSPACE_ADMIN_SIZE,
        seeds=[WORKSPACE_ADMIN_SEED.as_bytes(), &workspace.key().to_bytes(), workspace.admin_index.to_string().as_bytes()],
        bump,
        payer=payer
    )]
    pub new_workspace_admin: Account<'info, WorkspaceAdmin>,

    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<AddWorkspaceAdmin>,
    _workspace_admin_id: u32,
    admin_email: String,
    admin_authority: Pubkey,
) -> Result<()> {
    let workspace = &mut ctx.accounts.workspace;
    let new_workspace_admin = &mut ctx.accounts.new_workspace_admin;
    let clock = Clock::get().unwrap();

    new_workspace_admin.admin_id = workspace.admin_index;
    new_workspace_admin.workspace = workspace.key();
    new_workspace_admin.authority = admin_authority;
    new_workspace_admin.email = admin_email;
    new_workspace_admin.is_admin = true;
    new_workspace_admin.bump = *ctx.bumps.get("new_workspace_admin").unwrap();

    workspace.admin_count = workspace.admin_count + 1;
    workspace.admin_index = workspace.admin_index + 1;

    msg!(
        "WorkspaceAdminAdded: {},{},{},{},{}",
        new_workspace_admin.workspace,
        new_workspace_admin.admin_id,
        new_workspace_admin.authority,
        new_workspace_admin.email,
        clock.unix_timestamp,
    );

    Ok(())
}
