import type { NextPage } from "next";
import React, { useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import CreateWorkSpace from "components/CreateWorkspace";
import UpdateWorkSpace from "components/UpdateWorkspace";
import AddWorkspaceAdmin from "components/AddWorkspaceAdmin";
import RemoveWorkspaceAdmin from "components/RemoveWorkspaceAdmin";
import CreateGrant from "components/CreateGrant";
import SubmitApplication from "components/SubmitApplication";
import UpdateGrant from "components/UpdateGrant";
import UpdateGrantAccessibility from "components/UpdateGrantAccessibility";

const Home: NextPage = () => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);
  // wallets[0].connect();
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton />
          <hr />
          <CreateWorkSpace />
          <br />
          <UpdateWorkSpace />
          <br />
          <AddWorkspaceAdmin />
          <br />
          <RemoveWorkspaceAdmin />
          <hr />
          <CreateGrant />
          <br />
          <UpdateGrant />
          <br />
          <UpdateGrantAccessibility />
          <hr />
          <SubmitApplication />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default Home;
