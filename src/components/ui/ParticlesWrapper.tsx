'use client';
import dynamic from 'next/dynamic';

const ParticlesContainer = dynamic(
  () => import('@/components/ui/ParticlesContainer'),
  { ssr: false }
);

export default function ParticlesWrapper() {
  return <ParticlesContainer />;
}