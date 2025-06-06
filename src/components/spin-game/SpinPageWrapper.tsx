'use client';
import { SessionProvider } from 'next-auth/react';
import SpinPageContent from './SpinPageContent';

export default function SpinPageWrapper() {
  return (
    <SessionProvider>
      <SpinPageContent />
    </SessionProvider>
  );
}