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


