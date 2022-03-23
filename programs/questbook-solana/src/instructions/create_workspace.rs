use crate::state::{
    Workspace, WorkspaceAdmin, WORKSPACE_ADMIN_SEED, WORKSPACE_ADMIN_SIZE, WORKSPACE_SIZE,
};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct CreateWorkspace<'info> {
    #[account(
        init,
        space=8 + WORKSPACE_SIZE,
        payer=payer
    )]
    pub workspace: Account<'info, Workspace>,
    pub workspace_owner: Signer<'info>,
    #[account(
        init,
        space=8 + WORKSPACE_ADMIN_SIZE,
        seeds=[WORKSPACE_ADMIN_SEED.as_bytes(), &workspace.key().to_bytes(), "0".as_bytes()],
        bump,
        payer=payer
    )]
    pub workspace_admin: Account<'info, WorkspaceAdmin>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CreateWorkspace>,
    metadata_hash: String,
    admin_email: String,
) -> Result<()> {
    let workspace = &mut ctx.accounts.workspace;
    let workspace_admin = &mut ctx.accounts.workspace_admin;
    let clock = Clock::get().unwrap();

    workspace.authority = ctx.accounts.workspace_owner.key();
    workspace.metadata_hash = metadata_hash;
    workspace.admin_count = 1;
    workspace.admin_index = 1;
    workspace.created_at = clock.unix_timestamp;

    workspace_admin.workspace = ctx.accounts.workspace.key();
    workspace_admin.authority = ctx.accounts.workspace_owner.key();
    workspace_admin.email = admin_email.clone();
    workspace_admin.is_admin = true;
    workspace_admin.bump = *ctx.bumps.get("workspace_admin").unwrap();

    msg!(
        "WorkspaceCreated: {},{},{},{}",
        workspace_admin.workspace,
        workspace_admin.authority,
        workspace_admin.email,
        clock.unix_timestamp,
    );

    Ok(())
}
