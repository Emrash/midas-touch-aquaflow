
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServiceCard from "@/components/ui/ServiceCard";
import { useConsultation } from "@/contexts/ConsultationContext";
import { 
  Compass, 
  Droplet, 
  Filter, 
  Activity, 
  Wrench, 
  FileText, 
  Server, 
  PickaxeIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: "geophysical-survey",
    title: "Geophysical Survey",
    description: "Advanced survey techniques to identify optimal drilling locations with high water yield potential.",
    icon: <Compass className="h-8 w-8 text-white" />,
    color: "bg-blue-500",
    link: "/services/geophysical-survey"
  },
  {
    id: "borehole-drilling",
    title: "Borehole Drilling",
    description: "Expert drilling services for new wells using state-of-the-art equipment for maximum efficiency.",
    icon: <Droplet className="h-8 w-8 text-white" />,
    color: "bg-mdpc-blue",
    link: "/services/borehole-drilling"
  },
  {
    id: "water-treatment",
    title: "Water Treatment",
    description: "Custom filtration solutions to ensure clean, safe water for residential and industrial uses.",
    icon: <Filter className="h-8 w-8 text-white" />,
    color: "bg-cyan-500",
    link: "/services/water-treatment"
  },
  {
    id: "pump-installation",
    title: "Pump Installation",
    description: "Professional installation and setup of water pumps, control systems, and distribution networks.",
    icon: <Activity className="h-8 w-8 text-white" />,
    color: "bg-indigo-500",
    link: "/services/pump-installation"
  },
  {
    id: "maintenance-repair",
    title: "Maintenance & Repair",
    description: "Scheduled maintenance and emergency repair services to keep your water systems operational.",
    icon: <Wrench className="h-8 w-8 text-white" />,
    color: "bg-indigo-500",
    link: "/services/maintenance-repair"
  },
  {
    id: "consultation-services",
    title: "Consultation Services",
    description: "Expert guidance on water supply solutions, regulatory compliance, and system optimization.",
    icon: <FileText className="h-8 w-8 text-white" />,
    color: "bg-mdpc-gold",
    link: "/services/consultation-services"
  },
  {
    id: "industrial-control",
    title: "Industrial Control & Stanchion",
    description: "Engineering solutions for industrial water control systems and stanchion construction.",
    icon: <Server className="h-8 w-8 text-white" />,
    color: "bg-amber-600",
    link: "/services/industrial-control"
  },
  {
    id: "mining-core-drilling",
    title: "Mining & Core Drilling",
    description: "Specialized drilling services for mining operations and core sample extraction.",
    icon: <PickaxeIcon className="h-8 w-8 text-white" />,
    color: "bg-green-500",
    link: "/services/mining-core-drilling"
  }
];

const Services = () => {
  const { openModal } = useConsultation();
  
  useEffect(() => {
    document.title = "Our Services | Midas Touch";
  }, []);

  const handleRequestService = (serviceName: string) => {
    openModal(
      'general',
      `Request ${serviceName}`, 
      `Tell us about your ${serviceName.toLowerCase()} needs and we'll get back to you within 24 hours.`
    );
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-mdpc-blue to-mdpc-blue-dark text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-heading font-bold mb-6">Our Services</h1>
              <p className="text-xl text-blue-100 mb-8">
                From initial survey to installation and maintenance, we provide comprehensive water solutions
                tailored to your specific needs with the highest standards of quality.
              </p>
              <Button 
                onClick={() => openModal('general', 'Request a Consultation', "Tell us about your project needs and we'll get back to you within 24 hours.")}
                className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white font-medium"
              >
                Request a Consultation
              </Button>
            </div>
          </div>
        </section>
        
        {/* Services Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-heading font-bold text-mdpc-blue mb-12 text-center">
              Complete Water Solution Services
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  color={service.color}
                  delay={index}
                  actionLabel="Learn More"
                  link={service.link}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Why Choose Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-heading font-bold text-mdpc-blue mb-6">
                  Why Choose Midas Touch For Your Water Solutions?
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-6 h-6 text-mdpc-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Expert Teams</h3>
                      <p className="text-mdpc-brown-dark">Our technicians and engineers bring years of specialized experience in water solutions and drilling technologies.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-6 h-6 text-mdpc-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Quality Assurance</h3>
                      <p className="text-mdpc-brown-dark">We adhere to the highest industry standards and use only premium materials and equipment for lasting results.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-6 h-6 text-mdpc-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Timely Delivery</h3>
                      <p className="text-mdpc-brown-dark">We understand the importance of water access and complete all projects efficiently without compromising quality.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-6 h-6 text-mdpc-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Complete Solutions</h3>
                      <p className="text-mdpc-brown-dark">From initial assessment to ongoing maintenance, we offer end-to-end water solutions for all your needs.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1581906853372-e28758ad894c?auto=format&fit=crop&q=80&w=500" 
                    alt="Drilling professional" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square overflow-hidden rounded-lg mt-6">
                  <img 
                    src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=500" 
                    alt="Water treatment" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1584286595398-a67f382e4513?auto=format&fit=crop&q=80&w=500" 
                    alt="Filtration system" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square overflow-hidden rounded-lg mt-6">
                  <img 
                    src="https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=500" 
                    alt="Industrial water system" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 bg-mdpc-blue">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-heading font-bold text-white mb-6">Ready to Start Your Project?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Contact our team today to discuss your water solution needs and get a personalized consultation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={() => openModal('general', 'Request a Consultation', "Tell us about your project needs and we'll get back to you within 24 hours.")}
                size="lg"
                className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white font-medium"
              >
                Request a Consultation
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                <Link to="/projects">View Our Projects</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
