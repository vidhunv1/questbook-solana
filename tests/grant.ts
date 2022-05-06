import assert from 'assert'
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Questbook as QuestbookInterface } from "../target/types/questbook";
import Questbook from '../app/lib/questbook-solana'

describe("grant", () => {
  const provider = anchor.Provider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.Questbook as Program<QuestbookInterface>;
  const questbook = new Questbook(program, provider)
  let w1: any, grant1: any
  let w1Admin = anchor.web3.Keypair.generate()

  it('creates a new grant in workspace', async () => {
    w1 = await questbook.rpcCreateWorkspace("QmekxYCULpsjLRrY4smUbhuhEE1CRJNqzwKnC4pwHwCGZD", "a@b.com", w1Admin)
    grant1 = await questbook.rpcCreateGrant(0, "QmRvJGRBXdwv1vYCuyupzjx2z7wS3KXYw3ZxpHNSKdqprW", w1, w1Admin)

    const grantState = await questbook.getGrantState(grant1)
    assert.equal(grantState.workspace.toString(), w1.toString())
    assert.equal(grantState.metadataHash, "QmRvJGRBXdwv1vYCuyupzjx2z7wS3KXYw3ZxpHNSKdqprW")
    assert.equal(grantState.active, true)
  })

  it('updates grant metadata hash', async () => {
    await questbook.rpcUpdateGrant(0, "QmdnVRCm5hmiMx9151A7odEeQaLuiKbFHy81A3SHeNPWYm", grant1, w1, w1Admin)

    const grantState = await questbook.getGrantState(grant1)
    assert.equal(grantState.workspace.toString(), w1.toString())
    assert.equal(grantState.metadataHash, "QmdnVRCm5hmiMx9151A7odEeQaLuiKbFHy81A3SHeNPWYm")
    assert.equal(grantState.active, true)
  })

  it('updates grant accessibility', async () => {
    await questbook.rpcUpdateGrantAccessibility(0, false, grant1, w1, w1Admin)

    const grantState = await questbook.getGrantState(grant1)
    assert.equal(grantState.workspace.toString(), w1.toString())
    assert.equal(grantState.metadataHash, "QmdnVRCm5hmiMx9151A7odEeQaLuiKbFHy81A3SHeNPWYm")
    assert.equal(grantState.active, false)
  })
});
