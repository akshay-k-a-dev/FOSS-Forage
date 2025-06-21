'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BookOpen, Play, Clock, User } from 'lucide-react';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  category: string;
  difficulty: string;
  duration: string;
  tags: string[];
  views: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TutorialsPage() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTutorials();
  }, []);

  const fetchTutorials = async () => {
    try {
      // Use window.location.origin to ensure proper URL resolution in WebContainer environments
      const apiUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/api/tutorials`
        : '/api/tutorials';
        
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setTutorials(data.data || []);
      } else {
        setError(data.message || 'Failed to load tutorials');
      }
    } catch (error) {
      console.error('Error fetching tutorials:', error);
      setError('Failed to load tutorials');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
        <div className="flex flex-col space-y-2 mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Tutorials</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Learn Linux through our curated video tutorials
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="flex flex-col h-full animate-pulse">
              <CardHeader className="space-y-2 sm:space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="aspect-video w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
        <div className="flex flex-col space-y-2 mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Tutorials</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Learn Linux through our curated video tutorials
          </p>
        </div>
        
        <div className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Tutorials</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchTutorials} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (tutorials.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
        <div className="flex flex-col space-y-2 mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Tutorials</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Learn Linux through our curated video tutorials
          </p>
        </div>
        
        <div className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nothing to show yet</h3>
          <p className="text-muted-foreground">
            No tutorials are available at the moment. Check back later!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
      <div className="flex flex-col space-y-2 mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Tutorials</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Learn Linux through our curated video tutorials
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {tutorials.map((tutorial) => (
          <Card key={tutorial.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
            <CardHeader className="space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <CardTitle className="text-lg sm:text-xl font-bold line-clamp-2">
                  {tutorial.title}
                </CardTitle>
                <Badge 
                  className={`self-start whitespace-nowrap ${getDifficultyColor(tutorial.difficulty)}`}
                >
                  {tutorial.difficulty}
                </Badge>
              </div>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {tutorial.category}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {tutorial.duration}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {tutorial.views} views
                </span>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-grow space-y-4">
              <div className="aspect-video w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                {tutorial.videoUrl ? (
                  <iframe
                    className="w-full h-full rounded-lg shadow-sm"
                    src={tutorial.videoUrl}
                    title={tutorial.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Play className="h-8 w-8 mb-2" />
                    <span className="text-sm">Video Coming Soon</span>
                  </div>
                )}
              </div>
              
              <ScrollArea className="h-20 sm:h-24">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {tutorial.description}
                </p>
              </ScrollArea>

              {tutorial.tags && tutorial.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tutorial.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {tutorial.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{tutorial.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
            
            <Separator />
            
            <CardFooter className="pt-4 flex flex-col gap-2">
              <Button 
                variant="outline" 
                className="w-full text-sm sm:text-base hover:bg-primary hover:text-primary-foreground transition-colors"
                disabled={!tutorial.videoUrl}
              >
                <Play className="h-4 w-4 mr-2" />
                {tutorial.videoUrl ? 'Watch Tutorial' : 'Coming Soon'}
              </Button>
              
              <div className="text-xs text-muted-foreground text-center">
                Added {formatDate(tutorial.createdAt)}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}