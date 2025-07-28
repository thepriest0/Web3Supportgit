import { Button } from '@/components/ui/button';

interface WalletGridProps {
  wallets: Array<{ name: string; icon: string; }>;
  onSelect: (wallet: { name: string; icon: string; }) => void;
}

export function WalletGrid({ wallets, onSelect }: WalletGridProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-6 p-4">
      {wallets.map((wallet) => (
        <Button
          key={wallet.name}
          variant="outline"
          className="flex flex-col items-center justify-center gap-3 h-auto p-4 hover:bg-gray-50 transition-all border rounded-xl"
          onClick={() => onSelect(wallet)}
        >
          <div className="text-4xl mb-2">{wallet.icon}</div>
          <span className="text-sm text-center font-medium text-gray-900">{wallet.name}</span>
        </Button>
      ))}
    </div>
  );
}
