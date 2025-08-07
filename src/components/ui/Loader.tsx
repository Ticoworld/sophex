'use client';

import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

interface LoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'pulse';
}

export default function Loader({ 
  message = 'Loading...', 
  size = 'md',
  variant = 'default' 
}: LoaderProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  };

  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center gap-3">
        <motion.div
          className={`${sizeClasses[size]} border-4 border-dashed border-orange-500 rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        {message && (
          <span className={`${textSizeClasses[size]} text-orange-300 font-medium`}>
            {message}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <motion.div
          className={`${sizeClasses[size]} bg-gradient-to-r from-orange-500 to-orange-600 rounded-full`}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
        />
        {message && (
          <motion.p 
            className={`${textSizeClasses[size]} text-orange-300 font-medium text-center`}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {message}
          </motion.p>
        )}
      </div>
    );
  }

  // Default variant - professional spinner with orbital rings
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center space-y-6 bg-black/95">
      {/* Main spinner container */}
      <div className="relative">
        {/* Outer rotating ring */}
        <motion.div
          className={`${sizeClasses[size]} border-4 border-transparent border-t-orange-500 border-r-orange-400 rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Inner counter-rotating ring */}
        <motion.div
          className={`absolute inset-2 ${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-4 h-4' : 'w-8 h-8'} border-2 border-transparent border-b-orange-600 border-l-orange-500 rounded-full`}
          animate={{ rotate: -360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />

        {/* Center dot with pulse */}
        <motion.div
          className={`absolute inset-0 m-auto ${size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'} bg-orange-500 rounded-full`}
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
        />
      </div>

      {/* Loading message with typing effect */}
      {message && (
        <motion.div 
          className="text-center space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className={`${textSizeClasses[size]} text-orange-300 font-medium`}>
            {message}
          </p>
          
          {/* Animated dots */}
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1 h-1 bg-orange-500 rounded-full"
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  delay: i * 0.2,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Subtle background glow */}
      <motion.div
        className="absolute inset-0 bg-orange-500/5 rounded-full blur-xl -z-10"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: 'easeInOut' 
        }}
      />
    </div>
  );
}

// Specialized loaders for common use cases
export function SpinLoader({ message = 'Spinning...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <FaSpinner className="w-12 h-12 text-orange-500" />
      </motion.div>
      <p className="text-lg text-orange-300 font-medium">{message}</p>
    </div>
  );
}

export function AuthLoader({ message = 'Authenticating...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="relative">
        {/* Twitter-like bird animation */}
        <motion.div
          className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
        >
          <span className="text-2xl">🐦</span>
        </motion.div>
        
        {/* Orbital ring */}
        <motion.div
          className="absolute inset-0 w-16 h-16 border-2 border-dashed border-orange-400 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <p className="text-lg text-orange-300 font-medium text-center">{message}</p>
    </div>
  );
}

export function PageLoader({ message = 'Loading page...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center space-y-6">
        {/* SOPHEX logo with animation */}
        <motion.div 
          className="flex items-center justify-center space-x-3 mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20"
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(255, 122, 0, 0.2)',
                '0 0 40px rgba(255, 122, 0, 0.4)',
                '0 0 20px rgba(255, 122, 0, 0.2)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-white font-bold text-lg">SX</span>
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold text-orange-400">SOPHEX</h3>
            <p className="text-sm text-neutral-400">Web3 Made Invisible</p>
          </div>
        </motion.div>

        <Loader message={message} size="lg" />
        
        {/* Progress indicator */}
        <motion.div 
          className="w-64 h-1 bg-neutral-800 rounded-full overflow-hidden mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
            animate={{ x: [-256, 256] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: 'easeInOut',
              repeatType: 'reverse'
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
