
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  delay?: number; // milliseconds
}

const WhatsAppButton = ({
  phoneNumber,
  message = "Hello! I'm interested in your services.",
  position = "bottom-right",
  delay = 2000,
}: WhatsAppButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const [hasBeenSeen, setHasBeenSeen] = useState(false);
  
  // Clean phone number
  const cleanedPhone = phoneNumber.replace(/\D/g, "");
  
  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);
  
  // WhatsApp API URL
  const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodedMessage}`;
  
  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  };
  
  const tooltipPositions = {
    "bottom-right": "-translate-x-1/2 -translate-y-full -left-3 -top-3",
    "bottom-left": "translate-x-1/2 -translate-y-full -right-3 -top-3",
    "top-right": "-translate-x-1/2 translate-y-full -left-3 -bottom-3",
    "top-left": "translate-x-1/2 translate-y-full -right-3 -bottom-3",
  };
  
  // Show the button after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    // Show the tooltip after the button appears
    const tooltipTimer = setTimeout(() => {
      if (!hasBeenSeen) {
        setIsTooltipVisible(true);
        
        // Auto-hide the tooltip after some time
        setTimeout(() => {
          setIsTooltipVisible(false);
        }, 6000);
      }
    }, delay + 1000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(tooltipTimer);
    };
  }, [delay, hasBeenSeen]);
  
  // Stop pulsing after user has clicked
  const handleClick = () => {
    setShowPulse(false);
    setIsTooltipVisible(false);
    setHasBeenSeen(true);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`fixed ${positionClasses[position]} z-40`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          onClick={handleClick}
          onMouseEnter={() => setIsTooltipVisible(true)}
          onMouseLeave={() => setIsTooltipVisible(false)}
        >
          {/* Pulse Animation */}
          {showPulse && (
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-40"></span>
          )}
          
          {/* Button */}
          <div className="relative bg-green-500 hover:bg-green-600 text-white p-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
          </div>
          
          {/* Tooltip */}
          <AnimatePresence>
            {isTooltipVisible && (
              <motion.div
                className={`absolute ${tooltipPositions[position]} whitespace-nowrap bg-white dark:bg-gray-800 text-mdpc-brown-dark dark:text-gray-200 py-2 px-4 rounded-full shadow-lg text-sm font-medium z-50`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                Chat with us on WhatsApp
                <span 
                  className={`absolute ${position.includes('top') ? 'top-full' : 'bottom-full'} ${position.includes('left') ? 'left-6' : 'right-6'} 
                             border-4 ${position.includes('top') ? 'border-t-gray-800 border-x-transparent border-b-transparent' : 'border-b-white dark:border-b-gray-800 border-x-transparent border-t-transparent'}`}
                ></span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.a>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppButton;
