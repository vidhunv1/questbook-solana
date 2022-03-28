import assert from 'assert'
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Questbook as QuestbookInterface } from "../target/types/questbook";
import Questbook from '../app/lib/questbook-solana'

describe("application", () => {
  const provider = anchor.Provider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.Questbook as Program<QuestbookInterface>;
  const questbook = new Questbook(program, provider)
  let w1: any, grant1: any, application1: any
  let w1Admin = anchor.web3.Keypair.generate()

  it('creates a new application', async () => {
    w1 = await questbook.rpcCreateWorkspace("https://ipfs.io/1", "a@b.com", w1Admin)
    grant1 = await questbook.rpcCreateGrant(0, "ipfs.io/2", w1, w1Admin)
    application1 = await questbook.rpcSubmitApplication(0, "metadataHash", grant1)

    const applicationState = await questbook.getApplicationState(provider.wallet.publicKey, grant1)
    assert.equal(applicationState.grant.toString(), grant1.toString())
    assert.equal(applicationState.authority.toString(), provider.wallet.publicKey.toString())
    assert.equal(applicationState.milestone, 0)
    assert.equal(applicationState.metadataHash, "metadataHash")
    assert.equal(applicationState.applicationState, 0)
  })
});
