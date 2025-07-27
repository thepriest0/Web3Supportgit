import { createContext, useContext, ReactNode } from 'react';
import { createConfig, http, WagmiProvider, useAccount, useConnect, useDisconnect } from 'wagmi';
import { mainnet, sepolia, polygon, polygonMumbai, base, baseGoerli } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

// Initialize Wagmi config using RainbowKit's getDefaultConfig
const config = getDefaultConfig({
  appName: 'AllDappNet',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'default-project-id',
  chains: [mainnet, sepolia, polygon, polygonMumbai, base, baseGoerli],
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
        >
          <Web3ContextProvider>
            {children}
          </Web3ContextProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
