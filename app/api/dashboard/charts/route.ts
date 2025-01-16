import { NextResponse } from 'next/server'
import sql from '@/lib/db'

export async function GET() {
  try {
    // Monthly registrations (Companies and Customers)
    const monthlyRegistrations = await sql`
      SELECT 
        TO_CHAR(createdat, 'YYYY-MM') as month,
        COUNT(*) as companies,
        COUNT(DISTINCT email) as customers
      FROM representatives
      WHERE createdat >= NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR(createdat, 'YYYY-MM')
      ORDER BY month ASC
    `;

    // Company Status distribution
    const companyStatus = await sql`
      WITH all_statuses AS (
        SELECT unnest(ARRAY['active', 'inactive', 'none']) as status
      )
      SELECT 
        a.status,
        COALESCE(COUNT(r.id), 0) as count
      FROM all_statuses a
      LEFT JOIN representatives r ON r.status = a.status
      GROUP BY a.status
      ORDER BY a.status
    `;

    // Product sizes with default values if empty
    const productSizes = await sql`
      SELECT 
        sq.size,
        COALESCE(SUM(sq.quantity), 0) as total_quantity
      FROM (
        SELECT DISTINCT size FROM size_quantities
        UNION
        SELECT unnest(ARRAY['S', 'M', 'L', 'XL', 'XXL'])
      ) sizes(size)
      LEFT JOIN size_quantities sq USING (size)
      GROUP BY sq.size
      ORDER BY sq.size
    `;

    // Customer industries with default value if empty
    const customerIndustries = await sql`
      SELECT 
        COALESCE(industry, 'Not Specified') as industry,
        COUNT(*) as count
      FROM customers
      GROUP BY industry
      ORDER BY count DESC
      LIMIT 5
    `;

    // Log the data for debugging
    console.log('API Response:', {
      monthlyRegistrations,
      companyStatus,
      productSizes,
      customerIndustries
    });

    return NextResponse.json({
      monthlyRegistrations,
      companyStatus,
      productSizes,
      customerIndustries
    });
  } catch (error) {
    console.error('Failed to fetch chart data:', error);
    return NextResponse.json({
      monthlyRegistrations: [],
      companyStatus: [],
      productSizes: [],
      customerIndustries: []
    });
  }
} 