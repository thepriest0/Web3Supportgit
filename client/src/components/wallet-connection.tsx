import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWeb3 } from '@/providers/web3-provider';
import { getNetworkName, isTestnet } from '@/lib/contracts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { formatEther } from 'viem';
import { useBalance } from 'wagmi';

interface WalletConnectionProps {
  showBalance?: boolean;
  showNetworkWarning?: boolean;
  compact?: boolean;
}

export function WalletConnection({ 
  showBalance = false, 
  showNetworkWarning = true,
  compact = false 
}: WalletConnectionProps) {
  const { isConnected, address, chainId } = useWeb3();
  const { data: balance } = useBalance({
    address: address as `0x${string}` | undefined,
  });

  if (!isConnected) {
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
        
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            const ready = mounted && authenticationStatus !== 'loading';
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === 'authenticated');

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  'style': {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <Button
                        onClick={openConnectModal}
                        size={compact ? "default" : "lg"}
                        className={`${compact ? '' : 'w-full'} bg-blue-500 hover:bg-blue-600 text-white`}
                      >
                        <Wallet className="w-4 h-4 mr-2" />
                        Connect Wallet
                      </Button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <Button
                        onClick={openChainModal}
                        variant="destructive"
                        size={compact ? "default" : "lg"}
                        className={compact ? '' : 'w-full'}
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Wrong network
                      </Button>
                    );
                  }

                  return (
                    <div className={`flex ${compact ? 'items-center space-x-2' : 'flex-col space-y-2'}`}>
                      <Button
                        onClick={openAccountModal}
                        variant="outline"
                        size={compact ? "default" : "lg"}
                        className={`${compact ? '' : 'w-full'} flex items-center justify-between`}
                      >
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{account.displayName}</span>
                        </div>
                        {!compact && balance && (
                          <span className="text-sm font-medium">
                            {parseFloat(formatEther(balance.value)).toFixed(4)} {balance.symbol}
                          </span>
                        )}
                      </Button>
                      
                      {!compact && (
                        <Button
                          onClick={openChainModal}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <span>{chain.name}</span>
                          {chain.hasIcon && (
                            <div className="w-4 h-4 ml-2">
                              {chain.iconUrl && (
                                <img
                                  alt={chain.name ?? 'Chain icon'}
                                  src={chain.iconUrl}
                                  className="w-4 h-4"
                                />
                              )}
                            </div>
                          )}
                        </Button>
                      )}
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    );
  }

  return (
    <div className={`${compact ? 'inline-block' : 'space-y-4'}`}>
      {/* Connected State */}
      <div className={`${compact ? 'flex items-center space-x-2' : 'text-center'}`}>
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            const ready = mounted && authenticationStatus !== 'loading';
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === 'authenticated');

            if (!connected) {
              return (
                <Button
                  onClick={openConnectModal}
                  size={compact ? "default" : "lg"}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              );
            }

            if (chain?.unsupported) {
              return (
                <Button
                  onClick={openChainModal}
                  variant="destructive"
                  size={compact ? "default" : "lg"}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Wrong network
                </Button>
              );
            }

            return (
              <div className={`flex ${compact ? 'items-center space-x-2' : 'flex-col space-y-2'}`}>
                <Button
                  onClick={openAccountModal}
                  variant="outline"
                  size={compact ? "default" : "lg"}
                  className="flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{account?.displayName}</span>
                  {showBalance && balance && (
                    <Badge variant="secondary" className="ml-2">
                      {parseFloat(formatEther(balance.value)).toFixed(4)} {balance.symbol}
                    </Badge>
                  )}
                </Button>
                
                {!compact && chain && (
                  <Button
                    onClick={openChainModal}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <span>{chain.name}</span>
                    {chain.hasIcon && chain.iconUrl && (
                      <img
                        alt={chain.name ?? 'Chain icon'}
                        src={chain.iconUrl}
                        className="w-4 h-4"
                      />
                    )}
                  </Button>
                )}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>

      {/* Network Warning */}
      {showNetworkWarning && chainId && isTestnet(chainId) && (
        <Alert className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Testnet Mode:</strong> You are connected to {getNetworkName(chainId)}. 
            Transactions will not affect real assets.
          </AlertDescription>
        </Alert>
      )}

      {/* Balance Display */}
      {showBalance && balance && !compact && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Wallet Balance</span>
            <span className="text-lg font-semibold text-gray-900">
              {parseFloat(formatEther(balance.value)).toFixed(6)} {balance.symbol}
            </span>
          </div>
          {chainId && (
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">Network</span>
              <span className="text-xs text-gray-700">{getNetworkName(chainId)}</span>
            </div>
          )}
        </div>
      )}

      {/* Wallet Address */}
      {address && !compact && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Address</span>
            <div className="flex items-center space-x-2">
              <code className="text-xs font-mono text-gray-800">
                {address.slice(0, 6)}...{address.slice(-4)}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (chainId) {
                    const explorerUrl = chainId === 1 
                      ? `https://etherscan.io/address/${address}`
                      : chainId === 137
                        ? `https://polygonscan.com/address/${address}`
                        : chainId === 8453
                          ? `https://basescan.org/address/${address}`
                          : `https://etherscan.io/address/${address}`;
                    window.open(explorerUrl, '_blank');
                  }
                }}
                className="h-auto p-1"
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WalletConnection;
