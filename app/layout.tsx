import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}