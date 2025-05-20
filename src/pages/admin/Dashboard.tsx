
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  addDoc,
  Timestamp, 
  onSnapshot
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

// UI Components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";
import { Textarea } from '@/components/ui/textarea';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, loading] = useAuthState(auth);
  const { toast } = useToast();
  
  // State variables
  const [consultationRequests, setConsultationRequests] = useState<any[]>([]);
  const [drillingRequests, setDrillingRequests] = useState<any[]>([]);
  const [logisticsRequests, setLogisticsRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('consultation');
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [selectedUser, setSelectedUser] = useState<{id: string, name: string}>({id: '', name: ''});
  const [sendingMessage, setSendingMessage] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (!loading && (!admin || !admin.email?.endsWith('@midastouch.com'))) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [admin, loading, navigate, toast]);

  // Fetch consultation requests
  useEffect(() => {
    if (!admin) return;
    
    try {
      const q = query(
        collection(db, "consultationRequests"),
        orderBy("timestamp", "desc")
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const requests = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setConsultationRequests(requests);
      }, (error) => {
        console.error("Error fetching consultation requests:", error);
        toast({
          title: "Error",
          description: "Could not load consultation requests",
          variant: "destructive",
        });
      });
      
      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up consultation requests listener:", error);
    }
  }, [admin, toast]);

  // Fetch drilling requests
  useEffect(() => {
    if (!admin) return;
    
    try {
      const q = query(
        collection(db, "drillingRequests"),
        orderBy("timestamp", "desc")
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const requests = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDrillingRequests(requests);
      }, (error) => {
        console.error("Error fetching drilling requests:", error);
        toast({
          title: "Error",
          description: "Could not load drilling requests",
          variant: "destructive",
        });
      });
      
      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up drilling requests listener:", error);
    }
  }, [admin, toast]);

  // Fetch logistics requests
  useEffect(() => {
    if (!admin) return;
    
    try {
      const q = query(
        collection(db, "logisticsRequests"),
        orderBy("timestamp", "desc")
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const requests = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLogisticsRequests(requests);
      }, (error) => {
        console.error("Error fetching logistics requests:", error);
        toast({
          title: "Error",
          description: "Could not load logistics requests",
          variant: "destructive",
        });
      });
      
      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up logistics requests listener:", error);
    }
  }, [admin, toast]);

  // Open message modal
  const handleMessageClick = (userId: string, userName: string) => {
    setSelectedUser({id: userId, name: userName});
    setMessageText('');
    setMessageModalOpen(true);
  };

  // Send message to user
  const sendUserMessage = async (userId: string, userName: string, messageText: string) => {
    if (!messageText.trim()) {
      toast({
        title: "Message Error",
        description: "Please enter a message to send",
        variant: "destructive",
      });
      return;
    }

    setSendingMessage(true);

    try {
      // Create a message object
      const message = {
        sender: "Midas Touch Admin",
        senderName: admin?.displayName || "Admin",
        recipientId: userId,
        recipientName: userName,
        message: messageText,
        subject: "Message from Midas Touch",
        timestamp: Timestamp.now(),
        read: false,
      };

      // Add to Firestore
      const messagesRef = collection(db, "messages");
      await addDoc(messagesRef, message);

      toast({
        title: "Message Sent",
        description: `Your message has been sent to ${userName}`,
      });

      // Clear the message input
      setMessageText("");
      setMessageModalOpen(false);
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error Sending Message",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  // Render a request card
  const renderRequestCard = (request: any, type: string) => {
    const userName = request.name || request.contactName || request.fullName || 'Client';
    const userEmail = request.email || request.contactEmail || 'No email provided';
    const userPhone = request.phone || request.contactPhone || 'No phone provided';
    const requestDate = request.timestamp ? new Date(request.timestamp.toDate()).toLocaleString() : 'Unknown date';
    
    let details = [];
    if (type === 'consultation') {
      details = [
        { label: 'Service Type', value: request.serviceType || 'General Consultation' },
        { label: 'Message', value: request.message || 'No message provided' }
      ];
    } else if (type === 'drilling') {
      details = [
        { label: 'Location', value: request.location || 'Not specified' },
        { label: 'Project Type', value: request.projectType || 'Not specified' },
        { label: 'Duration', value: request.estimatedDuration || 'Not specified' },
        { label: 'Notes', value: request.additionalNotes || 'No additional notes' }
      ];
    } else if (type === 'logistics') {
      details = [
        { label: 'Cargo Type', value: request.cargoType || 'Not specified' },
        { label: 'Origin', value: request.origin || 'Not specified' },
        { label: 'Destination', value: request.destination || 'Not specified' },
        { label: 'Notes', value: request.specialRequirements || 'No additional notes' }
      ];
    }

    return (
      <Card key={request.id} className="mb-4">
        <CardHeader>
          <CardTitle>{userName}</CardTitle>
          <CardDescription>
            Submitted on {requestDate}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid gap-2">
            <div className="font-medium">Contact Information:</div>
            <div className="text-sm">Email: {userEmail}</div>
            <div className="text-sm">Phone: {userPhone}</div>
          </div>
          <div className="grid gap-2 mt-4">
            <div className="font-medium">Request Details:</div>
            {details.map((detail, index) => (
              <div key={index} className="text-sm">
                <span className="font-medium">{detail.label}: </span>
                {detail.value}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="mr-2"
            onClick={() => handleMessageClick(request.userId, userName)}
          >
            Send Message
          </Button>
          <Button variant="default">Mark as Processed</Button>
        </CardFooter>
      </Card>
    );
  };

  if (loading) {
    return <div className="p-8 text-center">Loading admin dashboard...</div>;
  }

  if (!admin) {
    return null; // Redirect will happen via the useEffect
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="consultation" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="consultation">Consultation Requests</TabsTrigger>
          <TabsTrigger value="drilling">Drilling Requests</TabsTrigger>
          <TabsTrigger value="logistics">Logistics Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="consultation" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Consultation Requests</h2>
          {consultationRequests.length === 0 ? (
            <p>No consultation requests found.</p>
          ) : (
            consultationRequests.map(request => renderRequestCard(request, 'consultation'))
          )}
        </TabsContent>
        
        <TabsContent value="drilling" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Drilling Requests</h2>
          {drillingRequests.length === 0 ? (
            <p>No drilling requests found.</p>
          ) : (
            drillingRequests.map(request => renderRequestCard(request, 'drilling'))
          )}
        </TabsContent>
        
        <TabsContent value="logistics" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Logistics Requests</h2>
          {logisticsRequests.length === 0 ? (
            <p>No logistics requests found.</p>
          ) : (
            logisticsRequests.map(request => renderRequestCard(request, 'logistics'))
          )}
        </TabsContent>
      </Tabs>

      {/* Message Modal */}
      <Dialog open={messageModalOpen} onOpenChange={setMessageModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Message to {selectedUser.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              id="message"
              placeholder="Type your message here..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="col-span-3"
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setMessageModalOpen(false)}
              disabled={sendingMessage}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => sendUserMessage(selectedUser.id, selectedUser.name, messageText)}
              disabled={sendingMessage || !messageText.trim()}
            >
              {sendingMessage ? "Sending..." : "Send Message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
