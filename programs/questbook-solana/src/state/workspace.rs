use anchor_lang::prelude::*;

pub const WORKSPACE_SIZE: usize = 6 + 32 + 200 + 8 + 1;

#[account]
pub struct Workspace {
    pub authority: Pubkey,
    pub metadata_hash: String,
    pub admin_count: u32,
    pub created_at: i64,
    pub bump: u8,
}
