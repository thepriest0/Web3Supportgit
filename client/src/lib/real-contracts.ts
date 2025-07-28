import { parseEther } from 'viem';

// Real DeFi Protocol ABIs - Essential functions only for our use cases
export const UNISWAP_V3_ROUTER_ABI = [
  {
    "inputs": [
      {"name": "params", "type": "tuple", "components": [
        {"name": "tokenIn", "type": "address"},
        {"name": "tokenOut", "type": "address"},
        {"name": "fee", "type": "uint24"},
        {"name": "recipient", "type": "address"},
        {"name": "deadline", "type": "uint256"},
        {"name": "amountIn", "type": "uint256"},
        {"name": "amountOutMinimum", "type": "uint256"},
        {"name": "sqrtPriceLimitX96", "type": "uint160"}
      ]}
    ],
    "name": "exactInputSingle",
    "outputs": [{"name": "amountOut", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  }
] as const;

export const UNISWAP_V2_ROUTER_ABI = [
  {
    "inputs": [
      {"name": "amountOutMin", "type": "uint256"},
      {"name": "path", "type": "address[]"},
      {"name": "to", "type": "address"},
      {"name": "deadline", "type": "uint256"}
    ],
    "name": "swapExactETHForTokens",
    "outputs": [{"name": "amounts", "type": "uint256[]"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "amountIn", "type": "uint256"},
      {"name": "amountOutMin", "type": "uint256"},
      {"name": "path", "type": "address[]"},
      {"name": "to", "type": "address"},
      {"name": "deadline", "type": "uint256"}
    ],
    "name": "swapExactTokensForETH",
    "outputs": [{"name": "amounts", "type": "uint256[]"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export const OPENSEA_SEAPORT_ABI = [
  {
    "inputs": [
      {"name": "orders", "type": "tuple[]", "components": [
        {"name": "parameters", "type": "tuple"},
        {"name": "signature", "type": "bytes"}
      ]}
    ],
    "name": "fulfillOrder",
    "outputs": [{"name": "fulfilled", "type": "bool"}],
    "stateMutability": "payable",
    "type": "function"
  }
] as const;

export const AAVE_V3_POOL_ABI = [
  {
    "inputs": [
      {"name": "asset", "type": "address"},
      {"name": "amount", "type": "uint256"},
      {"name": "onBehalfOf", "type": "address"},
      {"name": "referralCode", "type": "uint16"}
    ],
    "name": "supply",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "asset", "type": "address"},
      {"name": "amount", "type": "uint256"},
      {"name": "to", "type": "address"}
    ],
    "name": "withdraw",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export const ERC20_ABI = [
  {
    "inputs": [{"name": "spender", "type": "address"}, {"name": "amount", "type": "uint256"}],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Real protocol contract addresses
export const PROTOCOL_ADDRESSES = {
  // Ethereum Mainnet (Chain ID: 1)
  1: {
    UNISWAP_V3_ROUTER: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    UNISWAP_V2_ROUTER: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    OPENSEA_SEAPORT: '0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC',
    AAVE_V3_POOL: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
    ONEINCH_ROUTER: '0x1111111254EEB25477B68fb85Ed929f73A960582',
    ENS_REGISTRY: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    // Common tokens
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    USDC: '0xA0b86a33E6411C73e5B6AC6e7C4A1E0eE81E7fa6',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  },
  // Sepolia Testnet (Chain ID: 11155111)
  11155111: {
    UNISWAP_V3_ROUTER: '0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E',
    UNISWAP_V2_ROUTER: '0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008',
    AAVE_V3_POOL: '0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951',
    WETH: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    USDC: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
  },
  // Polygon Mainnet (Chain ID: 137)
  137: {
    UNISWAP_V3_ROUTER: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    UNISWAP_V2_ROUTER: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff', // QuickSwap
    AAVE_V3_POOL: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
    OPENSEA_SEAPORT: '0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC',
    WMATIC: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    WETH: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  },
  // Base Mainnet (Chain ID: 8453)
  8453: {
    UNISWAP_V3_ROUTER: '0x2626664c2603336E57B271c5C0b26F421741e481',
    UNISWAP_V2_ROUTER: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24',
    WETH: '0x4200000000000000000000000000000000000006',
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
} as const;

export type SupportedChainId = keyof typeof PROTOCOL_ADDRESSES;

// Common token addresses by symbol
export const TOKEN_ADDRESSES = {
  1: { // Ethereum
    ETH: '0x0000000000000000000000000000000000000000',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    USDC: '0xA0b86a33E6411C73e5B6AC6e7C4A1E0eE81E7fa6',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  },
  137: { // Polygon
    MATIC: '0x0000000000000000000000000000000000000000',
    WMATIC: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    WETH: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  },
  8453: { // Base
    ETH: '0x0000000000000000000000000000000000000000',
    WETH: '0x4200000000000000000000000000000000000006',
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
} as const;

// Protocol operation types
export type ProtocolOperation = 
  | 'uniswap_v2_swap'
  | 'uniswap_v3_swap'
  | 'aave_supply'
  | 'aave_withdraw'
  | 'opensea_buy'
  | 'token_approve'
  | 'wallet_validate';

// Gas estimation for different protocol operations
export function estimateGasForProtocol(operation: ProtocolOperation): bigint {
  const gasEstimates: Record<ProtocolOperation, bigint> = {
    uniswap_v2_swap: parseEther("0.003"),
    uniswap_v3_swap: parseEther("0.004"),
    aave_supply: parseEther("0.002"),
    aave_withdraw: parseEther("0.002"),
    opensea_buy: parseEther("0.005"),
    token_approve: parseEther("0.001"),
    wallet_validate: parseEther("0.0005"),
  };
  
  return gasEstimates[operation] || parseEther("0.002");
}

// Helper functions
export function getProtocolAddress(chainId: number, protocol: string): string | undefined {
  const addresses = PROTOCOL_ADDRESSES[chainId as SupportedChainId];
  return addresses?.[protocol as keyof typeof addresses];
}

export function getTokenAddress(chainId: number, symbol: string): string | undefined {
  const chainTokens = TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES];
  return chainTokens?.[symbol as keyof typeof chainTokens];
}

export function isMainnet(chainId: number): boolean {
  const mainnets = [1, 137, 8453] as const;
  return mainnets.includes(chainId as any);
}

export function getChainCurrency(chainId: number): string {
  const currencies: Record<number, string> = {
    1: 'ETH',
    11155111: 'ETH',
    137: 'MATIC',
    80001: 'MATIC',
    8453: 'ETH',
    84531: 'ETH',
  };
  return currencies[chainId] || 'ETH';
}

// Network information
export const NETWORK_NAMES: Record<number, string> = {
  1: "Ethereum",
  11155111: "Sepolia",
  137: "Polygon",
  80001: "Mumbai",
  8453: "Base",
  84531: "Base Goerli",
};

export function getNetworkName(chainId: number): string {
  return NETWORK_NAMES[chainId] || `Unknown (${chainId})`;
}

export function isTestnet(chainId: number): boolean {
  const testnets = [11155111, 80001, 84531];
  return testnets.includes(chainId);
}