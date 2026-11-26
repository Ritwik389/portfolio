import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Research from "@/components/sections/Research";
import Work from "@/components/sections/Work";
import ExperimentLab from "@/components/site/ExperimentLab";
import Experience from "@/components/sections/Experience";
import About from "@/components/sections/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div id="site">
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Research />
        <Work />
        <ExperimentLab />
        <Experience />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
