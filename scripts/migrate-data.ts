import db from '@/lib/db'

async function migrateData() {
  try {
    // Get your existing SQLite data and insert into Neon
    // Example insert:
    await db.prepare(`
      INSERT INTO products (name, style, fabric, vendor, sizeQuantities, poDate, image)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `).run('Test Product', 'Casual', 'Cotton', 'Vendor1', '{}', '2024-03-20', null)
  } catch (error) {
    console.error('Migration failed:', error)
  }
} 