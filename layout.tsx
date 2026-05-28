import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Artist Finder',
  description: 'Discover grants, residencies and open calls for visual artists across Europe.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
