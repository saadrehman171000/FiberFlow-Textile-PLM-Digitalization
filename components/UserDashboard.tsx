import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all required data in parallel
    const [
      stats,
      monthlyOrders,
      ordersByStatus,
      recentOrders
    ] = await Promise.all([
      // Basic stats
      sql`
        SELECT 
          COUNT(*) as total_orders,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
          COALESCE(SUM(total), 0) as total_value,
          0 as monthly_growth
        FROM orders 
        WHERE user_id = ${userId}
      `,

      // Monthly orders trend
      sql`
        SELECT 
          TO_CHAR(createdat, 'YYYY-MM') as month,
          COUNT(*) as orders,
          COALESCE(SUM(total), 0) as amount
        FROM orders
        WHERE 
          user_id = ${userId}
          AND createdat >= NOW() - INTERVAL '6 months'
        GROUP BY TO_CHAR(createdat, 'YYYY-MM')
        ORDER BY month
      `,

      // Orders by status
      sql`
        SELECT 
          status, 
          COUNT(*) as count
        FROM orders
        WHERE user_id = ${userId}
        GROUP BY status
      `,

      // Recent orders
      sql`
        SELECT 
          id,
          createdat as date,
          status,
          total as total_amount
        FROM orders
        WHERE user_id = ${userId}
        ORDER BY createdat DESC
        LIMIT 5
      `
    ]);

    // Format the response
    const dashboardData = {
      stats: {
        totalOrders: Number(stats[0]?.total_orders || 0),
        pendingOrders: Number(stats[0]?.pending_orders || 0),
        totalValue: Number(stats[0]?.total_value || 0),
        monthlyGrowth: Number(stats[0]?.monthly_growth || 0)
      },
      monthlyOrders: monthlyOrders.map(mo => ({
        month: mo.month,
        orders: Number(mo.orders),
        amount: Number(mo.amount)
      })),
      ordersByStatus: ordersByStatus.map(os => ({
        status: os.status,
        count: Number(os.count)
      })),
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        date: order.date,
        status: order.status,
        total_amount: Number(order.total_amount),
        total_items: 0 // You might want to add this to your orders table or calculate it
      }))
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Failed to fetch user dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' }, 
      { status: 500 }
    );
  }
} 