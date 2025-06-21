import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
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
    
    if (!user || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all'

    let data: any = {}

    if (type === 'all' || type === 'discussions') {
      data.discussions = await prisma.discussion.findMany({
        include: {
          author: {
            select: { username: true }
          },
          _count: {
            select: { replies: true, likes: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      })
    }

    if (type === 'all' || type === 'blog') {
      data.blogPosts = await prisma.blogPost.findMany({
        include: {
          author: {
            select: { username: true }
          },
          _count: {
            select: { comments: true, likes: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      })
    }

    if (type === 'all' || type === 'tutorials') {
      data.tutorials = await prisma.tutorial.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20
      })
    }

    if (type === 'all' || type === 'news') {
      data.news = await prisma.news.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20
      })
    }

    return NextResponse.json({
      success: true,
      data
    })

  } catch (error) {
    console.error('Get content error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}