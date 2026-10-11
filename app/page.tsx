import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Certifications from "@/components/Certifications";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Hackathons from "@/components/Hackathons";
import Experience from "@/components/Experience";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="relative">
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Hackathons />
      <Education />
      <Certifications />
      <Achievements />
      <Contact />
      </main>
      <Footer />
    </>
  );
}
