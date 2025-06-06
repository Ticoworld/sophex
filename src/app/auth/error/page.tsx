'use client';
   import { useSearchParams } from 'next/navigation';
   import { useEffect } from 'react';

   export default function AuthErrorPage() {
     const searchParams = useSearchParams();
     const error = searchParams.get('error');

     useEffect(() => {
       console.error('Auth error:', error);
     }, [error]);

     return (
       <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center justify-center p-4">
         <h1 className="text-4xl font-bold mb-4">Authentication Error</h1>
         <p className="text-lg mb-4">An error occurred: {error || 'Unknown error'}</p>
         <a
           href="/spin"
           className="px-6 py-2 bg-orange-500 rounded-lg text-lg font-semibold hover:bg-orange-600 transition"
         >
           Back to Spin Page
         </a>
       </div>
     );
   }