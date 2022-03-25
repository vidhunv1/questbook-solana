use anchor_lang::prelude::*;

pub const GRANT_SIZE: usize = 32 + 200 + 1 + 8 + 1;

#[account]
pub struct Grant {
    pub workspace: Pubkey,
    pub metadata_hash: String,
    pub active: bool,
    pub created_at: i64,
}
