import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    const products = await sql`
      SELECT p.*, c.category_name, b.brand_name 
      FROM Product p
      JOIN Category c ON p.category_id = c.category_id
      JOIN Brand b ON p.brand_id = b.brand_id
      ORDER BY p.product_name
    `;
    
    return successResponse(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return errorResponse('Failed to fetch products');
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    
    if (!body) {
      return errorResponse('Invalid request body', 400);
    }

    const { product_name, unit, price, category_id, description, brand_id, reorder_level } = body;

    // Validate required fields
    if (!product_name || !unit || !price || !category_id || !brand_id) {
      return errorResponse('Missing required fields', 400);
    }

    // Check if product already exists
    const existing = await sql`
      SELECT product_id FROM Product WHERE product_name = ${product_name}
    `;

    if (existing.length > 0) {
      return errorResponse('Product already exists', 400);
    }

    const result = await sql`
      INSERT INTO Product (product_name, unit, price, category_id, description, brand_id, reorder_level)
      VALUES (${product_name}, ${unit}, ${price}, ${category_id}, ${description}, ${brand_id}, ${reorder_level})
      RETURNING *
    `;
    
    return successResponse(result[0], 201);
  } catch (error) {
    console.error('Error creating product:', error);
    return errorResponse('Failed to create product');
  }
}