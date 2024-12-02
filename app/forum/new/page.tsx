'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth'

// Mock data
const mockCategories = [
  { _id: "1", name: "General Discussion" },
  { _id: "2", name: "Help & Support" },
  { _id: "3", name: "Feature Requests" }
];

export default function NewDiscussionPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [categories, setCategories] = useState(mockCategories)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: ''
  })

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      toast.error('Please log in to create a discussion')
      router.push('/login')
      return
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.content.trim() || !formData.categoryId) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      // Mock creating a new discussion
      toast.success('Discussion created successfully!')
      router.push('/forum')
    } catch (error) {
      console.error('Error creating discussion:', error)
      toast.error('Failed to create discussion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-3xl py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Start New Discussion</CardTitle>
          <CardDescription>Share your thoughts with the Linux community</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter a descriptive title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your discussion content here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="min-h-[200px]"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Discussion'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
