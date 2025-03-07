import sql from "@/lib/db";
import { NextResponse } from 'next/server';
import { z } from 'zod';

const CustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  industry: z.string().min(1),
});

export async function GET() {
  try {
    const customers = await sql`SELECT * FROM customers`;
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

    const result = await sql`
      INSERT INTO customers (name, email, industry) 
      VALUES (${validatedData.name}, ${validatedData.email}, ${validatedData.industry})
      RETURNING id
    `;

    console.log(`New customer added with ID ${result[0].id}.`);
    return NextResponse.json({ id: result[0].id });
  } catch (error) {
    console.error('Error creating customer:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
