import React, { useEffect, useState, useCallback } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import WorkspaceCreator from './WorkspaceCreator'
import { fetchWorkspaces, createWorkspace } from "../utils/anchorClient";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
    Flex,
    Box,
    Badge
} from '@chakra-ui/react'

interface Props {
    network: string;
}

function WorkspaceArena({ network }: Props) {

    const wallet = useWallet();
    const [workspaces, setWorkspaces] = useState([]);

    const getAllWorkspaces = useCallback(async () => {
        const newWorkspaces = await fetchWorkspaces(wallet, network);
        setWorkspaces(newWorkspaces.flatMap(workspace => workspace.account));
        console.log(workspaces)
    }, [wallet, network])

    useEffect(() => {
        getAllWorkspaces();
    }, [wallet, network, getAllWorkspaces]);

    const submitWorkspace = async (adminEmail: string, metadataHash: string) => {
        await createWorkspace(wallet, network, adminEmail, metadataHash);
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
        </Flex>
    )
}

export default WorkspaceArena;
