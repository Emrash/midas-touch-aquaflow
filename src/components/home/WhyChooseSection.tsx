
import { useEffect, useState, useRef } from "react";
import { Check } from "lucide-react";

const WhyChooseSection = () => {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
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

  // Automatically rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const advantages = [
    {
      title: "Industry Experience",
      description: "Over 10 years of proven excellence in the water drilling and consulting industry.",
      icon: <Check className="h-5 w-5 text-mdpc-gold" />,
    },
    {
      title: "Technical Expertise",
      description: "Our team consists of highly qualified engineers and technicians with specialized knowledge.",
      icon: <Check className="h-5 w-5 text-mdpc-gold" />,
    },
    {
      title: "Quality Assurance",
      description: "Rigorous quality control and adherence to international standards on all projects.",
      icon: <Check className="h-5 w-5 text-mdpc-gold" />,
    },
    {
      title: "Innovative Solutions",
      description: "Employing cutting-edge technology and methods for optimal results.",
      icon: <Check className="h-5 w-5 text-mdpc-gold" />,
    },
    {
      title: "Client-Focused Approach",
      description: "Personalized service tailored to each client's specific needs and requirements.",
      icon: <Check className="h-5 w-5 text-mdpc-gold" />,
    },
    {
      title: "Nationwide Coverage",
      description: "Successfully completed projects across all geopolitical zones in Nigeria.",
      icon: <Check className="h-5 w-5 text-mdpc-gold" />,
    },
  ];

  const testimonials = [
    {
      quote: "MDPC Ltd. delivered our community water project ahead of schedule and with exceptional quality. Their team was professional, efficient, and attentive to our specific needs.",
      author: "Chief Adebayo Johnson",
      position: "Community Leader, Lagos State",
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80&w=2500",
    },
    {
      quote: "As a large-scale agricultural enterprise, we needed a reliable water solution. MDPC's irrigation system design and implementation has significantly boosted our productivity.",
      author: "Dr. Amina Mohammed",
      position: "Agricultural Director, Kano State Farms",
      image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&q=80&w=2500",
    },
    {
      quote: "The industrial water filtration system installed by MDPC has improved our manufacturing efficiency while ensuring we meet environmental compliance standards.",
      author: "Engr. Emeka Okafor",
      position: "Plant Manager, PH Industries",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2500",
    },
  ];

  return (
    <section 
      id="why-choose" 
      ref={sectionRef} 
      className="py-20"
      style={{
        backgroundImage: "linear-gradient(109.6deg, rgba(223,234,247,1) 11.2%, rgba(244,248,252,1) 91.1%)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="text-mdpc-brown-dark mt-8 text-lg">
            We combine technical expertise with a commitment to excellence, 
            delivering water solutions that stand the test of time.
          </p>
        </div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {advantages.map((advantage, index) => (
            <div 
              key={index}
              className={`bg-white p-6 rounded-lg shadow-lg transform transition-all duration-700 ${
                isInView 
                  ? "translate-y-0 opacity-100" 
                  : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start">
                <div className="bg-blue-50 p-3 rounded-full mr-4">
                  {advantage.icon}
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold text-mdpc-blue mb-2">{advantage.title}</h3>
                  <p className="text-mdpc-brown-dark text-sm">{advantage.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Counters */}
        <div className={`bg-white rounded-xl shadow-xl overflow-hidden mb-20 transform transition-all duration-700 ${
          isInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`} style={{ transitionDelay: "600ms" }}>
          <div className="grid grid-cols-2 md:grid-cols-4">
            <StatCounter number={500} suffix="+" label="Projects Completed" color="bg-mdpc-blue" />
            <StatCounter number={95} suffix="%" label="Client Satisfaction" color="bg-mdpc-gold" />
            <StatCounter number={32} suffix="+" label="Expert Engineers" color="bg-green-500" />
            <StatCounter number={10} suffix="+" label="Years Experience" color="bg-indigo-500" />
          </div>
        </div>

        {/* Testimonials */}
        <div className={`transform transition-all duration-700 ${
          isInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`} style={{ transitionDelay: "800ms" }}>
          <h3 className="text-2xl font-heading font-bold text-center mb-10">What Our Clients Say</h3>
          
          <div className="relative">
            {/* Testimonial Cards */}
            <div className="flex overflow-hidden relative">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className={`w-full flex-shrink-0 transition-all duration-700 transform ${
                    activeTestimonial === index 
                      ? "translate-x-0 opacity-100" 
                      : "absolute opacity-0"
                  }`}
                  style={{ transform: `translateX(${(index - activeTestimonial) * 100}%)` }}
                >
                  <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
                    <div className="md:flex">
                      <div className="md:flex-shrink-0">
                        <div className="h-48 w-full md:h-full md:w-48 bg-cover bg-center" style={{ backgroundImage: `url(${testimonial.image})` }}></div>
                      </div>
                      <div className="p-8 flex flex-col justify-between">
                        <div>
                          <div className="flex mb-4">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            ))}
                          </div>
                          <p className="italic text-gray-600 mb-4">"{testimonial.quote}"</p>
                        </div>
                        <div>
                          <p className="font-bold text-mdpc-blue">{testimonial.author}</p>
                          <p className="text-sm text-mdpc-brown-dark">{testimonial.position}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Testimonial Navigation Dots */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`h-3 w-3 rounded-full transition-all duration-300 ${
                    activeTestimonial === index 
                      ? "bg-mdpc-gold w-6" 
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  onClick={() => setActiveTestimonial(index)}
                  aria-label={`Testimonial ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatCounter = ({ number, suffix, label, color }: { number: number, suffix: string, label: string, color: string }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    
    const duration = 2000;
    const interval = 50;
    const steps = duration / interval;
    const increment = number / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= number) {
        current = number;
        clearInterval(timer);
        setHasAnimated(true);
      }
      setCount(Math.floor(current));
    }, interval);
    
    return () => clearInterval(timer);
  }, [number, hasAnimated]);

  return (
    <div className="p-6 text-center border-r border-b md:border-b-0 lg:border-r border-gray-100 group hover:bg-gray-50 transition-colors duration-300">
      <div className={`h-1 w-12 ${color} mx-auto mb-4 group-hover:w-20 transition-all duration-300`}></div>
      <div className="text-3xl md:text-4xl font-heading font-bold text-mdpc-brown-dark">
        {count}{suffix}
      </div>
      <p className="text-sm text-gray-500 mt-1 md:mt-2">{label}</p>
    </div>
  );
};

export default WhyChooseSection;
