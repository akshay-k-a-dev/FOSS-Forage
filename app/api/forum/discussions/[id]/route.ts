import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const discussion = await prisma.discussion.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
            level: true,
            points: true
          }
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true,
                level: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!discussion) {
      return NextResponse.json(
        { success: false, message: 'Discussion not found' },
        { status: 404 }
      )
    }

    // Increment views
    await prisma.discussion.update({
      where: { id: params.id },
      data: { views: { increment: 1 } }
    })

    // Parse tags from JSON string
    const discussionWithParsedTags = {
      ...discussion,
      tags: discussion.tags ? JSON.parse(discussion.tags) : [],
      _count: {
        replies: discussion.replies.length,
        likes: 0 // Will be implemented when likes are added
      }
    }

    // Parse reply counts
    const repliesWithCounts = discussion.replies.map(reply => ({
      ...reply,
      _count: {
        likes: 0 // Will be implemented when likes are added
      }
    }))

    return NextResponse.json({
      success: true,
      data: {
        ...discussionWithParsedTags,
        replies: repliesWithCounts
      }
    })

  } catch (error) {
    console.error('Get discussion error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}