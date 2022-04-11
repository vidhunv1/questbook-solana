use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, Copy, PartialEq)]
pub enum MilestoneState {
    Uninitialized,
    Submitted,
    Requested,
    Approved,
}

impl Default for MilestoneState {
    fn default() -> Self {
        MilestoneState::Uninitialized
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum ApplicationState {
    Submitted,
    Resubmit,
    Approved,
    Rejected,
    Complete,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub enum DisbursalType {
    LockedAmount,
    P2P,
}

pub const APPLICATION_SIZE: usize = 32 + 32 + 4 + 4 + 20 + 200 + 1 + 8 + 1;
pub const APPLICATION_ADMIN_SEED: &str = "application";

#[account]
pub struct Application {
    pub grant: Pubkey,
    pub authority: Pubkey,
    pub milestones_count: u32,
    pub milestones_done: u32,
    pub milestone_states: [MilestoneState; 20], // set as the max possible milestone count
    pub metadata_hash: String,
    pub state: ApplicationState,
    pub created_at: i64,
    pub bump: u8,
}
