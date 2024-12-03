'use client';

import { useState, useEffect } from 'react';
import { Resource, fallbackResources } from './data';

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>(fallbackResources);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadResources() {
      try {
        const response = await fetch('/api/resources');
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setResources(data);
        }
      } catch (error) {
        console.error('Error loading resources:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadResources();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Linux Community Resources</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{resource.title}</h2>
            <p className="text-gray-600 mb-4">{resource.description}</p>
            <div className="flex justify-between items-center">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                {resource.category}
              </span>
              <span className="text-gray-500 text-sm">⭐ {resource.stars}</span>
            </div>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              View Resource
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
