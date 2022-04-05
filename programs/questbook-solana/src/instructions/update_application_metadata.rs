use crate::state::{Application, ApplicationState, Grant, MilestoneState, APPLICATION_ADMIN_SEED};
use crate::ErrorCode;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct UpdateApplicationMetadata<'info> {
    pub grant: Account<'info, Grant>,

    #[account(
        mut,
        constraint = application.state == ApplicationState::Resubmit @ ErrorCode::InvalidStateTransition,
        seeds=[APPLICATION_ADMIN_SEED.as_bytes(), &grant.key().to_bytes(), &authority.key().to_bytes()],
        has_one = authority,
        bump = application.bump,
    )]
    pub application: Account<'info, Application>,
    pub authority: Signer<'info>,
}

pub fn handler(
    ctx: Context<UpdateApplicationMetadata>,
    metadata_hash: String,
    milestone_count: u32,
) -> Result<()> {
    let application = &mut ctx.accounts.application;

    for i in 0..application.milestones_count {
        application.milestone_states[i as usize] = MilestoneState::Submitted;
    }
    application.state = ApplicationState::Submitted;
    application.metadata_hash = metadata_hash;
    application.milestones_count = milestone_count;

    Ok(())
}
