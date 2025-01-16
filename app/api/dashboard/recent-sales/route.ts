import { NextResponse } from 'next/server'
import sql from '@/lib/db'

export async function GET() {
  try {
    const recentSales = await sql`
      SELECT 
        name,
        email,
        companyname as "companyName",
        createdat as "createdAt"
      FROM representatives
      ORDER BY createdat DESC
      LIMIT 5
    `;

    return NextResponse.json(recentSales);
  } catch (error) {
    console.error('Failed to fetch recent sales:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent sales' }, 
      { status: 500 }
    );
  }
}