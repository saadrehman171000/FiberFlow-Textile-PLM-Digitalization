import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import sql from '@/lib/db';

export async function GET() {
  const { userId } = auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });
  
  const adminCheck = await sql`
    SELECT role FROM user_roles 
    WHERE (user_id = ${userId.replace('user_', '')} OR user_id = ${userId}) 
    AND role = 'admin'
  `;
  
  if (!adminCheck.length) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Fetch only admins created by the current admin
  const admins = await sql`
    SELECT * FROM user_roles 
    WHERE role = 'admin' 
    AND created_by = ${userId.replace('user_', '')}
    ORDER BY created_at DESC
  `;
  
  return Response.json(admins);
}

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });
  
  try {
    const { email, name } = await request.json();

    // Create new user in Clerk first
    const newClerkUser = await clerkClient.users.createUser({
      emailAddress: [email],
      firstName: name,
      password: Math.random().toString(36).slice(-8), // Random password
    });

    // Add new admin to database with Clerk user ID
    await sql`
      INSERT INTO user_roles (
        user_id,
        email,
        name,
        role,
        created_by
      )
      VALUES (
        ${newClerkUser.id.replace('user_', '')}, 
        ${email},
        ${name},
        'admin',
        ${userId.replace('user_', '')}
      )
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Server error', { status: 500 });
  }
} 