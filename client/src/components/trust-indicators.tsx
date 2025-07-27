import { CheckCircle, Zap, Globe } from 'lucide-react';

export function TrustIndicators() {
  return (
    <section className="bg-white py-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Web3 Community</h2>
          <p className="text-gray-600">Secure, automated, and decentralized Web3 support</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">100% Secure</h3>
            <p className="text-gray-600">Non-custodial solution. We never access your private keys or seed phrases.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered</h3>
            <p className="text-gray-600">Advanced algorithms automatically resolve Web3 issues without human intervention.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Multi-Chain</h3>
            <p className="text-gray-600">Support for Ethereum, Polygon, BSC, Arbitrum, and 8+ other networks.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
