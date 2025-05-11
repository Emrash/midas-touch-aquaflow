
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Phone, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle scroll to section
  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <a
              href="#"
              className="flex items-center gap-2"
              onClick={() => scrollToSection("hero")}
            >
              <div className="h-10 w-10 md:h-12 md:w-12 bg-mdpc-gold rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg md:text-xl">MD</span>
              </div>
              <div className={`transition-all duration-300 ${isScrolled ? "text-mdpc-brown" : "text-white"}`}>
                <span className="font-heading font-bold text-xl md:text-2xl">MDPC</span>
                <span className="hidden md:inline ml-1 text-sm font-light">Ltd.</span>
              </div>
            </a>
          </div>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center space-x-6">
            <NavLink label="Home" sectionId="hero" isScrolled={isScrolled} onClick={() => scrollToSection("hero")} />
            <NavLink label="About Us" sectionId="about" isScrolled={isScrolled} onClick={() => scrollToSection("about")} />
            <NavLink label="Services" sectionId="services" isScrolled={isScrolled} onClick={() => scrollToSection("services")} />
            <NavLink label="Projects" sectionId="projects" isScrolled={isScrolled} onClick={() => scrollToSection("projects")} />
            <NavLink label="Why Choose Us" sectionId="why-choose" isScrolled={isScrolled} onClick={() => scrollToSection("why-choose")} />
            <Button 
              onClick={() => scrollToSection("contact")}
              className="ml-4 bg-mdpc-gold hover:bg-mdpc-gold-dark text-white"
            >
              <Phone className="mr-2 h-4 w-4" />
              Contact Us
            </Button>
          </div>

          {/* Mobile menu button */}
          <button 
            className="lg:hidden p-2 rounded-md text-mdpc-brown"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} className={isScrolled ? "text-mdpc-brown" : "text-white"} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            <MobileNavLink label="Home" onClick={() => scrollToSection("hero")} />
            <MobileNavLink label="About Us" onClick={() => scrollToSection("about")} />
            <MobileNavLink label="Services" onClick={() => scrollToSection("services")} />
            <MobileNavLink label="Projects" onClick={() => scrollToSection("projects")} />
            <MobileNavLink label="Why Choose Us" onClick={() => scrollToSection("why-choose")} />
            <MobileNavLink label="Contact Us" onClick={() => scrollToSection("contact")} />
          </div>
        </div>
      )}
    </nav>
  );
};

type NavLinkProps = {
  label: string;
  sectionId: string;
  isScrolled: boolean;
  onClick: () => void;
};

const NavLink = ({ label, sectionId, isScrolled, onClick }: NavLinkProps) => {
  return (
    <button
      onClick={onClick}
      className={`font-medium relative transition duration-300 hover:text-mdpc-gold ${
        isScrolled ? "text-mdpc-brown-dark" : "text-white"
      }`}
    >
      {label}
      <span className="absolute bottom-[-5px] left-0 w-0 h-[2px] bg-mdpc-gold transition-all duration-300 group-hover:w-full"></span>
    </button>
  );
};

type MobileNavLinkProps = {
  label: string;
  onClick: () => void;
};

const MobileNavLink = ({ label, onClick }: MobileNavLinkProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left py-2 px-4 text-mdpc-brown hover:bg-gray-50 hover:text-mdpc-gold transition duration-300"
    >
      {label}
    </button>
  );
};

export default Navbar;
