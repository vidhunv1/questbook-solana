use crate::state::{
    Application, ApplicationState, Grant, WorkspaceAdmin, APPLICATION_ADMIN_SEED,
    WORKSPACE_ADMIN_SEED,
};
use crate::ErrorCode;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(admin_id: u32, application_authority: Pubkey)]
pub struct CompleteApplication<'info> {
    pub grant: Account<'info, Grant>,
    #[account(
        constraint = workspace_admin.workspace == grant.workspace @ ErrorCode::AdminNotInWorkspace,
        constraint = workspace_admin.is_admin == true @ ErrorCode::NotAuthorized,
        seeds=[WORKSPACE_ADMIN_SEED.as_bytes(), &grant.workspace.to_bytes(), admin_id.to_string().as_bytes()],
        bump=workspace_admin.bump,
        has_one = authority
    )]
    pub workspace_admin: Account<'info, WorkspaceAdmin>,
    pub authority: Signer<'info>,

    #[account(
        mut,
        constraint = application.grant == grant.key() @ ErrorCode::NotAuthorized,
        constraint = application.milestones_done == application.milestones_count @ ErrorCode::MilestonesNotComplete,
        seeds=[APPLICATION_ADMIN_SEED.as_bytes(), &grant.key().to_bytes(), &application_authority.to_bytes()],
        bump = application.bump,
    )]
    pub application: Account<'info, Application>,
}

pub fn handler(
    ctx: Context<CompleteApplication>,
    _admin_id: u32,
    _application_authority: Pubkey,
) -> Result<()> {
    let clock = Clock::get().unwrap();
    let application = &mut ctx.accounts.application;
    let grant = &mut ctx.accounts.grant;

    application.state = ApplicationState::Complete;

    msg!(
        "ApplicationCompleted: {},{},{},{}",
        grant.workspace,
        grant.key(),
        application.milestones_count,
        clock.unix_timestamp,
    );

    Ok(())
}
