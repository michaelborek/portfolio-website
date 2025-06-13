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
                    Your University
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">Degree in Computer Science</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">2018 - 2022</p>
                </div>
                {/* Add more education items as needed */}
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
                    Software Engineer
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">Company Name</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">2022 - Present</p>
                  <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-300">
                    <li>Key achievement or responsibility</li>
                    <li>Another key achievement</li>
                  </ul>
                </div>
                {/* Add more experience items as needed */}
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