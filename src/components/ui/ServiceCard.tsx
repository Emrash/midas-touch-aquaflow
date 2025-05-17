
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, useAnimation, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  delay: number;
  isInView?: boolean;
  link?: string;
}

const ServiceCard = ({ 
  title, 
  description, 
  icon, 
  color, 
  delay, 
  isInView: propIsInView, 
  link = "#"
}: ServiceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();
  
  // Use either the prop or detect in view with framer
  const isVisible = propIsInView !== undefined ? propIsInView : inView;
  
  useEffect(() => {
    if (isVisible) {
      controls.start("visible");
    }
  }, [isVisible, controls]);
  
  return (
    <motion.div 
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.7,
            ease: [0.04, 0.62, 0.23, 0.98],
            delay: delay * 0.1
          }
        }
      }}
      initial="hidden"
      animate={controls}
      className={cn(
        "premium-card bg-white dark:bg-mdpc-brown-darkest/50 rounded-xl shadow-premium hover:shadow-premium-hover transition-all duration-500",
        isHovered && "transform -translate-y-2"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`h-2 w-full ${color} transition-all duration-500 ${isHovered ? 'h-3' : ''}`}></div>
      <div className="p-6">
        <div 
          className={`w-16 h-16 rounded-lg ${color} flex items-center justify-center mb-5 transition-all duration-500 ${
            isHovered ? 'scale-110 shadow-lg' : ''
          }`}
        >
          <motion.div
            animate={{ rotate: isHovered ? [0, -5, 5, -5, 5, 0] : 0 }}
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.div>
        </div>
        <h3 className="text-xl font-heading font-bold mb-3 text-mdpc-brown-dark dark:text-white">{title}</h3>
        <p className="text-mdpc-brown-dark dark:text-gray-300 mb-5 min-h-[80px]">{description}</p>
        <Button 
          variant="link" 
          className="p-0 text-mdpc-blue dark:text-mdpc-blue-light font-semibold hover:text-mdpc-gold dark:hover:text-mdpc-gold transition-colors group"
          asChild
        >
          <a href={link}>
            Learn More
            <span className="ml-2 transition-transform duration-300 transform group-hover:translate-x-2">→</span>
          </a>
        </Button>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
