
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logoImage from "@/assets/logo.jpg";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const staggeredContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  return (
    <footer className="bg-gradient-to-br from-mdpc-blue-dark to-mdpc-blue-darkest text-white relative overflow-hidden">
      {/* Decorative wave element */}
      <div className="absolute top-0 left-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full rotate-180">
          <path 
            fill="#fff" 
            fillOpacity="0.1" 
            d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,234.7C960,235,1056,181,1152,170.7C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
      
      {/* Main footer content */}
      <div className="container mx-auto px-4 pt-20 pb-10 relative z-10">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
          variants={staggeredContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Logo and company info */}
          <motion.div variants={fadeInUpVariants}>
            <div className="flex items-center mb-4">
              <img 
                src={logoImage} 
                alt="Midas Touch Drills" 
                className="h-12 w-12 rounded-full object-cover mr-3"
              />
              <div className="flex flex-col">
                <span className="font-heading font-bold text-xl leading-tight">Midas Touch</span>
                <span className="text-xs text-blue-100">Drills & Projects Consult</span>
              </div>
            </div>
            <p className="text-blue-100 mb-6 pr-4">
              Nigeria's leading borehole drilling and water solutions company providing top-tier services across the nation since 2010.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="bg-blue-300/10 hover:bg-blue-300/20 h-9 w-9 rounded-full flex items-center justify-center transition-colors">
                <svg className="h-4 w-4 text-blue-100" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                </svg>
              </a>
              <a href="#" className="bg-blue-300/10 hover:bg-blue-300/20 h-9 w-9 rounded-full flex items-center justify-center transition-colors">
                <svg className="h-4 w-4 text-blue-100" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.982 4.982 0 002.163-2.723 9.867 9.867 0 01-3.127 1.195 4.929 4.929 0 00-8.391 4.49A13.98 13.98 0 011.64 3.162a4.928 4.928 0 001.523 6.57 4.887 4.887 0 01-2.235-.616v.061a4.926 4.926 0 003.95 4.827 4.917 4.917 0 01-2.224.084 4.93 4.93 0 004.6 3.42A9.88 9.88 0 010 19.289a13.941 13.941 0 007.548 2.209c9.054 0 14.004-7.5 14.004-14.001 0-.21-.005-.42-.014-.63A9.936 9.936 0 0024 4.59l-.047-.02z" />
                </svg>
              </a>
              <a href="#" className="bg-blue-300/10 hover:bg-blue-300/20 h-9 w-9 rounded-full flex items-center justify-center transition-colors">
                <svg className="h-4 w-4 text-blue-100" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                </svg>
              </a>
              <a href="#" className="bg-blue-300/10 hover:bg-blue-300/20 h-9 w-9 rounded-full flex items-center justify-center transition-colors">
                <svg className="h-4 w-4 text-blue-100" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2zm4 8h-2V9h2v10z" />
                </svg>
              </a>
            </div>
          </motion.div>
          
          {/* Services */}
          <motion.div variants={fadeInUpVariants}>
            <h3 className="text-lg font-heading font-bold mb-4 relative inline-block">
              Our Services
              <span className="absolute left-0 bottom-[-5px] h-[2px] w-12 bg-mdpc-gold"></span>
            </h3>
            <ul className="space-y-3 text-blue-100">
              <li>
                <Link to="/drilling" className="hover:text-white transition-colors flex items-center">
                  <svg className="h-3 w-3 mr-2 text-mdpc-gold" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                  Borehole Drilling
                </Link>
              </li>
              <li>
                <Link to="/drilling" className="hover:text-white transition-colors flex items-center">
                  <svg className="h-3 w-3 mr-2 text-mdpc-gold" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                  Geophysical Survey
                </Link>
              </li>
              <li>
                <Link to="/drilling" className="hover:text-white transition-colors flex items-center">
                  <svg className="h-3 w-3 mr-2 text-mdpc-gold" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                  Water Treatment
                </Link>
              </li>
              <li>
                <Link to="/drilling" className="hover:text-white transition-colors flex items-center">
                  <svg className="h-3 w-3 mr-2 text-mdpc-gold" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                  Water System Installation
                </Link>
              </li>
              <li>
                <Link to="/logistics-services" className="hover:text-white transition-colors flex items-center">
                  <svg className="h-3 w-3 mr-2 text-mdpc-gold" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                  Logistics Services
                </Link>
              </li>
            </ul>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div variants={fadeInUpVariants}>
            <h3 className="text-lg font-heading font-bold mb-4 relative inline-block">
              Quick Links
              <span className="absolute left-0 bottom-[-5px] h-[2px] w-12 bg-mdpc-gold"></span>
            </h3>
            <ul className="space-y-3 text-blue-100">
              <li>
                <Link to="/projects" className="hover:text-white transition-colors flex items-center">
                  <svg className="h-3 w-3 mr-2 text-mdpc-gold" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                  Our Projects
                </Link>
              </li>
              <li>
                <Link to="/logistics" className="hover:text-white transition-colors flex items-center">
                  <svg className="h-3 w-3 mr-2 text-mdpc-gold" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                  Logistics
                </Link>
              </li>
              <li>
                <a href="/#about" className="hover:text-white transition-colors flex items-center">
                  <svg className="h-3 w-3 mr-2 text-mdpc-gold" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                  About Us
                </a>
              </li>
              <li>
                <a href="/#contact" className="hover:text-white transition-colors flex items-center">
                  <svg className="h-3 w-3 mr-2 text-mdpc-gold" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                  Contact Us
                </a>
              </li>
              <li>
                <Link to="/auth" className="hover:text-white transition-colors flex items-center">
                  <svg className="h-3 w-3 mr-2 text-mdpc-gold" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                  Client Portal
                </Link>
              </li>
            </ul>
          </motion.div>
          
          {/* Contact Info */}
          <motion.div variants={fadeInUpVariants}>
            <h3 className="text-lg font-heading font-bold mb-4 relative inline-block">
              Contact Us
              <span className="absolute left-0 bottom-[-5px] h-[2px] w-12 bg-mdpc-gold"></span>
            </h3>
            <ul className="space-y-4 text-blue-100">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-mdpc-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>84C, Oba Iyiola Oyewale Shopping Complex, MDS Behind Solaris Pharmacy<br />Osun, Nigeria</div>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-mdpc-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>+234 8034656063</div>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-mdpc-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>idris1987@yahoo.com</div>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-mdpc-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>Mon - Fri: 8:00 AM - 5:00 PM<br />Sat: 9:00 AM - 1:00 PM</div>
              </li>
            </ul>
          </motion.div>
        </motion.div>
        
        {/* Copyright */}
        <motion.div 
          className="mt-16 pt-8 border-t border-blue-800/30 text-blue-200/70 text-sm flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1, transition: { delay: 0.5, duration: 0.8 } }}
          viewport={{ once: true }}
        >
          <div className="mb-4 md:mb-0">
            &copy; {currentYear} Midas Touch Drills and Projects Consult Ltd. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
