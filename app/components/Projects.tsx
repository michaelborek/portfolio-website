'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { getAssetPath } from '../utils/basePath';

const projects = [
  {
    title: "DarkVision",
    description: "Developed a Computer Vision model for classifying animals in dark images with 92% accuracy.",
    image: getAssetPath('/darkvision.png'),
    tags: ["Computer Vision", "PyTorch", "CNN", "ResNet-18", "Fine-Tuning"],
    github: "https://github.com/michaelborek/DarkVision",
    demo: ""
  },
  {
    title: "Auto Grader",
    description: "Implemented a system that automatically grades student assignments.",
    image: getAssetPath('/autograder.png'),
    tags: ["Python", "Unittest", "auto-grading", "linux"],
    github: "https://github.com/michaelborek/AUTO-GRADER",
    demo: ""
  },
  {
    title: "QSide-Notebook",
    description: "Tool which allows you to visualize your data without needing to go through the hassle of setting it up yourself.",
    image: getAssetPath('/QSide.png'),
    tags: ["JupyterLite", "Python", "SQL"],
    github: "https://github.com/michaelborek/QSide-Notebook",
    demo: "https://malshaik.github.io/QSide-Notebook/"
  }
];

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -300px 0px' });
  const [isHydrated, setIsHydrated] = useState(false);
  const [forceDisplay, setForceDisplay] = useState(false);
  
  useEffect(() => {
    setIsHydrated(true);
    
    const timer = setTimeout(() => {
      setForceDisplay(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Provide a static version for initial SSR render
  if (!isHydrated) {
    return (
      <section id="projects" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              My <span className="text-blue-600 dark:text-blue-400">Projects</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project) => (
                <div
                  key={project.title}
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{project.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      {project.github && (
                        <Link href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                          <FaGithub className="w-4 h-4" />
                          <span>GitHub</span>
                        </Link>
                      )}
                      {project.demo && (
                        <Link href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                          <FaExternalLinkAlt className="w-3 h-3" />
                          <span>Live Demo</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="https://github.com/michaelborek" target="_blank" rel="noopener noreferrer">
                <button className="inline-flex items-center gap-2 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                  <FaGithub className="w-5 h-5" />
                  <span>See More on GitHub</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  // Original animated version for client-side
  return (
    <section id="projects" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={(isInView || forceDisplay) ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            My <span className="text-blue-600 dark:text-blue-400">Projects</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                animate={(isInView || forceDisplay) ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: "easeOut" 
                }}
                whileHover={{ y: -5 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    {project.github && (
                      <Link href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                        <FaGithub className="w-4 h-4" />
                        <span>GitHub</span>
                      </Link>
                    )}
                    {project.demo && (
                      <Link href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                        <FaExternalLinkAlt className="w-3 h-3" />
                        <span>Live Demo</span>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={(isInView || forceDisplay) ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center mt-12"
          >
            <Link href="https://github.com/michaelborek" target="_blank" rel="noopener noreferrer">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                <FaGithub className="w-5 h-5" />
                <span>See More on GitHub</span>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 