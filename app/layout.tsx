import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import MobileNav from '@/components/MobileNav'

export const metadata = {
  title: 'Dandori Scheduler | 工事現場スケジューラー',
  description: 'Construction Site Scheduler - ダンドリスケジューラー',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Dandori Scheduler',
  },
  themeColor: '#ff6b6b',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>
        <AuthProvider>
          {children}
          <MobileNav />
        </AuthProvider>
      </body>
    </html>
  )
}