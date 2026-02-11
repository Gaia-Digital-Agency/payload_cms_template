# Build Guide

This guide covers local and CI build behavior for the current Next.js 16 + Payload architecture.

## Preconditions

- Dependencies installed: `pnpm install`
- Env configured: `.env`
- Postgres and Redis reachable if your build path executes server-side data access

## Standard Quality Checks

```bash
pnpm lint
pnpm type-check
```

## Build Commands

Default build (Turbopack in Next 16):

```bash
pnpm build
```

Webpack fallback build path:

```bash
pnpm exec next build --webpack
```

Use the Webpack path when diagnosing Turbopack-specific failures.

## Why Builds May Touch Data Services

This app has server-rendered routes and route handlers that initialize Payload/DB paths. During optimization or data collection phases, build/runtime checks can require:
- Postgres connectivity (`DATABASE_URL`)
- Redis connectivity (`REDIS_URL`) for endpoints that import Redis paths

If services are not reachable, build can fail or log runtime errors.

## Expected Warnings (Current Code)

You may currently see:

- `images.domains` deprecation warning in Next 16 (prefer `images.remotePatterns` only).
- `middleware` convention deprecation warning (Next suggests `proxy`).

These warnings do not always block build, but they should be addressed in future cleanup.

## CI Recommendations

1. Keep `pnpm lint` and `pnpm type-check` as mandatory checks.
2. Run `pnpm build` in an environment with network/process permissions and required env vars.
3. Provide service dependencies in CI (managed Postgres/Redis or service containers).
4. For reproducibility, pin Node and pnpm versions in CI.

## Diagnostic Commands

```bash
node -v
pnpm -v
pnpm lint
pnpm type-check
pnpm build
pnpm exec next build --webpack
```

## Build Output Review Checklist

- App routes generated for:
  - `/`
  - `/login`
  - `/register`
  - `/dashboard`
  - `/posts`
  - `/media`
  - `/categories`
  - `/admin/[[...segments]]`
- API routes generated for:
  - `/api/[...slug]`
  - `/api/auth/login`
  - `/api/auth/register`
  - `/api/auth/me`
  - `/api/auth/logout`
  - `/api/health`
