import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  try {
    // First ensure the column exists
    await sql`
      ALTER TABLE customers 
      ADD COLUMN IF NOT EXISTS industry TEXT DEFAULT 'Not Specified';
    `;

    // Update existing records that have null industry
    await sql`
      UPDATE customers 
      SET industry = 'Not Specified' 
      WHERE industry IS NULL OR industry = '';
    `;

    return NextResponse.json({ message: 'Migration completed successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
  }
} 