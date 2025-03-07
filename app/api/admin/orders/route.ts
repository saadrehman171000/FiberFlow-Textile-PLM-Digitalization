import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { auth, clerkClient } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await sql`
      SELECT 
        o.id,
        u.name as customer,
        p.name as product,
        o.order_size as size,
        o.order_quantity as quantity,
        o.status,
        TO_CHAR(o.created_at AT TIME ZONE 'UTC', 'MM/DD/YYYY') as date
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN products p ON o.product_id = p.id
      ORDER BY o.created_at DESC
    `;

    const formattedOrders = orders.map(order => ({
      id: order.id,
      customer: order.customer || 'Anonymous',
      product: order.product || 'Unknown Product',
      size: order.size,
      quantity: order.quantity,
      date: order.date,
      status: order.status
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('Error in admin orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
} 