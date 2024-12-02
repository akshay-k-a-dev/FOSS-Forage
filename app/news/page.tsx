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
      <div className="min-h-screen p-2 sm:p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-6 sm:py-12">
            <div className="animate-pulse">
              <div className="h-6 sm:h-8 bg-gray-200 rounded w-2/3 sm:w-1/3 mx-auto mb-4 sm:mb-8"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 sm:w-1/2 mx-auto mb-3 sm:mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 sm:w-2/3 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-8 px-2">Latest Tech News</h1>
        
        <div className="grid gap-4 sm:gap-6 px-2">
          {news.map((article) => (
            <div 
              key={article.id} 
              className="p-4 sm:p-6 rounded-lg border hover:shadow-lg transition-shadow bg-card"
            >
              <div className="flex flex-col space-y-2 sm:space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 sm:px-3 py-1 bg-primary/10 rounded-full text-xs font-medium">
                    {article.source.name}
                  </span>
                  {article.author && (
                    <span className="text-xs text-muted-foreground">
                      by {article.author}
                    </span>
                  )}
                </div>
                
                <h2 className="text-lg sm:text-xl font-semibold">
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    {article.title}
                  </a>
                </h2>
                
                <p className="text-sm sm:text-base text-muted-foreground">
                  {article.description}
                </p>
                
                <div className="flex items-center justify-between mt-3 sm:mt-4 pt-2 border-t">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {format(new Date(article.publishedAt), 'MMM dd, yyyy')}
                  </span>
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors"
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
