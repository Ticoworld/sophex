'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PageLoader } from './Loader';

export default function NavigationLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let loadingTimer: NodeJS.Timeout;

    // Override the push method to show loading
    const originalPush = router.push;
    const originalReplace = router.replace;

    const showLoaderAndNavigate = (originalMethod: typeof router.push) => {
      return (...args: Parameters<typeof router.push>) => {
        setIsLoading(true);
        
        // Call the original navigation method
        const result = originalMethod.apply(router, args);
        
        // Hide loader after navigation
        loadingTimer = setTimeout(() => {
          setIsLoading(false);
        }, 800);

        return result;
      };
    };

    router.push = showLoaderAndNavigate(originalPush);
    router.replace = showLoaderAndNavigate(originalReplace);

    return () => {
      // Restore original methods
      router.push = originalPush;
      router.replace = originalReplace;
      if (loadingTimer) clearTimeout(loadingTimer);
    };
  }, [router]);

  // Also handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 600);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="navigation-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm"
        >
          <PageLoader message="Navigating..." />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
