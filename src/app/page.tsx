
import Hero        from '@/components/sections/Hero';
import ValueProp   from '@/components/sections/ValueProp';
import NFTShowcase from '@/components/sections/NFTShowcase';
import Workflow    from '@/components/sections/Workflow';
import SpinSection from '@/components/sections/SpinSection';
import CTA         from '@/components/sections/CTA';
import Footer      from '@/components/layout/Footer';
import Navbar      from '@/components/navigation/Navbar';
import type { Metadata } from 'next';

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

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <ValueProp />
      <NFTShowcase />
      <Workflow />
      <SpinSection />
      <CTA />
      <Footer />
    </main>
  );
}
