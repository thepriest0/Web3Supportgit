import { useState, useMemo } from 'react';
import { Navbar } from '@/components/navbar';
import { SearchBar } from '@/components/search-bar';
import { SupportCategoryCard } from '@/components/support-category-card';
import { TrustIndicators } from '@/components/trust-indicators';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { supportCategories, getAllTags } from '@/lib/support-categories';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  
  const allTags = ['All', ...getAllTags()];
  
  const filteredCategories = useMemo(() => {
    let filtered = supportCategories;
    
    // Filter by tag
    if (selectedTag !== 'All') {
      filtered = filtered.filter(category => category.tags.includes(selectedTag));
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(category =>
        category.title.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query) ||
        category.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [searchQuery, selectedTag]);

  const stats = {
    resolved: "2,847",
    networks: "12",
    successRate: "98%"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Distributed Applications
            <span className="block text-blue-500 mt-2">Support Protocol</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Our protocol, driven by artificial intelligence, guarantees smooth connectivity and safe asset 
            administration by automatically addressing synchronization hurdles among non-custodial wallets, 
            without any need for human involvement.
          </p>
          
          <SearchBar onSearch={setSearchQuery} />

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full web3-pulse" />
              <span>{stats.resolved} Issues Resolved</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full web3-pulse" />
              <span>{stats.networks} Networks Supported</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full web3-pulse" />
              <span>{stats.successRate} Success Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Support Categories */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Web3 Support Categories</h2>
          <p className="text-gray-600">Select the category that best describes your Web3 issue for automated resolution</p>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-3 mb-8">
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(tag)}
              className="transition-colors"
            >
              {tag}
            </Button>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <SupportCategoryCard key={category.slug} category={category} />
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No categories found matching your search.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedTag('All');
              }}
              className="mt-4"
            >
              Clear filters
            </Button>
          </div>
        )}
      </main>

      <TrustIndicators />
      <Footer />
    </div>
  );
}
