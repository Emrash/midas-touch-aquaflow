
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../ui/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { 
  User,
  LogIn,
  Menu,
  X,
  Home
} from "lucide-react";
import logoImage from "@/assets/logo.jpg";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path || location.hash === path;
  };

  const isAdminDashboard = location.pathname === '/admin';
  const isHomepage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleGetQuote = () => {
    if (location.pathname === '/') {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/#contact');
    }
  };

  const handleBackToWebsite = () => {
    console.log("Navigating back to website home page");
    navigate('/');
  };

  // Dynamic navbar styling based on scroll state and current route
  const getNavbarClasses = () => {
    if (isAdminDashboard) {
      return "bg-white/95 dark:bg-mdpc-brown-darkest/95 shadow-md backdrop-blur-sm py-2";
    }
    
    if (isScrolled) {
      return "bg-white/95 dark:bg-mdpc-brown-darkest/95 shadow-md backdrop-blur-sm py-2";
    }
    
    return "bg-transparent py-4";
  };

  // Dynamic text styling for navbar items based on scroll state and route
  const getNavTextClass = (isActive: boolean) => {
    if (isActive) {
      return "text-mdpc-blue dark:text-mdpc-gold font-medium";
    }
    
    if (isScrolled || !isHomepage) {
      return "text-mdpc-brown-dark dark:text-mdpc-brown-light";
    }
    
    return "text-white dark:text-mdpc-brown-light font-medium";
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${getNavbarClasses()}`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src={logoImage} 
            alt="Midas Touch Drills"
            className="h-10 w-auto rounded-full"
          />
          <div className="ml-2">
            <h1 className={`${isScrolled || !isHomepage ? "text-mdpc-brown-dark dark:text-mdpc-gold" : "text-white dark:text-mdpc-gold"} text-lg font-heading font-bold leading-tight`}>
              Midas Touch
            </h1>
            <p className={`text-xs ${isScrolled || !isHomepage ? "text-mdpc-brown dark:text-mdpc-brown-light" : "text-white/80 dark:text-mdpc-brown-light"} leading-tight`}>
              Drills & Projects Consult
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {/* Show Back to Website button when on admin dashboard */}
          {isAdminDashboard ? (
            <Button
              onClick={handleBackToWebsite}
              variant="outline"
              className="mr-2 flex items-center gap-2"
            >
              <Home size={18} />
              Back to Website
            </Button>
          ) : (
            <>
              <NavLink to="/" active={isActive("/")} isScrolled={isScrolled} isHomepage={isHomepage}>
                Home
              </NavLink>
              <NavLink to="/services" active={isActive("/services")} isScrolled={isScrolled} isHomepage={isHomepage}>
                Services
              </NavLink>
              <NavLink to="/drilling" active={isActive("/drilling")} isScrolled={isScrolled} isHomepage={isHomepage}>
                Drilling
              </NavLink>
              <NavLink to="/logistics" active={isActive("/logistics")} isScrolled={isScrolled} isHomepage={isHomepage}>
                Logistics
              </NavLink>
              <NavLink to="/projects" active={isActive("/projects")} isScrolled={isScrolled} isHomepage={isHomepage}>
                Projects
              </NavLink>
              <NavLink to="/#contact" active={isActive("#contact")} isScrolled={isScrolled} isHomepage={isHomepage}>
                Contact
              </NavLink>
            </>
          )}
          
          <ThemeToggle />
          
          {user ? (
            <div className="flex items-center gap-2 ml-4">
              <Button
                asChild
                variant="ghost"
                className={`flex items-center gap-2 ${isScrolled || !isHomepage ? "text-mdpc-brown-dark dark:text-mdpc-brown-light" : "text-white dark:text-mdpc-brown-light"}`}
              >
                <Link to={isAdmin ? "/admin" : "/profile"}>
                  <User size={18} />
                  <span className="hidden lg:inline">
                    {isAdmin ? "Admin" : "Profile"}
                  </span>
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className={`${isScrolled || !isHomepage ? "border-mdpc-brown/30 dark:border-mdpc-gold/20 text-mdpc-brown-dark dark:text-mdpc-brown-light" : "border-white/40 text-white dark:border-mdpc-gold/20 dark:text-mdpc-brown-light"}`}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              asChild
              variant="outline"
              className={`ml-4 flex items-center gap-2 ${isScrolled || !isHomepage ? "border-mdpc-brown/30 dark:border-mdpc-gold/20 text-mdpc-brown-dark dark:text-mdpc-brown-light" : "border-white/40 text-white dark:border-mdpc-gold/20 dark:text-mdpc-brown-light"}`}
            >
              <Link to="/auth">
                <LogIn size={18} />
                <span>Login</span>
              </Link>
            </Button>
          )}
          
          {!isAdminDashboard && (
            <Button
              onClick={handleGetQuote}
              className={`ml-4 ${
                isScrolled || !isHomepage
                  ? "bg-mdpc-gold hover:bg-mdpc-gold-dark"
                  : "bg-white/10 hover:bg-white/20 border border-white/30"
              } text-white font-medium`}
            >
              Request Consultation
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`ml-2 ${isScrolled || !isHomepage ? "text-mdpc-brown-dark dark:text-mdpc-brown-light" : "text-white dark:text-mdpc-brown-light"} p-2`}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen
            ? "max-h-[400px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="container mx-auto px-4 py-4 bg-white/95 dark:bg-mdpc-brown-darkest/95 shadow-lg">
          <div className="flex flex-col space-y-2">
            {isAdminDashboard ? (
              <Button
                onClick={handleBackToWebsite}
                variant="outline"
                className="w-full justify-start flex items-center gap-2"
              >
                <Home size={18} />
                Back to Website
              </Button>
            ) : (
              <>
                <MobileNavLink to="/" active={isActive("/")}>
                  Home
                </MobileNavLink>
                <MobileNavLink to="/services" active={isActive("/services")}>
                  Services
                </MobileNavLink>
                <MobileNavLink to="/drilling" active={isActive("/drilling")}>
                  Drilling
                </MobileNavLink>
                <MobileNavLink to="/logistics" active={isActive("/logistics")}>
                  Logistics
                </MobileNavLink>
                <MobileNavLink to="/projects" active={isActive("/projects")}>
                  Projects
                </MobileNavLink>
                <MobileNavLink to="/#contact" active={isActive("#contact")}>
                  Contact
                </MobileNavLink>
              </>
            )}
            
            {user ? (
              <>
                <MobileNavLink 
                  to={isAdmin ? "/admin" : "/profile"} 
                  active={isActive(isAdmin ? "/admin" : "/profile")}
                >
                  {isAdmin ? "Admin Dashboard" : "My Profile"}
                </MobileNavLink>
                <Button 
                  variant="outline" 
                  onClick={() => signOut()} 
                  className="mt-2 w-full justify-start"
                >
                  Logout
                </Button>
              </>
            ) : (
              <MobileNavLink to="/auth" active={isActive("/auth")}>
                Login / Register
              </MobileNavLink>
            )}
            
            {!isAdminDashboard && (
              <Button onClick={handleGetQuote} className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white font-medium mt-2">
                Request Consultation
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
  isScrolled: boolean;
  isHomepage: boolean;
}

const NavLink = ({ to, active, children, isScrolled, isHomepage }: NavLinkProps) => {
  // Dynamic text styling based on scroll state, active status and route
  const textClasses = active 
    ? "text-mdpc-blue dark:text-mdpc-gold font-medium" 
    : (isScrolled || !isHomepage)
      ? "text-mdpc-brown-dark dark:text-mdpc-brown-light"
      : "text-white dark:text-mdpc-brown-light font-medium";
  
  return (
    <Link 
      to={to} 
      className={`py-2 px-3 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-mdpc-brown-dark/20 ${textClasses}`}
    >
      {children}
    </Link>
  );
};

interface MobileNavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const MobileNavLink = ({ to, active, children }: MobileNavLinkProps) => (
  <Link
    to={to}
    className={`block py-2 px-3 text-mdpc-brown-dark dark:text-mdpc-brown-light hover:bg-gray-50 dark:hover:bg-mdpc-brown-darkest/70 rounded-md ${
      active ? "text-mdpc-blue dark:text-mdpc-gold font-medium" : ""
    }`}
  >
    {children}
  </Link>
);

export default Navbar;
