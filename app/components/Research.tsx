'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { FaFilePdf, FaExternalLinkAlt, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';
import { getAssetPath } from '../utils/basePath';

interface ResearchItem {
  title: string;
  description: string;
  category: string;
  venue: string;
  date: string;
  tags: string[];
  abstract: string;
  pdfPath?: string;
  externalLink?: string;
  doi?: string;
  authors?: string;
  citation?: string;
}

const researchItems: ResearchItem[] = [
  {
    title: "Ordinal Classification Framework for Multiclass Grading of Pneumoconiosis",
    description: "Published research paper in SPIE Medical Imaging 2025 presenting a novel ordinal classification approach for automated pneumoconiosis severity grading.",
    category: "Research Publication",
    venue: "SPIE Medical Imaging 2025: Computer-Aided Diagnosis",
    date: "April 2025",
    externalLink: "https://www.spiedigitallibrary.org/conference-proceedings-of-spie/13407/134072Q/Ordinal-classification-framework-for-multiclass-grading-of-pneumoconiosis/10.1117/12.3046353.short",
    doi: "10.1117/12.3046353",
    tags: ["Machine Learning", "Medical Imaging", "Ordinal Classification", "Computer Vision", "SPIE"],
    abstract: "This paper presents an ordinal classification framework specifically designed for multiclass grading of pneumoconiosis severity. Our approach addresses the inherent ordinal nature of pneumoconiosis progression stages, providing more accurate and clinically relevant automated assessment compared to traditional classification methods.",
    authors: "Liu, M., Loveless, I., Huang, Z., Borek, M., Rosenman, K., Alessio, A., Wang, L.",
    citation: "Liu, M., Loveless, I., Huang, Z., Borek, M., Rosenman, K., Alessio, A., Wang, L., \"Ordinal classification framework for multiclass grading of pneumoconiosis,\" in SPIE Medical Imaging 2025: Computer-Aided Diagnosis, vol. 13407, 134072Q, Apr. 2025. doi:10.1117/12.3046353"
  },
  {
    title: "UURAF Research Poster 2025",
    description: "Research poster presented at the University Undergraduate Research and Arts Forum (UURAF), showcasing AI-powered pneumoconiosis classification using chest radiographs.",
    category: "Research Poster",
    venue: "UURAF 2025 - Michigan State University",
    date: "2025",
    pdfPath: getAssetPath('/UURAF_poster_2025.pdf'),
    tags: ["Machine Learning", "Medical Imaging", "Computer Vision", "ResNet", "UURAF"],
    abstract: "Pneumoconiosis is an occupational lung disease caused by inhaling mineral dust, and chest radiography remains the key screening tool. Although standardization efforts by the ILO and NIOSH—such as the B Reader Certification Program—have improved consistency, challenges like reader variability, limited certified readers, and potential conflicts of interest persist. This study leverages artificial intelligence to objectively classify pneumoconiosis severity on a 4-point scale (0–3) using posterior-anterior chest radiographs from the NIOSH repository. A ResNet framework employing various loss functions (cross-entropy, corn, coral, focal staging, hierarchical, and hierarchical cross-entropy) is explored to enhance diagnostic reliability.",
  },
  {
    title: "HPC Agentic-AI Framework for Batch Job Script Validation",
    description: "Research poster presenting an innovative Agentic-AI framework designed to help HPC users validate batch submission scripts using large language models to reduce computational waste.",
    category: "Research Poster",
    venue: "iCER MidSURE 2025 - Michigan State University",
    date: "January 2025",
    pdfPath: getAssetPath('/icer_midsure_poster.pdf'),
    tags: ["High Performance Computing", "Large Language Models", "Agentic AI", "CodeLlama", "Software Engineering", "iCER"],
    abstract: "High-performance computing (HPC) users frequently make errors when writing batch job submission scripts, e.g. syntax errors, references to unavailable software installations and/or data files, inappropriate resource requests for the given cluster. These errors generally result in failed submissions or worse, jobs failing after having spent significant time in a queue or after having run for some time on the cluster, leading to wasted compute cycles with unnecessary energy consumption and needlessly prolonging the research cycle. This project aims to help HPC users increase efficiency and productivity by employing an HPC hosted large language model (LLM) as an Agentic-AI framework designed to examine batch submission scripts and advise users on potential errors in syntax, software/file refences, and resource allocation prior to submission. We first focus our efforts on the Michigan State University High-Performance Computing Center, using the 'codellama' family of LLMs.",
  }
];

export default function Research() {
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
      <section id="research" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Research & <span className="text-blue-600 dark:text-blue-400">Publications</span>
            </h2>

            <div className="grid grid-cols-1 gap-8">
              {researchItems.map((item) => (
                <div
                  key={item.title}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="p-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Main content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                            {item.category}
                          </span>
                          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                            <FaCalendar className="w-3 h-3" />
                            <span>{item.date}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                        
                        <div className="flex items-center gap-1 mb-4 text-sm text-gray-600 dark:text-gray-300">
                          <FaMapMarkerAlt className="w-3 h-3" />
                          <span>{item.venue}</span>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                          {item.description}
                        </p>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                          {item.abstract}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                          {item.tags.map(tag => (
                            <span 
                              key={tag} 
                              className="px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* PDF preview and download OR External publication link */}
                      <div className="lg:w-80">
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 text-center">
                          <div className="mb-4">
                            <FaFilePdf className="w-16 h-16 text-red-500 mx-auto mb-3" />
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                              {item.category === 'Research Publication' ? 'Published Paper' : 'Research Poster'}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {item.category === 'Research Publication' ? 'Access the publication online' : 'View or download the full poster'}
                            </p>
                            {item.doi && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                DOI: {item.doi}
                              </p>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            {item.externalLink ? (
                              <Link 
                                href={item.externalLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                              >
                                <FaExternalLinkAlt className="w-4 h-4" />
                                <span>View Publication</span>
                              </Link>
                            ) : item.pdfPath && (
                              <>
                                <Link 
                                  href={item.pdfPath} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                                >
                                  <FaExternalLinkAlt className="w-4 h-4" />
                                  <span>View Poster</span>
                                </Link>
                                
                                <Link 
                                  href={item.pdfPath} 
                                  download
                                  className="w-full inline-flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                                >
                                  <FaFilePdf className="w-4 h-4" />
                                  <span>Download PDF</span>
                                </Link>
                              </>
                            )}
                          </div>
                          
                          {item.authors && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Authors:</p>
                              <p className="text-xs text-gray-600 dark:text-gray-300">{item.authors}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  // Original animated version for client-side
  return (
    <section id="research" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={(isInView || forceDisplay) ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Research & <span className="text-blue-600 dark:text-blue-400">Publications</span>
          </h2>

          <div className="grid grid-cols-1 gap-8">
            {researchItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={(isInView || forceDisplay) ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: "easeOut" 
                }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                          {item.category}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <FaCalendar className="w-3 h-3" />
                          <span>{item.date}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      
                      <div className="flex items-center gap-1 mb-4 text-sm text-gray-600 dark:text-gray-300">
                        <FaMapMarkerAlt className="w-3 h-3" />
                        <span>{item.venue}</span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        {item.description}
                      </p>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        {item.abstract}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {item.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                                          {/* PDF preview and download OR External publication link */}
                      <div className="lg:w-80">
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 text-center">
                          <div className="mb-4">
                            <FaFilePdf className="w-16 h-16 text-red-500 mx-auto mb-3" />
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                              {item.category === 'Research Publication' ? 'Published Paper' : 'Research Poster'}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {item.category === 'Research Publication' ? 'Access the publication online' : 'View or download the full poster'}
                            </p>
                            {item.doi && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                DOI: {item.doi}
                              </p>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            {item.externalLink ? (
                              <Link 
                                href={item.externalLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                              >
                                <FaExternalLinkAlt className="w-4 h-4" />
                                <span>View Publication</span>
                              </Link>
                            ) : item.pdfPath && (
                              <>
                                <Link 
                                  href={item.pdfPath} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                                >
                                  <FaExternalLinkAlt className="w-4 h-4" />
                                  <span>View Poster</span>
                                </Link>
                                
                                <Link 
                                  href={item.pdfPath} 
                                  download
                                  className="w-full inline-flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                                >
                                  <FaFilePdf className="w-4 h-4" />
                                  <span>Download PDF</span>
                                </Link>
                              </>
                            )}
                          </div>
                          
                          {item.authors && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Authors:</p>
                              <p className="text-xs text-gray-600 dark:text-gray-300">{item.authors}</p>
                            </div>
                          )}
                        </div>
                      </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 