import Head from "next/head";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";
import "../styles/polish.css";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import { defineChain } from "viem";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { TOKEN_ICO_Provider } from "../context/index";

// Sepolia is the Ethereum testnet that still has faucets. Holesky is shut down.
const sepoliaCustom = defineChain({
  ...sepolia,
  rpcUrls: {
    default: {
      http: [
        "https://ethereum-sepolia-rpc.publicnode.com",
        "https://1rpc.io/sepolia",
      ],
    },
  },
});

const config = getDefaultConfig({
  appName: "Token ICO Dapp",
  projectId: "6d836139a63aa0df1597c559947a4808",
  chains: [sepoliaCustom],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      structuralSharing: false,
    },
  },
});

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>ICO Token Sale</title>
        <meta
          name="description"
          content="Connect a wallet and buy ERC-20 tokens with Sepolia faucet ETH. Real ETH is not used."
        />
      </Head>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            theme={darkTheme({
              accentColor: "#3C13D4",
              accentColorForeground: "white",
              borderRadius: "small",
              fontStack: "system",
              overlayBlur: "small",
            })}
          >
            <TOKEN_ICO_Provider>
              <Component {...pageProps} />
              <Toaster />
            </TOKEN_ICO_Provider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}
