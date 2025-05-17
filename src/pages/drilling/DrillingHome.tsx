
import { useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import HeroSection from "../../components/home/HeroSection";
import ServicesSection from "../../components/home/ServicesSection";
import ProjectsSection from "../../components/home/ProjectsSection";
import WhyChooseSection from "../../components/home/WhyChooseSection";
import DrillingRequestForm from "../../components/forms/DrillingRequestForm";
import Map from "../../components/ui/Map";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

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
              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 animate-fade-in">Drilling & Project Consultation</h1>
              <p className="text-xl mb-8 animate-fade-in" style={{animationDelay: "0.2s"}}>Nigeria's leading borehole drilling and water solutions provider. Expert services for residential, commercial, and industrial needs.</p>
              <div className="flex flex-wrap gap-4 justify-center animate-fade-in" style={{animationDelay: "0.4s"}}>
                <Button asChild size="lg" className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white">
                  <a href="#services">Our Services</a>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <Link to="/projects">View Projects</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section id="services" className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-16">Our Drilling & Water Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-mdpc-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Geophysical Survey</h3>
                <p className="text-gray-600 mb-4">Professional site assessment using advanced geophysical methods to identify optimal drilling locations with high water yield potential.</p>
                <Button variant="link" className="text-mdpc-blue p-0 flex items-center gap-1">
                  Learn More <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-mdpc-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Borehole Drilling</h3>
                <p className="text-gray-600 mb-4">Expert drilling services using state-of-the-art equipment to create deep, high-yield boreholes for reliable water supply.</p>
                <Button variant="link" className="text-mdpc-blue p-0 flex items-center gap-1">
                  Learn More <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-mdpc-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Water Treatment</h3>
                <p className="text-gray-600 mb-4">Comprehensive water filtration and purification solutions to ensure clean, safe, and potable water for all your needs.</p>
                <Button variant="link" className="text-mdpc-blue p-0 flex items-center gap-1">
                  Learn More <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-mdpc-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Pump Installation</h3>
                <p className="text-gray-600 mb-4">Professional installation of submersible pumps, surface pumps, and complete pumping systems for optimal water delivery.</p>
                <Button variant="link" className="text-mdpc-blue p-0 flex items-center gap-1">
                  Learn More <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-mdpc-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Maintenance & Repair</h3>
                <p className="text-gray-600 mb-4">Regular maintenance, troubleshooting, and repair services to keep your water systems functioning efficiently.</p>
                <Button variant="link" className="text-mdpc-blue p-0 flex items-center gap-1">
                  Learn More <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-mdpc-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Consultation Services</h3>
                <p className="text-gray-600 mb-4">Expert guidance and advice on water supply solutions, system design, water management, and regulatory compliance.</p>
                <Button variant="link" className="text-mdpc-blue p-0 flex items-center gap-1">
                  Learn More <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="request-service" className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4">Request Our Drilling Services</h2>
              <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Fill out the form below to request our services. Our team will get back to you as soon as possible to discuss your project requirements.</p>
              <DrillingRequestForm />
            </div>
          </div>
        </section>
        
        <section id="our-projects" className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-16">Our Projects Across Osun State</h2>
            <div className="max-w-5xl mx-auto">
              <Map 
                center={[7.5898, 4.5737]} 
                zoom={10} 
                markers={[
                  { position: [7.5898, 4.5737], popup: "Midas Touch HQ, Osogbo", isMain: true },
                  { position: [7.6256, 4.1861], popup: "Borehole Project - Ife", isMain: false },
                  { position: [7.5380, 4.5060], popup: "Water Treatment System - Osogbo GRA", isMain: false },
                  { position: [7.7667, 4.5556], popup: "Industrial Water System - Ilesa", isMain: false },
                  { position: [7.6214, 4.2417], popup: "Community Borehole - OAU Campus", isMain: false },
                ]}
                height="500px"
              />
            </div>
          </div>
        </section>
        
        <WhyChooseSection />
      </main>
      <Footer />
    </div>
  );
};

export default DrillingHome;
