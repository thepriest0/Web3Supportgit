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
  { name: 'MetaMask', icon: '🦊' },
  { name: 'Coinbase Wallet', icon: '🔷' },
  { name: 'WalletConnect', icon: '🔗' },
  { name: 'Trust Wallet', icon: '🛡️' },
  { name: 'Phantom', icon: '👻' },
  { name: 'SafeWallet', icon: '🔒' },
  { name: 'Rainbow', icon: '🌈' },
  { name: 'Uniswap Wallet', icon: '🦄' },
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
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Wallet className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Connect Your Wallet</h3>
            <p className="text-gray-600 text-sm">
              Connect your wallet to access Web3 support services
            </p>
          </div>
        </div>
      )}
      
      <Button
        onClick={() => setShowWalletSelector(true)}
        size={compact ? "default" : "lg"}
        className={`${compact ? '' : 'w-full'} bg-blue-500 hover:bg-blue-600 text-white`}
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>

      {/* Wallet Selector Dialog */}
      <Dialog open={showWalletSelector} onOpenChange={setShowWalletSelector}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect a Wallet</DialogTitle>
            <DialogDescription>
              Choose your preferred wallet to connect
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            {FAKE_WALLETS.map((wallet) => (
              <Button
                key={wallet.name}
                variant="outline"
                className="h-16 flex flex-col items-center justify-center space-y-2"
                onClick={() => handleWalletSelect(wallet.name)}
              >
                <span className="text-2xl">{wallet.icon}</span>
                <span className="text-sm">{wallet.name}</span>
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
