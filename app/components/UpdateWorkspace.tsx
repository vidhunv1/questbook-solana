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

const UpdateWorkspace = () => {
  const program = useSolanaProgram();
  const [workspacePubKey, setWorkspacePubKey] = useState("");
  const [metadataHash, setMetadataHash] = useState("");
  const [adminId, setAdminId] = useState("");
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const workspace = new anchor.web3.PublicKey(workspacePubKey);
    const [workspaceAdminAcc, _w] = await getWorkspaceAdminAccount(
      workspace,
      adminId as unknown as number,
      program.programId
    );
    //const signers = [];

    await program.rpc.updateWorkspace(metadataHash, adminId, {
      accounts: {
        workspace: workspacePubKey,
        workspaceAdmin: workspaceAdminAcc,
        authority: program.provider.wallet.publicKey,
      },
      //signers,
    });
    console.log("done");
  };
  return (
    <form
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      <button type="submit">Update workspace</button>
      <br />
      <input
        type="text"
        name="workspacePubKey"
        placeholder="workspacePubKey"
        value={workspacePubKey}
        onChange={(e) => setWorkspacePubKey(e.target.value)}
      />

      <input
        type="text"
        name="MetadataHash"
        placeholder="https://ipfs.io/123"
        value={metadataHash}
        onChange={(e) => setMetadataHash(e.target.value)}
      />

      <input
        type="number"
        name="adminId"
        placeholder="adminId"
        value={adminId}
        onChange={(e) => setAdminId(e.target.value)}
      />
    </form>
  );
};

export default UpdateWorkspace;
