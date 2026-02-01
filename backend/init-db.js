/**
 * Backend initialization and seed data script
 * Populates database with demo data for testing
 */

require('dotenv').config();

const db = require('./src/db');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    await db.initDb();
    console.log('Database initialized');
    
    // Create test users
    console.log('Creating test users...');
    const user1 = await db.getOne(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      ['user@example.com', await bcrypt.hash('password123', 10)]
    );
    console.log(`Created user: ${user1.email}`);
    
    // Create test stores
    console.log('Creating test stores...');
    const stores = [
      ['Fresh Market', 'https://freshmarket.local', '123 Main St', 40.7128, -74.0060],
      ['SuperShop', 'https://supershop.local', '456 Oak Ave', 40.7130, -74.0061],
      ['Local Deli', 'https://localdeli.local', '789 Pine Rd', 40.7126, -74.0062],
      ['Whole Foods', 'https://wholefoods.local', '321 Elm St', 40.7125, -74.0063],
    ];
    
    const storeIds = [];
    for (const [name, website, address, lat, lon] of stores) {
      const store = await db.getOne(
        'INSERT INTO stores (name, website, address, latitude, longitude) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [name, website, address, lat, lon]
      );
      storeIds.push(store.id);
      console.log(`Created store: ${name} (id: ${store.id})`);
    }
    
    // Create test products
    console.log('Creating test products...');
    const products = [
      ['Organic Apples', 'Fresh organic apples from local farms', 3.99, 'USD', storeIds[0], 3.50, 5],
      ['Almond Milk', 'Unsweetened almond milk, 1L', 2.49, 'USD', storeIds[0], 2.00, 3],
      ['Greek Yogurt', 'Premium Greek yogurt, plain, 500g', 4.99, 'USD', storeIds[1], 4.50, 2],
      ['Whole Wheat Bread', 'Fresh baked whole wheat bread', 3.49, 'USD', storeIds[1], null, null],
      ['Organic Spinach', 'Fresh organic spinach, 200g', 2.99, 'USD', storeIds[2], 2.50, 4],
      ['Free-Range Eggs', 'Dozen free-range eggs', 5.99, 'USD', storeIds[2], 5.50, 1],
      ['Gluten-Free Pasta', 'Gluten-free pasta, 400g', 2.99, 'USD', storeIds[3], 2.75, 2],
      ['Organic Tomatoes', 'Organic tomatoes, 1kg', 4.49, 'USD', storeIds[3], 4.00, 3],
    ];
    
    const productIds = [];
    for (const [name, desc, price, currency, storeId, bulkPrice, minQty] of products) {
      const product = await db.getOne(
        `INSERT INTO products 
         (store_id, name, description, price, currency, bulk_price, min_quantity, rating, rating_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id`,
        [storeId, name, desc, price, currency, bulkPrice, minQty, Math.random() * 5, Math.floor(Math.random() * 50)]
      );
      productIds.push(product.id);
      console.log(`Created product: ${name} (id: ${product.id})`);
    }
    
    // Create sample ratings
    console.log('Creating sample ratings...');
    for (let i = 0; i < productIds.length; i++) {
      const ratings = [4, 5, 4, 3, 5];
      for (const rating of ratings) {
        await db.query(
          'INSERT INTO ratings (product_id, user_id, rating, comment) VALUES ($1, $2, $3, $4)',
          [productIds[i], user1.id, rating, 'Great product!']
        );
      }
    }
    console.log('Created sample ratings');
    
    // Create sample alert
    console.log('Creating sample alert...');
    await db.getOne(
      'INSERT INTO alerts (user_id, product_id, target_price, radius, active) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [user1.id, productIds[0], 2.99, 50, true]
    );
    console.log('Created sample alert');
    
    // Create sample monthly savings
    console.log('Creating sample monthly savings...');
    const today = new Date();
    for (let i = 0; i < 6; i++) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const savings = 20 + Math.random() * 80;
      await db.query(
        'INSERT INTO monthly_savings (user_id, month_year, savings_amount) VALUES ($1, $2, $3)',
        [user1.id, month.toISOString().split('T')[0], savings]
      );
    }
    console.log('Created monthly savings records');
    
    // Create sample points
    console.log('Creating sample points...');
    await db.query(
      'INSERT INTO user_points (user_id, points, reason) VALUES ($1, $2, $3)',
      [user1.id, 250, 'Welcome bonus']
    );
    console.log('Created points record');
    
    console.log('\n✓ Database seeding completed successfully!');
    console.log(`\nTest Credentials:`);
    console.log(`Email: user@example.com`);
    console.log(`Password: password123`);
    console.log(`\nSeeded: ${stores.length} stores, ${products.length} products, 1 user with alerts and ratings`);
    
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
