require('dotenv').config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  
  // Database
  databaseUrl: process.env.DATABASE_URL || 'sqlite:./dev.db',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key-change-in-prod',
  
  // API URLs
  backendUrl: process.env.BACKEND_URL || 'http://localhost:5000',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Email
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || null,
    pass: process.env.SMTP_PASS || null,
  },
  emailFrom: process.env.EMAIL_FROM || 'noreply@offmarket.local',
  
  // OpenAI
  openaiApiKey: process.env.OPENAI_API_KEY || null,
  
  // Rate limiting
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
};
