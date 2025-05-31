'use client';
import { createContext, useState, useContext } from 'react';

interface ModalContextType {
  isWaitlistOpen: boolean;
  openWaitlist: () => void;
  closeWaitlist: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const openWaitlist = () => setIsWaitlistOpen(true);
  const closeWaitlist = () => setIsWaitlistOpen(false);

  return (
    <ModalContext.Provider value={{ isWaitlistOpen, openWaitlist, closeWaitlist }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}