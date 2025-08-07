"use client";
import { useState, useEffect } from 'react';
import { PageLoader } from '@/components/ui/Loader';
import Navbar from '@/components/navigation/Navbar';
import Hero from '@/components/sections/Hero';
import ValueProp from '@/components/sections/ValueProp';
import NFTShowcase from '@/components/sections/NFTShowcase';
import Workflow from '@/components/sections/Workflow';
import SpinSection from '@/components/sections/SpinSection';
import CTA from '@/components/sections/CTA';
import Footer from '@/components/layout/Footer';

export default function LandingPageClient() {
  const [delayed, setDelayed] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setDelayed(true), 1200);
    return () => clearTimeout(timer);
  }, []);
  if (!delayed) {
    return <PageLoader message="Loading SOPHEX..." />;
  }
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <ValueProp />
      <NFTShowcase />
      <Workflow />
      <SpinSection />
      <CTA />
      <Footer />
    </main>
  );
}
