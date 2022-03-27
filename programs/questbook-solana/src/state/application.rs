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

#[account]
pub struct Grant {
    pub workspace: Pubkey,
    pub grant: Pubkey,
    pub authority: Pubkey,
    pub milestone: u16,
    pub metadata_hash: String,
    pub application_state: u16,

    pub created_at: i64,
}
