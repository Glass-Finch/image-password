import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Image Knowledge Challenge',
  description: 'A password-protected landing page using image-based knowledge authentication',
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