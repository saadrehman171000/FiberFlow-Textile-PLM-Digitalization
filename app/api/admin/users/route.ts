import { auth } from '@clerk/nextjs/server';
import sql from '@/lib/db';

export async function GET() {
  const { userId } = auth();
  const dbUserId = userId?.replace('user_', '');
  
  // Verify admin
  const adminCheck = await sql`
    SELECT role FROM user_roles 
    WHERE user_id = ${dbUserId} AND role = 'admin'
  `;
  
  if (!adminCheck.length) {
    return new Response('Unauthorized', { status: 401 });
  }

  const users = await sql`
    SELECT 
      user_id, 
      email, 
      name, 
      COALESCE(industry, '') as industry,
      role, 
      created_at
    FROM user_roles 
    WHERE role = 'user'
    AND created_by = ${dbUserId}
    ORDER BY created_at DESC
  `;
  
  return Response.json(users);
}

export async function POST(request: Request) {
  const { userId } = auth();
  const dbUserId = userId?.replace('user_', '');
  
  // Verify admin
  const adminCheck = await sql`
    SELECT role FROM user_roles 
    WHERE user_id = ${dbUserId} AND role = 'admin'
  `;
  
  if (!adminCheck.length) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { email, name, industry } = await request.json();

  try {
    await sql`
      INSERT INTO user_roles (user_id, email, name, industry, role, created_by)
      VALUES (${email}, ${email}, ${name}, ${industry}, 'user', ${dbUserId})
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error creating user:', error);
    return new Response('Error creating user', { status: 500 });
  }
} 