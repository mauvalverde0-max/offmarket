# Backend Setup Guide

## Development

### Prerequisites
- Node.js 16+
- PostgreSQL 12+ OR SQLite (included)

### Setup

```bash
cd backend
npm install
cp .env.example .env
npm run init-db
npm run dev
```

The backend will start on http://localhost:5000

### Environment Variables

Create a `.env` file:

```bash
# Database (choose one)
DATABASE_URL=sqlite:./dev.db
# Or for PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost:5432/offmarket

JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development

# Email (optional, uses Ethereal by default)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your-ethereal-user
SMTP_PASS=your-ethereal-pass

# OpenAI (optional)
OPENAI_API_KEY=sk-...

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Testing

```bash
npm test
```

## Building Docker Image

```bash
docker build -t offmarket-backend:latest .
```

## Production Deployment

See [../deploy.md](../deploy.md) for cloud deployment instructions.

### Production Environment Variables

```bash
DATABASE_URL=postgresql://user:password@host:5432/offmarket
JWT_SECRET=strong-random-secret-key
NODE_ENV=production
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASS=SG.your-key
OPENAI_API_KEY=sk-...
BACKEND_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

## API Documentation

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login and get JWT

### Products
- `GET /api/products` - List products
- `GET /api/products/featured` - Featured products
- `GET /api/products/:id` - Product details
- `POST /api/products` - Create product (auth required)
- `POST /api/products/:id/ratings` - Rate product (auth required)

### Stores
- `GET /api/stores` - List stores
- `GET /api/stores/:id` - Store details
- `POST /api/stores` - Create store (auth required)

### Alerts
- `POST /api/alerts` - Create alert (auth required)
- `GET /api/alerts` - Get user alerts (auth required)
- `PATCH /api/alerts/:id` - Toggle alert (auth required)
- `DELETE /api/alerts/:id` - Delete alert (auth required)
- `POST /api/alerts/check` - Trigger manual alert check

### Admin
- `GET /api/admin/stats` - System statistics (auth required)
- `GET /api/admin/points/:userId` - Get user points
- `POST /api/admin/points/:userId` - Add points
- `POST /api/admin/points/:userId/redeem` - Redeem points

### AI Assistant
- `POST /api/assistant` - Chat with AI (auth required)
- `POST /api/assistant/execute` - Execute suggested action (auth required)
