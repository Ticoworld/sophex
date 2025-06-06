'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaSpinner } from 'react-icons/fa';

export default function SpinSection() {
  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: '0 0 15px rgba(255, 122, 0, 0.6)',
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.95 },
  };

  return (
    <section id="spin" className="relative py-20 bg-gradient-to-br from-neutral-900 to-neutral-950">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Spin to Win Whitelist Spots!
        </motion.h2>
        <motion.p
          className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Try your luck daily with two spins to earn points or secure a rare whitelist spot. Join the SOPHEX community and get rewarded!
        </motion.p>
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className='inline-block'
        >
          <Link
            href="/spin"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-3 rounded-lg font-medium text-lg text-white hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/20 "
          >
            <FaSpinner /> Spin Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
}