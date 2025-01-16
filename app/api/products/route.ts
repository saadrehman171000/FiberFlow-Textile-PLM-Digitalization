import { NextResponse } from 'next/server';
import sql from '@/lib/db';

interface Product {
  id: number;
  podate: string;
  sizeQuantities: Record<string, number>;
  [key: string]: any;
}

export async function GET() {
  try {
    const products = await sql`
      SELECT 
        p.*,
        to_char(p.podate, 'YYYY-MM-DD') as podate,
        COALESCE(SUM(sq.quantity), 0) as total_quantity
      FROM products p
      LEFT JOIN size_quantities sq ON p.id = sq.productid
      GROUP BY p.id, p.name, p.style, p.fabric, p.vendor, p.podate, p.image, p.createdat
      ORDER BY p.createdat DESC
    `;

    const formattedProducts = await Promise.all(
      products.map(async (product) => {
        const sizes = await sql`
          SELECT size, quantity 
          FROM size_quantities 
          WHERE productid = ${product.id}
        `;

        return {
          ...product,
          podate: new Date(product.podate).toISOString().split('T')[0],
          sizeQuantities: sizes.reduce((acc, { size, quantity }) => ({
            ...acc,
            [size]: quantity
          }), {})
        };
      })
    );

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const [product] = await sql`
      INSERT INTO products (name, style, fabric, vendor, podate, image)
      VALUES (
        ${data.name}, 
        ${data.style || ''}, 
        ${data.fabric || ''}, 
        ${data.vendor || ''}, 
        ${data.poDate}::date, 
        ${data.image || ''}
      )
      RETURNING *, to_char(podate, 'YYYY-MM-DD') as podate
    `;

    if (data.sizeQuantities) {
      for (const [size, quantity] of Object.entries(data.sizeQuantities)) {
        const quantityNum = Number(quantity);
        if (quantityNum > 0) {
          await sql`
            INSERT INTO size_quantities (productid, size, quantity)
            VALUES (${product.id}, ${size}, ${quantityNum})
          `;
        }
      }
    }

    return NextResponse.json({ success: true, id: product.id });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json(
      { error: 'Failed to create product', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}