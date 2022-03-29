import { Connection } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import { programAddress, connectionsOptions } from './config';
import * as anchor from '@project-serum/anchor';

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
    // Get a connection
    const provider = await getConnectionProvider(wallet, network);
    // Get metadata about your solana program
    const idl = await Program.fetchIdl(programAddress, provider);
    // Create a program that you can call
    return new Program(idl, programAddress, provider);
};

const getWorkspaces = async (wallet, network) => {
    const program = await getProgram(wallet, network);
    const workspaces = await program.account.Workspace.all();
    return workspaces;
}

const createWorkspace = async (wallet, network, metadataHash: string, adminEmail: string, authority?: anchor.web3.Keypair) => {
    const program = await getProgram(wallet, network);
    const workspaceAccountKeypair = web3.Keypair.generate()
    const signers = [workspace]
    if (authority) {
        signers.push(authority)
    }
    // Craft the createJoke Instruction
    program.rpc.createWorkspace(metadataHash, adminEmail, {
        accounts: {
            workspace: workspace.publicKey,
            workspaceOwner: authority != null ? authority.publicKey : wallet.publicKey,
            workspaceAdmin: workspaceAdminAcc,
            payer: wallet.publicKey, //get this
            systemProgram: anchor.web3.SystemProgram.programId
        },
        signers
    })
}

export {
    getWorkspaces,
    createWorkspace,
};