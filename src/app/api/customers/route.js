import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    const customers = await sql`
      SELECT * FROM customer ORDER BY customer_name
    `;
    return successResponse(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return errorResponse('Failed to fetch customers');
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    
    if (!body || !body.customer_name || !body.contacts) {
      return errorResponse('Customer name and contacts are required', 400);
    }

    const { customer_name, gender, contacts, address, birth_date } = body;

    const result = await sql`
      INSERT INTO customer (customer_name, gender, contacts, address, birth_date)
      VALUES (${customer_name}, ${gender}, ${contacts}, ${address}, ${birth_date}::date)
      RETURNING *
    `;

    return successResponse(result[0], 201);
  } catch (error) {
    console.error('Error creating customer:', error);
    return errorResponse('Failed to create customer');
  }
}