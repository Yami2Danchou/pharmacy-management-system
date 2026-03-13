import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyToken, hashPassword } from '@/lib/auth';
import { cookies } from 'next/headers';

// Get all users (admin only)
export async function GET() {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const currentUser = verifyToken(token);

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (currentUser.role !== 'Admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access only' },
        { status: 403 }
      );
    }

    // Remove created_at from the query since it doesn't exist yet
    const users = await sql`
      SELECT 
        u.user_id, 
        u.username, 
        u.role, 
        u.is_active,
        e.employee_id, 
        e.employee_name,
        e.employee_gender,
        e.employee_age,
        e.employee_address,
        e.employee_contacts
      FROM "User" u
      JOIN Employee e ON u.employee_id = e.employee_id
      ORDER BY u.user_id DESC
    `;
    
    // Ensure we always return an array
    return NextResponse.json(users || []);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users: ' + error.message },
      { status: 500 }
    );
  }
}

// Create new user (admin only)
export async function POST(request) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const currentUser = verifyToken(token);

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (currentUser.role !== 'Admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access only' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.username || !body.password || !body.role || !body.employee_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { 
      username, 
      password, 
      role, 
      employee_name, 
      employee_gender, 
      employee_age, 
      employee_address, 
      employee_contacts 
    } = body;

    // Check if username already exists
    const existingUser = await sql`
      SELECT user_id FROM "User" WHERE username = ${username}
    `;

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      );
    }

    // Start transaction - insert employee first
    const employee = await sql`
      INSERT INTO Employee (
        employee_name, 
        employee_gender, 
        employee_age, 
        employee_address, 
        employee_contacts
      ) VALUES (
        ${employee_name}, 
        ${employee_gender || null}, 
        ${employee_age || null}, 
        ${employee_address || null}, 
        ${employee_contacts || null}
      )
      RETURNING employee_id
    `;

    const employeeId = employee[0].employee_id;
    const hashedPassword = await hashPassword(password);

    // Create user without created_at field
    const result = await sql`
      INSERT INTO "User" (
        username, 
        password_hash, 
        role, 
        employee_id, 
        is_active
      ) VALUES (
        ${username}, 
        ${hashedPassword}, 
        ${role}, 
        ${employeeId}, 
        true
      )
      RETURNING user_id, username, role, is_active
    `;

    return NextResponse.json({
      ...result[0],
      employee_id: employeeId,
      employee_name
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user: ' + error.message },
      { status: 500 }
    );
  }
}