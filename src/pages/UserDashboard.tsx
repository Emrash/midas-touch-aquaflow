import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { Clock, Calendar, FileText, User, MessageSquare, Settings, Phone, Mail, Save, X, Check, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { updateProfile } from "firebase/auth";
import { db, logQuery, createMessagesQuery, createSafeQuery, executeSafeQuery } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy, onSnapshot, Timestamp, doc, updateDoc, getDoc } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

// Define types for user requests
interface BaseRequest {
  id: string;
  createdAt: any; // Firestore timestamp
  status: "pending" | "in-progress" | "completed";
  serviceType: string;
  requestDetails?: {
    [key: string]: any;
  };
  adminNotes?: string;
  fullName?: string;
  email?: string;
  phone?: string;
}

interface Message {
  id: string;
  sender: string;
  recipientId: string;
  message: string;
  subject?: string;
  timestamp: any;
  read: boolean;
}

const UserDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // User profile state
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [editing, setEditing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  
  // User data
  const [requests, setRequests] = useState<BaseRequest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState({
    requests: true,
    messages: true
  });
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    document.title = "My Dashboard | Midas Touch";
    
    // Initialize user data
    setDisplayName(user.displayName || "");
    setEmail(user.email || "");
    setPhoneNumber(user.phoneNumber || "");
    
    // Fetch user's service requests
    if (user.uid) {
      setLoading(prev => ({ ...prev, requests: true }));
      setRequestError(null);
      
      // Set up listeners for all request collections
      const collections = ["drillingRequests", "logisticsRequests", "consultationRequests"];
      let allRequests: BaseRequest[] = [];
      let completedCollections = 0;
      let unsubscribeFunctions: Array<() => void> = [];
      
      collections.forEach(collectionName => {
        console.log(`Setting up listener for ${collectionName}`);
        // Log the query to help with debugging
        logQuery(collectionName, { userId: user.uid });
        
        try {
          // Create a reference to the collection
          const collectionRef = collection(db, collectionName);
          
          // Try first with a simpler query without orderBy to avoid missing index errors
          const simpleQuery = query(
            collectionRef,
            where("userId", "==", user.uid)
          );
          
          const unsubscribe = onSnapshot(simpleQuery, (snapshot) => {
            console.log(`${collectionName} snapshot received:`, snapshot.size, "documents");
            
            const newRequests = snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                createdAt: data.createdAt || { toDate: () => new Date() },
                status: data.status || "pending",
                serviceType: collectionName === "drillingRequests" ? "drilling" : 
                            collectionName === "logisticsRequests" ? "logistics" : "consultation",
                requestDetails: data.requestDetails || {},
                adminNotes: data.adminNotes,
                fullName: data.fullName || user.displayName || "Anonymous",
                email: data.email || user.email || "",
                phone: data.phone || ""
              };
            });
            
            console.log(`${collectionName} processed data:`, newRequests);
            
            // Update combined requests
            allRequests = allRequests.filter(req => {
              // Keep requests from other collections
              return !newRequests.some(newReq => 
                newReq.id === req.id && 
                newReq.serviceType === req.serviceType
              );
            }).concat(newRequests);
            
            // Sort by date manually since we might not use orderBy in the query
            allRequests.sort((a, b) => {
              const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date();
              const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date();
              return dateB.getTime() - dateA.getTime();
            });
            
            console.log("All requests after update:", allRequests.length);
            setRequests(allRequests);
            
            completedCollections++;
            if (completedCollections >= collections.length) {
              setLoading(prev => ({ ...prev, requests: false }));
            }
          }, (error) => {
            console.error(`Error fetching ${collectionName}:`, error);
            setRequestError(`Error loading ${collectionName}: ${error.message}`);
            toast({
              title: `Error loading ${collectionName}`,
              description: error.message,
              variant: "destructive"
            });
            completedCollections++;
            if (completedCollections >= collections.length) {
              setLoading(prev => ({ ...prev, requests: false }));
            }
          });
          
          unsubscribeFunctions.push(unsubscribe);
          
        } catch (error: any) {
          console.error(`Error setting up ${collectionName} listener:`, error);
          setRequestError(`Error setting up ${collectionName} listener: ${error.message}`);
          toast({
            title: `Error with ${collectionName}`,
            description: error.message,
            variant: "destructive"
          });
          completedCollections++;
          if (completedCollections >= collections.length) {
            setLoading(prev => ({ ...prev, requests: false }));
          }
        }
      });
      
      // Fetch messages
      setLoading(prev => ({ ...prev, messages: true }));
      setMessageError(null);
      
      try {
        // Simple query for messages without orderBy to avoid missing index errors
        const messagesRef = collection(db, "messages");
        const messagesQuery = query(
          messagesRef,
          where("recipientId", "==", user.uid)
        );
        
        logQuery("messages", { recipientId: user.uid });
        
        const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
          console.log("Messages snapshot:", snapshot.size, "documents");
          
          const messagesData: Message[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              sender: data.sender || "Midas Touch Support",
              recipientId: data.recipientId,
              message: data.message || "",
              subject: data.subject || "Message from Midas Touch",
              timestamp: data.timestamp || { toDate: () => new Date() },
              read: data.read || false
            };
          });
          
          // Sort messages manually by timestamp since we're not using orderBy
          messagesData.sort((a, b) => {
            const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date();
            const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date();
            return dateB.getTime() - dateA.getTime();
          });
          
          setMessages(messagesData);
          
          // Count unread messages
          const unreadCount = messagesData.filter(msg => !msg.read).length;
          setUnreadMessages(unreadCount);
          
          setLoading(prev => ({ ...prev, messages: false }));
        }, (error) => {
          console.error("Error fetching messages:", error);
          setMessageError(`Error loading messages: ${error.message}`);
          toast({
            title: "Error loading messages",
            description: error.message,
            variant: "destructive"
          });
          setLoading(prev => ({ ...prev, messages: false }));
        });
        
        unsubscribeFunctions.push(unsubscribeMessages);
      } catch (error: any) {
        console.error("Error setting up messages listener:", error);
        setMessageError(`Error setting up messages listener: ${error.message}`);
        toast({
          title: "Error with messages",
          description: error.message,
          variant: "destructive"
        });
        setLoading(prev => ({ ...prev, messages: false }));
      }
      
      // Return cleanup function
      return () => {
        unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
      };
    }
  }, [user, navigate]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSavingProfile(true);
    try {
      // Update display name in Firebase Auth
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }
      
      // Note: Updating phone number requires additional verification
      // This is just UI update for now
      
      setEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSavingProfile(false);
    }
  };
  
  const toggleDarkMode = () => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark");
      setIsDarkMode(!isDarkMode);
      
      toast({
        title: `${!isDarkMode ? "Dark" : "Light"} Mode Enabled`,
        description: `The app theme has been switched to ${!isDarkMode ? "dark" : "light"} mode.`,
      });
    }
  };
  
  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    toast({
      title: `Notifications ${!notificationsEnabled ? "Enabled" : "Disabled"}`,
      description: `You will ${!notificationsEnabled ? "now" : "no longer"} receive notifications from Midas Touch.`,
    });
  };
  
  const markMessageAsRead = async (id: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, read: true } : msg
    ));
    
    try {
      // Update the message in Firebase
      const messageRef = doc(db, "messages", id);
      await updateDoc(messageRef, { read: true });
      
      toast({
        title: "Message Marked as Read",
        description: "The message has been marked as read.",
      });
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const toggleRequestExpand = (id: string) => {
    if (expandedRequest === id) {
      setExpandedRequest(null);
    } else {
      setExpandedRequest(id);
    }
  };

  // Format date from Firestore timestamp
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Format timestamp for messages
  const formatMessageTime = (timestamp: any) => {
    if (!timestamp) return "N/A";
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Get service type display name
  const getServiceTypeName = (request: BaseRequest) => {
    if (request.serviceType === "drilling") {
      const subType = request.requestDetails?.serviceSubType || "";
      const serviceTypes: {[key: string]: string} = {
        "borehole-drilling": "Borehole Drilling",
        "geophysical-survey": "Geophysical Survey",
        "water-treatment": "Water Treatment",
        "pump-installation": "Pump Installation",
        "borehole-maintenance": "Borehole Maintenance",
      };
      return serviceTypes[subType] || "Drilling Services";
    } else if (request.serviceType === "logistics") {
      const subType = request.requestDetails?.serviceSubType || "";
      const serviceTypes: {[key: string]: string} = {
        "bulky-delivery": "Bulky Item Delivery",
        "doorstep-delivery": "Doorstep Delivery",
        "express-delivery": "Express Delivery",
        "water-equipment": "Water Equipment Transport",
      };
      return serviceTypes[subType] || "Logistics Services";
    } else {
      return request.requestDetails?.service || "Consultation";
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case "pending": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "in-progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400";
    }
  };

  const getStatusBadgeShadow = (status: string) => {
    switch(status) {
      case "pending": return "shadow-amber-200/50 dark:shadow-amber-900/30";
      case "in-progress": return "shadow-blue-200/50 dark:shadow-blue-900/30";
      case "completed": return "shadow-green-200/50 dark:shadow-green-900/30";
      default: return "shadow-gray-200/50 dark:shadow-gray-800/30";
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-12 bg-gray-50 dark:bg-mdpc-brown-darkest/90">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-heading font-bold text-mdpc-blue dark:text-mdpc-gold">My Dashboard</h1>
              <p className="text-mdpc-brown-dark dark:text-mdpc-brown-light mt-2">
                Welcome back, {user.displayName || user.email}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <motion.div 
                className="bg-white dark:bg-mdpc-brown-darkest/70 shadow-lg dark:shadow-mdpc-brown-darkest/30 rounded-full p-2 flex items-center gap-2"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="w-8 h-8 rounded-full bg-mdpc-gold/20 dark:bg-mdpc-gold/30 flex items-center justify-center text-mdpc-gold">
                  {user.displayName ? user.displayName.substring(0, 1).toUpperCase() : user.email?.substring(0, 1).toUpperCase()}
                </div>
                <span className="text-sm font-medium mr-2 dark:text-mdpc-brown-light hidden md:inline-block">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-full p-2 h-auto dark:text-mdpc-brown-light" 
                  onClick={() => signOut()}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full dark:bg-mdpc-brown-darkest/70 dark:border-mdpc-brown-dark/30 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl dark:text-mdpc-gold">Account</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start dark:text-mdpc-brown-light dark:hover:bg-mdpc-brown-dark/20 group transition-all" 
                        asChild
                      >
                        <a href="#profile">
                          <User className="mr-2 h-4 w-4 transition-transform group-hover:scale-110 group-hover:text-mdpc-gold" />
                          <span className="group-hover:translate-x-1 transition-transform">My Profile</span>
                        </a>
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start dark:text-mdpc-brown-light dark:hover:bg-mdpc-brown-dark/20 group transition-all" 
                        asChild
                      >
                        <a href="#requests">
                          <FileText className="mr-2 h-4 w-4 transition-transform group-hover:scale-110 group-hover:text-mdpc-gold" />
                          <span className="group-hover:translate-x-1 transition-transform">My Requests</span>
                        </a>
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start dark:text-mdpc-brown-light dark:hover:bg-mdpc-brown-dark/20 group transition-all relative" 
                        asChild
                      >
                        <a href="#messages">
                          <MessageSquare className="mr-2 h-4 w-4 transition-transform group-hover:scale-110 group-hover:text-mdpc-gold" />
                          <span className="group-hover:translate-x-1 transition-transform">Messages</span>
                          {unreadMessages > 0 && (
                            <motion.span 
                              className="bg-mdpc-gold text-white text-xs rounded-full h-5 w-5 flex items-center justify-center absolute right-2"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 10 }}
                            >
                              {unreadMessages}
                            </motion.span>
                          )}
                        </a>
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start dark:text-mdpc-brown-light dark:hover:bg-mdpc-brown-dark/20 group transition-all" 
                        asChild
                      >
                        <a href="#settings">
                          <Settings className="mr-2 h-4 w-4 transition-transform group-hover:scale-110 group-hover:text-mdpc-gold" />
                          <span className="group-hover:translate-x-1 transition-transform">Settings</span>
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full dark:border-mdpc-brown-dark/30 dark:text-mdpc-brown-light dark:hover:bg-mdpc-brown-dark/20 transition-all hover:shadow-md" 
                      onClick={() => signOut()}
                    >
                      Sign Out
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card id="profile" className="dark:bg-mdpc-brown-darkest/70 dark:border-mdpc-brown-dark/30 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span className="dark:text-mdpc-gold">My Profile</span>
                      {!editing ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setEditing(true)} 
                          className="dark:border-mdpc-brown-dark/30 dark:text-mdpc-brown-light hover:shadow-md transition-shadow"
                        >
                          Edit
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setEditing(false)} 
                            className="dark:text-mdpc-brown-light hover:shadow-md transition-shadow"
                          >
                            <X className="h-4 w-4 mr-1" /> Cancel
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleSaveProfile} 
                            disabled={savingProfile} 
                            className="dark:border-mdpc-gold/50 dark:text-mdpc-gold hover:shadow-md transition-shadow"
                          >
                            {savingProfile ? (
                              <>Saving...</>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-1" /> Save
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </CardTitle>
                    <CardDescription className="dark:text-mdpc-brown-light">
                      Your personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium dark:text-mdpc-brown-light mb-1 flex items-center">
                        <User className="h-4 w-4 mr-1 text-mdpc-gold" /> Full Name
                      </label>
                      {editing ? (
                        <Input 
                          value={displayName} 
                          onChange={(e) => setDisplayName(e.target.value)} 
                          className="dark:bg-mdpc-brown-darkest/30 dark:border-mdpc-brown-dark/30 dark:text-white focus:ring-2 focus:ring-mdpc-gold/20 transition-all"
                        />
                      ) : (
                        <p className="text-gray-700 dark:text-gray-300">{displayName || "Not set"}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium dark:text-mdpc-brown-light mb-1 flex items-center">
                        <Mail className="h-4 w-4 mr-1 text-mdpc-gold" /> Email Address
                      </label>
                      <p className="text-gray-700 dark:text-gray-300">{email} <span className="text-xs text-gray-500">(cannot be changed)</span></p>
                    </div>
                    <div>
                      <label className="text-sm font-medium dark:text-mdpc-brown-light mb-1 flex items-center">
                        <Phone className="h-4 w-4 mr-1 text-mdpc-gold" /> Phone Number
                      </label>
                      {editing ? (
                        <Input 
                          value={phoneNumber} 
                          onChange={(e) => setPhoneNumber(e.target.value)} 
                          placeholder="+234 800 000 0000"
                          className="dark:bg-mdpc-brown-darkest/30 dark:border-mdpc-brown-dark/30 dark:text-white focus:ring-2 focus:ring-mdpc-gold/20 transition-all"
                        />
                      ) : (
                        <p className="text-gray-700 dark:text-gray-300">{phoneNumber || "Not set"}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Requests Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card id="requests" className="dark:bg-mdpc-brown-darkest/70 dark:border-mdpc-brown-dark/30 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="dark:text-mdpc-gold">My Requests</CardTitle>
                    <CardDescription className="dark:text-mdpc-brown-light">
                      Your service and project requests
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading.requests ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="border rounded-lg p-4 dark:border-mdpc-brown-dark/30">
                            <div className="flex items-center justify-between">
                              <div>
                                <Skeleton className="h-6 w-32 mb-2" />
                                <Skeleton className="h-4 w-24" />
                              </div>
                              <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : requestError ? (
                      <div className="p-4 border border-red-300 rounded-md bg-red-50 dark:bg-red-900/20 dark:border-red-800/40">
                        <h4 className="font-semibold text-red-700 dark:text-red-400">Error Loading Requests</h4>
                        <p className="text-red-600 dark:text-red-300 text-sm">{requestError}</p>
                        <Button 
                          className="mt-2 bg-red-600 hover:bg-red-700 text-white" 
                          size="sm"
                          onClick={() => window.location.reload()}
                        >
                          Retry
                        </Button>
                      </div>
                    ) : requests.length > 0 ? (
                      <div className="space-y-4">
                        {requests.map((request) => (
                          <motion.div 
                            key={`${request.serviceType}-${request.id}`} 
                            className={`border rounded-lg p-4 dark:border-mdpc-brown-dark/30 ${expandedRequest === request.id ? 'bg-gray-50/80 dark:bg-mdpc-brown-darkest/90' : ''} hover:bg-gray-50/50 dark:hover:bg-mdpc-brown-darkest/80 transition-colors cursor-pointer shadow-sm hover:shadow-md`}
                            onClick={() => toggleRequestExpand(request.id)}
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium dark:text-white flex items-center">
                                  {getServiceTypeName(request)}
                                  <Badge variant="outline" className={
                                    request.serviceType === "drilling" 
                                      ? "ml-2 bg-mdpc-blue text-white text-xs shadow-sm" 
                                      : request.serviceType === "logistics" 
                                      ? "ml-2 bg-mdpc-brown-dark text-white text-xs shadow-sm"
                                      : "ml-2 bg-mdpc-gold text-white text-xs shadow-sm"
                                  }>
                                    {request.serviceType.charAt(0).toUpperCase() + request.serviceType.slice(1)}
                                  </Badge>
                                </h4>
                                <div className="flex items-center text-sm text-muted-foreground dark:text-mdpc-brown-light">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>{formatDate(request.createdAt)}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`inline-block px-3 py-1 text-xs rounded-full ${getStatusBadgeColor(request.status)} shadow-sm ${getStatusBadgeShadow(request.status)}`}>
                                  {request.status === "in-progress" ? "In Progress" : 
                                  request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </span>
                                {expandedRequest === request.id ? (
                                  <ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                )}
                              </div>
                            </div>
                            
                            <AnimatePresence>
                              {expandedRequest === request.id && (
                                <motion.div 
                                  className="mt-3 pt-3 border-t dark:border-mdpc-brown-dark/30"
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {request.serviceType === "drilling" && (
                                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                                      <p><strong>Location:</strong> {request.requestDetails?.location || "N/A"}</p>
                                      {request.requestDetails?.message && (
                                        <p><strong>Message:</strong> {request.requestDetails.message}</p>
                                      )}
                                      {request.adminNotes && (
                                        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                                          <p className="text-blue-800 dark:text-blue-200 font-medium">Admin Notes:</p>
                                          <p className="text-blue-700 dark:text-blue-300">{request.adminNotes}</p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  {request.serviceType === "logistics" && (
                                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                                      <p><strong>From:</strong> {request.requestDetails?.pickupLocation || "N/A"}</p>
                                      <p><strong>To:</strong> {request.requestDetails?.deliveryLocation || "N/A"}</p>
                                      {request.requestDetails?.deliveryDate && (
                                        <p><strong>Delivery Date:</strong> {request.requestDetails.deliveryDate}</p>
                                      )}
                                      {request.requestDetails?.message && (
                                        <p><strong>Message:</strong> {request.requestDetails.message}</p>
                                      )}
                                      {request.adminNotes && (
                                        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                                          <p className="text-blue-800 dark:text-blue-200 font-medium">Admin Notes:</p>
                                          <p className="text-blue-700 dark:text-blue-300">{request.adminNotes}</p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  {request.serviceType === "consultation" && (
                                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                                      {request.requestDetails?.message && (
                                        <p><strong>Message:</strong> {request.requestDetails.message}</p>
                                      )}
                                      {request.adminNotes && (
                                        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                                          <p className="text-blue-800 dark:text-blue-200 font-medium">Admin Notes:</p>
                                          <p className="text-blue-700 dark:text-blue-300">{request.adminNotes}</p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50/50 dark:bg-mdpc-brown-darkest/30 rounded-lg">
                        <FileText className="h-12 w-12 text-gray-300 dark:text-mdpc-brown-dark/50 mx-auto mb-4" />
                        <p className="text-muted-foreground dark:text-mdpc-brown-light">No requests found</p>
                        <p className="text-sm text-gray-500 dark:text-mdpc-brown-light/70 mb-4">Submit a consultation request to get started</p>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="bg-mdpc-blue hover:bg-mdpc-blue-dark dark:bg-mdpc-gold dark:hover:bg-mdpc-gold-dark shadow-md hover:shadow-lg transition-shadow" 
                          onClick={() => navigate('/services')}
                        >
                          Request New Service
                        </Button>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="w-full bg-mdpc-blue hover:bg-mdpc-blue-dark dark:bg-mdpc-gold dark:hover:bg-mdpc-gold-dark shadow-md hover:shadow-lg transition-shadow" 
                      onClick={() => navigate('/services')}
                    >
                      Request New Service
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
              
              {/* Messages Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card id="messages" className="dark:bg-mdpc-brown-darkest/70 dark:border-mdpc-brown-dark/30 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="dark:text-mdpc-gold flex items-center justify-between">
                      <span>Messages</span>
                      {unreadMessages > 0 && (
                        <motion.span 
                          className="bg-mdpc-gold text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: [0.8, 1.2, 1] }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 500, 
                            damping: 10,
                            times: [0, 0.5, 1] 
                          }}
                        >
                          {unreadMessages}
                        </motion.span>
                      )}
                    </CardTitle>
                    <CardDescription className="dark:text-mdpc-brown-light">
                      Communications from Midas Touch team
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading.messages ? (
                      <div className="space-y-4">
                        {[1, 2].map(i => (
                          <div key={i} className="border rounded-lg p-4 dark:border-mdpc-brown-dark/30">
                            <div className="mb-2 flex justify-between">
                              <Skeleton className="h-6 w-32" />
                              <Skeleton className="h-4 w-16" />
                            </div>
                            <Skeleton className="h-4 w-48 mb-2" />
                            <Skeleton className="h-4 w-full mb-1" />
                            <Skeleton className="h-4 w-2/3" />
                          </div>
                        ))}
                      </div>
                    ) : messageError ? (
                      <div className="p-4 border border-red-300 rounded-md bg-red-50 dark:bg-red-900/20 dark:border-red-800/40">
                        <h4 className="font-semibold text-red-700 dark:text-red-400">Error Loading Messages</h4>
                        <p className="text-red-600 dark:text-red-300 text-sm">{messageError}</p>
                        <Button 
                          className="mt-2 bg-red-600 hover:bg-red-700 text-white" 
                          size="sm"
                          onClick={() => window.location.reload()}
                        >
                          Retry
                        </Button>
                      </div> 
                    ) : messages.length > 0 ? (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <motion.div 
                            key={message.id} 
                            className={`border rounded-lg p-4 ${!message.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''} dark:border-mdpc-brown-dark/30 hover:shadow-md transition-shadow`}
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium dark:text-white">{message.subject}</h4>
                              {!message.read && (
                                <motion.span 
                                  className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 text-xs px-2 py-0.5 rounded"
                                  animate={{ scale: [1, 1.05, 1] }}
                                  transition={{
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    duration: 2
                                  }}
                                >
                                  New
                                </motion.span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">From: {message.sender}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Date: {formatMessageTime(message.timestamp)}</p>
                            <p className="mt-2 text-gray-700 dark:text-gray-300">{message.message}</p>
                            {!message.read && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markMessageAsRead(message.id);
                                }}
                              >
                                <Check className="h-3 w-3 mr-1" /> Mark as read
                              </Button>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50/50 dark:bg-mdpc-brown-darkest/30 rounded-lg">
                        <MessageSquare className="h-12 w-12 text-gray-300 dark:text-mdpc-brown-dark/50 mx-auto mb-4" />
                        <p className="text-muted-foreground dark:text-mdpc-brown-light">No messages in your inbox</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="dark:border-mdpc-brown-dark/30 dark:text-mdpc-brown-light dark:hover:bg-mdpc-brown-dark/20 transition-shadow hover:shadow-sm"
                    >
                      View All
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="bg-mdpc-blue hover:bg-mdpc-blue-dark dark:bg-mdpc-gold dark:hover:bg-mdpc-gold-dark shadow-md hover:shadow-lg transition-shadow"
                    >
                      Contact Support
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
              
              {/* Settings Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Card id="settings" className="dark:bg-mdpc-brown-darkest/70 dark:border-mdpc-brown-dark/30 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="dark:text-mdpc-gold">Settings</CardTitle>
                    <CardDescription className="dark:text-mdpc-brown-light">
                      Manage your account preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Theme Toggle */}
                    <motion.div 
                      className="flex justify-between items-center p-3 rounded-lg bg-gray-50/70 dark:bg-mdpc-brown-darkest/30 hover:bg-gray-100/80 dark:hover:bg-mdpc-brown-darkest/50 transition-colors"
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <div>
                        <h4 className="font-medium dark:text-white">Theme Preference</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Choose between light and dark mode</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={toggleDarkMode}
                        className="dark:border-mdpc-brown-dark/30 dark:text-mdpc-brown-light shadow-sm hover:shadow-md transition-shadow"
                      >
                        {isDarkMode ? "Switch to Light" : "Switch to Dark"}
                      </Button>
                    </motion.div>
                    
                    {/* Notifications */}
                    <motion.div 
                      className="flex justify-between items-center p-3 rounded-lg bg-gray-50/70 dark:bg-mdpc-brown-darkest/30 hover:bg-gray-100/80 dark:hover:bg-mdpc-brown-darkest/50 transition-colors"
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <div>
                        <h4 className="font-medium dark:text-white">Notifications</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates about your requests and appointments</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={toggleNotifications}
                        className={`${notificationsEnabled ? 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-800' : 'dark:border-mdpc-brown-dark/30'} shadow-sm hover:shadow-md transition-shadow`}
                      >
                        {notificationsEnabled ? (
                          <span className="text-green-700 dark:text-green-400">Enabled</span>
                        ) : (
                          <span className="text-gray-500 dark:text-mdpc-brown-light">Disabled</span>
                        )}
                      </Button>
                    </motion.div>
                    
                    {/* Contact Preferences */}
                    <motion.div 
                      className="p-3 rounded-lg bg-gray-50/70 dark:bg-mdpc-brown-darkest/30 hover:bg-gray-100/80 dark:hover:bg-mdpc-brown-darkest/50 transition-colors"
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <h4 className="font-medium dark:text-white mb-2">Contact Preferences</h4>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" checked className="rounded text-mdpc-gold focus:ring-mdpc-gold dark:bg-mdpc-brown-darkest/30" />
                          <span className="dark:text-mdpc-brown-light">Email updates</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" checked={false} className="rounded text-mdpc-gold focus:ring-mdpc-gold dark:bg-mdpc-brown-darkest/30" />
                          <span className="dark:text-mdpc-brown-light">SMS notifications</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" checked className="rounded text-mdpc-gold focus:ring-mdpc-gold dark:bg-mdpc-brown-darkest/30" />
                          <span className="dark:text-mdpc-brown-light">Project updates</span>
                        </label>
                      </div>
                    </motion.div>
                    
                    {/* Feedback */}
                    <motion.div 
                      className="p-3 rounded-lg bg-gray-50/70 dark:bg-mdpc-brown-darkest/30 hover:bg-gray-100/80 dark:hover:bg-mdpc-brown-darkest/50 transition-colors"
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <h4 className="font-medium dark:text-white mb-2">Send Feedback</h4>
                      <Textarea 
                        placeholder="Share your thoughts or suggestions with us..."
                        className="dark:bg-mdpc-brown-darkest/30 dark:border-mdpc-brown-dark/30 dark:text-white focus:ring-2 focus:ring-mdpc-gold/20 transition-all"
                      />
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="mt-2 bg-mdpc-blue hover:bg-mdpc-blue-dark dark:bg-mdpc-gold dark:hover:bg-mdpc-gold-dark shadow-md hover:shadow-lg transition-shadow"
                      >
                        Submit Feedback
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserDashboard;
