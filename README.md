# Offmarket

A professional price comparison and ordering assistant for supermarkets and local stores. Track discounts, create price alerts, monitor monthly savings, and receive email notifications when prices drop.

## Features

- **Price Comparison**: Compare prices across nearby stores in real-time
- **Price Alerts**: Set target prices and receive email notifications when deals appear
- **Store Directory**: Browse products from multiple retailers
- **Monthly Savings Tracking**: Visualize and track savings over time
- **Geolocation**: Discover stores within a specified radius
- **Wholesale Mode**: Toggle between retail and bulk pricing
- **AI Assistant**: Chat-based assistant to find products and manage reminders
- **User Ratings**: Community-driven product ratings and reviews

## Quick Start (Local Development)

### Option 1: Docker Compose (Recommended)

```bash
# Clone and install
git clone <repo>
cd offmarket

# Start all services (PostgreSQL + Backend + Frontend)
docker-compose up --build

# In another terminal, seed the database
docker exec offmarket-backend npm run init-db

# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

### Option 2: Manual Setup

**Prerequisites**: Node.js 16+, PostgreSQL 12+ (or use SQLite for dev)

```bash
# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env and set DATABASE_URL if needed
npm run init-db
npm run dev
# Backend runs on http://localhost:5000

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

### Environment Variables

Backend requires `.env` file (see `backend/.env.example`):
```
DATABASE_URL=postgresql://user:password@localhost:5432/offmarket
# Or use SQLite: DATABASE_URL=sqlite:./dev.db

JWT_SECRET=your-secret-key
NODE_ENV=development
BACKEND_URL=http://localhost:5000

# Optional: Email (uses Ethereal by default for dev)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your-ethereal-email
SMTP_PASS=your-ethereal-password

# Optional: AI (stub response if not provided)
OPENAI_API_KEY=sk-...

# Optional: Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

Frontend requires `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Running Tests

```bash
cd backend
npm test
```

## Project Structure

```
offmarket/
├── README.md
├── docker-compose.yml
├── Makefile
├── deploy.md
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── .env.example
│   ├── init-db.js
│   ├── src/
│   │   ├── index.js
│   │   ├── config.js
│   │   ├── db/
│   │   ├── routes/
│   │   ├── lib/
│   │   ├── middleware/
│   │   └── tests/
│   └── README-backend.md
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── pages/
│   ├── components/
│   ├── styles/
│   ├── utils/
│   └── README-frontend.md
└── .github/
    └── workflows/
        └── ci.yml
```

## Key Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login and get JWT

### Products
- `GET /api/products` - List products (supports filtering by store, radius)
- `GET /api/products/featured` - Best products of the day
- `POST /api/products` - Store publishes a product (requires auth)
- `GET /api/products/:id` - Product details and reviews

### Alerts
- `POST /api/alerts` - Create price alert (requires auth)
- `GET /api/alerts` - List user's alerts (requires auth)
- `PATCH /api/alerts/:id` - Toggle alert active/inactive
- `POST /api/alerts/check` - Trigger alert check job (manual testing)

### Stores
- `GET /api/stores` - List stores with geolocation filter
- `POST /api/stores` - Register a new store (admin)

### AI Assistant
- `POST /api/assistant` - Send message and get AI-suggested actions

### Ratings
- `POST /api/products/:id/ratings` - Rate a product

## Manual Testing Workflow

1. **Register & Login**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"user@test.com","password":"test123"}'
   ```

2. **View Products**
   ```bash
   curl http://localhost:5000/api/products
   ```

3. **Create Alert**
   ```bash
   curl -X POST http://localhost:5000/api/alerts \
     -H "Authorization: Bearer <jwt_token>" \
     -H "Content-Type: application/json" \
     -d '{"productId":1,"targetPrice":2.99,"radius":10}'
   ```

4. **Check Alerts** (triggers email)
   ```bash
   curl -X POST http://localhost:5000/api/alerts/check
   ```

5. **Check Email** (if using Ethereal)
   - Look for the preview URL in backend console output when alert triggers
   - Or log in to https://ethereal.email with your test credentials

## Deployment

See [deploy.md](./deploy.md) for detailed cloud deployment instructions:
- Backend: Railway, Render, AWS, or GCP
- Frontend: Vercel
- Database: Managed PostgreSQL service

**Why deployment is needed**: Running locally means your app is only active when your computer is on. Deploying to cloud platforms (Railway for backend, Vercel for frontend, managed database) keeps your app running 24/7 so users can access it anytime.

## Architecture

- **Backend**: Express.js REST API with JWT authentication, PostgreSQL/SQLite persistence
- **Frontend**: Next.js with Tailwind CSS for responsive, professional UI
- **Jobs**: Node-cron for periodic price alert checks
- **Email**: Nodemailer with provider flexibility (Ethereal dev, SendGrid/SES prod)
- **AI**: OpenAI API integration with graceful fallback
- **Testing**: Jest + Supertest for API testing

## Development

```bash
# Run everything locally
make dev

# Build Docker images
make docker-build

# Run tests
make test

# View deployment help
make deploy-help
```

## License

MIT
