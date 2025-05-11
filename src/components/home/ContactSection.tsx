
import { useEffect, useState, useRef } from "react";
import ContactForm from "../ui/ContactForm";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const ContactSection = () => {
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

  return (
    <section 
      id="contact" 
      ref={sectionRef} 
      className="relative py-20 bg-white"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-mdpc-blue opacity-10 transform -skew-x-12"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="section-title">Contact Us</h2>
          <p className="text-mdpc-brown-dark mt-8">
            Have questions about our services or ready to start your project?
            Reach out to us through any of the methods below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div 
            className={`lg:col-span-1 transform transition-all duration-700 ${
              isInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
              <div className="bg-mdpc-blue text-white p-6">
                <h3 className="text-xl font-heading font-bold">Get In Touch</h3>
                <p className="text-blue-100 mt-2">
                  Our expert team is ready to answer your questions and discuss your project needs.
                </p>
              </div>
              
              <div className="p-6 space-y-6">
                <ContactInfo 
                  icon={<Phone className="h-5 w-5 text-mdpc-gold" />}
                  title="Phone Number"
                  content={<a href="tel:+2348001234567" className="hover:text-mdpc-blue transition-colors">+234 800 123 4567</a>}
                />
                
                <ContactInfo 
                  icon={<Mail className="h-5 w-5 text-mdpc-gold" />}
                  title="Email Address"
                  content={<a href="mailto:info@midastouchdrills.com" className="hover:text-mdpc-blue transition-colors break-all">info@midastouchdrills.com</a>}
                />
                
                <ContactInfo 
                  icon={<MapPin className="h-5 w-5 text-mdpc-gold" />}
                  title="Office Address"
                  content={<>
                    <p>123 Admiralty Way, Lekki Phase 1</p>
                    <p>Lagos, Nigeria</p>
                  </>}
                />
                
                <ContactInfo 
                  icon={<Clock className="h-5 w-5 text-mdpc-gold" />}
                  title="Business Hours"
                  content={<>
                    <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                    <p>Saturday: 9:00 AM - 1:00 PM</p>
                  </>}
                />
              </div>
              
              <div className="p-6 bg-gray-50">
                <h4 className="font-medium text-mdpc-brown mb-3">Follow Us</h4>
                <div className="flex space-x-3">
                  <a href="#" className="bg-gray-200 hover:bg-mdpc-gold text-mdpc-brown hover:text-white h-10 w-10 rounded-full flex items-center justify-center transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                    </svg>
                  </a>
                  <a href="#" className="bg-gray-200 hover:bg-mdpc-gold text-mdpc-brown hover:text-white h-10 w-10 rounded-full flex items-center justify-center transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.982 4.982 0 002.163-2.723 9.867 9.867 0 01-3.127 1.195 4.929 4.929 0 00-8.391 4.49A13.98 13.98 0 011.64 3.162a4.928 4.928 0 001.523 6.57 4.887 4.887 0 01-2.235-.616v.061a4.926 4.926 0 003.95 4.827 4.917 4.917 0 01-2.224.084 4.93 4.93 0 004.6 3.42A9.88 9.88 0 010 19.289a13.941 13.941 0 007.548 2.209c9.054 0 14.004-7.5 14.004-14.001 0-.21-.005-.42-.014-.63A9.936 9.936 0 0024 4.59l-.047-.02z" />
                    </svg>
                  </a>
                  <a href="#" className="bg-gray-200 hover:bg-mdpc-gold text-mdpc-brown hover:text-white h-10 w-10 rounded-full flex items-center justify-center transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                    </svg>
                  </a>
                  <a href="#" className="bg-gray-200 hover:bg-mdpc-gold text-mdpc-brown hover:text-white h-10 w-10 rounded-full flex items-center justify-center transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2zm4 8h-2V9h2v10z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div 
            className={`lg:col-span-2 transform transition-all duration-700 ${
              isInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-heading font-bold text-mdpc-blue mb-6">Send Us a Message</h3>
              <ContactForm />
            </div>
          </div>
        </div>

        {/* Google Maps */}
        <div 
          className={`mt-12 rounded-xl overflow-hidden shadow-lg h-64 transform transition-all duration-700 ${
            isInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          {/* Map placeholder - In a real implementation, replace with embedded Google Maps */}
          <div className="bg-gray-300 h-full relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-mdpc-brown">Google Maps Embed of Office Location in Lagos</p>
              {/* Map pin icon */}
              <div className="absolute">
                <div className="h-10 w-10 bg-mdpc-gold rounded-full flex items-center justify-center animate-bounce">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-mdpc-gold mx-auto"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div 
          className={`mt-16 text-center transform transition-all duration-700 ${
            isInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <h3 className="text-2xl font-heading font-bold mb-4">Ready to Start Your Project?</h3>
          <p className="text-mdpc-brown-dark mb-8 max-w-2xl mx-auto">
            Our team is ready to help you with your water solution needs. 
            Contact us today for a free consultation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="tel:+2348001234567"
              className="bg-mdpc-blue hover:bg-mdpc-blue-dark text-white font-semibold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center"
            >
              <Phone className="h-5 w-5 mr-2" />
              Call Us Now
            </a>
            <a 
              href="mailto:info@midastouchdrills.com"
              className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white font-semibold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center"
            >
              <Mail className="h-5 w-5 mr-2" />
              Email Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactInfo = ({ 
  icon, 
  title, 
  content 
}: { 
  icon: React.ReactNode; 
  title: string; 
  content: React.ReactNode; 
}) => {
  return (
    <div className="flex">
      <div className="flex-shrink-0 mt-1">
        <div className="bg-blue-50 p-2 rounded-full">
          {icon}
        </div>
      </div>
      <div className="ml-4">
        <h4 className="text-sm font-medium text-mdpc-blue mb-1">{title}</h4>
        <div className="text-mdpc-brown-dark">{content}</div>
      </div>
    </div>
  );
};

export default ContactSection;
