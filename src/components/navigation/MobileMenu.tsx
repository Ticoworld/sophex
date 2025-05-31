"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";
import { useModal } from "@/context/ModalContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const menuVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    closed: {
      x: "100%",
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  const { openWaitlist } = useModal();

  return (
    <motion.div
      className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-neutral-900/95 backdrop-blur-md z-50 shadow-lg"
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={menuVariants}
    >
      <div className="flex justify-end p-6">
        <button
          onClick={onClose}
          className="text-orange-400 text-2xl"
          aria-label="Close mobile menu"
        >
          <FaTimes />
        </button>
      </div>
      <div className="flex flex-col items-center space-y-6 mt-10">
        {["Features", "NFTs", "How It Works", "For Projects"].map((item) => (
          <Link
            key={item}
            href={`#${item.toLowerCase().replace(" ", "-")}`}
            className="text-xl text-neutral-300 hover:text-orange-400 transition-colors"
            onClick={onClose}
          >
            {item}
          </Link>
        ))}
        <button
          onClick={openWaitlist}
          className="bg-primary px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors mt-6 text-gray-300 border border-orange-400"
        >
          Join Waitlist
        </button>
      </div>
    </motion.div>
  );
}
