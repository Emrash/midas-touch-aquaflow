
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useConsultation } from "@/contexts/ConsultationContext";
import { Droplet, Filter, Gauge, Activity, Wrench, FileText, Compass, Server } from "lucide-react";
import { motion } from "framer-motion";

// Service details database
const serviceDetails = {
  "geophysical-survey": {
    title: "Geophysical Survey",
    icon: <Compass className="h-12 w-12 text-mdpc-blue" />,
    description: "Our advanced geophysical surveys utilize state-of-the-art equipment and methodologies to identify optimal drilling locations with high water yield potential.",
    benefits: [
      "Reduced drilling costs by identifying optimal locations",
      "Higher success rate for water-bearing zones",
      "Detailed subsurface analysis and mapping",
      "Identification of geological structures and aquifers",
      "Custom reports with detailed findings and recommendations"
    ],
    process: [
      "Initial site assessment and consultation",
      "Vertical electrical sounding (VES) and resistivity surveys",
      "Ground-penetrating radar analysis where applicable",
      "Data processing and interpretation",
      "Comprehensive reporting with recommended drilling points"
    ],
    equipment: ["Resistivity meters", "Ground-penetrating radar systems", "GPS mapping tools", "Advanced data interpretation software"],
    banner: "https://images.unsplash.com/photo-1530968033775-2c92736b131e?auto=format&fit=crop&q=80&w=2000",
    category: "drilling"
  },
  "borehole-drilling": {
    title: "Borehole Drilling",
    icon: <Droplet className="h-12 w-12 text-mdpc-blue" />,
    description: "Our expert borehole drilling services utilize modern rigs and equipment to create deep, high-yield water sources for residential, commercial, and industrial applications.",
    benefits: [
      "Reliable, independent water supply",
      "Cost-effective long-term solution",
      "Reduced dependence on municipal water",
      "Consistent water quality and availability",
      "Professional installation with minimal disruption"
    ],
    process: [
      "Site preparation and access planning",
      "Drilling with appropriate rig and technique",
      "Casing installation and protection",
      "Gravel packing and sanitary sealing",
      "Development and yield testing",
      "Pump installation and system connection"
    ],
    equipment: ["DTH and mud rotary drilling rigs", "Borehole casings and screens", "Development tools", "Test pumping equipment"],
    banner: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&q=80&w=2000",
    category: "drilling"
  },
  "water-treatment": {
    title: "Water Treatment",
    icon: <Filter className="h-12 w-12 text-mdpc-blue" />,
    description: "Our comprehensive water treatment solutions ensure clean, safe, and potable water through advanced filtration and purification technologies tailored to your specific needs.",
    benefits: [
      "Clean, safe drinking water that meets health standards",
      "Removal of contaminants, bacteria, and impurities",
      "Improved taste, odor, and clarity",
      "Customized solutions based on water analysis",
      "Ongoing water quality monitoring"
    ],
    process: [
      "Initial water quality testing",
      "Treatment system design based on analysis",
      "Installation of filtration and purification components",
      "System commissioning and optimization",
      "Regular maintenance and filter replacement schedule"
    ],
    equipment: ["Multi-stage filtration systems", "UV purification units", "Reverse osmosis systems", "Water softeners", "Chemical dosing systems where required"],
    banner: "https://images.unsplash.com/photo-1544381073-8bf1465c3a9c?auto=format&fit=crop&q=80&w=2000",
    category: "drilling"
  },
  "pump-installation": {
    title: "Pump Installation",
    icon: <Activity className="h-12 w-12 text-mdpc-blue" />,
    description: "We provide professional installation of submersible pumps, surface pumps, and complete pumping systems designed for optimal water delivery and efficiency.",
    benefits: [
      "Optimized water extraction and delivery",
      "Energy-efficient pump selection",
      "Professional installation ensuring longer pump life",
      "Complete system integration with existing infrastructure",
      "Reduced maintenance issues and downtime"
    ],
    process: [
      "Site assessment and pump specification",
      "Selection of appropriate pump type and capacity",
      "Professional installation and wiring",
      "Control system setup and testing",
      "Performance optimization and user training"
    ],
    equipment: ["Submersible pumps (various capacities)", "Surface pumps", "Pressure tanks and controllers", "Monitoring and protection devices"],
    banner: "https://images.unsplash.com/photo-1510936994138-07e06c7c5add?auto=format&fit=crop&q=80&w=2000",
    category: "drilling"
  },
  "maintenance-repair": {
    title: "Maintenance & Repair",
    icon: <Wrench className="h-12 w-12 text-mdpc-blue" />,
    description: "Our comprehensive maintenance and repair services ensure your water systems continue functioning efficiently, extending their lifespan and preventing costly breakdowns.",
    benefits: [
      "Extended system lifespan",
      "Early problem detection",
      "Consistent water supply reliability",
      "Optimized system performance",
      "Lower long-term operational costs"
    ],
    process: [
      "Regular scheduled maintenance visits",
      "Comprehensive system inspection",
      "Water quality testing",
      "Component cleaning and servicing",
      "Parts replacement as needed",
      "Performance testing and optimization"
    ],
    equipment: ["Diagnostic testing equipment", "Specialized repair tools", "Genuine replacement parts", "Water quality testing kits"],
    banner: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&q=80&w=2000",
    category: "drilling"
  },
  "consultation-services": {
    title: "Consultation Services",
    icon: <FileText className="h-12 w-12 text-mdpc-blue" />,
    description: "Our expert consultation services provide professional guidance on water supply solutions, system design, water management, and regulatory compliance.",
    benefits: [
      "Expert guidance from industry professionals",
      "Customized solutions for your specific needs",
      "Regulatory compliance assistance",
      "Cost-effective planning and implementation",
      "Technical documentation and support"
    ],
    process: [
      "Initial consultation and needs assessment",
      "Site survey and data collection",
      "Technical analysis and solution development",
      "Presentation of options and recommendations",
      "Implementation planning and project management"
    ],
    equipment: ["Water resource mapping tools", "Advanced planning software", "Regulatory compliance databases", "Project management systems"],
    banner: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2000",
    category: "drilling"
  },
  "industrial-control": {
    title: "Industrial Control & Stanchion",
    icon: <Server className="h-12 w-12 text-mdpc-gold" />,
    description: "We provide comprehensive industrial water control systems and stanchion construction for large-scale water management and distribution projects.",
    benefits: [
      "Automated water distribution and control",
      "Industrial-grade reliability and durability",
      "Remote monitoring and management capabilities",
      "Integration with existing industrial systems",
      "Customized solutions for specific industry needs"
    ],
    process: [
      "Requirements analysis and system design",
      "Custom control panel fabrication",
      "Stanchion construction and installation",
      "System integration and automation",
      "Testing, commissioning, and operator training"
    ],
    equipment: ["Industrial PLCs and controllers", "SCADA systems", "Telemetry equipment", "Heavy-duty stanchions and mounting infrastructure"],
    banner: "https://images.unsplash.com/photo-1565043534407-07bef781c3f1?auto=format&fit=crop&q=80&w=2000",
    category: "drilling"
  }
};

type ServiceParams = {
  serviceId: string;
};

const ServiceDetail = () => {
  const { serviceId } = useParams<ServiceParams>();
  const navigate = useNavigate();
  const { openModal } = useConsultation();
  const [service, setService] = useState<any>(null);

  useEffect(() => {
    // Find service details by ID
    const serviceData = serviceDetails[serviceId as keyof typeof serviceDetails];
    
    if (serviceData) {
      setService(serviceData);
      document.title = `${serviceData.title} | Midas Touch`;
    } else {
      // Redirect to services page if service not found
      navigate("/services");
    }
  }, [serviceId, navigate]);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mdpc-blue mx-auto"></div>
          <p className="mt-4 text-mdpc-brown-dark">Loading service details...</p>
        </div>
      </div>
    );
  }

  const handleRequestConsultation = () => {
    openModal(
      service.category as 'drilling' | 'logistics' | 'general', 
      `Request ${service.title} Service`, 
      `Tell us about your ${service.title.toLowerCase()} needs and we'll get back to you within 24 hours.`
    );
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24">
        {/* Hero Banner */}
        <div className="relative h-[300px] md:h-[400px] overflow-hidden">
          <div className="absolute inset-0">
            <img src={service.banner} alt={service.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-mdpc-brown-dark/80 to-mdpc-blue/60"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10 h-full flex items-center">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">{service.title}</h1>
                <p className="text-xl text-white/90">{service.description}</p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Service Content */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="mb-12">
                  <h2 className="text-2xl md:text-3xl font-heading font-bold text-mdpc-blue mb-6">Service Overview</h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-mdpc-brown-dark">{service.description}</p>
                    
                    {/* Process */}
                    <h3 className="text-xl font-heading font-bold text-mdpc-brown-dark mt-8 mb-4">Our Process</h3>
                    <ol className="space-y-2 mb-8">
                      {service.process.map((step: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="bg-mdpc-gold text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1 flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-mdpc-brown-dark">{step}</span>
                        </li>
                      ))}
                    </ol>
                    
                    {/* Equipment */}
                    <h3 className="text-xl font-heading font-bold text-mdpc-brown-dark mt-8 mb-4">Equipment & Technology</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                      {service.equipment.map((item: string, index: number) => (
                        <li key={index} className="flex items-center bg-gray-50 p-3 rounded-md">
                          <div className="w-2 h-2 bg-mdpc-blue rounded-full mr-2"></div>
                          <span className="text-mdpc-brown-dark">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Gallery - placeholder for now */}
                <div className="mb-12">
                  <h2 className="text-2xl md:text-3xl font-heading font-bold text-mdpc-blue mb-6">Service Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src={`https://images.unsplash.com/photo-155${item}665076-5d1cead80b5c?auto=format&fit=crop&q=80&w=500`} 
                          alt={`${service.title} gallery ${item}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Service Icon */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-heading font-bold text-mdpc-blue mb-4">{service.title}</h3>
                  <p className="text-mdpc-brown-dark mb-6">{service.description}</p>
                  <Button 
                    onClick={handleRequestConsultation} 
                    className="w-full bg-mdpc-gold hover:bg-mdpc-gold-dark text-white"
                  >
                    Request This Service
                  </Button>
                </div>
                
                {/* Benefits */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-heading font-bold text-mdpc-blue mb-4">Key Benefits</h3>
                  <ul className="space-y-3">
                    {service.benefits.map((benefit: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-mdpc-gold mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-mdpc-brown-dark">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Contact Card */}
                <div className="bg-mdpc-blue rounded-xl p-6 text-white">
                  <h3 className="text-xl font-heading font-bold mb-4">Need Expert Advice?</h3>
                  <p className="mb-6">Our technical team is ready to answer your questions and provide personalized guidance.</p>
                  <Button 
                    onClick={handleRequestConsultation} 
                    variant="outline" 
                    className="w-full border-white text-white hover:bg-white/10"
                  >
                    Contact Our Experts
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Related Services */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-mdpc-blue mb-8 text-center">Related Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(serviceDetails)
                .filter(([id]) => id !== serviceId)
                .slice(0, 3)
                .map(([id, relatedService]) => (
                  <div 
                    key={id} 
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/services/${id}`)}
                  >
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={(relatedService as any).banner} 
                        alt={(relatedService as any).title} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-heading font-bold text-mdpc-blue mb-2">{(relatedService as any).title}</h3>
                      <p className="text-mdpc-brown-dark line-clamp-2 mb-4">{(relatedService as any).description}</p>
                      <Button 
                        variant="link" 
                        className="p-0 text-mdpc-blue hover:text-mdpc-gold"
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-mdpc-blue to-mdpc-blue-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Contact our team today to discuss your project needs and how our {service.title.toLowerCase()} services can benefit you.
            </p>
            <Button 
              onClick={handleRequestConsultation} 
              size="lg" 
              className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white font-medium"
            >
              Request a Consultation
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceDetail;
