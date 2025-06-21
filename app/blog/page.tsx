'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, MessageSquare, Heart, Calendar } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  publishedAt: string;
  author: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  _count: {
    comments: number;
    likes: number;
  };
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog/posts');
      const data = await response.json();

      if (data.success) {
        setPosts(data.data || []);
      } else {
        setError(data.message || 'Failed to load blog posts');
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setError('Failed to load blog posts');
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

  if (loading) {
    return (
      <div className="min-h-screen">
        <section className="bg-primary/5 dark:bg-primary/10 py-6 sm:py-10 px-4 sm:px-6 mb-6 sm:mb-10">
          <div className="container mx-auto max-w-7xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2 sm:mb-3">
              Linux Community Blog
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              Expert insights, tutorials, and community stories about Linux and open source
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="flex flex-col h-full animate-pulse">
                <CardHeader className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </CardHeader>
                <CardContent className="flex-grow p-4 sm:p-6">
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <section className="bg-primary/5 dark:bg-primary/10 py-6 sm:py-10 px-4 sm:px-6 mb-6 sm:mb-10">
          <div className="container mx-auto max-w-7xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2 sm:mb-3">
              Linux Community Blog
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              Expert insights, tutorials, and community stories about Linux and open source
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Blog Posts</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchPosts} variant="outline">
              Try Again
            </Button>
          </div>
        </section>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="min-h-screen">
        <section className="bg-primary/5 dark:bg-primary/10 py-6 sm:py-10 px-4 sm:px-6 mb-6 sm:mb-10">
          <div className="container mx-auto max-w-7xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2 sm:mb-3">
              Linux Community Blog
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              Expert insights, tutorials, and community stories about Linux and open source
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nothing to show yet</h3>
            <p className="text-muted-foreground">
              No blog posts are available at the moment. Check back later!
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="bg-primary/5 dark:bg-primary/10 py-6 sm:py-10 px-4 sm:px-6 mb-6 sm:mb-10">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2 sm:mb-3">
            Linux Community Blog
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Expert insights, tutorials, and community stories about Linux and open source
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {posts.map((post) => (
            <Card 
              key={post.id} 
              className="flex flex-col h-full hover:shadow-lg transition-shadow border-0 sm:border"
            >
              {post.featuredImage && (
                <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              
              <CardHeader className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge variant="outline" className="text-xs">
                    {post.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(post.publishedAt)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <CardTitle className="text-xl sm:text-2xl font-bold hover:text-primary cursor-pointer line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-sm line-clamp-2">
                    {post.excerpt}
                  </CardDescription>
                </div>

                <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={post.author.avatar} alt={post.author.username} />
                      <AvatarFallback>{post.author.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium truncate">
                        {post.author.firstName && post.author.lastName 
                          ? `${post.author.firstName} ${post.author.lastName}`
                          : post.author.username
                        }
                      </span>
                      <span className="text-xs text-muted-foreground truncate">@{post.author.username}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-grow p-4 sm:p-6">
                <ScrollArea className="h-20 sm:h-24">
                  <p className="text-sm text-muted-foreground">
                    {post.content.substring(0, 200)}...
                  </p>
                </ScrollArea>
              </CardContent>

              <CardFooter className="flex justify-between items-center p-4 sm:p-6 border-t">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {post._count.comments}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {post._count.likes}
                  </span>
                </div>
                
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{post.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-6 sm:mt-10 text-center pb-6 sm:pb-10">
          <Button 
            variant="outline" 
            size="lg"
            className="w-full sm:w-auto"
            onClick={fetchPosts}
          >
            Load More Posts
          </Button>
        </div>
      </section>
    </div>
  );
}