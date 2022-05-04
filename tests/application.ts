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
    await questbook.rpcSubmitApplication("metadataHash", 2, grant1)

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
      { message: 'failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x1773'}
    )
  })

  it('reject application if all milestones are not complete', async () => {
    await assert.rejects(
      questbook.rpcCompleteApplication(grant1, w1, 0, w1Admin, provider.wallet.publicKey),
      { message: 'failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x1774'}
    )
    const applicationState = await questbook.getApplicationState(provider.wallet.publicKey, grant1)
    assert.deepEqual(applicationState.state, { rejected: {} })
  })

  it('completes an application', async () => {
    console.warn('TODO: test application completion success cycle with milestones')
  })

  it('only an admin can complete the application', async () => {
    await assert.rejects(
      questbook.rpcCompleteApplication(grant1, w1, 0, w2Admin, provider.wallet.publicKey),
      { message: '2001: A has_one constraint was violated'} 
    )
  })

  it('updates application metadatas', async () => {
    const applicationAuthority = anchor.web3.Keypair.generate()
    await questbook.rpcSubmitApplication("metadataHash", 2, grant1, applicationAuthority)
    await assert.rejects(
      questbook.rpcUpdateApplicationMetadata(grant1, "QmekxYCULpsjLRrY4smUbhuhEE1CRJNqzwKnC4pwHwCGZD", 2, applicationAuthority),
      { message: 'failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x1773'}
    )

    await questbook.rpcUpdateApplicationState(grant1, w1, 0, w1Admin, { resubmit: {} }, applicationAuthority.publicKey)
    await questbook.rpcUpdateApplicationMetadata(grant1, "QmekxYCULpsjLRrY4smUbhuhEE1CRJNqzwKnC4pwHwCGZD", 2, applicationAuthority)

    const applicationState = await questbook.getApplicationState(applicationAuthority.publicKey, grant1)
    assert.equal(applicationState.metadataHash, "QmekxYCULpsjLRrY4smUbhuhEE1CRJNqzwKnC4pwHwCGZD")
    assert.deepEqual(applicationState.state, { submitted: {} })
    assert.deepEqual(applicationState.milestoneStates[0], { submitted: {} })
    assert.deepEqual(applicationState.milestoneStates[1], { submitted: {} })
  })

  it('requests milestone approval', async () => {
    const applicationAuthority = anchor.web3.Keypair.generate()
    await questbook.rpcSubmitApplication("metadataHash", 2, grant1, applicationAuthority)
    await assert.rejects(
      questbook.rpcRequestMilestoneApproval(grant1, "QmekxYCULpsjLRrY4smUbhuhEE1CRJNqzwKnC4pwHwCGZD", 0, applicationAuthority),
      { message: 'failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x1773'}
    )

    await questbook.rpcUpdateApplicationState(grant1, w1, 0, w1Admin, { resubmit: {} }, applicationAuthority.publicKey)
    await questbook.rpcUpdateApplicationMetadata(grant1, "QmekxYCULpsjLRrY4smUbhuhEE1CRJNqzwKnC4pwHwCGZD", 2, applicationAuthority)
    await questbook.rpcUpdateApplicationState(grant1, w1, 0, w1Admin, { approved: {} }, applicationAuthority.publicKey)
    await questbook.rpcRequestMilestoneApproval(grant1, "QmekxYCULpsjLRrY4smUbhuhEE1CRJNqzwKnC4pwHwCGZD", 0, applicationAuthority)

    const applicationState = await questbook.getApplicationState(applicationAuthority.publicKey, grant1)
    assert.deepEqual(applicationState.milestoneStates[0], { requested: {} })
  })
});
