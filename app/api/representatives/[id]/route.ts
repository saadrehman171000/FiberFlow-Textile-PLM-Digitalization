import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import sql from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();
  const dbUserId = userId?.replace('user_', '');

  try {
    const [representative] = await sql`
      SELECT * FROM representatives 
      WHERE id = ${params.id} AND created_by = ${dbUserId}
    `;

    if (!representative) {
      return NextResponse.json(
        { error: 'Representative not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(representative);
  } catch (error) {
    console.error('Failed to fetch representative:', error);
    return NextResponse.json(
      { error: 'Failed to fetch representative' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();
  const dbUserId = userId?.replace('user_', '');

  try {
    const data = await request.json();

    const [representative] = await sql`
      UPDATE representatives 
      SET companyname = ${data.companyname || ''},
          name = ${data.name},
          designation = ${data.designation || ''},
          email = ${data.email},
          phonenumber = ${data.phonenumber || ''},
          whatsappnumber = ${data.whatsappnumber || ''},
          address = ${data.address || ''},
          cnicnumber = ${data.cnicnumber || ''},
          status = ${data.status || 'none'}
      WHERE id = ${params.id} AND created_by = ${dbUserId}
      RETURNING *
    `;

    if (!representative) {
      return NextResponse.json(
        { error: 'Representative not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(representative);
  } catch (error) {
    console.error('Failed to update representative:', error);
    return NextResponse.json(
      { error: 'Failed to update representative' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();
  const dbUserId = userId?.replace('user_', '');

  try {
    const [representative] = await sql`
      DELETE FROM representatives 
      WHERE id = ${params.id} AND created_by = ${dbUserId}
      RETURNING id
    `;

    if (!representative) {
      return NextResponse.json(
        { error: 'Representative not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete representative:', error);
    return NextResponse.json(
      { error: 'Failed to delete representative' },
      { status: 500 }
    );
  }
} 