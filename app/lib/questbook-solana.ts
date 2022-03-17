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

  async rpcUpdateWorkspace(workspace: anchor.web3.PublicKey, metadataHash: string, authority?: anchor.web3.Keypair) {
    await this.program.rpc.updateWorkspace(metadataHash, {
      accounts: {
        workspace: workspace,
        authority: authority != null ? authority.publicKey : this.provider.wallet.publicKey,
      },
      signers: [authority]
    })
  }

  async getWorkspaceState(pk: anchor.web3.PublicKey) {
    return this.program.account.workspace.fetch(pk)
  }

  async getWorkspaceAdminAccount(workspace: anchor.web3.PublicKey, adminId: number) {
    return anchor.web3.PublicKey.findProgramAddress([
      Buffer.from('workspace_admin'),
      workspace.toBuffer(),
      Buffer.from(adminId+'')
    ], this.program.programId)
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


