import sql from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const rows = await sql`SELECT * FROM customers WHERE id = ${params.id}`;
    if (!rows[0]) {
      console.log(`Customer with ID ${params.id} not found.`);
      return new NextResponse("Customer not found", { status: 404 });
    }
    console.log(`Fetched customer with ID ${params.id}:`, rows[0]);
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching customer:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { name, email, industry } = await request.json();
    const rows = await sql`
      UPDATE customers 
      SET name = ${name}, email = ${email}, industry = ${industry} 
      WHERE id = ${params.id} 
      RETURNING *
    `;
    
    if (rows.length === 0) {
      console.log(`No customer found with ID ${params.id} to update.`);
      return new NextResponse("Customer not found", { status: 404 });
    }
    console.log(`Customer with ID ${params.id} updated successfully.`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating customer:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const rows = await sql`DELETE FROM customers WHERE id = ${params.id} RETURNING *`;
    
    if (rows.length === 0) {
      console.log(`No customer found with ID ${params.id} to delete.`);
      return new NextResponse("Customer not found", { status: 404 });
    }
    console.log(`Customer with ID ${params.id} deleted successfully.`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
