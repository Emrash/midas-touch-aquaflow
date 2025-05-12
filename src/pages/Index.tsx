
import { useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/home/HeroSection";
import AboutSection from "../components/home/AboutSection";
import ServicesSection from "../components/home/ServicesSection";
import ProjectsSection from "../components/home/ProjectsSection";
import WhyChooseSection from "../components/home/WhyChooseSection";
import ContactSection from "../components/home/ContactSection";

const Index = () => {
  useEffect(() => {
    // Set title and meta description
    document.title = "Midas Touch Drills and Projects Consult - Nigeria's Foremost Borehole Drilling Company";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Nigeria\'s leading borehole drilling and water solutions company providing geophysical surveys, borehole drilling, water filtration, and industrial control services.');
    }
    
    // Animate elements on scroll
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
    
    // Smooth scroll for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.hash && anchor.hash.startsWith('#') && document.querySelector(anchor.hash)) {
        e.preventDefault();
        const element = document.querySelector(anchor.hash);
        
        if (element) {
          const offset = 100;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without page reload
          window.history.pushState(null, '', anchor.hash);
        }
      }
    };
    
    // Add event listeners
    window.addEventListener('scroll', animateOnScroll);
    document.body.addEventListener('click', handleAnchorClick);
    
    // Run once on initial load
    animateOnScroll();
    
    return () => {
      window.removeEventListener('scroll', animateOnScroll);
      document.body.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <WhyChooseSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
