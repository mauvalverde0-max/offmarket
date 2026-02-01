/**
 * Offmarket Backend - Express API Server
 * Main entry point for the backend application
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');

const config = require('./config');
const db = require('./db');
const { initEmail } = require('./lib/email');
const { checkAlerts } = require('./lib/jobs/alertsChecker');

// Route imports
const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const storesRoutes = require('./routes/stores');
const alertsRoutes = require('./routes/alerts');
const adminRoutes = require('./routes/admin');
const aiAssistantRoutes = require('./routes/assistant');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindow,
  max: config.rateLimitMax,
  message: 'Too many requests, please try again later'
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/assistant', aiAssistantRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Server startup
async function start() {
  try {
    // Initialize database
    await db.initDb();
    console.log('Database initialized');
    
    // Initialize email service
    await initEmail();
    
    // Start cron job for alerts checking (every 5 minutes)
    cron.schedule('*/5 * * * *', async () => {
      console.log('[Cron] Running scheduled alert check');
      await checkAlerts();
    });
    console.log('Cron jobs scheduled');
    
    // Start server
    app.listen(config.port, () => {
      console.log(`Offmarket backend listening on port ${config.port}`);
      console.log(`Environment: ${config.nodeEnv}`);
      console.log(`Database: ${config.databaseUrl}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
start();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await db.closeDb();
  process.exit(0);
});

module.exports = app;
