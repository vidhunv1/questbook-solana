import { Connection } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import { programAddress, connectionsOptions } from './config';
import * as anchor from '@project-serum/anchor';
import { idl } from './idl';

const fetchIdl = () => {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(idl);
        }, 300);
    })
    return promise;
}

const getConnectionProvider = async (wallet: any, network: any) => {
    const connection = new Connection(
        network,
        connectionsOptions.preflightCommitment
    );
    const provider = new Provider(
        connection,
        wallet,
        connectionsOptions.preflightCommitment
    );
    return provider;
};

const getProgram = async (wallet: any, network: any) => {
    const provider = await getConnectionProvider(wallet, network);
    // const idl = await Program.fetchIdl(programAddress, provider);
    const idl = await fetchIdl();
    return new Program(idl, programAddress, provider);
};

const fetchWorkspaces = async (wallet: any, network: any) => {
    const program = await getProgram(wallet, network);
    const workspaces = await program.account.workspace.all();
    // console.log(workspaces)
    return workspaces;
}

const fetchGrants = async (wallet: any, network: any) => {
    const program = await getProgram(wallet, network);
    const what = program.account;
    console.log(what)
    const grants = await program.account.grant.all();
    console.log(grants)
    return grants;
}

const getWorkspaceAdminAccount = async (program: Program, workspace: anchor.web3.PublicKey, adminId: number) => {
    // console.log(workspace instanceof anchor.web3.PublicKey)
    // console.log(web3.PublicKey.findProgramAddress)
    return web3.PublicKey.findProgramAddress([
        Buffer.from('workspace_admin'),
        workspace.toBuffer(),
        Buffer.from(adminId + '')
    ], program.programId)
}

const createWorkspace = async (wallet: any, network: any, adminEmail: string, metadataHash: string, authority?: anchor.web3.Keypair) => {
    const program = await getProgram(wallet, network);
    const workspace = web3.Keypair.generate();
    const [workspaceAdmin, _w] = await getWorkspaceAdminAccount(program, workspace.publicKey, 0)
    const signers = [workspace, wallet];

    program.state!.rpc.createWorkspace(metadataHash, adminEmail, {
        accounts: {
            workspace: workspace.publicKey,
            workspaceOwner: wallet.publicKey,
            workspaceAdmin: workspaceAdmin,
            payer: wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId
        },
        signers: signers
    })
}

const createGrant = async (wallet: any, network: any, metadataHash: string, workspace: anchor.web3.PublicKey, workspaceAdminAuthority?: anchor.web3.Keypair) => {
    const program = await getProgram(wallet, network);
    const grant = anchor.web3.Keypair.generate()
    const [workspaceAdminAcc, _w] = await getWorkspaceAdminAccount(program, workspace, 0)

    await program.state!.rpc.createGrant(0, metadataHash, {
        accounts: {
            grant: grant.publicKey,
            workspace: workspace,
            workspaceAdmin: workspaceAdminAcc,
            authority: wallet.publicKey,
            payer: wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId
        },
        signers: [grant, grant]
    })

    return grant.publicKey
}


const updateGrantAccessibility = async (wallet: any, network: any, adminId: number, canAcceptApplications: boolean, grant: anchor.web3.PublicKey, workspace: anchor.web3.PublicKey, workspaceAdminAuthority: anchor.web3.Keypair)=> {
    const program = await getProgram(wallet, network);
    const [workspaceAdminAcc, _w] = await getWorkspaceAdminAccount(program, workspace, adminId)

    await program.state!.rpc.updateGrantAccessibility(adminId, canAcceptApplications, {
      accounts: {
        grant: grant,
        workspace: workspace,
        workspaceAdmin: workspaceAdminAcc,
        authority: workspaceAdminAuthority.publicKey,
      },
      signers: [workspaceAdminAuthority]
    })
  }

export {
    fetchWorkspaces,
    fetchGrants,
    createWorkspace,
    createGrant
};