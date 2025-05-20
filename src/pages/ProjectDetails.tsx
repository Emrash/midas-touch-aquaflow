
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ProjectDetails {
  id: string;
  title: string;
  location: string;
  description: string;
  imageUrls: string[];
  category: string;
  completedAt?: any;
  type?: string;
}

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      
      try {
        // Try to get the project from Firestore first
        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          const projectData: ProjectDetails = {
            id: docSnap.id,
            title: data.title || "Project Details",
            location: data.location || "Nigeria",
            description: data.description || "No description available",
            imageUrls: data.imageUrls || [],
            category: data.category || data.type || "Borehole",
            completedAt: data.completedAt,
            type: data.type
          };
          
          setProject(projectData);
          if (projectData.imageUrls && projectData.imageUrls.length > 0) {
            setSelectedImage(projectData.imageUrls[0]);
          }
          
          document.title = `${projectData.title} | Midas Touch Projects`;
        } else {
          // If not found by ID, try querying by local ID
          const projectsQuery = query(
            collection(db, "projects"), 
            where("localId", "==", id)
          );
          
          const querySnapshot = await getDocs(projectsQuery);
          
          if (!querySnapshot.empty) {
            // Use the first match
            const docData = querySnapshot.docs[0].data();
            const projectData: ProjectDetails = {
              id: querySnapshot.docs[0].id,
              title: docData.title || "Project Details",
              location: docData.location || "Nigeria",
              description: docData.description || "No description available",
              imageUrls: docData.imageUrls || [],
              category: docData.category || docData.type || "Borehole",
              completedAt: docData.completedAt,
              type: docData.type
            };
            
            setProject(projectData);
            if (projectData.imageUrls && projectData.imageUrls.length > 0) {
              setSelectedImage(projectData.imageUrls[0]);
            }
            
            document.title = `${projectData.title} | Midas Touch Projects`;
          } else {
            // If still not found, use demo data
            const demoProject = getDemoProject(id);
            setProject(demoProject);
            setSelectedImage(demoProject.imageUrls[0]);
            document.title = `${demoProject.title} | Midas Touch Projects`;
          }
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
        const demoProject = getDemoProject(id || "");
        setProject(demoProject);
        setSelectedImage(demoProject.imageUrls[0]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectDetails();
    
    return () => {
      document.title = "Midas Touch Drills and Projects Consult";
    };
  }, [id]);

  // Function to get a demo project if no real project is found
  const getDemoProject = (projectId: string): ProjectDetails => {
    const demoProjects: Record<string, ProjectDetails> = {
      "community-borehole": {
        id: "community-borehole",
        title: "Community Borehole Project",
        location: "Lagos State",
        description: `This community borehole project was initiated to provide clean drinking water to a rural community in Lagos State. The project involved extensive geological surveys, drilling to a depth of 120 meters, and installation of a solar-powered pumping system. The borehole now serves over 500 community members daily, significantly reducing waterborne diseases in the area.`,
        imageUrls: [
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2500",
          "https://images.unsplash.com/photo-1509600110300-21b9d5fedeb7?auto=format&fit=crop&q=80&w=1500",
          "https://images.unsplash.com/photo-1565301660306-29e08751cc53?auto=format&fit=crop&q=80&w=1500"
        ],
        category: "Borehole"
      },
      "industrial-water-filtration": {
        id: "industrial-water-filtration",
        title: "Industrial Water Filtration System",
        location: "Abuja",
        description: `We designed and installed a comprehensive water filtration system for a major manufacturing facility in Abuja. The system processes 50,000 liters of water daily, removing contaminants and ensuring compliance with environmental regulations. The multi-stage filtration includes sediment removal, carbon filtration, reverse osmosis, and UV purification.`,
        imageUrls: [
          "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80&w=2500",
          "https://images.unsplash.com/photo-1609252509192-3d3be950e4bd?auto=format&fit=crop&q=80&w=1500",
          "https://images.unsplash.com/photo-1543393470-b2b2334c2794?auto=format&fit=crop&q=80&w=1500"
        ],
        category: "Filtration"
      },
      "agricultural-irrigation-system": {
        id: "agricultural-irrigation-system",
        title: "Agricultural Irrigation System",
        location: "Kano",
        description: `This large-scale agricultural irrigation project covered 200 hectares of farmland in Kano. We implemented a drip irrigation system that reduces water usage by 60% compared to traditional methods while increasing crop yields by 40%. The system includes automated controls, water sensors, and weather monitoring to optimize irrigation scheduling.`,
        imageUrls: [
          "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&q=80&w=2500",
          "https://images.unsplash.com/photo-1615209853186-e4bd66602508?auto=format&fit=crop&q=80&w=1500",
          "https://images.unsplash.com/photo-1555788168-9036209055bd?auto=format&fit=crop&q=80&w=1500"
        ],
        category: "Irrigation"
      },
      // Default case
      "default": {
        id: "default-project",
        title: "Project Details",
        location: "Nigeria",
        description: "Project details not found.",
        imageUrls: ["https://images.unsplash.com/photo-1550091345-8c587a37b33d?auto=format&fit=crop&q=80&w=1500"],
        category: "Borehole"
      }
    };
    
    return demoProjects[projectId] || demoProjects.default;
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    
    try {
      const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch (error) {
      return "N/A";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {loading ? (
          <div className="container mx-auto px-4 py-12">
            <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg mb-8"></div>
            <div className="w-3/4 h-8 bg-gray-200 animate-pulse rounded mb-4"></div>
            <div className="w-1/4 h-6 bg-gray-200 animate-pulse rounded mb-8"></div>
            <div className="w-full h-24 bg-gray-200 animate-pulse rounded"></div>
          </div>
        ) : (
          project && (
            <div className="container mx-auto px-4 py-12">
              <Button
                variant="ghost"
                className="mb-6 flex items-center hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Button>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6"
              >
                <div className="space-y-4">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden aspect-video">
                    <img
                      src={selectedImage}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {project.imageUrls.length > 1 && (
                    <div className="flex overflow-x-auto space-x-2 pb-2">
                      {project.imageUrls.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(image)}
                          className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden transition-all ${
                            selectedImage === image
                              ? "ring-2 ring-mdpc-gold scale-105"
                              : "opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Project image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-4 text-mdpc-brown-dark dark:text-white">
                    {project.title}
                  </h1>
                  
                  <div className="flex flex-wrap gap-3 mb-6">
                    <div className="flex items-center text-mdpc-brown dark:text-mdpc-brown-light">
                      <MapPin className="w-4 h-4 mr-1" />
                      {project.location}
                    </div>
                    
                    {project.completedAt && (
                      <div className="flex items-center text-mdpc-brown dark:text-mdpc-brown-light">
                        <Calendar className="w-4 h-4 mr-1" />
                        Completed: {formatDate(project.completedAt)}
                      </div>
                    )}
                    
                    <span className="bg-mdpc-gold text-white px-2 py-0.5 rounded-md text-sm font-medium">
                      {project.category || project.type}
                    </span>
                  </div>
                  
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="mt-8">
                    <Button
                      className="bg-mdpc-blue hover:bg-mdpc-blue-dark text-white"
                      onClick={() => navigate("/#contact")}
                    >
                      Request Similar Project
                    </Button>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-12 border-t pt-8 dark:border-gray-700"
              >
                <h2 className="text-xl font-heading font-semibold mb-4 dark:text-white">
                  Interested in similar projects?
                </h2>
                <p className="mb-6 text-gray-700 dark:text-gray-300">
                  Contact our team for a consultation or to discuss your specific project requirements.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white"
                    onClick={() => navigate("/#contact")}
                  >
                    Contact Us
                  </Button>
                  <Button
                    variant="outline"
                    className="border-mdpc-brown/30 dark:border-mdpc-gold/20"
                    onClick={() => navigate("/services")}
                  >
                    View Our Services
                  </Button>
                </div>
              </motion.div>
            </div>
          )
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ProjectDetails;
