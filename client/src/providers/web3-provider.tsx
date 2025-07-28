import { createContext, useContext, ReactNode } from 'react';
import { createConfig, http, WagmiProvider, useAccount, useConnect, useDisconnect } from 'wagmi';
import { mainnet, sepolia, polygon, polygonMumbai, base, baseGoerli } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { 
  RainbowKitProvider, 
  getDefaultConfig,
  connectorsForWallets,
  Wallet
} from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  metaMaskWallet,
  coinbaseWallet,
  trustWallet,
  phantomWallet,
  walletConnectWallet,
  safeWallet,
  ledgerWallet,
  argentWallet,
  imTokenWallet,
  okxWallet,
  rabbyWallet,
  zerionWallet,
  braveWallet,
  coreWallet,
  bitgetWallet,
  oneInchWallet,
  tokenPocketWallet,
  frameWallet,
  rainbowWallet
} from '@rainbow-me/rainbowkit/wallets';
import '@rainbow-me/rainbowkit/styles.css';

// Enhanced wallet configuration with all popular wallets
// Minimal connectors setup to prevent WalletConnect errors
const connectors = connectorsForWallets([
  {
    groupName: 'Basic',
    wallets: [
      injectedWallet,
    ],
  },
], {
  appName: 'AllDappNet - Decentralized Web3 Support Protocol',
  projectId: 'disabled',
});

// Initialize Wagmi config with enhanced wallet support
const config = createConfig({
  connectors,
  chains: [mainnet, sepolia, polygon, polygonMumbai, base, baseGoerli],
  transports: {
    [mainnet.id]: http(`https://eth-mainnet.alchemyapi.io/v2/${import.meta.env.VITE_ALCHEMY_API_KEY || 'demo'}`),
    [sepolia.id]: http(`https://eth-sepolia.alchemyapi.io/v2/${import.meta.env.VITE_ALCHEMY_API_KEY || 'demo'}`),
    [polygon.id]: http(`https://polygon-mainnet.alchemyapi.io/v2/${import.meta.env.VITE_ALCHEMY_API_KEY || 'demo'}`),
    [polygonMumbai.id]: http(`https://polygon-mumbai.alchemyapi.io/v2/${import.meta.env.VITE_ALCHEMY_API_KEY || 'demo'}`),
    [base.id]: http(`https://base-mainnet.alchemyapi.io/v2/${import.meta.env.VITE_ALCHEMY_API_KEY || 'demo'}`),
    [baseGoerli.id]: http(`https://base-goerli.alchemyapi.io/v2/${import.meta.env.VITE_ALCHEMY_API_KEY || 'demo'}`),
  },
  ssr: false,
});

const queryClient = new QueryClient();

interface Web3ContextType {
  isConnected: boolean;
  address?: string;
  chainId?: number;
  connect: () => void;
  disconnect: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

function Web3ContextProvider({ children }: { children: ReactNode }) {
  const { address, isConnected, chainId } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    // RainbowKit will handle the connection UI through the ConnectButton
    const firstConnector = config.connectors[0];
    if (firstConnector) {
      connect({ connector: firstConnector });
    }
  };

  const contextValue: Web3ContextType = {
    isConnected,
    address,
    chainId,
    connect: handleConnect,
    disconnect,
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
}

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          showRecentTransactions={true}
          coolMode={true}
          appInfo={{
            appName: 'AllDappNet',
            disclaimer: ({ Text, Link }) => (
              <Text>
                By connecting your wallet, you agree to our{' '}
                <Link href="/terms">Terms of Service</Link> and acknowledge our{' '}
                <Link href="/privacy">Privacy Policy</Link>.
              </Text>
            ),
          }}
        >
          <Web3ContextProvider>
            {children}
          </Web3ContextProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
