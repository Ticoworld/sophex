import SpinPageWrapper from '@/components/spin-game/SpinPageWrapper';
import { Metadata } from 'next';
import Link from 'next/link';

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
    // return <SpinPageWrapper />;
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-6 p-4">
      <h2 className="text-2xl font-bold text-center">
        Our site is currently under maintenance.
      </h2>
      <p className="text-lg text-center">
        Please check back later.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
      >
        Go to Home
      </Link>
    </div>
  );
}
 