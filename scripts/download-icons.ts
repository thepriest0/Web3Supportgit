import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const walletIcons = {
  'xaman': 'https://raw.githubusercontent.com/thepriest0/Web3Support/main/client/public/wallet-icons/xaman.png',
  'phantom': 'https://raw.githubusercontent.com/phantom/phantom-logo/master/phantom-icon-purple.png',
  'solana': 'https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/icons/solana.png',
  'uniswap': 'https://raw.githubusercontent.com/Uniswap/interface/main/public/images/192x192_App_Icon.png',
  'best': 'https://bestwalletofficial.com/img/best_wallet_logo.png',
  'walletconnect': 'https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/png/circle-blue.png',
  'trust': 'https://raw.githubusercontent.com/trustwallet/assets/master/dapps/trust.png',
  'solfare': 'https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/icons/solflare.png',
  'metamask': 'https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg',
  'ledger': 'https://raw.githubusercontent.com/LedgerHQ/ledger-live-desktop/develop/static/images/ledger-live-icon.png',
  'coinbase': 'https://raw.githubusercontent.com/coinbase/wallet-mobile/master/ios/Coinbase%20Wallet/Images.xcassets/AppIcon.appiconset/icon-1024.png',
  // Add URLs for other wallet icons
};

const downloadIcon = (url: string, filename: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const iconPath = path.join(__dirname, '..', 'client', 'public', 'wallet-icons', filename);
    const file = fs.createWriteStream(iconPath);

    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(iconPath, () => {
        reject(err);
      });
    });
  });
};

async function downloadAllIcons() {
  // Create directory if it doesn't exist
  const iconDir = path.join(__dirname, '..', 'client', 'public', 'wallet-icons');
  if (!fs.existsSync(iconDir)) {
    fs.mkdirSync(iconDir, { recursive: true });
  }

  // Download each icon
  for (const [name, url] of Object.entries(walletIcons)) {
    try {
      console.log(`Downloading ${name} icon...`);
      await downloadIcon(url, `${name}.png`);
      console.log(`✓ Downloaded ${name} icon`);
    } catch (error) {
      console.error(`✗ Failed to download ${name} icon:`, error);
    }
  }
}

downloadAllIcons().then(() => {
  console.log('Finished downloading icons');
}).catch(console.error);
