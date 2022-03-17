use crate::state::Workspace;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct UpdateWorkspace<'info> {
    #[account(mut, has_one = authority)]
    pub workspace: Account<'info, Workspace>,
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<UpdateWorkspace>, metadata_hash: String) -> Result<()> {
    let workspace = &mut ctx.accounts.workspace;
    workspace.metadata_hash = metadata_hash;

    Ok(())
}
