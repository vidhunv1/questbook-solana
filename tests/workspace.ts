import assert from 'assert'
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Questbook as QuestbookInterface } from "../target/types/questbook";
import Questbook from '../app/lib/questbook-solana'

describe("workspace", () => {
  const provider = anchor.Provider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.Questbook as Program<QuestbookInterface>;
  const questbook = new Questbook(program, provider)
  let w1: any, w2: any
  let w1Admin = anchor.web3.Keypair.generate()
  let w2Admin = anchor.web3.Keypair.generate()

  it('creates a new workspace', async () => {
    w1 = await questbook.rpcCreateWorkspace("https://ipfs.io/1", "a@b.com", w1Admin)
    const w1State = await questbook.getWorkspaceState(w1)
    assert.equal(w1State.metadataHash, "https://ipfs.io/1")
    assert.equal(w1State.authority.toString(), w1Admin.publicKey.toString())
    assert.equal(w1State.adminCount, 1)
    assert.equal(w1State.adminIndex, 1)
    assert.ok(w1State.createdAt.toNumber() > 62333858)
    const w1AdminState = await questbook.getWorkspaceAdminState(w1, 0)
    assert.equal(w1AdminState.workspace.toString(), w1.toString())
    assert.equal(w1AdminState.adminId, 0)
    assert.equal(w1AdminState.authority.toString(), w1Admin.publicKey.toString())
    assert.equal(w1AdminState.email, "a@b.com")
    assert.equal(w1AdminState.isAdmin, true)

    w2 = await questbook.rpcCreateWorkspace("https://ipfs.io/2", "b@b.com", w2Admin)
    const w2State = await questbook.getWorkspaceState(w2)
    assert.equal(w2State.metadataHash, "https://ipfs.io/2")
    assert.equal(w2State.authority.toString(), w2Admin.publicKey.toString())
    assert.equal(w2State.adminCount, 1)
    assert.equal(w2State.adminIndex, 1)
    assert.ok(w1State.createdAt.toNumber() > 62333858)
    const w2AdminState = await questbook.getWorkspaceAdminState(w2, 0)
    assert.equal(w2AdminState.workspace.toString(), w2.toString())
    assert.equal(w2AdminState.adminId, 0)
    assert.equal(w2AdminState.authority.toString(), w2Admin.publicKey.toString())
    assert.equal(w2AdminState.email, "b@b.com")
    assert.equal(w2AdminState.isAdmin, true)
  });

  it('updates workspace metadataHash', async () => {
    await questbook.rpcUpdateWorkspace(w1, "https://ipfs.io/3", 0, w1Admin)
    const w1State = await questbook.getWorkspaceState(w1)
    assert.equal(w1State.metadataHash, "https://ipfs.io/3")
    assert.equal(w1State.authority.toString(), w1Admin.publicKey.toString())
    assert.equal(w1State.adminCount, 1)
    assert.equal(w1State.adminIndex, 1)
    assert.ok(w1State.createdAt.toNumber() > 62333858)
  })

  it('only authority can update workspace metadataHash', async () => {
    const realAuthority = anchor.web3.Keypair.generate()
    const notAuthority = anchor.web3.Keypair.generate()

    const w3 = await questbook.rpcCreateWorkspace("https://ipfs.io/1", "a@b.com", realAuthority)
    await assert.rejects(
      questbook.rpcUpdateWorkspace(w3, "https://ipfs.io/3", 0, notAuthority),
      { message: '2001: A has_one constraint was violated'}
    )
  })

  it('adds new workspace admin', async () => {
    const newAdminAuthority = anchor.web3.Keypair.generate()
    await questbook.rpcAddWorkspaceAdmin(w1, 0, w1Admin, "ad@x.com", newAdminAuthority.publicKey)
    const w1State = await questbook.getWorkspaceState(w1)
    const newWorkspaceAdminState = await questbook.getWorkspaceAdminState(w1, w1State.adminIndex - 1)
    assert.equal(w1State.adminCount, 2)
    assert.equal(w1State.adminIndex, 2)

    assert.equal(newWorkspaceAdminState.workspace.toString(), w1.toString())
    assert.equal(newWorkspaceAdminState.adminId, w1State.adminIndex - 1)
    assert.equal(newWorkspaceAdminState.authority.toString(), newAdminAuthority.publicKey.toString())
    assert.equal(newWorkspaceAdminState.email, "ad@x.com")
    assert.equal(newWorkspaceAdminState.isAdmin, true)
  })
});
