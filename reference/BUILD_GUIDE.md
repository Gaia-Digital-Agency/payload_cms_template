# Build Guide (Next.js 15 + Payload CMS + Postgres + Redis)

This project is a Next.js App Router app with Payload CMS running inside Next.js routes, backed by PostgreSQL and (optionally) Redis.

This guide documents:
- What you need installed
- How to configure Postgres + Redis + `.env`
- How to run the app
- What changes were made in this repo to get it working cleanly

## 1) Prerequisites

Install/verify:
- Node.js `>= 18.17`
- `pnpm` (recommended)
- PostgreSQL `15+`
- Redis `7+`

Verify quickly:
```bash
node -v
pnpm -v
psql --version
redis-cli --version
```

## 2) Download / Get The Project

If you downloaded a zip:
1. Unzip it.
2. Open a terminal in the project folder.

If you cloned it:
```bash
git clone <your-repo-url>
cd payload_template
```

## 3) Install Node Dependencies

```bash
pnpm install
```

## 4) Start Redis

Examples:
- Homebrew (macOS):
```bash
brew services start redis
redis-cli ping
```

- Docker:
```bash
docker run -d --name redis -p 6379:6379 redis:7-alpine
redis-cli ping
```

Expected output:
- `PONG`

## 5) Start PostgreSQL + Create Database + User

### 5.1 Confirm Postgres is running

```bash
pg_isready
```

You can also check the port is listening:
```bash
lsof -nP -iTCP:5432 -sTCP:LISTEN
```

### 5.2 Connect with the correct role

On many macOS installs, the default role is your macOS username, not `postgres`.

Try:
```bash
psql -U "$(whoami)" -h localhost -p 5432 postgres
```

List roles:
```sql
\du
```

### 5.3 Create the database

Inside `psql`:
```sql
CREATE DATABASE playload_starter;
```

Exit `psql`:
```sql
\q
```

## 6) Create `.env`

This repo ships `.env.example`. Create `.env`:
```bash
cp .env.example .env
```

Minimum required settings (example for local services):
```env
# Postgres
DATABASE_URL=postgresql://YOUR_DB_USER@localhost:5432/playload_starter
POSTGRES_URL=postgresql://YOUR_DB_USER@localhost:5432/playload_starter

# Redis
REDIS_URL=redis://localhost:6379

# Payload
PAYLOAD_SECRET=YOUR_SECRET_AT_LEAST_32_CHARS
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000

# Next.js
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NODE_ENV=development
```

Generate a secure `PAYLOAD_SECRET`:
```bash
openssl rand -base64 32
```

## 7) Run The App

Start dev server:
```bash
pnpm dev
```

Open:
- Admin: `http://localhost:3000/admin`
- Site: `http://localhost:3000`
- Dashboard (protected): `http://localhost:3000/dashboard`

### 7.1 Create your first user

1. Go to `http://localhost:3000/admin`
2. Create the first user (make it an admin in the UI if needed)
3. Use that same email/password on `http://localhost:3000/login`

### 7.2 Optional health check

This repo includes:
- `GET /api/health` (pings Redis + Postgres)

Open:
- `http://localhost:3000/api/health`

## 8) What Was Fixed In This Repo (Activity Log)

This section documents code-level work performed to make the starter coherent and remove known gaps.

### 8.1 Fixed missing routes / 404s (Template gap #1 and #2)

Added registration flow:
- `src/app/(auth)/register/page.tsx`
- `src/components/auth/RegisterForm.tsx`
- `src/components/auth/RegisterForm.module.scss`
- `src/app/api/auth/register/route.ts`

Added simple dashboard pages (so sidebar links work):
- `src/app/(dashboard)/posts/page.tsx`
- `src/app/(dashboard)/media/page.tsx`
- `src/app/(dashboard)/categories/page.tsx`

Adjusted dashboard quick actions that pointed to non-existent routes:
- `src/app/(dashboard)/dashboard/page.tsx`

### 8.2 Added middleware protection (Template gap #4)

Added:
- `src/middleware.ts`

Protects:
- `/dashboard/*`, `/posts/*`, `/media/*`, `/categories/*`

Behavior:
- If `payload-token` cookie is missing, redirect to `/login?next=...`

### 8.3 Made Redis verifiable (Template gap #3)

Added:
- `src/app/api/health/route.ts`

It:
- `PING`s Redis using `src/lib/redis.ts`
- Runs `select 1` against Postgres using `src/lib/db.ts`

### 8.4 Unblocked Drizzle scripts

Problem:
- `drizzle.config.ts` referenced `src/lib/db/schema.ts` but it did not exist.

Fix:
- Added `src/lib/db/schema.ts` with a minimal `app_settings` table.

Also:
- Updated `drizzle.config.ts` to load `.env` without requiring the `dotenv` package.

### 8.5 Payload Next integration updates (Admin UI + REST)

Payload v3 for Next exports changed; the repo now uses the supported exports.

REST route handler:
- Updated `src/app/api/[...slug]/route.ts` to use `@payloadcms/next/routes` exports.

Admin page wiring:
- Updated `src/app/admin/[[...segments]]/page.tsx` to use `RootPage` / `generatePageMetadata`.

Admin layout wiring (required for server functions / admin UI interactions):
- Added `src/app/admin/[[...segments]]/layout.tsx`
- It uses `@payloadcms/next/layouts` `RootLayout`
- It provides a Next.js Server Action that delegates to `handleServerFunctions`

Admin layout also centers the admin content:
- `maxWidth: 1100` and `margin: 0 auto`

### 8.6 Build reliability fixes

Removed Google Fonts fetch requirement (offline-safe builds):
- Updated `src/app/layout.tsx` to stop using `next/font/google` and use `className="font-sans"`.

Tailwind color tokens used by `globals.css`:
- Updated `tailwind.config.ts` to define `border`, `background`, `foreground`, etc.

Next config module format:
- Updated `next.config.js` to CommonJS (`module.exports`) to better match how Next loads config.

## 9) Common Issues / Troubleshooting

### 9.1 `psql: FATAL: role "postgres" does not exist`

Use your macOS username:
```bash
psql -U "$(whoami)" -h localhost -p 5432 postgres
```

### 9.2 Dashboard asks for email/password

That is the Payload `users` auth (not Postgres/Redis).

Create a user in:
- `http://localhost:3000/admin`
or register in:
- `http://localhost:3000/register`

### 9.3 Port 3000 in use / can’t bind

If port 3000 is busy:
```bash
PORT=3001 pnpm dev
```

Then update:
- `NEXT_PUBLIC_SERVER_URL`
- `PAYLOAD_PUBLIC_SERVER_URL`

### 9.4 Drizzle migrations

Drizzle is now “unblocked” (schema exists), but it’s still optional.

If you want to use it:
```bash
pnpm db:generate
pnpm db:migrate
```

## 10) Reference

Project docs:
- `reference/README.md`
- `reference/SETUP.md`
- `reference/ARCHITECTURE.md`
- `reference/DEPLOYMENT.md`
- `reference/FIX_REQUIRED.md`
- `reference/STARTUP_FIX.md` (repo-specific fixes log)
