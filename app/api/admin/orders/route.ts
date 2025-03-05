import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await sql`
      SELECT 
        o.id,
        o.user_id,
        o.order_size,
        o.order_quantity,
        o.status,
        o.created_at,
        p.name as product_name
      FROM orders o
      LEFT JOIN products p ON o.product_id = p.id
      ORDER BY o.created_at DESC
    `;

    const formattedOrders = await Promise.all(orders.map(async (order) => {
      let customerName = 'Anonymous';
      try {
        if (order.user_id) {
          const clerkUserId = `user_${order.user_id}`;
          const user = await clerkClient.users.getUser(clerkUserId);
          customerName = user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}`.trim() 
            : user.emailAddresses[0]?.emailAddress || 'Anonymous';
        }
      } catch (e) {
        console.error('Error fetching user:', e);
      }

      return {
        id: order.id,
        customer: customerName,
        product: order.product_name || 'Unknown Product',
        size: order.order_size || '',
        quantity: order.order_quantity || 0,
        date: new Date(order.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }),
        status: order.status?.toLowerCase() || 'pending'
      };
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