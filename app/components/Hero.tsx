'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Define fixed background elements to avoid hydration errors
const backgroundElements = [
  { width: 250, height: 150, top: 20, left: 20 },
  { width: 180, height: 220, top: 60, left: 70 },
  { width: 300, height: 180, top: 30, left: 50 },
  { width: 220, height: 250, top: 75, left: 30 },
  { width: 270, height: 300, top: 45, left: 65 }
];

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [randomOffsets, setRandomOffsets] = useState<Array<{x: number, y: number}>>([]);

  useEffect(() => {
    setIsVisible(true);
    
    // Only generate random animation values on the client
    setRandomOffsets(
      backgroundElements.map(() => ({
        x: Math.random() * 50 - 25,
        y: Math.random() * 50 - 25
      }))
    );
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.3,
        duration: 0.5 
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center py-20 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-black z-0" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        {backgroundElements.map((element, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-300/10 dark:bg-blue-700/10"
            style={{
              width: `${element.width}px`,
              height: `${element.height}px`,
              top: `${element.top}%`,
              left: `${element.left}%`,
            }}
            animate={randomOffsets.length ? {
              x: [0, randomOffsets[i]?.x || 0],
              y: [0, randomOffsets[i]?.y || 0],
            } : {}}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <motion.div 
        className="relative z-10 container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        <div className="md:w-1/2 text-center md:text-left">
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              Hi, I&apos;m <span className="text-blue-600 dark:text-blue-400">Michal Borek</span>
            </h1>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="mt-4 text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-300">
              Aspiring Machine Learning Engineer
            </h2>
          </motion.div>

          <motion.p 
            variants={itemVariants}
            className="mt-6 text-gray-600 dark:text-gray-400 text-base md:text-lg max-w-lg"
          >
            I&apos;m a junior in college passionate about machine learning, artificial intelligence, cybersecurity, and creating innovative solutions to complex problems.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          >
            <Link href="#projects">
              <motion.button
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                See My Work
              </motion.button>
            </Link>
            <Link href="#contact">
              <motion.button
                className="px-6 py-3 border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 font-medium rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Contact Me
              </motion.button>
            </Link>
          </motion.div>
        </div>

        <motion.div 
          className="md:w-1/2 flex justify-center"
          variants={itemVariants}
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl">
            <Image
              src="/pixel_me.png"
              alt="Michal - ML Engineer"
              fill
              sizes="(max-width: 768px) 256px, 320px"
              priority
              className="object-cover"
              style={{ objectPosition: 'center top' }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
} 