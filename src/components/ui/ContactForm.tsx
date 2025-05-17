
import { useState } from 'react';
import { Button } from './button';
import { useToast } from './use-toast';
import { motion } from 'framer-motion';

const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submissionProgress, setSubmissionProgress] = useState(0);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Phone validation (optional but validate if provided)
    if (formData.phone && !/^\+?[0-9\s\-()]{8,20}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate form submission with progress
    const timer = setInterval(() => {
      setSubmissionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Success toast
      toast({
        title: "Message Sent Successfully",
        description: "We'll get back to you as soon as possible.",
        className: "bg-green-50 border-green-200 dark:bg-green-900/30",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      
      setSubmissionProgress(0);
    } catch (error) {
      console.error('Error sending message:', error);
      
      toast({
        variant: "destructive",
        title: "Message could not be sent",
        description: "Please try again later or contact us directly.",
      });
      
      setSubmissionProgress(0);
    } finally {
      clearInterval(timer);
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const inputVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      variants={formVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Name and Email row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Input */}
        <motion.div variants={inputVariants}>
          <div className="space-y-2">
            <label htmlFor="name" className="form-label flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-mdpc-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Your Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input bg-gray-50 dark:bg-gray-800 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 focus:ring-mdpc-blue'}`}
                placeholder="John Doe"
                disabled={isSubmitting}
              />
              {errors.name && (
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="mt-1 text-sm text-red-500"
                >
                  {errors.name}
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Email Input */}
        <motion.div variants={inputVariants}>
          <div className="space-y-2">
            <label htmlFor="email" className="form-label flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-mdpc-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input bg-gray-50 dark:bg-gray-800 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 focus:ring-mdpc-blue'}`}
                placeholder="john.doe@example.com"
                disabled={isSubmitting}
              />
              {errors.email && (
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="mt-1 text-sm text-red-500"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Phone and Subject row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phone Input */}
        <motion.div variants={inputVariants}>
          <div className="space-y-2">
            <label htmlFor="phone" className="form-label flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-mdpc-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Phone Number <span className="text-gray-400 text-sm font-normal">(optional)</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`form-input bg-gray-50 dark:bg-gray-800 ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 focus:ring-mdpc-blue'}`}
                placeholder="+234 800 123 4567"
                disabled={isSubmitting}
              />
              {errors.phone && (
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="mt-1 text-sm text-red-500"
                >
                  {errors.phone}
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Subject Input */}
        <motion.div variants={inputVariants}>
          <div className="space-y-2">
            <label htmlFor="subject" className="form-label flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-mdpc-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              Subject <span className="text-red-500">*</span>
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`form-input bg-gray-50 dark:bg-gray-800 ${errors.subject ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 focus:ring-mdpc-blue'}`}
              disabled={isSubmitting}
            >
              <option value="">Select a subject</option>
              <option value="Borehole Drilling">Borehole Drilling</option>
              <option value="Water Treatment">Water Treatment</option>
              <option value="Logistics Services">Logistics Services</option>
              <option value="Project Consultation">Project Consultation</option>
              <option value="General Inquiry">General Inquiry</option>
            </select>
            {errors.subject && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="mt-1 text-sm text-red-500"
              >
                {errors.subject}
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Message Input */}
      <motion.div variants={inputVariants}>
        <div className="space-y-2">
          <label htmlFor="message" className="form-label flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-mdpc-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={`form-input min-h-[140px] resize-y bg-gray-50 dark:bg-gray-800 ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 focus:ring-mdpc-blue'}`}
            placeholder="Please describe how we can help you..."
            disabled={isSubmitting}
          ></textarea>
          {errors.message && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="mt-1 text-sm text-red-500"
            >
              {errors.message}
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Submit Button */}
      <motion.div variants={inputVariants} className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="relative overflow-hidden group px-8"
        >
          {isSubmitting ? (
            <>
              <span className="relative z-10">Sending...</span>
              <span 
                className="absolute left-0 bottom-0 h-1 bg-white/30 transition-all"
                style={{ width: `${submissionProgress}%` }}
              ></span>
            </>
          ) : (
            <>
              <span className="relative z-10">Send Message</span>
              <span className="absolute top-0 left-0 w-full h-full bg-white/20 transform -skew-x-45 -translate-x-full group-hover:translate-x-[150%] transition-transform duration-700 ease-out"></span>
            </>
          )}
        </Button>
      </motion.div>
      
      {/* Privacy policy note */}
      <motion.div variants={inputVariants}>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
          By submitting this form, you agree to our {' '}
          <a href="#" className="text-mdpc-blue hover:underline">Privacy Policy</a> and consent to Midas Touch Drills and Projects Consult Ltd. contacting you regarding your inquiry.
        </p>
      </motion.div>
    </motion.form>
  );
};

export default ContactForm;
