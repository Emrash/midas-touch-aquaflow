
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  delay: number;
  isInView: boolean;
}

const ServiceCard = ({ 
  title, 
  description, 
  icon, 
  color, 
  delay, 
  isInView 
}: ServiceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={cn(
        "bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 transform hover:-translate-y-2 hover:shadow-xl",
        isInView 
          ? "translate-y-0 opacity-100" 
          : "translate-y-10 opacity-0"
      )}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`h-2 w-full ${color}`} 
      ></div>
      <div className="p-6">
        <div className={`w-16 h-16 rounded-lg ${color} flex items-center justify-center mb-5 transition-transform duration-500 ${isHovered ? 'scale-110' : ''}`}>
          {icon}
        </div>
        <h3 className="text-xl font-heading font-bold mb-3">{title}</h3>
        <p className="text-mdpc-brown-dark mb-5">{description}</p>
        <Button 
          variant="link" 
          className="p-0 text-mdpc-blue font-semibold hover:text-mdpc-gold transition-colors"
        >
          Learn More
          <span className="ml-2 transition-transform duration-300 transform group-hover:translate-x-1">→</span>
        </Button>
      </div>
    </div>
  );
};

export default ServiceCard;
