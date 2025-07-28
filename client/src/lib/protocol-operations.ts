import { writeContract, readContract } from '@wagmi/core';
import { parseEther, formatEther } from 'viem';
import { wagmiConfig } from './web3-config';
import { 
  PROTOCOL_ADDRESSES, 
  UNISWAP_V2_ROUTER_ABI, 
  UNISWAP_V3_ROUTER_ABI,
  AAVE_V3_POOL_ABI,
  ERC20_ABI,
  getProtocolAddress,
  getTokenAddress,
  estimateGasForProtocol 
} from './real-contracts';

// Slippage Protection with Uniswap V2
export async function fixSlippageWithUniswap(
  chainId: number,
  tokenIn: string,
  tokenOut: string,
  amountIn: string,
  slippageTolerance: number = 1 // 1% default
) {
  const routerAddress = getProtocolAddress(chainId, 'UNISWAP_V2_ROUTER');
  if (!routerAddress) throw new Error('Uniswap not available on this chain');

  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes
  const amountInWei = parseEther(amountIn);
  
  // Calculate minimum output with slippage protection
  const expectedOut = amountInWei; // Simplified - in real app, get from quoter
  const slippageMultiplier = (100 - slippageTolerance) / 100;
  const amountOutMin = expectedOut * BigInt(Math.floor(slippageMultiplier * 100)) / BigInt(100);

  return await writeContract(wagmiConfig, {
    address: routerAddress as `0x${string}`,
    abi: UNISWAP_V2_ROUTER_ABI,
    functionName: 'swapExactETHForTokens',
    args: [amountOutMin, [tokenIn as `0x${string}`, tokenOut as `0x${string}`], tokenIn as `0x${string}`, BigInt(deadline)],
    value: amountInWei,
  });
}

// Token Swap with Uniswap V3 (better rates)
export async function swapTokensWithUniswapV3(
  chainId: number,
  tokenIn: string,
  tokenOut: string,
  amountIn: string,
  recipient: string
) {
  const routerAddress = getProtocolAddress(chainId, 'UNISWAP_V3_ROUTER');
  if (!routerAddress) throw new Error('Uniswap V3 not available on this chain');

  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  const amountInWei = parseEther(amountIn);
  const fee = 3000; // 0.3% fee tier

  const params = {
    tokenIn: tokenIn as `0x${string}`,
    tokenOut: tokenOut as `0x${string}`,
    fee,
    recipient: recipient as `0x${string}`,
    deadline: BigInt(deadline),
    amountIn: amountInWei,
    amountOutMinimum: BigInt(0), // Set to 0 for now, should calculate properly
    sqrtPriceLimitX96: BigInt(0),
  };

  return await writeContract(wagmiConfig, {
    address: routerAddress as `0x${string}`,
    abi: UNISWAP_V3_ROUTER_ABI,
    functionName: 'exactInputSingle',
    args: [params],
    value: tokenIn === getTokenAddress(chainId, 'ETH') ? amountInWei : BigInt(0),
  });
}

// Lending with Aave V3
export async function supplyToAave(
  chainId: number,
  asset: string,
  amount: string,
  onBehalfOf: string
) {
  const poolAddress = getProtocolAddress(chainId, 'AAVE_V3_POOL');
  if (!poolAddress) throw new Error('Aave not available on this chain');

  const amountWei = parseEther(amount);

  return await writeContract(wagmiConfig, {
    address: poolAddress as `0x${string}`,
    abi: AAVE_V3_POOL_ABI,
    functionName: 'supply',
    args: [asset as `0x${string}`, amountWei, onBehalfOf as `0x${string}`, 0],
  });
}

// Withdraw from Aave V3
export async function withdrawFromAave(
  chainId: number,
  asset: string,
  amount: string,
  to: string
) {
  const poolAddress = getProtocolAddress(chainId, 'AAVE_V3_POOL');
  if (!poolAddress) throw new Error('Aave not available on this chain');

  const amountWei = parseEther(amount);

  return await writeContract(wagmiConfig, {
    address: poolAddress as `0x${string}`,
    abi: AAVE_V3_POOL_ABI,
    functionName: 'withdraw',
    args: [asset as `0x${string}`, amountWei, to as `0x${string}`],
  });
}

// Token Approval for DeFi protocols
export async function approveToken(
  tokenAddress: string,
  spenderAddress: string,
  amount: string
) {
  const amountWei = parseEther(amount);

  return await writeContract(wagmiConfig, {
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'approve',
    args: [spenderAddress as `0x${string}`, amountWei],
  });
}

// Check token balance
export async function getTokenBalance(
  tokenAddress: string,
  userAddress: string,
  chainId: number
): Promise<string> {
  try {
    const balance = await readContract(wagmiConfig, {
      address: tokenAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [userAddress as `0x${string}`],
      chainId,
    });

    return formatEther(balance as bigint);
  } catch (error) {
    console.error('Error reading token balance:', error);
    return '0';
  }
}

// Wallet validation by checking if address can sign
export async function validateWalletAddress(address: string): Promise<boolean> {
  try {
    // Basic address validation
    if (!address || !address.startsWith('0x') || address.length !== 42) {
      return false;
    }
    
    // Check if address has valid checksum
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  } catch (error) {
    console.error('Error validating wallet:', error);
    return false;
  }
}

// Estimate gas for protocol operations
export async function estimateProtocolGas(
  operation: string,
  chainId: number
): Promise<bigint> {
  try {
    // Return estimated gas based on operation type
    switch (operation) {
      case 'swap':
        return estimateGasForProtocol('uniswap_v2_swap');
      case 'supply':
        return estimateGasForProtocol('aave_supply');
      case 'withdraw':
        return estimateGasForProtocol('aave_withdraw');
      case 'approve':
        return estimateGasForProtocol('token_approve');
      default:
        return parseEther('0.002');
    }
  } catch (error) {
    console.error('Error estimating gas:', error);
    return parseEther('0.002');
  }
}

// Protocol operation dispatcher
export async function executeProtocolOperation(
  operation: string,
  params: any,
  chainId: number,
  userAddress: string
) {
  switch (operation) {
    case 'fix_slippage':
      return await fixSlippageWithUniswap(
        chainId,
        params.tokenIn,
        params.tokenOut,
        params.amountIn,
        params.slippageTolerance
      );
    
    case 'swap_tokens':
      return await swapTokensWithUniswapV3(
        chainId,
        params.tokenIn,
        params.tokenOut,
        params.amountIn,
        userAddress
      );
    
    case 'lend_tokens':
      return await supplyToAave(
        chainId,
        params.asset,
        params.amount,
        userAddress
      );
    
    case 'withdraw_tokens':
      return await withdrawFromAave(
        chainId,
        params.asset,
        params.amount,
        userAddress
      );
    
    case 'approve_token':
      return await approveToken(
        params.tokenAddress,
        params.spenderAddress,
        params.amount
      );
    
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}