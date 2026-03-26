import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../contexts/AuthContext'
import Navigation from '../components/ui/Navigation'

const outfit = Outfit({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Golf Charity Platform - Play for Purpose',
  description: 'Join our golf community, track your scores, win prizes, and support charities that matter to you.',
  keywords: 'golf, charity, scores, prizes, community, giving',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${outfit.className} min-h-screen`}>
        <AuthProvider>
          <Navigation />
          <main className="relative">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}