import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    // Test database connection
    const result = await sql`SELECT 1 as connection_test`;
    
    // Try to get categories
    const categories = await sql`SELECT COUNT(*) as count FROM Category`;
    
    // Try to get brands
    const brands = await sql`SELECT COUNT(*) as count FROM Brand`;
    
    // Try to get products
    const products = await sql`SELECT COUNT(*) as count FROM Product`;
    
    return NextResponse.json({
      status: 'success',
      database: 'connected',
      tables: {
        categories: categories[0]?.count || 0,
        brands: brands[0]?.count || 0,
        products: products[0]?.count || 0
      },
      message: 'Database is working properly'
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({
      status: 'error',
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}