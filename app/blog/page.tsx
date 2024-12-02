'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  tags: string[];
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with Linux System Administration',
    excerpt: 'Essential tips and best practices for beginning Linux system administrators.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    date: 'Jan 15, 2024',
    readTime: '5 min read',
    category: 'System Administration',
    author: {
      name: 'John Doe',
      avatar: '/avatars/john.jpg',
      role: 'Linux Admin'
    },
    tags: ['Linux', 'Administration', 'Beginners']
  },
  {
    id: '2',
    title: 'Security Hardening in Linux: A Complete Guide',
    excerpt: 'Learn how to secure your Linux systems against common threats and vulnerabilities.',
    content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    date: 'Jan 12, 2024',
    readTime: '8 min read',
    category: 'Security',
    author: {
      name: 'Jane Smith',
      avatar: '/avatars/jane.jpg',
      role: 'Security Expert'
    },
    tags: ['Security', 'Hardening', 'Best Practices']
  },
  {
    id: '3',
    title: 'Containerization with Docker and Linux',
    excerpt: 'A comprehensive guide to running containers on Linux systems.',
    content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    date: 'Jan 10, 2024',
    readTime: '6 min read',
    category: 'Containers',
    author: {
      name: 'Mike Johnson',
      avatar: '/avatars/mike.jpg',
      role: 'DevOps Engineer'
    },
    tags: ['Docker', 'Containers', 'DevOps']
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      {/* Header Section */}
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

      {/* Blog Posts Section */}
      <section className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {blogPosts.map((post) => (
            <Card 
              key={post.id} 
              className="flex flex-col h-full hover:shadow-lg transition-shadow border-0 sm:border"
            >
              <CardHeader className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge variant="outline" className="text-xs">
                    {post.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{post.readTime}</span>
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
                      <AvatarImage src={post.author.avatar} alt={post.author.name} />
                      <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium truncate">{post.author.name}</span>
                      <span className="text-xs text-muted-foreground truncate">{post.author.role}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {post.date}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="flex-grow p-4 sm:p-6">
                <ScrollArea className="h-20 sm:h-24">
                  <p className="text-sm text-muted-foreground">
                    {post.content}
                  </p>
                </ScrollArea>
              </CardContent>

              <CardFooter className="flex flex-wrap gap-2 p-4 sm:p-6 border-t">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-6 sm:mt-10 text-center pb-6 sm:pb-10">
          <Button 
            variant="outline" 
            size="lg"
            className="w-full sm:w-auto"
          >
            Load More Posts
          </Button>
        </div>
      </section>
    </div>
  );
}
