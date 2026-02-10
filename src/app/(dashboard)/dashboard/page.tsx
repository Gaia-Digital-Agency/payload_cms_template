import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'

async function getStats() {
  const payload = await getPayloadClient()

  const [posts, media, categories] = await Promise.all([
    payload.find({ collection: 'posts', limit: 0 }),
    payload.find({ collection: 'media', limit: 0 }),
    payload.find({ collection: 'categories', limit: 0 }),
  ])

  return {
    posts: posts.totalDocs,
    media: media.totalDocs,
    categories: categories.totalDocs,
  }
}

export default async function DashboardPage() {
  const stats = await getStats()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your content management dashboard</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Posts"
          value={stats.posts}
          icon="📝"
          href="/posts"
          color="blue"
        />
        <StatCard
          title="Media Files"
          value={stats.media}
          icon="🖼️"
          href="/media"
          color="purple"
        />
        <StatCard
          title="Categories"
          value={stats.categories}
          icon="📁"
          href="/categories"
          color="green"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <QuickAction
          title="Create New Post"
          description="Write and publish a new blog post"
          href="/admin/collections/posts/create"
          icon="✍️"
        />
        <QuickAction
          title="Upload Media"
          description="Add images and files to your library"
          href="/admin/collections/media"
          icon="📤"
        />
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  href,
  color,
}: {
  title: string
  value: number
  icon: string
  href: string
  color: 'blue' | 'purple' | 'green'
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
  }

  return (
    <Link
      href={href}
      className="block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
      </div>
      <div className="text-gray-600 font-medium">{title}</div>
    </Link>
  )
}

function QuickAction({
  title,
  description,
  href,
  icon,
}: {
  title: string
  description: string
  href: string
  icon: string
}) {
  return (
    <Link
      href={href}
      className="block p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-primary-500 transition-colors"
    >
      <div className="flex items-start gap-4">
        <div className="text-3xl">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  )
}
