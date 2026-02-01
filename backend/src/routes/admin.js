/**
 * Admin routes - store and user management
 */

const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/admin/stats
 * Get system statistics (admin only)
 */
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userCount = await db.getOne('SELECT COUNT(*) as count FROM users');
    const productCount = await db.getOne('SELECT COUNT(*) as count FROM products');
    const storeCount = await db.getOne('SELECT COUNT(*) as count FROM stores');
    const alertCount = await db.getOne('SELECT COUNT(*) as count FROM alerts WHERE active = true');
    
    res.json({
      users: userCount.count || 0,
      products: productCount.count || 0,
      stores: storeCount.count || 0,
      activeAlerts: alertCount.count || 0
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

/**
 * GET /api/admin/points/:userId
 * Get user points balance
 */
router.get('/points/:userId', authMiddleware, async (req, res) => {
  try {
    const points = await db.getOne(
      'SELECT COALESCE(SUM(points), 0) as total FROM user_points WHERE user_id = $1',
      [parseInt(req.params.userId)]
    );
    
    res.json({ userId: parseInt(req.params.userId), points: points.total || 0 });
  } catch (error) {
    console.error('Get points error:', error);
    res.status(500).json({ error: 'Failed to fetch points' });
  }
});

/**
 * POST /api/admin/points/:userId
 * Add/subtract points
 */
router.post('/points/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { points, reason } = req.body;
    
    if (!points || typeof points !== 'number') {
      return res.status(400).json({ error: 'Valid points value required' });
    }
    
    const record = await db.getOne(
      `INSERT INTO user_points (user_id, points, reason)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [parseInt(userId), points, reason || 'Admin adjustment']
    );
    
    res.status(201).json(record);
  } catch (error) {
    console.error('Add points error:', error);
    res.status(500).json({ error: 'Failed to add points' });
  }
});

/**
 * POST /api/admin/points/:userId/redeem
 * Redeem points for discount or free shipping
 */
router.post('/points/:userId/redeem', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { pointsToRedeem, rewardType } = req.body;
    
    if (!pointsToRedeem || pointsToRedeem < 100) {
      return res.status(400).json({ error: 'Minimum 100 points required' });
    }
    
    // Check current balance
    const balance = await db.getOne(
      'SELECT COALESCE(SUM(points), 0) as total FROM user_points WHERE user_id = $1',
      [parseInt(userId)]
    );
    
    if (balance.total < pointsToRedeem) {
      return res.status(400).json({ error: 'Insufficient points' });
    }
    
    // Deduct points
    await db.query(
      'INSERT INTO user_points (user_id, points, reason) VALUES ($1, $2, $3)',
      [parseInt(userId), -pointsToRedeem, `Redeemed for ${rewardType}`]
    );
    
    res.json({ 
      success: true, 
      message: `Redeemed ${pointsToRedeem} points for ${rewardType}`,
      rewardType,
      pointsRedeemed: pointsToRedeem
    });
  } catch (error) {
    console.error('Redeem points error:', error);
    res.status(500).json({ error: 'Failed to redeem points' });
  }
});

/**
 * GET /api/admin/monthly-savings/:userId
 * Get user monthly savings history
 */
router.get('/monthly-savings/:userId', authMiddleware, async (req, res) => {
  try {
    const savings = await db.getAll(
      `SELECT * FROM monthly_savings
       WHERE user_id = $1
       ORDER BY month_year DESC
       LIMIT 12`,
      [parseInt(req.params.userId)]
    );
    
    res.json(savings);
  } catch (error) {
    console.error('Get monthly savings error:', error);
    res.status(500).json({ error: 'Failed to fetch savings' });
  }
});

module.exports = router;
