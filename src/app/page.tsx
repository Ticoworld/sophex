import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const generateMetadata = (): Metadata => ({
  title: 'SOPHEX - Web3 Made Invisible | Earn Crypto Rewards',
  description:
    'Discover SOPHEX, the Web3 platform where you earn XP through quests, convert crypto to fiat in one click, and spin for NFT whitelist spots.',
  openGraph: {
    title: 'SOPHEX - Web3 Made Invisible',
    description:
      'Join SOPHEX to earn crypto rewards and win NFT whitelist spots through daily spins.',
    url: 'https://sophex-black.vercel.app',
    images: ['/assets/nft2.png'],
  },
  twitter: {
    title: 'SOPHEX - Web3 Made Invisible',
    description: 'Earn XP and spin for NFT whitelist spots with SOPHEX.',
    images: ['/assets/nft2.png'],
  },
});

const LandingPageClient = dynamic(() => import('./LandingPageClient'), { ssr: false });

export default function Home() {
  return <LandingPageClient />;
}