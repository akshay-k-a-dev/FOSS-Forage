import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')

    const skip = (page - 1) * limit

    let where: any = { isPublished: true }
    
    if (category) {
      where.category = category
    }
    
    if (difficulty) {
      where.difficulty = difficulty
    }

    const tutorials = await prisma.tutorial.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    })

    const total = await prisma.tutorial.count({ where })

    // Parse tags from JSON string
    const tutorialsWithParsedTags = tutorials.map(tutorial => ({
      ...tutorial,
      tags: tutorial.tags ? JSON.parse(tutorial.tags) : []
    }))

    return NextResponse.json({
      success: true,
      data: tutorialsWithParsedTags,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get tutorials error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}