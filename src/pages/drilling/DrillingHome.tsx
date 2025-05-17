
import { useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import HeroSection from "../../components/home/HeroSection";
import ServicesSection from "../../components/home/ServicesSection";
import ProjectsSection from "../../components/home/ProjectsSection";
import WhyChooseSection from "../../components/home/WhyChooseSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const DrillingHome = () => {
  useEffect(() => {
    document.title = "Drilling & Project Consultation | Midas Touch";
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="bg-gradient-to-b from-mdpc-blue to-blue-900 text-white py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">Drilling & Project Consultation</h1>
              <p className="text-xl mb-8">Nigeria's leading borehole drilling and water solutions provider. Expert services for residential, commercial, and industrial needs.</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white">
                  <Link to="/drilling/services">Our Services</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <Link to="/drilling/projects">View Projects</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <ServicesSection />
        <ProjectsSection />
        <WhyChooseSection />
      </main>
      <Footer />
    </div>
  );
};

export default DrillingHome;
