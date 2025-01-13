import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
  try {
    const stats = await db.prepare(`
      WITH monthly_stats AS (
        SELECT 
          COUNT(*) as monthly_orders,
          COALESCE(SUM(total), 0) as monthly_revenue
        FROM orders 
        WHERE date >= date_trunc('month', CURRENT_TIMESTAMP)
      ),
      status_distribution AS (
        SELECT 
          status,
          COUNT(*) as count,
          CAST((COUNT(*)::float * 100 / NULLIF((SELECT COUNT(*) FROM representatives), 0)) AS DECIMAL(10,1)) as percentage
        FROM representatives
        GROUP BY status
      )
      SELECT 
        (SELECT COUNT(*) FROM products) as total_products,
        (SELECT COUNT(*) FROM customers) as total_customers,
        (SELECT COUNT(*) FROM representatives) as total_companies,
        monthly_orders,
        monthly_revenue,
        (SELECT json_agg(row_to_json(sd)) FROM status_distribution sd) as company_status_distribution,
        (
          SELECT COUNT(*) 
          FROM products 
          WHERE createdat >= CURRENT_TIMESTAMP - INTERVAL '7 days'
        ) as new_products_this_week
      FROM monthly_stats
    `).get();

    return NextResponse.json({
      totalProducts: Number(stats.total_products),
      totalCustomers: Number(stats.total_customers),
      totalCompanies: Number(stats.total_companies),
      monthlyOrders: Number(stats.monthly_orders),
      monthlyRevenue: Number(stats.monthly_revenue),
      newProductsThisWeek: Number(stats.new_products_this_week),
      companyStatusDistribution: stats.company_status_distribution || []
    })
  } catch (error) {
    console.error('Failed to fetch dashboard statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' }, 
      { status: 500 }
    )
  }
} 