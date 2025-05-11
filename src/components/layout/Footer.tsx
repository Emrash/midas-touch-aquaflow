
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-mdpc-brown text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 bg-mdpc-gold rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">MD</span>
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl">MDPC Ltd.</h3>
                <p className="text-sm text-gray-300">Midas Touch Drills and Projects Consult</p>
              </div>
            </div>
            <p className="mt-4 text-gray-300">
              Nigeria's foremost borehole drilling & project consulting partner, delivering excellence in water solutions and engineering services.
            </p>
            <div className="mt-6 flex space-x-4">
              <SocialIcon icon={Facebook} />
              <SocialIcon icon={Instagram} />
              <SocialIcon icon={Linkedin} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-heading font-semibold mb-4 border-b border-mdpc-gold/30 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <FooterLink text="Home" href="#hero" />
              <FooterLink text="About Us" href="#about" />
              <FooterLink text="Our Services" href="#services" />
              <FooterLink text="Projects" href="#projects" />
              <FooterLink text="Why Choose Us" href="#why-choose" />
              <FooterLink text="Contact Us" href="#contact" />
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-heading font-semibold mb-4 border-b border-mdpc-gold/30 pb-2">
              Our Services
            </h3>
            <ul className="space-y-2">
              <FooterLink text="Geophysical Survey" href="#services" />
              <FooterLink text="Borehole Drilling" href="#services" />
              <FooterLink text="Water Filtration" href="#services" />
              <FooterLink text="Pump Installation" href="#services" />
              <FooterLink text="Industrial Control" href="#services" />
              <FooterLink text="Mining & Core Drilling" href="#services" />
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-heading font-semibold mb-4 border-b border-mdpc-gold/30 pb-2">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex">
                <MapPin className="h-5 w-5 text-mdpc-gold mr-3 flex-shrink-0 mt-1" />
                <span>Lagos Office: 123 Admiralty Way, Lekki Phase 1, Lagos, Nigeria</span>
              </li>
              <li className="flex">
                <Phone className="h-5 w-5 text-mdpc-gold mr-3 flex-shrink-0" />
                <span>+234 800 123 4567</span>
              </li>
              <li className="flex">
                <Mail className="h-5 w-5 text-mdpc-gold mr-3 flex-shrink-0" />
                <span>info@midastouchdrills.com</span>
              </li>
            </ul>
            <Button className="mt-6 bg-mdpc-gold hover:bg-mdpc-gold-dark text-mdpc-brown-dark font-medium">
              Get a Quote
            </Button>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-300">
            © {currentYear} Midas Touch Drills and Projects Consult Ltd. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 text-sm text-gray-300">
            <a href="#" className="hover:text-mdpc-gold">Privacy Policy</a>
            <span className="mx-2">|</span>
            <a href="#" className="hover:text-mdpc-gold">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon: Icon }) => {
  return (
    <a 
      href="#" 
      className="h-9 w-9 rounded-full bg-white/10 hover:bg-mdpc-gold flex items-center justify-center transition-colors duration-300"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
};

const FooterLink = ({ text, href }) => {
  return (
    <li>
      <a 
        href={href} 
        className="hover:text-mdpc-gold transition-colors duration-300 flex items-center"
      >
        <span className="mr-2">›</span> {text}
      </a>
    </li>
  );
};

export default Footer;
