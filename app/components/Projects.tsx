'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { getAssetPath } from '../utils/basePath';

interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  github: string;
  demo: string;
  featured?: boolean;
}

const projects: Project[] = [
  {
    title: "Legal AI — RAG Research Assistant",
    description: "Open-source RAG system for legal and tax document research. Combines PostgreSQL full-text search with Qdrant vector similarity and a local LLM (Llama 3.1 via Ollama) to answer questions about uploaded documents. Every response passes through a citation verification layer that rejects claims not supported by retrieved evidence — making hallucinations structurally impossible. Supports multi-turn conversations, a full audit trail, and a structure-aware chunker that understands legal document formatting.",
    image: getAssetPath('/legal_ai.png'),
    tags: ["Python", "FastAPI", "Next.js", "RAG", "LLM", "Qdrant", "PostgreSQL", "Ollama", "Docker", "Hybrid Search", "Citation Verification"],
    github: "https://github.com/michaelborek/Law-Assistant",
    demo: "",
    featured: true
  },
  {
    title: "DarkVision",
    description: "Computer Vision model for classifying animals in dark, low-visibility images with 92% accuracy using fine-tuned ResNet-18.",
    image: getAssetPath('/darkvision.png'),
    tags: ["Computer Vision", "PyTorch", "CNN", "ResNet-18", "Fine-Tuning"],
    github: "https://github.com/michaelborek/DarkVision",
    demo: ""
  },
  {
    title: "Auto Grader",
    description: "Automated grading system that evaluates student code submissions against test suites, providing instant feedback and scoring.",
    image: getAssetPath('/autograder.png'),
    tags: ["Python", "Unittest", "Automation", "Linux"],
    github: "https://github.com/michaelborek/AUTO-GRADER",
    demo: ""
  },
  {
    title: "QSide-Notebook",
    description: "Browser-based data visualization tool that lets users explore and chart datasets without local environment setup.",
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

  const featuredProject = projects.find(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  const renderProjectCard = (project: Project, isFeatured = false) => (
    <div className={`bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg ${isFeatured ? 'border border-blue-200 dark:border-blue-800' : ''}`}>
      <div className={`relative w-full ${isFeatured ? 'h-64' : 'h-48'}`}>
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes={isFeatured ? '(max-width: 768px) 100vw, 100vw' : '(max-width: 768px) 100vw, 50vw'}
          className="object-cover"
        />
        {isFeatured && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-wide">
            Featured
          </div>
        )}
      </div>
      <div className={isFeatured ? 'p-8' : 'p-6'}>
        <h3 className={`font-bold mb-3 text-gray-900 dark:text-white ${isFeatured ? 'text-2xl' : 'text-xl'}`}>
          {project.title}
        </h3>
        <p className={`text-gray-600 dark:text-gray-300 mb-4 ${isFeatured ? 'text-base leading-relaxed' : ''}`}>
          {project.description}
        </p>
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
  );

  // Provide a static version for initial SSR render
  if (!isHydrated) {
    return (
      <section id="projects" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
              My <span className="text-blue-600 dark:text-blue-400">Projects</span>
            </h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              End-to-end systems spanning ML pipelines, RAG architectures, and applied research
            </p>

            {featuredProject && (
              <div className="mb-8">
                {renderProjectCard(featuredProject, true)}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherProjects.map((project) => (
                <div key={project.title}>
                  {renderProjectCard(project)}
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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            My <span className="text-blue-600 dark:text-blue-400">Projects</span>
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            End-to-end systems spanning ML pipelines, RAG architectures, and applied research
          </p>

          {featuredProject && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={(isInView || forceDisplay) ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              whileHover={{ y: -5 }}
              className="mb-8"
            >
              {renderProjectCard(featuredProject, true)}
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                animate={(isInView || forceDisplay) ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.2 + index * 0.1,
                  ease: "easeOut" 
                }}
                whileHover={{ y: -5 }}
              >
                {renderProjectCard(project)}
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