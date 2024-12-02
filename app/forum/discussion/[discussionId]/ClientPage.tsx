'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Users, MessageSquare, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth'

interface Discussion {
  _id: number
  title: string
  content: string
  author: { username: string }
  createdAt: string
  views: number
  replies: any[]
  category: { name: string }
}

interface Props {
  initialDiscussion: Discussion
  params: { discussionId: string }
}

export default function ClientPage({ initialDiscussion, params }: Props) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [replyLoading, setReplyLoading] = useState(false)
  const [discussion, setDiscussion] = useState<Discussion>(initialDiscussion)
  const [replyContent, setReplyContent] = useState("")

  useEffect(() => {
    const fetchDiscussion = async () => {
      try {
        const response = await fetch(`/api/discussions/${params.discussionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch discussion');
        }
        const data = await response.json();
        setDiscussion(data);
      } catch (error) {
        console.error('Error fetching discussion:', error);
        toast.error('Failed to load discussion');
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussion();
  }, [params.discussionId]);

  const handleAddReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please log in to reply');
      router.push('/login');
      return;
    }

    if (!replyContent.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    try {
      setReplyLoading(true);
      const response = await fetch(`/api/discussions/${params.discussionId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: replyContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to add reply');
      }

      const newReply = await response.json();
      
      setDiscussion({
        ...discussion,
        replies: [...discussion.replies, newReply]
      });
      
      setReplyContent("");
      toast.success('Reply added successfully!');
    } catch (error) {
      console.error('Error adding reply:', error);
      toast.error('Failed to add reply. Please try again.');
    } finally {
      setReplyLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!discussion) {
    return null
  }

  return (
    <div className="container max-w-4xl py-8 px-4">
      {/* Discussion Header */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary">{discussion.category.name}</Badge>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {discussion.views} views
              </span>
              <span className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                {discussion.replies.length} replies
              </span>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-4">{discussion.title}</h1>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
            <span>{discussion.author.username}</span>
            <span>•</span>
            <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            {discussion.content}
          </div>
        </CardContent>
      </Card>

      {/* Replies */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Replies</h2>
        
        {discussion.replies.map((reply) => (
          <Card key={reply._id}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <Users className="h-4 w-4" />
                </div>
                <span>{reply.author.username}</span>
                <span>•</span>
                <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                {reply.content}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Reply Form */}
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
                  {replyLoading ? 'Sending...' : 'Post Reply'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
