import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from '@/lib/db'
import { z } from 'zod'
import { randomUUID } from 'crypto';

const OrderSchema = z.object({
  product: z.string(),
  quantity: z.number(),
  price: z.number(),
  notes: z.string()
})

async function checkAuth() {
  const { userId } = auth();
  return userId;
}

export async function POST(req: NextRequest) {
  const userId = await checkAuth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json()
    const validatedData = OrderSchema.parse(body)
    
    const stmt = db.prepare(`
      INSERT INTO orders (id, user_id, product, quantity, status, total, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `)
    
    const result = await stmt.run(
      randomUUID(),
      userId,
      validatedData.product,
      validatedData.quantity,
      "Pending",
      validatedData.price * validatedData.quantity,
      validatedData.notes
    )
    
    return NextResponse.json({ id: result.lastInsertRowId }, { status: 201 })
  } catch (error) {
    console.error('Failed to create order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const userId = await checkAuth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const stmt = db.prepare('SELECT * FROM orders WHERE id = $1 AND user_id = $2')
      const order = await stmt.get(id, userId)

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      return NextResponse.json(order);
    } else {
      const stmt = db.prepare('SELECT * FROM orders WHERE user_id = $1 ORDER BY date DESC')
      const orders = await stmt.all(userId)
      return NextResponse.json(orders || []);
    }
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  const userId = await checkAuth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const stmt = db.prepare(`
      UPDATE orders 
      SET product = $1, quantity = $2, status = $3, total = $4
      WHERE id = $5 AND user_id = $6
      RETURNING id
    `)
    
    const result = await stmt.run(
      body.product,
      body.quantity,
      body.status,
      body.total,
      id,
      userId
    )

    if (!result.lastInsertRowId) {
      return NextResponse.json(
        { error: "Order not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Order updated successfully" });
  } catch (error) {
    console.error('Failed to update order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  const userId = await checkAuth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const stmt = db.prepare('DELETE FROM orders WHERE id = $1 AND user_id = $2 RETURNING id')
    const result = await stmt.run(id, userId)

    if (!result.lastInsertRowId) {
      return NextResponse.json(
        { error: "Order not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error('Failed to delete order:', error)
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    )
  }
}