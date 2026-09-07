import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

// Proměnné, ne jen `className` — `globals.css` (kopie z new-konstanta) na ně
// mapuje `--font-sans`, `--font-heading` i `--font-mono`, které konfigurátor používá.
const geist = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-geist" })
const geistMono = Geist_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: 'KHP - nabídka se slevou',
  description: 'Načtení poptávky z konfigurátoru, úprava hodnot a odeslání nabídky se slevou',
  generator: 'nextjs',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="cs" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
