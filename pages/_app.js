import toast, { Toaster } from "react-hot-toast";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { holesky } from "wagmi/chains";
import { defineChain } from "viem";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { TOKEN_ICO_Provider } from "../context/index";

// Use custom RPC URLs (public RPCs often 403 from browser; multiple fallbacks)
const holeskyCustom = defineChain({
  ...holesky,
  rpcUrls: {
    default: {
      http: [
        "https://rpc.ankr.com/eth_holesky",
        "https://ethereum-holesky.blockpi.network/v1/rpc/public",
        "https://endpoints.omniatech.io/v1/eth/holesky/public",
        "https://holesky.gateway.tenderly.co",
      ],
    },
  },
});

const config = getDefaultConfig({
  appName: "Token ICO Dapp",
  projectId: "6d836139a63aa0df1597c559947a4808",
  chains: [holeskyCustom],
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

      <script src="assets/js/jquery-3.5.1.min.js"></script>
      <script src="assets/js/bootstrap.bundle.min.js"></script>
      <script src="assets/js/wow.min.js"></script>
      <script src="assets/js/appear.js"></script>
      <script src="assets/js/jquery.magnific-popup.min.js"></script>
      <script src="assets/js/metisMenu.min.js"></script>
      <script src="assets/js/jquery.marquee.min.js"></script>
      <script src="assets/js/parallax-scroll.js"></script>
      <script src="assets/js/countdown.js"></script>
      <script src="assets/js/easing.min.js"></script>
      <script src="assets/js/scrollspy.js"></script>
      <script src="assets/js/main.js"></script>
    </>
  );
}
