
import { useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import LogisticsRequestForm from "../../components/forms/LogisticsRequestForm";
import Map from "../../components/ui/Map";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Truck, Package, Clock, MapPin, TruckIcon, CheckCircle } from "lucide-react";

const LogisticsHome = () => {
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

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="bg-gradient-to-b from-mdpc-brown-dark to-brown-900 text-white py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 animate-fade-in">Midas Touch Logistics</h1>
              <p className="text-xl mb-8 animate-fade-in" style={{animationDelay: "0.2s"}}>Reliable and efficient logistics solutions for businesses and individuals. Specialized in water system equipment transportation and bulky item delivery.</p>
              <div className="flex flex-wrap gap-4 justify-center animate-fade-in" style={{animationDelay: "0.4s"}}>
                <Button asChild size="lg" className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white">
                  <a href="#request-service">Request Delivery</a>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <a href="#services">Our Services</a>
                </Button>
              </div>
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
                <Card 
                  key={index} 
                  className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-on-scroll"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="text-center pb-2">
                    <div className="mx-auto text-mdpc-gold mb-4">{service.icon}</div>
                    <CardTitle className="text-xl text-mdpc-brown-dark">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-gray-600">
                    <p>{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button asChild size="lg" className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white animate-on-scroll">
                <a href="#request-service">Request Our Services</a>
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
                <Button asChild className="mt-8 bg-mdpc-gold hover:bg-mdpc-gold-dark text-white">
                  <a href="#request-service">Request Service</a>
                </Button>
              </div>
              
              <div className="lg:w-1/2 animate-on-scroll">
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src="/placeholder.svg" 
                    alt="Logistics Fleet" 
                    className="w-full h-80 object-cover"
                    style={{ background: 'linear-gradient(45deg, #e6b980 0%, #eacda3 100%)' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <TruckIcon className="h-32 w-32 text-white opacity-30" />
                  </div>
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
            
            <div className="max-w-5xl mx-auto animate-on-scroll">
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
            </div>
          </div>
        </section>
        
        <section id="request-service" className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4 animate-on-scroll">Request Our Logistics Services</h2>
              <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto animate-on-scroll">Fill out the form below to request our logistics services. Our team will get back to you as soon as possible to arrange your delivery.</p>
              <div className="animate-on-scroll">
                <LogisticsRequestForm />
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
