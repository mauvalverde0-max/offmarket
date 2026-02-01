/**
 * Database module with support for PostgreSQL and SQLite
 * Handles connection, migrations, and query building
 */

const config = require('../config');

let db = null;
let isPostgres = false;

async function initDb() {
  const dbUrl = config.databaseUrl;
  
  if (dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://')) {
    // PostgreSQL
    const { Pool } = require('pg');
    const pool = new Pool({ connectionString: dbUrl });
    
    db = {
      pool,
      async query(text, params) {
        const result = await pool.query(text, params);
        return result;
      },
      async close() {
        await pool.end();
      }
    };
    isPostgres = true;
    
    console.log('Connected to PostgreSQL');
  } else if (dbUrl.startsWith('sqlite://') || dbUrl.startsWith('sqlite:') || dbUrl.endsWith('.db')) {
    // SQLite - using sqlite3 package
    const sqlite3 = require('sqlite3').verbose();
    const pathModule = require('path');
    let dbPath = dbUrl.replace('sqlite://', '').replace('sqlite:', '');
    
    // Convert relative paths to absolute
    if (!pathModule.isAbsolute(dbPath)) {
      dbPath = pathModule.resolve(process.cwd(), dbPath);
    }
    
    const sqliteDb = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('SQLite error:', err);
      }
    });
    
    // Enable foreign keys
    sqliteDb.run('PRAGMA foreign_keys = ON');
    
    db = {
      sqlite: sqliteDb,
      async query(text, params = []) {
        return new Promise((resolve, reject) => {
          // Determine if it's a SELECT query
          const isSelect = text.trim().toUpperCase().startsWith('SELECT');
          
          if (isSelect) {
            sqliteDb.all(text, params, (err, rows) => {
              if (err) reject(err);
              else resolve({ rows: rows || [] });
            });
          } else {
            sqliteDb.run(text, params, function(err) {
              if (err) reject(err);
              else resolve({ rows: [], lastID: this.lastID, changes: this.changes });
            });
          }
        });
      },
      async close() {
        return new Promise((resolve, reject) => {
          sqliteDb.close((err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
    };
    isPostgres = false;
    
    console.log(`Connected to SQLite: ${dbPath}`);
  } else {
    throw new Error(`Unknown database URL: ${dbUrl}`);
  }
  
  await runMigrations();
  return db;
}

async function runMigrations() {
  if (isPostgres) {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS stores (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        website VARCHAR(255),
        latitude FLOAT,
        longitude FLOAT,
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        store_id INTEGER REFERENCES stores(id),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price FLOAT NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        bulk_price FLOAT,
        min_quantity INTEGER,
        stock_quantity INTEGER,
        rating FLOAT DEFAULT 0,
        rating_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS alerts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        product_id INTEGER REFERENCES products(id),
        target_price FLOAT NOT NULL,
        radius FLOAT DEFAULT 50,
        active BOOLEAN DEFAULT TRUE,
        triggered BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id),
        user_id INTEGER REFERENCES users(id),
        rating INTEGER NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS user_points (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        points INTEGER DEFAULT 0,
        reason VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS monthly_savings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        month_year DATE,
        savings_amount FLOAT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } else {
    // SQLite
    const sqlite = db.sqlite;

    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS stores (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        website TEXT,
        latitude REAL,
        longitude REAL,
        address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        store_id INTEGER REFERENCES stores(id),
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        currency TEXT DEFAULT 'USD',
        bulk_price REAL,
        min_quantity INTEGER,
        stock_quantity INTEGER,
        rating REAL DEFAULT 0,
        rating_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        product_id INTEGER REFERENCES products(id),
        target_price REAL NOT NULL,
        radius REAL DEFAULT 50,
        active BOOLEAN DEFAULT 1,
        triggered BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS ratings (
        id INTEGER PRIMARY KEY,
        product_id INTEGER REFERENCES products(id),
        user_id INTEGER REFERENCES users(id),
        rating INTEGER NOT NULL,
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS user_points (
        id INTEGER PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        points INTEGER DEFAULT 0,
        reason TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS monthly_savings (
        id INTEGER PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        month_year DATE,
        savings_amount REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
}

async function query(text, params) {
  if (!db) throw new Error('Database not initialized');
  const result = await db.query(text, params);
  return isPostgres ? result.rows : result.rows;
}

async function getOne(text, params) {
  const rows = await query(text, params);
  return rows[0] || null;
}

async function getAll(text, params) {
  return await query(text, params);
}

async function closeDb() {
  if (db) await db.close();
}

module.exports = {
  initDb,
  query,
  getOne,
  getAll,
  closeDb,
};
