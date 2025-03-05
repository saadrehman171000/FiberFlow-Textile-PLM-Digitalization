import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get products with available quantities
    const products = await sql`
      SELECT 
        p.*,
        COALESCE(SUM(sq.quantity), 0) as total_quantity,
        json_agg(
          json_build_object(
            'size', sq.size,
            'quantity', sq.quantity
          )
        ) FILTER (WHERE sq.quantity > 0) as available_sizes
      FROM products p
      LEFT JOIN size_quantities sq ON p.id = sq.productid
      WHERE sq.quantity > 0
      GROUP BY p.id, p.name, p.style, p.fabric, p.vendor, p.podate, p.createdat
      HAVING COALESCE(SUM(sq.quantity), 0) > 0
      ORDER BY p.createdat DESC
    `;

    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to fetch available products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available products' },
      { status: 500 }
    );
  }
} 