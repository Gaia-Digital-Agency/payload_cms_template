# Next.js 15 + Payload CMS 3.0 Starter Template

A production-ready, full-stack starter template featuring Next.js 15, Payload CMS 3.0, PostgreSQL, Redis, and TypeScript.

## 🚀 Features

- **Frontend Stack**
  - Next.js 15 with App Router
  - React 19 (Server & Client Components)
  - TypeScript 5.6
  - Tailwind CSS + SCSS Modules
  - Framer Motion animations

- **Backend & CMS**
  - Payload CMS 3.0 (Headless CMS)
  - Lexical Rich Text Editor
  - JWT Authentication
  - Next.js API Routes

- **Database & Cache**
  - PostgreSQL 15 with Drizzle ORM
  - Redis 7 for caching
  - Type-safe database queries

- **Collections**
  - Users (with authentication)
  - Media (image CRUD operations)
  - Posts (blog posts with rich text)
  - Categories (taxonomy)

## 📋 Prerequisites

- Node.js 18.17 or later
- PostgreSQL 15+
- Redis 7+
- pnpm (recommended) or npm

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/nextjs-payload-starter.git
cd nextjs-payload-starter
```

### 2. Install dependencies

```bash
pnpm install
# or
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/your_database
POSTGRES_URL=postgresql://user:password@localhost:5432/your_database

# Redis
REDIS_URL=redis://localhost:6379

# Payload
PAYLOAD_SECRET=your-super-secret-key-min-32-chars
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000

# Next.js
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Set up the database

```bash
# (Optional) If you want to use Drizzle migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# Note: Payload itself uses `DATABASE_URL` for its tables via the Postgres adapter.
```

### 5. Start the development server

```bash
pnpm dev
```

Visit:
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register

### 6. Create your first admin user

Navigate to http://localhost:3000/admin and create an admin account.

## 📂 Project Structure

```
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components with SCSS modules
│   ├── payload/          # Payload CMS configuration
│   │   ├── collections/  # Data models
│   │   ├── access/       # Access control
│   │   └── hooks/        # Lifecycle hooks
│   ├── lib/              # Utilities and configurations
│   └── styles/           # Global SCSS variables and mixins
├── public/               # Static assets
└── reference/            # Documentation
```

## 🔧 Available Scripts

```bash
# Development
pnpm dev                  # Start dev server
pnpm build                # Build for production
pnpm start                # Start production server

# Database
pnpm db:generate          # Generate migrations
pnpm db:migrate           # Run migrations
pnpm db:push              # Push schema changes
pnpm db:studio            # Open Drizzle Studio

# Code Quality
pnpm lint                 # Run ESLint (first run may prompt to set up ESLint config)
pnpm format               # Format with Prettier
pnpm type-check           # TypeScript type checking
```

## 🎯 Key Features

### Authentication
- JWT-based authentication via Payload
- Protected routes and API endpoints
- Role-based access control (Admin, User)
- Route-level protection via `src/middleware.ts` for `/dashboard/*`, `/posts/*`, `/media/*`, `/categories/*`

### Media Management
- Upload images with drag & drop
- Automatic image optimization
- Cloud storage ready (S3 compatible)

### Content Management
- Rich text editing with Lexical
- Draft/Publish workflow
- Automatic slug generation
- SEO-friendly metadata

### Performance
- Redis client and helpers included (use as needed)
- Static page generation where possible
- Optimized images with Next.js Image
- Code splitting and lazy loading

## 🎨 Styling

This template uses a hybrid approach:
- **Tailwind CSS**: Utility-first styling for rapid development
- **SCSS Modules**: Component-scoped styles for complex components
- **CSS Variables**: Theme customization in `styles/variables.scss`

## 🔐 Access Control

Default access patterns:
- **Public**: Can read published posts
- **Authenticated**: Can manage their own content
- **Admin**: Full CRUD access to all collections

Customize in `src/payload/access/`

## 📦 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker

```bash
docker-compose up -d
```

See `reference/DEPLOYMENT.md` for detailed deployment guides.

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│           Next.js 15 App Router          │
│  ┌─────────────┐      ┌──────────────┐  │
│  │   Frontend  │◄────►│  API Routes  │  │
│  │  (RSC + CC) │      │              │  │
│  └─────────────┘      └──────┬───────┘  │
└────────────────────────────────┼─────────┘
                                 │
                    ┌────────────▼──────────┐
                    │   Payload CMS 3.0     │
                    │  ┌─────────────────┐  │
                    │  │  Collections    │  │
                    │  │  • Users        │  │
                    │  │  • Media        │  │
                    │  │  • Posts        │  │
                    │  │  • Categories   │  │
                    │  └─────────────────┘  │
                    └────────┬───────┬──────┘
                             │       │
                    ┌────────▼───┐ ┌─▼──────┐
                    │ PostgreSQL │ │ Redis  │
                    │ (Drizzle)  │ │ Cache  │
                    └────────────┘ └────────┘
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- Documentation: `/reference`
- Issues: GitHub Issues
- Discussions: GitHub Discussions

## 🙏 Acknowledgments

- Next.js Team
- Payload CMS Team
- Vercel

---

**Built with ❤️ by Roger | net1io.com**
