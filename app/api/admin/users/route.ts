import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import sql from '@/lib/db';

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });
  
  const dbUserId = userId.replace('user_', '');
  
  // Check if current user is admin
  const adminCheck = await sql`
    SELECT role FROM user_roles 
    WHERE user_id = ${dbUserId} AND role = 'admin'
  `;
  
  if (!adminCheck.length) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { email, name, industry } = await request.json();

  // Add new user with industry
  await sql`
    INSERT INTO user_roles (user_id, email, name, role, industry, created_by)
    VALUES (${email}, ${email}, ${name}, 'user', ${industry}, ${dbUserId})
  `;

  return Response.json({ success: true });
}

export async function GET() {
  const { userId } = auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });
  
  const dbUserId = userId.replace('user_', '');
  
  const adminCheck = await sql`
    SELECT role FROM user_roles 
    WHERE user_id = ${dbUserId} AND role = 'admin'
  `;
  
  if (!adminCheck.length) {
    return new Response('Unauthorized', { status: 401 });
  }

  const users = await sql`
    SELECT * FROM user_roles 
    WHERE role = 'user' 
    ORDER BY created_at DESC
  `;
  
  return Response.json(users);
} 