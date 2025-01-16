import { NextResponse } from 'next/server'
import sql from '@/lib/db'

export async function GET() {
  try {
    console.log('Fetching dashboard stats...');
    
    const [stats] = await sql`
      SELECT 
        (SELECT COUNT(*) FROM products) as total_products,
        (SELECT COUNT(*) FROM customers) as total_customers,
        (SELECT COUNT(*) FROM representatives) as total_companies,
        (SELECT COALESCE(SUM(quantity), 0) FROM size_quantities) as total_quantities
    `;

    console.log('Returning stats:', stats);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' }, 
      { status: 500 }
    );
  }
} 