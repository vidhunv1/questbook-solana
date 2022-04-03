use crate::state::{
    Application, ApplicationState, Grant, APPLICATION_ADMIN_SEED, APPLICATION_SIZE,
};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct SubmitApplication<'info> {
    #[account(
        init,
        space=8 + APPLICATION_SIZE,
        seeds=[APPLICATION_ADMIN_SEED.as_bytes(), &grant.key().to_bytes(), &authority.key().to_bytes()],
        bump,
        payer=payer
    )]
    pub application: Account<'info, Application>,
    pub authority: Signer<'info>,

    pub grant: Account<'info, Grant>,

    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<SubmitApplication>, metadata_hash: String) -> Result<()> {
    let application = &mut ctx.accounts.application;
    let grant = &ctx.accounts.grant;

    application.grant = grant.key();
    application.authority = ctx.accounts.authority.key();
    application.metadata_hash = metadata_hash;
    application.state = ApplicationState::Submitted;
    application.bump = *ctx.bumps.get("application").unwrap();

    Ok(())
}
