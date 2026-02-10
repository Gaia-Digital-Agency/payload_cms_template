import { Sidebar } from '@/components/dashboard/Sidebar'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

async function getUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')

  if (!token) {
    return null
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/me`, {
      headers: {
        Cookie: `payload-token=${token.value}`,
      },
    })

    if (!res.ok) return null

    const data = await res.json()
    return data.user
  } catch (error) {
    return null
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
