import { auth } from '@clerk/nextjs/server';
import sql from '@/lib/db';

export async function GET() {
  const { userId } = auth();
  
  // Remove 'user_' prefix for database comparison
  const dbUserId = userId?.replace('user_', '');
  
  // Verify admin
  const adminCheck = await sql`
    SELECT role FROM user_roles 
    WHERE user_id = ${dbUserId} AND role = 'admin'
  `;
  
  if (!adminCheck.length) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Get all users
  const users = await sql`
    SELECT user_id, email, name, role, created_at 
    FROM user_roles 
    WHERE role = 'user'
  `;
  
  return Response.json(users);
}

export async function POST(request: Request) {
  const { userId } = auth();
  
  // Remove 'user_' prefix for database comparison
  const dbUserId = userId?.replace('user_', '');
  
  // Verify admin
  const adminCheck = await sql`
    SELECT role FROM user_roles 
    WHERE user_id = ${dbUserId} AND role = 'admin'
  `;
  
  if (!adminCheck.length) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { email, name } = await request.json();

  try {
    // Create new user
    await sql`
      INSERT INTO user_roles (user_id, email, name, role, created_by)
      VALUES (${email}, ${email}, ${name}, 'user', ${dbUserId})
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error creating user:', error);
    return new Response('Error creating user', { status: 500 });
  }
} 