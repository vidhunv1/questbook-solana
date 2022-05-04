use anchor_lang::prelude::*;
use instructions::*;
use state::*;

declare_id!("8TedDGUNCD8b2y8ePC2dRpGFF5Wjfd9wiQZ9qoezEwGu");

pub mod errors;
pub mod instructions;
pub mod state;

use errors::ErrorCode;

#[program]
pub mod questbook {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, authority: Pubkey) -> Result<()> {
        instructions::initialize::handler(ctx, authority)
    }

    pub fn create_workspace(
        ctx: Context<CreateWorkspace>,
        metadata_hash: String,
        admin_email: String,
    ) -> Result<()> {
        instructions::create_workspace::handler(ctx, metadata_hash, admin_email)
    }

    pub fn update_workspace(
        ctx: Context<UpdateWorkspace>,
        metadata_hash: String,
        admin_id: u32,
    ) -> Result<()> {
        instructions::update_workspace::handler(ctx, metadata_hash, admin_id)
    }

    pub fn add_workspace_admin(
        ctx: Context<AddWorkspaceAdmin>,
        workspace_admin_id: u32,
        admin_email: String,
        admin_authority: Pubkey,
    ) -> Result<()> {
        instructions::add_workspace_admin::handler(
            ctx,
            workspace_admin_id,
            admin_email,
            admin_authority,
        )
    }

    pub fn remove_workspace_admin(
        ctx: Context<RemoveWorkspaceAdmin>,
        admin_id: u32,
        remove_admin_id: u32,
    ) -> Result<()> {
        instructions::remove_workspace_admin::handler(ctx, admin_id, remove_admin_id)
    }

    pub fn create_grant(
        ctx: Context<CreateGrant>,
        admin_id: u32,
        metadata_hash: String,
    ) -> Result<()> {
        instructions::create_grant::handler(ctx, admin_id, metadata_hash)
    }

    pub fn update_grant(
        ctx: Context<UpdateGrant>,
        admin_id: u32,
        metadata_hash: String,
    ) -> Result<()> {
        instructions::update_grant::handler(ctx, admin_id, metadata_hash)
    }

    pub fn update_grant_accessibility(
        ctx: Context<UpdateGrantAccessibility>,
        admin_id: u32,
        can_accept_application: bool,
    ) -> Result<()> {
        instructions::update_grant_accessibility::handler(ctx, admin_id, can_accept_application)
    }

    pub fn submit_application(
        ctx: Context<SubmitApplication>,
        metadata_hash: String,
        milestone_count: u32,
    ) -> Result<()> {
        instructions::submit_application::handler(ctx, metadata_hash, milestone_count)
    }

    pub fn update_application_state(
        ctx: Context<UpdateApplicationState>,
        admin_id: u32,
        application_state: ApplicationState,
        application_authority: Pubkey,
    ) -> Result<()> {
        instructions::update_application_state::handler(
            ctx,
            admin_id,
            application_state,
            application_authority,
        )
    }

    pub fn complete_application(
        ctx: Context<CompleteApplication>,
        admin_id: u32,
        application_authority: Pubkey,
    ) -> Result<()> {
        instructions::complete_application::handler(ctx, admin_id, application_authority)
    }

    pub fn update_application_metadata(
        ctx: Context<UpdateApplicationMetadata>,
        metadata_hash: String,
        milestone_count: u32,
    ) -> Result<()> {
        instructions::update_application_metadata::handler(ctx, metadata_hash, milestone_count)
    }

    pub fn request_milestone_approval(
        ctx: Context<RequestMilestoneApproval>,
        milestone_id: u32,
        reason_metadata_hash: String,
    ) -> Result<()> {
        instructions::request_milestone_approval::handler(ctx, milestone_id, reason_metadata_hash)
    }
}
