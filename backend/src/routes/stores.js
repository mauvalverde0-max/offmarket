/**
 * Stores routes - manage store directory
 */

const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/stores
 * List all stores with optional geolocation filter
 * Query params: latitude, longitude, radius (in km)
 */
router.get('/', async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.query;
    
    let query = `SELECT id, name, website, address, latitude, longitude FROM stores`;
    const params = [];
    
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      const rad = parseFloat(radius || 100);
      
      // Simple bounding box
      const latDiff = rad / 111;
      query += ` WHERE latitude BETWEEN ${lat - latDiff} AND ${lat + latDiff}
                 AND longitude BETWEEN ${lon - latDiff} AND ${lon + latDiff}`;
    }
    
    query += ' ORDER BY name';
    
    const stores = await db.getAll(query, params);
    
    // Apply haversine if needed
    let filtered = stores;
    if (latitude && longitude && radius) {
      filtered = stores.filter(s => {
        if (!s.latitude || !s.longitude) return false;
        const distance = haversine(lat, lon, s.latitude, s.longitude);
        return distance <= parseFloat(radius);
      });
    }
    
    res.json(filtered);
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

/**
 * GET /api/stores/:id
 * Get store details
 */
router.get('/:id', async (req, res) => {
  try {
    const store = await db.getOne(
      'SELECT * FROM stores WHERE id = $1',
      [parseInt(req.params.id)]
    );
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    // Get store products
    const products = await db.getAll(
      'SELECT id, name, price, currency, rating FROM products WHERE store_id = $1 ORDER BY rating DESC',
      [parseInt(req.params.id)]
    );
    
    res.json({ ...store, products });
  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({ error: 'Failed to fetch store' });
  }
});

/**
 * POST /api/stores
 * Create a new store (admin only)
 * Requires authentication (store admin)
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, website, address, latitude, longitude } = req.body;
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Store name is required' });
    }
    
    const store = await db.getOne(
      `INSERT INTO stores (name, website, address, latitude, longitude)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, website, address, latitude, longitude]
    );
    
    res.status(201).json(store);
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ error: 'Failed to create store' });
  }
});

/**
 * PATCH /api/stores/:id
 * Update store details
 */
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, website, address, latitude, longitude } = req.body;
    
    const store = await db.getOne(
      `UPDATE stores 
       SET name = COALESCE($1, name),
           website = COALESCE($2, website),
           address = COALESCE($3, address),
           latitude = COALESCE($4, latitude),
           longitude = COALESCE($5, longitude)
       WHERE id = $6
       RETURNING *`,
      [name, website, address, latitude, longitude, parseInt(id)]
    );
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    res.json(store);
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({ error: 'Failed to update store' });
  }
});

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

module.exports = router;
