
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);

    // Add ripple effect on click
    const handleClick = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const x = e.clientX;
      const y = e.clientY;
      
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
      
      heroRef.current.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 1500);
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('click', handleClick);
    }

    return () => {
      if (heroElement) {
        heroElement.removeEventListener('click', handleClick);
      }
    };
  }, []);

  return (
    <section 
      id="hero" 
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&q=80&w=2500')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Overlay */}
      <div className="hero-overlay"></div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="h-16 w-16 bg-mdpc-gold rounded-full flex items-center justify-center animate-float">
              <span className="text-white font-bold text-2xl">MD</span>
            </div>
          </div>
          
          <h1 
            className={`text-white mb-6 transform transition-all duration-1000 
                      ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            Nigeria's Foremost Borehole Drilling & Project Consulting Partner
          </h1>
          
          <p 
            className={`text-gray-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto transform transition-all duration-1000 delay-300
                      ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            Delivering excellence in water solutions with integrity, efficiency and consistency for over a decade.
          </p>
          
          <div 
            className={`flex flex-col sm:flex-row gap-4 justify-center transform transition-all duration-1000 delay-500
                      ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            <Button 
              size="lg" 
              className="bg-mdpc-blue hover:bg-mdpc-blue-dark text-white font-semibold py-6 px-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105"
            >
              Request a Consultation
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold py-6 px-8 rounded-lg transition duration-300"
            >
              Get a Quote
            </Button>
          </div>
        </div>
      </div>

      {/* Animated Elements */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path 
            fill="#3A7CA5" 
            fillOpacity="0.4" 
            d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,234.7C960,235,1056,181,1152,170.7C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            className="animate-water-flow"
          ></path>
        </svg>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center py-2">
          <div className="w-1 h-3 bg-white/80 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
