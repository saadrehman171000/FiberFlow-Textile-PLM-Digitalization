import { NextResponse } from 'next/server'
import sql from '@/lib/db'

export async function GET() {
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
  try {
    const data = await request.json();

    const [representative] = await sql`
      INSERT INTO representatives (
        companyname, name, designation, email, 
        phonenumber, whatsappnumber, address, 
        cnicnumber, status
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
        ${data.status || 'Not Set'}
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