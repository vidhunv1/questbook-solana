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

const CreateWorkspace = () => {
  const program = useSolanaProgram();
  const [adminEmail, setAdminEmail] = useState("");
  const [metadataHash, setMetadataHash] = useState("");
  const [createdWorkspace, setCreatedWorkspace] = useState("");
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const workspace = anchor.web3.Keypair.generate();
    const [workspaceAdminAcc, _w] = await getWorkspaceAdminAccount(
      workspace.publicKey,
      0,
      program.programId
    );
    const signers = [workspace];
    console.log(workspace.publicKey.toString());
    await program.rpc.createWorkspace(metadataHash, adminEmail, {
      accounts: {
        workspace: workspace.publicKey,
        workspaceOwner: program.provider.wallet.publicKey,
        workspaceAdmin: workspaceAdminAcc,
        payer: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers,
    });
    setCreatedWorkspace(workspace.publicKey.toString());
  };
  return (
    <div>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <button type="submit">Create workspace</button>
        <br />
        <input
          id="email"
          type="email"
          name="email"
          placeholder="example@company.com"
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
        />

        <input
          type="text"
          name="MetadataHash"
          placeholder="https://ipfs.io/123"
          value={metadataHash}
          onChange={(e) => setMetadataHash(e.target.value)}
        />
      </form>
      <br />
      {createdWorkspace}
    </div>
  );
};

export default CreateWorkspace;
