# Setup Guide

This is the practical setup path for **this repo as it exists today**.

For a more narrative / end-to-end walkthrough, see:
- `reference/BUILD_GUIDE.md`

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: 18.17 or later
- **PostgreSQL**: 15 or later
- **Redis**: 7 or later
- **pnpm**: Latest version (recommended) or npm

## Initial Setup

### 1. Get the project

If you cloned:
```bash
git clone https://github.com/yourusername/nextjs-payload-starter.git
cd nextjs-payload-starter
```

### 2. Install Dependencies

Using pnpm (recommended):
```bash
pnpm install
```

Or using npm:
```bash
npm install
```

### 3. Start Redis

Start Redis (pick one):
```bash
# macOS (Homebrew)
brew services start redis

# Docker
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

Verify Redis:
```bash
redis-cli ping
```

Expected: `PONG`

### 4. Start PostgreSQL + create a database

Verify Postgres is running:
```bash
pg_isready
```

Connect using the correct role:
- On many local installs (especially macOS), the `postgres` role may not exist.
- If `psql -U postgres ...` fails with `role "postgres" does not exist`, use your macOS username.

```bash
psql -U "$(whoami)" -h localhost -p 5432 postgres
```

Create a database (choose a name you want):
```sql
CREATE DATABASE your_database_name;
```

Exit:
```sql
\q
```

### 5. Environment Variables (`.env`)

Copy the example environment file:

```bash
cp .env.example .env
```

Update the `.env` file with your credentials:

```env
# Required
DATABASE_URL=postgresql://YOUR_DB_USER@localhost:5432/your_database_name
REDIS_URL=redis://localhost:6379
PAYLOAD_SECRET=your-super-secret-key-at-least-32-characters-long
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Optional
NODE_ENV=development
```

**Important**: Generate a secure `PAYLOAD_SECRET`:

```bash
# Generate random secret
openssl rand -base64 32
```

### 6. Start Development Server

```bash
pnpm dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Admin Panel: http://localhost:3000/admin
- Login: http://localhost:3000/login
- Register: http://localhost:3000/register

### 7. Create your first user (Admin)

Navigate to http://localhost:3000/admin and follow the "Create first user" flow.

This creates a user in the Payload `users` collection.

### 8. Optional: Verify service connectivity

This repo includes a small health endpoint:
- `GET /api/health` (pings Redis + Postgres)

Open:
- http://localhost:3000/api/health

### 9. Drizzle migrations (optional)

This repo includes a minimal Drizzle schema to keep these scripts runnable:
```bash
pnpm db:generate
pnpm db:migrate
```

### 10. Type check

```bash
pnpm type-check
```

Should complete without errors.

## Common Issues

### Port Already in Use

If port 3000 is already in use:

```bash
# Use different port
PORT=3001 pnpm dev
```

If you change the port, also update in `.env`:
- `NEXT_PUBLIC_SERVER_URL`
- `PAYLOAD_PUBLIC_SERVER_URL`

### Database Connection Error

- Verify PostgreSQL is running: `pg_isready`
- Check credentials in `.env`
- Ensure database exists
- Check firewall settings

### Redis Connection Error

- Verify Redis is running: `redis-cli ping`
- Check `REDIS_URL` in `.env`
- Ensure port 6379 is not blocked

### Module Not Found

```bash
# Clear node_modules and reinstall
pnpm clean
pnpm install
```

## Next Steps

- Read `reference/ARCHITECTURE.md` to understand the project structure
- Read `reference/DEPLOYMENT.md` for production deployment
- Customize Payload collections in `src/payload/collections/`
- Update branding and styles in `src/app/globals.css`

## Development Workflow

1. Make changes to code
2. Changes hot-reload automatically
3. Test in browser
4. Commit changes
5. Push to repository

## Useful Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
pnpm db:push          # Push schema changes
pnpm db:studio        # Open database GUI

# Code Quality
pnpm lint             # Run linter
pnpm format           # Format code
pnpm type-check       # Check TypeScript
```

## Support

If you encounter issues:

1. Check this guide thoroughly
2. Review `reference/ARCHITECTURE.md` and `reference/DEPLOYMENT.md`
3. Check `reference/STARTUP_FIX.md` and `reference/FIX_REQUIRED.md` for known gaps and fixes
