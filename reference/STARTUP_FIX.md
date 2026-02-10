# Startup Fixes (Template Gaps 1-4)

This file documents the changes made to address the previously identified template gaps:

## 1) Missing `/register` Route

Problem:
- `/login` linked to `/register`, but no register page existed.

Fix:
- Added register page + form + API route.

Files:
- `src/app/(auth)/register/page.tsx`
- `src/components/auth/RegisterForm.tsx`
- `src/components/auth/RegisterForm.module.scss`
- `src/app/api/auth/register/route.ts`

Behavior:
- Register form posts to `/api/auth/register`.
- Server creates a Payload `users` record and then logs in to set the HTTP-only `payload-token` cookie.
- Redirects to `/dashboard`.

## 2) Sidebar Links to `/posts`, `/media`, `/categories` 404

Problem:
- Sidebar linked to `/posts`, `/media`, `/categories` but these routes did not exist.

Fix:
- Added simple protected dashboard pages that list recent docs via Payload REST API.

Files:
- `src/app/(dashboard)/posts/page.tsx`
- `src/app/(dashboard)/media/page.tsx`
- `src/app/(dashboard)/categories/page.tsx`

Notes:
- These pages forward the `payload-token` cookie to the local Payload REST endpoints under `/api/*`.
- The "Create New Post" / "Upload Media" actions on the dashboard now send users to Payload Admin create/pages instead of non-existent custom routes:
  - `src/app/(dashboard)/dashboard/page.tsx`

## 3) Redis Code Existed But Was Unused

Problem:
- `src/lib/redis.ts` existed but nothing exercised it, making it hard to confirm Redis wiring.

Fix:
- Added a simple health endpoint that pings Redis and Postgres.

Files:
- `src/app/api/health/route.ts`

Test:
- Visit `GET /api/health` (expects `redis.ok=true` and `postgres.ok=true` when configured correctly).

## 4) Docs Mentioned Middleware Auth, But None Existed

Problem:
- The docs referenced middleware-style auth, but there was no `middleware.ts`.

Fix:
- Added `src/middleware.ts` that protects:
  - `/dashboard/*`
  - `/posts/*`
  - `/media/*`
  - `/categories/*`

Files:
- `src/middleware.ts`

Behavior:
- If `payload-token` cookie is missing, redirects to `/login?next=<path>`.

## Drizzle Script Gap (Make `pnpm db:*` Usable)

Problem:
- `drizzle.config.ts` referenced `src/lib/db/schema.ts`, but it did not exist.

Fix:
- Added `src/lib/db/schema.ts` with a minimal `app_settings` table so Drizzle migrations can run.

Files:
- `src/lib/db/schema.ts`

## Running Locally

1. Ensure `.env` is set (`DATABASE_URL`, `REDIS_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`).
2. Start:
   - `pnpm dev`

If `pnpm dev` fails with a permissions error binding port 3000:
- Run with a different port:
  - `PORT=3001 pnpm dev`
- Update these in `.env` to match:
  - `NEXT_PUBLIC_SERVER_URL`
  - `PAYLOAD_PUBLIC_SERVER_URL`

## Note: Offline Builds

This template no longer uses `next/font/google` in `src/app/layout.tsx`, so `pnpm build` does not need to fetch Google Fonts.

