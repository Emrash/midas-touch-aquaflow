
import { useEffect, useState, useRef } from "react";
import ServiceCard from "../ui/ServiceCard";
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
      title: "Geophysical Survey",
      description: "Advanced surveying to identify optimal drilling locations using state-of-the-art equipment and techniques.",
      icon: <CompassIcon className="h-8 w-8 text-white" />,
      color: "bg-blue-500",
    },
    {
      title: "Borehole Drilling & Rehabilitation",
      description: "Expert drilling services for new boreholes and rehabilitation of existing ones with precision and efficiency.",
      icon: <DropletIcon className="h-8 w-8 text-white" />,
      color: "bg-mdpc-blue",
    },
    {
      title: "Water Inventory",
      description: "Comprehensive water resource assessment and management plans for sustainable water utilization.",
      icon: <GaugeIcon className="h-8 w-8 text-white" />,
      color: "bg-cyan-500",
    },
    {
      title: "Pump Testing & Installation",
      description: "Complete pump services including testing, supply, installation, and maintenance for optimal performance.",
      icon: <WrenchIcon className="h-8 w-8 text-white" />,
      color: "bg-indigo-500",
    },
    {
      title: "Composite Water Filtration",
      description: "Custom water filtration solutions to ensure clean, safe water for residential and industrial use.",
      icon: <FilterIcon className="h-8 w-8 text-white" />,
      color: "bg-teal-500",
    },
    {
      title: "Industrial Control & Stanchion",
      description: "Engineering solutions for industrial water control systems and stanchion construction.",
      icon: <ServerIcon className="h-8 w-8 text-white" />,
      color: "bg-mdpc-gold",
    },
    {
      title: "Mining & Core Drilling",
      description: "Specialized drilling services for mining operations and core sample extraction with precision equipment.",
      icon: <PickaxeIcon className="h-8 w-8 text-white" />,
      color: "bg-amber-600",
    },
    {
      title: "Water Quality Analysis",
      description: "Comprehensive testing and analysis of water quality parameters to ensure safety and compliance.",
      icon: <ActivityIcon className="h-8 w-8 text-white" />,
      color: "bg-green-500",
    },
  ];

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
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              color={service.color}
              delay={index * 100}
              isInView={isInView}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-mdpc-blue font-medium mb-6">
            Need a custom solution for your project? Contact our expert team today.
          </p>
          <a 
            href="#contact" 
            className="inline-block bg-mdpc-gold hover:bg-mdpc-gold-dark text-white font-semibold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
          >
            Discuss Your Project
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
