use anchor_lang::prelude::*;

pub const PROGRAM_VERSION: u16 = 0;
pub const PROGRAM_INFO_SEED: &str = "program_info";

#[account]
#[derive(Default)]
pub struct ProgramInfo {
    pub version: u16,

    pub authority: Pubkey,

    pub bump: u8,
}
