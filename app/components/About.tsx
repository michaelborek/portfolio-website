'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            About <span className="text-blue-600 dark:text-blue-400">Me</span>
          </h2>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 md:p-8 shadow-lg">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              I&apos;m a Machine Learning Engineer graduating from Michigan State University with a degree in Computational Data Science and a Mathematics minor. I specialize in building end-to-end AI systems — from data pipelines and model training to production deployment. My recent work includes a full RAG system for legal document research with citation verification, medical imaging classifiers published at SPIE, and Agentic-AI tooling for high-performance computing.
            </p>
            
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Core competencies:
            </p>
            
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>LLM applications, RAG pipelines, and retrieval systems</li>
              <li>Computer Vision and medical imaging (published researcher)</li>
              <li>Full-stack ML: Python, FastAPI, Docker, PostgreSQL, vector databases</li>
              <li>High-performance computing and distributed systems</li>
              <li>Production deployment and system architecture</li>
            </ul>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              I&apos;ve contributed to published research at <Link href="https://midilab.notion.site/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">MIDI Lab</Link> (medical imaging) and built developer tools at MSU&apos;s <Link href="https://icer.msu.edu/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">Institute for Cyber-Enabled Research</Link>. I&apos;m focused on building reliable, well-architected AI systems that deliver measurable results.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Education</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  B.S. Computational Data Science, Minor in Mathematics<br />
                  Michigan State University<br />
                  <span className="text-gray-500 dark:text-gray-400">Spring 2026</span>
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Looking For</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  MLE / AI Engineer roles, ML consulting engagements, and research collaborations in NLP, computer vision, or applied AI.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 