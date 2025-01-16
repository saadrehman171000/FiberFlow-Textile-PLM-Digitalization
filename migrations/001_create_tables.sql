-- Create products table if it doesn't exist
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create customers table if it doesn't exist
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create representatives table if it doesn't exist
CREATE TABLE IF NOT EXISTS representatives (
    id SERIAL PRIMARY KEY,
    companyname VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phonenumber VARCHAR(20),
    whatsappnumber VARCHAR(20),
    address TEXT,
    cnicnumber VARCHAR(20),
    status VARCHAR(50) DEFAULT 'none',
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 