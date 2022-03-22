use anchor_lang::prelude::*;

pub const WORKSPACE_ADMIN_SEED: &str = "workspace_admin";

pub const WORKSPACE_ADMIN_SIZE: usize = 32 + 32 + 4 + 1 + 200 + 1;

#[account]
pub struct WorkspaceAdmin {
    pub workspace: Pubkey,
    pub authority: Pubkey,
    pub admin_id: u32,
    pub is_admin: bool,
    pub email: String,
    pub bump: u8,
}
