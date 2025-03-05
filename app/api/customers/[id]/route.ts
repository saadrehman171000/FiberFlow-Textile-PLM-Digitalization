import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(params.id);
    if (!customer) {
      console.log(`Customer with ID ${params.id} not found.`);
      return new NextResponse("Customer not found", { status: 404 });
    }
    console.log(`Fetched customer with ID ${params.id}:`, customer);
    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { name, email, industry } = await request.json();
    const stmt = db.prepare('UPDATE customers SET name = ?, email = ?, industry = ? WHERE id = ?');
    const result = stmt.run(name, email, industry, params.id);
    
    if (result.changes === 0) {
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
    const stmt = db.prepare('DELETE FROM customers WHERE id = ?');
    const result = stmt.run(params.id);
    
    if (result.changes === 0) {
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
