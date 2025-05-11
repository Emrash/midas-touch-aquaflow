
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  title: string;
  location: string;
  image: string;
  category: string;
  delay: number;
  isInView: boolean;
}

const ProjectCard = ({ 
  title, 
  location, 
  image, 
  category, 
  delay,
  isInView 
}: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-all duration-700",
        isInView 
          ? "translate-y-0 opacity-100" 
          : "translate-y-10 opacity-0"
      )}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Project Image */}
      <div className="h-64 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
      </div>

      {/* Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-mdpc-brown-dark to-transparent opacity-70 transition-opacity duration-300 ${
        isHovered ? "opacity-90" : ""
      }`}></div>

      {/* Category Tag */}
      <div className="absolute top-4 right-4 bg-mdpc-gold text-white text-xs font-bold uppercase tracking-wider px-2 py-1 rounded">
        {category}
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 p-5 w-full transform transition-transform duration-300">
        <h3 className="text-white font-heading font-bold text-xl mb-1">{title}</h3>
        <p className="text-gray-200 text-sm flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          {location}
        </p>
      </div>

      {/* View Project Button (shown on hover) */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
        isHovered ? "opacity-100" : "opacity-0"
      }`}>
        <span className="bg-white text-mdpc-brown-dark px-4 py-2 rounded-lg font-semibold transform transition-transform duration-300 hover:scale-105">
          View Project
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;
