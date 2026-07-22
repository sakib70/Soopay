import type { Metadata, Viewport } from 'next'
import { Inter, Pixelify_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { Providers } from '@/components/providers'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const pixelify = Pixelify_Sans({ 
  subsets: ['latin'],
  variable: '--font-pixel',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'SOOPAY - Pay globally, think locally',
  description: 'Stablecoin payment interface built on Arc Testnet. Send USDC while thinking in local currencies like BDT, INR, PKR, IDR, CNY, and VND.',
  keywords: ['crypto', 'payments', 'USDC', 'stablecoin', 'Web3', 'Arc Testnet'],
}

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${pixelify.variable} bg-background`}>
      <body className="font-sans antialiased overflow-hidden">
        <Providers>
          {children}
          <Toaster 
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#0a0a0a',
                border: '1px solid #262626',
                color: '#e5e5e5',
                fontFamily: 'var(--font-inter)',
              },
            }}
          />
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
