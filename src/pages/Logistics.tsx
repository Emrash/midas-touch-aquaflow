
import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Button } from "@/components/ui/button";
import Map from "../components/ui/Map";
import FleetGallery from "../components/logistics/FleetGallery";
import { useConsultation } from "@/contexts/ConsultationContext";
import { Link } from "react-router-dom";

const Logistics = () => {
  const { openModal } = useConsultation();
  const [isFleetGalleryOpen, setIsFleetGalleryOpen] = useState(false);
  
  useEffect(() => {
    // Set title
    document.title = "Logistics Services | Midas Touch Drills and Projects Consult";
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Disable map scroll zoom by default (fix map scroll lock issue)
    const handleMapInteraction = () => {
      const maps = document.querySelectorAll('.leaflet-container');
      maps.forEach(map => {
        // Map will be initialized with wheel zoom disabled
        // This is handled in the Map component
      });
    };
    
    // Wait for map to be rendered
    setTimeout(handleMapInteraction, 1000);
  }, []);

  const handleContactLogistics = () => {
    openModal(
      'logistics', 
      'Contact Logistics Team', 
      "Tell us about your logistics needs and our team will get back to you within 24 hours."
    );
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative bg-mdpc-brown-dark">
          <div className="absolute inset-0 opacity-20">
            <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1616432043562-3e49c47e78ca?auto=format&fit=crop&q=80&w=2500')] bg-cover bg-center"></div>
          </div>
          <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">
                Transportation & Logistics Solutions
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Reliable transportation and logistics services for water systems, drilling equipment, 
                and construction materials across Nigeria.
              </p>
              <Button 
                onClick={() => openModal(
                  'logistics', 
                  'Request Logistics Quote', 
                  "Tell us about your logistics requirements and we'll provide a competitive quote."
                )}
                className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white font-semibold py-3 px-8 text-lg"
              >
                Request a Quote
              </Button>
            </div>
          </div>
        </section>
        
        {/* Services */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold text-mdpc-blue">Our Logistics Services</h2>
              <p className="text-mdpc-brown-dark mt-4 max-w-3xl mx-auto">
                Midas Touch Logistics provides comprehensive transportation solutions tailored to 
                meet the unique needs of water infrastructure and construction projects.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <LogisticsServiceCard 
                title="Heavy Equipment Transport"
                description="Specialized transportation for drilling rigs, water pumps, and other heavy machinery."
                icon={<TransportIcon />}
              />
              <LogisticsServiceCard 
                title="Construction Materials"
                description="Reliable delivery of pipes, filters, tanks, and all construction materials to your project site."
                icon={<MaterialsIcon />}
              />
              <LogisticsServiceCard 
                title="Nationwide Coverage"
                description="Our fleet operates across all 36 states of Nigeria, ensuring your materials arrive on time."
                icon={<CoverageIcon />}
              />
              <LogisticsServiceCard 
                title="Express Delivery"
                description="Urgent delivery service for time-sensitive project components and emergency equipment."
                icon={<ExpressIcon />}
              />
              <LogisticsServiceCard 
                title="Project Logistics Planning"
                description="Comprehensive logistics planning to ensure smooth operations for your entire project."
                icon={<PlanningIcon />}
              />
              <LogisticsServiceCard 
                title="Secure Storage"
                description="Temporary storage solutions for project materials and equipment between phases."
                icon={<StorageIcon />}
              />
            </div>
          </div>
        </section>
        
        {/* Fleet */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <h2 className="text-3xl font-heading font-bold text-mdpc-blue mb-4">Our Modern Fleet</h2>
                <p className="text-mdpc-brown-dark mb-6">
                  Our logistics division maintains a modern and diverse fleet of vehicles specifically designed for 
                  the transportation needs of water and construction projects.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-mdpc-gold mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <div>
                      <span className="font-bold">Heavy-duty trucks</span>
                      <p className="text-sm text-mdpc-brown">Capable of transporting drilling rigs and heavy equipment</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-mdpc-gold mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <div>
                      <span className="font-bold">Flat-bed trailers</span>
                      <p className="text-sm text-mdpc-brown">For oversized and specialty equipment transport</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-mdpc-gold mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <div>
                      <span className="font-bold">Specialized water tankers</span>
                      <p className="text-sm text-mdpc-brown">For clean water transportation to project sites</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-mdpc-gold mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <div>
                      <span className="font-bold">Light commercial vehicles</span>
                      <p className="text-sm text-mdpc-brown">For rapid delivery of smaller components and materials</p>
                    </div>
                  </li>
                </ul>
                <Button 
                  className="mt-6 bg-mdpc-blue hover:bg-mdpc-blue-dark text-white"
                  onClick={() => setIsFleetGalleryOpen(true)}
                >
                  View Our Fleet
                </Button>
              </div>
              <div className="md:w-1/2 grid grid-cols-2 gap-4">
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?auto=format&fit=crop&q=80&w=1000" 
                    alt="Heavy duty truck" 
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=1000" 
                    alt="Flat-bed trailer" 
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1000" 
                    alt="Water tanker" 
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1532386236358-a33d8a9434e3?auto=format&fit=crop&q=80&w=1000" 
                    alt="Light commercial vehicle" 
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Coverage Map */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold text-mdpc-blue">Our Coverage Area</h2>
              <p className="text-mdpc-brown-dark mt-4 max-w-3xl mx-auto">
                We provide nationwide logistics services across all 36 states of Nigeria, with strategically 
                located hubs to ensure efficient delivery to any location.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-[500px]">
                <Map 
                  center={[9.0820, 8.6753]} // Nigeria center coordinates
                  zoom={6}
                  markers={[
                    { position: [6.5244, 3.3792], popup: "Lagos Hub", isMain: true },
                    { position: [9.0765, 7.3986], popup: "Abuja Hub", isMain: true },
                    { position: [12.0022, 8.5920], popup: "Kano Hub", isMain: true },
                    { position: [4.8156, 7.0498], popup: "Port Harcourt Hub", isMain: true },
                    { position: [6.8428, 3.9350], popup: "Osun State Project" },
                    { position: [7.3775, 3.9470], popup: "Oyo State Project" },
                    { position: [6.2382, 5.6308], popup: "Edo State Project" },
                    { position: [10.2921, 9.2000], popup: "Plateau State Project" },
                    { position: [11.8465, 13.1600], popup: "Borno State Project" },
                  ]}
                />
              </div>
              <div className="p-6 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-mdpc-blue">Nationwide Coverage</h3>
                    <p className="text-mdpc-brown-dark text-sm">Our four strategically located hubs ensure efficient delivery across Nigeria</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="h-4 w-4 bg-mdpc-gold rounded-full mr-2"></div>
                      <span className="text-sm">Main Hubs</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-sm">Active Projects</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 bg-mdpc-blue">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-heading font-bold text-white mb-4">Ready to Ship Your Equipment?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Contact our logistics team today to discuss your transportation needs and get a customized quote.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={() => openModal(
                  'logistics', 
                  'Request Logistics Quote', 
                  "Tell us about your logistics requirements and we'll provide a competitive quote."
                )}
                className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white font-semibold py-3 px-8 text-lg"
              >
                Request Quote
              </Button>
              <Button 
                onClick={handleContactLogistics}
                className="bg-white hover:bg-gray-100 text-mdpc-blue font-semibold py-3 px-8 text-lg"
              >
                Contact Logistics Team
              </Button>
            </div>
          </div>
        </section>
        
        {/* Fleet Gallery Modal */}
        <FleetGallery 
          isOpen={isFleetGalleryOpen} 
          onClose={() => {
            setIsFleetGalleryOpen(false);
            // If user closed the gallery to get a quote, open the consultation modal
            if (window.confirm("Would you like to request a logistics quote?")) {
              openModal(
                'logistics', 
                'Request Logistics Quote', 
                "Tell us about your logistics requirements and we'll provide a competitive quote."
              );
            }
          }} 
        />
      </main>
      <Footer />
    </div>
  );
};

// Service Card Component
const LogisticsServiceCard = ({ title, description, icon }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
      <div className="bg-blue-50 h-14 w-14 rounded-lg flex items-center justify-center mb-4 text-mdpc-blue">
        {icon}
      </div>
      <h3 className="text-xl font-heading font-bold text-mdpc-blue mb-2">{title}</h3>
      <p className="text-mdpc-brown-dark">{description}</p>
    </div>
  );
};

// Icons
const TransportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const MaterialsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path d="M3 9l2.45-4.9A2 2 0 017.24 3h9.52a2 2 0 011.8 1.1L21 9" />
    <path d="M12 3v6" />
  </svg>
);

const CoverageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);

const ExpressIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const PlanningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 14l-3-3h-7a1 1 0 01-1-1V4a1 1 0 011-1h9a1 1 0 011 1v10z" />
    <path d="M14 15v2a1 1 0 01-1 1H6L3 21v-4a1 1 0 011-1h9a1 1 0 011 1z" />
  </svg>
);

const StorageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 5C3 3.895 3.895 3 5 3H19C20.105 3 21 3.895 21 5V9C21 10.105 20.105 11 19 11H5C3.895 11 3 10.105 3 9V5Z" />
    <path d="M3 15C3 13.895 3.895 13 5 13H19C20.105 13 21 13.895 21 15V19C21 20.105 20.105 21 19 21H5C3.895 21 3 20.105 3 19V15Z" />
  </svg>
);

export default Logistics;
