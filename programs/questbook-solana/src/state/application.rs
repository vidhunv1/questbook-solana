use anchor_lang::prelude::*;

pub enum MilestoneState {
    Submitted,
    Requested,
    Approved,
}

pub enum ApplicationState {
    Submitted,
    Resubmit,
    Approved,
    Rejected,
    Complete,
}

pub enum DisbursalType {
    LockedAmount,
    P2P,
}

pub const APPLICATION_SIZE: usize = 32 + 32 + 32 + 2 + 200 + 2 + 8;
pub const APPLICATION_ADMIN_SEED: &str = "application";

#[account]
pub struct Application {
    pub grant: Pubkey,
    pub authority: Pubkey,
    pub milestone: u16,
    pub metadata_hash: String,
    pub application_state: u16,
    pub created_at: i64,
    pub bump: u8,
}
