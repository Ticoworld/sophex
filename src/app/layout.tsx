import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ParticlesContainer from '@/components/ui/ParticlesContainer'
import { ModalProvider } from '@/context/ModalContext'
import WaitlistModalWrapper from '@/components/ui/WaitlistModalWrapper'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SOPHEX - Web3 Made Invisible',
  description: 'Earn XP, Convert Crypto to Fiat in One Click',
  openGraph: {
    title: 'SOPHEX - Web3 Made Invisible',
    description: 'Earn XP, Convert Crypto to Fiat in One Click',
    images: [
      {
        url: '/sophex-og.png',
        width: 1200,
        height: 630,
        alt: 'Sophex: Web3 Made Invisible',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ShophexOnSophon',
    creator: '@ShophexOnSophon',
    title: 'SOPHEX - Web3 Made Invisible',
    description: 'Earn XP, Convert Crypto to Fiat in One Click',
    images: ['/sophex-twitter-card.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Twitter Widgets API */}
        <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
      </head>
      <body className={`${inter.className} bg-neutral-900 text-white min-h-screen`}>
        <ModalProvider>
          <ParticlesContainer />
          {children}
          <WaitlistModalWrapper />
        </ModalProvider>
      </body>
    </html>
  )
}