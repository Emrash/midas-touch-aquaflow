
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProjectsSection from "../components/home/ProjectsSection";

const Projects = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "Our Projects | Midas Touch Drills and Projects Consult";
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-mdpc-blue mb-8">Our Projects</h1>
          <p className="text-mdpc-brown-dark mb-12 max-w-3xl">
            Explore our diverse portfolio of successful water solutions projects. From community boreholes to industrial water systems, 
            we deliver reliable and sustainable solutions across Nigeria.
          </p>
          
          <ProjectsSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
