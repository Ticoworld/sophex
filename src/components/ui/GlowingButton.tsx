'use client';
import { motion } from 'framer-motion';

export default function GlowingButton({ children }: { children: React.ReactNode }) {
  return (
    <motion.button
      className="relative px-8 py-4 rounded-xl font-medium text-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all overflow-hidden group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="relative z-10">{children}</span>
      <motion.span 
        className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"
        initial={{ opacity: 0 }}
      />
      <motion.span 
        className="absolute -inset-2 bg-orange-500 blur-xl opacity-0 group-hover:opacity-30 transition-opacity"
        initial={{ opacity: 0 }}
      />
      <motion.span 
        className="absolute inset-0 border border-orange-500/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
        initial={{ opacity: 0 }}
      />
    </motion.button>
  );
}