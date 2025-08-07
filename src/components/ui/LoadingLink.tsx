'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  showLoader?: boolean;
}

export default function LoadingLink({ 
  href, 
  children, 
  className = '', 
  onClick,
  showLoader = true,
  ...props 
}: LoadingLinkProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent) => {
    if (onClick) onClick();
    
    if (showLoader) {
      e.preventDefault();
      setIsLoading(true);
      
      // Add small delay for visual feedback
      setTimeout(() => {
        router.push(href);
        // Loading will be handled by the global loader
        setIsLoading(false);
      }, 300);
    }
  };

  return (
    <Link 
      href={href} 
      className={`${className} ${isLoading ? 'pointer-events-none' : ''}`}
      onClick={handleClick}
      {...props}
    >
      <motion.div
        className="flex items-center gap-2"
        animate={isLoading ? { opacity: 0.7 } : { opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
          />
        )}
        {children}
      </motion.div>
    </Link>
  );
}
