
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface ProjectCardProps {
  title: string;
  location: string;
  category: string;
  image: string;
  id: string;
  index?: number;
}

const ProjectCard = ({ title, location, category, image, id, index = 0 }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.2 });

  const handleClick = () => {
    navigate(`/projects/${id}`);
  };

  return (
    <motion.div 
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div
        className="project-card cursor-pointer h-80 sm:h-64 md:h-72"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Background Image */}
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700"
          style={{
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
        />
        
        {/* Gradient Overlay */}
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-mdpc-brown-darkest/90 via-mdpc-brown-darkest/40 to-transparent transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-70"
          )}
        />
        
        {/* Category Tag */}
        <div className="absolute top-4 right-4 bg-mdpc-gold/90 text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1.5 rounded shadow-md backdrop-blur-sm">
          {category}
        </div>
        
        {/* Content */}
        <div className="project-card-content">
          <h3 className="text-lg md:text-xl font-heading font-bold mb-2">{title}</h3>
          <div className="flex items-center text-gray-200 text-sm mb-4">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            {location}
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.2 }}
            className="bg-white/10 backdrop-blur-sm text-white py-2 px-4 inline-flex items-center gap-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            View Details <ArrowRight className="h-4 w-4" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
