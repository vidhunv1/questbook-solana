import React, { useEffect, useState, useCallback } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import WorkspaceCreator from './WorkspaceCreator'
import GrantCreator from './GrantCreator'
import { fetchWorkspaces, createWorkspace, fetchGrants, createGrant } from "../utils/anchorClient";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
    Flex,
    Box,
    Badge
} from '@chakra-ui/react'
import { PublicKey } from '@solana/web3.js';

interface Props {
    network: string;
}

function WorkspaceArena({ network }: Props) {

    const wallet = useWallet();
    wallet.wallet?.adapter
    const [workspaces, setWorkspaces] = useState([]);
    const [myWorkspaces, setMyWorkspaces] = useState([]);

    const getAllWorkspaces = useCallback(async () => {
        const newWorkspaces = await fetchWorkspaces(wallet, network);
        const grants = await fetchGrants(wallet, network)
        console.log(grants)
        // console.log(grants)
        // console.log(wallet.publicKey?.toString())
        // newWorkspaces.forEach((workspace) => {
        //     console.log(workspace.account.authority.toString())
        // })
        const newMyWorkspaces = newWorkspaces.filter(workspace => workspace.account.authority.toString() === wallet.publicKey?.toString())
        setMyWorkspaces(newMyWorkspaces.flatMap(workspace => workspace.publicKey))
        setWorkspaces(newWorkspaces.flatMap(workspace => workspace.account));
    }, [wallet, network])

    useEffect(() => {
        getAllWorkspaces();
    }, [wallet, network, getAllWorkspaces]);

    const submitWorkspace = async (adminEmail: string, metadataHash: string) => {
        await createWorkspace(wallet, network, adminEmail, metadataHash);
        await getAllWorkspaces()
    }

    const submitGrant = async (metadataHash: string, workspace?: PublicKey) => {
        console.log(myWorkspaces[0])
        wallet.wallet
        await createGrant(wallet, network, metadataHash, myWorkspaces[0]);
        await getAllWorkspaces()
    }

    return (
        <Flex direction='column' mt='5' textAlign='center'>
            {wallet.connected &&
                workspaces.map((item, idx) => (
                    <div key={idx} className={"card"}>
                        <div className={"card-body"}>
                            <Box bg={idx % 2 ? 'gray.70' : 'sky.100'}>
                                <Badge borderRadius='full' px='2' colorScheme='teal'>
                                    {item.authority.toString()}
                                </Badge>
                                <br />
                                Metadata hash: {item.metadataHash}
                                <br />
                            </Box>
                        </div>
                    </div>
                ))
            }
            <WorkspaceCreator wallet={wallet} submitWorkspace={submitWorkspace} />
            <GrantCreator wallet={wallet} submitGrant={submitGrant} />
        </Flex>
    )
}

export default WorkspaceArena;
