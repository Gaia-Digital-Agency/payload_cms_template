# Download / Getting Started

This folder is the project. Once you have it on disk (zip download or git clone), follow the setup instructions.

## What You Should See

Important top-level files:
- `.env.example` (copy to `.env`)
- `package.json` (scripts and dependencies)
- `next.config.js`
- `tailwind.config.ts`
- `drizzle.config.ts`
- `src/middleware.ts` (auth protection for dashboard routes)

Documentation:
- `reference/SETUP.md` (short setup)
- `reference/BUILD_GUIDE.md` (full, end-to-end walkthrough)
- `reference/ARCHITECTURE.md`
- `reference/DEPLOYMENT.md`
- `reference/FIX_REQUIRED.md`
- `reference/STARTUP_FIX.md` (repo-specific change log)

Key app entrypoints:
- `src/app/page.tsx` (home)
- `src/app/admin/[[...segments]]/*` (Payload admin UI)
- `src/app/api/[...slug]/route.ts` (Payload REST handler mounted at `/api/*`)
- `src/payload/payload.config.ts` (Payload config and collections)

## Quick Start

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Then open:
- http://localhost:3000/admin (create first user)
- http://localhost:3000/login (site login)
- http://localhost:3000/dashboard (protected dashboard)

Optional service check:
- http://localhost:3000/api/health
