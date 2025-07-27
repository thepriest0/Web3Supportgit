import { useAccount, useConnect, useDisconnect, useSignMessage, useWriteContract, useReadContract, useSwitchChain } from 'wagmi';
import { useCallback, useState } from 'react';
import { SUPPORT_CONTRACT_ABI, getContractAddress, estimateGasForFunction, isTestnet } from '@/lib/contracts';
import { useToast } from '@/hooks/use-toast';

export function useWeb3Operations() {
  const { address, chainId, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { writeContractAsync } = useWriteContract();
  const { switchChain } = useSwitchChain();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const signMessage = useCallback(async (message: string) => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return null;
    }

    try {
      setLoading(true);
      const signature = await signMessageAsync({ message });
      toast({
        title: "Message signed successfully",
        description: "Your wallet signature has been verified",
      });
      return signature;
    } catch (error) {
      toast({
        title: "Signature failed",
        description: error instanceof Error ? error.message : "Failed to sign message",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [isConnected, address, signMessageAsync, toast]);

  const executeContractFunction = useCallback(async (
    functionName: string,
    args: any[] = [],
    value?: bigint
  ) => {
    if (!isConnected || !address || !chainId) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return null;
    }

    const contractAddress = getContractAddress(chainId, 'supportContract');
    if (!contractAddress) {
      toast({
        title: "Unsupported network",
        description: "This network is not supported for this operation",
        variant: "destructive",
      });
      return null;
    }

    try {
      setLoading(true);
      
      // Show testnet warning
      if (isTestnet(chainId)) {
        toast({
          title: "Testnet Transaction",
          description: "You are using a testnet. This transaction will not affect real assets.",
        });
      }

      const hash = await writeContractAsync({
        abi: SUPPORT_CONTRACT_ABI,
        address: contractAddress as `0x${string}`,
        functionName: functionName as any,
        args: args as any,
        value,
      });

      toast({
        title: "Transaction submitted",
        description: `Transaction hash: ${hash}`,
      });

      return hash;
    } catch (error) {
      toast({
        title: "Transaction failed",
        description: error instanceof Error ? error.message : "Failed to execute transaction",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [isConnected, address, chainId, writeContractAsync, toast]);

  const validateWallet = useCallback(async () => {
    if (!address) return null;
    return executeContractFunction('validateWallet', [address]);
  }, [address, executeContractFunction]);

  const claimAirdrop = useCallback(async (merkleProof: string[]) => {
    return executeContractFunction('claimAirdrop', [merkleProof]);
  }, [executeContractFunction]);

  const stakeTokens = useCallback(async (amount: bigint) => {
    return executeContractFunction('stakeTokens', [amount], amount);
  }, [executeContractFunction]);

  const bridgeAssets = useCallback(async (tokenAddress: string, amount: bigint) => {
    return executeContractFunction('bridgeAssets', [tokenAddress, amount], amount);
  }, [executeContractFunction]);

  const switchToSupportedNetwork = useCallback(async (targetChainId: number) => {
    try {
      await switchChain({ chainId: targetChainId });
      toast({
        title: "Network switched",
        description: "Successfully switched to the supported network",
      });
    } catch (error) {
      toast({
        title: "Network switch failed",
        description: error instanceof Error ? error.message : "Failed to switch network",
        variant: "destructive",
      });
    }
  }, [switchChain, toast]);

  return {
    address,
    chainId,
    isConnected,
    loading,
    signMessage,
    validateWallet,
    claimAirdrop,
    stakeTokens,
    bridgeAssets,
    executeContractFunction,
    switchToSupportedNetwork,
  };
}
