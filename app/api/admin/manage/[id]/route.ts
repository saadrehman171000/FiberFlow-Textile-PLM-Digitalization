import { auth } from '@clerk/nextjs/server';
import sql from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    console.log('Current userId:', userId);
    console.log('Target adminId:', params.id);
    
    if (!userId) return new Response('Unauthorized', { status: 401 });

    // Check if current user is admin
    const adminCheck = await sql`
      SELECT role FROM user_roles 
      WHERE (user_id = ${userId.replace('user_', '')} OR user_id = ${userId}) 
      AND role = 'admin'
    `;
    console.log('Admin check result:', adminCheck);

    if (!adminCheck.length) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { fullAccess } = await request.json();
    console.log('Updating to fullAccess:', fullAccess);

    // Update user's role
    const result = await sql`
      UPDATE user_roles 
      SET role = ${fullAccess ? 'admin' : 'user'}
      WHERE id = ${params.id}
      RETURNING *
    `;
    console.log('Update result:', result);

    return Response.json({ success: true, updated: result[0] });
  } catch (error) {
    console.error('Error in PATCH:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 