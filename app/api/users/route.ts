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

  const { email, name, role } = await request.json();

  // Add new user
  await sql`
    INSERT INTO user_roles (user_id, email, name, role, created_by)
    VALUES (${email}, ${email}, ${name}, ${role}, ${dbUserId})
  `;

  // Update Clerk metadata
  await clerkClient.users.updateUser(dbUserId, {
    publicMetadata: {
      role: role
    }
  });

  return Response.json({ success: true });
}

// GET endpoint to fetch users (admin only)
export async function GET() {
  const { userId } = auth();
  const dbUserId = userId?.replace('user_', '');
  
  const adminCheck = await sql`
    SELECT role FROM user_roles 
    WHERE user_id = ${dbUserId} AND role = 'admin'
  `;
  
  if (!adminCheck.length) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Only fetch users created by this admin
  const users = await sql`
    SELECT * FROM user_roles 
    WHERE role = 'user' 
    AND created_by = ${dbUserId}
    ORDER BY createdat DESC
  `;
  
  return Response.json(users);
}

async function updateUserRole(userId: string, role: string) {
  // Update database
  await sql`
    INSERT INTO user_roles (user_id, role)
    VALUES (${userId}, ${role})
    ON CONFLICT (user_id) 
    DO UPDATE SET role = ${role}
  `;
  
  // Update Clerk metadata
  await clerkClient.users.updateUser(userId, {
    publicMetadata: {
      role: role
    }
  });
} 