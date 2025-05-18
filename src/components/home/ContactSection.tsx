
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PhoneIcon, MailIcon, MapPinIcon, ArrowRightIcon } from "lucide-react";
import Map from "../ui/Map";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // This is where you'd normally send data to your backend
      console.log("Form submitted:", formData);

      // Reset form and show success message
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setSubmitError("There was a problem submitting your form. Please try again.");
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-mdpc-brown-darkest/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title dark:text-white">Contact Us</h2>
          <p className="text-mdpc-brown-dark dark:text-mdpc-brown-light max-w-2xl mx-auto mt-4">
            Get in touch with our expert team for consultations, quotes, or any inquiries you may have.
            We're always ready to discuss your water solution needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white dark:bg-mdpc-brown-darkest/50 p-6 md:p-8 rounded-xl shadow-premium">
            <h3 className="text-2xl font-heading font-semibold mb-6 text-mdpc-blue dark:text-mdpc-gold">Send Us a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="form-input"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+234 (0) 123 456 7890"
                    className="form-input"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Inquiry about..."
                    required
                    className="form-input"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="form-label">Your Message</label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please provide details about your inquiry..."
                  required
                  className="form-input min-h-[150px]"
                />
              </div>
              
              <div>
                <Button 
                  type="submit" 
                  className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white w-full py-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Message...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Send Message
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
                
                {submitSuccess && (
                  <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Thank you! Your message has been sent successfully.
                  </div>
                )}
                
                {submitError && (
                  <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    {submitError}
                  </div>
                )}
              </div>
            </form>
          </div>
          
          <div>
            <div className="bg-white dark:bg-mdpc-brown-darkest/50 p-6 md:p-8 rounded-xl shadow-premium mb-8">
              <h3 className="text-2xl font-heading font-semibold mb-6 text-mdpc-blue dark:text-mdpc-gold">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-mdpc-blue dark:bg-mdpc-gold bg-opacity-10 dark:bg-opacity-10 p-3 rounded-full mr-4">
                    <MapPinIcon className="h-6 w-6 text-mdpc-blue dark:text-mdpc-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-mdpc-brown-dark dark:text-mdpc-brown-light">Office Address</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      123 Osogbo Business District<br />
                      Osun State, Nigeria
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-mdpc-blue dark:bg-mdpc-gold bg-opacity-10 dark:bg-opacity-10 p-3 rounded-full mr-4">
                    <PhoneIcon className="h-6 w-6 text-mdpc-blue dark:text-mdpc-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-mdpc-brown-dark dark:text-mdpc-brown-light">Phone Number</h4>
                    <p className="text-gray-600 dark:text-gray-300">+234 (0) 123 456 7890</p>
                    <p className="text-gray-600 dark:text-gray-300">+234 (0) 987 654 3210</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-mdpc-blue dark:bg-mdpc-gold bg-opacity-10 dark:bg-opacity-10 p-3 rounded-full mr-4">
                    <MailIcon className="h-6 w-6 text-mdpc-blue dark:text-mdpc-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-mdpc-brown-dark dark:text-mdpc-brown-light">Email Address</h4>
                    <p className="text-gray-600 dark:text-gray-300">info@midastouchdrills.com</p>
                    <p className="text-gray-600 dark:text-gray-300">support@midastouchdrills.com</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex space-x-4">
                <a href="#" className="bg-mdpc-brown-light/10 hover:bg-mdpc-brown-light/20 dark:bg-mdpc-gold/10 dark:hover:bg-mdpc-gold/20 p-3 rounded-full transition-colors">
                  <svg className="h-5 w-5 text-mdpc-brown dark:text-mdpc-gold" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                  </svg>
                </a>
                <a href="#" className="bg-mdpc-brown-light/10 hover:bg-mdpc-brown-light/20 dark:bg-mdpc-gold/10 dark:hover:bg-mdpc-gold/20 p-3 rounded-full transition-colors">
                  <svg className="h-5 w-5 text-mdpc-brown dark:text-mdpc-gold" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"></path>
                  </svg>
                </a>
                <a href="#" className="bg-mdpc-brown-light/10 hover:bg-mdpc-brown-light/20 dark:bg-mdpc-gold/10 dark:hover:bg-mdpc-gold/20 p-3 rounded-full transition-colors">
                  <svg className="h-5 w-5 text-mdpc-brown dark:text-mdpc-gold" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="bg-mdpc-brown-light/10 hover:bg-mdpc-brown-light/20 dark:bg-mdpc-gold/10 dark:hover:bg-mdpc-gold/20 p-3 rounded-full transition-colors">
                  <svg className="h-5 w-5 text-mdpc-brown dark:text-mdpc-gold" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="rounded-xl overflow-hidden shadow-premium">
              <Map
                center={[7.5898, 4.5737]} // Osogbo coordinates
                zoom={12}
                markers={[
                  { position: [7.5898, 4.5737], popup: "Midas Touch HQ", isMain: true }
                ]}
                height="300px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
