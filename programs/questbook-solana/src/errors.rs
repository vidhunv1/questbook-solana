use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Action not supported")]
    NotSupported,
    #[msg("Admin not in worksapce")]
    AdminNotInWorkspace,
}
