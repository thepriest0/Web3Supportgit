import { useAccount, useSignMessage, useWriteContract, useSwitchChain } from 'wagmi';
import { useCallback, useState } from 'react';
import { parseEther } from 'viem';
import { executeProtocolOperation, validateWalletAddress, getTokenBalance, estimateProtocolGas } from '@/lib/protocol-operations';
import { getProtocolAddress, getTokenAddress, isMainnet } from '@/lib/real-contracts';
import { useToast } from '@/hooks/use-toast';

export function useProtocolOperations() {
  const { address, chainId, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { writeContractAsync } = useWriteContract();
  const { switchChain } = useSwitchChain();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [gasEstimate, setGasEstimate] = useState<bigint | null>(null);

  // Validate wallet by signing a message
  const validateWallet = useCallback(async () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return false;
    }

    try {
      setLoading(true);
      
      // Basic validation
      const isValid = await validateWalletAddress(address);
      if (!isValid) {
        toast({
          title: "Invalid wallet address",
          description: "Your wallet address appears to be invalid",
          variant: "destructive",
        });
        return false;
      }

      // Sign validation message
      const message = `Validate wallet: ${address} at ${new Date().toISOString()}`;
      const signature = await signMessageAsync({ message });
      
      toast({
        title: "Wallet validated successfully",
        description: "Your wallet has been verified and is ready to use",
      });
      
      return { isValid: true, signature, message };
    } catch (error) {
      toast({
        title: "Wallet validation failed",
        description: error instanceof Error ? error.message : "Failed to validate wallet",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [isConnected, address, signMessageAsync, toast]);

  // Fix slippage issues using Uniswap
  const fixSlippageIssue = useCallback(async (
    tokenIn: string,
    tokenOut: string,
    amountIn: string,
    slippageTolerance: number = 1
  ) => {
    if (!isConnected || !address || !chainId) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet and select a network",
        variant: "destructive",
      });
      return null;
    }

    try {
      setLoading(true);
      
      // Check if Uniswap is available on this chain
      const uniswapRouter = getProtocolAddress(chainId, 'UNISWAP_V2_ROUTER');
      if (!uniswapRouter) {
        toast({
          title: "Protocol not available",
          description: "Uniswap is not available on this network",
          variant: "destructive",
        });
        return null;
      }

      // Estimate gas
      const gas = await estimateProtocolGas('swap', chainId);
      setGasEstimate(gas);

      // Execute slippage fix
      const result = await executeProtocolOperation(
        'fix_slippage',
        { tokenIn, tokenOut, amountIn, slippageTolerance },
        chainId,
        address
      );

      toast({
        title: "Slippage protection enabled",
        description: `Successfully executed swap with ${slippageTolerance}% slippage protection`,
      });

      return result;
    } catch (error) {
      toast({
        title: "Slippage fix failed",
        description: error instanceof Error ? error.message : "Failed to fix slippage",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [isConnected, address, chainId, toast]);

  // Swap tokens using Uniswap V3
  const swapTokens = useCallback(async (
    tokenIn: string,
    tokenOut: string,
    amountIn: string
  ) => {
    if (!isConnected || !address || !chainId) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet and select a network",
        variant: "destructive",
      });
      return null;
    }

    try {
      setLoading(true);

      const result = await executeProtocolOperation(
        'swap_tokens',
        { tokenIn, tokenOut, amountIn },
        chainId,
        address
      );

      toast({
        title: "Tokens swapped successfully",
        description: `Successfully swapped ${amountIn} tokens using Uniswap V3`,
      });

      return result;
    } catch (error) {
      toast({
        title: "Token swap failed",
        description: error instanceof Error ? error.message : "Failed to swap tokens",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [isConnected, address, chainId, toast]);

  // Supply tokens to Aave for lending
  const supplyToLending = useCallback(async (
    asset: string,
    amount: string
  ) => {
    if (!isConnected || !address || !chainId) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet and select a network",
        variant: "destructive",
      });
      return null;
    }

    try {
      setLoading(true);

      // Check if Aave is available
      const aavePool = getProtocolAddress(chainId, 'AAVE_V3_POOL');
      if (!aavePool) {
        toast({
          title: "Protocol not available",
          description: "Aave lending is not available on this network",
          variant: "destructive",
        });
        return null;
      }

      const result = await executeProtocolOperation(
        'lend_tokens',
        { asset, amount },
        chainId,
        address
      );

      toast({
        title: "Tokens supplied successfully",
        description: `Successfully supplied ${amount} tokens to Aave`,
      });

      return result;
    } catch (error) {
      toast({
        title: "Supply failed",
        description: error instanceof Error ? error.message : "Failed to supply tokens",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [isConnected, address, chainId, toast]);

  // Withdraw tokens from Aave
  const withdrawFromLending = useCallback(async (
    asset: string,
    amount: string
  ) => {
    if (!isConnected || !address || !chainId) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet and select a network",
        variant: "destructive",
      });
      return null;
    }

    try {
      setLoading(true);

      const result = await executeProtocolOperation(
        'withdraw_tokens',
        { asset, amount },
        chainId,
        address
      );

      toast({
        title: "Tokens withdrawn successfully",
        description: `Successfully withdrew ${amount} tokens from Aave`,
      });

      return result;
    } catch (error) {
      toast({
        title: "Withdrawal failed",
        description: error instanceof Error ? error.message : "Failed to withdraw tokens",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [isConnected, address, chainId, toast]);

  // Approve token spending for DeFi protocols
  const approveTokenSpending = useCallback(async (
    tokenAddress: string,
    spenderAddress: string,
    amount: string
  ) => {
    if (!isConnected || !address || !chainId) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet and select a network",
        variant: "destructive",
      });
      return null;
    }

    try {
      setLoading(true);

      const result = await executeProtocolOperation(
        'approve_token',
        { tokenAddress, spenderAddress, amount },
        chainId,
        address
      );

      toast({
        title: "Token approval successful",
        description: "Protocol can now spend your tokens",
      });

      return result;
    } catch (error) {
      toast({
        title: "Approval failed",
        description: error instanceof Error ? error.message : "Failed to approve token spending",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [isConnected, address, chainId, toast]);

  // Get token balance
  const checkTokenBalance = useCallback(async (
    tokenAddress: string
  ): Promise<string> => {
    if (!isConnected || !address || !chainId) return '0';

    try {
      return await getTokenBalance(tokenAddress, address, chainId);
    } catch (error) {
      console.error('Error checking token balance:', error);
      return '0';
    }
  }, [isConnected, address, chainId]);

  // Switch to optimal network for operation
  const switchToOptimalNetwork = useCallback(async (operation: string) => {
    if (!switchChain) return false;

    try {
      // Determine optimal network based on operation
      let targetChainId: number;
      
      switch (operation) {
        case 'swap':
        case 'lending':
          targetChainId = 1; // Ethereum mainnet for best liquidity
          break;
        case 'nft':
          targetChainId = 1; // Ethereum for NFTs
          break;
        case 'polygon_defi':
          targetChainId = 137; // Polygon for lower fees
          break;
        default:
          targetChainId = 1; // Default to Ethereum
      }

      if (chainId === targetChainId) return true; // Already on correct network

      await switchChain({ chainId: targetChainId });
      
      toast({
        title: "Network switched",
        description: `Switched to optimal network for ${operation}`,
      });

      return true;
    } catch (error) {
      toast({
        title: "Network switch failed",
        description: error instanceof Error ? error.message : "Failed to switch network",
        variant: "destructive",
      });
      return false;
    }
  }, [chainId, switchChain, toast]);

  return {
    // State
    loading,
    gasEstimate,
    isConnected,
    address,
    chainId,
    isMainnet: chainId ? isMainnet(chainId) : false,

    // Operations
    validateWallet,
    fixSlippageIssue,
    swapTokens,
    supplyToLending,
    withdrawFromLending,
    approveTokenSpending,
    checkTokenBalance,
    switchToOptimalNetwork,

    // Utilities
    getProtocolAddress: (protocol: string) => chainId ? getProtocolAddress(chainId, protocol) : null,
    getTokenAddress: (symbol: string) => chainId ? getTokenAddress(chainId, symbol) : null,
  };
}