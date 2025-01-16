-- Add new columns to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS style VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS fabric VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS vendor VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS podate DATE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS image TEXT;

-- Drop price and description columns as they're not used
ALTER TABLE products DROP COLUMN IF EXISTS price;
ALTER TABLE products DROP COLUMN IF EXISTS description;

-- Create size_quantities table if it doesn't exist
CREATE TABLE IF NOT EXISTS size_quantities (
    id SERIAL PRIMARY KEY,
    productid INTEGER REFERENCES products(id) ON DELETE CASCADE,
    size VARCHAR(10) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(productid, size)
); 