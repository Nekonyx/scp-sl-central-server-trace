import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['cyrillic']
})

export const metadata: Metadata = {
  title: 'Доступность центральных серверов SCP:SL',
  description: 'Проверка доступности центральных серверов игры SCP:SL в России'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className={`dark antialiased ${inter.variable}`} lang="ru">
      <head>
        {process.env.NODE_ENV === 'development' && (
          <script crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js" />
        )}
      </head>
      <body>{children}</body>
    </html>
  )
}
