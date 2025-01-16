import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import sql from '@/lib/db';
import { OrderStatus } from '@/types/orders';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const dbUserId = userId.replace('user_', '');

    const data = await request.json();
    const { status } = data as { status: OrderStatus };

    const [order] = await sql`
      UPDATE orders 
      SET 
        status = ${status},
        updatedat = CURRENT_TIMESTAMP
      WHERE id = ${params.id} AND created_by = ${dbUserId}
      RETURNING *
    `;

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
} 