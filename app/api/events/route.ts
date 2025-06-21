import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all'
    const limit = parseInt(searchParams.get('limit') || '20')

    let where: any = {}
    
    if (type === 'upcoming') {
      where.startDate = { gte: new Date() }
      where.status = 'UPCOMING'
    } else if (type === 'past') {
      where.endDate = { lt: new Date() }
      where.status = 'COMPLETED'
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: type === 'upcoming' ? { startDate: 'asc' } : { startDate: 'desc' },
      take: limit
    })

    return NextResponse.json({
      success: true,
      data: events
    })

  } catch (error) {
    console.error('Get events error:', error)
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
    
    if (!user || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      )
    }

    const { 
      title, 
      description, 
      startDate, 
      endDate, 
      location, 
      isOnline, 
      meetingLink, 
      image,
      maxAttendees 
    } = await request.json()

    if (!title || !description || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, message: 'Title, description, start date, and end date are required' },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
        isOnline: isOnline || false,
        meetingLink,
        image,
        maxAttendees,
        registrations: JSON.stringify([]),
        status: 'UPCOMING'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Event created successfully',
      data: event
    }, { status: 201 })

  } catch (error) {
    console.error('Create event error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}