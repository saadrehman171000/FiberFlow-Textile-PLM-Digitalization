import { auth, clerkClient } from '@clerk/nextjs/server';
import sql from '@/lib/db';

export async function GET() {
  const { userId } = auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  // Get users created by this admin
  const users = await sql`
    SELECT * FROM user_roles 
    WHERE created_by = ${userId.replace('user_', '')}
    AND role = 'user'
    ORDER BY created_at DESC
  `;

  return Response.json(users);
}

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });
  
  try {
    const { email, name } = await request.json();

    // Create new user in Clerk
    const newClerkUser = await clerkClient.users.createUser({
      emailAddress: [email],
      firstName: name,
      password: Math.random().toString(36).slice(-8),
    });

    // Add user to database with reference to creating admin
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
        'user',
        ${userId.replace('user_', '')}
      )
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Server error', { status: 500 });
  }
} 