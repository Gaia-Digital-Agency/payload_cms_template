import Link from 'next/link'
import { cookies } from 'next/headers'

async function getPosts() {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_SERVER_URL is not defined')
  }

  const res = await fetch(`${baseUrl}/api/posts?limit=20&sort=-createdAt`, {
    headers: token ? { Cookie: `payload-token=${token.value}` } : {},
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to load posts: ${res.status} ${text}`)
  }

  return res.json()
}

export default async function PostsPage() {
  const data = await getPosts()
  const docs = Array.isArray(data?.docs) ? data.docs : []

  return (
    <div>
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Posts</h1>
          <p className="text-gray-600">Recent posts from Payload</p>
        </div>
        <Link
          href="/admin/collections/posts"
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          Manage in Admin
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-semibold text-gray-600 bg-gray-50 border-b border-gray-200">
          <div className="col-span-6">Title</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-4">Created</div>
        </div>
        <div className="divide-y divide-gray-100">
          {docs.length === 0 ? (
            <div className="px-6 py-10 text-gray-600">No posts found.</div>
          ) : (
            docs.map((doc: any) => (
              <div key={doc.id} className="grid grid-cols-12 gap-4 px-6 py-4">
                <div className="col-span-6 font-medium text-gray-900">
                  {doc.title}
                </div>
                <div className="col-span-2 text-gray-700">{doc._status}</div>
                <div className="col-span-4 text-gray-700">
                  {doc.createdAt ? new Date(doc.createdAt).toLocaleString() : ''}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

