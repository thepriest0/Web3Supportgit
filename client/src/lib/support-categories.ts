import { 
  TrendingDown, 
  Wifi, 
  ArrowLeftRight, 
  Gift, 
  CreditCard, 
  Lock, 
  Image, 
  AlertTriangle, 
  Wallet, 
  Clock, 
  TrendingUp, 
  Rocket, 
  Shield, 
  CheckCircle, 
  Link2, 
  Coins, 
  LogIn, 
  List, 
  Move, 
  ShieldCheck, 
  Hand, 
  ArrowUpDown 
} from 'lucide-react';

export interface SupportCategory {
  slug: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  tags: string[];
  contractFunction?: string;
}

export const supportCategories: SupportCategory[] = [
  {
    slug: 'slippage',
    title: 'Slippage',
    description: 'For slippage related or transaction fee related issue',
    icon: TrendingDown,
    color: 'text-red-600',
    bgColor: 'bg-red-50 group-hover:bg-red-100',
    tags: ['DeFi', 'Trading'],
    contractFunction: 'validateSlippage'
  },
  {
    slug: 'connect-dapps',
    title: 'Connect to Dapps',
    description: 'To solve any dapp connection issue',
    icon: Wifi,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 group-hover:bg-blue-100',
    tags: ['Wallet', 'Connection'],
    contractFunction: 'validateConnection'
  },
  {
    slug: 'transaction',
    title: 'Transaction',
    description: 'For all transaction related error',
    icon: ArrowLeftRight,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 group-hover:bg-orange-100',
    tags: ['Transaction'],
    contractFunction: 'validateTransaction'
  },
  {
    slug: 'claim-airdrop',
    title: 'Claim Airdrop',
    description: 'For error during airdrop claim',
    icon: Gift,
    color: 'text-green-600',
    bgColor: 'bg-green-50 group-hover:bg-green-100',
    tags: ['DeFi', 'Airdrop'],
    contractFunction: 'claimAirdrop'
  },
  {
    slug: 'buy-tokens',
    title: 'Buy Coins/Tokens',
    description: 'To trade, your account must be marked as a trusted payment source',
    icon: CreditCard,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 group-hover:bg-purple-100',
    tags: ['Trading', 'DeFi'],
    contractFunction: 'validatePaymentSource'
  },
  {
    slug: 'locked-account',
    title: 'Locked Account',
    description: 'If your account was locked or wallet is stuck',
    icon: Lock,
    color: 'text-red-600',
    bgColor: 'bg-red-50 group-hover:bg-red-100',
    tags: ['Wallet', 'Security'],
    contractFunction: 'unlockAccount'
  },
  {
    slug: 'nfts',
    title: 'NFTs',
    description: 'For NFTs minting/transfer issues',
    icon: Image,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 group-hover:bg-indigo-100',
    tags: ['NFTs'],
    contractFunction: 'validateNFTTransfer'
  },
  {
    slug: 'missing-balance',
    title: 'Missing/Irregular Balance',
    description: 'To recover your lost or missing funds',
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 group-hover:bg-yellow-100',
    tags: ['Wallet', 'Recovery'],
    contractFunction: 'recoverFunds'
  },
  {
    slug: 'wallet-glitch',
    title: 'Wallet Glitch',
    description: 'If you have problem with trading wallet',
    icon: Wallet,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 group-hover:bg-gray-100',
    tags: ['Wallet'],
    contractFunction: 'fixWalletGlitch'
  },
  {
    slug: 'delayed-transaction',
    title: 'Delayed Transaction',
    description: 'For any transaction error or delayed transactions',
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 group-hover:bg-blue-100',
    tags: ['Transaction'],
    contractFunction: 'speedUpTransaction'
  },
  {
    slug: 'defi-farming',
    title: 'DeFi Farming',
    description: 'For defi farming / commercial farming issues',
    icon: TrendingUp,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 group-hover:bg-emerald-100',
    tags: ['DeFi', 'Staking'],
    contractFunction: 'validateFarming'
  },
  {
    slug: 'presale',
    title: 'Presale',
    description: 'Click here for presale',
    icon: Rocket,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 group-hover:bg-pink-100',
    tags: ['Trading'],
    contractFunction: 'validatePresale'
  },
  {
    slug: 'rectification',
    title: 'Rectification',
    description: 'Rectification support completely decentralized',
    icon: Shield,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50 group-hover:bg-teal-100',
    tags: ['Security'],
    contractFunction: 'rectifyIssue'
  },
  {
    slug: 'kyc',
    title: 'KYC',
    description: 'Tap into secure solutions designed according to industry standards',
    icon: CheckCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 group-hover:bg-blue-100',
    tags: ['Security', 'Verification'],
    contractFunction: 'validateKYC'
  },
  {
    slug: 'bridge',
    title: 'Bridge',
    description: 'Bridge your wallet with our innovation tooling',
    icon: Link2,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50 group-hover:bg-cyan-100',
    tags: ['Bridge', 'Cross-chain'],
    contractFunction: 'bridgeAssets'
  },
  {
    slug: 'staking',
    title: 'Staking',
    description: 'For token staking/unstaking related issues',
    icon: Coins,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50 group-hover:bg-violet-100',
    tags: ['Staking', 'DeFi'],
    contractFunction: 'validateStaking'
  },
  {
    slug: 'login',
    title: 'Login',
    description: 'For any error encounter while logging in to your wallet',
    icon: LogIn,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 group-hover:bg-blue-100',
    tags: ['Wallet'],
    contractFunction: 'validateLogin'
  },
  {
    slug: 'whitelist',
    title: 'Whitelist',
    description: 'To whitelist your address or whitelist related error',
    icon: List,
    color: 'text-green-600',
    bgColor: 'bg-green-50 group-hover:bg-green-100',
    tags: ['Security'],
    contractFunction: 'validateWhitelist'
  },
  {
    slug: 'migration',
    title: 'Migration',
    description: 'For migration or anything related to migration',
    icon: Move,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 group-hover:bg-orange-100',
    tags: ['Migration'],
    contractFunction: 'migrateAssets'
  },
  {
    slug: 'validation',
    title: 'Validation',
    description: 'To validate your wallet',
    icon: ShieldCheck,
    color: 'text-green-600',
    bgColor: 'bg-green-50 group-hover:bg-green-100',
    tags: ['Validation', 'Security'],
    contractFunction: 'validateWallet'
  },
  {
    slug: 'claim',
    title: 'Claim',
    description: 'To claim tokens or have issues claiming tokens',
    icon: Hand,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 group-hover:bg-blue-100',
    tags: ['Claim', 'Tokens'],
    contractFunction: 'claimTokens'
  },
  {
    slug: 'swap',
    title: 'Swap',
    description: 'For token swap issues or any issues while swapping token',
    icon: ArrowUpDown,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 group-hover:bg-indigo-100',
    tags: ['DeFi', 'Trading'],
    contractFunction: 'validateSwap'
  }
];

export function getCategoryBySlug(slug: string): SupportCategory | undefined {
  return supportCategories.find(category => category.slug === slug);
}

export function getCategoriesByTag(tag: string): SupportCategory[] {
  return supportCategories.filter(category => category.tags.includes(tag));
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  supportCategories.forEach(category => {
    category.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}
