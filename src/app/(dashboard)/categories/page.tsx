import Link from 'next/link'
import { cookies } from 'next/headers'

async function getCategories() {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_SERVER_URL is not defined')
  }

  const res = await fetch(`${baseUrl}/api/categories?limit=50&sort=name`, {
    headers: token ? { Cookie: `payload-token=${token.value}` } : {},
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to load categories: ${res.status} ${text}`)
  }

  return res.json()
}

export default async function CategoriesPage() {
  const data = await getCategories()
  const docs = Array.isArray(data?.docs) ? data.docs : []

  return (
    <div>
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
          <p className="text-gray-600">Taxonomy used for posts</p>
        </div>
        <Link
          href="/admin/collections/categories"
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          Manage in Admin
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-semibold text-gray-600 bg-gray-50 border-b border-gray-200">
          <div className="col-span-6">Name</div>
          <div className="col-span-6">Slug</div>
        </div>
        <div className="divide-y divide-gray-100">
          {docs.length === 0 ? (
            <div className="px-6 py-10 text-gray-600">No categories found.</div>
          ) : (
            docs.map((doc: any) => (
              <div key={doc.id} className="grid grid-cols-12 gap-4 px-6 py-4">
                <div className="col-span-6 font-medium text-gray-900">
                  {doc.name}
                </div>
                <div className="col-span-6 text-gray-700">{doc.slug}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

