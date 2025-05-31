'use client';
import { motion } from 'framer-motion';
import { FaRocket, FaChartLine } from 'react-icons/fa';
import RotatingNFT from '../ui/RotatingNFT'; // Assuming this path is correct
import { useModal } from '@/context/ModalContext'; // Assuming this path is correct
import Image from 'next/image';

export default function Hero() {
  const { openWaitlist } = useModal();

  // Array of image paths for the "NFTs minted" section
  const nftMintedImages = [
    '/assets/nft.jpg',
    '/assets/nft1.jpg',
    '/assets/nft2.jpg',
    '/assets/nft3.jpg', // Assuming you have a fourth image
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradients / floating elements (unchanged) */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-orange-900/10 opacity-50" />
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/3 left-10 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl animate-pulse delay-300" />

      {/* Main container */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-16">
          {/* Left column (text + buttons) */}
          <div className="max-w-2xl">
            <motion.h1
              className="text-4xl md:text-7xl font-bold leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Web3 Rewards.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                Without the Complexity
              </span>
            </motion.h1>

            <motion.p
              className="mt-6 text-xl text-neutral-300 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Earn XP through quests, convert crypto to cash in one click.
              Experience blockchain without knowing it&apos;s blockchain.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <button
                onClick={openWaitlist}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-3 rounded-lg font-medium text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/20"
              >
                <FaRocket /> Start Earning
              </button>
              <button
                onClick={openWaitlist}
                className="flex items-center gap-2 border border-neutral-700 px-8 py-3 rounded-lg font-medium text-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
              >
                <FaChartLine /> For Projects
              </button>
            </motion.div>

            <motion.div
              className="mt-12 flex items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex -space-x-2">
  {nftMintedImages.map((imagePath, i) => (
    <Image
      key={i}
      src={imagePath}
      alt={`NFT ${i + 1}`}
      width={40} // adjust as needed
      height={40} // adjust as needed
      className="w-10 h-10 rounded-full object-cover border-2 border-neutral-900"
      // Next.js automatically optimizes images.
    />
  ))}
</div>
              <div className="text-neutral-300">
                <p className="font-bold">2,458+ NFTs minted</p>
                <p className="text-sm text-orange-400">Join our community today</p>
              </div>
            </motion.div>
          </div>

          {/* Right column: Our new GLB‐based RotatingNFT */}
          <div className="flex-shrink-0">
            <RotatingNFT />
          </div>
        </div>
      </div>
    </section>
  );
}
