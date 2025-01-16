import { NextResponse } from 'next/server'
import sql from '@/lib/db'

interface Customer {
  id: number;
  name: string;
  email: string;
  industry: string;
  createdat: string;
}

export async function GET() {
  try {
    const customers = await sql`
      SELECT * FROM customers 
      ORDER BY createdat DESC
    `;

    return NextResponse.json(customers);
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const [customer] = await sql`
      INSERT INTO customers (name, email, industry)
      VALUES (${data.name}, ${data.email}, ${data.industry || ''})
      RETURNING *
    `;

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Failed to create customer:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}