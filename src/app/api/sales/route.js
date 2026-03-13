import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-utils';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    
    const sales = await sql`
      SELECT s.*, c.customer_name, u.username, e.employee_name
      FROM Sale s
      LEFT JOIN customer c ON s.customer_id = c.customer_id
      JOIN "User" u ON s.user_id = u.user_id
      JOIN Employee e ON u.employee_id = e.employee_id
      WHERE s.sale_date = ${date}::date
      ORDER BY s.sale_id DESC
    `;
    
    return successResponse(sales);
  } catch (error) {
    console.error('Error fetching sales:', error);
    return errorResponse('Failed to fetch sales');
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    
    if (!body || !body.items || !body.items.length) {
      return errorResponse('Invalid sale data', 400);
    }

    const { customer_id, items, total_amount, sale_description } = body;
    
    // Get user from token
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const user = verifyToken(token);
    
    if (!user) {
      return unauthorizedResponse();
    }
    
    // Start transaction - insert sale
    const sale = await sql`
      INSERT INTO Sale (sale_date, customer_id, sale_description, total_amount, user_id)
      VALUES (CURRENT_DATE, ${customer_id || null}, ${sale_description}, ${total_amount}, ${user.userId})
      RETURNING sale_id
    `;
    
    const saleId = sale[0].sale_id;
    
    // Insert sale details
    for (const item of items) {
      await sql`
        INSERT INTO Sales_Details (sale_id, product_id, quantity, unit_price, subtotal)
        VALUES (${saleId}, ${item.product_id}, ${item.quantity}, ${item.price}, ${item.subtotal})
      `;
      
      // Update inventory (simplified)
      await sql`
        UPDATE Product_ExpirationDate 
        SET quantity = quantity - ${item.quantity}
        WHERE product_id = ${item.product_id} 
          AND quantity >= ${item.quantity}
        ORDER BY expirationdate ASC
        LIMIT 1
      `;
    }
    
    return successResponse({ sale_id: saleId, success: true }, 201);
  } catch (error) {
    console.error('Error creating sale:', error);
    return errorResponse('Failed to create sale');
  }
}