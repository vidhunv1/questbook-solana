use crate::state::{
    Application, ApplicationState, Grant, WorkspaceAdmin, APPLICATION_ADMIN_SEED,
    WORKSPACE_ADMIN_SEED,
};
use crate::ErrorCode;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(admin_id: u32, application_state: ApplicationState, application_authority: Pubkey)]
pub struct UpdateApplicationState<'info> {
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
        constraint = application.application_state == ApplicationState::Submitted @ ErrorCode::InvalidStateTransition,
        seeds=[APPLICATION_ADMIN_SEED.as_bytes(), &grant.key().to_bytes(), &application_authority.to_bytes()],
        bump = application.bump,
    )]
    pub application: Account<'info, Application>,

    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<UpdateApplicationState>,
    _admin_id: u32,
    application_state: ApplicationState,
    _application_authority: Pubkey,
) -> Result<()> {
    let application = &mut ctx.accounts.application;

    match application_state {
        ApplicationState::Approved | ApplicationState::Rejected | ApplicationState::Resubmit => {
            application.application_state = application_state
        }
        _ => return Err(ErrorCode::InvalidStateTransition.into()),
    };

    Ok(())
}
