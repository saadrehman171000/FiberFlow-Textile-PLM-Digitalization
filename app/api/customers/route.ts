import db from "@/lib/db";
import { NextResponse } from 'next/server';
import { z } from 'zod';

const CustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  industry: z.string().min(1),
});

export async function GET() {
  try {
    const customers = db.prepare('SELECT * FROM customers').all();
    console.log('Fetched customers:', customers);
    return NextResponse.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = CustomerSchema.parse(body);

    const stmt = db.prepare('INSERT INTO customers (name, email, industry) VALUES (?, ?, ?)');
    const result = stmt.run(validatedData.name, validatedData.email, validatedData.industry);

    console.log(`New customer added with ID ${result.lastInsertRowid}.`);
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error creating customer:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
