import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import MobileNav from '@/components/MobileNav'

export const metadata = {
  title: 'Dandori Scheduler | 工事現場スケジューラー',
  description: 'Construction Site Scheduler - ダンドリスケジューラー',
  applicationName: 'Dandori Scheduler',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Dandori Scheduler',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'mobile-web-app-status-bar-style': 'default',
    'mobile-web-app-title': 'Dandori Scheduler'
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#ff6b6b',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
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