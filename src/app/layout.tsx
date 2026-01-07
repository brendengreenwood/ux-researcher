import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ToasterProvider } from '@/components/toaster-provider'

export const metadata: Metadata = {
  title: 'UX Researcher',
  description: 'AI-powered UX research interview tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex h-14 items-center">
              <Link href="/" className="mr-6 flex items-center space-x-2">
                <span className="font-bold">UX Researcher</span>
              </Link>
              <nav className="flex items-center space-x-6 text-sm font-medium">
                <Link href="/" className="text-foreground/60 transition-colors hover:text-foreground">
                  Projects
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </div>
          </main>
        </div>
        <ToasterProvider />
      </body>
    </html>
  )
}
