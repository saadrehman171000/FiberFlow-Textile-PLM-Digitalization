import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
  try {
    const customers = await db.prepare('SELECT * FROM customers ORDER BY createdat DESC').all()
    return NextResponse.json(customers)
  } catch (error) {
    console.error('Failed to fetch customers:', error)
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    if (!data.name || !data.email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const result = await db.prepare(`
      INSERT INTO customers (name, email)
      VALUES ($1, $2)
      RETURNING *
    `).run(
      data.name,
      data.email
    )

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Failed to create customer:', error)
    
    if (error.code === '23505' && error.constraint === 'customers_email_key') {
      return NextResponse.json(
        { error: 'A customer with this email already exists' }, 
        { status: 409 }
      )
    }

    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
  }
} 