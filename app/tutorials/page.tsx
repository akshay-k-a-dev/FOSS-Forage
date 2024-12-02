'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface Tutorial {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  category: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const tutorials: Tutorial[] = [
  {
    id: '1',
    title: 'Getting Started with Linux Command Line',
    description: 'Learn the essential Linux commands that every user should know. This comprehensive guide covers navigation, file management, and basic system operations.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'Basics',
    duration: '15 min',
    difficulty: 'Beginner'
  },
  {
    id: '2',
    title: 'System Administration Fundamentals',
    description: 'Deep dive into Linux system administration. Learn about user management, permissions, services, and system monitoring.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'Administration',
    duration: '25 min',
    difficulty: 'Intermediate'
  },
  {
    id: '3',
    title: 'Advanced Shell Scripting',
    description: 'Master the art of shell scripting. Learn about variables, loops, conditions, and creating powerful automation scripts.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'Programming',
    duration: '30 min',
    difficulty: 'Advanced'
  },
];

export default function TutorialsPage() {
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
          <Card key={tutorial.id} className="flex flex-col h-full">
            <CardHeader className="space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <CardTitle className="text-lg sm:text-xl font-bold line-clamp-2">
                  {tutorial.title}
                </CardTitle>
                <Badge 
                  className="self-start whitespace-nowrap"
                  variant={
                    tutorial.difficulty === 'Beginner' ? 'default' :
                    tutorial.difficulty === 'Intermediate' ? 'secondary' : 'destructive'
                  }
                >
                  {tutorial.difficulty}
                </Badge>
              </div>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                {tutorial.category} • {tutorial.duration}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div className="aspect-video w-full">
                <iframe
                  className="w-full h-full rounded-lg shadow-sm"
                  src={tutorial.videoUrl}
                  title={tutorial.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <ScrollArea className="h-20 sm:h-24">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {tutorial.description}
                </p>
              </ScrollArea>
            </CardContent>
            <Separator />
            <CardFooter className="pt-4">
              <Button 
                variant="outline" 
                className="w-full text-sm sm:text-base hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Watch Tutorial
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
