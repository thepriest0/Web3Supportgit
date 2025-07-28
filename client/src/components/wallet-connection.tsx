import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { WalletGrid } from './wallet-grid';
import { Wallet, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { FakeWalletModal } from './fake-wallet-modal';

interface WalletConnectionProps {
  showBalance?: boolean;
  showNetworkWarning?: boolean;
  compact?: boolean;
}

const FAKE_WALLETS = [
  { name: 'Xaman wallet', icon: 'https://xumm.app/assets/icons/xumm-icon-64.png' },
  { name: 'Phantom wallet', icon: 'https://phantom.app/img/phantom-logo.svg' },
  { name: 'Solana Wallet', icon: 'https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/icons/solana.svg' },
  { name: 'UNISWAP Wallet', icon: 'https://raw.githubusercontent.com/Uniswap/interface/main/public/images/192x192_App_Icon.png' },
  { name: 'Best Wallet', icon: 'https://avatars.githubusercontent.com/u/37784886?s=200&v=4' },
  { name: 'Wallet Connect', icon: 'https://avatars.githubusercontent.com/u/37784886?s=200&v=4' },
  { name: 'Trust', icon: 'https://trustwallet.com/assets/images/media/assets/TWT.png' },
  { name: 'Solfare Wallet', icon: 'https://solflare.com/img/logo.svg' },
  { name: 'Metamask', icon: 'https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg' },
  { name: 'Ledger', icon: 'https://www.ledger.com/wp-content/themes/ledger-v2/public/images/ledger-logo-long.svg' },
  { name: 'Coinbase', icon: 'https://images.ctfassets.net/q5ulk4bp65r7/3TBS4oVkD1ghowTqVQJlqj/2dfd4ea3b623a7c0d8deb2ff445dee9e/Consumer_Wordmark.svg' },
  { name: 'Unisat Wallet', icon: 'https://unisat.io/img/logo.svg' },
  { name: 'okx Wallet', icon: 'https://static.okx.com/cdn/assets/imgs/221/58FE8B1AE7EB2F85.png' },
  { name: 'Sui Wallet', icon: 'https://sui.io/icons/icon-512x512.png' },
  { name: 'Leather Wallet', icon: 'https://leather.io/images/leather-logo.svg' },
  { name: 'APTOS Wallet', icon: 'https://aptos.dev/img/aptos_word.svg' },
  { name: 'Asigna Wallet', icon: 'https://avatars.githubusercontent.com/u/108915493?s=200&v=4' },
  { name: 'AVAXC Wallet', icon: 'https://cryptologos.cc/logos/avalanche-avax-logo.svg' },
  { name: 'Base Wallet', icon: 'https://base.org/icons/icon-512x512.png' },
  { name: 'BITTENSOR Wallet', icon: 'https://cryptologos.cc/logos/bittensor-tao-logo.svg' },
  { name: 'AURORA Wallet', icon: 'https://aurora.dev/favicon.svg' },
  { name: 'Xverse Wallet', icon: 'https://www.xverse.app/favicon.svg' },
  { name: 'OPTIMISM Wallet', icon: 'https://optimism.io/icons/icon-512x512.png' },
  { name: 'MyTon Wallet', icon: 'https://mytonwallet.io/icon-192.png' },
  { name: 'Tonkeeper Wallet', icon: 'https://tonkeeper.com/assets/tonkeeper-logo.svg' },
  { name: 'TonHub Wallet', icon: 'https://tonhub.com/tonhub_logo.svg' },
  { name: 'Electrum Wallet', icon: 'https://electrum.org/electrum-logo.png' },
  { name: 'Magic Eden Wallet', icon: 'https://magiceden.io/img/favicon.png' },
  { name: 'STACKS Wallet', icon: 'https://cryptologos.cc/logos/stacks-stx-logo.svg' },
  { name: 'MOONBEAM', icon: 'https://cryptologos.cc/logos/moonbeam-glmr-logo.svg' },
  { name: 'BRD wallet', icon: 'https://brd.com/wp-content/uploads/2021/03/brd-logo.svg' },
  { name: 'ETHPOW wallet', icon: 'https://cryptologos.cc/logos/ethereum-pow-ethw-logo.svg' },
  { name: 'TON wallet', icon: 'https://cryptologos.cc/logos/toncoin-ton-logo.svg' },
  { name: 'Saitamask wallet', icon: 'https://saitamatoken.com/images/saitama-logo.png' },
  { name: 'ARBITRUM wallet', icon: 'https://cryptologos.cc/logos/arbitrum-arb-logo.svg' },
  { name: 'Terra station', icon: 'https://cryptologos.cc/logos/terra-luna-luna-logo.svg' },
  { name: 'METIS station', icon: 'https://cryptologos.cc/logos/metis-token-metis-logo.svg' },
  { name: 'CRO wallet', icon: 'https://cryptologos.cc/logos/cronos-cro-logo.svg' },
  { name: 'Cosmos station', icon: 'https://cryptologos.cc/logos/cosmos-atom-logo.svg' },
  { name: 'CUBE Wallet', icon: 'https://cryptologos.cc/logos/cube-auto-logo.svg' },
  { name: 'Exodus wallet', icon: 'https://www.exodus.com/img/exodus-logo-blue.svg' },
  { name: 'OKC wallet', icon: 'https://static.okx.com/cdn/assets/imgs/221/58FE8B1AE7EB2F85.png' },
  { name: 'Rainbow', icon: 'https://rainbow.me/images/branding/rainbow-logo.svg' },
  { name: 'HECO', icon: 'https://cryptologos.cc/logos/huobi-token-ht-logo.svg' },
  { name: 'Argent', icon: 'https://www.argent.xyz/icons/icon-192x192.png' },
  { name: 'MOONRIVER', icon: 'https://cryptologos.cc/logos/moonriver-movr-logo.svg' },
  { name: 'Binance Chain', icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg' },
  { name: 'Safemoon', icon: 'https://cryptologos.cc/logos/safemoon-safemoon-logo.svg' },
  { name: 'CELO', icon: 'https://cryptologos.cc/logos/celo-celo-logo.svg' },
  { name: 'Gnosis Safe', icon: 'https://safe.global/images/logo-text-horizontal.svg' },
  { name: 'FANTOM', icon: 'https://cryptologos.cc/logos/fantom-ftm-logo.svg' },
  { name: 'DeFi', icon: 'https://cryptologos.cc/logos/defichain-dfi-logo.svg' },
  { name: 'LITECOIN', icon: 'https://cryptologos.cc/logos/litecoin-ltc-logo.svg' },
  { name: 'Pillar', icon: 'https://pillarproject.io/img/logo-pillar.svg' },
  { name: 'imToken', icon: 'https://token.im/img/logo.svg' },
  { name: 'POLYGON', icon: 'https://cryptologos.cc/logos/polygon-matic-logo.svg' },
  { name: 'CORE', icon: 'https://cryptologos.cc/logos/core-core-logo.svg' },
  { name: 'BITCOINCASH', icon: 'https://cryptologos.cc/logos/bitcoin-cash-bch-logo.svg' },
  { name: 'ONTO', icon: 'https://onto.app/favicon.ico' },
  { name: 'BOBA', icon: 'https://cryptologos.cc/logos/boba-network-boba-logo.svg' },
  { name: 'EVMOS', icon: 'https://cryptologos.cc/logos/evmos-evmos-logo.svg' },
  { name: 'THORCHAIN', icon: 'https://cryptologos.cc/logos/thorchain-rune-logo.svg' },
  { name: 'TokenPocket', icon: 'https://www.tokenpocket.pro/img/logo.png' },
  { name: 'Aave', icon: 'https://cryptologos.cc/logos/aave-aave-logo.svg' },
  { name: 'Digitex', icon: 'https://cryptologos.cc/logos/digitex-futures-dgtx-logo.svg' },
  { name: 'Portis', icon: 'https://portis.io/static/images/logo-main.svg' },
  { name: 'Formatic', icon: 'https://fortmatic.com/favicon.ico' },
  { name: 'MathWallet', icon: 'https://mathwallet.org/images/logo.png' },
  { name: 'BitPay', icon: 'https://bitpay.com/img/bitpay-logo-white.svg' },
  { name: 'Ledger Live', icon: 'https://www.ledger.com/wp-content/themes/ledger-v2/public/images/ledger-logo-long.svg' },
  { name: 'WallETH', icon: 'https://walleth.org/favicon.png' },
  { name: 'Authereum', icon: 'https://authereum.com/favicon.ico' },
  { name: 'Dharma', icon: 'https://dharma.io/favicon.ico' },
  { name: '1inch Wallet', icon: 'https://1inch.io/img/logo.svg' },
  { name: 'Huobi', icon: 'https://www.htx.com/favicon.ico' },
  { name: 'Eidoo', icon: 'https://eidoo.io/img/logo.svg' },
  { name: 'MYKEY', icon: 'https://mykey.org/favicon.ico' },
  { name: 'Loopring', icon: 'https://cryptologos.cc/logos/loopring-lrc-logo.svg' },
  { name: 'TrustVault', icon: 'https://trustvault.io/favicon.ico' },
  { name: 'Atomic', icon: 'https://atomicwallet.io/images/logo.svg' },
  { name: 'Coin98', icon: 'https://coin98.com/favicon.ico' },
  { name: 'Tron', icon: 'https://cryptologos.cc/logos/tron-trx-logo.svg' },
  { name: 'Alice', icon: 'https://cryptologos.cc/logos/my-neighbor-alice-alice-logo.svg' },
  { name: 'KUJIRA', icon: 'https://cryptologos.cc/logos/kujira-kuji-logo.svg' },
  { name: 'AKASH', icon: 'https://cryptologos.cc/logos/akash-network-akt-logo.svg' },
  { name: 'UMEE', icon: 'https://cryptologos.cc/logos/umee-umee-logo.svg' },
  { name: 'IRIS', icon: 'https://cryptologos.cc/logos/iris-network-iris-logo.svg' },
  { name: 'REGEN', icon: 'https://cryptologos.cc/logos/regen-regen-logo.svg' },
  { name: 'GNOSIS', icon: 'https://cryptologos.cc/logos/gnosis-gno-logo.svg' },
  { name: 'OSMOSIS', icon: 'https://cryptologos.cc/logos/osmosis-osmo-logo.svg' },
  { name: 'BITSONG', icon: 'https://cryptologos.cc/logos/bitsong-btsg-logo.svg' },
  { name: 'KI', icon: 'https://cryptologos.cc/logos/ki-xki-logo.svg' },
  { name: 'SECRET', icon: 'https://cryptologos.cc/logos/secret-scrt-logo.svg' },
  { name: 'CRO-COSMOS', icon: 'https://cryptologos.cc/logos/cronos-cro-logo.svg' },
  { name: 'LUM', icon: 'https://cryptologos.cc/logos/lum-network-lum-logo.svg' },
  { name: 'STARNAME', icon: 'https://cryptologos.cc/logos/starname-iov-logo.svg' },
  { name: 'SIF', icon: 'https://cryptologos.cc/logos/sifchain-erowan-logo.svg' },
  { name: 'BITCANNA', icon: 'https://cryptologos.cc/logos/bitcanna-bcna-logo.svg' },
  { name: 'DESMOS', icon: 'https://cryptologos.cc/logos/desmos-dsm-logo.svg' },
  { name: 'JUNO', icon: 'https://cryptologos.cc/logos/juno-network-juno-logo.svg' },
  { name: 'PERSISTENCE', icon: 'https://cryptologos.cc/logos/persistence-xprt-logo.svg' },
  { name: 'SENTINEL', icon: 'https://cryptologos.cc/logos/sentinel-dvpn-logo.svg' },
  { name: 'EMONEY', icon: 'https://cryptologos.cc/logos/e-money-ngm-logo.svg' },
  { name: 'KONSTELLATION', icon: 'https://cryptologos.cc/logos/konstellation-darc-logo.svg' },
  { name: 'STARGAZE', icon: 'https://cryptologos.cc/logos/stargaze-stars-logo.svg' },
  { name: 'MARS', icon: 'https://cryptologos.cc/logos/mars-protocol-mars-logo.svg' },
  { name: 'STRIDE', icon: 'https://cryptologos.cc/logos/stride-strd-logo.svg' },
  { name: 'NOM', icon: 'https://cryptologos.cc/logos/onomy-protocol-nom-logo.svg' },
  { name: 'CHIHUAHUA', icon: 'https://cryptologos.cc/logos/chihuahua-token-huahua-logo.svg' },
  { name: 'FETCH AI', icon: 'https://cryptologos.cc/logos/fetch-ai-fet-logo.svg' },
  { name: 'METER', icon: 'https://cryptologos.cc/logos/meter-mtrg-logo.svg' },
  { name: 'INJECTIVE', icon: 'https://cryptologos.cc/logos/injective-protocol-inj-logo.svg' },
  { name: 'COMDEX', icon: 'https://cryptologos.cc/logos/comdex-cmdx-logo.svg' },
  { name: 'BANDCHAIN', icon: 'https://cryptologos.cc/logos/band-protocol-band-logo.svg' },
  { name: 'KUSAMA', icon: 'https://cryptologos.cc/logos/kusama-ksm-logo.svg' },
  { name: 'HATHOR', icon: 'https://cryptologos.cc/logos/hathor-htr-logo.svg' },
  { name: 'LUNA', icon: 'https://cryptologos.cc/logos/terra-luna-luna-logo.svg' },
  { name: 'ENJIN', icon: 'https://cryptologos.cc/logos/enjin-coin-enj-logo.svg' },
  { name: 'ALEPHIUM', icon: 'https://cryptologos.cc/logos/alephium-alph-logo.svg' },
  { name: 'HIVE', icon: 'https://cryptologos.cc/logos/hive-hive-logo.svg' },
  { name: 'XDC', icon: 'https://cryptologos.cc/logos/xdc-network-xdc-logo.svg' },
  { name: 'AlphaWallet', icon: 'https://alphawallet.com/wp-content/uploads/2021/05/alphawallet-logo.svg' },
  { name: 'NORDEK', icon: 'https://cryptologos.cc/logos/nordek-nrk-logo.svg' },
  { name: 'BROCK', icon: 'https://brock-chain.github.io/brock/assets/brock-logo.png' },
  { name: 'ARBITRUM NOVA', icon: 'https://cryptologos.cc/logos/arbitrum-arb-logo.svg' },
  { name: 'ZKSYNC ERA', icon: 'https://zksync.io/favicon.ico' },
  { name: 'AIRDAO', icon: 'https://airdao.io/favicon.ico' },
  { name: 'ETC', icon: 'https://cryptologos.cc/logos/ethereum-classic-etc-logo.svg' },
  { name: 'REI', icon: 'https://cryptologos.cc/logos/rei-network-rei-logo.svg' },
  { name: 'RSK', icon: 'https://cryptologos.cc/logos/rsk-infrastructure-framework-rif-logo.svg' },
  { name: 'THETA', icon: 'https://cryptologos.cc/logos/theta-token-theta-logo.svg' },
  { name: 'CASPER', icon: 'https://cryptologos.cc/logos/casper-cspr-logo.svg' },
  { name: 'BOBA BNB', icon: 'https://cryptologos.cc/logos/boba-network-boba-logo.svg' },
  { name: 'TENET', icon: 'https://cryptologos.cc/logos/tenet-tenet-logo.svg' },
  { name: 'POLYGON ZKEVM', icon: 'https://cryptologos.cc/logos/polygon-matic-logo.svg' },
  { name: 'SEI', icon: 'https://cryptologos.cc/logos/sei-sei-logo.svg' },
  { name: 'MANTLE', icon: 'https://cryptologos.cc/logos/mantle-mnt-logo.svg' },
  { name: 'SYSCOIN', icon: 'https://cryptologos.cc/logos/syscoin-sys-logo.svg' },
  { name: 'TARAXA', icon: 'https://cryptologos.cc/logos/taraxa-tara-logo.svg' },
  { name: 'LINEA', icon: 'https://linea.build/favicon.ico' },
  { name: 'OPBNB', icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg' },
  { name: 'LUKSO', icon: 'https://cryptologos.cc/logos/lukso-lyxe-logo.svg' },
  { name: 'CELESTIA', icon: 'https://cryptologos.cc/logos/celestia-tia-logo.svg' },
  { name: 'NEUTRON', icon: 'https://cryptologos.cc/logos/neutron-ntrn-logo.svg' },
  { name: 'ORAI', icon: 'https://cryptologos.cc/logos/oraichain-orai-logo.svg' },
  { name: 'EWT', icon: 'https://cryptologos.cc/logos/energy-web-token-ewt-logo.svg' },
  { name: 'FLARE', icon: 'https://cryptologos.cc/logos/flare-flr-logo.svg' },
  { name: 'MANTA', icon: 'https://cryptologos.cc/logos/manta-network-manta-logo.svg' },
  { name: 'ZETACHAIN', icon: 'https://cryptologos.cc/logos/zetachain-zeta-logo.svg' },
  { name: 'TOMOCHAIN', icon: 'https://cryptologos.cc/logos/tomochain-tomo-logo.svg' },
  { name: 'WANCHAIN', icon: 'https://cryptologos.cc/logos/wanchain-wan-logo.svg' },
  { name: 'ELECTRONEUM', icon: 'https://cryptologos.cc/logos/electroneum-etn-logo.svg' },
  { name: 'ZKLINK NOVA', icon: 'https://zklink.io/favicon.ico' },
  { name: 'TAIKO', icon: 'https://taiko.xyz/favicon.ico' },
  { name: 'WEMIX', icon: 'https://cryptologos.cc/logos/wemix-token-wemix-logo.svg' },
  { name: 'BITGERT', icon: 'https://cryptologos.cc/logos/bitgert-brise-logo.svg' },
  { name: 'DYDX', icon: 'https://cryptologos.cc/logos/dydx-dydx-logo.svg' },
  { name: 'ASTAR', icon: 'https://cryptologos.cc/logos/astar-astr-logo.svg' },
  { name: 'NANO', icon: 'https://cryptologos.cc/logos/nano-nano-logo.svg' },
  { name: 'POCKET', icon: 'https://cryptologos.cc/logos/pocket-network-pokt-logo.svg' },
  { name: 'D\'CENT', icon: 'https://dcentwallet.com/assets/DcentWallet.svg' },
  { name: 'FUSE', icon: 'https://cryptologos.cc/logos/fuse-network-token-fuse-logo.svg' },
  { name: 'DOGE', icon: 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg' },
  { name: 'COSMOS', icon: 'https://cryptologos.cc/logos/cosmos-atom-logo.svg' },
  { name: 'ZelCore', icon: 'https://zel.network/img/zel-logo.svg' },
  { name: 'KCC', icon: 'https://cryptologos.cc/logos/kucoin-token-kcs-logo.svg' },
  { name: 'KAVA EVM', icon: 'https://cryptologos.cc/logos/kava-kava-logo.svg' },
  { name: 'KAVA IBC', icon: 'https://cryptologos.cc/logos/kava-kava-logo.svg' },
  { name: 'BLAST', icon: 'https://blast.io/favicon.ico' },
  { name: 'BOUNCEBIT', icon: 'https://bouncebit.io/favicon.ico' },
  { name: 'NIBIRU', icon: 'https://cryptologos.cc/logos/nibiru-chain-nibi-logo.svg' },
  { name: 'RONIN', icon: 'https://cryptologos.cc/logos/ronin-ron-logo.svg' },
  { name: 'XPLA', icon: 'https://cryptologos.cc/logos/xpla-xpla-logo.svg' },
  { name: 'ANDROMEDA', icon: 'https://cryptologos.cc/logos/andromeda-andr-logo.svg' },
  { name: 'SAGA', icon: 'https://cryptologos.cc/logos/saga-saga-logo.svg' },
  { name: 'TELOSEVM', icon: 'https://cryptologos.cc/logos/telos-tlos-logo.svg' },
  { name: 'MICRO VISION CHAIN', icon: 'https://cryptologos.cc/logos/microvisionchain-space-logo.svg' },
  { name: 'DYMENSION IBC', icon: 'https://cryptologos.cc/logos/dymension-dym-logo.svg' },
  { name: 'DYMENSION EVM', icon: 'https://cryptologos.cc/logos/dymension-dym-logo.svg' },
  { name: 'ZIRCUIT', icon: 'https://zircuit.com/favicon.ico' },
  { name: 'KASPA', icon: 'https://cryptologos.cc/logos/kaspa-kas-logo.svg' },
  { name: 'RIPPLE', icon: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg' },
  { name: 'AZERO', icon: 'https://cryptologos.cc/logos/aleph-zero-azero-logo.svg' },
  { name: 'POLKADOT', icon: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.svg' },
  { name: 'DOGECHAIN', icon: 'https://cryptologos.cc/logos/dogechain-dc-logo.svg' },
  { name: 'WALTONCHAIN', icon: 'https://cryptologos.cc/logos/waltonchain-wtc-logo.svg' },
  { name: 'ARWEAVE', icon: 'https://cryptologos.cc/logos/arweave-ar-logo.svg' },
  { name: 'INTERNET COMPUTER', icon: 'https://cryptologos.cc/logos/internet-computer-icp-logo.svg' },
  { name: 'FLUX', icon: 'https://cryptologos.cc/logos/flux-flux-logo.svg' },
  { name: 'NEXA', icon: 'https://cryptologos.cc/logos/nexa-nexa-logo.svg' },
  { name: 'COMAI', icon: 'https://cryptologos.cc/logos/commune-ai-comai-logo.svg' },
  { name: 'MAPO', icon: 'https://cryptologos.cc/logos/map-protocol-mapo-logo.svg' },
  { name: 'SCROLL', icon: 'https://scroll.io/favicon.ico' },
  { name: 'MODE', icon: 'https://mode.network/favicon.ico' },
  { name: 'MERLIN', icon: 'https://merlinchain.io/favicon.ico' },
  { name: 'STARKNET', icon: 'https://cryptologos.cc/logos/starknet-token-strk-logo.svg' },
  { name: 'CARDANO', icon: 'https://cryptologos.cc/logos/cardano-ada-logo.svg' },
  { name: 'ALGORAND', icon: 'https://cryptologos.cc/logos/algorand-algo-logo.svg' },
  { name: 'MONERO', icon: 'https://cryptologos.cc/logos/monero-xmr-logo.svg' },
  { name: 'STELLAR', icon: 'https://cryptologos.cc/logos/stellar-xlm-logo.svg' },
  { name: 'FILECOIN', icon: 'https://cryptologos.cc/logos/filecoin-fil-logo.svg' },
  { name: 'Coinmoni', icon: 'https://coinomi.com/img/wallet-logos/coinomi.svg' },
  { name: 'GridPlus', icon: 'https://gridplus.io/assets/logo.svg' },
  { name: 'CYBAVO', icon: 'https://cybavo.com/wp-content/uploads/2021/04/cybavo-logo.svg' },
  { name: 'Tokenary', icon: 'https://tokenary.io/icon.png' },
  { name: 'Torus', icon: 'https://tor.us/images/torus-logo-blue.svg' },
  { name: 'Spatium', icon: 'https://spatium.net/img/logo.svg' },
  { name: 'SafePal', icon: 'https://www.safepal.com/img/safepal-logo.svg' },
  { name: 'Infinito', icon: 'https://infinitowallet.io/img/logo.svg' },
  { name: 'wallet.io', icon: 'https://wallet.io/img/logo.svg' },
  { name: 'Ownbit', icon: 'https://ownbit.io/img/logo.svg' },
  { name: 'EasyPocket', icon: 'https://easypocket.app/img/logo.svg' },
  { name: 'Bridge Wallet', icon: 'https://bridge.walletconnect.org/favicon.ico' },
  { name: 'Spark Point', icon: 'https://cryptologos.cc/logos/sparkpoint-srk-logo.svg' },
  { name: 'ViaWallet', icon: 'https://viawallet.com/img/logo.svg' },
  { name: 'BitKeep', icon: 'https://bitkeep.com/img/logo.svg' },
  { name: 'Vision', icon: 'https://www.visionwallet.app/img/logo.svg' },
  { name: 'PEAKDEFI', icon: 'https://cryptologos.cc/logos/peakdefi-peak-logo.svg' },
  { name: 'Unstoppable', icon: 'https://unstoppabledomains.com/images/logos/ud-logo.svg' },
  { name: 'HaloDeFi', icon: 'https://cryptologos.cc/logos/halodefi-rnbw-logo.svg' },
  { name: 'Dok Wallet', icon: 'https://dokwallet.com/img/logo.svg' },
  { name: 'Midas', icon: 'https://cryptologos.cc/logos/midas-dollar-mds-logo.svg' },
  { name: 'Ellipal', icon: 'https://www.ellipal.com/img/logo.svg' },
  { name: 'KEYRING PRO', icon: 'https://keyring.app/img/logo.svg' },
  { name: 'Aktionariat', icon: 'https://aktionariat.com/img/logo.svg' },
  { name: 'Talken', icon: 'https://talken.io/img/logo.svg' },
  { name: 'KyberSwap', icon: 'https://cryptologos.cc/logos/kyber-network-crystal-knc-logo.svg' },
  { name: 'PayTube', icon: 'https://paytube.org/img/logo.svg' },
  { name: 'Linen', icon: 'https://linen.app/img/logo.svg' },
  { name: 'AURORA Wallet', icon: 'https://aurora.dev/favicon.svg' },
  { name: 'Xverse Wallet', icon: 'https://www.xverse.app/favicon.svg' },
  { name: 'OPTIMISM Wallet', icon: 'https://optimism.io/icons/icon-512x512.png' },
  { name: 'MyTon Wallet', icon: 'https://mytonwallet.io/icon-192.png' }
];

export function WalletConnection({ 
  showBalance = false, 
  showNetworkWarning = true,
  compact = false 
}: WalletConnectionProps) {
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [filteredWallets, setFilteredWallets] = useState(FAKE_WALLETS);

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
        <DialogContent className="sm:max-w-[680px] md:max-w-[740px] lg:max-w-[900px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Connect Wallet
            </DialogTitle>
          </DialogHeader>
          
          <div className="relative mb-4">
            <input 
              type="text" 
              placeholder="Search wallets..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => {
                const searchTerm = e.target.value.toLowerCase();
                const filteredWallets = FAKE_WALLETS.filter(wallet => 
                  wallet.name.toLowerCase().includes(searchTerm)
                );
                setFilteredWallets(filteredWallets);
              }}
            />
          </div>
          
          <div className="max-h-[400px] overflow-y-auto pr-2">
            <WalletGrid 
              wallets={filteredWallets || FAKE_WALLETS}
              onSelect={(wallet) => handleWalletSelect(wallet.name)}
            />
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
