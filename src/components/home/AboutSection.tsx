
import { useEffect, useState, useRef } from "react";

const AboutSection = () => {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.2,
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

  // Timeline data
  const timelineItems = [
    {
      year: "2010",
      title: "Company Founded",
      description: "Established in Lagos as a small water drilling company."
    },
    {
      year: "2013",
      title: "First Major Project",
      description: "Secured first major government contract for rural water supply."
    },
    {
      year: "2016",
      title: "Expansion",
      description: "Expanded services to include water filtration and industrial controls."
    },
    {
      year: "2019",
      title: "International Recognition",
      description: "Awarded for excellence in water resource management."
    },
    {
      year: "2022",
      title: "Innovation Leaders",
      description: "Introduced advanced hydrogeophysics techniques to Nigerian market."
    }
  ];

  return (
    <section id="about" ref={sectionRef} className="bg-white py-20">
      <div className="container mx-auto px-4">
        <h2 className="section-title">About Us</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-12">
          {/* Image with overlay effect */}
          <div 
            className={`relative overflow-hidden rounded-xl shadow-xl transform transition-all duration-1000 
                      ${isInView ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}
          >
            <div className="aspect-w-4 aspect-h-3">
              <img 
                src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80&w=2500" 
                alt="MDPC Water project" 
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-mdpc-blue/60 to-transparent"></div>
            </div>
            
            {/* Floating stat cards */}
            <div className="absolute bottom-4 left-4 glass-card p-4 animate-float">
              <div className="text-mdpc-blue font-bold text-3xl">10+</div>
              <div className="text-mdpc-brown-dark text-sm">Years of Experience</div>
            </div>
            
            <div className="absolute top-4 right-4 glass-card p-4 animate-float" style={{ animationDelay: "1s" }}>
              <div className="text-mdpc-blue font-bold text-3xl">500+</div>
              <div className="text-mdpc-brown-dark text-sm">Projects Completed</div>
            </div>
          </div>
          
          {/* Text content */}
          <div 
            className={`transform transition-all duration-1000 delay-300 
                      ${isInView ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}
          >
            <h3 className="text-mdpc-blue text-2xl md:text-3xl font-bold mb-4">
              Excellence in Water Solutions & Engineering
            </h3>
            
            <p className="text-mdpc-brown-dark mb-4">
              Midas Touch Drills and Projects Consult (MDPC Ltd.) is a leading Nigerian company 
              specializing in borehole drilling, water filtration systems, and engineering consultancy. 
              With over a decade of experience, we have established ourselves as the go-to partner for 
              reliable water solutions across Nigeria.
            </p>
            
            <p className="text-mdpc-brown-dark mb-6">
              Our mission is to provide sustainable water solutions that transform lives and businesses. 
              We combine cutting-edge technology with deep local expertise to deliver projects that exceed 
              expectations in quality, efficiency, and durability.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-heading font-bold text-mdpc-blue mb-2">Our Vision</h4>
                <p className="text-sm">To be Nigeria's most trusted water solutions provider, known for excellence and innovation.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-heading font-bold text-mdpc-blue mb-2">Our Mission</h4>
                <p className="text-sm">Delivering sustainable water solutions with integrity, efficiency and technical expertise.</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <span className="bg-mdpc-gold/20 text-mdpc-brown px-3 py-1 rounded-full text-sm">Integrity</span>
              <span className="bg-mdpc-gold/20 text-mdpc-brown px-3 py-1 rounded-full text-sm">Efficiency</span>
              <span className="bg-mdpc-gold/20 text-mdpc-brown px-3 py-1 rounded-full text-sm">Innovation</span>
              <span className="bg-mdpc-gold/20 text-mdpc-brown px-3 py-1 rounded-full text-sm">Excellence</span>
            </div>
          </div>
        </div>
        
        {/* Company Growth Timeline */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center mb-12">Our Growth Timeline</h3>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-mdpc-gold/30 z-0"></div>
            
            {/* Timeline items */}
            <div className="flex flex-col">
              {timelineItems.map((item, index) => (
                <div 
                  key={index} 
                  className={`relative z-10 flex justify-center mb-8 transform transition-all duration-700 
                            ${isInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  {/* Year bubble */}
                  <div className="bg-mdpc-gold text-white font-bold rounded-full h-12 w-12 flex items-center justify-center z-20 shadow-lg">
                    {item.year}
                  </div>
                  
                  {/* Content */}
                  <div className={`absolute w-5/12 bg-white p-4 rounded-lg shadow-lg ${
                    index % 2 === 0 ? 'left-0 pr-8 text-right' : 'right-0 pl-8 text-left'
                  }`}>
                    <h4 className="font-bold text-mdpc-blue mb-1">{item.title}</h4>
                    <p className="text-sm text-mdpc-brown-dark">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
