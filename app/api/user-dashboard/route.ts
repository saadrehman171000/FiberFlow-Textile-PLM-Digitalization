import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const products = await sql`
      SELECT 
        p.id,
        p.name,
        p.style,
        p.fabric,
        p.vendor,
        p.available_sizes,
        p.image
      FROM products p
      WHERE p.available_sizes::text != '[]'
      ORDER BY p.createdat DESC
    `;

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 