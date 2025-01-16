import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import sql from '@/lib/db'
import { z } from 'zod'

// Validation schemas
const OrderItemSchema = z.object({
  product_id: z.string().uuid(),
  size: z.string(),
  quantity: z.number().positive(),
  price: z.number().positive()
});

const CreateOrderSchema = z.object({
  items: z.array(OrderItemSchema)
});

const UpdateOrderSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  total_items: z.number().optional(),
  total_amount: z.number().optional()
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    
    const [order] = await sql`
      INSERT INTO orders (
        user_id,
        total,
        status,
        createdat
      ) VALUES (
        ${userId},
        ${data.total},
        ${data.status},
        NOW()
      )
      RETURNING *
    `;

    return NextResponse.json(order);
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');

    // Build the query
    const orders = await sql`
      SELECT 
        o.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'product_id', oi.product_id,
              'size', oi.size,
              'quantity', oi.quantity,
              'price', oi.price
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ${userId}
      ${status ? sql`AND o.status = ${status}` : sql``}
      GROUP BY o.id
      ORDER BY o.createdat DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validatedData = UpdateOrderSchema.parse(body);

    const [updatedOrder] = await sql`
      UPDATE orders 
      SET 
        status = ${validatedData.status},
        total_items = COALESCE(${validatedData.total_items}, total_items),
        total_amount = COALESCE(${validatedData.total_amount}, total_amount),
        updatedat = CURRENT_TIMESTAMP
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING *
    `;

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Order not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Failed to update order:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid update data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const [deletedOrder] = await sql`
      DELETE FROM orders 
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING id
    `;

    if (!deletedOrder) {
      return NextResponse.json(
        { error: "Order not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error('Failed to delete order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}