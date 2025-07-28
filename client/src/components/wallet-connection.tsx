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
  { name: 'MyTon Wallet', icon: '/wallet-icons/myton.png' },
  { name: 'Tonkeeper Wallet', icon: '/wallet-icons/tonkeeper.png' },
  { name: 'TonHub Wallet', icon: '/wallet-icons/tonhub.png' },
  { name: 'Electrum Wallet', icon: '/wallet-icons/electrum.png' },
  { name: 'Magic Eden Wallet', icon: '/wallet-icons/magiceden.png' },
  { name: 'STACKS Wallet', icon: '/wallet-icons/stacks.png' },
  { name: 'MOONBEAM', icon: '/wallet-icons/moonbeam.png' },
  { name: 'BRD wallet', icon: '/wallet-icons/brd.png' },
  { name: 'ETHPOW wallet', icon: '/wallet-icons/ethpow.png' },
  { name: 'TON wallet', icon: '/wallet-icons/ton.png' },
  { name: 'Saitamask wallet', icon: '/wallet-icons/saitamask.png' },
  { name: 'ARBITRUM wallet', icon: '/wallet-icons/arbitrum.png' },
  { name: 'Terra station', icon: '/wallet-icons/terrastation.png' },
  { name: 'METIS station', icon: '/wallet-icons/metis.png' },
  { name: 'CRO wallet', icon: '/wallet-icons/cro.png' },
  { name: 'Cosmos station', icon: '/wallet-icons/cosmos.png' },
  { name: 'CUBE Wallet', icon: '/wallet-icons/cube.png' },
  { name: 'Exodus wallet', icon: '/wallet-icons/exodus.png' },
  { name: 'OKC wallet', icon: '/wallet-icons/okc.png' },
  { name: 'Rainbow', icon: '/wallet-icons/rainbow.png' },
  { name: 'HECO', icon: '/wallet-icons/heco.png' },
  { name: 'Argent', icon: '/wallet-icons/argent.png' },
  { name: 'MOONRIVER', icon: '/wallet-icons/moonriver.png' },
  { name: 'Binance Chain', icon: '/wallet-icons/binance.png' },
  { name: 'Safemoon', icon: '/wallet-icons/safemoon.png' },
  { name: 'CELO', icon: '/wallet-icons/celo.png' },
  { name: 'Gnosis Safe', icon: '/wallet-icons/gnosis.png' },
  { name: 'FANTOM', icon: '/wallet-icons/fantom.png' },
  { name: 'DeFi', icon: '/wallet-icons/defi.png' },
  { name: 'LITECOIN', icon: '/wallet-icons/litecoin.png' },
  { name: 'Pillar', icon: '/wallet-icons/pillar.png' },
  { name: 'imToken', icon: '/wallet-icons/imtoken.png' },
  { name: 'POLYGON', icon: '/wallet-icons/polygon.png' },
  { name: 'CORE', icon: '/wallet-icons/core.png' },
  { name: 'BITCOINCASH', icon: '/wallet-icons/bitcoincash.png' },
  { name: 'ONTO', icon: '/wallet-icons/onto.png' },
  { name: 'BOBA', icon: '/wallet-icons/boba.png' },
  { name: 'EVMOS', icon: '/wallet-icons/evmos.png' },
  { name: 'THORCHAIN', icon: '/wallet-icons/thorchain.png' },
  { name: 'TokenPocket', icon: '/wallet-icons/tokenpocket.png' },
  { name: 'Aave', icon: '/wallet-icons/aave.png' },
  { name: 'Digitex', icon: '/wallet-icons/digitex.png' },
  { name: 'Portis', icon: '/wallet-icons/portis.png' },
  { name: 'Formatic', icon: '/wallet-icons/formatic.png' },
  { name: 'MathWallet', icon: '/wallet-icons/mathwallet.png' },
  { name: 'BitPay', icon: '/wallet-icons/bitpay.png' },
  { name: 'Ledger Live', icon: '/wallet-icons/ledgerlive.png' },
  { name: 'WallETH', icon: '/wallet-icons/walleth.png' },
  { name: 'Authereum', icon: '/wallet-icons/authereum.png' },
  { name: 'Dharma', icon: '/wallet-icons/dharma.png' },
  { name: '1inch Wallet', icon: '/wallet-icons/1inch.png' },
  { name: 'Huobi', icon: '/wallet-icons/huobi.png' },
  { name: 'Eidoo', icon: '/wallet-icons/eidoo.png' },
  { name: 'MYKEY', icon: '/wallet-icons/mykey.png' },
  { name: 'Loopring', icon: '/wallet-icons/loopring.png' },
  { name: 'TrustVault', icon: '/wallet-icons/trustvault.png' },
  { name: 'Atomic', icon: '/wallet-icons/atomic.png' },
  { name: 'Coin98', icon: '/wallet-icons/coin98.png' },
  { name: 'Tron', icon: '/wallet-icons/tron.png' },
  { name: 'Alice', icon: '/wallet-icons/alice.png' },
  { name: 'KUJIRA', icon: '/wallet-icons/kujira.png' },
  { name: 'AKASH', icon: '/wallet-icons/akash.png' },
  { name: 'UMEE', icon: '/wallet-icons/umee.png' },
  { name: 'IRIS', icon: '/wallet-icons/iris.png' },
  { name: 'REGEN', icon: '/wallet-icons/regen.png' },
  { name: 'GNOSIS', icon: '/wallet-icons/gnosis.png' },
  { name: 'OSMOSIS', icon: '/wallet-icons/osmosis.png' },
  { name: 'BITSONG', icon: '/wallet-icons/bitsong.png' },
  { name: 'KI', icon: '/wallet-icons/ki.png' },
  { name: 'SECRET', icon: '/wallet-icons/secret.png' },
  { name: 'CRO-COSMOS', icon: '/wallet-icons/crocosmos.png' },
  { name: 'LUM', icon: '/wallet-icons/lum.png' },
  { name: 'STARNAME', icon: '/wallet-icons/starname.png' },
  { name: 'SIF', icon: '/wallet-icons/sif.png' },
  { name: 'BITCANNA', icon: '/wallet-icons/bitcanna.png' },
  { name: 'DESMOS', icon: '/wallet-icons/desmos.png' },
  { name: 'JUNO', icon: '/wallet-icons/juno.png' },
  { name: 'PERSISTENCE', icon: '/wallet-icons/persistence.png' },
  { name: 'SENTINEL', icon: '/wallet-icons/sentinel.png' },
  { name: 'EMONEY', icon: '/wallet-icons/emoney.png' },
  { name: 'KONSTELLATION', icon: '/wallet-icons/konstellation.png' },
  { name: 'STARGAZE', icon: '/wallet-icons/stargaze.png' },
  { name: 'MARS', icon: '/wallet-icons/mars.png' },
  { name: 'STRIDE', icon: '/wallet-icons/stride.png' },
  { name: 'NOM', icon: '/wallet-icons/nom.png' },
  { name: 'CHIHUAHUA', icon: '/wallet-icons/chihuahua.png' },
  { name: 'FETCH AI', icon: '/wallet-icons/fetchai.png' },
  { name: 'METER', icon: '/wallet-icons/meter.png' },
  { name: 'INJECTIVE', icon: '/wallet-icons/injective.png' },
  { name: 'COMDEX', icon: '/wallet-icons/comdex.png' },
  { name: 'BANDCHAIN', icon: '/wallet-icons/bandchain.png' },
  { name: 'KUSAMA', icon: '/wallet-icons/kusama.png' },
  { name: 'HATHOR', icon: '/wallet-icons/hathor.png' },
  { name: 'LUNA', icon: '/wallet-icons/luna.png' },
  { name: 'ENJIN', icon: '/wallet-icons/enjin.png' },
  { name: 'ALEPHIUM', icon: '/wallet-icons/alephium.png' },
  { name: 'HIVE', icon: '/wallet-icons/hive.png' },
  { name: 'XDC', icon: '/wallet-icons/xdc.png' },
  { name: 'AlphaWallet', icon: '/wallet-icons/alphawallet.png' },
  { name: 'NORDEK', icon: '/wallet-icons/nordek.png' },
  { name: 'BROCK', icon: '/wallet-icons/brock.png' },
  { name: 'ARBITRUM NOVA', icon: '/wallet-icons/arbitrumnova.png' },
  { name: 'ZKSYNC ERA', icon: '/wallet-icons/zksyncera.png' },
  { name: 'AIRDAO', icon: '/wallet-icons/airdao.png' },
  { name: 'ETC', icon: '/wallet-icons/etc.png' },
  { name: 'REI', icon: '/wallet-icons/rei.png' },
  { name: 'RSK', icon: '/wallet-icons/rsk.png' },
  { name: 'THETA', icon: '/wallet-icons/theta.png' },
  { name: 'CASPER', icon: '/wallet-icons/casper.png' },
  { name: 'BOBA BNB', icon: '/wallet-icons/bobabnb.png' },
  { name: 'TENET', icon: '/wallet-icons/tenet.png' },
  { name: 'POLYGON ZKEVM', icon: '/wallet-icons/polygonzkevm.png' },
  { name: 'SEI', icon: '/wallet-icons/sei.png' },
  { name: 'MANTLE', icon: '/wallet-icons/mantle.png' },
  { name: 'SYSCOIN', icon: '/wallet-icons/syscoin.png' },
  { name: 'TARAXA', icon: '/wallet-icons/taraxa.png' },
  { name: 'LINEA', icon: '/wallet-icons/linea.png' },
  { name: 'OPBNB', icon: '/wallet-icons/opbnb.png' },
  { name: 'LUKSO', icon: '/wallet-icons/lukso.png' },
  { name: 'CELESTIA', icon: '/wallet-icons/celestia.png' },
  { name: 'NEUTRON', icon: '/wallet-icons/neutron.png' },
  { name: 'ORAI', icon: '/wallet-icons/orai.png' },
  { name: 'EWT', icon: '/wallet-icons/ewt.png' },
  { name: 'FLARE', icon: '/wallet-icons/flare.png' },
  { name: 'MANTA', icon: '/wallet-icons/manta.png' },
  { name: 'ZETACHAIN', icon: '/wallet-icons/zetachain.png' },
  { name: 'TOMOCHAIN', icon: '/wallet-icons/tomochain.png' },
  { name: 'WANCHAIN', icon: '/wallet-icons/wanchain.png' },
  { name: 'ELECTRONEUM', icon: '/wallet-icons/electroneum.png' },
  { name: 'ZKLINK NOVA', icon: '/wallet-icons/zklinknova.png' },
  { name: 'TAIKO', icon: '/wallet-icons/taiko.png' },
  { name: 'WEMIX', icon: '/wallet-icons/wemix.png' },
  { name: 'BITGERT', icon: '/wallet-icons/bitgert.png' },
  { name: 'DYDX', icon: '/wallet-icons/dydx.png' },
  { name: 'ASTAR', icon: '/wallet-icons/astar.png' },
  { name: 'NANO', icon: '/wallet-icons/nano.png' },
  { name: 'POCKET', icon: '/wallet-icons/pocket.png' },
  { name: 'D\'CENT', icon: '/wallet-icons/dcent.png' },
  { name: 'FUSE', icon: '/wallet-icons/fuse.png' },
  { name: 'DOGE', icon: '/wallet-icons/doge.png' },
  { name: 'COSMOS', icon: '/wallet-icons/cosmos.png' },
  { name: 'ZelCore', icon: '/wallet-icons/zelcore.png' },
  { name: 'KCC', icon: '/wallet-icons/kcc.png' },
  { name: 'KAVA EVM', icon: '/wallet-icons/kavaevm.png' },
  { name: 'KAVA IBC', icon: '/wallet-icons/kavaibc.png' },
  { name: 'BLAST', icon: '/wallet-icons/blast.png' },
  { name: 'BOUNCEBIT', icon: '/wallet-icons/bouncebit.png' },
  { name: 'NIBIRU', icon: '/wallet-icons/nibiru.png' },
  { name: 'RONIN', icon: '/wallet-icons/ronin.png' },
  { name: 'XPLA', icon: '/wallet-icons/xpla.png' },
  { name: 'ANDROMEDA', icon: '/wallet-icons/andromeda.png' },
  { name: 'SAGA', icon: '/wallet-icons/saga.png' },
  { name: 'TELOSEVM', icon: '/wallet-icons/telosevm.png' },
  { name: 'MICRO VISION CHAIN', icon: '/wallet-icons/microvisionchain.png' },
  { name: 'DYMENSION IBC', icon: '/wallet-icons/dymensionibc.png' },
  { name: 'DYMENSION EVM', icon: '/wallet-icons/dimensionevm.png' },
  { name: 'ZIRCUIT', icon: '/wallet-icons/zircuit.png' },
  { name: 'KASPA', icon: '/wallet-icons/kaspa.png' },
  { name: 'RIPPLE', icon: '/wallet-icons/ripple.png' },
  { name: 'AZERO', icon: '/wallet-icons/azero.png' },
  { name: 'POLKADOT', icon: '/wallet-icons/polkadot.png' },
  { name: 'DOGECHAIN', icon: '/wallet-icons/dogechain.png' },
  { name: 'WALTONCHAIN', icon: '/wallet-icons/waltonchain.png' },
  { name: 'ARWEAVE', icon: '/wallet-icons/arweave.png' },
  { name: 'INTERNET COMPUTER', icon: '/wallet-icons/internetcomputer.png' },
  { name: 'FLUX', icon: '/wallet-icons/flux.png' },
  { name: 'NEXA', icon: '/wallet-icons/nexa.png' },
  { name: 'COMAI', icon: '/wallet-icons/comai.png' },
  { name: 'MAPO', icon: '/wallet-icons/mapo.png' },
  { name: 'SCROLL', icon: '/wallet-icons/scroll.png' },
  { name: 'MODE', icon: '/wallet-icons/mode.png' },
  { name: 'MERLIN', icon: '/wallet-icons/merlin.png' },
  { name: 'STARKNET', icon: '/wallet-icons/starknet.png' },
  { name: 'CARDANO', icon: '/wallet-icons/cardano.png' },
  { name: 'ALGORAND', icon: '/wallet-icons/algorand.png' },
  { name: 'MONERO', icon: '/wallet-icons/monero.png' },
  { name: 'STELLAR', icon: '/wallet-icons/stellar.png' },
  { name: 'FILECOIN', icon: '/wallet-icons/filecoin.png' },
  { name: 'Coinmoni', icon: '/wallet-icons/coinmoni.png' },
  { name: 'GridPlus', icon: '/wallet-icons/gridplus.png' },
  { name: 'CYBAVO', icon: '/wallet-icons/cybavo.png' },
  { name: 'Tokenary', icon: '/wallet-icons/tokenary.png' },
  { name: 'Torus', icon: '/wallet-icons/torus.png' },
  { name: 'Spatium', icon: '/wallet-icons/spatium.png' },
  { name: 'SafePal', icon: '/wallet-icons/safepal.png' },
  { name: 'Infinito', icon: '/wallet-icons/infinito.png' },
  { name: 'wallet.io', icon: '/wallet-icons/walletio.png' },
  { name: 'Ownbit', icon: '/wallet-icons/ownbit.png' },
  { name: 'EasyPocket', icon: '/wallet-icons/easypocket.png' },
  { name: 'Bridge Wallet', icon: '/wallet-icons/bridge.png' },
  { name: 'Spark Point', icon: '/wallet-icons/sparkpoint.png' },
  { name: 'ViaWallet', icon: '/wallet-icons/viawallet.png' },
  { name: 'BitKeep', icon: '/wallet-icons/bitkeep.png' },
  { name: 'Vision', icon: '/wallet-icons/vision.png' },
  { name: 'PEAKDEFI', icon: '/wallet-icons/peakdefi.png' },
  { name: 'Unstoppable', icon: '/wallet-icons/unstoppable.png' },
  { name: 'HaloDeFi', icon: '/wallet-icons/halodefi.png' },
  { name: 'Dok Wallet', icon: '/wallet-icons/dok.png' },
  { name: 'Midas', icon: '/wallet-icons/midas.png' },
  { name: 'Ellipal', icon: '/wallet-icons/ellipal.png' },
  { name: 'KEYRING PRO', icon: '/wallet-icons/keyringpro.png' },
  { name: 'Aktionariat', icon: '/wallet-icons/aktionariat.png' },
  { name: 'Talken', icon: '/wallet-icons/talken.png' },
  { name: 'KyberSwap', icon: '/wallet-icons/kyberswap.png' },
  { name: 'PayTube', icon: '/wallet-icons/paytube.png' },
  { name: 'Linen', icon: '/wallet-icons/linen.png' },
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
