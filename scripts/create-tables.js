const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function createTables() {
  try {
    console.log('Creating database tables...');

    // Create Category table
    await sql`
      CREATE TABLE IF NOT EXISTS Category (
        category_id SERIAL PRIMARY KEY,
        category_name VARCHAR(255) NOT NULL,
        description TEXT
      );
    `;
    console.log('✓ Category table created');

    // Create Brand table
    await sql`
      CREATE TABLE IF NOT EXISTS Brand (
        brand_id SERIAL PRIMARY KEY,
        brand_name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT
      );
    `;
    console.log('✓ Brand table created');

    // Create Supplier table
    await sql`
      CREATE TABLE IF NOT EXISTS Supplier (
        supplier_id SERIAL PRIMARY KEY,
        supplier_name VARCHAR(255) NOT NULL UNIQUE,
        contact_person VARCHAR(255),
        contact_number VARCHAR(50),
        address TEXT
      );
    `;
    console.log('✓ Supplier table created');

    // Create Product table
    await sql`
      CREATE TABLE IF NOT EXISTS Product (
        product_id SERIAL PRIMARY KEY,
        product_name VARCHAR(255) NOT NULL,
        unit VARCHAR(50) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        category_id INTEGER NOT NULL REFERENCES Category(category_id),
        description TEXT,
        brand_id INTEGER NOT NULL REFERENCES Brand(brand_id),
        reorder_level INTEGER NOT NULL DEFAULT 10
      );
    `;
    console.log('✓ Product table created');

    // Create Product_ExpirationDate table
    await sql`
      CREATE TABLE IF NOT EXISTS Product_ExpirationDate (
        batch_code INTEGER NOT NULL,
        product_id INTEGER NOT NULL REFERENCES Product(product_id),
        quantity INTEGER NOT NULL,
        expirationdate DATE,
        PRIMARY KEY (batch_code, product_id)
      );
    `;
    console.log('✓ Product_ExpirationDate table created');

    // Create Employee table
    await sql`
      CREATE TABLE IF NOT EXISTS Employee (
        employee_id SERIAL PRIMARY KEY,
        employee_name VARCHAR(255) NOT NULL,
        employee_gender CHAR(6),
        employee_age INTEGER,
        employee_address TEXT,
        employee_contacts VARCHAR(50)
      );
    `;
    console.log('✓ Employee table created');

    // Create customer table
    await sql`
      CREATE TABLE IF NOT EXISTS customer (
        customer_id SERIAL PRIMARY KEY,
        birth_date DATE,
        customer_name VARCHAR(255),
        gender VARCHAR(10),
        contacts VARCHAR(50),
        address TEXT
      );
    `;
    console.log('✓ customer table created');

    // Create User table
   // Create User table
await sql`
  CREATE TABLE IF NOT EXISTS "User" (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Cashier',
    employee_id INTEGER NOT NULL REFERENCES Employee(employee_id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;
    console.log('✓ User table created');

    // Create Sale table
    await sql`
      CREATE TABLE IF NOT EXISTS Sale (
        sale_id SERIAL PRIMARY KEY,
        sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
        customer_id INTEGER REFERENCES customer(customer_id),
        sale_description TEXT,
        total_amount DECIMAL(10,2),
        user_id INTEGER NOT NULL REFERENCES "User"(user_id)
      );
    `;
    console.log('✓ Sale table created');

    // Create Sales_Details table
    await sql`
      CREATE TABLE IF NOT EXISTS Sales_Details (
        sales_detail_id SERIAL PRIMARY KEY,
        sale_id INTEGER NOT NULL REFERENCES Sale(sale_id),
        product_id INTEGER NOT NULL REFERENCES Product(product_id),
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        subtotal DECIMAL(10,2)
      );
    `;
    console.log('✓ Sales_Details table created');

    // Create Rx_details table
    await sql`
      CREATE TABLE IF NOT EXISTS Rx_details (
        sales_detail_id INTEGER PRIMARY KEY REFERENCES Sales_Details(sales_detail_id),
        quantity_remaining INTEGER
      );
    `;
    console.log('✓ Rx_details table created');

    // Create Supply table
    await sql`
      CREATE TABLE IF NOT EXISTS Supply (
        supply_id SERIAL PRIMARY KEY,
        supply_date DATE NOT NULL DEFAULT CURRENT_DATE,
        supplier_id INTEGER NOT NULL REFERENCES Supplier(supplier_id),
        employee_id INTEGER REFERENCES Employee(employee_id),
        user_id INTEGER NOT NULL REFERENCES "User"(user_id),
        total_amount DECIMAL(10,2)
      );
    `;
    console.log('✓ Supply table created');

    // Create Supply_Details table
    await sql`
      CREATE TABLE IF NOT EXISTS Supply_Details (
        supply_id INTEGER NOT NULL REFERENCES Supply(supply_id),
        product_id INTEGER NOT NULL REFERENCES Product(product_id),
        quantity INTEGER NOT NULL,
        supply_amount DECIMAL(10,2),
        subtotal DECIMAL(10,2),
        PRIMARY KEY (supply_id, product_id)
      );
    `;
    console.log('✓ Supply_Details table created');

    // Create Stock_out table
    await sql`
      CREATE TABLE IF NOT EXISTS Stock_out (
        stock_out_id SERIAL PRIMARY KEY,
        total DECIMAL(10,2),
        stock_out_date DATE NOT NULL DEFAULT CURRENT_DATE,
        employee_id INTEGER REFERENCES Employee(employee_id),
        user_id INTEGER NOT NULL REFERENCES "User"(user_id)
      );
    `;
    console.log('✓ Stock_out table created');

    // Create Stock_out_details table
    await sql`
      CREATE TABLE IF NOT EXISTS Stock_out_details (
        stock_out_id INTEGER REFERENCES Stock_out(stock_out_id),
        product_id INTEGER REFERENCES Product(product_id),
        quantity INTEGER NOT NULL,
        description VARCHAR(255),
        PRIMARY KEY (stock_out_id, product_id)
      );
    `;
    console.log('✓ Stock_out_details table created');

    // Create return_of_products table
    await sql`
      CREATE TABLE IF NOT EXISTS return_of_products (
        return_product_id SERIAL PRIMARY KEY,
        return_date DATE NOT NULL DEFAULT CURRENT_DATE,
        return_type VARCHAR(255) NOT NULL,
        reason VARCHAR(255) NOT NULL,
        verified_by_employee_id INTEGER NOT NULL REFERENCES Employee(employee_id),
        sale_id INTEGER REFERENCES Sale(sale_id),
        customer_name VARCHAR(255),
        user_id INTEGER NOT NULL REFERENCES "User"(user_id)
      );
    `;
    console.log('✓ return_of_products table created');

    // Create return_details table
    await sql`
      CREATE TABLE IF NOT EXISTS return_details (
        return_details_id SERIAL PRIMARY KEY,
        return_id INTEGER NOT NULL REFERENCES return_of_products(return_product_id),
        product_id INTEGER NOT NULL REFERENCES Product(product_id),
        quantity INTEGER NOT NULL
      );
    `;
    console.log('✓ return_details table created');

    console.log('\n✅ All tables created successfully!');

  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    process.exit();
  }
}

createTables();