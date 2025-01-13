import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (id) {
            // Fetch single product
            const product = await db.prepare(`
                SELECT 
                    p.*,
                    COALESCE(
                        jsonb_agg(
                            CASE WHEN sq.size IS NOT NULL 
                            THEN jsonb_build_object(
                                'size', sq.size,
                                'quantity', sq.quantity
                            )
                            END
                        ),
                        '[]'::jsonb
                    ) as size_quantities
                FROM products p
                LEFT JOIN size_quantities sq ON p.id = sq.productid
                WHERE p.id = $1
                GROUP BY p.id
            `).all(id);

            if (!product || product.length === 0) {
                return NextResponse.json({ error: 'Product not found' }, { status: 404 });
            }

            const transformedProduct = {
                ...product[0],
                sizeQuantities: product[0].size_quantities.reduce((acc: any, curr: any) => {
                    if (curr?.size) {
                        acc[curr.size] = curr.quantity;
                    }
                    return acc;
                }, {})
            };

            return NextResponse.json(transformedProduct);
        }

        // Fetch all products
        const products = await db.prepare(`
            SELECT 
                p.*,
                COALESCE(
                    jsonb_agg(
                        CASE WHEN sq.size IS NOT NULL 
                        THEN jsonb_build_object(
                            'size', sq.size,
                            'quantity', sq.quantity
                        )
                        END
                    ),
                    '[]'::jsonb
                ) as size_quantities
            FROM products p
            LEFT JOIN size_quantities sq ON p.id = sq.productid
            GROUP BY p.id
            ORDER BY p.id DESC
        `).all();

        const transformedProducts = products.map(product => ({
            ...product,
            sizeQuantities: product.size_quantities.reduce((acc: any, curr: any) => {
                if (curr?.size) {
                    acc[curr.size] = curr.quantity;
                }
                return acc;
            }, {})
        }));

        return NextResponse.json(transformedProducts);
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, style, fabric, vendor, poDate, image, sizeQuantities } = body;

        await db.prepare('BEGIN').run();

        const result = await db.prepare(`
            INSERT INTO products (name, style, fabric, vendor, podate, image)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `).run(name, style, fabric, vendor, poDate || new Date().toISOString().split('T')[0], image);

        const productId = result.lastInsertRowId;

        if (sizeQuantities && Object.keys(sizeQuantities).length > 0) {
            for (const [size, quantity] of Object.entries(sizeQuantities)) {
                if ((quantity as number) > 0) {
                    await db.prepare(`
                        INSERT INTO size_quantities (productid, size, quantity)
                        VALUES ($1, $2, $3)
                    `).run(productId, size, quantity);
                }
            }
        }

        await db.prepare('COMMIT').run();
        return NextResponse.json({ id: productId });
    } catch (error) {
        await db.prepare('ROLLBACK').run();
        console.error('Failed to create product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}