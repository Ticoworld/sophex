'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaSpinner } from 'react-icons/fa';
import { useModal } from '@/context/ModalContext';

export default function WaitlistForm() {
  const { closeWaitlist } = useModal();

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: '0 0 15px rgba(255, 122, 0, 0.6)',
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center p-8 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl border border-orange-500/30 max-w-md mx-auto"
    >
      <h3 className="text-2xl font-bold mb-4 text-orange-400">Applications Closed</h3>
      <p className="text-neutral-300 mb-6">
        The SOPHEX waitlist is currently closed. Spin the wheel daily for a chance to secure a whitelist spot!
      </p>
      <motion.div
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className='inline-block'
      >
        <Link
          href="/spin"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-3 rounded-lg font-medium text-lg text-white hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/20"
          onClick={closeWaitlist}
        >
          <FaSpinner /> Spin to Win
        </Link>
      </motion.div>
    </motion.div>
  );
}