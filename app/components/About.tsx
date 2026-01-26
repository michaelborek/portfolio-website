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
              I&apos;m a passionate senior at Michigan State University majoring in Computational Data Science and Mathematics with a focus on Machine Learning and Artificial Intelligence. I work as a research assistant for Dr. Adam Alessio, where I am developing a model to classify X-ray images of lungs to detect Pneumoconiosis. Moreover, I am a Software Engineer Intern at the Institute for Cyber Enabled Research (iCER), where I am developing tools on High Performance Computing Clusters (HPCC) to help researchers with their work. My journey in the world of technology began with a curiosity about how computers learn and make decisions, which led me to dive deep into the fascinating field of AI.
            </p>
            
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Throughout my academic journey, I&apos;ve developed a strong foundation in:
            </p>
            
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Machine Learning algorithms and frameworks</li>
              <li>Data analysis and visualization</li>
              <li>Python programming and scientific computing</li>
              <li>Deep learning and neural networks</li>
              <li>Natural Language Processing</li>
              <li>Computer Vision</li>
            </ul>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Beyond academics, I&apos;m actively involved in research projects at <Link href="https://midilab.notion.site/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">Medical Imaging and Data Integration Lab (MIDI Lab)</Link> and ML competitions to apply my knowledge to real-world problems. I&apos;m particularly interested in the ethical implications of AI and how we can develop responsible systems that benefit humanity.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Education</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Bachelor&apos;s in Computational Data Science with Minor in Mathematics<br />
                  <span className="text-gray-500 dark:text-gray-400">Expected Graduation: Spring 2026</span>
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Interests</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  When I&apos;m not coding or studying, I enjoy playing basketball, seeing friends, and exploring the latest technological advancements.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 