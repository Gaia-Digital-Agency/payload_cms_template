# Download Instructions

If you have this repository on disk (zip or git clone), use this quick bootstrap path.

## 1. Install

```bash
pnpm install
```

## 2. Configure env

```bash
cp .env.example .env
```

Set required values in `.env`:
- `DATABASE_URL`
- `POSTGRES_URL`
- `REDIS_URL`
- `PAYLOAD_SECRET`
- `PAYLOAD_PUBLIC_SERVER_URL`
- `NEXT_PUBLIC_SERVER_URL`

## 3. Run

```bash
pnpm dev
```

## 4. First-run URLs

- Home: `http://localhost:3000/`
- Admin: `http://localhost:3000/admin`
- Login: `http://localhost:3000/login`
- Register: `http://localhost:3000/register`
- Health: `http://localhost:3000/api/health`

## 5. Create first user

Open `/admin` and complete the first-user flow.

## Documentation Index

- `README.md`
- `reference/SETUP.md`
- `reference/ARCHITECTURE.md`
- `reference/BUILD_GUIDE.md`
- `reference/DEPLOYMENT.md`
- `reference/STARTUP_FIX.md`
- `reference/FIX_REQUIRED.md`
