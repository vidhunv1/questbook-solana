import { Connection } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import { programAddress, connectionsOptions } from './config';
import * as anchor from '@project-serum/anchor';
import {idl} from './idl';

const fetchIdl = () => {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(idl);
        }, 300);
    })
    return promise;
}

const getConnectionProvider = async (wallet, network) => {
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

const getProgram = async (wallet, network) => {
    const provider = await getConnectionProvider(wallet, network);
    // const idl = await Program.fetchIdl(programAddress, provider);
    const idl = await fetchIdl();
    return new Program(idl, programAddress, provider);
};

const fetchWorkspaces = async (wallet, network) => {
    const program = await getProgram(wallet, network);
    const workspaces = await program.account.workspace.all();
    return workspaces;
}

const getWorkspaceAdminAccount = async (program: Program, workspace: anchor.web3.PublicKey, adminId: number) => {
    console.log(workspace instanceof anchor.web3.PublicKey)
    console.log(web3.PublicKey.findProgramAddress)
    return web3.PublicKey.findProgramAddress([
      Buffer.from('workspace_admin'),
      workspace.toBuffer(),
      Buffer.from(adminId + '')
    ], program.programId)
}

const createWorkspace = async (wallet, network, adminEmail: string, metadataHash: string, authority?: anchor.web3.Keypair) => {
    const program = await getProgram(wallet, network);
    const workspace = web3.Keypair.generate();
    const [workspaceAdmin, _w] = await getWorkspaceAdminAccount(program, workspace.publicKey, 0)
    const signers = [workspace];

    program.rpc.createWorkspace(metadataHash, adminEmail, {
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

export {
    fetchWorkspaces,
    createWorkspace,
};