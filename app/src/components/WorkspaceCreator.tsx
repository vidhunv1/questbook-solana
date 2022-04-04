import { WalletContextState } from '@solana/wallet-adapter-react';
import {
    FormControl,
    FormLabel,
    Input, 
    Button,
    Heading
} from '@chakra-ui/react'

import React, { useState } from 'react';


interface Props {
    wallet: WalletContextState;
    submitWorkspace: (email: string, metadata: string) => void
}

function WorkspaceCreator({ wallet, submitWorkspace }: Props) {
    const [adminEmail, setAdminEmail] = useState("")
    const [metadataHash, setMetadataHash] = useState("")

    if (!wallet.connected) {
        return null;
    }

    const handleSubmit = () => {
        submitWorkspace(adminEmail, metadataHash);
    }

    return (
        <FormControl bg='gray.100'  p={12} rounded={6}>
            <Heading mb={6} size='lg'>Create new workspace</Heading>
            <FormLabel htmlFor='email'>Email</FormLabel>
            <Input 
                id="email"
                type="email"
                placeholder="example@company.com"
                className="form-input"
                value={adminEmail}
                onChange={(event) => setAdminEmail(event.target.value)}
            />

            <FormLabel htmlFor='metadata'>Metadata Hash</FormLabel>
            <Input
                id='metadata'
                type="text"
                placeholder="https://ipfs.io/123"
                className="form-input"
                value={metadataHash}
                onChange={(event) => setMetadataHash(event.target.value)}
            />
            <Button
                mt={4}
                colorScheme='teal'
                type='submit'
                onClick={handleSubmit}
            >Create Workspace</Button>
        </FormControl>
    )
}

export default WorkspaceCreator;