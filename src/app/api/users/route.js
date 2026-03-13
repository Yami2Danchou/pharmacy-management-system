import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyToken, hashPassword } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const user = verifyToken(token);

    if (!user || user.role !== 'Admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const users = await sql`
      SELECT u.user_id, u.username, u.role, u.is_active, 
             e.employee_id, e.employee_name, e.employee_role
      FROM "User" u
      JOIN Employee e ON u.employee_id = e.employee_id
      ORDER BY u.user_id
    `;
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const currentUser = verifyToken(token);

    if (!currentUser || currentUser.role !== 'Admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { username, password, role, employee_id } = await request.json();

    // Check if username already exists
    const existing = await sql`
      SELECT user_id FROM "User" WHERE username = ${username}
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const result = await sql`
      INSERT INTO "User" (username, password_hash, role, employee_id, is_active)
      VALUES (${username}, ${hashedPassword}, ${role}, ${employee_id}, true)
      RETURNING user_id, username, role, is_active
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}