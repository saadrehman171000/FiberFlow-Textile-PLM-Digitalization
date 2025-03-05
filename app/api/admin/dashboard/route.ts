import { auth } from '@clerk/nextjs/server'
import sql from '@/lib/db'

export async function GET() {
  const { userId } = auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })

  // First check if this admin inherits from someone
  const adminInfo = await sql`
    SELECT 
      ur.*,
      parent.user_id as parent_id,
      parent.name as inherits_from_name
    FROM user_roles ur
    LEFT JOIN user_roles parent ON ur.inherit_from = parent.user_id
    WHERE ur.user_id = ${userId.replace('user_', '')}
  `

  // If this admin inherits from another admin, use the parent's ID for dashboard data
  const dashboardUserId = adminInfo[0]?.inherit_from || userId.replace('user_', '')

  // Query all relevant tables with their correct columns
  const stats = await sql`
    SELECT 
      (SELECT COUNT(*) FROM products) as total_products,
      (SELECT COUNT(*) FROM users) as total_users,
      (SELECT COUNT(*) FROM representatives WHERE status = 'active') as total_companies,
      (SELECT COUNT(*) FROM orders WHERE status = 'active') as active_orders
  `

  return Response.json({ 
    adminInfo: adminInfo[0], 
    stats: {
      total_products: Number(stats[0].total_products),
      total_users: Number(stats[0].total_users),
      total_companies: Number(stats[0].total_companies),
      active_orders: Number(stats[0].active_orders)
    }
  })
} 