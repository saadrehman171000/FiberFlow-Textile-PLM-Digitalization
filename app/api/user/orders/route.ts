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

    // Get user info from Clerk first
    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    // Get user's database ID using email
    const user = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const dbUserId = user[0].id;
    
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

    // Format the response to match the frontend table structure
    const formattedOrders = orders.map(order => ({
      id: order.id,
      customer: clerkUser.firstName && clerkUser.lastName 
        ? `${clerkUser.firstName} ${clerkUser.lastName}`.trim()
        : 'Anonymous',
      product: order.product || 'Unknown Product',
      size: order.size,
      quantity: order.quantity,
      date: order.date,
      status: order.status
    }));

    console.log('Formatted orders:', formattedOrders);
    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('Error in user orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { productId, size, quantity } = data;
    
    // First check if product has enough quantity
    const [product] = await sql`
      SELECT available_sizes FROM products WHERE id = ${productId}
    `;

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Find the size and check quantity
    const sizeInfo = product.available_sizes.find((s: any) => s.size === size);
    if (!sizeInfo) {
      return NextResponse.json({ error: 'Size not available' }, { status: 400 });
    }

    const availableQuantity = parseInt(sizeInfo.quantity);
    if (availableQuantity < quantity) {
      return NextResponse.json({ 
        error: 'Not enough quantity available' 
      }, { status: 400 });
    }

    // Get or create user
    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    let dbUserId;
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser.length === 0) {
      const name = clerkUser.firstName && clerkUser.lastName 
        ? `${clerkUser.firstName} ${clerkUser.lastName}`.trim()
        : email.split('@')[0];
      
      const newUser = await sql`
        INSERT INTO users (user_id, email, name, role)
        VALUES (${userId}, ${email}, ${name}, 'user')
        RETURNING id
      `;
      dbUserId = newUser[0].id;
    } else {
      dbUserId = existingUser[0].id;
    }

    // Update product quantity
    const updatedSizes = product.available_sizes.map((s: any) => ({
      size: s.size,
      quantity: s.size === size ? (parseInt(s.quantity) - quantity) : parseInt(s.quantity)
    }));

    await sql`
      UPDATE products 
      SET available_sizes = ${JSON.stringify(updatedSizes)}
      WHERE id = ${productId}
    `;

    // Create the order
    const [order] = await sql`
      INSERT INTO orders (user_id, product_id, order_size, order_quantity, status)
      VALUES (${dbUserId}, ${productId}, ${size}, ${quantity}, 'pending')
      RETURNING *
    `;

    return NextResponse.json(order);
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json(
      { error: 'Failed to create order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}