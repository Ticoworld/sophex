'use client';

import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import GlowingButton from '../ui/GlowingButton';
import { FaTasks, FaCoins, FaExchangeAlt, FaMoneyBillWave } from 'react-icons/fa';
import { useModal } from '@/context/ModalContext';

// Pre-generated star positions to avoid hydration mismatch
const stars = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  left: `${(i * 137.5 % 100)}%`, // Deterministic pseudo-random distribution
  top: `${(i * 149.7 % 100)}%`,
  animationDelay: `${(i * 0.05) % 5}s`,
  animationDuration: `${2 + (i * 0.03) % 3}s`,
  scale: 0.5 + (i * 0.005) % 0.5,
}));

const steps = [
  {
    id: 1,
    title: 'Complete Quests',
    description: 'Engage with simple tasks to earn XP points',
    icon: <FaTasks className="text-4xl text-orange-500" />,
  },
  {
    id: 2,
    title: 'Earn Crypto Rewards',
    description: 'XP converts to crypto at campaign completion',
    icon: <FaCoins className="text-4xl text-orange-500" />,
  },
  {
    id: 3,
    title: 'One-Click Conversion',
    description: 'Convert crypto to fiat instantly',
    icon: <FaExchangeAlt className="text-4xl text-orange-500" />,
  },
  {
    id: 4,
    title: 'Cash Out & Enjoy',
    description: 'Funds deposited to your bank account',
    icon: <FaMoneyBillWave className="text-4xl text-orange-500" />,
  },
];

export default function Workflow() {
  const { openWaitlist } = useModal();
  return (
    <section className="py-24 relative overflow-hidden bg-neutral-950"
      id="how-it works"
    >
      {/* CSS Starfield Background */}
      <div className="absolute inset-0 z-0">
        <div className="starfield">
          {stars.map((star) => (
            <div
              key={star.id}
              className="star"
              style={{
                left: star.left,
                top: star.top,
                animationDelay: star.animationDelay,
                animationDuration: star.animationDuration,
                transform: `scale(${star.scale})`,
              }}
            />
          ))}
        </div>
      </div>
      {/* Subtle Gradient Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Sophex</span> Works
          </h2>
          <p className="text-xl text-neutral-300">
            From quest to cash in four seamless steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Tilt
              key={step.id}
              tiltMaxAngleX={15}
              tiltMaxAngleY={15}
              perspective={1000}
              scale={1.05}
              transitionSpeed={500}
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative bg-neutral-800 rounded-xl p-6 border border-neutral-700 hover:border-orange-500/50 transition-all group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/20 border border-orange-500/30 mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-orange-400 mb-2">{step.title}</h3>
                <p className="text-neutral-400 text-sm">{step.description}</p>
                <div className="absolute top-2 right-2 bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                  {step.id}
                </div>
              </motion.div>
            </Tilt>
          ))}
        </div>

        <div className="text-center mt-16" onClick={openWaitlist}>
          <GlowingButton>Join the Waitlist</GlowingButton>
        </div>
      </div>
    </section>
  );
}