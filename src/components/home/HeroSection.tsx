
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useConsultation } from "@/contexts/ConsultationContext";
import backgroundCover from "../../assets/background_cover.jpg";
import logo from "../../assets/logo.jpg";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const { openModal } = useConsultation();
  
  useEffect(() => {
    setIsVisible(true);
    
    // Create initial ripples
    const initialRipples = Array(3).fill(0).map((_, index) => ({
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 10 + Math.random() * 20,
    }));
    setRipples(initialRipples);
    
    // Create new ripples at intervals
    const rippleInterval = setInterval(() => {
      const newRipple = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 10 + Math.random() * 30,
      };
      
      setRipples(prev => {
        // Keep only the last 5 ripples to avoid too many animations
        const updated = [...prev, newRipple];
        if (updated.length > 5) {
          return updated.slice(-5);
        }
        return updated;
      });
    }, 3000);
    
    // Add ripple effect on click
    const handleClick = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      // Get position relative to the container
      const rect = heroRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      const newRipple = {
        id: Date.now(),
        x,
        y,
        size: 15 + Math.random() * 10,
      };
      
      setRipples(prev => {
        const updated = [...prev, newRipple];
        if (updated.length > 8) {
          return updated.slice(-8);
        }
        return updated;
      });
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('click', handleClick);
    }

    return () => {
      if (heroElement) {
        heroElement.removeEventListener('click', handleClick);
      }
      clearInterval(rippleInterval);
    };
  }, []);

  // Animation variants for text elements
  const containerVariants = {
    hidden: { 
      opacity: 0 
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.5
      }
    }
  };
  
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.04, 0.62, 0.23, 0.98]
      }
    }
  };

  const handleContactRequest = () => {
    openModal('general', 'Request a Consultation', "Tell us about your project needs and we'll get back to you within 24 hours.");
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero" 
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundCover})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Enhanced overlay with gradient */}
      <div className="hero-overlay"></div>
      
      {/* Water ripples */}
      <div className="water-ripple">
        {ripples.map((ripple) => (
          <div 
            key={ripple.id}
            className="absolute rounded-full bg-white opacity-40 animate-ripple"
            style={{
              left: `${ripple.x}%`,
              top: `${ripple.y}%`,
              width: `${ripple.size}px`,
              height: `${ripple.size}px`,
            }}
          ></div>
        ))}
      </div>

      {/* Content */}
      <motion.div 
        className="container mx-auto px-4 relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.div 
            className="mb-6 flex justify-center"
            variants={itemVariants}
          >
            <div className="h-20 w-20 bg-gradient-to-br from-mdpc-gold to-mdpc-gold-dark rounded-full flex items-center justify-center animate-float-slow shadow-gold-glow">
              <span className="text-white font-heading font-bold text-3xl">MD</span>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-white mb-6 font-heading leading-tight"
            variants={itemVariants}
          >
            Nigeria's Foremost Borehole Drilling & Project Consulting Partner
          </motion.h1>
          
          <motion.p 
            className="text-gray-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Delivering excellence in water solutions with integrity, efficiency, and consistency for over a decade.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center"
            variants={itemVariants}
          >
            <Button 
              size="lg" 
              onClick={handleContactRequest}
              className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white font-semibold py-7 px-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 relative overflow-hidden group"
            >
              <span className="relative z-10">Request a Consultation</span>
              <span className="absolute top-0 left-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-[150%] transition-transform duration-700 ease-out"></span>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={scrollToContact}
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold py-7 px-8 rounded-lg transition duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">Get a Quote</span>
              <span className="absolute top-0 left-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-[150%] transition-transform duration-700 ease-out"></span>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Animated water wave */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path 
            fill="#3A7CA5" 
            fillOpacity="0.6" 
            d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,234.7C960,235,1056,181,1152,170.7C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            className="animate-water-flow"
          ></path>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full absolute bottom-0">
          <path 
            fill="#2A5978" 
            fillOpacity="0.4" 
            d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,181.3C672,171,768,181,864,197.3C960,213,1056,235,1152,229.3C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            className="animate-water-flow"
            style={{ animationDuration: '7s' }}
          ></path>
        </svg>
      </div>

      {/* Enhanced scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-10 h-14 border-2 border-white/70 rounded-full flex justify-center pt-2 overflow-hidden">
          <div className="w-1.5 h-3 bg-white/90 rounded-full animate-float" style={{ animationDuration: '1.5s' }}></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
