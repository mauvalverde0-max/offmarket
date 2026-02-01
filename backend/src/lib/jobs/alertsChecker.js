/**
 * Alert checker job - runs periodically to check if prices have dropped
 * Triggers emails when alerts are activated
 */

const db = require('../../db');
const { initEmail, sendPriceAlertEmail } = require('../email');

async function checkAlerts() {
  try {
    console.log('[AlertsChecker] Starting alert check...');
    
    // Get all active alerts
    const alerts = await db.getAll(
      `SELECT a.*, p.name as product_name, p.price, s.name as store_name, u.email
       FROM alerts a
       JOIN products p ON a.product_id = p.id
       JOIN stores s ON p.store_id = s.id
       JOIN users u ON a.user_id = u.id
       WHERE a.active = true AND a.triggered = false`
    );
    
    console.log(`[AlertsChecker] Found ${alerts.length} active alerts to check`);
    
    for (const alert of alerts) {
      // Check if current price is at or below target price
      if (alert.price <= alert.target_price) {
        console.log(`[AlertsChecker] Alert triggered: ${alert.product_name} $${alert.price} <= $${alert.target_price}`);
        
        // Send email
        await sendPriceAlertEmail(
          alert.email,
          alert.product_name,
          alert.target_price,
          alert.price,
          alert.store_name
        );
        
        // Mark alert as triggered
        await db.query(
          'UPDATE alerts SET triggered = true, active = false WHERE id = $1',
          [alert.id]
        );
        
        console.log(`[AlertsChecker] Email sent to ${alert.email}`);
      }
    }
    
    console.log('[AlertsChecker] Alert check complete');
  } catch (error) {
    console.error('[AlertsChecker] Error:', error);
  }
}

module.exports = {
  checkAlerts,
};
