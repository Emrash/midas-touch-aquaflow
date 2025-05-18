
import { useState } from 'react';
import { Button } from './button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './dialog';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  serviceType?: 'drilling' | 'logistics' | 'general';
}

const ConsultationModal = ({
  isOpen,
  onClose,
  title = "Request a Consultation",
  description = "Fill in your details and we'll get back to you within 24 hours.",
  serviceType = 'general'
}: ConsultationModalProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    service: serviceType === 'general' ? '' : serviceType,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to Firestore
      await addDoc(collection(db, "consultationRequests"), {
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        userId: user?.uid || "guest",
        serviceType: formData.service || serviceType || "general",
        requestDetails: {
          message: formData.message,
        },
        status: "pending",
        createdAt: serverTimestamp(),
      });
      
      console.log('Form submitted:', formData);
      toast({
        title: "Request Submitted",
        description: "Thank you! We'll contact you shortly.",
      });
      
      setFormData({
        name: user?.displayName || '',
        email: user?.email || '',
        phone: '',
        service: serviceType === 'general' ? '' : serviceType,
        message: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = serviceType === 'drilling' 
    ? ['Geophysical Survey', 'Borehole Drilling', 'Water Treatment', 'Pump Installation']
    : serviceType === 'logistics'
    ? ['Bulky Delivery', 'Doorstep Delivery', 'Express Delivery', 'Equipment Transport']
    : ['Drilling Services', 'Logistics Services', 'Project Consultation', 'Water Solutions'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading text-mdpc-blue dark:text-mdpc-gold text-center">{title}</DialogTitle>
          <DialogDescription className="text-center text-mdpc-brown dark:text-mdpc-brown-light">
            {description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="service">Service Type</Label>
            <Select 
              name="service" 
              value={formData.service} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, service: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service} value={service}>{service}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us about your project or requirements..."
              value={formData.message}
              onChange={handleChange}
              required
              className="min-h-[100px] form-input"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-mdpc-gold hover:bg-mdpc-gold-dark text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationModal;
