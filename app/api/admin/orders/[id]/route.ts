import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await request.json();

    await sql`
      UPDATE orders 
      SET status = ${status}
      WHERE id = ${params.id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
} 