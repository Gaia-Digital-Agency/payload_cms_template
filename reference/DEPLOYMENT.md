# Deployment Guide

## Overview

Deploy as a standard Next.js app with environment-backed Payload, Postgres, and Redis.

## Required Environment Variables

```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
POSTGRES_URL=postgresql://user:pass@host:5432/dbname
REDIS_URL=redis://user:pass@host:6379
PAYLOAD_SECRET=secure-random-secret-min-32-chars
PAYLOAD_PUBLIC_SERVER_URL=https://your-domain
NEXT_PUBLIC_SERVER_URL=https://your-domain
NODE_ENV=production
```

## Option A: Vercel + Managed Services

Recommended:
- Hosting: Vercel
- Postgres: Neon or Supabase
- Redis: Upstash

### Steps

1. Push repository to Git provider.
2. Import project in Vercel.
3. Configure env vars above.
4. Deploy.
5. Open `/admin` and create first production user.
6. Validate `/api/health`.

## Option B: Container Platform

Any platform that can run Next server and connect to Postgres/Redis works.

### Minimal process requirements

- Node runtime compatible with Next 16.
- Persistent env var management.
- Outbound access to Postgres and Redis.
- HTTPS termination in front of app.

## Post-Deploy Validation

- `GET /api/health` returns `ok: true`.
- Login flow works at `/login`.
- Protected pages redirect when unauthenticated.
- Payload admin functions at `/admin`.

## Security Baseline

- Use a unique strong `PAYLOAD_SECRET` per environment.
- Set production URLs correctly for:
  - `PAYLOAD_PUBLIC_SERVER_URL`
  - `NEXT_PUBLIC_SERVER_URL`
- Keep cookie security defaults (`httpOnly`, `secure` in production).
- Restrict database and Redis network exposure.

## Rollback Strategy

- Use immutable deploys (platform default if available).
- Maintain previous environment settings and last known good image/build.
- Roll back app first, then evaluate schema/data compatibility.
