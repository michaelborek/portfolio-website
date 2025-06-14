import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ClientOnly from './components/ClientOnly';
import Resume from './components/Resume';

export default function Home() {
  // Create simple fallbacks to render on server
  const simpleFallback = (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
          <div className="text-xl font-bold text-black dark:text-white">
            Michal<span className="text-blue-500">.</span>
          </div>
          <div className="hidden md:flex md:gap-x-8">
            {['Home', 'About', 'Skills', 'Projects', 'Resume', 'Contact'].map((link) => (
              <div key={link} className="text-sm font-semibold text-black dark:text-white">
                {link}
              </div>
            ))}
          </div>
        </nav>
      </header>
      
      <section className="relative min-h-screen flex items-center justify-center py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-black z-0" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Loading Portfolio...
            </h1>
          </div>
        </div>
      </section>
    </>
  );
  
  // Simple fallback for projects section
  const projectsFallback = (
    <section id="projects" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            My <span className="text-blue-600 dark:text-blue-400">Projects</span>
          </h2>
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-gray-600 dark:text-gray-300">Loading projects...</p>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <main className="flex min-h-screen flex-col font-[family-name:var(--font-geist-sans)]">
      {/* Fixed navbar at the top */}
      <ClientOnly>
        <Navbar />
      </ClientOnly>
      
      {/* Main content sections in proper order */}
      <ClientOnly fallback={simpleFallback}>
        <Hero />
      </ClientOnly>
      
      <About />
      
      <ClientOnly>
        <Skills />
      </ClientOnly>
      
      <ClientOnly fallback={projectsFallback}>
        <Projects />
      </ClientOnly>
      
      <Resume />
      
      <ClientOnly>
        <Contact />
      </ClientOnly>
      
      <Footer />
    </main>
  );
}
