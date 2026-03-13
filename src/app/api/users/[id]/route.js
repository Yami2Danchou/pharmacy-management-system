import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyToken, hashPassword } from '@/lib/auth';
import { cookies } from 'next/headers';

// Get single user (admin only)
export async function GET(request, { params }) {
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

    const { id } = await params;
    
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
      WHERE u.user_id = ${id}
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(users[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user: ' + error.message },
      { status: 500 }
    );
  }
}

// Update user (admin only)
export async function PUT(request, { params }) {
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

    const { id } = await params;
    const body = await request.json();
    
    const { 
      username, 
      password, 
      role, 
      is_active,
      employee_name, 
      employee_gender, 
      employee_age, 
      employee_address, 
      employee_contacts 
    } = body;

    // Get current user data
    const currentUserData = await sql`
      SELECT u.*, e.employee_id 
      FROM "User" u
      JOIN Employee e ON u.employee_id = e.employee_id
      WHERE u.user_id = ${id}
    `;

    if (currentUserData.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userData = currentUserData[0];

    // Check if username is taken by another user
    if (username !== userData.username) {
      const existingUser = await sql`
        SELECT user_id FROM "User" 
        WHERE username = ${username} AND user_id != ${id}
      `;
      if (existingUser.length > 0) {
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 400 }
        );
      }
    }

    // Update employee information
    await sql`
      UPDATE Employee 
      SET 
        employee_name = ${employee_name || userData.employee_name},
        employee_gender = ${employee_gender || userData.employee_gender},
        employee_age = ${employee_age || userData.employee_age},
        employee_address = ${employee_address || userData.employee_address},
        employee_contacts = ${employee_contacts || userData.employee_contacts}
      WHERE employee_id = ${userData.employee_id}
    `;

    // Update user information
    let userUpdate;
    if (password) {
      // Update with new password
      const hashedPassword = await hashPassword(password);
      userUpdate = await sql`
        UPDATE "User" 
        SET 
          username = ${username},
          password_hash = ${hashedPassword},
          role = ${role},
          is_active = ${is_active !== undefined ? is_active : userData.is_active}
        WHERE user_id = ${id}
        RETURNING user_id, username, role, is_active
      `;
    } else {
      // Update without password change
      userUpdate = await sql`
        UPDATE "User" 
        SET 
          username = ${username},
          role = ${role},
          is_active = ${is_active !== undefined ? is_active : userData.is_active}
        WHERE user_id = ${id}
        RETURNING user_id, username, role, is_active
      `;
    }

    return NextResponse.json({
      ...userUpdate[0],
      employee_name: employee_name || userData.employee_name
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user: ' + error.message },
      { status: 500 }
    );
  }
}

// Delete user (admin only)
export async function DELETE(request, { params }) {
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

    const { id } = await params;

    // Don't allow deleting your own account
    if (parseInt(id) === currentUser.userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Check if user has any sales records
    const sales = await sql`
      SELECT sale_id FROM Sale WHERE user_id = ${id} LIMIT 1
    `;

    if (sales.length > 0) {
      // Instead of deleting, just deactivate
      await sql`
        UPDATE "User" SET is_active = false WHERE user_id = ${id}
      `;
      return NextResponse.json({ 
        message: 'User has sales records. Account has been deactivated instead of deleted.' 
      });
    }

    // Get employee_id before deleting user
    const userData = await sql`
      SELECT employee_id FROM "User" WHERE user_id = ${id}
    `;

    if (userData.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const employeeId = userData[0].employee_id;

    // Delete user first (due to foreign key constraints)
    await sql`
      DELETE FROM "User" WHERE user_id = ${id}
    `;

    // Delete associated employee
    await sql`
      DELETE FROM Employee WHERE employee_id = ${employeeId}
    `;

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user: ' + error.message },
      { status: 500 }
    );
  }
}