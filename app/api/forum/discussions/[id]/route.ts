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
            },
            _count: {
              select: {
                likes: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        _count: {
          select: {
            replies: true,
            likes: true
          }
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

    return NextResponse.json({
      success: true,
      data: discussion
    })

  } catch (error) {
    console.error('Get discussion error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}