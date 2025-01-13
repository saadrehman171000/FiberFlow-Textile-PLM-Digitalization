import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
  try {
    // Test query to count all tables
    const result = await db.prepare(`
      SELECT 
        (SELECT COUNT(*) FROM products) as products_count,
        (SELECT COUNT(*) FROM customers) as customers_count,
        (SELECT COUNT(*) FROM representatives) as representatives_count
    `).get()

    return NextResponse.json({ 
      message: "Database connected successfully!", 
      counts: result 
    })
  } catch (error) {
    console.error('Database test failed:', error)
    return NextResponse.json(
      { error: 'Failed to connect to database' }, 
      { status: 500 }
    )
  }
} 