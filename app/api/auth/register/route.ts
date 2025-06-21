import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'
import { sendVerificationEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, firstName, lastName } = await request.json()

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Username, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists with this email or username' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex')

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        firstName: firstName || '',
        lastName: lastName || '',
        emailVerificationToken
      }
    })

    // Send verification email
    try {
      await sendVerificationEmail(email, emailVerificationToken)
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
    }

    // Generate JWT token
    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role
    })

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      token,
      user: userWithoutPassword
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}