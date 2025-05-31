'use client'; 
import { motion } from 'framer-motion';
import GlowingButton from '../ui/GlowingButton';
import { FaWallet, FaGem, FaRocket, FaExchangeAlt } from 'react-icons/fa';
import { useModal } from '@/context/ModalContext';

export default function ValueProp() {
  const { openWaitlist } = useModal();
  const features = [
    {
      icon: <FaWallet className="text-2xl text-orange-500" />,
      title: "Zero Crypto Complexity",
      description: "No wallets, gas fees, or P2P trading. Convert rewards to cash with one click."
    },
    {
      icon: <FaGem className="text-2xl text-orange-500" />,
      title: "Real Utility NFTs",
      description: "3D NFTs provide XP boosts and quest advantages for deeper engagement."
    },
    {
      icon: <FaRocket className="text-2xl text-orange-500" />,
      title: "Project Growth Engine",
      description: "Gain visibility through our hyped community and structured campaigns."
    },
    {
      icon: <FaExchangeAlt className="text-2xl text-orange-500" />,
      title: "Seamless Conversion",
      description: "Built-in wallet system converts crypto to fiat automatically."
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Sophex?</span>
          </h2>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
            We remove the barriers that keep Web2 users from experiencing Web3 benefits
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-neutral-800 p-8 rounded-2xl border border-neutral-700 hover:border-orange-500/50 transition-all group relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
              
              <div className="flex items-start mb-4">
                <div className="bg-orange-500/10 p-3 rounded-lg mr-4 group-hover:bg-orange-500/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold">{feature.title}</h3>
              </div>
              <p className="text-neutral-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12"
        onClick={openWaitlist}
        >
          <GlowingButton>
            See How It Works
          </GlowingButton>
        </div>
      </div>
    </section>
  );
}