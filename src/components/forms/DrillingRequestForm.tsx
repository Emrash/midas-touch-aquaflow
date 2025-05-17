import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sendServiceRequestNotification } from "@/services/emailService";

const DrillingRequestForm = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: user?.email || "",
    phone: "",
    location: "",
    serviceType: "borehole-drilling",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      serviceType: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.location) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save to Firestore
      const docRef = await addDoc(collection(db, "drillingRequests"), {
        ...formData,
        userId: user?.uid || "guest",
        status: "pending",
        createdAt: serverTimestamp(),
      });
      
      // Send email notification
      await sendServiceRequestNotification(
        "drilling",
        formData.name,
        formData.email,
        {
          phone: formData.phone,
          location: formData.location,
          serviceType: formData.serviceType,
          message: formData.message,
          requestId: docRef.id
        }
      );
      
      // Show success message
      toast({
        title: "Request submitted successfully!",
        description: "We will contact you shortly regarding your drilling service request.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: user?.email || "",
        phone: "",
        location: "",
        serviceType: "borehole-drilling",
        message: "",
      });
      
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        title: "Error submitting request",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-mdpc-blue font-heading">Request Drilling Services</CardTitle>
        <CardDescription>Fill out the form below to request our professional drilling services</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Your Name *</label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email Address *</label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">Phone Number *</label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+234 XXX XXXX XXX"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">Location/Address *</label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Your project location"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="serviceType" className="text-sm font-medium">Service Required</label>
            <Select 
              value={formData.serviceType}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="borehole-drilling">Borehole Drilling</SelectItem>
                <SelectItem value="geophysical-survey">Geophysical Survey</SelectItem>
                <SelectItem value="water-treatment">Water Treatment & Filtration</SelectItem>
                <SelectItem value="pump-installation">Pump Installation</SelectItem>
                <SelectItem value="borehole-maintenance">Borehole Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">Additional Details</label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Please provide any additional information about your requirements"
              rows={4}
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-mdpc-gold hover:bg-mdpc-gold-dark"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default DrillingRequestForm;
