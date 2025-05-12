
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Map from "../components/ui/Map";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// This would normally come from a CMS or API
const projectsData = [
  {
    id: "community-borehole",
    title: "Community Borehole Project",
    location: "Lagos State",
    coordinates: [6.5244, 3.3792], // Lagos coordinates
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2500",
    category: "Borehole",
    description: "A comprehensive water supply solution for a growing community in Lagos State. This project involved geophysical surveys, drilling to 120 meters depth, and installation of a complete water filtration system.",
    tools: ["Geophysical Survey Equipment", "DTH Hammer Drill", "Water Quality Analyzers", "Solar Pumping System"],
    duration: "3 weeks",
    galleryImages: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2500",
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80&w=2500"
    ],
    testimonial: {
      quote: "Midas Touch provided an exceptional service that transformed our community's access to clean water.",
      author: "Community Leader, Lagos"
    }
  },
  {
    id: "industrial-water-filtration",
    title: "Industrial Water Filtration",
    location: "Abuja",
    coordinates: [9.0765, 7.3986], // Abuja coordinates
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80&w=2500",
    category: "Filtration",
    description: "Design and implementation of an advanced water filtration system for a manufacturing facility in Abuja. The system handles 50,000 liters per day with multi-stage filtration including reverse osmosis.",
    tools: ["Reverse Osmosis Units", "Carbon Filtration", "UV Purification", "Smart Monitoring System"],
    duration: "6 weeks",
    galleryImages: [
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80&w=2500",
      "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&q=80&w=2500"
    ]
  },
  {
    id: "agricultural-irrigation-system",
    title: "Agricultural Irrigation System",
    location: "Kano",
    coordinates: [12.0022, 8.5920], // Kano coordinates
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&q=80&w=2500",
    category: "Irrigation",
    description: "Development of a smart irrigation system for a 500-hectare farm in Kano. The system includes boreholes, solar-powered pumps, and automated distribution networks.",
    tools: ["Solar Panels", "Smart Irrigation Controllers", "Drip Irrigation System", "Soil Moisture Sensors"],
    duration: "8 weeks",
    galleryImages: [
      "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&q=80&w=2500",
      "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&q=80&w=2500"
    ]
  },
  {
    id: "hospital-water-supply",
    title: "Hospital Water Supply",
    location: "Port Harcourt",
    coordinates: [4.8156, 7.0498], // Port Harcourt coordinates
    image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&q=80&w=2500",
    category: "Infrastructure",
    description: "Installation of a medical-grade water supply system for a major hospital in Port Harcourt. The system includes redundant filtration, continuous monitoring, and emergency backup.",
    tools: ["Medical-Grade Filters", "UV Disinfection", "Automatic Chlorination", "Backup Generator"],
    duration: "4 weeks",
    galleryImages: [
      "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&q=80&w=2500",
      "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&q=80&w=2500"
    ]
  },
  {
    id: "mining-site-water-management",
    title: "Mining Site Water Management",
    location: "Plateau State",
    coordinates: [9.2182, 9.5236], // Plateau State coordinates
    image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&q=80&w=2500",
    category: "Mining",
    description: "Comprehensive water management solution for a mining operation in Plateau State. Includes dewatering systems, water treatment, and recycling infrastructure.",
    tools: ["Industrial Pumps", "Heavy-Duty Filtration", "Water Recycling System", "Environmental Monitoring"],
    duration: "12 weeks",
    galleryImages: [
      "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&q=80&w=2500",
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80&w=2500"
    ]
  },
  {
    id: "rural-water-access-program",
    title: "Rural Water Access Program",
    location: "Enugu State",
    coordinates: [6.4298, 7.5444], // Enugu State coordinates
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80&w=2500",
    category: "Community",
    description: "Implementation of a rural water access program covering 12 villages in Enugu State. The project includes multiple boreholes, hand pumps, and community training.",
    tools: ["Hand Pumps", "Community Training Materials", "Water Quality Test Kits", "Solar Pumping"],
    duration: "16 weeks",
    galleryImages: [
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80&w=2500",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2500"
    ]
  }
];

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate API call to fetch project details
    const fetchProject = async () => {
      setLoading(true);
      // In a real app, this would be an API call
      const foundProject = projectsData.find(p => p.id === id);
      
      if (foundProject) {
        setProject(foundProject);
        // Set page title
        document.title = `${foundProject.title} | Midas Touch Drills and Projects Consult`;
      } else {
        // Project not found
        navigate('/not-found');
      }
      
      setLoading(false);
    };
    
    fetchProject();
  }, [id, navigate]);

  const goToPreviousImage = () => {
    setCurrentImageIndex(prevIndex => 
      prevIndex === 0 ? (project?.galleryImages.length - 1) : prevIndex - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex(prevIndex => 
      prevIndex === (project?.galleryImages.length - 1) ? 0 : prevIndex + 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mdpc-gold"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return null; // This should not happen as we redirect to not-found
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24">
        {/* Hero Section */}
        <div 
          className="relative h-[40vh] md:h-[50vh] bg-cover bg-center" 
          style={{ backgroundImage: `url(${project.image})` }}
        >
          <div className="absolute inset-0 bg-mdpc-brown-dark bg-opacity-60 flex items-center">
            <div className="container mx-auto px-4">
              <Button 
                variant="outline" 
                className="mb-4 text-white border-white hover:bg-white hover:text-mdpc-brown-dark"
                onClick={() => navigate('/#projects')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Button>
              <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-2">{project.title}</h1>
              <div className="flex items-center text-white">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span className="text-lg">{project.location}</span>
                <span className="mx-2">|</span>
                <span className="bg-mdpc-gold text-white text-xs font-bold uppercase tracking-wider px-2 py-1 rounded">
                  {project.category}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-heading font-bold text-mdpc-blue mb-4">Project Overview</h2>
              <p className="text-mdpc-brown-dark mb-8">{project.description}</p>

              {/* Image Gallery */}
              <div className="mb-10">
                <h2 className="text-2xl font-heading font-bold text-mdpc-blue mb-4">Project Gallery</h2>
                <div className="relative">
                  <div className="overflow-hidden rounded-lg shadow-lg h-64 md:h-96">
                    <img 
                      src={project.galleryImages[currentImageIndex]} 
                      alt={`${project.title} gallery ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {project.galleryImages.length > 1 && (
                    <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2 px-4">
                      <button 
                        onClick={goToPreviousImage}
                        className="bg-white/80 hover:bg-white text-mdpc-brown-dark rounded-full p-2 focus:outline-none"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                      </button>
                      <button 
                        onClick={goToNextImage}
                        className="bg-white/80 hover:bg-white text-mdpc-brown-dark rounded-full p-2 focus:outline-none"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </button>
                    </div>
                  )}
                  <div className="absolute bottom-4 right-4 bg-white/80 px-3 py-1 rounded-full text-sm text-mdpc-brown-dark">
                    {currentImageIndex + 1} / {project.galleryImages.length}
                  </div>
                </div>
              </div>

              {/* Testimonial if available */}
              {project.testimonial && (
                <div className="mb-10 bg-blue-50 border-l-4 border-mdpc-blue p-6 rounded-lg">
                  <blockquote className="text-mdpc-brown-dark italic mb-4">
                    "{project.testimonial.quote}"
                  </blockquote>
                  <div className="font-medium text-mdpc-blue">- {project.testimonial.author}</div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Project Details */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h3 className="text-xl font-heading font-bold text-mdpc-blue mb-4">Project Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-mdpc-gold mb-1">Category</h4>
                    <p className="text-mdpc-brown-dark">{project.category}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-mdpc-gold mb-1">Duration</h4>
                    <p className="text-mdpc-brown-dark">{project.duration}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-mdpc-gold mb-1">Tools & Equipment</h4>
                    <ul className="list-disc list-inside text-mdpc-brown-dark">
                      {project.tools.map((tool: string, index: number) => (
                        <li key={index}>{tool}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Location Map */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-heading font-bold text-mdpc-blue mb-4">Project Location</h3>
                <Map 
                  center={project.coordinates}
                  markers={[{ position: project.coordinates, popup: project.title, isMain: true }]}
                  height="250px"
                />
              </div>
            </div>
          </div>
          
          {/* Related Projects */}
          <div className="mt-12">
            <h2 className="text-2xl font-heading font-bold text-mdpc-blue mb-6">Related Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectsData
                .filter(p => p.category === project.category && p.id !== project.id)
                .slice(0, 3)
                .map((relatedProject, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                    onClick={() => navigate(`/projects/${relatedProject.id}`)}
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={relatedProject.image} 
                        alt={relatedProject.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-heading font-bold text-mdpc-blue">{relatedProject.title}</h3>
                      <div className="flex items-center text-mdpc-brown-dark text-sm mt-2">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        {relatedProject.location}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 py-10 px-6 bg-mdpc-blue rounded-lg text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">Ready to Start Your Own Project?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Contact our team of experts to discuss your water solution needs and get a customized proposal.
            </p>
            <Button 
              className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white font-semibold py-3 px-8"
              onClick={() => navigate('/#contact')}
            >
              Request a Consultation
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetails;
