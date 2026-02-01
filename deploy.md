# Offmarket Deployment Guide

This guide provides step-by-step instructions to deploy Offmarket to production cloud platforms.

## Architecture Overview

- **Backend**: Node.js/Express API (Railway, Render, AWS, or GCP)
- **Frontend**: Next.js static/SSR (Vercel recommended)
- **Database**: Managed PostgreSQL (provided by railway/render or separate)
- **Email**: SendGrid, Mailgun, or AWS SES
- **AI**: OpenAI API (optional)

---

## Backend Deployment on Railway

Railway is the easiest and fastest option for deploying the backend.

### Steps

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize and select your Offmarket repo

3. **Add PostgreSQL Plugin**
   - In the project dashboard, click "New"
   - Select "PostgreSQL"
   - Railway will auto-configure DATABASE_URL

4. **Configure Environment Variables**
   - Click on the backend service
   - Go to "Variables"
   - Add the following:
     ```
     NODE_ENV=production
     JWT_SECRET=[generate-a-strong-random-key]
     BACKEND_URL=https://[your-backend-domain]
     FRONTEND_URL=https://[your-frontend-domain]
     
     # Email
     SMTP_HOST=smtp.sendgrid.net
     SMTP_USER=apikey
     SMTP_PASS=SG.[your-sendgrid-api-key]
     EMAIL_FROM=noreply@yourdomain.com
     
     # Optional: OpenAI
     OPENAI_API_KEY=sk-[your-key]
     
     # Optional: Rate limiting
     RATE_LIMIT_MAX_REQUESTS=100
     ```

5. **Add Deploy Trigger**
   - Connect to GitHub
   - Set deployment branch to `main`
   - Railway will auto-deploy on push

6. **Run Database Migration**
   - Click "Deployments"
   - Find your deployment
   - Click "Logs"
   - Verify "Database initialized" appears
   - Run initialization: Use Railway CLI or SSH to:
     ```bash
     npm run init-db
     ```

7. **Get Backend URL**
   - Under "Settings", copy your domain
   - This is your `BACKEND_URL`

---

## Backend Deployment on Render

Alternative to Railway.

### Steps

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Dashboard → "New +"
   - Select "Web Service"
   - Connect GitHub repo

3. **Configure Service**
   - **Name**: offmarket-backend
   - **Environment**: Node
   - **Build Command**: `npm install && npm run init-db`
   - **Start Command**: `npm start`
   - **Plan**: Select appropriate tier

4. **Add PostgreSQL Database**
   - Dashboard → "New +"
   - Select "PostgreSQL"
   - Note the database connection string

5. **Add Environment Variables**
   - In Web Service settings, add all vars from Railway section above
   - Set `DATABASE_URL` to your PostgreSQL connection string

6. **Deploy**
   - Render auto-deploys on git push

---

## Frontend Deployment on Vercel

### Steps

1. **Install Vercel CLI (Optional)**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel --prod
   ```
   Or use the web UI:

3. **Web UI Deployment**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repo
   - Set **Root Directory**: `frontend`
   - Click "Deploy"

4. **Configure Environment Variables**
   - Go to your Vercel project settings
   - **Environment Variables**
   - Add:
     ```
     NEXT_PUBLIC_API_URL=https://[your-backend-domain]
     ```

5. **Auto-Deploy**
   - Vercel auto-deploys on git push to main
   - You can configure branch deployment rules in settings

---

## Email Provider Setup

### SendGrid

1. Create account at [sendgrid.com](https://sendgrid.com)
2. Create API key in Settings
3. Use in environment:
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_USER=apikey
   SMTP_PASS=SG.your-api-key
   ```

### Mailgun

1. Create account at [mailgun.com](https://mailgun.com)
2. Get SMTP credentials from dashboard
3. Use in environment:
   ```
   SMTP_HOST=smtp.mailgun.org
   SMTP_USER=postmaster@yourdomain
   SMTP_PASS=your-password
   ```

### AWS SES

1. Verify email addresses in AWS SES console
2. Create SMTP credentials
3. Use in environment:
   ```
   SMTP_HOST=email-smtp.region.amazonaws.com
   SMTP_USER=your-username
   SMTP_PASS=your-password
   ```

---

## OpenAI Integration (Optional)

1. Create account at [openai.com](https://openai.com)
2. Generate API key in account settings
3. Add to environment:
   ```
   OPENAI_API_KEY=sk-your-key
   ```

---

## Custom Domain Setup

### Railway
- Under project settings, go to "Custom Domain"
- Add your domain
- Follow DNS configuration steps

### Render
- Under service settings, go to "Custom Domain"
- Add domain and update DNS records

### Vercel
- Project settings → "Domains"
- Add domain and update DNS records

---

## Monitoring & Logs

### Railway
- Dashboard shows real-time logs
- Metrics tab shows performance

### Render
- Logs tab shows deployment and runtime logs
- Metrics available in dashboard

### Vercel
- Real-time logs in deployments section
- Analytics dashboard for performance metrics

---

## Database Backups

### Railway PostgreSQL
- Automatic daily backups
- Restore from dashboard

### Render PostgreSQL
- Manage backups in database settings
- Download backups if needed

---

## Post-Deployment Checklist

- [ ] Test user registration and login
- [ ] Create a test product
- [ ] Create a price alert
- [ ] Trigger manual alert check: `curl https://your-backend/api/alerts/check`
- [ ] Verify email notification (check your email or Ethereal preview)
- [ ] Test frontend product browsing
- [ ] Verify geolocation filtering works
- [ ] Test alerts dashboard

---

## Cost Estimates

- **Railway Backend**: $5-50/month depending on resource usage
- **Railway PostgreSQL**: $10/month (500MB) to $45/month (20GB)
- **Vercel Frontend**: Free tier sufficient for most use cases
- **Email Service**: Free tier for < 100/month to $20+/month for high volume
- **OpenAI API**: $0.002 per 1K tokens (typical usage $1-10/month)

**Total estimated cost**: $30-100/month for small to medium usage

---

## Keeping the App Running 24/7

Local deployment on your computer means the app goes offline when you shut down. Cloud deployment ensures:

- **Railway/Render Hosting**: App runs on cloud servers 24/7
- **Database**: Managed PostgreSQL persists data indefinitely
- **Vercel Hosting**: Frontend always available on CDN
- **Email Notifications**: Automatically sent via cloud SMTP service

By deploying to these platforms, Offmarket will remain online and fully functional even when your local machine is off.

---

## Troubleshooting

### Backend won't start
- Check database connection: `DATABASE_URL` format correct?
- Verify all required env vars are set
- Check logs for specific error messages

### Email not sending
- Verify SMTP credentials in production environment
- Check email service provider for API status
- Test with manual alert trigger

### Frontend can't reach backend
- Verify `NEXT_PUBLIC_API_URL` points to correct domain
- Check CORS is enabled on backend
- Verify backend is running and accessible

### Database migration fails
- Ensure PostgreSQL is running
- Check DATABASE_URL is correct
- Try manually running `npm run init-db` via SSH/CLI

---

## Support

For issues or questions:
- Check logs in your deployment platform
- Review API health endpoint: `https://your-backend/health`
- Test API manually with `curl` or Postman
