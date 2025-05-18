
import { useEffect } from "react";
import { useConsultation } from "../contexts/ConsultationContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/home/HeroSection";
import AboutSection from "../components/home/AboutSection";
import ServicesSection from "../components/home/ServicesSection";
import ProjectsSection from "../components/home/ProjectsSection";
import WhyChooseSection from "../components/home/WhyChooseSection";
import ContactSection from "../components/home/ContactSection";

const Index = () => {
  const { openModal } = useConsultation();

  useEffect(() => {
    // Set title and meta description
    document.title = "Midas Touch Drills and Projects Consult - Nigeria's Foremost Borehole Drilling Company";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Nigeria\'s leading borehole drilling and water solutions company providing geophysical surveys, borehole drilling, water filtration, and industrial control services.');
    }
    
    // Animate elements on scroll - with debouncing for performance
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
    
    // Debounced scroll handler
    let scrollTimeout: number;
    const handleScrollDebounced = () => {
      if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
      }
      scrollTimeout = window.requestAnimationFrame(animateOnScroll);
    };
    
    // Smooth scroll for anchor links with improved performance
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
    
    // Handle consultation and quote requests
    const handleConsultationClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('[data-action="consultation"]');
      
      if (button) {
        e.preventDefault();
        openModal('general', 'Request a Consultation', 'Tell us about your project needs and we'll get back to you within 24 hours.');
      }
    };
    
    // Add event listeners
    window.addEventListener('scroll', handleScrollDebounced);
    document.body.addEventListener('click', handleAnchorClick);
    document.body.addEventListener('click', handleConsultationClick);
    
    // Run once on initial load
    animateOnScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScrollDebounced);
      document.body.removeEventListener('click', handleAnchorClick);
      document.body.removeEventListener('click', handleConsultationClick);
    };
  }, [openModal]);

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
