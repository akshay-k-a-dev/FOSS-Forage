'use client'

import { useState, useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, TrendingUp, Clock, Users, Terminal, Code, Server, Shield, Lightbulb, Wrench, Search, Plus } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

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

interface Discussion {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  views: number
  isPinned: boolean
  createdAt: string
  updatedAt: string
  author: {
    id: string
    username: string
    avatar?: string
    level: number
  }
  replies: any[]
  _count: {
    replies: number
    likes: number
  }
}

export default function ForumPage() {
  const { isAuthenticated } = useAuth()
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('latest')

  useEffect(() => {
    fetchDiscussions()
  }, [selectedCategory, sortBy])

  const fetchDiscussions = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory)
      if (searchQuery) params.append('search', searchQuery)
      params.append('sort', sortBy)

      const response = await fetch(`/api/forum/discussions?${params}`)
      const data = await response.json()

      if (data.success) {
        setDiscussions(data.data)
      }
    } catch (error) {
      console.error('Error fetching discussions:', error)
      toast.error('Failed to load discussions')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchDiscussions()
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="container py-4 px-4 md:py-8 lg:py-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Community Forum</h1>
          <p className="text-sm md:text-base text-muted-foreground">Join discussions with fellow Linux enthusiasts</p>
        </div>
        {isAuthenticated ? (
          <Link href="/forum/new">
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Start New Discussion
            </Button>
          </Link>
        ) : (
          <Link href="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Login to Post
            </Button>
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.name} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
                <Card 
                  key={category.name} 
                  className="p-3 md:p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedCategory(category.name)}
                >
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

          {/* Discussions List */}
          <div className="space-y-3 md:space-y-4">
            <h2 className="text-xl font-semibold">Recent Discussions</h2>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </Card>
                ))}
              </div>
            ) : discussions.length > 0 ? (
              discussions.map((discussion) => (
                <Card key={discussion.id} className="p-3 md:p-4 hover:shadow-lg transition-shadow">
                  <Link href={`/forum/discussion/${discussion.id}`} className="block">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {discussion.isPinned && (
                          <Badge variant="secondary" className="text-xs">Pinned</Badge>
                        )}
                        <Badge variant="outline" className="text-xs">{discussion.category}</Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatTimeAgo(discussion.updatedAt)}</span>
                    </div>
                    <h3 className="font-semibold text-sm md:text-base mb-2 hover:text-primary line-clamp-2">
                      {discussion.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 md:h-4 md:w-4" />
                        <span>{discussion.author.username}</span>
                        <Badge variant="secondary" className="text-xs">Lv.{discussion.author.level}</Badge>
                      </div>
                      <span className="whitespace-nowrap">{discussion._count.replies} replies</span>
                      <span className="whitespace-nowrap">{discussion._count.likes} likes</span>
                      <span className="whitespace-nowrap">{discussion.views} views</span>
                    </div>
                  </Link>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No discussions found</h3>
                <p className="text-muted-foreground mb-4">Be the first to start a discussion!</p>
                {isAuthenticated && (
                  <Link href="/forum/new">
                    <Button>Start Discussion</Button>
                  </Link>
                )}
              </Card>
            )}
          </div>
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
                <span className="font-medium">{discussions.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm md:text-base">
                <span className="text-muted-foreground">Replies</span>
                <span className="font-medium">{discussions.reduce((acc, d) => acc + d._count.replies, 0)}</span>
              </div>
            </div>
          </Card>

          {/* Top Contributors */}
          <Card className="p-4 md:p-6">
            <h3 className="font-semibold text-sm md:text-base mb-4">Top Contributors</h3>
            <div className="space-y-3 md:space-y-4">
              {discussions.slice(0, 3).map((discussion) => (
                <div key={discussion.id} className="flex items-center space-x-3">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <Users className="h-3 w-3 md:h-4 md:w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm md:text-base">{discussion.author.username}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Level {discussion.author.level}</p>
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