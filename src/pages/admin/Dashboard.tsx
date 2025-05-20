
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import drillingImg from '../../assets/driiling1.jpg';
import projectGalleryImg from '../../assets/project_gallery.jpg';

// Custom hooks and components
import { useToast } from "@/hooks/use-toast";
import { useRequestsData } from '@/hooks/useRequestsData';
import RequestsTab from '@/components/admin/RequestsTab';
import MessageModal from '@/components/admin/MessageModal';

// UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

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
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-mdpc-gold border-t-transparent mb-4"></div>
        <p className="text-mdpc-brown-dark dark:text-mdpc-brown-light">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="relative mb-8 overflow-hidden rounded-xl">
        <img 
          src={projectGalleryImg} 
          alt="Midas Touch Admin Dashboard" 
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-mdpc-blue/80 to-mdpc-blue-dark/40 flex items-center">
          <div className="ml-8">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-white/90">Manage requests and communicate with clients</p>
          </div>
        </div>
      </div>
      
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
          {consultationRequests.length === 0 && (
            <Card className="my-8">
              <CardContent className="p-6 text-center">
                <img 
                  src="/placeholder.svg" 
                  alt="No requests" 
                  className="w-32 h-32 mx-auto opacity-30 mb-4"
                />
                <p className="text-gray-500">No consultation requests yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="drilling" className="mt-6">
          <RequestsTab 
            requests={drillingRequests} 
            type="drilling" 
            onMessageClick={handleMessageClick} 
          />
          {drillingRequests.length === 0 && (
            <Card className="my-8">
              <CardContent className="p-6 text-center">
                <img 
                  src={drillingImg} 
                  alt="No drilling requests" 
                  className="w-32 h-32 mx-auto opacity-50 mb-4 rounded-lg object-cover"
                />
                <p className="text-gray-500">No drilling requests yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="logistics" className="mt-6">
          <RequestsTab 
            requests={logisticsRequests} 
            type="logistics" 
            onMessageClick={handleMessageClick} 
          />
          {logisticsRequests.length === 0 && (
            <Card className="my-8">
              <CardContent className="p-6 text-center">
                <img 
                  src="/placeholder.svg" 
                  alt="No logistics requests" 
                  className="w-32 h-32 mx-auto opacity-30 mb-4"
                />
                <p className="text-gray-500">No logistics requests yet</p>
              </CardContent>
            </Card>
          )}
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
