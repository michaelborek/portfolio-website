'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link href="#hero" className="text-xl font-bold">
              Michal<span className="text-blue-500">.</span>
            </Link>
            <p className="mt-2 text-gray-400 text-sm">
              Machine Learning Engineer
            </p>
          </div>
          
          <div className="flex flex-col mb-6 md:mb-0">
            <h3 className="text-lg font-medium mb-3">Quick Links</h3>
            <div className="flex flex-col space-y-2">
              <Link href="#about" className="text-gray-400 hover:text-white transition-colors">
                About
              </Link>
              <Link href="#skills" className="text-gray-400 hover:text-white transition-colors">
                Skills
              </Link>
              <Link href="#resume" className="text-gray-400 hover:text-white transition-colors">
                Resume
              </Link>
              <Link href="#projects" className="text-gray-400 hover:text-white transition-colors">
                Projects
              </Link>
              <Link href="#research" className="text-gray-400 hover:text-white transition-colors">
                Research
              </Link>
              <Link href="#contact" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Connect</h3>
            <div className="flex space-x-4">
              <motion.a 
                href="https://github.com/michaelborek" 
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaGithub className="w-6 h-6" />
              </motion.a>
              
              <motion.a 
                href="https://linkedin.com/in/michal-borek2003" 
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaLinkedin className="w-6 h-6" />
              </motion.a>
              
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
          <p>© {currentYear} Michal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 