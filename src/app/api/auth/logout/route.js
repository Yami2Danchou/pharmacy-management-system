import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { successResponse } from '@/lib/api-utils';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('token');
    return successResponse({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ success: true }); // Always return success even on error
  }
}