const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function initDatabase() {
  try {
    console.log('Initializing database with sample data...');

    // Check if connection works
    console.log('Testing database connection...');
    const testResult = await sql`SELECT 1 as test`;
    console.log('✅ Database connection successful!');

    // Insert sample categories (check if exists first)
    console.log('\nInserting categories...');
    const categories = [
      ['Medicines', 'Prescription and over-the-counter medications'],
      ['Vitamins', 'Dietary supplements and vitamins'],
      ['Personal Care', 'Personal hygiene and care products'],
      ['First Aid', 'First aid supplies and equipment']
    ];

    for (const [name, desc] of categories) {
      // Check if category already exists
      const existing = await sql`SELECT category_id FROM Category WHERE category_name = ${name}`;
      if (existing.length === 0) {
        await sql`
          INSERT INTO Category (category_name, description) 
          VALUES (${name}, ${desc});
        `;
        console.log(`  Added category: ${name}`);
      } else {
        console.log(`  Category already exists: ${name}`);
      }
    }
    console.log('✅ Categories processed');

    // Insert sample brands
    console.log('\nInserting brands...');
    const brands = [
      ['Generic', 'Generic medicines'],
      ['Biogenic', 'Biogenic vitamins and supplements'],
      ['Johnson & Johnson', 'Personal care products'],
      ['3M', 'First aid supplies']
    ];

    for (const [name, desc] of brands) {
      const existing = await sql`SELECT brand_id FROM Brand WHERE brand_name = ${name}`;
      if (existing.length === 0) {
        await sql`
          INSERT INTO Brand (brand_name, description) 
          VALUES (${name}, ${desc});
        `;
        console.log(`  Added brand: ${name}`);
      } else {
        console.log(`  Brand already exists: ${name}`);
      }
    }
    console.log('✅ Brands processed');

    // Insert sample employees
    console.log('\nInserting employees...');
    const employees = [
      ['John Doe', 'Male', 30, 'Isulan', '09123456789'],
      ['Jane Smith', 'Female', 28, 'Isulan', '09987654321'],
      ['Mike Wilson', 'Male', 35, 'Isulan', '09123456780']
    ];

    for (const [name, gender, age, address, contacts] of employees) {
      const existing = await sql`SELECT employee_id FROM Employee WHERE employee_name = ${name} AND employee_contacts = ${contacts}`;
      if (existing.length === 0) {
        await sql`
          INSERT INTO Employee (employee_name, employee_gender, employee_age, employee_address, employee_contacts) 
          VALUES (${name}, ${gender}, ${age}, ${address}, ${contacts});
        `;
        console.log(`  Added employee: ${name}`);
      } else {
        console.log(`  Employee already exists: ${name}`);
      }
    }
    console.log('✅ Employees processed');

    // Create users with hashed passwords
    console.log('\nCreating users...');
    const password = await bcrypt.hash('admin123', 10);
    
    // Get employee IDs
    const employees_db = await sql`SELECT employee_id, employee_name FROM Employee`;
    
    for (const emp of employees_db) {
      let username = '';
      let role = '';
      
      if (emp.employee_name === 'John Doe') {
        username = 'admin';
        role = 'Admin';
      } else if (emp.employee_name === 'Jane Smith') {
        username = 'manager';
        role = 'Manager';
      } else if (emp.employee_name === 'Mike Wilson') {
        username = 'cashier';
        role = 'Cashier';
      }
      
      if (username) {
        const existing = await sql`SELECT user_id FROM "User" WHERE username = ${username}`;
        if (existing.length === 0) {
          await sql`
            INSERT INTO "User" (username, password_hash, role, employee_id, is_active) 
            VALUES (${username}, ${password}, ${role}, ${emp.employee_id}, true);
          `;
          console.log(`  Added user: ${username}`);
        } else {
          console.log(`  User already exists: ${username}`);
        }
      }
    }
    console.log('✅ Users processed');

    // Insert sample suppliers
    console.log('\nInserting suppliers...');
    const suppliers = [
      ['MedSupply Inc.', 'Juan Reyes', '09123456780', 'Manila'],
      ['PharmaDist Co.', 'Maria Santos', '09123456781', 'Cebu'],
      ['HealthCare Corp', 'Pedro Cruz', '09123456782', 'Davao']
    ];

    for (const [name, contact, number, address] of suppliers) {
      const existing = await sql`SELECT supplier_id FROM Supplier WHERE supplier_name = ${name}`;
      if (existing.length === 0) {
        await sql`
          INSERT INTO Supplier (supplier_name, contact_person, contact_number, address) 
          VALUES (${name}, ${contact}, ${number}, ${address});
        `;
        console.log(`  Added supplier: ${name}`);
      } else {
        console.log(`  Supplier already exists: ${name}`);
      }
    }
    console.log('✅ Suppliers processed');

    // Insert sample products
    console.log('\nInserting products...');
    const categories_db = await sql`SELECT category_id, category_name FROM Category`;
    const brands_db = await sql`SELECT brand_id, brand_name FROM Brand`;
    
    const medicineCat = categories_db.find(c => c.category_name === 'Medicines');
    const vitaminCat = categories_db.find(c => c.category_name === 'Vitamins');
    const personalCareCat = categories_db.find(c => c.category_name === 'Personal Care');
    const firstAidCat = categories_db.find(c => c.category_name === 'First Aid');
    
    const genericBrand = brands_db.find(b => b.brand_name === 'Generic');
    const biogenicBrand = brands_db.find(b => b.brand_name === 'Biogenic');
    const jnjBrand = brands_db.find(b => b.brand_name === 'Johnson & Johnson');
    const threeMBrand = brands_db.find(b => b.brand_name === '3M');

    const products = [
      ['Paracetamol 500mg', 'Tablet', 5.00, medicineCat?.category_id, genericBrand?.brand_id, 100],
      ['Vitamin C 500mg', 'Tablet', 8.00, vitaminCat?.category_id, biogenicBrand?.brand_id, 50],
      ['Bandage', 'Piece', 15.00, firstAidCat?.category_id, threeMBrand?.brand_id, 30],
      ['Baby Oil', 'Bottle', 120.00, personalCareCat?.category_id, jnjBrand?.brand_id, 20],
      ['Amoxicillin 500mg', 'Capsule', 12.00, medicineCat?.category_id, genericBrand?.brand_id, 100],
      ['Multivitamins', 'Tablet', 10.00, vitaminCat?.category_id, biogenicBrand?.brand_id, 75],
      ['Antiseptic Cream', 'Tube', 45.00, firstAidCat?.category_id, threeMBrand?.brand_id, 25],
      ['Shampoo', 'Bottle', 85.00, personalCareCat?.category_id, jnjBrand?.brand_id, 15]
    ];

    for (const [name, unit, price, catId, brandId, reorder] of products) {
      if (catId && brandId) {
        const existing = await sql`SELECT product_id FROM Product WHERE product_name = ${name}`;
        if (existing.length === 0) {
          await sql`
            INSERT INTO Product (product_name, unit, price, category_id, brand_id, reorder_level) 
            VALUES (${name}, ${unit}, ${price}, ${catId}, ${brandId}, ${reorder});
          `;
          console.log(`  Added product: ${name}`);
        } else {
          console.log(`  Product already exists: ${name}`);
        }
      }
    }
    console.log('✅ Products processed');

    // Insert sample customers
    console.log('\nInserting customers...');
    const customers = [
      ['Juan Dela Cruz', 'Male', '09123456781', 'Isulan', '1990-01-15'],
      ['Maria Santos', 'Female', '09123456782', 'Isulan', '1992-05-20'],
      ['Pedro Reyes', 'Male', '09123456783', 'Isulan', '1988-11-30'],
      ['Ana Lopez', 'Female', '09123456784', 'Isulan', '1995-03-10']
    ];

    for (const [name, gender, contacts, address, birthDate] of customers) {
      const existing = await sql`SELECT customer_id FROM customer WHERE customer_name = ${name} AND contacts = ${contacts}`;
      if (existing.length === 0) {
        await sql`
          INSERT INTO customer (customer_name, gender, contacts, address, birth_date) 
          VALUES (${name}, ${gender}, ${contacts}, ${address}, ${birthDate}::date);
        `;
        console.log(`  Added customer: ${name}`);
      } else {
        console.log(`  Customer already exists: ${name}`);
      }
    }
    console.log('✅ Customers processed');

    // Insert sample expiration dates
    console.log('\nInserting expiration dates...');
    const products_db = await sql`SELECT product_id, product_name FROM Product`;
    
    // Set expiration dates
    const today = new Date();
    
    // 6 months from now
    const expDate6Months = new Date(today);
    expDate6Months.setMonth(expDate6Months.getMonth() + 6);
    const expDate6MonthsStr = expDate6Months.toISOString().split('T')[0];
    
    // 1 month from now (expiring soon)
    const expDate1Month = new Date(today);
    expDate1Month.setMonth(expDate1Month.getMonth() + 1);
    const expDate1MonthStr = expDate1Month.toISOString().split('T')[0];
    
    // 1 year from now
    const expDate1Year = new Date(today);
    expDate1Year.setFullYear(expDate1Year.getFullYear() + 1);
    const expDate1YearStr = expDate1Year.toISOString().split('T')[0];

    let batchCode = 1001;
    for (const product of products_db) {
      let dateToUse;
      if (product.product_name.includes('Paracetamol') || product.product_name.includes('Amoxicillin')) {
        dateToUse = expDate1MonthStr; // Expiring soon
      } else if (product.product_name.includes('Vitamin')) {
        dateToUse = expDate6MonthsStr; // 6 months
      } else {
        dateToUse = expDate1YearStr; // 1 year
      }
      
      // Check if expiration record already exists
      const existing = await sql`
        SELECT * FROM Product_ExpirationDate 
        WHERE product_id = ${product.product_id} AND batch_code = ${batchCode}
      `;
      
      if (existing.length === 0) {
        await sql`
          INSERT INTO Product_ExpirationDate (batch_code, product_id, quantity, expirationdate) 
          VALUES (${batchCode}, ${product.product_id}, 500, ${dateToUse}::date);
        `;
        console.log(`  Added expiration for: ${product.product_name}`);
      } else {
        console.log(`  Expiration already exists for: ${product.product_name}`);
      }
      batchCode++;
    }
    console.log('✅ Expiration dates processed');

    console.log('\n' + '='.repeat(50));
    console.log('✅ DATABASE INITIALIZATION COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(50));
    console.log('\n📝 DEFAULT LOGIN CREDENTIALS:');
    console.log('   Admin:   username: admin,   password: admin123');
    console.log('   Manager: username: manager, password: admin123');
    console.log('   Cashier: username: cashier, password: admin123');
    console.log('\n🌐 Access the application at: http://localhost:3000');
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('\n❌ Error initializing database:', error);
  } finally {
    process.exit();
  }
}

initDatabase();