import { NextResponse } from 'next/server';
import { authenticateUser, generateToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-utils';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    
    if (!body || !body.username || !body.password) {
      return errorResponse('Username and password are required', 400);
    }

    const { username, password } = body;
    
    const user = await authenticateUser(username, password);
    
    if (!user) {
      return unauthorizedResponse();
    }
    
    const token = generateToken(user);
    
    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
      sameSite: 'strict'
    });
    
    return successResponse({ 
      success: true, 
      user: {
        username: user.username,
        role: user.role,
        employee_name: user.employee_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('Internal server error');
  }
}