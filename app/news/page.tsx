'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, Newspaper } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  image?: string;
  category: string;
  tags: string;
  publishedAt: string;
  authorId?: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news');
      const data = await response.json();

      if (data.success) {
        setNews(data.data || []);
      } else {
        setError(data.message || 'Failed to load news');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const parseTags = (tagsString: string) => {
    try {
      return JSON.parse(tagsString || '[]');
    } catch {
      return [];
    }
  };

  if (loading) {
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <CardHeader>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-2 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8 px-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Latest Tech News</h1>
          </div>
          
          <div className="flex flex-col items-center justify-center py-12">
            <Newspaper className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading News</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchNews} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="min-h-screen p-2 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8 px-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Latest Tech News</h1>
          </div>
          
          <div className="flex flex-col items-center justify-center py-12">
            <Newspaper className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nothing to show yet</h3>
            <p className="text-muted-foreground">
              No news articles are available at the moment. Check back later!
            </p>
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2">
          {news.map((article) => (
            <Card 
              key={article.id} 
              className="flex flex-col p-4 sm:p-6 rounded-lg border hover:shadow-lg transition-shadow bg-card"
            >
              {article.image && (
                <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-xs">
                  {article.category}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(article.publishedAt)}
                </span>
              </div>
              
              <CardTitle className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2 hover:text-primary">
                {article.title}
              </CardTitle>
              
              <p className="text-sm sm:text-base text-muted-foreground mb-3 line-clamp-3 flex-grow">
                {article.excerpt || article.content.substring(0, 150) + '...'}
              </p>
              
              {parseTags(article.tags).length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {parseTags(article.tags).slice(0, 3).map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              <Button variant="outline" className="w-full mt-auto">
                <ExternalLink className="h-4 w-4 mr-2" />
                Read More
              </Button>
            </Card>
          ))}
        </div>

        {news.length === 0 && !loading && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No news available</h2>
            <p className="text-muted-foreground">Check back later for the latest updates.</p>
          </div>
        )}
      </div>
    </div>
  );
}