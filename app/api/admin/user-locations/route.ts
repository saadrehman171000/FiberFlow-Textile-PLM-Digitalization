import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import sql from '@/lib/db';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [adminRole] = await sql`
      SELECT role FROM user_roles 
      WHERE user_id = ${userId.replace('user_', '')}
      AND role = 'admin'
    `;

    if (!adminRole) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const locations = await sql`
      SELECT 
        email,
        user_id,
        location->>'country' as country,
        location->>'city' as city,
        ip_address,
        to_char(
          (last_login_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Karachi') + interval '1 day' - interval '14 hours',
          'YYYY-MM-DD HH12:MI:SS AM'
        ) as last_accessed
      FROM user_roles 
      ORDER BY last_login_at DESC NULLS LAST
    `;

    // Get user details from Clerk
    const userDetails = await Promise.all(
      locations.map(async (location) => {
        try {
          const user = await clerkClient.users.getUser(`user_${location.user_id}`);
          return {
            ...location,
            name: `${user.firstName} ${user.lastName}`.trim() || user.username || location.email
          };
        } catch (error) {
          return {
            ...location,
            name: location.email // Fallback to email if can't fetch name
          };
        }
      })
    );

    return NextResponse.json(userDetails);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
} 