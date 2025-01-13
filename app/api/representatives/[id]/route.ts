import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const representative = await db.prepare(
      'SELECT * FROM representatives WHERE id = $1'
    ).get(params.id)

    if (!representative) {
      return NextResponse.json({ error: 'Representative not found' }, { status: 404 })
    }

    return NextResponse.json(representative)
  } catch (error) {
    console.error('Failed to fetch representative:', error)
    return NextResponse.json({ error: 'Failed to fetch representative' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const result = await db.prepare(`
      UPDATE representatives SET 
        companyname = $1, 
        name = $2, 
        designation = $3, 
        email = $4, 
        phonenumber = $5, 
        whatsappnumber = $6, 
        address = $7, 
        cnicnumber = $8, 
        status = $9,
        updatedat = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *
    `).run(
      data.companyName || '', 
      data.name || '', 
      data.designation || '', 
      data.email || '', 
      data.phoneNumber || '', 
      data.whatsappNumber || '', 
      data.address || '', 
      data.cnicNumber || '', 
      data.status || 'active', 
      params.id
    )

    if (!result.changes) {
      return NextResponse.json({ error: 'Representative not found' }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Failed to update representative:', error)
    
    if (error.code === '23505' && error.constraint === 'representatives_email_key') {
      return NextResponse.json(
        { error: 'A representative with this email already exists' }, 
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update representative' }, 
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await db.prepare(
      'DELETE FROM representatives WHERE id = $1 RETURNING *'
    ).run(params.id)

    if (!result.changes) {
      return NextResponse.json({ error: 'Representative not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Representative deleted successfully' })
  } catch (error) {
    console.error('Failed to delete representative:', error)
    return NextResponse.json({ error: 'Failed to delete representative' }, { status: 500 })
  }
} 