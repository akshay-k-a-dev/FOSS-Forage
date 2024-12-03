'use client';

import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { NewsArticle, fetchNews } from './fetchNews';

const POLLING_INTERVAL = 5 * 60 * 1000; // Poll every 5 minutes

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadNews = useCallback(async (isInitialLoad: boolean = false) => {
    try {
      if (isInitialLoad) {
        setIsLoading(true);
      }
      
      const articles = await fetchNews();
      
      if (articles.length > 0) {
        setNews(articles);
        setLastUpdated(new Date());
        setError(null);
      }
    } catch (error) {
      console.error('Failed to load news:', error);
      // Only show error if we have no news
      if (news.length === 0) {
        setError('Loading news...');
      }
    } finally {
      setIsLoading(false);
    }
  }, [news.length]);

  // Initial load with retries
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    let retryTimeout: NodeJS.Timeout;

    async function loadWithRetry() {
      try {
        await loadNews(true);
      } catch (error) {
        if (retryCount < maxRetries) {
          retryCount++;
          retryTimeout = setTimeout(loadWithRetry, 2000);
        }
      }
    }

    loadWithRetry();

    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [loadNews]);

  // Set up polling for new articles
  useEffect(() => {
    const pollInterval = setInterval(() => {
      loadNews(false);
    }, POLLING_INTERVAL);

    return () => clearInterval(pollInterval);
  }, [loadNews]);

  if (isLoading) {
    return (
      <div className="min-h-screen p-2 sm:p-4 md:p-6">
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
    <div className="min-h-screen p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8 px-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Latest Tech News</h1>
          {lastUpdated && (
            <div className="text-sm text-muted-foreground">
              Last updated: {format(lastUpdated, 'HH:mm:ss')}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 mx-2">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2">
          {news.map((article) => (
            <div 
              key={article.id} 
              className="flex flex-col p-4 sm:p-6 rounded-lg border hover:shadow-lg transition-shadow bg-card"
            >
              {article.urlToImage && (
                <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <h2 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2 hover:text-primary">
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  {article.title}
                </a>
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 line-clamp-3">
                {article.description}
              </p>
              <div className="mt-auto flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <span>{article.source.name}</span>
                <span>•</span>
                <span>
                  {(() => {
                    try {
                      return format(new Date(article.publishedAt), 'MMM d, yyyy HH:mm');
                    } catch {
                      return 'Unknown date';
                    }
                  })()}
                </span>
                {article.author && (
                  <>
                    <span>•</span>
                    <span>{article.author}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
