import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const sales = await sql`
      SELECT s.*, c.customer_name, u.username, e.employee_name
      FROM Sale s
      LEFT JOIN customer c ON s.customer_id = c.customer_id
      JOIN "User" u ON s.user_id = u.user_id
      JOIN Employee e ON u.employee_id = e.employee_id
      WHERE s.sale_id = ${id}
    `;

    if (sales.length === 0) {
      return NextResponse.json(
        { error: 'Sale not found' },
        { status: 404 }
      );
    }

    // Get sale details
    const details = await sql`
      SELECT sd.*, p.product_name
      FROM Sales_Details sd
      JOIN Product p ON sd.product_id = p.product_id
      WHERE sd.sale_id = ${id}
    `;

    const sale = sales[0];
    sale.items = details;

    return NextResponse.json(sale);
  } catch (error) {
    console.error('Error fetching sale:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sale' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
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

    const { id } = await params;

    // Check if sale exists
    const sale = await sql`
      SELECT sale_id FROM Sale WHERE sale_id = ${id}
    `;

    if (sale.length === 0) {
      return NextResponse.json(
        { error: 'Sale not found' },
        { status: 404 }
      );
    }

    // Delete sale details first (due to foreign key constraints)
    await sql`
      DELETE FROM Sales_Details WHERE sale_id = ${id}
    `;

    // Delete the sale
    await sql`
      DELETE FROM Sale WHERE sale_id = ${id}
    `;

    return NextResponse.json({ message: 'Sale deleted successfully' });
  } catch (error) {
    console.error('Error deleting sale:', error);
    return NextResponse.json(
      { error: 'Failed to delete sale' },
      { status: 500 }
    );
  }
}