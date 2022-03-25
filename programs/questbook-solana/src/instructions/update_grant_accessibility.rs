use crate::state::{Grant, Workspace, WorkspaceAdmin, WORKSPACE_ADMIN_SEED};
use crate::ErrorCode;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(admin_id: u32)]
pub struct UpdateGrantAccessibility<'info> {
    #[account(
        mut,
        constraint = grant.workspace == workspace.key() @ ErrorCode::NotAuthorized,
    )]
    pub grant: Account<'info, Grant>,
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

pub fn handler(
    ctx: Context<UpdateGrantAccessibility>,
    _admin_id: u32,
    can_accept_application: bool,
) -> Result<()> {
    let grant = &mut ctx.accounts.grant;
    grant.active = can_accept_application;

    Ok(())
}
