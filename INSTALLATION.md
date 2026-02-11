# Installation Guide (End-to-End)

This guide covers everything needed after cloning the repo to run the Payload CMS app locally.

## 1) Clone and enter project

```bash
git clone <your-repo-url>
cd payload_cms_template
```

## 2) Dependency checks

Required:
- Node.js `>= 18.17`
- pnpm
- PostgreSQL `15+`
- Redis `7+`

Check installed versions:

```bash
node -v
pnpm -v
psql --version
redis-cli --version
```

## 3) Install Node dependencies

```bash
pnpm install
```

## 4) Start PostgreSQL

If Postgres is already running, skip to database creation.

Example checks:

```bash
pg_isready
lsof -nP -iTCP:5432 -sTCP:LISTEN
```

Create a database:

```bash
psql -U "$(whoami)" -h localhost -p 5432 postgres
```

Inside `psql`:

```sql
CREATE DATABASE payload_starter;
\q
```

## 5) Start Redis

macOS (Homebrew):

```bash
brew services start redis
redis-cli ping
```

Docker alternative:

```bash
docker run -d --name redis -p 6379:6379 redis:7-alpine
redis-cli ping
```

Expected Redis check output: `PONG`

## 6) Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL=postgresql://YOUR_DB_USER@localhost:5432/payload_starter
POSTGRES_URL=postgresql://YOUR_DB_USER@localhost:5432/payload_starter
REDIS_URL=redis://localhost:6379
PAYLOAD_SECRET=YOUR_SECRET_AT_LEAST_32_CHARS
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NODE_ENV=development
```

Generate secure Payload secret:

```bash
openssl rand -base64 32
```

## 7) (Optional) Run Drizzle commands

Payload itself uses `DATABASE_URL`. Drizzle scripts are optional:

```bash
pnpm db:generate
pnpm db:migrate
```

## 8) Run the app

```bash
pnpm dev
```

If `3000` is busy:

```bash
PORT=3001 pnpm dev
```

If you change port, update both in `.env`:
- `NEXT_PUBLIC_SERVER_URL`
- `PAYLOAD_PUBLIC_SERVER_URL`

## 9) First-time app setup

Open:
- Home: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`
- Login: `http://localhost:3000/login`
- Register: `http://localhost:3000/register`

Create your first user at `/admin` (make it admin if needed).

## 10) Verify services and auth

Health endpoint:

```bash
curl -s http://localhost:3000/api/health | jq
```

Expected:
- `ok: true`
- `redis.ok: true`
- `postgres.ok: true`

Code quality checks:

```bash
pnpm lint
pnpm type-check
```

## 11) Quick troubleshooting

Postgres role error (`role "postgres" does not exist`):

```bash
psql -U "$(whoami)" -h localhost -p 5432 postgres
```

Redis connection error:
- Ensure Redis is running and `REDIS_URL` is correct.

Build issues in restricted environments:
- Some sandboxed environments block local process/network operations during build.
- Validate with local machine permissions if needed.
