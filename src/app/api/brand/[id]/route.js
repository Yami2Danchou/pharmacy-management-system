import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const brands = await sql`
      SELECT * FROM Brand WHERE brand_id = ${id}
    `;

    if (brands.length === 0) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    // Get products from this brand
    const products = await sql`
      SELECT product_id, product_name, price 
      FROM Product 
      WHERE brand_id = ${id}
    `;

    const brand = brands[0];
    brand.products = products;

    return NextResponse.json(brand);
  } catch (error) {
    console.error('Error fetching brand:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brand' },
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

    if (!user || (user.role !== 'Admin' && user.role !== 'Manager')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { brand_name, description } = await request.json();

    const result = await sql`
      UPDATE Brand 
      SET brand_name = ${brand_name}, description = ${description}
      WHERE brand_id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating brand:', error);
    return NextResponse.json(
      { error: 'Failed to update brand' },
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

    // Check if brand has products
    const products = await sql`
      SELECT product_id FROM Product WHERE brand_id = ${id} LIMIT 1
    `;

    if (products.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete brand with existing products' },
        { status: 400 }
      );
    }

    const result = await sql`
      DELETE FROM Brand WHERE brand_id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    console.error('Error deleting brand:', error);
    return NextResponse.json(
      { error: 'Failed to delete brand' },
      { status: 500 }
    );
  }
}