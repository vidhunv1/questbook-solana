import React, { FormEvent, useState } from "react";
import useSolanaProgram from "./useSolanaContract";
import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

const getApplicationAccount = async (
  authority: anchor.web3.PublicKey,
  grant: anchor.web3.PublicKey,
  programId: anchor.web3.PublicKey
) => {
  return anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("application"), grant.toBuffer(), authority.toBuffer()],
    programId
  );
};

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

const SubmitApplication = () => {
  const program = useSolanaProgram();
  const [milestonesCount, setMilestonesCount] = useState("");
  const [metadataHash, setMetadataHash] = useState("");
  const [grantPublicKey, setGrantPublicKey] = useState("");
  const [createdApplication, setCreatedApplication] = useState("");
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const [applicationAcc, _w] = await getApplicationAccount(
      program.provider.wallet.publicKey,
      new PublicKey(grantPublicKey),
      program.programId
    );
    const numMilestonesCount = parseInt(milestonesCount);
    const applicationPublicKey = await program.rpc.submitApplication(
      metadataHash,
      numMilestonesCount,
      {
        accounts: {
          application: applicationAcc,
          authority: program.provider.wallet.publicKey,
          grant: grantPublicKey,
          payer: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
      }
    );
    setCreatedApplication(applicationAcc.toString());
  };
  return (
    <div>
      {" "}
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <button type="submit">Submit Application</button>
        <br />

        <input
          type="text"
          name="grantPublicKey"
          placeholder="Grant Public Key"
          value={grantPublicKey}
          onChange={(e) => setGrantPublicKey(e.target.value)}
        />

        <input
          type="number"
          name="milestonesCount"
          placeholder="milestones"
          value={milestonesCount}
          onChange={(e) => setMilestonesCount(e.target.value)}
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
      {createdApplication}
    </div>
  );
};

export default SubmitApplication;
