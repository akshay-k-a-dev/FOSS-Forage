import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get real-time community stats using existing Prisma setup
    const [users, topics, replies] = await Promise.all([
      prisma.user.count({ where: { isActive: true } }),
      prisma.discussion.count({ where: { status: 'ACTIVE' } }),
      prisma.reply.count({ where: { status: 'active' } })
    ])

    return NextResponse.json({
      success: true,
      data: {
        users,
        topics,
        replies
      }
    })
  } catch (error) {
    console.error('Get forum stats error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch forum stats' },
      { status: 500 }
    )
  }
}