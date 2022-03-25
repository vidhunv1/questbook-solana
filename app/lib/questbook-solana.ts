import * as anchor from '@project-serum/anchor';
import { Questbook as QuestbookInterface } from '../../target/types/questbook';

export default class Questbook {
  program: anchor.Program<QuestbookInterface>
  provider: anchor.Provider

  constructor(program: anchor.Program<QuestbookInterface>, provider: anchor.Provider) {
    this.program = program
    this.provider = provider
    anchor.setProvider(provider)
  }

  async rpcInitProgram(authority: anchor.web3.PublicKey) {
    const [programAcc, _programBump] = await this.getProgramAccount()
    await this.program.rpc.initialize(authority, {
      accounts: {
        programInfo: programAcc,
        payer: this.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      }
    })
  }

  async rpcCreateWorkspace(metadataHash: string, adminEmail: string, authority?: anchor.web3.Keypair): Promise<anchor.web3.PublicKey> {
    const workspace = anchor.web3.Keypair.generate()
    const [workspaceAdminAcc, _w] = await this.getWorkspaceAdminAccount(workspace.publicKey, 0)
    
    await this.program.rpc.createWorkspace(metadataHash, adminEmail, {
      accounts: {
        workspace: workspace.publicKey,
        workspaceOwner: authority != null ? authority.publicKey : this.provider.wallet.publicKey,
        workspaceAdmin: workspaceAdminAcc,
        payer: this.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      },
      signers: [workspace, authority]
    })

    return workspace.publicKey
  }

  async rpcUpdateWorkspace(workspace: anchor.web3.PublicKey, metadataHash: string, adminId: number, authority?: anchor.web3.Keypair) {
    const [workspaceAdminAcc, _w] = await this.getWorkspaceAdminAccount(workspace, adminId)
    await this.program.rpc.updateWorkspace(metadataHash, adminId, {
      accounts: {
        workspace: workspace,
        workspaceAdmin: workspaceAdminAcc,
        authority: authority != null ? authority.publicKey : this.provider.wallet.publicKey,
      },
      signers: [authority]
    })
  }

  async rpcAddWorkspaceAdmin(
    workspace: anchor.web3.PublicKey,
    workspaceAdminId: number,
    workspaceAdminAuthority: anchor.web3.Keypair,
    newAdminEmail: string,
    newAdminAuthority: anchor.web3.PublicKey
  ): Promise<anchor.web3.PublicKey> {
    const workspaceState = await this.getWorkspaceState(workspace)
    const [workspaceAdminAcc, _w1] = await this.getWorkspaceAdminAccount(workspace, workspaceAdminId)
    const [newWorkspaceAdminAcc, _w2] = await this.getWorkspaceAdminAccount(workspace, workspaceState.adminIndex)
    await this.program.rpc.addWorkspaceAdmin(workspaceAdminId, newAdminEmail, newAdminAuthority, {
      accounts: {
        workspace: workspace,
        workspaceAdmin: workspaceAdminAcc,
        authority: workspaceAdminAuthority.publicKey,
        newWorkspaceAdmin: newWorkspaceAdminAcc,
        payer: this.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      },
      signers: [workspaceAdminAuthority]
    })

    return newWorkspaceAdminAcc
  }

  async rpcRemoveWorkspaceAdmin(
    workspace: anchor.web3.PublicKey,
    workspaceAdminId: number,
    workspaceAdminAuthority: anchor.web3.Keypair,
    removeAdminId: number,
  ) {
    const [workspaceAdminAcc, _w1] = await this.getWorkspaceAdminAccount(workspace, workspaceAdminId)
    const [removeWorkspaceAdminAcc, _w2] = await this.getWorkspaceAdminAccount(workspace, removeAdminId)

    await this.program.rpc.removeWorkspaceAdmin(workspaceAdminId, removeAdminId, {
      accounts: {
        workspace: workspace,
        workspaceAdmin: workspaceAdminAcc,
        authority: workspaceAdminAuthority.publicKey,
        removeWorkspaceAdmin: removeWorkspaceAdminAcc,
        payer: this.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      },
      signers: [workspaceAdminAuthority]
    })
  }

  async rpcCreateGrant(adminId: number, metadataHash: string, workspace: anchor.web3.PublicKey, workspaceAdminAuthority: anchor.web3.Keypair) {
    const grant = anchor.web3.Keypair.generate()
    const [workspaceAdminAcc, _w] = await this.getWorkspaceAdminAccount(workspace, adminId)

    await this.program.rpc.createGrant(adminId, metadataHash, {
      accounts: {
        grant: grant.publicKey,
        workspace: workspace,
        workspaceAdmin: workspaceAdminAcc,
        authority: workspaceAdminAuthority.publicKey,
        payer: this.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      },
      signers: [workspaceAdminAuthority, grant]
    })

    return grant.publicKey
  }

  async getWorkspaceState(pk: anchor.web3.PublicKey) {
    return this.program.account.workspace.fetch(pk)
  }

  async getGrantState(pk: anchor.web3.PublicKey) {
    return this.program.account.grant.fetch(pk)
  }

  async getWorkspaceAdminAccount(workspace: anchor.web3.PublicKey, adminId: number) {
    return anchor.web3.PublicKey.findProgramAddress([
      Buffer.from('workspace_admin'),
      workspace.toBuffer(),
      Buffer.from(adminId+'')
    ], this.program.programId)
  }

  async getWorkspaceAdminState(workspace: anchor.web3.PublicKey, adminId: number) {
    const [workspaceAdminAcc, _x] = await this.getWorkspaceAdminAccount(workspace, adminId)
    return this.program.account.workspaceAdmin.fetch(workspaceAdminAcc)
  }

  async getProgramState() {
    const [programAcc, _programBump] = await this.getProgramAccount()
    return this.program.account.programInfo.fetch(programAcc)
  }

  getProgramAccount() {
    return anchor.web3.PublicKey.findProgramAddress([
      Buffer.from('program_info')
    ], this.program.programId)
  }
}


