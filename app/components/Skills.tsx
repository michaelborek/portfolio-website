'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaPython, FaReact, FaAws, FaDatabase } from 'react-icons/fa';
import { SiTensorflow, SiPytorch, SiJupyter, SiScipy, SiPandas, SiScikitlearn } from 'react-icons/si';

const skills = [
  {
    category: 'Programming Languages',
    items: [
      { name: 'Python', icon: <FaPython className="w-6 h-6" />, level: 90 },
      { name: 'SQL', icon: <FaDatabase className="w-6 h-6" />, level: 90 },
      { name: 'R', icon: null, level: 80 },
      { name: 'C++', icon: null, level: 75 },
    ]
  },
  {
    category: 'ML & Data Science',
    items: [
      { name: 'PyTorch', icon: <SiPytorch className="w-6 h-6" />, level: 85 },
      { name: 'TensorFlow', icon: <SiTensorflow className="w-6 h-6" />, level: 75 },
      { name: 'Scikit-Learn', icon: <SiScikitlearn className="w-6 h-6" />, level: 90 },
      { name: 'Pandas', icon: <SiPandas className="w-6 h-6" />, level: 95 },
      { name: 'NumPy', icon: <SiScipy className="w-6 h-6" />, level: 95 },
      { name: 'Jupyter', icon: <SiJupyter className="w-6 h-6" />, level: 95 },
    ]
  },
  {
    category: 'Web & Cloud',
    items: [
      { name: 'React', icon: <FaReact className="w-6 h-6" />, level: 70 },
      { name: 'AWS', icon: <FaAws className="w-6 h-6" />, level: 65 },
      { name: 'Docker', icon: null, level: 70 },
      { name: 'Flask/FastAPI', icon: null, level: 50 },
    ]
  }
];

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            My <span className="text-blue-600 dark:text-blue-400">Skills</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skillGroup, groupIndex) => (
              <motion.div
                key={skillGroup.category}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ 
                  duration: 0.5, 
                  delay: groupIndex * 0.2,
                  ease: "easeOut" 
                }}
                className="bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="bg-blue-600 dark:bg-blue-700 text-white py-3 px-5">
                  <h3 className="text-lg font-semibold">{skillGroup.category}</h3>
                </div>

                <div className="p-5 space-y-4">
                  {skillGroup.items.map((skill, skillIndex) => (
                    <div key={skill.name}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {skill.icon}
                          <span className="font-medium text-gray-800 dark:text-gray-200">{skill.name}</span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{skill.level}%</span>
                      </div>

                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                          transition={{ 
                            duration: 1, 
                            delay: groupIndex * 0.2 + skillIndex * 0.1 + 0.3,
                            ease: "easeOut" 
                          }}
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 