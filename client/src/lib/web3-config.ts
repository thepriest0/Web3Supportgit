import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, polygon, polygonMumbai, base, baseGoerli } from 'wagmi/chains';

// RPC URLs configuration
export const RPC_URLS = {
  [mainnet.id]: `https://eth-mainnet.alchemyapi.io/v2/${import.meta.env.VITE_ALCHEMY_API_KEY || 'demo'}`,
  [sepolia.id]: `https://eth-sepolia.alchemyapi.io/v2/${import.meta.env.VITE_ALCHEMY_API_KEY || 'demo'}`,
  [polygon.id]: `https://polygon-mainnet.alchemyapi.io/v2/${import.meta.env.VITE_ALCHEMY_API_KEY || 'demo'}`,
  [polygonMumbai.id]: `https://polygon-mumbai.alchemyapi.io/v2/${import.meta.env.VITE_ALCHEMY_API_KEY || 'demo'}`,
  [base.id]: `https://base-mainnet.alchemyapi.io/v2/${import.meta.env.VITE_ALCHEMY_API_KEY || 'demo'}`,
  [baseGoerli.id]: `https://base-goerli.alchemyapi.io/v2/${import.meta.env.VITE_ALCHEMY_API_KEY || 'demo'}`,
};

// Supported chains configuration
export const SUPPORTED_CHAINS = [
  mainnet,
  sepolia,
  polygon,
  polygonMumbai,
  base,
  baseGoerli,
];

// Default RainbowKit configuration
export const wagmiConfig = getDefaultConfig({
  appName: 'AllDappNet - Decentralized Web3 Support Protocol',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'default-project-id',
  chains: SUPPORTED_CHAINS as any,
  ssr: false, // If your dApp uses server side rendering (SSR)
});

// Chain-specific configuration
export const CHAIN_CONFIG = {
  [mainnet.id]: {
    name: 'Ethereum Mainnet',
    isTestnet: false,
    explorerUrl: 'https://etherscan.io',
    currency: 'ETH',
    faucetUrl: null,
  },
  [sepolia.id]: {
    name: 'Sepolia Testnet',
    isTestnet: true,
    explorerUrl: 'https://sepolia.etherscan.io',
    currency: 'ETH',
    faucetUrl: 'https://sepoliafaucet.com',
  },
  [polygon.id]: {
    name: 'Polygon Mainnet',
    isTestnet: false,
    explorerUrl: 'https://polygonscan.com',
    currency: 'MATIC',
    faucetUrl: null,
  },
  [polygonMumbai.id]: {
    name: 'Polygon Mumbai',
    isTestnet: true,
    explorerUrl: 'https://mumbai.polygonscan.com',
    currency: 'MATIC',
    faucetUrl: 'https://faucet.polygon.technology',
  },
  [base.id]: {
    name: 'Base Mainnet',
    isTestnet: false,
    explorerUrl: 'https://basescan.org',
    currency: 'ETH',
    faucetUrl: null,
  },
  [baseGoerli.id]: {
    name: 'Base Goerli',
    isTestnet: true,
    explorerUrl: 'https://goerli.basescan.org',
    currency: 'ETH',
    faucetUrl: 'https://bridge.base.org',
  },
};

// Network switching helpers
export function getChainConfig(chainId: number) {
  return CHAIN_CONFIG[chainId as keyof typeof CHAIN_CONFIG];
}

export function isChainSupported(chainId: number): boolean {
  return chainId in CHAIN_CONFIG;
}

export function getExplorerUrl(chainId: number, hash: string, type: 'tx' | 'address' = 'tx'): string {
  const config = getChainConfig(chainId);
  if (!config) return '#';
  
  return `${config.explorerUrl}/${type}/${hash}`;
}

export function getFaucetUrl(chainId: number): string | null {
  const config = getChainConfig(chainId);
  return config?.faucetUrl || null;
}

// Gas configuration
export const GAS_CONFIG = {
  // Gas limits for different contract functions
  VALIDATE_WALLET: BigInt(100000),
  CLAIM_AIRDROP: BigInt(150000),
  STAKE_TOKENS: BigInt(200000),
  UNSTAKE_TOKENS: BigInt(150000),
  BRIDGE_ASSETS: BigInt(300000),
  SWAP_TOKENS: BigInt(250000),
  TRANSFER_NFT: BigInt(120000),
  VALIDATE_SIGNATURE: BigInt(50000),
  
  // Gas price multipliers for different urgency levels
  SLOW: 1.0,
  STANDARD: 1.25,
  FAST: 1.5,
  INSTANT: 2.0,
};

// Transaction configuration
export const TX_CONFIG = {
  CONFIRMATION_BLOCKS: {
    [mainnet.id]: 12,
    [sepolia.id]: 3,
    [polygon.id]: 20,
    [polygonMumbai.id]: 5,
    [base.id]: 10,
    [baseGoerli.id]: 3,
  },
  
  TIMEOUT_MS: 300000, // 5 minutes
  
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 5000,
};

// Token addresses for different chains
export const TOKEN_ADDRESSES = {
  [mainnet.id]: {
    USDC: '0xA0b86a33E6c3066806E6e8fb43F37BfA74c37b37',
    USDT: '0xDAC17F958D2ee523a2206206994597C13D831ec7',
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  },
  [sepolia.id]: {
    USDC: '0x1c4d6a7b5d2e1b4c4e7a5d5e2f5d5e7a5e7a5e7',
    USDT: '0x2c4d6a7b5d2e1b4c4e7a5d5e2f5d5e7a5e7a5e8',
    DAI: '0x3c4d6a7b5d2e1b4c4e7a5d5e2f5d5e7a5e7a5e9',
    WETH: '0x4c4d6a7b5d2e1b4c4e7a5d5e2f5d5e7a5e7a5ea',
  },
  [polygon.id]: {
    USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    WMATIC: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  },
  [polygonMumbai.id]: {
    USDC: '0x5c4d6a7b5d2e1b4c4e7a5d5e2f5d5e7a5e7a5eb',
    USDT: '0x6c4d6a7b5d2e1b4c4e7a5d5e2f5d5e7a5e7a5ec',
    DAI: '0x7c4d6a7b5d2e1b4c4e7a5d5e2f5d5e7a5e7a5ed',
    WMATIC: '0x8c4d6a7b5d2e1b4c4e7a5d5e2f5d5e7a5e7a5ee',
  },
  [base.id]: {
    USDC: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    DAI: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    WETH: '0x4200000000000000000000000000000000000006',
  },
  [baseGoerli.id]: {
    USDC: '0x9c4d6a7b5d2e1b4c4e7a5d5e2f5d5e7a5e7a5ef',
    DAI: '0xac4d6a7b5d2e1b4c4e7a5d5e2f5d5e7a5e7a5f0',
    WETH: '0xbc4d6a7b5d2e1b4c4e7a5d5e2f5d5e7a5e7a5f1',
  },
};

// Utility functions
export function getTokenAddress(chainId: number, symbol: string): string | undefined {
  const chainTokens = TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES];
  return chainTokens?.[symbol as keyof typeof chainTokens];
}

export function isMainnet(chainId: number): boolean {
  const mainnets = [mainnet.id, polygon.id, base.id] as const;
  return mainnets.includes(chainId as any);
}

export function getChainCurrency(chainId: number): string {
  const config = getChainConfig(chainId);
  return config?.currency || 'ETH';
}

export function formatChainName(chainId: number): string {
  const config = getChainConfig(chainId);
  return config?.name || `Chain ${chainId}`;
}

// Export environment variables with fallbacks
export const ENV_CONFIG = {
  ALCHEMY_API_KEY: import.meta.env.VITE_ALCHEMY_API_KEY || 'demo',
  WALLETCONNECT_PROJECT_ID: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'default-project-id',
  IS_PRODUCTION: import.meta.env.MODE === 'production',
  APP_URL: import.meta.env.VITE_APP_URL || 'http://localhost:5000',
};
