import Link from 'next/link'
import { FadeIn } from '@/components/animations/FadeIn'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <FadeIn>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Next.js + Payload CMS
              <span className="block text-primary-600 mt-2">Starter Template</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              A production-ready full-stack starter featuring Next.js 15, 
              Payload CMS 3.0, PostgreSQL, Redis, and TypeScript.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/dashboard"
                className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold 
                         hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Go to Dashboard
              </Link>
              
              <Link
                href="/admin"
                className="px-8 py-3 bg-white text-primary-600 border-2 border-primary-600 
                         rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                Admin Panel
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <FeatureCard
                title="Full-Stack Ready"
                description="Next.js 15 with App Router, React 19, and TypeScript 5.6"
                icon="🚀"
              />
              <FeatureCard
                title="Powerful CMS"
                description="Payload CMS 3.0 with Lexical editor and JWT auth"
                icon="📝"
              />
              <FeatureCard
                title="Production-Ready"
                description="PostgreSQL, Redis caching, and Drizzle ORM"
                icon="⚡"
              />
            </div>

            <div className="mt-16 p-8 bg-white rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
              <div className="text-left max-w-2xl mx-auto space-y-3 text-gray-700">
                <p className="font-mono text-sm bg-gray-100 p-3 rounded">
                  1. cp .env.example .env
                </p>
                <p className="font-mono text-sm bg-gray-100 p-3 rounded">
                  2. pnpm install
                </p>
                <p className="font-mono text-sm bg-gray-100 p-3 rounded">
                  3. pnpm dev
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </main>
  )
}

function FeatureCard({ title, description, icon }: { 
  title: string
  description: string
  icon: string 
}) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
