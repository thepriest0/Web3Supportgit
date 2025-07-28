import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Wallet, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { FakeWalletModal } from './fake-wallet-modal';

interface WalletConnectionProps {
  showBalance?: boolean;
  showNetworkWarning?: boolean;
  compact?: boolean;
}

const FAKE_WALLETS = [
  { name: 'Xaman wallet', icon: '/wallet-icons/xaman.png' },
  { name: 'Phantom wallet', icon: '/wallet-icons/phantom.png' },
  { name: 'Solana Wallet', icon: '/wallet-icons/solana.png' },
  { name: 'UNISWAP Wallet', icon: '/wallet-icons/uniswap.png' },
  { name: 'Best Wallet', icon: '/wallet-icons/best.png' },
  { name: 'Wallet Connect', icon: '/wallet-icons/walletconnect.png' },
  { name: 'Trust', icon: '/wallet-icons/trust.png' },
  { name: 'Solfare Wallet', icon: '/wallet-icons/solfare.png' },
  { name: 'Metamask', icon: '/wallet-icons/metamask.png' },
  { name: 'Ledger', icon: '/wallet-icons/ledger.png' },
  { name: 'Coinbase', icon: '/wallet-icons/coinbase.png' },
  { name: 'Unisat Wallet', icon: '/wallet-icons/unisat.png' },
  { name: 'okx Wallet', icon: '/wallet-icons/okx.png' },
  { name: 'Sui Wallet', icon: '/wallet-icons/sui.png' },
  { name: 'Leather Wallet', icon: '/wallet-icons/leather.png' },
  { name: 'APTOS Wallet', icon: '/wallet-icons/aptos.png' },
  { name: 'Asigna Wallet', icon: '/wallet-icons/asigna.png' },
  { name: 'AVAXC Wallet', icon: '/wallet-icons/avaxc.png' },
  { name: 'Base Wallet', icon: '/wallet-icons/base.png' },
  { name: 'BITTENSOR Wallet', icon: '/wallet-icons/bittensor.png' },
  { name: 'AURORA Wallet', icon: '/wallet-icons/aurora.png' },
  { name: 'Xverse Wallet', icon: '/wallet-icons/xverse.png' },
  { name: 'OPTIMISM Wallet', icon: '/wallet-icons/optimism.png' },
  { name: 'MyTon Wallet', icon: '/wallet-icons/myton.png' }
];

export function WalletConnection({ 
  showBalance = false, 
  showNetworkWarning = true,
  compact = false 
}: WalletConnectionProps) {
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleWalletSelect = (walletName: string) => {
    setSelectedWallet(walletName);
    setShowWalletSelector(false);
    setShowWalletModal(true);
  };

  // Always show as disconnected for testing phase
  return (
    <div className={`${compact ? 'inline-block' : 'text-center space-y-4'}`}>
      {!compact && (
        <div className="flex flex-col items-center space-y-3 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Connect Your Wallet</h3>
            <p className="text-gray-600 text-sm">
              Connect your wallet to access Web3 support services
            </p>
          </div>
        </div>
      )}
      
      <Button
        onClick={() => setShowWalletSelector(true)}
        size={compact ? "default" : "lg"}
        className={`${compact ? '' : 'w-full'} bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium`}
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>

      {/* Wallet Selector Dialog */}
      <Dialog open={showWalletSelector} onOpenChange={setShowWalletSelector}>
        <DialogContent className="sm:max-w-md bg-white shadow-2xl border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded flex items-center justify-center">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              Connect a Wallet
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Choose your preferred wallet to connect and access Web3 support services
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {FAKE_WALLETS.map((wallet) => (
              <Button
                key={wallet.name}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                onClick={() => handleWalletSelect(wallet.name)}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{wallet.icon}</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{wallet.name}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Fake Wallet Connection Modal */}
      {selectedWallet && (
        <FakeWalletModal
          isOpen={showWalletModal}
          onClose={() => {
            setShowWalletModal(false);
            setSelectedWallet(null);
          }}
          walletName={selectedWallet}
          walletIcon={FAKE_WALLETS.find(w => w.name === selectedWallet)?.icon}
        />
      )}
    </div>
  );
}

export default WalletConnection;
