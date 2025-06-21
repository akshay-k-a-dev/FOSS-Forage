import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'points'
    const limit = parseInt(searchParams.get('limit') || '10')

    let orderBy: any = {}
    
    switch (type) {
      case 'points':
        orderBy = { points: 'desc' }
        break
      case 'level':
        orderBy = { level: 'desc' }
        break
      case 'discussions':
        // This would need a more complex query with counts
        orderBy = { points: 'desc' } // Fallback for now
        break
      default:
        orderBy = { points: 'desc' }
    }

    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        points: true,
        level: true,
        _count: {
          select: {
            discussions: true,
            replies: true,
            blogPosts: true
          }
        }
      },
      orderBy,
      take: limit
    })

    return NextResponse.json({
      success: true,
      data: users
    })

  } catch (error) {
    console.error('Get leaderboard error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}