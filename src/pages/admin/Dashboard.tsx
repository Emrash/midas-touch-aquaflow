
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

// Custom hooks and components
import { useToast } from "@/hooks/use-toast";
import { useRequestsData } from '@/hooks/useRequestsData';
import RequestsTab from '@/components/admin/RequestsTab';
import MessageModal from '@/components/admin/MessageModal';

// UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, loading] = useAuthState(auth);
  const { toast } = useToast();
  
  // State variables
  const [activeTab, setActiveTab] = useState('consultation');
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [selectedUser, setSelectedUser] = useState<{id: string, name: string}>({id: '', name: ''});
  const [sendingMessage, setSendingMessage] = useState(false);

  // Fetch requests using custom hook
  const consultationRequests = useRequestsData(admin, "consultationRequests");
  const drillingRequests = useRequestsData(admin, "drillingRequests");
  const logisticsRequests = useRequestsData(admin, "logisticsRequests");

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

  // Open message modal
  const handleMessageClick = (userId: string, userName: string) => {
    setSelectedUser({id: userId, name: userName});
    setMessageText('');
    setMessageModalOpen(true);
  };

  // Send message to user
  const sendUserMessage = async () => {
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
        recipientId: selectedUser.id,
        recipientName: selectedUser.name,
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
        description: `Your message has been sent to ${selectedUser.name}`,
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
          <RequestsTab 
            requests={consultationRequests} 
            type="consultation" 
            onMessageClick={handleMessageClick} 
          />
        </TabsContent>
        
        <TabsContent value="drilling" className="mt-6">
          <RequestsTab 
            requests={drillingRequests} 
            type="drilling" 
            onMessageClick={handleMessageClick} 
          />
        </TabsContent>
        
        <TabsContent value="logistics" className="mt-6">
          <RequestsTab 
            requests={logisticsRequests} 
            type="logistics" 
            onMessageClick={handleMessageClick} 
          />
        </TabsContent>
      </Tabs>

      {/* Message Modal */}
      <MessageModal
        isOpen={messageModalOpen}
        onOpenChange={setMessageModalOpen}
        userName={selectedUser.name}
        messageText={messageText}
        setMessageText={setMessageText}
        sendUserMessage={sendUserMessage}
        sendingMessage={sendingMessage}
      />
    </div>
  );
};

export default AdminDashboard;
