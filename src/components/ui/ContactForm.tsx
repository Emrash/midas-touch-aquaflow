
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  service?: string;
  message?: string;
}

const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for the field being edited
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = "Invalid email address";
      isValid = false;
    }

    // Service validation
    if (!formData.service) {
      errors.service = "Please select a service";
      isValid = false;
    }

    // Message validation
    if (!formData.message.trim()) {
      errors.message = "Message is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Form Validation Error",
        description: "Please correct the errors and try again.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission to backend
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "Thank you for your inquiry. We'll respond within 24 hours.",
        variant: "default",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
      
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-mdpc-brown-dark mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-mdpc-blue focus:border-transparent ${
              formErrors.name ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
            placeholder="Your Name"
          />
          {formErrors.name && (
            <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-mdpc-brown-dark mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-mdpc-blue focus:border-transparent ${
              formErrors.email ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
            placeholder="your@email.com"
          />
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-mdpc-brown-dark mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdpc-blue focus:border-transparent"
            placeholder="+234 000 000 0000"
          />
        </div>
        
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-mdpc-brown-dark mb-1">
            Service Interested In *
          </label>
          <div className="relative">
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-mdpc-blue focus:border-transparent appearance-none bg-white pr-8 ${
                formErrors.service ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            >
              <option value="">Select a Service</option>
              <option value="Geophysical Survey">Geophysical Survey</option>
              <option value="Borehole Drilling">Borehole Drilling</option>
              <option value="Water Filtration">Water Filtration</option>
              <option value="Pump Installation">Pump Installation</option>
              <option value="Industrial Control">Industrial Control</option>
              <option value="Mining & Core Drilling">Mining & Core Drilling</option>
              <option value="Other">Other</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          {formErrors.service && (
            <p className="mt-1 text-sm text-red-600">{formErrors.service}</p>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-mdpc-brown-dark mb-1">
          Your Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-mdpc-blue focus:border-transparent ${
            formErrors.message ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
          placeholder="Tell us about your project or inquiry..."
        ></textarea>
        {formErrors.message && (
          <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white font-semibold py-6 px-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 min-w-[200px]"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
