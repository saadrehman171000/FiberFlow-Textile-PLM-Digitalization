import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();
  const dbUserId = userId?.replace('user_', '');

  try {
    const [product] = await sql`
      SELECT p.*, COALESCE(SUM(sq.quantity), 0) as total_quantity
      FROM products p
      LEFT JOIN size_quantities sq ON p.id = sq.productid
      WHERE p.id = ${params.id} AND p.created_by = ${dbUserId}
      GROUP BY p.id, p.name, p.style, p.fabric, p.vendor, p.podate, p.image, p.createdat
    `;

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const sizes = await sql`
      SELECT size, quantity 
      FROM size_quantities 
      WHERE productid = ${params.id}
    `;

    return NextResponse.json({
      ...product,
      podate: new Date(product.podate).toISOString().split('T')[0],
      sizeQuantities: sizes.reduce((acc, { size, quantity }) => ({
        ...acc,
        [size]: quantity
      }), {})
    });
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    const dbUserId = userId?.replace('user_', '');

    // First delete related size quantities
    await sql`
      DELETE FROM size_quantities 
      WHERE productid = ${params.id}
    `;

    // Then delete the product
    await sql`
      DELETE FROM products 
      WHERE id = ${params.id} 
      AND created_by = ${dbUserId}
    `;

    return Response.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return Response.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();
  const dbUserId = userId?.replace('user_', '');

  try {
    const data = await request.json();

    await sql`
      UPDATE products 
      SET name = ${data.name},
          style = ${data.style || ''},
          fabric = ${data.fabric || ''},
          vendor = ${data.vendor || ''},
          podate = ${data.poDate || new Date().toISOString().split('T')[0]},
          image = ${data.image || ''}
      WHERE id = ${params.id} AND created_by = ${dbUserId}
    `;

    // Update size quantities
    if (data.sizeQuantities) {
      // Delete existing quantities
      await sql`
        DELETE FROM size_quantities 
        WHERE productid = ${params.id}
      `;

      // Insert new quantities
      for (const [size, quantity] of Object.entries(data.sizeQuantities)) {
        const quantityNum = Number(quantity);
        if (quantityNum > 0) {
          await sql`
            INSERT INTO size_quantities (productid, size, quantity)
            VALUES (${params.id}, ${size}, ${quantityNum})
          `;
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
} 