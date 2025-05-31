"use client";
import { FaTwitter, FaDiscord, FaGithub, FaRocket } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 py-16 border-t border-neutral-700/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo Section */}
          <motion.div 
            className="flex items-center space-x-3 group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
              <span className="text-white font-bold text-lg">SX</span>
            </div>
            <div>
              <h3 className="text-xl font-bold group-hover:text-orange-400 transition-colors">SOPHEX</h3>
              <p className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">Web3 Made Invisible</p>
            </div>
          </motion.div>
          
          {/* Social Links */}
          <div className="flex space-x-6">
            <motion.a 
              href="https://x.com/ShophexOnSophon?t=j_STSXjUqX5fgM0zXjmmPw&s=09" 
              className="text-neutral-400 hover:text-orange-400 transition-colors relative"
              whileHover={{ y: -3 }}
            >
              <span className="sr-only">Twitter</span>
              <FaTwitter className="h-6 w-6" />
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 group-hover:w-full transition-all duration-300"></span>
            </motion.a>
            
            <motion.a 
              href="#" 
              className="text-neutral-400 hover:text-orange-400 transition-colors relative"
              whileHover={{ y: -3 }}
            >
              <span className="sr-only">Discord</span>
              <FaDiscord className="h-6 w-6" />
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 group-hover:w-full transition-all duration-300"></span>
            </motion.a>
            
            <motion.a 
              href="#" 
              className="text-neutral-400 hover:text-orange-400 transition-colors relative"
              whileHover={{ y: -3 }}
            >
              <span className="sr-only">GitHub</span>
              <FaGithub className="h-6 w-6" />
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 group-hover:w-full transition-all duration-300"></span>
            </motion.a>
          </div>
          
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Documentation', 'Contact'].map((item) => (
              <motion.a
                key={item}
                href="#"
                className="text-neutral-400 hover:text-orange-400 transition-colors relative text-sm font-medium"
                whileHover={{ y: -2 }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 hover:w-full transition-all duration-300"></span>
              </motion.a>
            ))}
          </div>
        </div>
        
        {/* Copyright Section */}
        <motion.div 
          className="border-t border-neutral-800 mt-12 pt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-neutral-500">
            © {new Date().getFullYear()} Sophex. All rights reserved. 
            <span className="text-orange-400 mx-1">✦</span>
            Built on Sophon.
          </p>
          <p className="text-neutral-600 text-sm mt-2">
            Making Web3 accessible for everyone
            <span className="inline-block ml-2 animate-pulse text-orange-400"> <FaRocket /> </span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}