"use client";

import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import MobileMenu from "./MobileMenu";
import { useModal } from "@/context/ModalContext";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const { openWaitlist } = useModal();

  const linkVariants = {
    hover: {
      scale: 1.1,
      color: "#FF7A00",
      transition: { duration: 0.3 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 0 10px rgba(255, 122, 0, 0.5)",
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.95 },
  };

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between p-6 bg-neutral-black/80 backdrop-blur-md shadow-md">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-primary rounded-lg" />
          <span className="text-xl font-bold text-orange-400">SOPHEX</span>
        </div>

        <div className="hidden md:flex space-x-8">
          {["Features", "NFTs", "How It Works", "For Projects"].map((item) => (
            <motion.div key={item} variants={linkVariants} whileHover="hover">
              <Link
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-neutral-300 hover:text-primary transition-colors"
              >
                {item}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.a
          onClick={openWaitlist}
          className="hidden md:block bg-primary px-6 py-2 rounded-lg font-medium text-gray-300"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Join Waitlist
        </motion.a>

        <button
          className="md:hidden text-orange-400 text-2xl"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={toggleMobileMenu} />
    </>
  );
}
