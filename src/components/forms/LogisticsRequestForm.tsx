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

const LogisticsRequestForm = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: user?.email || "",
    phone: "",
    pickupLocation: "",
    deliveryLocation: "",
    serviceType: "bulky-delivery",
    cargoDescription: "",
    deliveryDate: "",
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
    
    if (!formData.name || !formData.email || !formData.phone || !formData.pickupLocation || !formData.deliveryLocation) {
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
      const docRef = await addDoc(collection(db, "logisticsRequests"), {
        ...formData,
        userId: user?.uid || "guest",
        status: "pending",
        createdAt: serverTimestamp(),
      });
      
      // Send email notification
      await sendServiceRequestNotification(
        "logistics",
        formData.name,
        formData.email,
        {
          phone: formData.phone,
          pickupLocation: formData.pickupLocation,
          deliveryLocation: formData.deliveryLocation,
          serviceType: formData.serviceType,
          cargoDescription: formData.cargoDescription,
          deliveryDate: formData.deliveryDate,
          message: formData.message,
          requestId: docRef.id
        }
      );
      
      // Show success message
      toast({
        title: "Request submitted successfully!",
        description: "We will contact you shortly regarding your logistics service request.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: user?.email || "",
        phone: "",
        pickupLocation: "",
        deliveryLocation: "",
        serviceType: "bulky-delivery",
        cargoDescription: "",
        deliveryDate: "",
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
        <CardTitle className="text-2xl text-mdpc-brown-dark font-heading">Request Logistics Services</CardTitle>
        <CardDescription>Fill out the form below to request our professional logistics services</CardDescription>
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
            <label htmlFor="pickupLocation" className="text-sm font-medium">Pickup Location *</label>
            <Input
              id="pickupLocation"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              placeholder="Where should we collect the items?"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="deliveryLocation" className="text-sm font-medium">Delivery Location *</label>
            <Input
              id="deliveryLocation"
              name="deliveryLocation"
              value={formData.deliveryLocation}
              onChange={handleChange}
              placeholder="Where should we deliver the items?"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="serviceType" className="text-sm font-medium">Service Type</label>
            <Select 
              value={formData.serviceType}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bulky-delivery">Bulky Item Delivery</SelectItem>
                <SelectItem value="doorstep-delivery">Doorstep Delivery</SelectItem>
                <SelectItem value="express-delivery">Express Delivery</SelectItem>
                <SelectItem value="water-equipment">Water Equipment Transportation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="cargoDescription" className="text-sm font-medium">Cargo Description</label>
            <Input
              id="cargoDescription"
              name="cargoDescription"
              value={formData.cargoDescription}
              onChange={handleChange}
              placeholder="Description of items to be transported"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="deliveryDate" className="text-sm font-medium">Preferred Delivery Date</label>
            <Input
              id="deliveryDate"
              name="deliveryDate"
              type="date"
              value={formData.deliveryDate}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">Additional Details</label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Please provide any additional information about your logistics requirements"
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

export default LogisticsRequestForm;
