require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { initDb } = require('./init-db'); // optional to run manually
const authRoutes = require('./src/routes/auth');
const productsRoutes = require('./src/routes/products');
const alertsRoutes = require('./src/routes/alerts');
const { runAlertsCheck } = require('./src/routes/alerts');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/alerts', alertsRoutes);

app.get('/', (req, res) => res.send('Offmarket backend running'));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});

// Cron: run every 15 minutes if enabled
if (process.env.CRON_ENABLED !== 'false') {
  const cron = require('node-cron');
  cron.schedule('*/15 * * * *', async () => {
    console.log('Cron trigger: runAlertsCheck');
    try { await runAlertsCheck(); } catch (e) { console.error(e); }
  });
  console.log('Cron scheduled every 15 minutes');
}
