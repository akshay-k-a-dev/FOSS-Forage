import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Mock user database
let users = [
  {
    id: '1',
    email: 'akshayka@mamocollege.org',
    username: 'akshayka',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK',
    role: 'super_admin',
    firstName: 'Akshay',
    lastName: 'K A',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    email: 'admin@example.com',
    username: 'admin',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    email: 'user@example.com',
    username: 'user',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK',
    role: 'user',
    firstName: 'Regular',
    lastName: 'User',
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    const user = users.find(u => u.id === decoded.id);
    return user;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = verifyAuth(request);

    if (!user || !['super_admin', 'admin'].includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Return users without passwords
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);

    return NextResponse.json({
      success: true,
      users: usersWithoutPasswords
    });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = verifyAuth(request);

    if (!user || user.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Super Admin access required' },
        { status: 403 }
      );
    }

    const { userId, action, role } = await request.json();

    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent super admin from modifying themselves
    if (targetUser.id === user.id) {
      return NextResponse.json(
        { success: false, message: 'Cannot modify your own account' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'changeRole':
        if (!['user', 'admin', 'super_admin'].includes(role)) {
          return NextResponse.json(
            { success: false, message: 'Invalid role' },
            { status: 400 }
          );
        }
        targetUser.role = role;
        break;

      case 'ban':
        targetUser.isActive = false;
        break;

      case 'unban':
        targetUser.isActive = true;
        break;

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `User ${action} successful`,
      user: { ...targetUser, password: undefined }
    });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}