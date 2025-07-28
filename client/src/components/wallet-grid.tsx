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
          <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center border-2 border-gray-100">
            <img
              src={wallet.icon}
              alt={wallet.name}
              className="w-10 h-10 object-contain rounded-full"
              onError={(e) => {
                e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${wallet.name}`;
              }}
            />
          </div>
          <div className="w-full min-h-[2.5rem] flex items-center justify-center">
            <span className="text-xs leading-tight text-center font-medium text-gray-900 line-clamp-2">{wallet.name}</span>
          </div>
        </Button>
      ))}
    </div>
  );
}
