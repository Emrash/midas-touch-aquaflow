
import { useEffect, useState, useRef } from "react";
import ProjectCard from "../ui/ProjectCard";
import { Button } from "@/components/ui/button";

const ProjectsSection = () => {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState("All");

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

  const projects = [
    {
      title: "Community Borehole Project",
      location: "Lagos State",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2500",
      category: "Borehole",
    },
    {
      title: "Industrial Water Filtration",
      location: "Abuja",
      image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80&w=2500",
      category: "Filtration",
    },
    {
      title: "Agricultural Irrigation System",
      location: "Kano",
      image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&q=80&w=2500",
      category: "Irrigation",
    },
    {
      title: "Hospital Water Supply",
      location: "Port Harcourt",
      image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&q=80&w=2500",
      category: "Infrastructure",
    },
    {
      title: "Mining Site Water Management",
      location: "Plateau State",
      image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&q=80&w=2500",
      category: "Mining",
    },
    {
      title: "Rural Water Access Program",
      location: "Enugu State",
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80&w=2500",
      category: "Community",
    },
  ];

  const filters = ["All", "Borehole", "Filtration", "Irrigation", "Infrastructure", "Mining", "Community"];
  
  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  return (
    <section id="projects" ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="section-title">Our Projects</h2>
          <p className="text-mdpc-brown-dark mt-8">
            Explore our portfolio of successful projects across Nigeria, delivering 
            reliable water solutions to communities, industries, and institutions.
          </p>
        </div>

        {/* Project Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === filter
                  ? "bg-mdpc-gold text-white shadow-md"
                  : "bg-gray-100 text-mdpc-brown-dark hover:bg-gray-200"
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              location={project.location}
              image={project.image}
              category={project.category}
              delay={index * 100}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Map Preview */}
        <div className={`mt-16 bg-gray-100 rounded-xl overflow-hidden shadow-lg transform transition-all duration-700 ${
          isInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`} style={{ transitionDelay: "400ms" }}>
          <div className="p-6 bg-mdpc-blue text-white">
            <h3 className="text-xl font-heading font-bold mb-2">Project Locations</h3>
            <p className="text-blue-100">
              We've completed successful projects across Nigeria, serving communities and businesses nationwide.
            </p>
          </div>
          <div className="h-64 bg-gray-300 relative">
            {/* Map placeholder - In a real implementation, replace with an actual map */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-mdpc-brown">Interactive map of our project locations across Nigeria</p>
            </div>
            {/* Nigerian map outline overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <svg width="300" height="300" viewBox="0 0 200 200">
                <path
                  d="M32.5,25.3c0,0,13.3-0.5,22.8,12.3s12,20.8,14.8,22.3s17.3,7.5,19.3,11.3s4.8,13.8,8.3,17s14.3,9.3,13.5,15s-3.8,14.8-1.3,18.3s15,9,14.8,14.5s-5.3,10-7.3,15s-3.3,9.5-8.3,10.5s-13.3-1.3-14.5,2s1.5,10.3-2.3,13.3s-8.8,4.5-11.5,1.8s-5.8-9.8-11.8-9.3s-10,5.3-14,2.3s-5.8-12-10-13s-11.8,2.3-16.3-0.8s-9-9.5-7.5-15.3s8.5-17.8,6-21.8s-10.5-8-12-12.3s-1-10.8,1-15.8s7.8-12.8,7-18.3s-5-12.5-3.8-17.8S30.5,26.5,32.5,25.3z"
                  fill="#3A7CA5"
                />
              </svg>
            </div>
            {/* Project location dots */}
            <div className="absolute inset-0">
              {/* Lagos */}
              <div className="absolute bottom-[35%] left-[35%] h-3 w-3 bg-mdpc-gold rounded-full animate-pulse"></div>
              {/* Abuja */}
              <div className="absolute top-[45%] left-[55%] h-3 w-3 bg-mdpc-gold rounded-full animate-pulse"></div>
              {/* Kano */}
              <div className="absolute top-[25%] left-[55%] h-3 w-3 bg-mdpc-gold rounded-full animate-pulse"></div>
              {/* Port Harcourt */}
              <div className="absolute bottom-[30%] right-[35%] h-3 w-3 bg-mdpc-gold rounded-full animate-pulse"></div>
              {/* Plateau */}
              <div className="absolute top-[40%] right-[40%] h-3 w-3 bg-mdpc-gold rounded-full animate-pulse"></div>
              {/* Enugu */}
              <div className="absolute bottom-[40%] right-[30%] h-3 w-3 bg-mdpc-gold rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button className="bg-mdpc-blue hover:bg-mdpc-blue-dark text-white">
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
