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
    submitGrant: (metadata: string) => void
}

function GrantCreator({ wallet, submitGrant }: Props) {
    const [metadataHash, setMetadataHash] = useState("")

    if (!wallet.connected) {
        return null;
    }

    const handleSubmit = () => {
        submitGrant(metadataHash);
    }

    return (
        <FormControl bg='gray.100'  p={12} rounded={6}>
            <Heading mb={6} size='lg'>Create new grant</Heading>

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
            >Create Grant</Button>
        </FormControl>
    )
}

export default GrantCreator;
