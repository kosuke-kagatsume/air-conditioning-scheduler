import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata = {
  title: '空調工事現場スケジューラー | HVAC Scheduler',
  description: 'Construction Site Scheduler for HVAC Projects',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}