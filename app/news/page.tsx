'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { NewsArticle, fetchNews } from './fetchNews';

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      try {
        const articles = await fetchNews();
        setNews(articles);
      } catch (error) {
        console.error('Failed to load news:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadNews();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Latest Tech News</h1>
        
        <div className="grid gap-6">
          {news.map((article) => (
            <div 
              key={article.id} 
              className="p-6 rounded-lg border hover:shadow-lg transition-shadow bg-card"
            >
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-primary/10 rounded-full text-xs font-medium">
                    {article.source.name}
                  </span>
                  {article.author && (
                    <span className="text-xs text-muted-foreground">
                      by {article.author}
                    </span>
                  )}
                </div>
                
                <h2 className="text-xl font-semibold">
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    {article.title}
                  </a>
                </h2>
                
                <p className="text-muted-foreground">
                  {article.description}
                </p>
                
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(article.publishedAt), 'MMM dd, yyyy')}
                  </span>
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    Read more →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
