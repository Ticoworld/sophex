'use client';
import { motion } from 'framer-motion';

export default function XPBadge({ children }: { children: React.ReactNode }) {
  return (
    <motion.span 
      className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-xs font-bold text-white shadow-sm shadow-orange-500/30"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.span>
  );
}