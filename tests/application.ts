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
  let w1: any, grant1: any
  let w1Admin = anchor.web3.Keypair.generate()
  let w2Admin = anchor.web3.Keypair.generate()

  it('submits a new application', async () => {
    w1 = await questbook.rpcCreateWorkspace("QmPvNnnAkrNgJBpFoNCzNFbcqkeoWs1mNuvZYQYH8rKZHY", "a@b.com", w1Admin)
    grant1 = await questbook.rpcCreateGrant(0, "QmekxYCULpsjLRrY4smUbhuhEE1CRJNqzwKnC4pwHwCGZD", w1, w1Admin)
    await questbook.rpcSubmitApplication("metadataHash", grant1)

    const applicationState = await questbook.getApplicationState(provider.wallet.publicKey, grant1)
    assert.equal(applicationState.grant.toString(), grant1.toString())
    assert.equal(applicationState.authority.toString(), provider.wallet.publicKey.toString())
    assert.equal(applicationState.metadataHash, "metadataHash")
    assert.deepEqual(applicationState.state, { submitted: {} })
  })

  it('updates application state', async () => {
    await questbook.rpcUpdateApplicationState(grant1, w1, 0, w1Admin, { rejected: {} }, provider.wallet.publicKey)
    const applicationState = await questbook.getApplicationState(provider.wallet.publicKey, grant1)
    assert.deepEqual(applicationState.state, { rejected: {} })
  })

  it('cant update to invalid state', async () => {
    await assert.rejects(
     questbook.rpcUpdateApplicationState(grant1, w1, 0, w1Admin, { approved : {} }, provider.wallet.publicKey),
      { message: '6003: Invalid state transition'}
    )
  })

  it('completes an application', async () => {
    await questbook.rpcCompleteApplication(grant1, w1, 0, w1Admin, provider.wallet.publicKey)
    const applicationState = await questbook.getApplicationState(provider.wallet.publicKey, grant1)
    assert.deepEqual(applicationState.state, { complete: {} })
  })

  it('only an admin can complete the application', async () => {
    await assert.rejects(
      questbook.rpcCompleteApplication(grant1, w1, 0, w2Admin, provider.wallet.publicKey),
      { message: '2001: A has_one constraint was violated'} 
    )
  })
});
