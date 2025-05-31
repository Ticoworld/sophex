'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import WaitlistForm from '../sections/WaitlistForm';

export default function WaitlistModal({ isOpen, onClose }: { 
  isOpen: boolean; 
  onClose: () => void 
}) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative max-w-md w-full max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute -top-10 right-0 text-white hover:text-orange-400 transition-colors"
            >
              <FaTimes className="text-2xl" />
            </button>
            
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl border border-orange-500/30 overflow-hidden shadow-xl">
              <div className="p-1 bg-gradient-to-r from-orange-500 to-orange-600"></div>
              <WaitlistForm />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}