import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Resume from './components/Resume';
import Projects from './components/Projects';
import Research from './components/Research';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ClientOnly from './components/ClientOnly';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col font-[family-name:var(--font-geist-sans)]">
      {/* Fixed navbar at the top - needs client-side for interactions */}
      <ClientOnly>
        <Navbar />
      </ClientOnly>
      
      {/* Main content sections */}
      <Hero />
      <About />
      <Skills />
      <Resume />
      <Projects />
      <Research />
      <Contact />
      <Footer />
    </main>
  );
}
