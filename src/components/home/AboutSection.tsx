
import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import drillingImage1 from "../../assets/drilling1.jpg";

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0.4, 1, 1, 0.4]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0.95, 1, 1, 0.95]);
  
  // Timeline data
  const timelineItems = [
    {
      year: "2010",
      title: "Company Founded",
      description: "Established in Lagos as a small water drilling company with a vision to transform water access in Nigeria."
    },
    {
      year: "2013",
      title: "First Major Project",
      description: "Secured first major government contract for rural water supply, delivering clean water to 12 villages in Osun State."
    },
    {
      year: "2016",
      title: "Expansion",
      description: "Expanded services to include water filtration, treatment systems, and industrial controls with state-of-the-art technology."
    },
    {
      year: "2019",
      title: "International Recognition",
      description: "Awarded for excellence in water resource management at the African Water Conference, recognized for sustainable practices."
    },
    {
      year: "2022",
      title: "Innovation Leaders",
      description: "Introduced advanced hydrogeophysics techniques to the Nigerian market, increasing drilling success rates by 35%."
    }
  ];

  return (
    <motion.section 
      id="about" 
      ref={sectionRef}
      style={{ opacity, scale }}
      className="bg-white dark:bg-gray-900 py-20"
    >
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="section-title dark:text-white"
        >
          About Us
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-12">
          {/* Image with overlay effect - Enhanced version */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative overflow-hidden rounded-xl shadow-premium w-full h-full"
          >
            <div className="aspect-w-4 aspect-h-3 w-full h-full">
              <img 
                src={drillingImage1} 
                alt="MDPC Water project" 
                className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-mdpc-blue-dark/60 to-transparent"></div>
            </div>
            
            {/* Enhanced floating stat cards with animations */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-4 rounded-lg animate-float-slow shadow-lg"
            >
              <div className="text-mdpc-blue dark:text-mdpc-blue-light font-bold text-3xl">10+</div>
              <div className="text-mdpc-brown-dark dark:text-gray-200 text-sm">Years of Excellence</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-4 rounded-lg animate-float-slow shadow-lg"
              style={{ animationDelay: "1s" }}
            >
              <div className="text-mdpc-blue dark:text-mdpc-blue-light font-bold text-3xl">500+</div>
              <div className="text-mdpc-brown-dark dark:text-gray-200 text-sm">Projects Completed</div>
            </motion.div>
            
            {/* Additional floating element */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-mdpc-gold/80 backdrop-blur-md rounded-full h-24 w-24 flex items-center justify-center animate-pulse-glow shadow-lg"
            >
              <div className="text-white font-heading font-bold text-lg text-center">
                Premium<br/>Quality
              </div>
            </motion.div>
          </motion.div>
          
          {/* Text content - Enhanced version */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            <h3 className="text-mdpc-blue dark:text-mdpc-blue-light text-2xl md:text-3xl font-heading font-bold mb-4">
              Excellence in Water Solutions & Engineering
            </h3>
            
            <p className="text-mdpc-brown-dark dark:text-gray-300 mb-4">
              Midas Touch Drills and Projects Consult (MDPC Ltd.) is a leading Nigerian company 
              specializing in borehole drilling, water filtration systems, and engineering consultancy. 
              With over a decade of experience, we have established ourselves as the go-to partner for 
              reliable water solutions across Nigeria.
            </p>
            
            <p className="text-mdpc-brown-dark dark:text-gray-300 mb-6">
              Our mission is to provide sustainable water solutions that transform lives and businesses. 
              We combine cutting-edge technology with deep local expertise to deliver projects that exceed 
              expectations in quality, efficiency, and durability.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white dark:bg-gray-800 shadow-md p-4 rounded-lg hover:shadow-lg transition-shadow duration-300"
              >
                <h4 className="font-heading font-bold text-mdpc-blue dark:text-mdpc-blue-light mb-2">Our Vision</h4>
                <p className="text-sm text-mdpc-brown-dark dark:text-gray-300">To be Nigeria's most trusted water solutions provider, known for excellence and innovation in every project we undertake.</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="bg-white dark:bg-gray-800 shadow-md p-4 rounded-lg hover:shadow-lg transition-shadow duration-300"
              >
                <h4 className="font-heading font-bold text-mdpc-blue dark:text-mdpc-blue-light mb-2">Our Mission</h4>
                <p className="text-sm text-mdpc-brown-dark dark:text-gray-300">Delivering sustainable water solutions with integrity, efficiency and technical expertise that improves quality of life.</p>
              </motion.div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="bg-mdpc-gold/20 text-mdpc-gold-dark dark:bg-mdpc-gold/20 dark:text-mdpc-gold px-3 py-1 rounded-full text-sm font-medium"
              >
                Integrity
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: 0.9 }}
                className="bg-mdpc-blue/20 text-mdpc-blue dark:bg-mdpc-blue/20 dark:text-mdpc-blue-light px-3 py-1 rounded-full text-sm font-medium"
              >
                Efficiency
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: 1.0 }}
                className="bg-mdpc-gold/20 text-mdpc-gold-dark dark:bg-mdpc-gold/20 dark:text-mdpc-gold px-3 py-1 rounded-full text-sm font-medium"
              >
                Innovation
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: 1.1 }}
                className="bg-mdpc-blue/20 text-mdpc-blue dark:bg-mdpc-blue/20 dark:text-mdpc-blue-light px-3 py-1 rounded-full text-sm font-medium"
              >
                Excellence
              </motion.span>
            </div>
          </motion.div>
        </div>
        
        {/* Company Growth Timeline - Enhanced version */}
        <div className="mt-24">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-2xl font-heading font-bold text-center mb-16 text-mdpc-brown-dark dark:text-white"
          >
            Our Growth Timeline
          </motion.h3>
          
          <div className="relative">
            {/* Timeline line */}
            <motion.div 
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-mdpc-gold/30 via-mdpc-gold to-mdpc-gold/30 z-0 origin-top"
            ></motion.div>
            
            {/* Timeline items */}
            <div className="flex flex-col">
              {timelineItems.map((item, index) => (
                <div 
                  key={index} 
                  className="relative z-10 flex justify-center mb-12"
                >
                  {/* Year bubble */}
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + (index * 0.2) }}
                    className={`bg-gradient-to-br ${index % 2 === 0 ? 'from-mdpc-gold to-mdpc-gold-dark' : 'from-mdpc-blue to-mdpc-blue-dark'} text-white font-bold rounded-full h-14 w-14 flex items-center justify-center z-20 shadow-lg`}
                  >
                    {item.year}
                  </motion.div>
                  
                  {/* Content */}
                  <motion.div 
                    initial={{ 
                      x: index % 2 === 0 ? -50 : 50, 
                      opacity: 0 
                    }}
                    animate={inView ? { 
                      x: 0, 
                      opacity: 1 
                    } : { 
                      x: index % 2 === 0 ? -50 : 50, 
                      opacity: 0 
                    }}
                    transition={{ duration: 0.6, delay: 0.3 + (index * 0.2) }}
                    className={`absolute w-5/12 bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ${
                      index % 2 === 0 ? 'left-0 pr-8 text-right' : 'right-0 pl-8 text-left'
                    }`}
                  >
                    <h4 className="font-bold text-mdpc-blue dark:text-mdpc-blue-light mb-1">{item.title}</h4>
                    <p className="text-sm text-mdpc-brown-dark dark:text-gray-300">{item.description}</p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutSection;
