import assert from 'assert'
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Questbook as QuestbookInterface } from "../target/types/questbook";
import Questbook from '../app/lib/questbook-solana'

describe("initialize", () => {
  const provider = anchor.Provider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.Questbook as Program<QuestbookInterface>;
  const user = provider.wallet.publicKey

  it('is initialized', async () => {
    const questbook = new Questbook(program, provider)
    await questbook.rpcInitProgram(user)

    const [_programAcc, programBump] = await questbook.getProgramAccount()
    const programState = await questbook.getProgramState()
    assert.equal(programState.bump, programBump)
    assert.equal(programState.version, 0)
    assert.equal(programState.authority.toString(), user.toString())
  });
});
