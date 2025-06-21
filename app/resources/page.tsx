'use client';

import { useState, useEffect } from 'react';
import { Resource, categories, types } from './data';
import Link from 'next/link';
import { ExternalLink, RefreshCw } from 'lucide-react';

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setError(null);
      const response = await fetch('/api/resources');
      
      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }
      
      const data = await response.json();
      if (Array.isArray(data)) {
        setResources(data);
        // Cache resources in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('github_resources_cache', JSON.stringify(data));
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Failed to load resources:', error);
      setError('Using cached resources. All external API calls have been disabled to prevent errors.');
      
      // Try to load from cache
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('github_resources_cache');
        if (cached) {
          try {
            setResources(JSON.parse(cached));
          } catch (e) {
            console.error('Failed to parse cached resources:', e);
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadResources();
    setRefreshing(false);
  };

  // Filter resources based on search and filters
  const filteredResources = resources.filter((resource) => {
    const matchesSearch = searchQuery === '' ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === '' || resource.category === selectedCategory;
    const matchesType = selectedType === '' || resource.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  // Pagination
  const itemsPerPage = 50;  
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResources = filteredResources.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold">Loading Resources...</h1>
              <div className="animate-spin">
                <RefreshCw className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Open Source Resources</h1>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-4" role="alert">
            <p className="font-medium">Information</p>
            <p>{error}</p>
          </div>
        )}
        
        <p className="text-muted-foreground mb-8">
          {filteredResources.length} curated resources available
        </p>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <input
            type="text"
            placeholder="Search resources..."
            className="px-4 py-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            className="px-4 py-2 border rounded-lg"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            className="px-4 py-2 border rounded-lg"
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedResources.map((resource) => (
            <div 
              key={resource.id}
              className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10">
                  {resource.type}
                </span>
                <span className="text-sm text-muted-foreground">
                  {resource.category}
                </span>
              </div>

              <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
              <p className="text-muted-foreground mb-4">{resource.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {resource.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-2 py-1 text-xs rounded-full bg-secondary/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {resource.stars && (
                <div className="text-sm text-muted-foreground mb-4">
                  ⭐ {resource.stars} stars
                </div>
              )}

              <Link
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-4 py-2 border rounded-md hover:bg-primary/5"
              >
                Access Resource
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}