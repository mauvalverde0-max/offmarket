/**
 * Products routes - list, create, and manage products
 */

const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');
const { validateProductInput } = require('../middleware/validate');

const router = express.Router();

/**
 * GET /api/products
 * List all products with optional filtering
 * Query params:
 *   - storeId: filter by store
 *   - latitude/longitude/radius: filter by geolocation (in km)
 */
router.get('/', async (req, res) => {
  try {
    const { storeId, latitude, longitude, radius } = req.query;
    
    let query = `
      SELECT p.id, p.name, p.description, p.price, p.currency, 
             p.bulk_price, p.min_quantity, p.rating, p.rating_count,
             s.id as store_id, s.name as store_name, s.website,
             s.latitude, s.longitude
      FROM products p
      LEFT JOIN stores s ON s.id = p.store_id
      WHERE 1=1
    `;
    
    const params = [];
    
    // Filter by store
    if (storeId) {
      params.push(parseInt(storeId));
      query += ` AND p.store_id = $${params.length}`;
    }
    
    // Geolocation filter (haversine formula for simple distance)
    if (latitude && longitude && radius) {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      const rad = parseFloat(radius);
      
      // Simple bounding box for performance, then haversine in app
      const latDiff = rad / 111; // 1 degree ≈ 111 km
      query += ` AND s.latitude BETWEEN ${lat - latDiff} AND ${lat + latDiff}
                 AND s.longitude BETWEEN ${lon - latDiff} AND ${lon + latDiff}`;
    }
    
    query += ' ORDER BY p.rating DESC, p.id DESC';
    
    const products = await db.getAll(query, params);
    
    // Apply haversine filtering if needed
    let filtered = products;
    if (latitude && longitude && radius) {
      filtered = products.filter(p => {
        if (!p.latitude || !p.longitude) return false;
        const distance = haversine(
          parseFloat(latitude),
          parseFloat(longitude),
          p.latitude,
          p.longitude
        );
        return distance <= parseFloat(radius);
      });
    }
    
    res.json(filtered);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

/**
 * GET /api/products/featured
 * Get best products of the day (highest rated or biggest discount)
 */
router.get('/featured', async (req, res) => {
  try {
    const products = await db.getAll(
      `SELECT p.id, p.name, p.description, p.price, p.currency, 
              p.rating, s.name as store_name, s.website
       FROM products p
       LEFT JOIN stores s ON s.id = p.store_id
       ORDER BY p.rating DESC
       LIMIT 6`
    );
    
    res.json(products);
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
});

/**
 * GET /api/products/:id
 * Get product details with reviews
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await db.getOne(
      `SELECT p.*, s.name as store_name, s.website
       FROM products p
       LEFT JOIN stores s ON s.id = p.store_id
       WHERE p.id = $1`,
      [parseInt(id)]
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Get ratings
    const ratings = await db.getAll(
      `SELECT id, rating, comment, created_at
       FROM ratings
       WHERE product_id = $1
       ORDER BY created_at DESC`,
      [parseInt(id)]
    );
    
    res.json({ ...product, reviews: ratings });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

/**
 * POST /api/products
 * Store publishes a product
 * Requires authentication
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const errors = validateProductInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    const { name, description, price, currency, store_id, bulk_price, min_quantity, stock_quantity } = req.body;
    
    const product = await db.getOne(
      `INSERT INTO products 
       (store_id, name, description, price, currency, bulk_price, min_quantity, stock_quantity)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [store_id, name, description, price, currency || 'USD', bulk_price, min_quantity, stock_quantity]
    );
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

/**
 * POST /api/products/:id/ratings
 * Rate a product
 */
router.post('/:id/ratings', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be 1-5' });
    }
    
    // Insert rating
    const result = await db.getOne(
      `INSERT INTO ratings (product_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [parseInt(id), req.user.id, rating, comment || null]
    );
    
    // Update product average rating
    const stats = await db.getOne(
      `SELECT AVG(rating) as avg_rating, COUNT(*) as count
       FROM ratings
       WHERE product_id = $1`,
      [parseInt(id)]
    );
    
    await db.query(
      `UPDATE products SET rating = $1, rating_count = $2 WHERE id = $3`,
      [stats.avg_rating || 0, stats.count, parseInt(id)]
    );
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Create rating error:', error);
    res.status(500).json({ error: 'Failed to create rating' });
  }
});

/**
 * Haversine formula to calculate distance between two coordinates
 */
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

module.exports = router;
