import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import sql from "@/lib/db"

export async function GET() {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const cleanUserId = userId.replace('user_', '')

    const adminCheck = await sql`
      SELECT role FROM user_roles 
      WHERE user_id = ${cleanUserId}
      AND role = 'admin'
    `

    if (!adminCheck.length) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    return NextResponse.json({ role: 'admin' })
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 