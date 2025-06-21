import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'
import { awardPoints } from '@/lib/points'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Authorization required' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    const user = await getUserFromToken(token)
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      )
    }

    const { content, parentId } = await request.json()

    if (!content) {
      return NextResponse.json(
        { success: false, message: 'Content is required' },
        { status: 400 }
      )
    }

    // Check if discussion exists and is not locked
    const discussion = await prisma.discussion.findUnique({
      where: { id: params.id }
    })

    if (!discussion) {
      return NextResponse.json(
        { success: false, message: 'Discussion not found' },
        { status: 404 }
      )
    }

    if (discussion.isLocked) {
      return NextResponse.json(
        { success: false, message: 'Discussion is locked' },
        { status: 403 }
      )
    }

    const reply = await prisma.reply.create({
      data: {
        content,
        discussionId: params.id,
        authorId: user.id,
        parentId: parentId || null
      },
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
      }
    })

    // Update discussion's updatedAt
    await prisma.discussion.update({
      where: { id: params.id },
      data: { updatedAt: new Date() }
    })

    // Award points for posting reply
    await awardPoints(user.id, 'REPLY_POSTED', `Replied to discussion: ${discussion.title}`)

    return NextResponse.json({
      success: true,
      message: 'Reply posted successfully',
      data: reply
    }, { status: 201 })

  } catch (error) {
    console.error('Create reply error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}