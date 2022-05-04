import React, { FormEvent, useState } from "react";
import useSolanaProgram from "./useSolanaContract";
import * as anchor from "@project-serum/anchor";

const getWorkspaceAdminAccount = async (
  workspace: anchor.web3.PublicKey,
  adminId: number,
  programId: anchor.web3.PublicKey
) => {
  return anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from("workspace_admin"),
      workspace.toBuffer(),
      Buffer.from(adminId + ""),
    ],
    programId
  );
};

const getWorkspaceState = (
  program: anchor.Program,
  pk: anchor.web3.PublicKey
) => {
  return program.account.workspace.fetch(pk);
};

const AddWorkspaceAdmin = () => {
  const program = useSolanaProgram();
  const [workspacePubKey, setWorkspacePubKey] = useState("");
  const [workspaceAdminId, setWorkspaceAdminId] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminAuthority, setNewAdminAuthority] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const workspace = new anchor.web3.PublicKey(workspacePubKey);
    const workspaceState = await getWorkspaceState(program, workspace);
    const [workspaceAdminAcc, _w1] = await getWorkspaceAdminAccount(
      workspace,
      workspaceAdminId as unknown as number,
      program.programId
    );
    const [newWorkspaceAdminAcc, _w2] = await getWorkspaceAdminAccount(
      workspace,
      workspaceState.adminIndex,
      program.programId
    );
    
    console.log(workspace.toString())
    console.log(workspaceAdminAcc.toString())
    console.log(newWorkspaceAdminAcc.toString())
    await program.rpc.addWorkspaceAdmin(
      workspaceAdminId,
      newAdminEmail,
      newAdminAuthority,
      {
        accounts: {
          workspace: workspace,
          workspaceAdmin: workspaceAdminAcc,
          authority: workspaceAdminAcc,
          newWorkspaceAdmin: newWorkspaceAdminAcc,
          payer: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
         signers: []
      }
    );
    console.log("done");
  };
  return (
    <form
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      <button type="submit">Add workspace Admin</button>
      <br />
      <input
        type="text"
        name="workspacePubKey"
        placeholder="workspacePubKey"
        value={workspacePubKey}
        onChange={(e) => setWorkspacePubKey(e.target.value)}
      />

      <input
        type="number"
        name="workspaceAdminId"
        placeholder="workspaceAdminId"
        value={workspaceAdminId}
        onChange={(e) => setWorkspaceAdminId(e.target.value)}
      />

      <input
        type="text"
        name="newAdminEmail"
        placeholder="newAdminEmail"
        value={newAdminEmail}
        onChange={(e) => setNewAdminEmail(e.target.value)}
      />

      <input
        type="text"
        name="newAdminAuthority"
        placeholder="newAdminAuthority"
        value={newAdminAuthority}
        onChange={(e) => setNewAdminAuthority(e.target.value)}
      />
    </form>
  );
};

export default AddWorkspaceAdmin;
