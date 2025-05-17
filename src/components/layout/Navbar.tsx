
import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, User, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Close mobile menu when navigating or clicking outside
  useEffect(() => {
    const handleRouteChange = () => {
      setMobileMenuOpen(false);
    };
    
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.getElementById('mobile-menu');
      const button = document.getElementById('mobile-menu-button');
      
      if (mobileMenuOpen && menu && !menu.contains(event.target as Node) && button && !button.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [mobileMenuOpen, location]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setDarkMode(!darkMode);
  };

  return (
    <header 
      className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 dark:bg-mdpc-brown-darkest/95 shadow-md backdrop-blur-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center z-20">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center mr-3 transition-all duration-300 ${
              scrolled ? 'bg-mdpc-blue' : 'bg-mdpc-gold'
            }`}>
              <span className="text-white font-heading font-bold text-xl">MD</span>
            </div>
            <div className={`flex flex-col transition-colors duration-300 ${
              scrolled ? 'text-mdpc-brown-dark dark:text-white' : 'text-white'
            }`}>
              <span className="font-heading font-bold text-lg leading-tight">Midas Touch</span>
              <span className="text-xs opacity-90">Drills & Projects Consult</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <NavLink
              to="/"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''} ${
                scrolled ? 'text-mdpc-brown-dark dark:text-white' : 'text-white'
              }`}
            >
              Home
            </NavLink>
            
            <div className="relative group">
              <button 
                className={`nav-link flex items-center ${
                  location.pathname === "/drilling" || location.pathname === "/logistics-services" 
                  ? 'active' : ''
                } ${
                  scrolled ? 'text-mdpc-brown-dark dark:text-white' : 'text-white'
                }`}
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                onMouseEnter={() => setServicesDropdownOpen(true)}
                onMouseLeave={() => setServicesDropdownOpen(false)}
              >
                <span>Services</span>
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-300 ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {servicesDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 w-60 bg-white dark:bg-mdpc-brown-darkest shadow-lg rounded-lg overflow-hidden mt-1 border border-gray-100 dark:border-gray-800 z-50"
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <div className="py-1">
                      <Link 
                        to="/drilling" 
                        className="flex items-center px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-mdpc-brown-dark dark:text-gray-200"
                      >
                        <span className="h-8 w-8 rounded-full bg-mdpc-blue/10 dark:bg-mdpc-blue/20 flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-mdpc-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        </span>
                        <div>
                          <div className="font-medium">Drilling Services</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Boreholes & water systems</div>
                        </div>
                      </Link>
                      <Link 
                        to="/logistics-services" 
                        className="flex items-center px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-mdpc-brown-dark dark:text-gray-200"
                      >
                        <span className="h-8 w-8 rounded-full bg-mdpc-gold/10 dark:bg-mdpc-gold/20 flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-mdpc-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                          </svg>
                        </span>
                        <div>
                          <div className="font-medium">Logistics Services</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Transportation & delivery</div>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <NavLink
              to="/projects"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''} ${
                scrolled ? 'text-mdpc-brown-dark dark:text-white' : 'text-white'
              }`}
            >
              Projects
            </NavLink>
            
            <NavLink
              to="/logistics"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''} ${
                scrolled ? 'text-mdpc-brown-dark dark:text-white' : 'text-white'
              }`}
            >
              Logistics
            </NavLink>
            
            <a 
              href="/#contact"
              className={`nav-link ${
                scrolled ? 'text-mdpc-brown-dark dark:text-white' : 'text-white'
              }`}
            >
              Contact
            </a>
          </nav>

          {/* Right side actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${
                scrolled 
                ? 'text-mdpc-brown hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800' 
                : 'text-white hover:bg-white/10'
              }`}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            {user ? (
              <Link to="/profile">
                <Button 
                  size="sm" 
                  className={`rounded-full ${
                    scrolled 
                    ? 'bg-mdpc-blue hover:bg-mdpc-blue-dark' 
                    : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  <User className="h-4 w-4 mr-2" />
                  <span>Profile</span>
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button 
                  size="sm" 
                  className={`rounded-full ${
                    scrolled 
                    ? 'bg-mdpc-gold hover:bg-mdpc-gold-dark' 
                    : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            id="mobile-menu-button"
            className="lg:hidden z-20 p-2 rounded-md focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className={`h-6 w-6 ${scrolled && !mobileMenuOpen ? 'text-mdpc-brown-dark dark:text-white' : 'text-white'}`} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className={`h-6 w-6 ${scrolled && !mobileMenuOpen ? 'text-mdpc-brown-dark dark:text-white' : 'text-white'}`} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                id="mobile-menu"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed inset-0 top-0 z-10 bg-mdpc-blue-dark/95 backdrop-blur-lg lg:hidden overflow-y-auto"
              >
                <div className="container mx-auto px-4 pt-24 pb-8">
                  <nav className="flex flex-col space-y-2">
                    <NavLink
                      to="/"
                      className={({ isActive }) => `text-white text-xl py-3 px-4 rounded-lg ${
                        isActive ? 'bg-white/10 font-semibold' : 'hover:bg-white/5'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Home
                    </NavLink>
                    
                    <div className="text-white text-xl py-2 px-4">
                      <div className="font-semibold mb-2">Our Services</div>
                      <div className="pl-2 space-y-2">
                        <NavLink
                          to="/drilling"
                          className={({ isActive }) => `flex items-center py-2 px-2 rounded-lg ${
                            isActive ? 'bg-white/10 font-medium' : 'hover:bg-white/5'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <span className="h-8 w-8 rounded-full bg-blue-400/20 flex items-center justify-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                          </span>
                          Drilling Services
                        </NavLink>
                        <NavLink
                          to="/logistics-services"
                          className={({ isActive }) => `flex items-center py-2 px-2 rounded-lg ${
                            isActive ? 'bg-white/10 font-medium' : 'hover:bg-white/5'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <span className="h-8 w-8 rounded-full bg-yellow-400/20 flex items-center justify-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                            </svg>
                          </span>
                          Logistics Services
                        </NavLink>
                      </div>
                    </div>
                    
                    <NavLink
                      to="/projects"
                      className={({ isActive }) => `text-white text-xl py-3 px-4 rounded-lg ${
                        isActive ? 'bg-white/10 font-semibold' : 'hover:bg-white/5'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Projects
                    </NavLink>
                    
                    <NavLink
                      to="/logistics"
                      className={({ isActive }) => `text-white text-xl py-3 px-4 rounded-lg ${
                        isActive ? 'bg-white/10 font-semibold' : 'hover:bg-white/5'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Logistics
                    </NavLink>
                    
                    <a 
                      href="/#contact"
                      className="text-white text-xl py-3 px-4 rounded-lg hover:bg-white/5"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Contact
                    </a>
                  </nav>
                  
                  <div className="mt-8 border-t border-white/10 pt-6 flex flex-col space-y-4">
                    <div className="flex items-center justify-between px-4">
                      <span className="text-white">Dark Mode</span>
                      <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full text-white hover:bg-white/10"
                        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                      >
                        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                      </button>
                    </div>
                    
                    {user ? (
                      <Link 
                        to="/profile"
                        className="bg-white/10 text-white text-center py-3 rounded-lg hover:bg-white/20 transition duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User className="h-5 w-5 inline-block mr-2" />
                        Profile
                      </Link>
                    ) : (
                      <Link 
                        to="/auth"
                        className="bg-mdpc-gold text-white text-center py-3 rounded-lg hover:bg-mdpc-gold-dark transition duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
