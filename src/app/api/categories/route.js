import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    console.log('Fetching categories...');
    const categories = await sql`
      SELECT * FROM Category ORDER BY category_name
    `;
    console.log('Categories found:', categories.length);
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body || !body.category_name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const { category_name, description } = body;

    // Check if category already exists
    const existing = await sql`
      SELECT category_id FROM Category WHERE category_name = ${category_name}
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Category already exists' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO Category (category_name, description)
      VALUES (${category_name}, ${description})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}