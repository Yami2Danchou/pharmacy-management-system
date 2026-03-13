import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const customers = await sql`
      SELECT * FROM customer WHERE customer_id = ${id}
    `;

    if (customers.length === 0) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Get customer's purchase history
    const purchases = await sql`
      SELECT s.*, 
             COUNT(sd.sales_detail_id) as item_count,
             SUM(sd.quantity) as total_items
      FROM Sale s
      LEFT JOIN Sales_Details sd ON s.sale_id = sd.sale_id
      WHERE s.customer_id = ${id}
      GROUP BY s.sale_id
      ORDER BY s.sale_date DESC
    `;

    const customer = customers[0];
    customer.purchases = purchases;

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { customer_name, gender, contacts, address, birth_date } = await request.json();

    const result = await sql`
      UPDATE customer 
      SET customer_name = ${customer_name}, 
          gender = ${gender}, 
          contacts = ${contacts}, 
          address = ${address}, 
          birth_date = ${birth_date}::date
      WHERE customer_id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Failed to update customer' },
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

    // Check if customer has sales records
    const sales = await sql`
      SELECT sale_id FROM Sale WHERE customer_id = ${id} LIMIT 1
    `;

    if (sales.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete customer with existing sales records' },
        { status: 400 }
      );
    }

    const result = await sql`
      DELETE FROM customer WHERE customer_id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}