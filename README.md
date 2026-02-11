# Next.js 16 + Payload CMS Starter

Production-ready starter using Next.js App Router and Payload CMS in one codebase.

## Current Stack

- Next.js `16.1.6` (App Router)
- React `19`
- TypeScript `5.6`
- Payload CMS `3.0.0-beta.117`
- PostgreSQL (Payload primary DB)
- Redis (optional cache + health checks)
- Tailwind CSS + SCSS Modules

## What Is Included

- Payload admin at `/admin`
- Payload REST API mounted at `/api/*`
- Auth endpoints at `/api/auth/*` (login/register/me/logout)
- Protected dashboard routes:
  - `/dashboard`
  - `/posts`
  - `/media`
  - `/categories`
- Route protection via `src/middleware.ts`
- Dashboard shell with sidebar and list views for posts/media/categories
- Health endpoint at `/api/health` (Redis + Postgres smoke check)

## Project Layout

```text
src/
  app/
    (auth)/
      login/page.tsx
      register/page.tsx
    (dashboard)/
      layout.tsx
      dashboard/page.tsx
      posts/page.tsx
      media/page.tsx
      categories/page.tsx
    admin/[[...segments]]/
      layout.tsx
      page.tsx
    api/
      [...slug]/route.ts
      auth/{login,register,me,logout}/route.ts
      health/route.ts
  components/
    auth/
    dashboard/
    animations/
  lib/
    payload.ts
    db.ts
    redis.ts
  payload/
    payload.config.ts
    collections/
reference/
```

## Environment Variables

Copy `.env.example` to `.env` and set:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/your_database
POSTGRES_URL=postgresql://user:password@localhost:5432/your_database
REDIS_URL=redis://localhost:6379
PAYLOAD_SECRET=your-secret-at-least-32-characters
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NODE_ENV=development
```

Notes:
- `DATABASE_URL` is required for Payload and app DB access.
- `POSTGRES_URL` is used by Drizzle scripts.
- `REDIS_URL` is required by `src/lib/redis.ts` and `/api/health`.

## Local Development

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Open:
- App: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`
- Login: `http://localhost:3000/login`
- Register: `http://localhost:3000/register`
- Health: `http://localhost:3000/api/health`

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm type-check
pnpm format
pnpm db:generate
pnpm db:migrate
pnpm db:push
pnpm db:studio
```

## Auth and Access Model

- Users authenticate against Payload `users` collection.
- Login and register set an HTTP-only cookie: `payload-token`.
- `src/middleware.ts` redirects unauthenticated users from protected routes to `/login?next=...`.
- `src/app/(dashboard)/layout.tsx` performs server-side user verification via `/api/auth/me`.
- Collection-level access is defined in:
  - `src/payload/collections/Users.ts`
  - `src/payload/collections/Posts.ts`
  - `src/payload/collections/Categories.ts`
  - `src/payload/collections/Media.ts`

## Build and Runtime Notes

- `pnpm lint` and `pnpm type-check` should pass in a standard local environment.
- Build can run with Turbopack (default in Next 16) or Webpack.
- In restricted/sandboxed environments, build may fail due to blocked local process/network operations.
- Current Next warnings you may see:
  - `images.domains` is deprecated in favor of `images.remotePatterns`.
  - `middleware` convention is deprecated in favor of `proxy`.

## Documentation Map

- Setup: `reference/SETUP.md`
- Architecture: `reference/ARCHITECTURE.md`
- Build guide: `reference/BUILD_GUIDE.md`
- Deployment: `reference/DEPLOYMENT.md`
- Download instructions: `reference/DOWNLOAD_INSTRUCTIONS.md`
- Historical fix logs: `reference/FIX_REQUIRED.md`, `reference/STARTUP_FIX.md`
