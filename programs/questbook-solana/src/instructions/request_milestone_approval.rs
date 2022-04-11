use crate::state::{Application, ApplicationState, Grant, MilestoneState, APPLICATION_ADMIN_SEED};
use crate::ErrorCode;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(milestone_id: u32)]
pub struct RequestMilestoneApproval<'info> {
    pub grant: Account<'info, Grant>,

    #[account(
        mut,
        constraint = application.state == ApplicationState::Approved @ ErrorCode::InvalidStateTransition,
        constraint = milestone_id < application.milestones_count,
        constraint = application.milestone_states[milestone_id as usize] == MilestoneState::Submitted @ ErrorCode::NotSupported,
        seeds=[APPLICATION_ADMIN_SEED.as_bytes(), &grant.key().to_bytes(), &authority.key().to_bytes()],
        has_one = authority,
        bump = application.bump,
    )]
    pub application: Account<'info, Application>,
    pub authority: Signer<'info>,
}

pub fn handler(
    ctx: Context<RequestMilestoneApproval>,
    milestone_id: u32,
    _reason_metadata_hash: String,
) -> Result<()> {
    let application = &mut ctx.accounts.application;

    application.milestone_states[milestone_id as usize] = MilestoneState::Requested;

    Ok(())
}
