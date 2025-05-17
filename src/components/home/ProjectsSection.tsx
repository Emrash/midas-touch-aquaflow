
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProjectCard from "../ui/ProjectCard";
import { motion, useInView } from "framer-motion";

// Sample project data
const featuredProjects = [
  {
    id: "community-borehole",
    title: "Community Borehole Project",
    location: "Lagos State",
    category: "Borehole",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2500"
  },
  {
    id: "industrial-water-filtration",
    title: "Industrial Water Filtration",
    location: "Abuja",
    category: "Filtration",
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80&w=2500"
  },
  {
    id: "agricultural-irrigation-system",
    title: "Agricultural Irrigation System",
    location: "Kano",
    category: "Irrigation",
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&q=80&w=2500"
  },
];

// Project categories for filtering
const categories = [
  "All Projects",
  "Borehole",
  "Filtration",
  "Irrigation", 
  "Infrastructure",
  "Community"
];

const ProjectsSection = () => {
  const [activeCategory, setActiveCategory] = useState("All Projects");
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="projects" ref={sectionRef} className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="section-title dark:text-white">Our Projects</h2>
          <p className="mt-4 text-mdpc-brown-dark dark:text-gray-300 max-w-2xl mx-auto">
            Explore our diverse portfolio of successful water solutions projects across Nigeria. 
            From community boreholes to industrial water systems, we deliver reliable and sustainable solutions.
          </p>
        </motion.div>
        
        {/* Category filter */}
        <motion.div 
          className="flex flex-wrap gap-2 md:gap-4 justify-center mb-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              variants={itemVariants}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                activeCategory === category 
                ? 'bg-mdpc-blue text-white shadow-md' 
                : 'bg-white dark:bg-gray-800 text-mdpc-brown-dark dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>
        
        {/* Projects grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {featuredProjects
            .filter(project => activeCategory === "All Projects" || project.category === activeCategory)
            .map((project, index) => (
              <motion.div key={project.id} variants={itemVariants}>
                <ProjectCard {...project} index={index} />
              </motion.div>
            ))
          }
          
          {/* If filtered results are empty */}
          {featuredProjects.filter(
            project => activeCategory === "All Projects" || project.category === activeCategory
          ).length === 0 && (
            <motion.div 
              className="col-span-full text-center py-16"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-mdpc-brown dark:text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg font-medium">No projects found in this category</p>
                <p className="mt-2 text-sm">Try selecting a different category or check back later</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setActiveCategory("All Projects")}
                className="mt-2"
              >
                View All Projects
              </Button>
            </motion.div>
          )}
        </motion.div>
        
        {/* View More Button */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <Link to="/projects">
            <Button 
              size="lg"
              className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white relative overflow-hidden group"
            >
              <span className="relative z-10">View All Projects</span>
              <span className="absolute top-0 left-0 w-full h-full bg-white/20 transform -skew-x-45 -translate-x-full group-hover:translate-x-[150%] transition-transform duration-700 ease-out"></span>
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
