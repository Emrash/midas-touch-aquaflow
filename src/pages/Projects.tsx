
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProjectsSection from "../components/home/ProjectsSection";
import projectGalleryImg from "../assets/project_gallery.jpg";

const Projects = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "Our Projects | Midas Touch Drills and Projects Consult";
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24">
        <div className="relative mb-12">
          <div className="h-60 w-full overflow-hidden">
            <img 
              src={projectGalleryImg} 
              alt="Projects Gallery" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-mdpc-blue-dark/70 to-transparent flex items-center">
              <div className="container mx-auto px-4">
                <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">Our Projects</h1>
                <p className="text-white mb-6 max-w-3xl">
                  Explore our diverse portfolio of successful water solutions projects. From community boreholes to industrial water systems, 
                  we deliver reliable and sustainable solutions across Nigeria.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">          
          <ProjectsSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
