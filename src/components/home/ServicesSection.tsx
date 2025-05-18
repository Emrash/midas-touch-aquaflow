
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ServiceCard from "../ui/ServiceCard";
import { Button } from "@/components/ui/button";
import { useConsultation } from "@/contexts/ConsultationContext";
import { 
  ActivityIcon, 
  DropletIcon, 
  GaugeIcon, 
  WrenchIcon, 
  FilterIcon, 
  ServerIcon, 
  PickaxeIcon, 
  CompassIcon
} from "./ServiceIcons";

const ServicesSection = () => {
  const navigate = useNavigate();
  const { openModal } = useConsultation();
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const services = [
    {
      id: "geophysical-survey",
      title: "Geophysical Survey",
      description: "Advanced surveying to identify optimal drilling locations using state-of-the-art equipment and techniques.",
      icon: <CompassIcon className="h-8 w-8 text-white" />,
      color: "bg-blue-500",
      link: "/services/geophysical-survey"
    },
    {
      id: "borehole-drilling",
      title: "Borehole Drilling & Rehabilitation",
      description: "Expert drilling services for new boreholes and rehabilitation of existing ones with precision and efficiency.",
      icon: <DropletIcon className="h-8 w-8 text-white" />,
      color: "bg-mdpc-blue",
      link: "/services/borehole-drilling"
    },
    {
      id: "water-treatment",
      title: "Water Treatment",
      description: "Comprehensive water filtration solutions to ensure clean, safe water for residential and industrial use.",
      icon: <FilterIcon className="h-8 w-8 text-white" />,
      color: "bg-cyan-500",
      link: "/services/water-treatment"
    },
    {
      id: "pump-installation",
      title: "Pump Installation",
      description: "Complete pump services including testing, supply, installation, and maintenance for optimal performance.",
      icon: <WrenchIcon className="h-8 w-8 text-white" />,
      color: "bg-indigo-500",
      link: "/services/pump-installation"
    },
    {
      id: "maintenance-repair",
      title: "Maintenance & Repair",
      description: "Regular and emergency maintenance services to ensure your water systems remain operational and efficient.",
      icon: <ActivityIcon className="h-8 w-8 text-white" />,
      color: "bg-teal-500",
      link: "/services/maintenance-repair"
    },
    {
      id: "industrial-control",
      title: "Industrial Control & Stanchion",
      description: "Engineering solutions for industrial water control systems and stanchion construction.",
      icon: <ServerIcon className="h-8 w-8 text-white" />,
      color: "bg-mdpc-gold",
      link: "/services/industrial-control"
    },
    {
      id: "mining-core-drilling",
      title: "Mining & Core Drilling",
      description: "Specialized drilling services for mining operations and core sample extraction with precision equipment.",
      icon: <PickaxeIcon className="h-8 w-8 text-white" />,
      color: "bg-amber-600",
      link: "/services/mining-core-drilling"
    },
    {
      id: "consultation-services",
      title: "Consultation Services",
      description: "Expert guidance on water supply solutions, system optimization, and regulatory compliance.",
      icon: <ActivityIcon className="h-8 w-8 text-white" />,
      color: "bg-green-500",
      link: "/services/consultation-services"
    }
  ];

  const handleServiceAction = (serviceId: string, serviceName: string) => {
    // Navigate to service detail page
    navigate(`/services/${serviceId}`);
  };

  const handleDiscussProject = () => {
    openModal('general', 'Discuss Your Project', "Tell us about your project needs and we'll get back to you within 24 hours.");
  };

  return (
    <section id="services" ref={sectionRef} className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="section-title">Our Services</h2>
          <p className="text-mdpc-brown-dark mt-8">
            We provide comprehensive water solutions from initial survey to installation and maintenance.
            Our services are tailored to meet the specific needs of each client with the highest standards of quality.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              icon={service.icon}
              color={service.color}
              delay={index}
              isInView={isInView}
              onAction={() => handleServiceAction(service.id, service.title)}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-mdpc-blue font-medium mb-6">
            Need a custom solution for your project? Contact our expert team today.
          </p>
          <Button 
            onClick={handleDiscussProject} 
            className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-md"
          >
            Discuss Your Project
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
