import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'latest'

    const skip = (page - 1) * limit

    let where: any = { status: 'ACTIVE' }
    
    if (category) {
      where.category = category
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } }
      ]
    }

    let orderBy: any = {}
    switch (sort) {
      case 'popular':
        orderBy = { views: 'desc' }
        break
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      default:
        orderBy = [{ isPinned: 'desc' }, { updatedAt: 'desc' }]
    }

    const discussions = await prisma.discussion.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
            level: true
          }
        },
        replies: {
          select: {
            id: true,
            createdAt: true,
            author: {
              select: {
                username: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    const total = await prisma.discussion.count({ where })

    // Parse tags and add counts
    const discussionsWithParsedData = discussions.map(discussion => ({
      ...discussion,
      tags: discussion.tags ? JSON.parse(discussion.tags) : [],
      _count: {
        replies: discussion.replies.length,
        likes: 0 // Will be implemented when likes are added
      }
    }))

    return NextResponse.json({
      success: true,
      data: discussionsWithParsedData,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get discussions error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const { title, content, category, tags } = await request.json()

    if (!title || !content || !category) {
      return NextResponse.json(
        { success: false, message: 'Title, content, and category are required' },
        { status: 400 }
      )
    }

    // Generate slug
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const discussion = await prisma.discussion.create({
      data: {
        title,
        content,
        slug,
        category,
        tags: JSON.stringify(tags || []), // Store as JSON string
        authorId: user.id
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
            level: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Discussion created successfully',
      data: {
        ...discussion,
        tags: JSON.parse(discussion.tags),
        _count: {
          replies: 0,
          likes: 0
        }
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Create discussion error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}