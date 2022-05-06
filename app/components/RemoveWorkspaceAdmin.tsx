import React, { FormEvent, useState } from "react";
import useSolanaProgram from "./useSolanaContract";
import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

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

const RemoveWorkspaceAdmin = () => {
  const program = useSolanaProgram();
  const [workspacePubKey, setWorkspacePubKey] = useState("");
  const [workspaceAdminId, setWorkspaceAdminId] = useState("");
  const [removeAdminId, setRemoveAdminId] = useState("");
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const workspace = new anchor.web3.PublicKey(workspacePubKey);
    const workspaceState = await getWorkspaceState(program, workspace);
    const [workspaceAdminAcc, _w1] = await getWorkspaceAdminAccount(
      new PublicKey(workspace),
      workspaceAdminId as unknown as number,
      new PublicKey(program.programId)
    );
    const [removeWorkspaceAdminAcc, _w2] = await getWorkspaceAdminAccount(
      workspace,
      workspaceState.adminIndex,
      new PublicKey(program.programId)
    );
    
    console.log(workspace.toString());
    console.log(workspaceAdminAcc.toString());
    console.log(removeWorkspaceAdminAcc.toString());
    console.log(program.provider)
    await program.rpc.addWorkspaceAdmin(
      workspaceAdminId,
      removeAdminId,
      {
        accounts: {
          workspace: workspace,
          workspaceAdmin: workspaceAdminAcc,
          authority: workspaceAdminAcc,
          newWorkspaceAdmin: removeWorkspaceAdminAcc,
          payer: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        //  signers: [], can you obtain in a secure way?
      }
    );
    
  };
  return (
    <div>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <button type="submit">Remove workspace Admin</button>
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
          type="number"
          name="removeAdminId"
          placeholder="removeAdminId"
          value={removeAdminId}
          onChange={(e) => setRemoveAdminId(e.target.value)}
        />
      </form>
      <br />
      
    </div>
  );
};

export default RemoveWorkspaceAdmin;
