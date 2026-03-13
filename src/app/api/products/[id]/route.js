import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { successResponse, errorResponse, notFoundResponse, unauthorizedResponse, forbiddenResponse } from '@/lib/api-utils';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const products = await sql`
      SELECT p.*, c.category_name, b.brand_name 
      FROM Product p
      JOIN Category c ON p.category_id = c.category_id
      JOIN Brand b ON p.brand_id = b.brand_id
      WHERE p.product_id = ${id}
    `;

    if (products.length === 0) {
      return notFoundResponse('Product');
    }

    // Get expiration dates for this product
    const expirations = await sql`
      SELECT * FROM Product_ExpirationDate 
      WHERE product_id = ${id}
      ORDER BY expirationdate ASC
    `;

    const product = products[0];
    product.expirations = expirations;

    return successResponse(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return errorResponse('Failed to fetch product');
  }
}

export async function PUT(request, { params }) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const user = verifyToken(token);

    if (!user) {
      return unauthorizedResponse();
    }

    if (user.role !== 'Admin' && user.role !== 'Manager') {
      return forbiddenResponse();
    }

    const { id } = await params;
    const body = await request.json().catch(() => null);
    
    if (!body) {
      return errorResponse('Invalid request body', 400);
    }

    const { product_name, unit, price, category_id, description, brand_id, reorder_level } = body;

    const result = await sql`
      UPDATE Product 
      SET product_name = ${product_name}, 
          unit = ${unit}, 
          price = ${price}, 
          category_id = ${category_id}, 
          description = ${description}, 
          brand_id = ${brand_id}, 
          reorder_level = ${reorder_level}
      WHERE product_id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return notFoundResponse('Product');
    }

    return successResponse(result[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    return errorResponse('Failed to update product');
  }
}

export async function DELETE(request, { params }) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const user = verifyToken(token);

    if (!user || user.role !== 'Admin') {
      return unauthorizedResponse();
    }

    const { id } = await params;

    // Check if product has sales records
    const sales = await sql`
      SELECT sales_detail_id FROM Sales_Details WHERE product_id = ${id} LIMIT 1
    `;

    if (sales.length > 0) {
      return errorResponse('Cannot delete product with existing sales records', 400);
    }

    // Delete expiration dates first
    await sql`
      DELETE FROM Product_ExpirationDate WHERE product_id = ${id}
    `;

    // Delete the product
    const result = await sql`
      DELETE FROM Product WHERE product_id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      return notFoundResponse('Product');
    }

    return successResponse({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return errorResponse('Failed to delete product');
  }
}