import React from 'react';

const Resume = () => {
  return (
    <section id="resume" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            My <span className="text-blue-600 dark:text-blue-400">Resume</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Education Section */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                Education
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Michigan State University
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">Computational Data Science with minor in Mathematics</p>
                  <p className="text-gray-600 dark:text-gray-300">Honors College</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">GPA: 3.835</p>
                </div>
              </div>
            </div>

            {/* Experience Section */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                Experience
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Research Assistant
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">Institute for Quantitative Health Science & Engineering at MSU</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Nov. 2023 – Present</p>
                  <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-300 text-sm space-y-1">
                    <li>Designed and implemented an ordinal classification pipeline on 708 NIOSH chest X-rays, leveraging pre-trained ResNet-50 (TorchXRayVision) with a 64/16/20 split and rigorous data augmentation.</li>
                    <li>Benchmarked four loss regimes—Cross-Entropy, MSE regression, multi-task conditional, and novel Hierarchical Cross-Entropy—achieving 71.4% test accuracy and reduced misclassification in critical ordinal boundaries.</li>
                    <li>Orchestrated end-to-end training workflows (512×512 resizing, fine-tuning, ensemble averaging).</li>
                    <li>Co-authored SPIE 2025 paper and presented findings at Michigan State's UURAF 2025, highlighting advancements in ordinal DL loss design.</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Software Engineer Intern
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">Institute for Cyber-Enabled Research at MSU</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Jun. 2023 – Present</p>
                  <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-300 text-sm space-y-1">
                    <li>Developed and delivered a Python curriculum on MSU HPCC, covering introduction to Python, NumPy-based tensor operations, and best practices for large project developments.</li>
                    <li>Authored a Python module to automate loading and launching of LM Studio under SLURM, enabling one-command startup of large language model workflows.</li>
                    <li>Engineered an AI-driven agent that statically analyzes SLURM sbatch scripts, identifies suboptimal resource allocations, and recommends tuned CPU/GPU/memory parameters to accelerate DL training.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Download Resume Button */}
          <div className="text-center mt-12">
            <a
              href="/resume.pdf"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume; 