# Deployment Guide

## Overview

This guide covers deploying the Next.js + Payload CMS starter to production environments.

## Recommended Stack

### Vercel Deployment (Recommended)

**Hosting**: Vercel
**Database**: Neon or Supabase (PostgreSQL)
**Cache**: Upstash Redis
**Storage**: Vercel Blob or Cloudflare R2

#### Why Vercel?
- Native Next.js support
- Zero-configuration deployments
- Automatic HTTPS
- Global CDN
- Serverless functions
- Environment variable management

## Prerequisites

- Git repository (GitHub, GitLab, or Bitbucket)
- Vercel account
- PostgreSQL database (Neon/Supabase)
- Redis instance (Upstash)

## Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Ensure all changes are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Set Up PostgreSQL (Neon)

1. Go to [Neon](https://neon.tech)
2. Create account and new project
3. Copy connection string
4. Format: `postgresql://user:pass@host/dbname?sslmode=require`

### 3. Set Up Redis (Upstash)

1. Go to [Upstash](https://upstash.com)
2. Create account and new Redis database
3. Copy the Redis connection string (use it as `REDIS_URL`)
4. Example format: `redis://default:password@host:port`

### 4. Deploy to Vercel

#### Via Vercel Dashboard

1. Go to [Vercel](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `pnpm build`
   - **Output Directory**: .next

#### Environment Variables

Add these in Vercel project settings:

```env
# Database
DATABASE_URL=postgresql://user:pass@neon-host/dbname?sslmode=require
POSTGRES_URL=postgresql://user:pass@neon-host/dbname?sslmode=require

# Redis
REDIS_URL=redis://default:password@upstash-host:port

# Payload
PAYLOAD_SECRET=generate-new-secure-32-char-secret
PAYLOAD_PUBLIC_SERVER_URL=https://your-domain.vercel.app

# Next.js
NEXT_PUBLIC_SERVER_URL=https://your-domain.vercel.app
NODE_ENV=production
```

**Important**: Generate a NEW `PAYLOAD_SECRET` for production:
```bash
openssl rand -base64 32
```

5. Click "Deploy"

### 5. Run Database Migrations

This starter uses Payload's Postgres adapter via `DATABASE_URL` / `POSTGRES_URL`.

If you also choose to use Drizzle (optional), you can run the Drizzle migrations after the first deployment.

After first deployment (example using Vercel CLI to pull env locally):

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Run migrations
vercel env pull .env.production
pnpm db:migrate
```

Alternatively, run migrations locally with production env:

```bash
# Use production DATABASE_URL
DATABASE_URL=your-production-url pnpm db:migrate
```

### 6. Create Admin User

1. Visit `https://your-domain.vercel.app/admin`
2. Create your first admin user
3. Log in and verify everything works

## Alternative: Manual Deployment

### Docker Deployment

#### 1. Create Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm install -g pnpm && pnpm build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### 2. Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - PAYLOAD_SECRET=${PAYLOAD_SECRET}
      - PAYLOAD_PUBLIC_SERVER_URL=${PAYLOAD_PUBLIC_SERVER_URL}
      - NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: payload_app
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

#### 3. Deploy

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Run migrations
docker-compose exec app pnpm db:migrate
```

### VPS Deployment (Ubuntu)

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Redis
sudo apt install -y redis-server

# Install pnpm
npm install -g pnpm

# Install PM2
npm install -g pm2
```

#### 2. Setup Database

```bash
# Create database
sudo -u postgres psql
CREATE DATABASE payload_app;
CREATE USER your_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE payload_app TO your_user;
\q
```

#### 3. Deploy Application

```bash
# Clone repository
git clone https://github.com/yourusername/nextjs-payload-starter.git
cd nextjs-payload-starter

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
nano .env  # Edit with production values

# Run migrations
pnpm db:migrate

# Build
pnpm build

# Start with PM2
pm2 start npm --name "nextjs-app" -- start
pm2 save
pm2 startup
```

#### 4. Setup Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/nextjs /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Post-Deployment Checklist

- [ ] Database migrations completed
- [ ] Admin user created
- [ ] Environment variables set correctly
- [ ] HTTPS enabled
- [ ] Custom domain configured
- [ ] Error tracking setup (Sentry)
- [ ] Analytics configured
- [ ] Backup strategy in place
- [ ] Monitoring setup

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Vercel CLI
        run: npm install -g vercel
      
      - name: Deploy to Vercel
        run: vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Monitoring & Maintenance

### Error Tracking

Install Sentry:

```bash
pnpm add @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### Performance Monitoring

- Use Vercel Analytics
- Monitor database queries
- Check Redis cache hit rate
- Review Core Web Vitals

### Backups

#### Database Backups

```bash
# Neon has automatic backups
# Manual backup:
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

#### Media Backups

If using Vercel Blob, backups are automatic.
For S3, enable versioning and lifecycle rules.

## Scaling

### Horizontal Scaling

Vercel automatically scales based on traffic.

For VPS:
- Load balancer (Nginx/HAProxy)
- Multiple app instances
- Database read replicas
- Redis cluster

### Performance Optimization

```bash
# Enable compression
# In next.config.js
compress: true

# Optimize images
# Use Next.js Image component

# Enable ISR
export const revalidate = 3600 // 1 hour
```

## Troubleshooting

### Build Failures

```bash
# Clear cache
vercel --force

# Check build logs
vercel logs
```

### Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL

# Check SSL requirement
# Add ?sslmode=require to connection string
```

### Environment Variables Not Loading

- Verify in Vercel dashboard
- Redeploy after adding new variables
- Check variable names (case-sensitive)

## Rollback

### Vercel

```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

### Manual

```bash
# Revert to previous commit
git revert HEAD
git push

# Or checkout specific commit
git checkout previous-commit-hash
vercel --prod
```

## Common Production Notes

- Set both:
  - `PAYLOAD_PUBLIC_SERVER_URL`
  - `NEXT_PUBLIC_SERVER_URL`
  to the same public origin (your deployed domain).
- Create the first admin user by visiting `/admin` after deployment.
- Redis is optional unless you add features that rely on it. This repo includes `GET /api/health` to validate connectivity.

## Security Checklist

- [ ] Strong PAYLOAD_SECRET (32+ characters)
- [ ] Database credentials secured
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Regular dependency updates
- [ ] Security headers configured
- [ ] Backup strategy in place

## Support

For deployment issues:
- Vercel Docs: https://vercel.com/docs
- Payload Docs: https://payloadcms.com/docs
- GitHub Issues: https://github.com/yourusername/repo/issues
