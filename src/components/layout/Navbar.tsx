
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Phone, Menu, X, LogIn, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

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

  // Handle login/logout
  const handleAuth = () => {
    if (user) {
      logout();
    } else {
      navigate("/auth");
    }
  };

  // Go to admin dashboard or profile
  const handleProfile = () => {
    if (isAdmin) {
      navigate("/admin");
    } else {
      // For future implementation of user profile
      navigate("/profile");
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
            <Link
              to="/"
              className="flex items-center gap-2"
            >
              <div className="h-10 w-10 md:h-12 md:w-12 bg-mdpc-gold rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg md:text-xl">MD</span>
              </div>
              <div className={`transition-all duration-300 ${isScrolled ? "text-mdpc-brown" : "text-white"}`}>
                <span className="font-heading font-bold text-xl md:text-2xl">MDPC</span>
                <span className="hidden md:inline ml-1 text-sm font-light">Ltd.</span>
              </div>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/" className={`font-medium relative transition duration-300 hover:text-mdpc-gold ${
              isScrolled ? "text-mdpc-brown-dark" : "text-white"
            }`}>
              Home
            </Link>
            <Link to="/drilling" className={`font-medium relative transition duration-300 hover:text-mdpc-gold ${
              isScrolled ? "text-mdpc-brown-dark" : "text-white"
            }`}>
              Drilling Services
            </Link>
            <Link to="/logistics-services" className={`font-medium relative transition duration-300 hover:text-mdpc-gold ${
              isScrolled ? "text-mdpc-brown-dark" : "text-white"
            }`}>
              Logistics
            </Link>
            <Link to="/projects" className={`font-medium relative transition duration-300 hover:text-mdpc-gold ${
              isScrolled ? "text-mdpc-brown-dark" : "text-white"
            }`}>
              Projects
            </Link>
            
            <Button 
              onClick={() => scrollToSection("contact")}
              className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white"
            >
              <Phone className="mr-2 h-4 w-4" />
              Contact Us
            </Button>
            
            {user ? (
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline"
                  onClick={handleProfile}
                  className={`border ${isScrolled ? "border-mdpc-brown text-mdpc-brown" : "border-white text-white"}`}
                >
                  <User className="mr-2 h-4 w-4" />
                  {isAdmin ? "Dashboard" : "Profile"}
                </Button>
                <Button 
                  variant="ghost"
                  onClick={handleAuth}
                  className={isScrolled ? "text-mdpc-brown" : "text-white"}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline"
                onClick={handleAuth}
                className={`border ${isScrolled ? "border-mdpc-brown text-mdpc-brown" : "border-white text-white"}`}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            )}
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
            <Link to="/" className="w-full text-left py-2 px-4 text-mdpc-brown hover:bg-gray-50 hover:text-mdpc-gold transition duration-300">
              Home
            </Link>
            <Link to="/drilling" className="w-full text-left py-2 px-4 text-mdpc-brown hover:bg-gray-50 hover:text-mdpc-gold transition duration-300">
              Drilling Services
            </Link>
            <Link to="/logistics-services" className="w-full text-left py-2 px-4 text-mdpc-brown hover:bg-gray-50 hover:text-mdpc-gold transition duration-300">
              Logistics
            </Link>
            <Link to="/projects" className="w-full text-left py-2 px-4 text-mdpc-brown hover:bg-gray-50 hover:text-mdpc-gold transition duration-300">
              Projects
            </Link>
            <button 
              onClick={() => {
                scrollToSection("contact");
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-4 text-mdpc-brown hover:bg-gray-50 hover:text-mdpc-gold transition duration-300"
            >
              Contact Us
            </button>
            
            {user ? (
              <>
                <button
                  onClick={() => {
                    handleProfile();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-4 text-mdpc-brown hover:bg-gray-50 hover:text-mdpc-gold transition duration-300"
                >
                  {isAdmin ? "Admin Dashboard" : "My Profile"}
                </button>
                <button
                  onClick={() => {
                    handleAuth();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-4 text-mdpc-brown hover:bg-gray-50 hover:text-mdpc-gold transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  handleAuth();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-4 text-mdpc-brown hover:bg-gray-50 hover:text-mdpc-gold transition duration-300"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
