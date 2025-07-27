import { parseEther, formatEther } from 'viem';

// Smart contract ABIs
export const SUPPORT_CONTRACT_ABI = [
  {
    "inputs": [{"name": "_address", "type": "address"}],
    "name": "validateWallet",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_merkleProof", "type": "bytes32[]"}],
    "name": "claimAirdrop",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_amount", "type": "uint256"}],
    "name": "stakeTokens",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_amount", "type": "uint256"}],
    "name": "unstakeTokens",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_tokenAddress", "type": "address"}, {"name": "_amount", "type": "uint256"}],
    "name": "bridgeAssets",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_signature", "type": "bytes"}],
    "name": "validateSignature",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_tokenA", "type": "address"}, {"name": "_tokenB", "type": "address"}, {"name": "_amount", "type": "uint256"}],
    "name": "swapTokens",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_nftAddress", "type": "address"}, {"name": "_tokenId", "type": "uint256"}],
    "name": "transferNFT",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  // Ethereum Mainnet
  1: {
    supportContract: "0x1234567890123456789012345678901234567890",
    airdropContract: "0x0987654321098765432109876543210987654321",
  },
  // Sepolia Testnet
  11155111: {
    supportContract: "0x1111111111111111111111111111111111111111",
    airdropContract: "0x2222222222222222222222222222222222222222",
  },
  // Polygon Mainnet
  137: {
    supportContract: "0x3333333333333333333333333333333333333333",
    airdropContract: "0x4444444444444444444444444444444444444444",
  },
  // Polygon Mumbai
  80001: {
    supportContract: "0x5555555555555555555555555555555555555555",
    airdropContract: "0x6666666666666666666666666666666666666666",
  },
  // Base Mainnet
  8453: {
    supportContract: "0x7777777777777777777777777777777777777777",
    airdropContract: "0x8888888888888888888888888888888888888888",
  },
  // Base Goerli
  84531: {
    supportContract: "0x9999999999999999999999999999999999999999",
    airdropContract: "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  },
} as const;

export type SupportedChainId = keyof typeof CONTRACT_ADDRESSES;

export function getContractAddress(chainId: number, contractType: 'supportContract' | 'airdropContract'): string | undefined {
  const addresses = CONTRACT_ADDRESSES[chainId as SupportedChainId];
  return addresses?.[contractType];
}

// Contract interaction helpers
export interface ContractCallParams {
  functionName: string;
  args?: any[];
  value?: bigint;
}

export interface TransactionResult {
  hash: string;
  status: 'pending' | 'success' | 'failed';
  gasUsed?: bigint;
  error?: string;
}

// Gas estimation helpers
export function estimateGasForFunction(functionName: string): bigint {
  const gasEstimates: Record<string, bigint> = {
    validateWallet: parseEther("0.001"),
    claimAirdrop: parseEther("0.002"),
    stakeTokens: parseEther("0.003"),
    unstakeTokens: parseEther("0.002"),
    bridgeAssets: parseEther("0.005"),
    swapTokens: parseEther("0.004"),
    transferNFT: parseEther("0.003"),
  };
  
  return gasEstimates[functionName] || parseEther("0.002");
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
  return [11155111, 80001, 84531].includes(chainId);
}
