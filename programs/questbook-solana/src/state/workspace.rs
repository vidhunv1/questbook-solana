use anchor_lang::prelude::*;

pub const WORKSPACE_SIZE: usize = 32 + 200 + 4 + 4 + 8 + 1;

#[account]
pub struct Workspace {
    pub authority: Pubkey,
    pub metadata_hash: String,
    pub admin_count: u32,
    pub admin_index: u32,
    pub created_at: i64,
    pub bump: u8,
}
