# Fix Required (Template Gaps)

This file tracks the original starter-template gaps that needed addressing.

Status: **Resolved** (see `reference/STARTUP_FIX.md` and `reference/BUILD_GUIDE.md`).

## 1) Links to routes that didn’t exist yet (404s)

- [x] `/login` linked to `/register`, but no register route existed.
  - Fixed by adding:
    - `src/app/(auth)/register/page.tsx`
    - `src/components/auth/RegisterForm.tsx`
    - `src/app/api/auth/register/route.ts`
- [x] Sidebar linked to `/posts`, `/media`, `/categories`, but pages didn’t exist.
  - Fixed by adding:
    - `src/app/(dashboard)/posts/page.tsx`
    - `src/app/(dashboard)/media/page.tsx`
    - `src/app/(dashboard)/categories/page.tsx`

## 2) Drizzle migrations not wired up

- [x] `drizzle.config.ts` referenced `src/lib/db/schema.ts`, but it was missing.
  - Fixed by adding `src/lib/db/schema.ts` (minimal schema to keep Drizzle runnable).
  - Also updated `drizzle.config.ts` to load `.env` without requiring the `dotenv` package.

## 3) Redis present but unused (hard to validate)

- [x] Redis helper existed, but nothing exercised it.
  - Fixed by adding `src/app/api/health/route.ts` which pings Redis (and Postgres).

## 4) Docs referenced middleware, but none existed

- [x] Added route-level protection via `middleware.ts`.
  - Implemented as `src/middleware.ts`.
  - Protects: `/dashboard/*`, `/posts/*`, `/media/*`, `/categories/*`
  - Redirects unauthenticated users to `/login?next=...`
