/**
 * Alerts service tests
 */

const request = require('supertest');
const app = require('../src/index');
const db = require('../src/db');
const jwt = require('jsonwebtoken');
const config = require('../config');

describe('Alerts', () => {
  let token, userId, productId;

  beforeAll(async () => {
    await db.initDb();

    // Create a test user
    const user = await db.getOne(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
      ['alert-test@example.com', 'hashed']
    );
    userId = user.id;
    token = jwt.sign({ id: userId, email: 'alert-test@example.com' }, config.jwtSecret);

    // Create a test store and product
    const store = await db.getOne(
      'INSERT INTO stores (name) VALUES ($1) RETURNING id',
      ['Test Store']
    );

    const product = await db.getOne(
      'INSERT INTO products (store_id, name, price) VALUES ($1, $2, $3) RETURNING id',
      [store.id, 'Test Product', 10.00]
    );
    productId = product.id;
  });

  afterAll(async () => {
    await db.closeDb();
  });

  describe('POST /api/alerts', () => {
    it('should create an alert', async () => {
      const res = await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          product_id: productId,
          target_price: 7.99,
          radius: 50
        });

      expect(res.status).toBe(201);
      expect(res.body.target_price).toBe(7.99);
      expect(res.body.active).toBe(true);
    });

    it('should reject without authentication', async () => {
      const res = await request(app)
        .post('/api/alerts')
        .send({
          product_id: productId,
          target_price: 7.99
        });

      expect(res.status).toBe(401);
    });

    it('should reject invalid alert data', async () => {
      const res = await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          product_id: -1,
          target_price: -5
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/alerts', () => {
    it('should return user alerts', async () => {
      const res = await request(app)
        .get('/api/alerts')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should reject without authentication', async () => {
      const res = await request(app)
        .get('/api/alerts');

      expect(res.status).toBe(401);
    });
  });
});
