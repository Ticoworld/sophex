import { Metadata } from 'next';
import SpinPageWrapper from '@/components/spin-game/SpinPageWrapper';

export const generateMetadata = (): Metadata => ({
  title: 'Spin to Win | SOPHEX - NFT Whitelist & Crypto Rewards',
  description:
    'Spin the wheel daily on SOPHEX for a chance to win NFT whitelist spots or earn crypto reward points. Join the Web3 revolution now!',
  openGraph: {
    title: 'Spin to Win | SOPHEX',
    description: 'Daily spins for NFT whitelist spots and crypto rewards on SOPHEX.',
    url: 'https://sophex-black.vercel.app/spin',
    images: ['/assets/nft2.png'],
  },
  twitter: {
    title: 'Spin to Win | SOPHEX',
    description: 'Spin daily for NFT whitelist spots on SOPHEX!',
    images: ['/assets/nft2.png'],
  },
});

export default function SpinPage() {
  return <SpinPageWrapper />;
}