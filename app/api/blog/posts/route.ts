import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'
import { awardPoints } from '@/lib/points'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    let where: any = { status: 'PUBLISHED' }
    
    if (category) {
      where.category = category
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ]
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      }
    })

    const total = await prisma.blogPost.count({ where })

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get blog posts error:', error)
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

    const { title, content, excerpt, category, tags, featuredImage, status } = await request.json()

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

    const post = await prisma.blogPost.create({
      data: {
        title,
        content,
        excerpt: excerpt || content.substring(0, 200) + '...',
        slug,
        category,
        tags: tags || [],
        featuredImage,
        status: status || 'DRAFT',
        authorId: user.id,
        publishedAt: status === 'PUBLISHED' ? new Date() : null
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    })

    // Award points for creating blog post
    if (status === 'PUBLISHED') {
      await awardPoints(user.id, 'BLOG_POST_CREATED', `Published blog post: ${title}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      data: post
    }, { status: 201 })

  } catch (error) {
    console.error('Create blog post error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}