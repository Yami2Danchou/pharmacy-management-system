import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    console.log('Fetching brands...');
    const brands = await sql`
      SELECT * FROM Brand ORDER BY brand_name
    `;
    console.log('Brands found:', brands.length);
    
    return NextResponse.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body || !body.brand_name) {
      return NextResponse.json(
        { error: 'Brand name is required' },
        { status: 400 }
      );
    }

    const { brand_name, description } = body;

    // Check if brand already exists
    const existing = await sql`
      SELECT brand_id FROM Brand WHERE brand_name = ${brand_name}
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Brand already exists' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO Brand (brand_name, description)
      VALUES (${brand_name}, ${description})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating brand:', error);
    return NextResponse.json(
      { error: 'Failed to create brand' },
      { status: 500 }
    );
  }
}