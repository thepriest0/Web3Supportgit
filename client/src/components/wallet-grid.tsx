import { Button } from '@/components/ui/button';

interface WalletGridProps {
  wallets: Array<{ name: string; icon: string; }>;
  onSelect: (wallet: { name: string; icon: string; }) => void;
}

export function WalletGrid({ wallets, onSelect }: WalletGridProps) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 p-6">
      {wallets.map((wallet) => (
        <Button
          key={wallet.name}
          variant="outline"
          className="flex flex-col items-center justify-center gap-3 h-auto p-4 hover:bg-gray-100 transition-all"
          onClick={() => onSelect(wallet)}
        >
          <div className="relative w-16 h-16 rounded-full overflow-hidden flex items-center justify-center p-2 border">
            <img
              src={wallet.icon}
              alt={wallet.name}
              className="w-12 h-12 object-contain"
            />
          </div>
          <span className="text-sm text-center font-medium">{wallet.name}</span>
        </Button>
      ))}
    </div>
  );
}
