# Setup Guide

This guide is the shortest path to run the project locally.

## Prerequisites

- Node.js `>= 18.17`
- pnpm
- PostgreSQL `15+`
- Redis `7+`

## 1. Install dependencies

```bash
pnpm install
```

## 2. Configure environment

```bash
cp .env.example .env
```

Set required values in `.env`:

```env
DATABASE_URL=postgresql://YOUR_DB_USER@localhost:5432/your_database
POSTGRES_URL=postgresql://YOUR_DB_USER@localhost:5432/your_database
REDIS_URL=redis://localhost:6379
PAYLOAD_SECRET=YOUR_SECRET_AT_LEAST_32_CHARS
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NODE_ENV=development
```

Generate a secret:

```bash
openssl rand -base64 32
```

## 3. Start infrastructure

Start Postgres and Redis with your local method (services, Docker, etc).

Quick checks:

```bash
pg_isready
redis-cli ping
```

## 4. Run app

```bash
pnpm dev
```

If port 3000 is unavailable:

```bash
PORT=3001 pnpm dev
```

If you change ports, update both:
- `NEXT_PUBLIC_SERVER_URL`
- `PAYLOAD_PUBLIC_SERVER_URL`

## 5. Create first user

- Open `http://localhost:3000/admin`
- Complete Payload first-user flow

## 6. Verify key routes

- `http://localhost:3000/`
- `http://localhost:3000/login`
- `http://localhost:3000/register`
- `http://localhost:3000/dashboard` (requires login)
- `http://localhost:3000/api/health`

## 7. Optional checks

```bash
pnpm lint
pnpm type-check
```

## Troubleshooting

### Cannot connect to Postgres

- Verify server is running.
- Verify database exists.
- Verify `DATABASE_URL` and `POSTGRES_URL`.
- On macOS, try your local username as DB role:

```bash
psql -U "$(whoami)" -h localhost -p 5432 postgres
```

### Cannot connect to Redis

- Verify Redis is running.
- Verify `REDIS_URL`.

### Build issues in restricted environments

- Sandbox restrictions can block local process/network operations during build.
- Try local machine build outside restricted sandbox.
