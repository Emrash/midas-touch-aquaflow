
import { useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Map from "../../components/ui/Map";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Truck, Package, Clock, MapPin, TruckIcon, CheckCircle } from "lucide-react";
import { useConsultation } from "@/contexts/ConsultationContext";
import { motion } from "framer-motion";

const LogisticsHome = () => {
  const { openModal } = useConsultation();

  useEffect(() => {
    document.title = "Logistics Services | Midas Touch";
    
    // Animation effect on scroll
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      
      elements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
          element.classList.add('animated');
        }
      });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on initial load
    
    return () => {
      window.removeEventListener('scroll', animateOnScroll);
    };
  }, []);

  const services = [
    {
      icon: <Truck className="h-10 w-10" />,
      title: "Bulky Delivery",
      description: "Specialized transportation for heavy equipment, water tanks, and construction materials.",
    },
    {
      icon: <Package className="h-10 w-10" />,
      title: "Doorstep Delivery",
      description: "Safe and reliable delivery of items directly to your specified location.",
    },
    {
      icon: <Clock className="h-10 w-10" />,
      title: "Express Delivery",
      description: "Urgent shipping options with priority handling for time-sensitive deliveries.",
    },
    {
      icon: <MapPin className="h-10 w-10" />,
      title: "Osun State-wide Coverage",
      description: "Comprehensive delivery services covering all regions within Osun State.",
    },
  ];

  const handleRequestDelivery = () => {
    openModal('logistics', 'Request Delivery Service', 'Fill out the form below to request our logistics services. Our team will get back to you as soon as possible to arrange your delivery.');
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="bg-gradient-to-b from-mdpc-brown-dark to-mdpc-brown-darkest text-white py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-6xl font-heading font-bold mb-6"
              >
                Midas Touch Logistics
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-xl mb-8"
              >
                Reliable and efficient logistics solutions for businesses and individuals. Specialized in water system equipment transportation and bulky item delivery.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap gap-4 justify-center"
              >
                <Button 
                  onClick={handleRequestDelivery}
                  size="lg" 
                  className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white"
                >
                  Request Delivery
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white/10"
                >
                  <a href="#services">Our Services</a>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
        
        <section id="services" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-mdpc-brown-dark mb-4 animate-on-scroll">Our Logistics Services</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto animate-on-scroll">
                We provide specialized logistics solutions tailored to meet your transportation and delivery needs with reliability and efficiency.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="text-center pb-2">
                      <div className="mx-auto text-mdpc-gold mb-4">{service.icon}</div>
                      <CardTitle className="text-xl text-mdpc-brown-dark">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-gray-600">
                      <p>{service.description}</p>
                    </CardContent>
                    <CardFooter className="pt-0 justify-center">
                      <Button 
                        variant="link" 
                        onClick={() => openModal('logistics', `Learn More: ${service.title}`, `Get more information about our ${service.title} service.`)}
                        className="text-mdpc-blue hover:text-mdpc-gold"
                      >
                        Learn More
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button 
                onClick={handleRequestDelivery}
                size="lg" 
                className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white animate-on-scroll"
              >
                Request Our Services
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 animate-on-scroll">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-mdpc-brown-dark mb-6">Why Choose Midas Touch Logistics?</h2>
                <ul className="space-y-4 text-lg">
                  <li className="flex items-start">
                    <div className="bg-mdpc-gold rounded-full p-1 mr-3 mt-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span>Specialized in water systems & equipment transportation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-mdpc-gold rounded-full p-1 mr-3 mt-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span>Full coverage throughout Osun State</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-mdpc-gold rounded-full p-1 mr-3 mt-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span>Experienced team with proper equipment handling expertise</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-mdpc-gold rounded-full p-1 mr-3 mt-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span>Competitive pricing with flexible options</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-mdpc-gold rounded-full p-1 mr-3 mt-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span>Prompt and professional service</span>
                  </li>
                </ul>
                <Button 
                  onClick={handleRequestDelivery}
                  className="mt-8 bg-mdpc-gold hover:bg-mdpc-gold-dark text-white"
                >
                  Request Service
                </Button>
              </div>
              
              <div className="lg:w-1/2 animate-on-scroll">
                <div className="rounded-lg overflow-hidden shadow-lg relative h-80">
                  <div className="absolute inset-0 bg-gradient-to-br from-mdpc-gold/20 to-mdpc-brown-light/20"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGxvZ2lzdGljc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" 
                    alt="Logistics Fleet" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                      e.currentTarget.style.background = 'linear-gradient(45deg, #e6b980 0%, #eacda3 100%)';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const icon = document.createElement('div');
                        icon.className = "absolute inset-0 flex items-center justify-center";
                        icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="opacity-30"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>';
                        parent.appendChild(icon);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section id="service-areas" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-mdpc-brown-dark mb-4 animate-on-scroll">Our Service Areas</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto animate-on-scroll">
                Midas Touch Logistics provides comprehensive coverage across Osun State, ensuring reliable delivery services to all locations.
              </p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.3 }}
              className="max-w-5xl mx-auto"
            >
              <Map 
                center={[7.5898, 4.5737]} 
                zoom={10}
                markers={[
                  { position: [7.5898, 4.5737], popup: "Midas Touch HQ, Osogbo", isMain: true },
                  { position: [7.6256, 4.1861], popup: "Service Area - Ife", isMain: false },
                  { position: [7.7667, 4.5556], popup: "Service Area - Ilesa", isMain: false },
                  { position: [7.5801, 4.2493], popup: "Service Area - Gbongan", isMain: false },
                  { position: [7.4106, 4.3319], popup: "Service Area - Iwo", isMain: false },
                ]}
                height="500px"
              />
            </motion.div>
          </div>
        </section>
        
        <section id="request-service" className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4 animate-on-scroll">Ready to Schedule a Delivery?</h2>
              <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto animate-on-scroll">
                Get your equipment, materials, or products delivered safely and on time with our professional logistics services.
              </p>
              <div className="text-center animate-on-scroll">
                <Button 
                  onClick={handleRequestDelivery}
                  size="lg"
                  className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white"
                >
                  Request Delivery Service
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LogisticsHome;
