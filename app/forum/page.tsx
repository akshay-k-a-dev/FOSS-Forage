'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, TrendingUp, Clock, Users, Terminal, Code, Server, Shield, Lightbulb, Wrench } from 'lucide-react'
import Link from 'next/link'

const categories = [
  {
    icon: Terminal,
    name: "Command Line & Shell",
    description: "Bash, Zsh, and terminal tricks",
    topics: 156,
    color: "text-green-500"
  },
  {
    icon: Server,
    name: "System Administration",
    description: "Managing Linux servers and services",
    topics: 142,
    color: "text-blue-500"
  },
  {
    icon: Shield,
    name: "Security",
    description: "Linux security and hardening",
    topics: 98,
    color: "text-red-500"
  },
  {
    icon: Code,
    name: "Development",
    description: "Programming on Linux",
    topics: 234,
    color: "text-purple-500"
  },
  {
    icon: Lightbulb,
    name: "Tips & Tricks",
    description: "Useful Linux hacks and tips",
    topics: 187,
    color: "text-yellow-500"
  },
  {
    icon: Wrench,
    name: "Troubleshooting",
    description: "Help with Linux issues",
    topics: 321,
    color: "text-orange-500"
  }
]

const trendingTopics = [
  {
    title: "Best practices for securing SSH access",
    category: "Security",
    replies: 45,
    views: 1200,
    lastActive: "2h ago"
  },
  {
    title: "How to optimize Docker containers on Linux",
    category: "System Administration",
    replies: 32,
    views: 890,
    lastActive: "4h ago"
  },
  {
    title: "Vim vs Neovim in 2024",
    category: "Tips & Tricks",
    replies: 78,
    views: 2100,
    lastActive: "1h ago"
  }
]

const recentDiscussions = [
  {
    title: "Help with systemd service configuration",
    category: "System Administration",
    author: "linuxpro",
    replies: 8,
    lastActive: "10m ago"
  },
  {
    title: "Best Linux distro for programming in 2024",
    category: "Development",
    author: "coder123",
    replies: 15,
    lastActive: "30m ago"
  },
  {
    title: "How to set up a LAMP stack on Ubuntu",
    category: "Development",
    author: "webdev",
    replies: 12,
    lastActive: "1h ago"
  }
]

export default function ForumPage() {
  return (
    <div className="container py-4 px-4 md:py-8 lg:py-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Community Forum</h1>
          <p className="text-sm md:text-base text-muted-foreground">Join discussions with fellow Linux enthusiasts</p>
        </div>
        <Button size="lg" className="w-full sm:w-auto bg-white text-black hover:bg-gray-100">
          Start New Discussion
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Categories and Discussions */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Card key={category.name} className="p-3 md:p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className={`p-2 rounded-lg bg-secondary ${category.color} shrink-0`}>
                      <Icon className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm md:text-base truncate">{category.name}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground mb-2 line-clamp-2">{category.description}</p>
                      <div className="flex items-center text-xs md:text-sm text-muted-foreground">
                        <MessageSquare className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                        {category.topics} topics
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Discussions Tabs */}
          <Tabs defaultValue="trending" className="w-full">
            <TabsList className="mb-4 w-full justify-start overflow-x-auto">
              <TabsTrigger value="trending" className="text-sm md:text-base">
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="recent" className="text-sm md:text-base">
                <Clock className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                Recent
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="trending">
              <div className="space-y-3 md:space-y-4">
                {trendingTopics.map((topic) => (
                  <Card key={topic.title} className="p-3 md:p-4 hover:shadow-lg transition-shadow">
                    <Link href="#" className="block">
                      <h3 className="font-semibold text-sm md:text-base mb-2 hover:text-primary line-clamp-2">{topic.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">{topic.category}</Badge>
                        <span className="whitespace-nowrap">{topic.replies} replies</span>
                        <span className="whitespace-nowrap">{topic.views} views</span>
                        <span className="whitespace-nowrap">{topic.lastActive}</span>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recent">
              <div className="space-y-3 md:space-y-4">
                {recentDiscussions.map((discussion) => (
                  <Card key={discussion.title} className="p-3 md:p-4 hover:shadow-lg transition-shadow">
                    <Link href="#" className="block">
                      <h3 className="font-semibold text-sm md:text-base mb-2 hover:text-primary line-clamp-2">{discussion.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">{discussion.category}</Badge>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 md:h-4 md:w-4" />
                          <span>{discussion.author}</span>
                        </div>
                        <span className="whitespace-nowrap">{discussion.replies} replies</span>
                        <span className="whitespace-nowrap">{discussion.lastActive}</span>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 md:space-y-6 order-first lg:order-last">
          {/* Community Stats */}
          <Card className="p-4 md:p-6">
            <h3 className="font-semibold text-sm md:text-base mb-4">Community Stats</h3>
            <div className="space-y-3 md:space-y-4">
              <div className="flex justify-between items-center text-sm md:text-base">
                <span className="text-muted-foreground">Members</span>
                <span className="font-medium">1,234</span>
              </div>
              <div className="flex justify-between items-center text-sm md:text-base">
                <span className="text-muted-foreground">Topics</span>
                <span className="font-medium">3,456</span>
              </div>
              <div className="flex justify-between items-center text-sm md:text-base">
                <span className="text-muted-foreground">Replies</span>
                <span className="font-medium">12,345</span>
              </div>
            </div>
          </Card>

          {/* Top Contributors */}
          <Card className="p-4 md:p-6">
            <h3 className="font-semibold text-sm md:text-base mb-4">Top Contributors</h3>
            <div className="space-y-3 md:space-y-4">
              {['linuxpro', 'coder123', 'webdev'].map((user) => (
                <div key={user} className="flex items-center space-x-3">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <Users className="h-3 w-3 md:h-4 md:w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm md:text-base">{user}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">150+ replies</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
