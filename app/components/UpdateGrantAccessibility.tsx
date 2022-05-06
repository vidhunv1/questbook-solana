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

const UpdateGrantAccessibility = () => {
  const program = useSolanaProgram();
  const [workspacePubKey, setWorkspacePubKey] = useState("");
  const [canAcceptApplications, setCanAcceptApplications] = useState("");
  const [adminId, setAdminId] = useState("");
  const [grantPubKey, setGrantPubKey] = useState("")
  const [status, setStatus] = useState("");
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const workspace = new anchor.web3.PublicKey(workspacePubKey);
    const grant = new anchor.web3.PublicKey(grantPubKey)

    const [workspaceAdminAcc, _w] = await getWorkspaceAdminAccount(
      workspace,
      adminId as unknown as number,
      program.programId
    );
    //const signers = [];

    program.rpc.updateGrantAccessibility(adminId, canAcceptApplications, {
        accounts: {
          grant: grant,
          workspace: workspace,
          workspaceAdmin: workspaceAdminAcc,
          authority: program.provider.wallet.publicKey,
        },
        //signers: [workspaceAdminAuthority]
      })
    setStatus("Updated!")
  };
  return (
    <div>
    <form
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      <button type="submit">Update grant accessibility</button>
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
        name="grantPubKey"
        placeholder="grantPubKey"
        value={grantPubKey}
        onChange={(e) => setGrantPubKey(e.target.value)}
      />

      <input
        type="text"
        name="canAcceptApplications"
        placeholder="canAcceptApplications"
        value={canAcceptApplications}
        onChange={(e) => setCanAcceptApplications(e.target.value)}
      />

      <input
        type="number"
        name="adminId"
        placeholder="adminId"
        value={adminId}
        onChange={(e) => setAdminId(e.target.value)}
      />
    </form>
      <br/>
      {status}
    </div>
  );
};

export default UpdateGrantAccessibility;
