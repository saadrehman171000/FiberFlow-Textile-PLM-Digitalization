import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import sql from '@/lib/db'

export async function GET() {
  const { userId } = auth();
  const dbUserId = userId?.replace('user_', '');

  try {
    const representatives = await sql`
      SELECT 
        id,
        NULLIF(companyname, '') as companyname,
        name,
        designation,
        email,
        NULLIF(phonenumber, '') as phonenumber,
        NULLIF(whatsappnumber, '') as whatsappnumber,
        address,
        NULLIF(cnicnumber, '') as cnicnumber,
        status,
        createdat
      FROM representatives 
      WHERE created_by = ${dbUserId}
      ORDER BY createdat DESC
    `;

    return NextResponse.json(representatives);
  } catch (error) {
    console.error('Failed to fetch representatives:', error);
    return NextResponse.json(
      { error: 'Failed to fetch representatives' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { userId } = auth();
  const dbUserId = userId?.replace('user_', '');

  try {
    const data = await request.json();

    const [representative] = await sql`
      INSERT INTO representatives (
        companyname, name, designation, email, 
        phonenumber, whatsappnumber, address, 
        cnicnumber, status, created_by
      )
      VALUES (
        ${data.companyname || null}, 
        ${data.name}, 
        ${data.designation || null}, 
        ${data.email},
        ${data.phonenumber || null}, 
        ${data.whatsappnumber || null}, 
        ${data.address || null}, 
        ${data.cnicnumber || null}, 
        ${data.status || 'Not Set'},
        ${dbUserId}
      )
      RETURNING *
    `;

    return NextResponse.json(representative);
  } catch (error) {
    console.error('Failed to create representative:', error);
    return NextResponse.json(
      { error: 'Failed to create representative' },
      { status: 500 }
    );
  }
}