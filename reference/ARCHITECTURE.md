# Architecture Documentation

## Overview

This starter template follows a modern, full-stack architecture leveraging Next.js 15's App Router with Payload CMS 3.0 as a headless CMS. The application is built with TypeScript for type safety and uses PostgreSQL for data persistence with Redis for caching.

## Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **React 19**: UI library with Server and Client Components
- **TypeScript 5.6**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **SCSS Modules**: Component-scoped styling
- **Framer Motion**: Animation library

### Backend
- **Payload CMS 3.0**: Headless CMS
- **Next.js API Routes**: Serverless functions
- **Lexical Editor**: Rich text editing

### Database & Cache
- **PostgreSQL 15**: Primary database
- **Drizzle ORM**: Type-safe SQL query builder
- **Redis 7**: Caching layer

### Authentication
- **JWT**: Token-based authentication
- **HTTP-only Cookies**: Secure token storage

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API routes
│   └── admin/             # Payload admin panel
│
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── common/           # Shared components
│   ├── dashboard/        # Dashboard components
│   └── animations/       # Animation components
│
├── payload/              # Payload CMS configuration
│   ├── collections/     # Data models
│   ├── access/          # Access control
│   └── hooks/           # Lifecycle hooks
│
├── lib/                 # Utilities
│   ├── payload.ts      # Payload client
│   ├── redis.ts        # Redis client
│   ├── db.ts           # Database client
│   └── utils.ts        # Helper functions
│
├── types/              # TypeScript definitions
└── styles/             # Global styles
```

## Data Flow

### Authentication Flow

```
┌─────────┐         ┌──────────────┐         ┌─────────┐
│ Client  │────────▶│ /api/auth/*  │────────▶│ Payload │
│         │◀────────│              │◀────────│   CMS   │
└─────────┘         └──────────────┘         └─────────┘
     │                     │
     │                     ▼
     │              Set HTTP-only
     │                 Cookie
     │
     ▼
Protected Routes
```

Relevant routes:
- `POST /api/auth/login` sets `payload-token` (HTTP-only cookie)
- `GET /api/auth/me` returns the current user (if cookie is valid)
- `POST /api/auth/logout` clears the cookie
- `POST /api/auth/register` creates a user and logs them in

How protection works:
- `src/middleware.ts` redirects unauthenticated users away from protected routes.
- `src/app/(dashboard)/layout.tsx` also verifies the user via `/api/auth/me` and redirects to `/login` if missing.

### Content Management Flow

```
┌─────────┐         ┌──────────────┐         ┌──────────┐
│  Admin  │────────▶│    Payload   │────────▶│   CRUD   │
│  Panel  │         │    Admin     │         │Operations│
└─────────┘         └──────────────┘         └────┬─────┘
                                                   │
                                                   ▼
                                            ┌──────────┐
                                            │PostgreSQL│
                                            └──────────┘
```

Admin integration details:
- The admin UI is rendered by `src/app/admin/[[...segments]]/page.tsx`.
- Admin UI interactivity relies on Payload "server functions" wired in `src/app/admin/[[...segments]]/layout.tsx`
  via `@payloadcms/next/layouts` (`RootLayout`) and `handleServerFunctions`.

### Caching Strategy

Redis is configured in `src/lib/redis.ts` and can be used for caching, but caching is not enforced globally by default.

Validation / smoke test:
- `GET /api/health` pings Redis and Postgres.

## Component Patterns

### Server Components (Default)

Used for:
- Data fetching
- SEO-critical content
- Static pages

```tsx
// Example server component page
export default async function PostsPage() {
  const posts = await getPosts() // Server-side
  return <PostList posts={posts} />
}
```

### Client Components

Used for:
- Interactivity
- State management
- Browser APIs

```tsx
'use client'

export function LoginForm() {
  const [email, setEmail] = useState('')
  // ... interactive logic
}
```

### Hybrid Pattern

Combine both for optimal performance:

```tsx
// Server Component (default)
export default async function Page() {
  const data = await fetchData()
  return <ClientInteractive data={data} />
}

// Client Component
'use client'
function ClientInteractive({ data }) {
  // Interactive features
}
```

## Styling Architecture

### Tailwind for Utility

```tsx
<div className="flex items-center gap-4 p-6 bg-white rounded-lg">
  <h1 className="text-2xl font-bold">Title</h1>
</div>
```

### SCSS Modules for Complex Components

```scss
// Component.module.scss
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  
  .card {
    &:hover {
      transform: translateY(-2px);
    }
  }
}
```

### CSS Variables for Theming

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --background: 0 0% 100%;
}
```

## Database Schema

### Users Collection
- id (UUID)
- email (unique)
- password (hashed)
- name
- roles (array)
- avatar (relation to Media)
- timestamps

### Media Collection
- id (UUID)
- filename
- mimeType
- filesize
- width, height
- alt, caption
- uploadedBy (relation to Users)
- timestamps

### Posts Collection
- id (UUID)
- title (unique)
- slug (unique)
- author (relation to Users)
- category (relation to Categories)
- featuredImage (relation to Media)
- content (rich text)
- status (draft/published)
- seo metadata
- timestamps

### Categories Collection
- id (UUID)
- name (unique)
- slug (unique)
- description
- color
- parent (self-relation)
- timestamps

## API Routes

### REST API

Payload provides automatic REST endpoints:

```
GET    /api/posts          # List posts
GET    /api/posts/:id      # Get post
POST   /api/posts          # Create post
PATCH  /api/posts/:id      # Update post
DELETE /api/posts/:id      # Delete post
```

How it's mounted:
- `src/app/api/[...slug]/route.ts` binds the Payload REST handler (via `@payloadcms/next/routes`) under `/api/*`.

### Custom API Routes

This repo includes custom routes:
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/me/route.ts`
- `src/app/api/auth/logout/route.ts`
- `src/app/api/auth/register/route.ts`
- `src/app/api/health/route.ts`

## Notes On Drizzle

- Drizzle is optional in this starter.
- A minimal schema exists at `src/lib/db/schema.ts` so `pnpm db:*` commands have a schema entrypoint.
```
POST   /api/auth/login     # Login
POST   /api/auth/logout    # Logout
GET    /api/auth/me        # Get current user
```

## Access Control

### Roles
- **admin**: Full access to all collections
- **editor**: Can manage content
- **user**: Limited to own content

### Access Patterns

```typescript
// Read access
read: ({ req: { user } }) => {
  if (!user) return { _status: { equals: 'published' } }
  if (user.roles?.includes('admin')) return true
  return {
    or: [
      { _status: { equals: 'published' } },
      { author: { equals: user.id } }
    ]
  }
}
```

## Performance Optimizations

### Image Optimization
- Automatic WebP/AVIF conversion
- Multiple size variants
- Lazy loading
- Next.js Image component

### Caching Layers
1. **Browser**: Static assets
2. **CDN**: Media files
3. **Redis**: API responses
4. **ISR**: Static pages with revalidation

### Code Splitting
- Automatic route-based splitting
- Dynamic imports for heavy components
- Lazy loading for below-fold content

## Security

### Authentication
- JWT tokens in HTTP-only cookies
- CSRF protection
- Rate limiting on auth endpoints
- Password hashing with bcrypt

### Access Control
- Role-based access control (RBAC)
- Field-level permissions
- API route protection
- Admin-only operations

### Data Validation
- TypeScript compile-time checks
- Payload schema validation
- Zod runtime validation
- SQL injection prevention (Drizzle)

## Deployment Architecture

```
┌──────────────┐
│    Vercel    │
│  (Next.js)   │
└──────┬───────┘
       │
       ├──────────────┬──────────────┐
       │              │              │
┌──────▼───────┐ ┌───▼────┐  ┌──────▼──────┐
│  Supabase    │ │ Redis  │  │   Vercel    │
│ (PostgreSQL) │ │ Cloud  │  │    Blob     │
└──────────────┘ └────────┘  └─────────────┘
```

### Production Services
- **Vercel**: Frontend & API hosting
- **Supabase/Neon**: Managed PostgreSQL
- **Upstash**: Managed Redis
- **Vercel Blob**: Media storage

## Monitoring

### Recommended Tools
- **Sentry**: Error tracking
- **Vercel Analytics**: Performance monitoring
- **LogTail**: Log aggregation
- **PostgreSQL**: Query performance

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Redis for session management
- CDN for static assets
- Database connection pooling

### Vertical Scaling
- Database indexing
- Query optimization
- Caching strategy
- Image optimization

## Development Best Practices

1. **Type Safety**: Use TypeScript everywhere
2. **Server First**: Prefer Server Components
3. **Cache Wisely**: Cache frequently accessed data
4. **Optimize Images**: Use Next.js Image
5. **Test**: Unit, integration, and E2E tests
6. **Monitor**: Track errors and performance
7. **Document**: Keep docs up to date

## Future Enhancements

Potential additions to consider:
- GraphQL API
- Real-time updates (WebSockets)
- Full-text search (Algolia/Meilisearch)
- Email service integration
- Analytics dashboard
- Multi-language support
- Dark mode theme
- PWA capabilities
