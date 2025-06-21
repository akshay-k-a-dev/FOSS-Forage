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

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        points: true,
        level: true,
        createdAt: true,
        lastActivity: true,
        _count: {
          select: {
            discussions: true,
            replies: true,
            blogPosts: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      users
    })

  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
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
    
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Super Admin access required' },
        { status: 403 }
      )
    }

    const { userId, action, role } = await request.json()

    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent super admin from modifying themselves
    if (targetUser.id === user.id) {
      return NextResponse.json(
        { success: false, message: 'Cannot modify your own account' },
        { status: 400 }
      )
    }

    let updateData: any = {}

    switch (action) {
      case 'changeRole':
        if (!['USER', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
          return NextResponse.json(
            { success: false, message: 'Invalid role' },
            { status: 400 }
          )
        }
        updateData.role = role
        break

      case 'ban':
        updateData.isActive = false
        break

      case 'unban':
        updateData.isActive = true
        break

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        )
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        points: true,
        level: true
      }
    })

    // Log moderation action
    await prisma.moderationLog.create({
      data: {
        action,
        targetType: 'USER',
        targetId: userId,
        reason: `${action} performed by admin`,
        moderatorId: user.id
      }
    })

    return NextResponse.json({
      success: true,
      message: `User ${action} successful`,
      user: updatedUser
    })

  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}