'use client';

import { motion } from 'framer-motion';
import GlowingButton from '../ui/GlowingButton'; // Assuming this path is correct
import { useModal } from '@/context/ModalContext'; // Assuming this path is correct
import Image from 'next/image';


export default function CTA() {
  const { openWaitlist } = useModal();
  const userAvatarImages = [
    '/assets/nft.jpg',
    '/assets/nft1.jpg',
    '/assets/nft2.jpg',
    '/assets/nft3.jpg',
  ];

   return (
    <section className="py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-DEFAULT/5 to-secondary-DEFAULT/5 z-0"></div>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-DEFAULT/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary-DEFAULT/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              Ready to Experience{" "}
              <span className="text-primary-DEFAULT">Web3 Made Simple?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of users earning rewards without crypto complexity
            </p>

            <div
              className="flex flex-col sm:flex-row justify-center gap-4"
              onClick={openWaitlist}
            >
              <GlowingButton>Start Earning Now</GlowingButton>
              <button className="border-2 border-white/20 px-8 py-4 rounded-xl font-medium text-lg hover:bg-white/5 transition-colors">
                For Projects
              </button>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 text-gray-400">
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  {/* Dynamically rendering images for active users using Next.js Image */}
                  {userAvatarImages.map((imagePath, i) => (
                    <Image
                      key={i}
                      src={imagePath}
                      alt={`User Avatar ${i + 1}`}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover border-2 border-secondary-light"
                    />
                  ))}
                </div>
                <span>5000+ Active Users</span>
              </div>
              <div className="flex items-center">
                <div className="bg-primary-DEFAULT/10 text-primary-DEFAULT px-3 py-1 rounded-lg mr-3">
                  +120%
                </div>
                <span>Growth Last Month</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}