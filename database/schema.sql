-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  product_id INTEGER NOT NULL REFERENCES products(id),
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id, size) REFERENCES size_quantities(productid, size)
);
-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    style VARCHAR(255) NOT NULL,
    fabric VARCHAR(255) NOT NULL,
    vendor VARCHAR(255) NOT NULL,
    podate DATE NOT NULL,
    image TEXT,
    createdat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create size_quantities table
CREATE TABLE IF NOT EXISTS size_quantities (
    id SERIAL PRIMARY KEY,
    productid INTEGER REFERENCES products(id),
    size VARCHAR(10) NOT NULL,
    quantity INTEGER NOT NULL,
    createdat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create representatives table
CREATE TABLE IF NOT EXISTS representatives (
    id SERIAL PRIMARY KEY,
    companyname VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phonenumber VARCHAR(20) NOT NULL,
    whatsappnumber VARCHAR(20),
    address TEXT NOT NULL,
    cnicnumber VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(20) CHECK(status IN ('active', 'inactive', 'none')) NOT NULL DEFAULT 'none',
    createdat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP WITH TIME ZONE
);

-- Create customers table
CREATE TABLE IF NOT EXISTS representatives (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    industry VARCHAR(255) NOT NULL,
    createdat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP WITH TIME ZONE
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    parent_admin TEXT,
    permissions JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_admin) REFERENCES users(id)
);

-- Insert an initial admin user
INSERT INTO users (id, email, name, role) 
VALUES ('initial_admin', 'your-email@example.com', 'Admin User', 'admin');