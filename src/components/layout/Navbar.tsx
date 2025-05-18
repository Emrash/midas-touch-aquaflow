
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../ui/ThemeToggle";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.hash === path;
  };

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

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 dark:bg-mdpc-brown-darkest/95 shadow-md backdrop-blur-sm py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-mdpc-gold to-mdpc-gold-dark flex items-center justify-center shadow-gold-glow">
            <span className="text-white font-heading font-bold text-lg">MD</span>
          </div>
          <div className="ml-2">
            <h1 className="text-mdpc-brown-dark dark:text-mdpc-gold text-lg font-heading font-bold leading-tight">
              Midas Touch
            </h1>
            <p className="text-xs text-mdpc-brown dark:text-mdpc-brown-light leading-tight">
              Drills & Projects Consult
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <NavLink to="/" active={isActive("/")}>
            Home
          </NavLink>
          <NavLink to="/drilling" active={isActive("/drilling")}>
            Drilling
          </NavLink>
          <NavLink to="/logistics" active={isActive("/logistics")}>
            Logistics
          </NavLink>
          <NavLink to="/projects" active={isActive("/projects")}>
            Projects
          </NavLink>
          <NavLink to="/#contact" active={isActive("#contact")}>
            Contact
          </NavLink>
          <ThemeToggle />
          <Button
            className={`ml-4 ${
              isScrolled
                ? "bg-mdpc-gold hover:bg-mdpc-gold-dark"
                : "bg-white/10 hover:bg-white/20 border border-white/30"
            } text-white font-medium`}
          >
            Get a Quote
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="ml-2 text-mdpc-brown-dark dark:text-mdpc-brown-light p-2"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen
            ? "max-h-[300px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="container mx-auto px-4 py-4 bg-white/95 dark:bg-mdpc-brown-darkest/95 shadow-lg">
          <div className="flex flex-col space-y-2">
            <MobileNavLink to="/" active={isActive("/")}>
              Home
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
            <Button className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white font-medium mt-2">
              Get a Quote
            </Button>
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
}

const NavLink = ({ to, active, children }: NavLinkProps) => (
  <Link to={to} className={`nav-link ${active ? "active" : ""}`}>
    {children}
  </Link>
);

const MobileNavLink = ({ to, active, children }: NavLinkProps) => (
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
