# Frontend Setup Guide

## Development

### Prerequisites
- Node.js 16+

### Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:3000

### Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Building for Production

```bash
npm run build
npm start
```

## Deployment to Vercel

1. **Connect Repository**
   ```bash
   vercel --prod
   ```

2. **Set Environment Variables in Vercel Dashboard**
   - `NEXT_PUBLIC_API_URL=https://your-backend-url.com`

3. **Deploy**
   - Vercel automatically deploys on git push

## Available Pages

- `/` - Homepage with product listings and search
- `/login` - User login
- `/register` - User registration
- `/product/[id]` - Product detail page with ratings and alerts
- `/alerts` - User's price alerts management (auth required)
- `/dashboard` - User dashboard with savings tracking (auth required)

## Architecture

- **Framework**: Next.js 14 with React 18
- **Styling**: Tailwind CSS
- **State Management**: React hooks + SWR for data fetching
- **Charts**: Chart.js + react-chartjs-2
- **API Communication**: Native fetch with custom fetcher utilities
