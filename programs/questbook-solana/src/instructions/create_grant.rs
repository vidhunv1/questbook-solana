use crate::state::{Grant, Workspace, WorkspaceAdmin, GRANT_SIZE, WORKSPACE_ADMIN_SEED};
use crate::ErrorCode;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(admin_id: u32)]
pub struct CreateGrant<'info> {
    #[account(
        init,
        space=8 + GRANT_SIZE,
        payer=payer
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

    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateGrant>, _admin_id: u32, metadata_hash: String) -> Result<()> {
    let grant = &mut ctx.accounts.grant;
    let clock = Clock::get().unwrap();

    grant.workspace = ctx.accounts.workspace.key();
    grant.metadata_hash = metadata_hash;
    grant.active = true;
    grant.created_at = clock.unix_timestamp;

    Ok(())
}
