use crate::state::{ProgramInfo, PROGRAM_INFO_SEED, PROGRAM_VERSION};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        seeds=[PROGRAM_INFO_SEED.as_bytes()],
        bump,
        payer=payer
    )]
    pub program_info: Account<'info, ProgramInfo>,

    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<Initialize>, authority: Pubkey) -> Result<()> {
    let program_info = &mut ctx.accounts.program_info;

    program_info.bump = *ctx.bumps.get("program_info").unwrap();
    program_info.version = PROGRAM_VERSION;
    program_info.authority = authority;

    Ok(())
}

