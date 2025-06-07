import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ModalProvider } from '@/context/ModalContext';
import WaitlistModalWrapper from '@/components/ui/WaitlistModalWrapper';
import Script from 'next/script';
import ParticlesWrapper from '@/components/ui/ParticlesWrapper';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  fallback: ['Arial', 'Helvetica', 'sans-serif'],
});
export const metadata: Metadata = {
  title: 'SOPHEX - Web3 Made Invisible | Crypto Rewards Platform',
  description:
    'Join SOPHEX to earn XP through quests, convert crypto to fiat in one click, and win NFT whitelist spots. Web3 made simple for everyone.',
  keywords: [
    'Web3 platform',
    'crypto rewards',
    'NFT whitelist',
    'SOPHEX',
    'convert crypto to fiat',
    'sophexonsophon',
    'sophon nft',
    'sophex nft'
  ],
  openGraph: {
    title: 'SOPHEX - Web3 Made Invisible',
    description:
      'Earn XP, convert crypto to fiat, and join the SOPHEX Web3 revolution with NFT whitelist opportunities.',
    url: 'https://sophex-black.vercel.app',
    images: [
      {
        url: '/assets/nft2.png',
        width: 1200,
        height: 630,
        alt: 'SOPHEX: Web3 Made Invisible - Crypto Rewards and NFT Whitelist',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ShophexOnSophon',
    creator: '@ShophexOnSophon',
    title: 'SOPHEX - Web3 Made Invisible',
    description:
      'Earn XP, convert crypto to fiat, and spin for NFT whitelist spots with SOPHEX.',
    images: ['/assets/nft2.png'],
  },
  alternates: {
    canonical: 'https://sophex-black.vercel.app',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/assets/nft2.png" sizes="any" />
        <link rel="icon" href="/assets/nft2.png" type="image/png" />
        <link rel="apple-touch-icon" href="/assets/nft2.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${inter.className} bg-neutral-900 text-white min-h-screen`}>
        <ModalProvider>
          <ParticlesWrapper />
          {children}
          <WaitlistModalWrapper />
        </ModalProvider>
        <Script
          src="https://platform.twitter.com/widgets.js"
          strategy="lazyOnload"
          charSet="utf-8"
        />
      </body>
    </html>
  );
}