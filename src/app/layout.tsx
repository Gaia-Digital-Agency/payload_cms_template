import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Next.js + Payload CMS Starter',
    template: '%s | Next.js Starter',
  },
  description: 'A production-ready Next.js 15 and Payload CMS 3.0 starter template',
  keywords: ['Next.js', 'Payload CMS', 'TypeScript', 'React', 'Starter Template'],
  authors: [{ name: 'Roger', url: 'https://net1io.com' }],
  creator: 'Roger',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SERVER_URL,
    siteName: 'Next.js Starter',
    title: 'Next.js + Payload CMS Starter',
    description: 'A production-ready starter template',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js + Payload CMS Starter',
    description: 'A production-ready starter template',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}
