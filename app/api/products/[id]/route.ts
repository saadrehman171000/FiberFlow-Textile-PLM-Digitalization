import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { name, style, fabric, vendor, poDate, image, sizeQuantities } = body;

        await db.prepare('BEGIN').run();

        // Update the product
        await db.prepare(`
            UPDATE products
            SET name = $1, style = $2, fabric = $3, vendor = $4, podate = $5, image = $6
            WHERE id = $7
        `).run(
            name, 
            style, 
            fabric, 
            vendor, 
            poDate || new Date().toISOString().split('T')[0], 
            image, 
            params.id
        );

        // Delete existing size quantities
        await db.prepare(`
            DELETE FROM size_quantities 
            WHERE productid = $1
        `).run(params.id);

        // Insert new size quantities
        if (sizeQuantities && Object.keys(sizeQuantities).length > 0) {
            for (const [size, quantity] of Object.entries(sizeQuantities)) {
                if ((quantity as number) > 0) {
                    await db.prepare(`
                        INSERT INTO size_quantities (productid, size, quantity)
                        VALUES ($1, $2, $3)
                    `).run(params.id, size, quantity);
                }
            }
        }

        await db.prepare('COMMIT').run();
        return NextResponse.json({ message: 'Product updated successfully' });
    } catch (error) {
        await db.prepare('ROLLBACK').run();
        console.error('Failed to update product:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await db.prepare('BEGIN').run();

        // Delete size quantities first (foreign key constraint)
        await db.prepare(`
            DELETE FROM size_quantities 
            WHERE productid = $1
        `).run(params.id);

        // Delete the product
        await db.prepare(`
            DELETE FROM products 
            WHERE id = $1
        `).run(params.id);

        await db.prepare('COMMIT').run();
        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        await db.prepare('ROLLBACK').run();
        console.error('Failed to delete product:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
} 