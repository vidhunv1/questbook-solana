import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { useMemo } from 'react';
import SolanaProgramIDL from '../constants/idl.json'
import { Connection } from '@solana/web3.js';
import { Idl, Program, Provider, web3 } from '@project-serum/anchor';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConfirmOptions, clusterApiUrl } from '@solana/web3.js';
import { useWallet } from "@solana/wallet-adapter-react";

const useSolanaProgram = () => {
    const SOLANA_PROGRAM_ADDRESS = "8TedDGUNCD8b2y8ePC2dRpGFF5Wjfd9wiQZ9qoezEwGu"
    const preflightCommitment = 'processed';
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallet = useWallet();
    const connection = new Connection(endpoint, 'processed');
    const provider = new Provider(connection, <any>wallet, <ConfirmOptions>preflightCommitment);
    const solanaProgram = new Program(SolanaProgramIDL as Idl, SOLANA_PROGRAM_ADDRESS, provider);
    return solanaProgram;
}

export default useSolanaProgram;