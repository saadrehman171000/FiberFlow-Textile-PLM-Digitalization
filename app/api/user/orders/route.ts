import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUserId = userId.replace('user_', '');
    
    const orders = await sql`
      SELECT 
        o.id,
        p.name as product,
        o.order_size as size,
        o.order_quantity as quantity,
        o.status,
        TO_CHAR(o.created_at AT TIME ZONE 'UTC', 'MM/DD/YYYY') as date
      FROM orders o
      LEFT JOIN products p ON o.product_id = p.id
      WHERE o.user_id = ${dbUserId}
      ORDER BY o.created_at DESC
    `;

    // Format the response to match exactly what the frontend expects
    const formattedOrders = orders.map(order => ({
      Product: order.product || 'Unknown Product',
      Size: order.size,
      Quantity: order.quantity,
      Status: order.status,
      "Order Date": order.date
    }));

    console.log('Formatted orders:', formattedOrders);
    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('Error in user orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, size, quantity } = await request.json();
    const dbUserId = userId.replace('user_', '');

    // Get user data from Clerk
    const user = await clerkClient.users.getUser(userId);
    
    // Ensure user exists in our database
    await sql`
      INSERT INTO users (id, name, email)
      VALUES (
        ${dbUserId}, 
        ${user.firstName + ' ' + user.lastName}, 
        ${user.emailAddresses[0].emailAddress}
      )
      ON CONFLICT (id) DO UPDATE 
      SET name = EXCLUDED.name, 
          email = EXCLUDED.email
    `;

    // Check available quantity
    const [product] = await sql`
      SELECT available_sizes
      FROM products
      WHERE id = ${productId}
    `;

    const sizeInfo = product.available_sizes.find((s: any) => s.size === size);
    if (!sizeInfo || sizeInfo.quantity < quantity) {
      return NextResponse.json(
        { error: 'Insufficient quantity available' },
        { status: 400 }
      );
    }

    await sql`BEGIN`;
    try {
      // Update product quantity
      await sql`
        UPDATE products
        SET available_sizes = (
          SELECT jsonb_agg(
            CASE
              WHEN elem->>'size' = ${size}
              THEN jsonb_build_object(
                'size', elem->>'size',
                'quantity', CAST((elem->>'quantity')::int - ${quantity} AS text)
              )
              ELSE elem
            END
          )
          FROM jsonb_array_elements(available_sizes) elem
        )
        WHERE id = ${productId}
      `;

      // Create order with current timestamp
      const [newOrder] = await sql`
        INSERT INTO orders (
          user_id,
          product_id,
          order_size,
          order_quantity,
          status,
          created_at
        )
        VALUES (
          ${dbUserId},
          ${productId},
          ${size},
          ${quantity},
          'pending',
          CURRENT_TIMESTAMP
        )
        RETURNING *
      `;

      await sql`COMMIT`;
      return NextResponse.json(newOrder);
    } catch (error) {
      await sql`ROLLBACK`;
      throw error;
    }
  } catch (error) {
    console.error('Failed to create order:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to create order', details: message },
      { status: 500 }
    );
  }
}