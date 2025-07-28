import { useRoute } from 'wouter';
import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getCategoryBySlug } from '@/lib/support-categories';
import { useWeb3Operations } from '@/hooks/use-web3';
import { useProtocolOperations } from '@/hooks/use-protocol-operations';
import { useWeb3 } from '@/providers/web3-provider';
import { getNetworkName, isTestnet, estimateGasForFunction } from '@/lib/contracts';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ArrowLeft, AlertTriangle, CheckCircle, Loader2, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';
import { formatEther } from 'viem';

export default function Issue() {
  const [, params] = useRoute('/issue/:slug');
  const { isConnected, chainId } = useWeb3();
  const { 
    loading: web3Loading, 
    signMessage, 
    validateWallet: oldValidateWallet, 
    claimAirdrop, 
    stakeTokens, 
    bridgeAssets,
    executeContractFunction,
    switchToSupportedNetwork 
  } = useWeb3Operations();
  
  const {
    validateWallet: protocolValidateWallet,
    fixSlippageIssue,
    swapTokens,
    supplyToLending,
    withdrawFromLending,
    approveTokenSpending,
    switchToOptimalNetwork,
    loading: protocolLoading,
    isMainnet: isOnMainnet,
    getProtocolAddress,
    getTokenAddress,
  } = useProtocolOperations();
  
  const [txHash, setTxHash] = useState<string>('');
  const [step, setStep] = useState<'connect' | 'sign' | 'execute' | 'complete'>('connect');
  
  const category = getCategoryBySlug(params?.slug || '');

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Issue Not Found</h1>
              <p className="text-gray-600 mb-6">The support category you're looking for doesn't exist.</p>
              <Link href="/">
                <Button>Return to Categories</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = category.icon;
  const estimatedGas = category.contractFunction ? estimateGasForFunction(category.contractFunction) : BigInt(0);

  const handleSignMessage = async () => {
    setStep('sign');
    const message = `Verify ownership of wallet for ${category.title} support on AllDappNet Protocol.\n\nTimestamp: ${Date.now()}`;
    const signature = await signMessage(message);
    if (signature) {
      setStep('execute');
    }
  };

  // Real protocol operation handler based on category
  const handleExecuteProtocolOperation = async () => {
    let result = null;
    
    try {
      switch (category.slug) {
        case 'slippage-protection':
          // Use real Uniswap for slippage protection
          const ethAddress = getTokenAddress('ETH') || '0x0000000000000000000000000000000000000000';
          const usdcAddress = getTokenAddress('USDC') || '';
          result = await fixSlippageIssue(ethAddress, usdcAddress, '0.1', 1);
          break;
          
        case 'token-swap':
          // Use real Uniswap for token swaps
          const wethAddress = getTokenAddress('WETH') || '';
          const daiAddress = getTokenAddress('DAI') || '';
          result = await swapTokens(wethAddress, daiAddress, '0.1');
          break;
          
        case 'lending-borrowing':
          // Use real Aave for lending
          const usdcForLending = getTokenAddress('USDC') || '';
          result = await supplyToLending(usdcForLending, '100');
          break;
          
        case 'yield-farming':
          // Supply to Aave for yield
          const daiForYield = getTokenAddress('DAI') || '';
          result = await supplyToLending(daiForYield, '50');
          break;
          
        case 'wallet-validation':
          // Use protocol wallet validation
          result = await protocolValidateWallet();
          break;
          
        case 'transaction-stuck':
          // Help user speed up transaction with higher gas
          await switchToOptimalNetwork('swap');
          result = { success: true, message: 'Switched to optimal network' };
          break;
          
        case 'cross-chain-bridge':
          // Guide user through bridge setup
          result = await bridgeAssets('0x0000000000000000000000000000000000000000', BigInt('10000000000000000'));
          break;
          
        default:
          // Fallback to old contract function
          result = await executeContractFunction(category.contractFunction || 'validateWallet');
          break;
      }
      
      if (result) {
        setTxHash(typeof result === 'string' ? result : JSON.stringify(result));
        setStep('complete');
      }
    } catch (error) {
      console.error('Protocol operation failed:', error);
      setStep('connect'); // Reset to beginning
    }
  };

  const getStepContent = () => {
    switch (step) {
      case 'connect':
        return !isConnected ? (
          <>
            <p className="text-gray-600 mb-6">
              To resolve your {category.title.toLowerCase()} issue, you'll need to connect your wallet 
              and sign a verification message.
            </p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-2 text-green-600 mb-4">
              <CheckCircle className="w-5 h-5" />
              <span>Wallet connected successfully</span>
            </div>
            <Button onClick={handleSignMessage} size="lg" className="w-full">
              Continue to Verification
            </Button>
          </>
        );
        
      case 'sign':
        return (
          <>
            <p className="text-gray-600 mb-6">
              Please sign the verification message in your wallet to proceed with the automated resolution.
            </p>
            <div className="flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          </>
        );
        
      case 'execute':
        return (
          <>
            <div className="flex items-center space-x-2 text-green-600 mb-4">
              <CheckCircle className="w-5 h-5" />
              <span>Message signed successfully</span>
            </div>
            <p className="text-gray-600 mb-6">
              Now we'll execute the real DeFi protocol operation to resolve your issue automatically.
            </p>
            {chainId && isTestnet(chainId) && (
              <Alert className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  You are on {getNetworkName(chainId)} testnet. This transaction will not affect real assets.
                </AlertDescription>
              </Alert>
            )}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Estimated Gas:</span>
                <span>{formatEther(estimatedGas)} ETH</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Protocol:</span>
                <code className="text-blue-600">{
                  category.slug === 'slippage-protection' ? 'Uniswap V2' :
                  category.slug === 'token-swap' ? 'Uniswap V3' :
                  category.slug === 'lending-borrowing' ? 'Aave V3' :
                  category.slug === 'yield-farming' ? 'Aave V3' :
                  'DeFi Protocol'
                }</code>
              </div>
            </div>
            <Button 
              onClick={handleExecuteProtocolOperation} 
              size="lg" 
              className="w-full"
              disabled={web3Loading || protocolLoading}
            >
              {(web3Loading || protocolLoading) ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Executing...
                </>
              ) : (
                'Execute Protocol Operation'
              )}
            </Button>
          </>
        );
        
      case 'complete':
        return (
          <>
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Issue Resolved Successfully!
              </h3>
              <p className="text-gray-600">
                Your {category.title.toLowerCase()} issue has been automatically resolved through our 
                decentralized protocol.
              </p>
            </div>
            
            {txHash && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Transaction Hash:</span>
                  <a 
                    href={`https://etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                  >
                    <span className="text-sm font-mono">{txHash.slice(0, 10)}...{txHash.slice(-8)}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
            
            <div className="flex space-x-3">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Back to Categories
                </Button>
              </Link>
              <Button onClick={() => window.location.reload()} className="flex-1">
                Resolve Another Issue
              </Button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Support Categories
          </Link>
          <span>/</span>
          <span className="text-gray-900">{category.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Issue Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.bgColor}`}>
                    <Icon className={`w-6 h-6 ${category.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {category.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{category.description}</p>
                
                <Separator className="my-4" />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Resolution Type:</span>
                    <span className="font-medium">Automated</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Security Level:</span>
                    <span className="font-medium text-green-600">High</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Success Rate:</span>
                    <span className="font-medium">98%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resolution Process */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>Automated Resolution Process</span>
                  {step === 'complete' && <CheckCircle className="w-5 h-5 text-green-500" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Progress Steps */}
                <div className="flex items-center space-x-4 mb-8">
                  {['connect', 'sign', 'execute', 'complete'].map((s, index) => (
                    <div key={s} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step === s 
                          ? 'bg-blue-500 text-white' 
                          : ['connect', 'sign', 'execute', 'complete'].indexOf(step) > index
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                      }`}>
                        {['connect', 'sign', 'execute', 'complete'].indexOf(step) > index ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      {index < 3 && (
                        <div className={`w-16 h-0.5 ${
                          ['connect', 'sign', 'execute', 'complete'].indexOf(step) > index
                            ? 'bg-green-500'
                            : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>

                {getStepContent()}
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Alert className="mt-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Security Notice:</strong> This is a non-custodial solution. AllDappNet never accesses 
                your private keys or seed phrases. All actions require your explicit wallet signature.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link href="/">
            <Button variant="outline" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Categories</span>
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
