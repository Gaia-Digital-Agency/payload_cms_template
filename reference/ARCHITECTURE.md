# Architecture

## Overview

This repository runs a Next.js 16 App Router application and Payload CMS in the same process. Payload provides admin UI, auth, and collection APIs, while custom Next routes/pages provide the user-facing app and dashboard.

## Runtime Topology

```text
Browser
  -> Next.js App Router pages
  -> Next.js route handlers (/api/auth/*, /api/health)
  -> Payload REST handler (/api/[...slug])
      -> Payload config + collections
      -> PostgreSQL
      -> Redis (optional usage + health check)
```

## Core Integration Points

- Payload config:
  - `src/payload/payload.config.ts`
- Payload REST route mounting:
  - `src/app/api/[...slug]/route.ts`
- Payload admin integration:
  - `src/app/admin/[[...segments]]/layout.tsx`
  - `src/app/admin/[[...segments]]/page.tsx`
- Payload client singleton:
  - `src/lib/payload.ts`

## Application Routing Model

- Public:
  - `/`
  - `/login`
  - `/register`
  - `/admin`
- Protected app routes:
  - `/dashboard`
  - `/posts`
  - `/media`
  - `/categories`

### Protection Layers

1. Edge route protection in `src/middleware.ts` checks for `payload-token` cookie.
2. Server layout protection in `src/app/(dashboard)/layout.tsx` calls `/api/auth/me` and redirects if user is missing.

## Authentication Flow

1. Client submits credentials to `POST /api/auth/login` or `POST /api/auth/register`.
2. Server calls Payload auth APIs and sets `payload-token` HTTP-only cookie.
3. Protected pages and APIs rely on that cookie.
4. `POST /api/auth/logout` clears the cookie.

Related files:
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/register/route.ts`
- `src/app/api/auth/me/route.ts`
- `src/app/api/auth/logout/route.ts`

## Content and Data Model

Collections:
- `users`
- `posts`
- `categories`
- `media`

Definitions live in:
- `src/payload/collections/Users.ts`
- `src/payload/collections/Posts.ts`
- `src/payload/collections/Categories.ts`
- `src/payload/collections/Media.ts`

Key behavior:
- Posts support drafts (`versions.drafts: true`).
- Public reads for posts are limited to published posts.
- Categories are admin-managed.
- Media uploads track `uploadedBy`.
- Users collection uses Payload auth and role field.

## Database and Cache

- Postgres client and Drizzle wrapper:
  - `src/lib/db.ts`
- Redis client and helper methods:
  - `src/lib/redis.ts`
- Health endpoint:
  - `src/app/api/health/route.ts`

`GET /api/health` checks both Redis ping and a simple Postgres query.

## Frontend Composition

- Server Components for data-heavy pages in `src/app/(dashboard)/*`.
- Client Components for interactive forms and sidebar:
  - `src/components/auth/LoginForm.tsx`
  - `src/components/auth/RegisterForm.tsx`
  - `src/components/dashboard/Sidebar.tsx`

Styling:
- Global styles and tokens: `src/app/globals.css`
- SCSS modules for component-specific styles.

## Operational Notes

- Next 16 warns that `middleware` file convention is moving to `proxy`.
- Next 16 warns that `images.domains` is deprecated in favor of `images.remotePatterns`.
- See `reference/BUILD_GUIDE.md` for build/debug details.
