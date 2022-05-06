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

const CreateGrant = () => {
  const program = useSolanaProgram();
  const [adminEmail, setAdminEmail] = useState("");
  const [metadataHash, setMetadataHash] = useState("");
  const [workspacePublicKey, setWorkspacePublicKey] = useState("");
  const [createdGrant, setCreatedGrant] = useState("");
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const grant = anchor.web3.Keypair.generate();
    const [workspaceAdminAcc, _w] = await getWorkspaceAdminAccount(
      new PublicKey(workspacePublicKey),
      0,
      program.programId
    );

    await program.rpc.createGrant(0, metadataHash, {
      accounts: {
        grant: grant.publicKey,
        workspace: workspacePublicKey,
        workspaceAdmin: workspaceAdminAcc,
        authority: program.provider.wallet.publicKey,
        payer: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [grant],
    });
    setCreatedGrant(grant.publicKey.toString());
  };
  return (
    <div>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <button type="submit">Create Grant</button>
        <br />
        <input
          type="text"
          name="workspacePublicKey"
          placeholder="Workspace Public Key"
          value={workspacePublicKey}
          onChange={(e) => setWorkspacePublicKey(e.target.value)}
        />

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
      {createdGrant}
    </div>
  );
};

export default CreateGrant;
