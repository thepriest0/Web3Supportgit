import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Zap, Menu, X, Wallet } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">AllDappNet</span>
            </Link>

            <nav className="hidden md:flex space-x-8 ml-8">
              <Link href="/" className="text-gray-700 hover:text-blue-500 transition-colors duration-200">
                Support
              </Link>
              <a href="#" className="text-gray-700 hover:text-blue-500 transition-colors duration-200">
                Documentation
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-500 transition-colors duration-200">
                Analytics
              </a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Wallet Connection Button - Directs to Support Categories */}
            <Link href="/">
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Get Support
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-blue-500">
              Support
            </Link>
            <a href="#" className="block px-3 py-2 text-gray-700 hover:text-blue-500">
              Documentation
            </a>
            <a href="#" className="block px-3 py-2 text-gray-700 hover:text-blue-500">
              Analytics
            </a>
          </div>
        </div>
      )}
    </header>
  );
}