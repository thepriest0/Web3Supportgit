import { Button } from '@/components/ui/button';

interface WalletGridProps {
  wallets: Array<{ name: string; icon: string; }>;
  onSelect: (wallet: { name: string; icon: string; }) => void;
}

export function WalletGrid({ wallets, onSelect }: WalletGridProps) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
      {wallets.map((wallet) => (
        <Button
          key={wallet.name}
          variant="outline"
          className="flex flex-col items-center justify-center gap-2 h-auto p-4 hover:bg-accent transition-all"
          onClick={() => onSelect(wallet)}
        >
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            <img
              src={wallet.icon}
              alt={wallet.name}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-sm text-center font-medium">{wallet.name}</span>
        </Button>
      ))}
    </div>
  );
}
