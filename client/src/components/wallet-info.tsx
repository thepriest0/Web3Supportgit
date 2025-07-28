import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Shield, Smartphone, Globe, Zap, Star } from 'lucide-react';

const walletCategories = [
  {
    title: 'Popular Wallets',
    description: 'Most widely used and trusted Web3 wallets',
    wallets: [
      {
        name: 'MetaMask',
        description: 'The most popular Ethereum wallet with 100M+ users',
        features: ['Browser Extension', 'Mobile App', 'Hardware Support'],
        icon: '🦊',
        users: '100M+',
        chains: ['Ethereum', 'Polygon', 'BSC', 'Avalanche']
      },
      {
        name: 'Coinbase Wallet',
        description: 'Enterprise-grade security with institutional backing',
        features: ['Biometric Auth', 'Multi-chain', '44K+ Assets'],
        icon: '🟦',
        users: 'Large',
        chains: ['Ethereum', 'Polygon', 'Base', 'Arbitrum']
      },
      {
        name: 'Trust Wallet',
        description: 'Mobile-first multi-chain wallet supporting 70+ blockchains',
        features: ['Mobile-First', '1M+ Tokens', 'Built-in DApp Browser'],
        icon: '🛡️',
        users: 'High',
        chains: ['70+ Blockchains', 'Multi-chain Leader']
      },
      {
        name: 'Phantom',
        description: 'Solana-optimized wallet with Ethereum support',
        features: ['Solana Native', 'NFT Support', 'Built-in Staking'],
        icon: '👻',
        users: 'Growing',
        chains: ['Solana', 'Ethereum', 'Polygon']
      },
      {
        name: 'Rainbow Wallet',
        description: 'Beautiful Ethereum wallet with advanced features',
        features: ['Beautiful UI', 'DeFi Native', 'Portfolio Tracking'],
        icon: '🌈',
        users: 'Popular',
        chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism']
      }
    ]
  },
  {
    title: 'Advanced Options',
    description: 'Specialized wallets for power users and specific needs',
    wallets: [
      {
        name: 'Safe (Gnosis Safe)',
        description: 'Multi-signature wallet for teams and organizations',
        features: ['Multi-sig', 'Team Management', 'Enterprise'],
        icon: '🔐',
        users: 'Enterprise',
        chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Gnosis']
      },
      {
        name: 'Ledger',
        description: 'Hardware wallet integration for maximum security',
        features: ['Hardware Security', 'Cold Storage', 'Multi-asset'],
        icon: '🔑',
        users: 'Security-focused',
        chains: ['Multi-chain', 'Hardware Support']
      },
      {
        name: 'Rabby Wallet',
        description: 'Multi-chain wallet with advanced transaction preview',
        features: ['Transaction Preview', 'Multi-chain', 'DeFi Optimized'],
        icon: '🐰',
        users: 'DeFi Users',
        chains: ['Ethereum', 'BSC', 'Polygon', 'Arbitrum']
      },
      {
        name: 'Zerion Wallet',
        description: 'DeFi-native wallet with portfolio management',
        features: ['Portfolio Tracking', 'DeFi Native', 'Analytics'],
        icon: '💎',
        users: 'DeFi Enthusiasts',
        chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism']
      }
    ]
  }
];

export function WalletInfo() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Supported Web3 Wallets
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Connect with any of the 20+ supported wallets to access real DeFi protocols and resolve your Web3 issues
        </p>
      </div>

      {walletCategories.map((category) => (
        <div key={category.title} className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              {category.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {category.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.wallets.map((wallet) => (
              <Card key={wallet.name} className="hover:shadow-lg transition-shadow">
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{wallet.icon}</span>
                    <Badge variant="secondary" className="text-xs">
                      {wallet.users}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{wallet.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {wallet.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Key Features
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {wallet.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Supported Networks
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {wallet.chains.map((chain) => (
                        <Badge key={chain} variant="secondary" className="text-xs">
                          {chain}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <Shield className="h-5 w-5" />
            Security & Compatibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                All Wallets Support
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Real DeFi protocol interactions</li>
                <li>• Multi-chain transactions</li>
                <li>• Hardware wallet integration</li>
                <li>• Secure transaction signing</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Access Methods
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Browser extensions</li>
                <li>• Mobile applications</li>
                <li>• WalletConnect protocol</li>
                <li>• Hardware device connections</li>
              </ul>
            </div>
          </div>
          <div className="pt-4 border-t border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> AllDappNet integrates with real protocols like Uniswap V3 and Aave V3. 
              Your transactions are executed on actual blockchain networks, not simulations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}