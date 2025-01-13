import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
  try {
    const representatives = await db.prepare(
      'SELECT * FROM representatives ORDER BY createdat DESC'
    ).all()
    return NextResponse.json(representatives)
  } catch (error) {
    console.error('Failed to fetch representatives:', error)
    return NextResponse.json({ error: 'Failed to fetch representatives' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const result = await db.prepare(`
      INSERT INTO representatives (
        companyname, name, designation, email, phonenumber, 
        whatsappnumber, address, cnicnumber, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
      data.status || 'active'
    )

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Failed to create representative:', error)
    
    if (error.code === '23505' && error.constraint === 'representatives_email_key') {
      return NextResponse.json(
        { error: 'A representative with this email already exists' }, 
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create representative' }, 
      { status: 500 }
    )
  }
}