/**
 * Products service tests
 */

const request = require('supertest');
const app = require('../src/index');
const db = require('../src/db');
const jwt = require('jsonwebtoken');
const config = require('../config');

describe('Products', () => {
  let token;

  beforeAll(async () => {
    await db.initDb();
    token = jwt.sign({ id: 1, email: 'test@example.com' }, config.jwtSecret);
  });

  afterAll(async () => {
    await db.closeDb();
  });

  describe('GET /api/products', () => {
    it('should return list of products', async () => {
      const res = await request(app)
        .get('/api/products');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should support filtering by store', async () => {
      const res = await request(app)
        .get('/api/products?storeId=1');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/products/featured', () => {
    it('should return featured products', async () => {
      const res = await request(app)
        .get('/api/products/featured');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/products', () => {
    it('should create a product with auth', async () => {
      // First create a store
      const store = await db.getOne(
        'INSERT INTO stores (name) VALUES ($1) RETURNING id',
        ['Test Store']
      );

      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Product',
          price: 9.99,
          store_id: store.id,
          description: 'Test description'
        });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Test Product');
      expect(res.body.price).toBe(9.99);
    });

    it('should reject without authentication', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({
          name: 'Test Product',
          price: 9.99,
          store_id: 1
        });

      expect(res.status).toBe(401);
    });

    it('should reject invalid product data', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '',
          price: -5
        });

      expect(res.status).toBe(400);
    });
  });
});
