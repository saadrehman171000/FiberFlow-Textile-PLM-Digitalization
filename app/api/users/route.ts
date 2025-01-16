import { auth } from '@clerk/nextjs/server';
import sql from '@/lib/db';

export async function POST(request: Request) {
  const { userId } = auth();
  
  // Check if current user is admin
  const adminCheck = await sql`
    SELECT role FROM users WHERE id = ${userId} AND role = 'admin'
  `;
  
  if (!adminCheck.length) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { email, role } = await request.json();

  // Add new user
  await sql`
    INSERT INTO users (id, email, role, created_by)
    VALUES (${userId}, ${email}, ${role}, ${userId})
  `;

  return Response.json({ success: true });
}

// GET endpoint to fetch users (admin only)
export async function GET() {
  const { userId } = auth();
  
  const adminCheck = await sql`
    SELECT role FROM users WHERE id = ${userId} AND role = 'admin'
  `;
  
  if (!adminCheck.length) {
    return new Response('Unauthorized', { status: 401 });
  }

  const users = await sql`SELECT * FROM users WHERE role = 'user'`;
  return Response.json(users);
} 