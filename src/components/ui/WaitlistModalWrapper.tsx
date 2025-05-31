'use client';
import { useModal } from '@/context/ModalContext';
import WaitlistModal from './WaitlistModal';

export default function WaitlistModalWrapper() {
  const { isWaitlistOpen, closeWaitlist } = useModal();
  return <WaitlistModal isOpen={isWaitlistOpen} onClose={closeWaitlist} />;
}