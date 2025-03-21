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

// Validation schema
const OrderSchema = z.object({
  product: z.string().min(1),
  quantity: z.number().positive(),
  status: z.string().min(1),
  total: z.number().positive(),
  notes: z.string().min(1)
});

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate request body
    const validatedData = OrderSchema.parse(body);

    const newOrder = await sql`
      INSERT INTO orders (
        user_id,
        product,
        quantity,
        status,
        total,
        notes,
        date
      ) VALUES (
        ${userId.replace('user_', '')},
        ${validatedData.product},
        ${validatedData.quantity},
        ${validatedData.status},
        ${validatedData.total},
        ${validatedData.notes},
        CURRENT_TIMESTAMP
      )
      RETURNING *
    `;

    return NextResponse.json(newOrder[0]);
  } catch (error) {
    console.error('Failed to create order:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
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
    const dbUserId = userId.replace('user_', '');

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');

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
      WHERE o.created_by = ${dbUserId}
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