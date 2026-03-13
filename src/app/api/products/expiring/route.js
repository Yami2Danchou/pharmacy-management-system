import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const dateStr = thirtyDaysFromNow.toISOString().split('T')[0];
    
    const expiringProducts = await sql`
      SELECT pe.*, p.product_name, p.price
      FROM Product_ExpirationDate pe
      JOIN Product p ON pe.product_id = p.product_id
      WHERE pe.expirationdate <= ${dateStr}::date
        AND pe.expirationdate >= CURRENT_DATE
        AND pe.quantity > 0
      ORDER BY pe.expirationdate ASC
    `;
    
    return successResponse(expiringProducts);
  } catch (error) {
    console.error('Error fetching expiring products:', error);
    return errorResponse('Failed to fetch expiring products');
  }
}