import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
  try {
    // Products by Category with coalesce for null fabrics
    const productsByCategory = await db.prepare(`
      SELECT COALESCE(fabric, 'Uncategorized') as category, COUNT(*) as count 
      FROM products 
      GROUP BY fabric
      ORDER BY count DESC
    `).all();

    // Monthly Customer Growth with fixed GROUP BY
    const customerGrowth = await db.prepare(`
      SELECT 
        month,
        COUNT(*) as new_customers
      FROM (
        SELECT date_trunc('month', createdat) as month
        FROM customers
        WHERE createdat >= date_trunc('month', CURRENT_TIMESTAMP - INTERVAL '6 months')
      ) monthly
      GROUP BY month
      ORDER BY month DESC
    `).all();

    // Company Distribution with total count
    const companyDistribution = await db.prepare(`
      SELECT 
        COALESCE(status, 'unknown') as status,
        COUNT(*) as count
      FROM representatives
      GROUP BY status
      ORDER BY count DESC
    `).all();

    // Calculate percentages in JavaScript
    const totalCompanies = companyDistribution.reduce((sum, item) => sum + item.count, 0);
    const distributionWithPercentages = companyDistribution.map(item => ({
      ...item,
      percentage: totalCompanies ? Number((item.count * 100 / totalCompanies).toFixed(1)) : 0
    }));

    // Product Creation Timeline with fixed GROUP BY
    const productTimeline = await db.prepare(`
      SELECT 
        month,
        COUNT(*) as new_products,
        SUM(COUNT(*)) OVER (ORDER BY month) as total_products
      FROM (
        SELECT date_trunc('month', createdat) as month
        FROM products
        WHERE createdat >= date_trunc('month', CURRENT_TIMESTAMP - INTERVAL '6 months')
      ) monthly
      GROUP BY month
      ORDER BY month DESC
    `).all();

    // Format dates after aggregation
    const formattedCustomerGrowth = customerGrowth.map(row => ({
      ...row,
      month: new Date(row.month).toISOString().substring(0, 7)
    }));

    const formattedProductTimeline = productTimeline.map(row => ({
      ...row,
      month: new Date(row.month).toISOString().substring(0, 7)
    }));

    return NextResponse.json({
      productsByCategory,
      customerGrowth: formattedCustomerGrowth.reverse(),
      companyDistribution: distributionWithPercentages,
      productTimeline: formattedProductTimeline.reverse()
    })
  } catch (error) {
    console.error('Failed to fetch chart data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chart data' }, 
      { status: 500 }
    )
  }
} 