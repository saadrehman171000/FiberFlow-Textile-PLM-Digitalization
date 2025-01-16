import { auth } from '@clerk/nextjs/server'
import sql from '@/lib/db'

export async function GET() {
  const { userId } = auth();
  const dbUserId = userId?.replace('user_', '');

  try {
    // Monthly registrations
    const monthlyRegistrations = await sql`
      WITH RECURSIVE dates AS (
        SELECT DATE_TRUNC('month', NOW()) as month
        UNION ALL
        SELECT month - INTERVAL '1 month'
        FROM dates
        WHERE month > NOW() - INTERVAL '12 months'
      )
      SELECT 
        dates.month,
        COUNT(ur.id) as total
      FROM dates
      LEFT JOIN user_roles ur ON 
        DATE_TRUNC('month', ur.created_at) = dates.month 
        AND ur.created_by = ${dbUserId}
      GROUP BY dates.month
      ORDER BY dates.month DESC
    `;

    // Simple product count by name instead of sizes
    const productSizes = await sql`
      SELECT 
        name as size,
        1 as total_quantity
      FROM products
      WHERE created_by = ${dbUserId}
      ORDER BY name
    `;

    // User industries
    const userIndustries = await sql`
      SELECT 
        COALESCE(industry, 'General') as industry,
        COUNT(*) as total
      FROM user_roles
      WHERE created_by = ${dbUserId}
      GROUP BY industry
      ORDER BY total DESC
    `;

    // Get stats for the cards
    const stats = await sql`
      SELECT 
        (SELECT COUNT(*) FROM products WHERE created_by = ${dbUserId}) as total_products,
        (SELECT COUNT(*) FROM user_roles WHERE created_by = ${dbUserId}) as total_users,
        (SELECT COUNT(*) FROM representatives WHERE created_by = ${dbUserId}) as total_companies
    `;

    const response = {
      stats: {
        totalProducts: Number(stats[0]?.total_products || 0),
        totalUsers: Number(stats[0]?.total_users || 0),
        totalCompanies: Number(stats[0]?.total_companies || 0),
        activeOrders: 0
      },
      monthlyRegistrations: monthlyRegistrations.map(row => ({
        month: row.month,
        total: Number(row.total || 0)
      })),
      productSizes: productSizes.map(row => ({
        size: row.size || 'Unknown',
        total_quantity: Number(row.total_quantity || 0)
      })),
      userIndustries: userIndustries.map(row => ({
        industry: row.industry || 'Unknown',
        total: Number(row.total || 0)
      }))
    };

    return Response.json(response);

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return Response.json({
      stats: {
        totalProducts: 0,
        totalUsers: 0,
        totalCompanies: 0,
        activeOrders: 0
      },
      monthlyRegistrations: [],
      productSizes: [],
      userIndustries: []
    });
  }
} 