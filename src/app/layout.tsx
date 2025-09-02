import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Yugioh Image Puzzle',
  description: 'A password-protected landing page using Yugioh card knowledge',
  robots: 'noindex, nofollow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        {children}
      </body>
    </html>
  )
}