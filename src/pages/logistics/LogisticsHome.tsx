
import { useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Truck, Package, Clock, MapPin } from "lucide-react";

const LogisticsHome = () => {
  useEffect(() => {
    document.title = "Logistics Services | Midas Touch";
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
              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">Midas Touch Logistics</h1>
              <p className="text-xl mb-8">Reliable and efficient logistics solutions for businesses and individuals. Specialized in water system equipment transportation and bulky item delivery.</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white">
                  <Link to="/logistics/request">Request Delivery</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <Link to="/logistics/services">Our Services</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-mdpc-brown-dark mb-4">Our Logistics Services</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We provide specialized logistics solutions tailored to meet your transportation and delivery needs with reliability and efficiency.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
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
              <Button asChild size="lg" className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white">
                <Link to="/logistics/request">Request Our Services</Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-mdpc-brown-dark mb-6">Why Choose Midas Touch Logistics?</h2>
                <ul className="space-y-4 text-lg">
                  <li className="flex items-start">
                    <div className="bg-mdpc-gold rounded-full p-1 mr-3 mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span>Specialized in water systems & equipment transportation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-mdpc-gold rounded-full p-1 mr-3 mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span>Full coverage throughout Osun State</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-mdpc-gold rounded-full p-1 mr-3 mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span>Experienced team with proper equipment handling expertise</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-mdpc-gold rounded-full p-1 mr-3 mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span>Competitive pricing with flexible options</span>
                  </li>
                </ul>
                <Button asChild className="mt-8 bg-mdpc-gold hover:bg-mdpc-gold-dark text-white">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
              
              <div className="lg:w-1/2">
                <div className="bg-gray-200 h-80 rounded-lg flex items-center justify-center text-gray-500">
                  [Placeholder for Logistics Fleet Image]
                </div>
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
