import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

interface Product {
  id: number;
  podate: string;
  sizeQuantities: Record<string, number>;
  [key: string]: any;
}

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const dbUserId = userId.replace('user_', '');

    const products = await sql`
      SELECT 
        p.*,
        CAST(
          (
            SELECT COALESCE(SUM(CAST((value->>'quantity') AS INTEGER)), 0)
            FROM jsonb_array_elements(p.available_sizes) AS value
          ) AS INTEGER
        ) as total_quantity
      FROM products p
      WHERE p.created_by = ${dbUserId}
      ORDER BY p.createdat DESC
    `;

    const transformedProducts = products.map(product => ({
      ...product,
      total_quantity: parseInt(product.total_quantity) || 0,
      created_by: product.created_by.replace('user_', ''),
      sizeQuantities: product.available_sizes.reduce((acc: any, curr: any) => {
        acc[curr.size] = parseInt(curr.quantity);
        return acc;
      }, {})
    }));

    return NextResponse.json(transformedProducts);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch products', details: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, style, fabric, vendor, available_sizes = [] } = await request.json();
    
    // Remove 'user_' prefix from userId
    const dbUserId = userId.replace('user_', '');

    if (!Array.isArray(available_sizes)) {
      return NextResponse.json(
        { error: 'available_sizes must be an array' },
        { status: 400 }
      );
    }

    // Log the incoming data
    console.log('Received sizes:', available_sizes);

    const formattedSizes = available_sizes.map((size: any) => ({
      size: typeof size === 'string' ? size : size.size,
      quantity: typeof size === 'string' ? 10 : (size.quantity || 10)
    }));

    // Log the formatted sizes
    console.log('Formatted sizes:', formattedSizes);

    const [product] = await sql`
      INSERT INTO products (
        name, 
        style, 
        fabric, 
        vendor, 
        available_sizes,
        podate,
        created_by
      ) VALUES (
        ${name}, 
        ${style}, 
        ${fabric}, 
        ${vendor}, 
        ${JSON.stringify(formattedSizes)},
        CURRENT_DATE,
        ${dbUserId}
      ) 
      RETURNING *
    `;

    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to create product:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to create product', details: message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, name, style, fabric, vendor, sizeQuantities, podate } = await request.json();
    
    // Transform sizeQuantities back to available_sizes array format
    const available_sizes = Object.entries(sizeQuantities).map(([size, quantity]) => ({
      size,
      quantity: Number(quantity)
    }));

    const [updatedProduct] = await sql`
      UPDATE products 
      SET 
        name = ${name},
        style = ${style},
        fabric = ${fabric},
        vendor = ${vendor},
        available_sizes = ${JSON.stringify(available_sizes)},
        podate = ${podate}
      WHERE id = ${id} AND created_by = ${userId.replace('user_', '')}
      RETURNING *
    `;

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to update product', details: message },
      { status: 500 }
    );
  }
}