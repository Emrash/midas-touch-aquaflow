
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FleetGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

const fleetItems = [
  {
    id: 1,
    name: "Heavy-Duty Truck",
    description: "6-wheel truck for transporting drilling rigs and heavy equipment across all terrains.",
    image: "https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?auto=format&fit=crop&q=80&w=1000",
    specs: ["Capacity: 10 tons", "Range: 800km", "Features: Hydraulic lift system"]
  },
  {
    id: 2,
    name: "Flat-bed Trailer",
    description: "Extended flatbed for oversized equipment and materials transport.",
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=1000",
    specs: ["Length: 40ft", "Capacity: 20 tons", "Features: Adjustable support jacks"]
  },
  {
    id: 3,
    name: "Water Tanker",
    description: "Specialized tanker for clean water transportation to project sites.",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1000",
    specs: ["Capacity: 5000 gallons", "Material: Stainless steel", "Features: Flow control system"]
  },
  {
    id: 4,
    name: "Light Commercial Vehicle",
    description: "Rapid delivery vehicle for smaller components and technical teams.",
    image: "https://images.unsplash.com/photo-1532386236358-a33d8a9434e3?auto=format&fit=crop&q=80&w=1000",
    specs: ["Type: 4×4 Pickup", "Capacity: 1 ton", "Features: GPS tracking system"]
  },
  {
    id: 5,
    name: "Mobile Workshop",
    description: "Fully equipped mobile workshop for on-site repairs and maintenance.",
    image: "https://images.unsplash.com/photo-1561361398-a39ca96ae04c?auto=format&fit=crop&q=80&w=1000",
    specs: ["Equipment: Welding, power tools", "Power: Self-generated", "Features: Climate controlled workspace"]
  },
  {
    id: 6,
    name: "Drilling Equipment Transporter",
    description: "Specialized vehicle for safe transport of sensitive drilling equipment.",
    image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?auto=format&fit=crop&q=80&w=1000",
    specs: ["Capacity: 15 tons", "Security: GPS tracked", "Features: Shock absorption system"]
  }
];

const FleetGallery = ({ isOpen, onClose }: FleetGalleryProps) => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  
  if (!isOpen) return null;
  
  const handleItemClick = (id: number) => {
    setSelectedItem(id === selectedItem ? null : id);
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative bg-white dark:bg-mdpc-brown-darkest/90 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-mdpc-blue text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-heading font-bold flex items-center">
            <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="3" width="15" height="13" stroke="currentColor" strokeWidth="2" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" stroke="currentColor" strokeWidth="2" />
              <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2" />
              <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2" />
            </svg>
            Midas Touch Fleet Gallery
          </h2>
          <Button 
            onClick={onClose}
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/10"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <p className="text-mdpc-brown-dark dark:text-mdpc-brown-light mb-8 max-w-3xl">
            Our logistics division maintains a diverse and modern fleet of vehicles specifically designed for the unique transportation needs of water infrastructure and drilling projects. Each vehicle is regularly maintained and operated by experienced professionals.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fleetItems.map((item) => (
              <motion.div
                key={item.id}
                layoutId={`fleet-card-${item.id}`}
                onClick={() => handleItemClick(item.id)}
                className={`bg-white dark:bg-mdpc-brown-dark/30 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-transparent ${selectedItem === item.id ? 'border-mdpc-gold' : ''}`}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-heading font-bold text-mdpc-blue dark:text-mdpc-gold mb-2">{item.name}</h3>
                  <p className="text-mdpc-brown-dark dark:text-gray-300 mb-4">{item.description}</p>
                  
                  <AnimatePresence>
                    {selectedItem === item.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <h4 className="font-medium text-mdpc-brown-dark dark:text-white mb-2">Specifications:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-mdpc-brown dark:text-gray-300 mb-4">
                          {item.specs.map((spec, index) => (
                            <li key={index}>{spec}</li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <Button 
                    variant="link" 
                    className="p-0 text-mdpc-blue dark:text-mdpc-blue-light hover:text-mdpc-gold"
                  >
                    {selectedItem === item.id ? 'Show Less' : 'Show Details'}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-mdpc-blue dark:text-mdpc-gold">Need Our Transportation Services?</h3>
                <p className="text-mdpc-brown-dark dark:text-gray-300 text-sm">
                  Our fleet is available for your project logistics and materials transportation needs.
                </p>
              </div>
              <Button 
                onClick={onClose}
                className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white"
              >
                Request Logistics Quote
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetGallery;
