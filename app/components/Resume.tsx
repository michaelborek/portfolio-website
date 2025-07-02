'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { FaFilePdf, FaExternalLinkAlt, FaDownload, FaUser, FaBriefcase } from 'react-icons/fa';
import { getAssetPath } from '../utils/basePath';

export default function Resume() {
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

  const resumePath = getAssetPath('/resume.pdf');

  // Provide a static version for initial SSR render
  if (!isHydrated) {
    return (
      <section id="resume" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              My <span className="text-blue-600 dark:text-blue-400">Resume</span>
            </h2>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Resume Info */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <FaUser className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Professional Resume
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    View my comprehensive resume showcasing my education, experience, projects, and skills in Machine Learning and Data Science. Updated with my latest accomplishments and research work.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <FaBriefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>Software Engineer Intern at iCER</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <FaBriefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>Research Assistant at MIDI Lab</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <FaUser className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>Computational Data Science Major</span>
                    </div>
                  </div>
                </div>
                
                {/* Resume Preview/Download */}
                <div className="flex justify-center">
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-8 text-center shadow-md w-full max-w-sm">
                    <div className="mb-6">
                      <FaFilePdf className="w-20 h-20 text-red-500 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Resume PDF
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        View my complete professional resume
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <Link 
                        href={resumePath} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                      >
                        <FaExternalLinkAlt className="w-4 h-4" />
                        <span>View Resume</span>
                      </Link>
                      
                      <Link 
                        href={resumePath} 
                        download="Michal_Borek_Resume.pdf"
                        className="w-full inline-flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                      >
                        <FaDownload className="w-4 h-4" />
                        <span>Download PDF</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  // Original animated version for client-side
  return (
    <section id="resume" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={(isInView || forceDisplay) ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            My <span className="text-blue-600 dark:text-blue-400">Resume</span>
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={(isInView || forceDisplay) ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-lg"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Resume Info */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <FaUser className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Professional Resume
                  </h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  View my comprehensive resume showcasing my education, experience, projects, and skills in Machine Learning and Data Science. Updated with my latest accomplishments and research work.
                </p>
                
                <div className="space-y-4">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={(isInView || forceDisplay) ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                  >
                    <FaBriefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Software Engineer Intern at iCER</span>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={(isInView || forceDisplay) ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                  >
                    <FaBriefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Research Assistant at MIDI Lab</span>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={(isInView || forceDisplay) ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                  >
                    <FaUser className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Computational Data Science Major</span>
                  </motion.div>
                </div>
              </div>
              
              {/* Resume Preview/Download */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={(isInView || forceDisplay) ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex justify-center"
              >
                <div className="bg-white dark:bg-gray-700 rounded-lg p-8 text-center shadow-md w-full max-w-sm">
                  <div className="mb-6">
                    <FaFilePdf className="w-20 h-20 text-red-500 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Resume PDF
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      View my complete professional resume
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <Link 
                      href={resumePath} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      <FaExternalLinkAlt className="w-4 h-4" />
                      <span>View Resume</span>
                    </Link>
                    
                    <Link 
                      href={resumePath} 
                      download="Michal_Borek_Resume.pdf"
                      className="w-full inline-flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      <FaDownload className="w-4 h-4" />
                      <span>Download PDF</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 