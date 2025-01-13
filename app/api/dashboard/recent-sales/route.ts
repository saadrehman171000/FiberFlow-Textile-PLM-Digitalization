import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
  try {
    const recentSales = await db.prepare(`
      WITH recent_orders AS (
        SELECT 
          o.id,
          o.total,
          o.date,
          r.name,
          r.email,
          r.companyname,
          ROW_NUMBER() OVER (PARTITION BY r.id ORDER BY o.date DESC) as rn
        FROM orders o
        JOIN representatives r ON o.user_id = r.id::text
        WHERE o.date >= CURRENT_TIMESTAMP - INTERVAL '30 days'
        ORDER BY o.date DESC
      )
      SELECT *
      FROM recent_orders
      WHERE rn <= 3
    `).all();

    const salesStats = await db.prepare(`
      SELECT 
        COUNT(*)::int as sale_count,
        COALESCE(SUM(total), 0) as total_amount,
        ROUND(AVG(total)::numeric, 2) as average_amount
      FROM orders
      WHERE date >= date_trunc('month', CURRENT_TIMESTAMP)
    `).get();

    return NextResponse.json({
      recentSales,
      monthlyStats: {
        count: salesStats.sale_count,
        total: salesStats.total_amount,
        average: salesStats.average_amount
      }
    })
  } catch (error) {
    console.error('Failed to fetch recent sales:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent sales data' }, 
      { status: 500 }
    )
  }
}