
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface LogisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogisticsModal = ({ isOpen, onClose }: LogisticsModalProps) => {
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  
  // Handle escape key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);
  
  // Handle animation
  useEffect(() => {
    if (isOpen) {
      setIsAnimatingIn(true);
    }
  }, [isOpen]);
  
  if (!isOpen && !isAnimatingIn) return null;
  
  // Handle close with animation
  const handleClose = () => {
    setIsAnimatingIn(false);
    setTimeout(onClose, 300); // Match this with the CSS transition duration
  };
  
  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isAnimatingIn ? "opacity-100" : "opacity-0"
      }`}
      aria-modal="true"
      role="dialog"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-60" />
      
      {/* Modal */}
      <div 
        className={`relative bg-white rounded-lg w-full max-w-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
          isAnimatingIn ? "transform scale-100 translate-y-0" : "transform scale-95 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-mdpc-blue text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-heading font-bold flex items-center">
            <svg width="24" height="24" className="mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 15V22M12 22H15M12 22H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 10C7 8.34315 8.34315 7 10 7H14C15.6569 7 17 8.34315 17 10V10C17 11.6569 15.6569 13 14 13H10C8.34315 13 7 11.6569 7 10V10Z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Midas Touch Logistics
          </h2>
          <button 
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <h3 className="text-lg font-bold text-mdpc-blue mb-3">Transportation & Logistics Services</h3>
              <p className="text-mdpc-brown-dark mb-4">
                Midas Touch Logistics provides specialized transportation and logistics services for water systems, drilling equipment, and construction materials across Nigeria.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-mdpc-gold mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Heavy equipment transportation</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-mdpc-gold mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Drilling rig mobilization</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-mdpc-gold mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Water system component delivery</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-mdpc-gold mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Construction material logistics</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-mdpc-gold mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Nationwide transportation network</span>
                </li>
              </ul>
            </div>
            
            <div className="md:w-1/2">
              <div className="h-48 bg-gray-200 rounded-lg mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&q=80&w=2000"
                  alt="Logistics services" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h3 className="text-lg font-bold text-mdpc-blue mb-3">Why Choose Our Logistics Services?</h3>
              <p className="text-mdpc-brown-dark mb-4">
                Our logistics division brings the same level of excellence and reliability that has made our drilling operations successful.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-blue-50 p-2 rounded">
                  <span className="font-medium block">Modern Fleet</span>
                  Specialized vehicles for every need
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <span className="font-medium block">Experienced Drivers</span>
                  Well-trained, professional operators
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <span className="font-medium block">Nationwide Coverage</span>
                  Operating in all 36 states
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <span className="font-medium block">Reliable Scheduling</span>
                  On-time performance guaranteed
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
            <div>
              <h4 className="text-mdpc-blue font-bold mb-1">Contact Us for Logistics Services</h4>
              <p className="text-mdpc-brown-dark text-sm">Email: logistics@midastouchdrills.com | Phone: +234 800 123 4568</p>
            </div>
            <Button className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white">
              Request Quote
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsModal;
