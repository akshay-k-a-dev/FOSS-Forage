'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, MessageSquare, Eye, Heart, Pin, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'

interface Discussion {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  views: number
  isPinned: boolean
  isLocked: boolean
  createdAt: string
  author: {
    id: string
    username: string
    avatar?: string
    level: number
    points: number
  }
  replies: Reply[]
  _count: {
    replies: number
    likes: number
  }
}

interface Reply {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    username: string
    avatar?: string
    level: number
  }
  _count: {
    likes: number
  }
}

export default function DiscussionPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, token } = useAuth()
  const [discussion, setDiscussion] = useState<Discussion | null>(null)
  const [loading, setLoading] = useState(true)
  const [replyContent, setReplyContent] = useState('')
  const [replyLoading, setReplyLoading] = useState(false)

  useEffect(() => {
    if (params && params.id) {
      fetchDiscussion()
    }
  }, [params?.id])

  const fetchDiscussion = async () => {
    if (!params?.id) return
    
    try {
      const response = await fetch(`/api/forum/discussions/${params.id}`)
      
      if (!response.ok) {
        throw new Error('Discussion not found')
      }

      const data = await response.json()

      if (data.success) {
        // Parse tags if they're stored as JSON string
        const discussionData = {
          ...data.data,
          tags: typeof data.data.tags === 'string' ? JSON.parse(data.data.tags || '[]') : data.data.tags || []
        }
        setDiscussion(discussionData)
      } else {
        toast.error('Discussion not found')
        router.push('/forum')
      }
    } catch (error) {
      console.error('Error fetching discussion:', error)
      toast.error('Failed to load discussion')
      router.push('/forum')
    } finally {
      setLoading(false)
    }
  }

  const handleAddReply = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast.error('Please log in to reply')
      router.push('/login')
      return
    }

    if (!replyContent.trim()) {
      toast.error('Please enter a reply')
      return
    }

    if (!params?.id) {
      toast.error('Invalid discussion')
      return
    }

    try {
      setReplyLoading(true)
      const response = await fetch(`/api/forum/discussions/${params.id}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: replyContent })
      })

      const data = await response.json()

      if (data.success) {
        setReplyContent('')
        toast.success('Reply added successfully!')
        fetchDiscussion() // Refresh to show new reply
      } else {
        toast.error(data.message || 'Failed to add reply')
      }
    } catch (error) {
      console.error('Error adding reply:', error)
      toast.error('Failed to add reply')
    } finally {
      setReplyLoading(false)
    }
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

  if (loading) {
    return (
      <div className="container py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!discussion) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Discussion not found</h1>
        <Button onClick={() => router.push('/forum')}>Back to Forum</Button>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-8 px-4">
      {/* Discussion Header */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {discussion.isPinned && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Pin className="h-3 w-3" />
                  Pinned
                </Badge>
              )}
              {discussion.isLocked && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Locked
                </Badge>
              )}
              <Badge variant="outline">{discussion.category}</Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {discussion.views} views
              </span>
              <span className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                {discussion._count.replies} replies
              </span>
              <span className="flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                {discussion._count.likes} likes
              </span>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-4">{discussion.title}</h1>
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {discussion.author.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="font-medium">{discussion.author.username}</span>
              <Badge variant="secondary" className="ml-2 text-xs">
                Lv.{discussion.author.level}
              </Badge>
              <div className="text-xs">
                {discussion.author.points} points • {formatTimeAgo(discussion.createdAt)}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none mb-4">
            {discussion.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
          {discussion.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {discussion.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Replies */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">
          Replies ({discussion._count.replies})
        </h2>
        
        {discussion.replies.map((reply) => (
          <Card key={reply.id}>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3 mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {reply.author.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{reply.author.username}</span>
                    <Badge variant="secondary" className="text-xs">
                      Lv.{reply.author.level}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(reply.createdAt)}
                    </span>
                  </div>
                  <div className="prose dark:prose-invert max-w-none">
                    {reply.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-2">{paragraph}</p>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-primary">
                      <Heart className="h-4 w-4" />
                      {reply._count.likes}
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Reply Form */}
        {isAuthenticated && !discussion.isLocked ? (
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleAddReply}>
                <Textarea
                  placeholder="Write your reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="mb-4"
                  required
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={replyLoading}>
                    {replyLoading ? 'Posting...' : 'Post Reply'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : !isAuthenticated ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">Please log in to reply to this discussion</p>
              <Button onClick={() => router.push('/login')}>
                Log In
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">This discussion is locked and no longer accepting replies.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}