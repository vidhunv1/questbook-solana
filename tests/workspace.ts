import assert from 'assert'
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Questbook as QuestbookInterface } from "../target/types/questbook";
import Questbook from '../app/lib/questbook-solana'

describe("workspace", () => {
  const provider = anchor.Provider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.Questbook as Program<QuestbookInterface>;
  const user = provider.wallet.publicKey
  let w1: any, w2: any

  it('creates a new workspace', async () => {
    const questbook = new Questbook(program, provider)

    w1 = await questbook.rpcCreateWorkspace("https://ipfs.io/1", "a@b.com")
    const w1State = await questbook.getWorkspaceState(w1)
    assert.equal(w1State.metadataHash, "https://ipfs.io/1")
    assert.equal(w1State.authority.toString(), user.toString())
    assert.equal(w1State.adminCount, 1)
    assert.ok(w1State.createdAt.toNumber() > 62333858)

    w2 = await questbook.rpcCreateWorkspace("https://ipfs.io/2", "b@b.com")
    const w2State = await questbook.getWorkspaceState(w2)
    assert.equal(w2State.metadataHash, "https://ipfs.io/2")
    assert.equal(w2State.authority.toString(), user.toString())
    assert.equal(w2State.adminCount, 1)
    assert.ok(w1State.createdAt.toNumber() > 62333858)
  });
});
