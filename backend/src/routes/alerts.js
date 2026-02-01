/**
 * Price alerts routes
 * Create, list, toggle, and check price alerts
 */

const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');
const { validateAlertInput } = require('../middleware/validate');
const { sendPriceAlertEmail } = require('../lib/email');
const { checkAlerts } = require('../lib/jobs/alertsChecker');

const router = express.Router();

/**
 * POST /api/alerts
 * Create a new price alert
 * Requires authentication
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const errors = validateAlertInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    const { product_id, target_price, radius } = req.body;
    
    const alert = await db.getOne(
      `INSERT INTO alerts (user_id, product_id, target_price, radius, active)
       VALUES ($1, $2, $3, $4, true)
       RETURNING *`,
      [req.user.id, product_id, target_price, radius || 50]
    );
    
    res.status(201).json(alert);
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

/**
 * GET /api/alerts
 * List user's alerts
 * Requires authentication
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const alerts = await db.getAll(
      `SELECT a.id, a.product_id, a.target_price, a.radius, a.active, a.triggered,
              p.name as product_name, p.price, s.name as store_name
       FROM alerts a
       JOIN products p ON p.id = a.product_id
       LEFT JOIN stores s ON s.id = p.store_id
       WHERE a.user_id = $1
       ORDER BY a.created_at DESC`,
      [req.user.id]
    );
    
    res.json(alerts);
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

/**
 * PATCH /api/alerts/:id
 * Toggle alert active/inactive status
 * Requires authentication
 */
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get current alert to verify ownership
    const alert = await db.getOne(
      'SELECT id, active FROM alerts WHERE id = $1 AND user_id = $2',
      [parseInt(id), req.user.id]
    );
    
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    // Toggle active state
    const updated = await db.getOne(
      'UPDATE alerts SET active = NOT active WHERE id = $1 RETURNING *',
      [parseInt(id)]
    );
    
    res.json(updated);
  } catch (error) {
    console.error('Update alert error:', error);
    res.status(500).json({ error: 'Failed to update alert' });
  }
});

/**
 * DELETE /api/alerts/:id
 * Delete an alert
 * Requires authentication
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'DELETE FROM alerts WHERE id = $1 AND user_id = $2',
      [parseInt(id), req.user.id]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});

/**
 * POST /api/alerts/check
 * Manually trigger alert checking (also called by cron job)
 * Checks all active alerts and sends emails if conditions met
 */
router.post('/check', async (req, res) => {
  try {
    await checkAlerts();
    res.json({ success: true, message: 'Alert check completed' });
  } catch (error) {
    console.error('Check alerts error:', error);
    res.status(500).json({ error: 'Failed to check alerts' });
  }
});

module.exports = router;
module.exports.checkAlerts = checkAlerts;
