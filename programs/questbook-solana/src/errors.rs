use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Action not supported")]
    NotSupported,
    #[msg("Admin not in worksapce")]
    AdminNotInWorkspace,
    #[msg("Not authorized")]
    NotAuthorized,
    #[msg("Invalid state transition")]
    InvalidStateTransition,
    #[msg("Application milestones not complete")]
    MilestonesNotComplete,
}
