import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import sql from '@/lib/db'

export async function GET() {
  const { userId } = auth();
  const dbUserId = userId?.replace('user_', '');

  try {
    const recentSales = await sql`
      SELECT 
        name,
        email,
        companyname as "companyName",
        createdat as "createdAt"
      FROM representatives
      WHERE created_by = ${dbUserId}
      ORDER BY createdat DESC
      LIMIT 5
    `;

    return NextResponse.json(recentSales.length ? recentSales : []);
  } catch (error) {
    console.error('Failed to fetch recent sales:', error);
    return NextResponse.json([]);
  }
}