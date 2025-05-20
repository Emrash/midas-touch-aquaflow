import { useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import WhyChooseSection from "../../components/home/WhyChooseSection";
import Map from "../../components/ui/Map";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Droplet, Filter, Gauge, Activity, Wrench, FileText } from "lucide-react";
import { useConsultation } from "@/contexts/ConsultationContext";
import { motion } from "framer-motion";
import drillingImage1 from "../../assets/driiling1.jpg";
import drillingImage2 from "../../assets/drilling2.jpg";
import drillingImage3 from "../../assets/drilling3.jpg";
import drillingRig from "../../assets/drilling_rig.jpg";

const serviceItems = [
  {
    title: "Geophysical Survey",
    icon: <Gauge className="h-8 w-8 text-mdpc-blue" />,
    description: "Professional site assessment using advanced geophysical methods to identify optimal drilling locations with high water yield potential."
  },
  {
    title: "Borehole Drilling",
    icon: <Droplet className="h-8 w-8 text-mdpc-blue" />,
    description: "Expert drilling services using state-of-the-art equipment to create deep, high-yield boreholes for reliable water supply."
  },
  {
    title: "Water Treatment",
    icon: <Filter className="h-8 w-8 text-mdpc-blue" />,
    description: "Comprehensive water filtration and purification solutions to ensure clean, safe, and potable water for all your needs."
  },
  {
    title: "Pump Installation",
    icon: <Activity className="h-8 w-8 text-mdpc-blue" />,
    description: "Professional installation of submersible pumps, surface pumps, and complete pumping systems for optimal water delivery."
  },
  {
    title: "Maintenance & Repair",
    icon: <Wrench className="h-8 w-8 text-mdpc-blue" />,
    description: "Regular maintenance, troubleshooting, and repair services to keep your water systems functioning efficiently."
  },
  {
    title: "Consultation Services",
    icon: <FileText className="h-8 w-8 text-mdpc-blue" />,
    description: "Expert guidance and advice on water supply solutions, system design, water management, and regulatory compliance."
  }
];

const DrillingHome = () => {
  const { openModal } = useConsultation();

  useEffect(() => {
    document.title = "Drilling & Project Consultation | Midas Touch";
  }, []);

  const handleRequestService = () => {
    openModal('drilling', 'Request Drilling Services', "Tell us about your drilling project needs and we'll get back to you within 24 hours.");
  };

  const handleGetQuote = () => {
    openModal('drilling', 'Get a Drilling Quote', "Fill in the details below and we'll provide you with a detailed quote for your project.");
  };

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.04, 0.62, 0.23, 0.98]
      }
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="bg-gradient-to-b from-mdpc-blue to-blue-900 text-white py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img src={drillingRig} alt="Drilling Equipment" className="w-full h-full object-cover" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-6xl font-heading font-bold mb-6"
              >
                Drilling & Project Consultation
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-xl mb-8"
              >
                Nigeria's leading borehole drilling and water solutions provider. Expert services for residential, commercial, and industrial needs.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap gap-4 justify-center"
              >
                <Button 
                  onClick={handleRequestService} 
                  size="lg" 
                  className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white"
                >
                  Request Service
                </Button>
                <Button 
                  onClick={handleGetQuote}
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white/10"
                >
                  Get a Quote
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
        
        <section id="services" className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-16">Our Drilling & Water Services</h2>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {serviceItems.map((service, index) => {
                // Selecting images dynamically based on index
                const images = [drillingImage1, drillingImage2, drillingImage3];
                const imageIndex = index % images.length;
                
                return (
                  <motion.div 
                    key={service.title}
                    variants={itemVariants}
                    className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="w-full h-32 mb-4 overflow-hidden rounded-lg">
                      <img 
                        src={images[imageIndex]} 
                        alt={service.title} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <Button variant="link" className="text-mdpc-blue p-0 flex items-center gap-1" onClick={() => openModal('drilling', `Learn More: ${service.title}`, `Get detailed information about our ${service.title.toLowerCase()} services.`)}>
                      Learn More <ArrowRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        <section id="request-service" className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
                Take the first step towards reliable water solutions for your home, business, or community. 
                Our professional team is ready to assist you.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                  onClick={handleRequestService}
                  size="lg" 
                  className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white"
                >
                  Request Drilling Services
                </Button>
                <Button 
                  onClick={handleGetQuote}
                  size="lg" 
                  variant="outline" 
                  className="border-mdpc-blue text-mdpc-blue hover:bg-mdpc-blue/5"
                >
                  Get a Detailed Quote
                </Button>
              </div>
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
              <div className="mt-8 text-center">
                <Button asChild className="bg-mdpc-blue hover:bg-mdpc-blue-dark">
                  <Link to="/projects">View All Our Projects</Link>
                </Button>
              </div>
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
