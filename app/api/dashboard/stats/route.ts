import { auth } from '@clerk/nextjs/server';
import sql from '@/lib/db';

export async function GET() {
  const { userId } = auth();
  const dbUserId = userId?.replace('user_', '');

  try {
    // Get total products
    const totalProducts = await sql`
      SELECT COUNT(*) as count 
      FROM products 
      WHERE created_by = ${dbUserId}
    `;

    // Get total users
    const totalUsers = await sql`
      SELECT COUNT(*) as count 
      FROM user_roles 
      WHERE created_by = ${dbUserId} 
      AND role = 'user'
    `;

    // Get total companies
    const totalCompanies = await sql`
      SELECT COUNT(*) as count 
      FROM representatives 
      WHERE created_by = ${dbUserId}
    `;

    // Log the results for debugging
    console.log('Stats Query Results:', {
      products: totalProducts[0],
      users: totalUsers[0],
      companies: totalCompanies[0]
    });

    return Response.json({
      totalProducts: totalProducts[0]?.count || 0,
      totalUsers: totalUsers[0]?.count || 0,
      totalCompanies: totalCompanies[0]?.count || 0,
      activeOrders: 0 // Implement this based on your orders table
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    return Response.json({
      totalProducts: 0,
      totalUsers: 0,
      totalCompanies: 0,
      activeOrders: 0
    });
  }
} 