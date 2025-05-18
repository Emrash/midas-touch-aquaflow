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
import { Clock, Calendar, FileText, User, MessageSquare, Settings, Phone, Mail, Save, X, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { updateProfile } from "firebase/auth";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";

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
}

interface Message {
  id: string;
  date: string;
  from: string;
  subject: string;
  message: string;
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
      
      // Set up listeners for all request collections
      const collections = ["drillingRequests", "logisticsRequests", "consultationRequests"];
      let allRequests: BaseRequest[] = [];
      
      collections.forEach(collectionName => {
        const requestsQuery = query(
          collection(db, collectionName),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        
        onSnapshot(requestsQuery, (snapshot) => {
          const newRequests = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              createdAt: data.createdAt,
              status: data.status,
              serviceType: collectionName === "drillingRequests" ? "drilling" : 
                          collectionName === "logisticsRequests" ? "logistics" : "consultation",
              requestDetails: data.requestDetails || {},
              adminNotes: data.adminNotes
            };
          });
          
          // Update combined requests
          allRequests = allRequests.filter(req => {
            // Keep requests from other collections
            return !newRequests.some(newReq => 
              newReq.id === req.id && 
              newReq.serviceType === req.serviceType
            );
          }).concat(newRequests);
          
          // Sort by date
          allRequests.sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date();
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date();
            return dateB.getTime() - dateA.getTime();
          });
          
          setRequests(allRequests);
          setLoading(prev => ({ ...prev, requests: false }));
        }, (error) => {
          console.error(`Error fetching ${collectionName}:`, error);
          setLoading(prev => ({ ...prev, requests: false }));
        });
      });
      
      // Fetch status updates
      const statusUpdatesQuery = query(
        collection(db, "statusUpdates"),
        orderBy("updatedAt", "desc")
      );
      
      onSnapshot(statusUpdatesQuery, (snapshot) => {
        // Process status updates if needed
      }, (error) => {
        console.error("Error fetching status updates:", error);
      });
      
      // Fetch messages
      setLoading(prev => ({ ...prev, messages: true }));
      const messagesQuery = query(
        collection(db, "messages"),
        where("userId", "==", user.uid),
        orderBy("date", "desc")
      );
      
      getDocs(messagesQuery).then(messagesSnapshot => {
        const messagesData: Message[] = messagesSnapshot.docs.map(doc => ({
          id: doc.id,
          date: new Date(doc.data().date?.toDate()).toLocaleDateString(),
          from: doc.data().from || "Midas Touch Support",
          subject: doc.data().subject || "Welcome",
          message: doc.data().message || "Welcome to Midas Touch! We're glad you're here.",
          read: doc.data().read || false
        }));
        
        if (messagesData.length > 0) {
          setMessages(messagesData);
        } else {
          // Fallback messages if none in database
          setMessages([
            {
              id: "MSG-001",
              date: new Date().toLocaleDateString(),
              from: "Midas Touch Support",
              subject: "Welcome to Midas Touch",
              message: "Thank you for creating an account with Midas Touch. We're excited to provide you with our premium water solutions services. Feel free to browse our offerings and request a consultation anytime!",
              read: false
            }
          ]);
        }
        
        setLoading(prev => ({ ...prev, messages: false }));
      }).catch(error => {
        console.error("Error fetching messages:", error);
        setLoading(prev => ({ ...prev, messages: false }));
        
        // Set fallback messages
        setMessages([
          {
            id: "MSG-001",
            date: new Date().toLocaleDateString(),
            from: "Midas Touch Support",
            subject: "Welcome to Midas Touch",
            message: "Thank you for creating an account with Midas Touch. We're excited to provide you with our premium water solutions services. Feel free to browse our offerings and request a consultation anytime!",
            read: false
          }
        ]);
      });
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
  
  const markMessageAsRead = (id: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, read: true } : msg
    ));
    
    toast({
      title: "Message Marked as Read",
      description: "The message has been marked as read.",
    });
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

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-12 bg-gray-50 dark:bg-mdpc-brown-darkest/90">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-mdpc-blue dark:text-mdpc-gold">My Dashboard</h1>
            <p className="text-mdpc-brown-dark dark:text-mdpc-brown-light mt-2">
              Welcome back, {user.displayName || user.email}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="h-full dark:bg-mdpc-brown-darkest/70 dark:border-mdpc-brown-dark/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl dark:text-mdpc-gold">Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start dark:text-mdpc-brown-light dark:hover:bg-mdpc-brown-dark/20" asChild>
                      <a href="#profile">
                        <User className="mr-2 h-4 w-4" />
                        My Profile
                      </a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start dark:text-mdpc-brown-light dark:hover:bg-mdpc-brown-dark/20" asChild>
                      <a href="#requests">
                        <FileText className="mr-2 h-4 w-4" />
                        My Requests
                      </a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start dark:text-mdpc-brown-light dark:hover:bg-mdpc-brown-dark/20" asChild>
                      <a href="#messages">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Messages
                      </a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start dark:text-mdpc-brown-light dark:hover:bg-mdpc-brown-dark/20" asChild>
                      <a href="#settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </a>
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full dark:border-mdpc-brown-dark/30 dark:text-mdpc-brown-light dark:hover:bg-mdpc-brown-dark/20" 
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Section */}
              <Card id="profile" className="dark:bg-mdpc-brown-darkest/70 dark:border-mdpc-brown-dark/30">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span className="dark:text-mdpc-gold">My Profile</span>
                    {!editing ? (
                      <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="dark:border-mdpc-brown-dark/30 dark:text-mdpc-brown-light">
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditing(false)} className="dark:text-mdpc-brown-light">
                          <X className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleSaveProfile} disabled={savingProfile} className="dark:border-mdpc-gold/50 dark:text-mdpc-gold">
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
                        className="dark:bg-mdpc-brown-darkest/30 dark:border-mdpc-brown-dark/30 dark:text-white"
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
                        className="dark:bg-mdpc-brown-darkest/30 dark:border-mdpc-brown-dark/30 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300">{phoneNumber || "Not set"}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Requests Section */}
              <Card id="requests" className="dark:bg-mdpc-brown-darkest/70 dark:border-mdpc-brown-dark/30">
                <CardHeader>
                  <CardTitle className="dark:text-mdpc-gold">My Requests</CardTitle>
                  <CardDescription className="dark:text-mdpc-brown-light">
                    Your service and project requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading.requests ? (
                    <div className="py-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mdpc-gold mx-auto mb-2"></div>
                      <p className="dark:text-mdpc-brown-light">Loading your requests...</p>
                    </div>
                  ) : requests.length > 0 ? (
                    <div className="space-y-4">
                      {requests.map((request) => (
                        <div key={`${request.serviceType}-${request.id}`} className="border rounded-lg p-4 dark:border-mdpc-brown-dark/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium dark:text-white">
                                {getServiceTypeName(request)}
                                <Badge variant="outline" className={
                                  request.serviceType === "drilling" 
                                    ? "ml-2 bg-mdpc-blue text-white text-xs" 
                                    : request.serviceType === "logistics" 
                                    ? "ml-2 bg-mdpc-brown-dark text-white text-xs"
                                    : "ml-2 bg-mdpc-gold text-white text-xs"
                                }>
                                  {request.serviceType.charAt(0).toUpperCase() + request.serviceType.slice(1)}
                                </Badge>
                              </h4>
                              <div className="flex items-center text-sm text-muted-foreground dark:text-mdpc-brown-light">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{formatDate(request.createdAt)}</span>
                              </div>
                            </div>
                            <div>
                              <span className={`inline-block px-3 py-1 text-xs rounded-full ${getStatusBadgeColor(request.status)}`}>
                                {request.status === "in-progress" ? "In Progress" : 
                                 request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          
                          {request.serviceType === "drilling" && (
                            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                              <p><strong>Location:</strong> {request.requestDetails?.location || "N/A"}</p>
                              {request.requestDetails?.message && (
                                <p className="mt-1"><strong>Message:</strong> {request.requestDetails.message}</p>
                              )}
                            </div>
                          )}
                          
                          {request.serviceType === "logistics" && (
                            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                              <p><strong>From:</strong> {request.requestDetails?.pickupLocation || "N/A"}</p>
                              <p><strong>To:</strong> {request.requestDetails?.deliveryLocation || "N/A"}</p>
                              {request.requestDetails?.deliveryDate && (
                                <p className="mt-1"><strong>Delivery Date:</strong> {request.requestDetails.deliveryDate}</p>
                              )}
                              {request.requestDetails?.message && (
                                <p className="mt-1"><strong>Message:</strong> {request.requestDetails.message}</p>
                              )}
                            </div>
                          )}
                          
                          {request.serviceType === "consultation" && (
                            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                              {request.requestDetails?.message && (
                                <p><strong>Message:</strong> {request.requestDetails.message}</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground dark:text-mdpc-brown-light">No requests found. Submit a consultation request to get started.</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="default" size="sm" className="w-full bg-mdpc-blue hover:bg-mdpc-blue-dark dark:bg-mdpc-gold dark:hover:bg-mdpc-gold-dark" 
                    onClick={() => navigate('/services')}>
                    Request New Service
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Messages Section */}
              <Card id="messages" className="dark:bg-mdpc-brown-darkest/70 dark:border-mdpc-brown-dark/30">
                <CardHeader>
                  <CardTitle className="dark:text-mdpc-gold">Messages</CardTitle>
                  <CardDescription className="dark:text-mdpc-brown-light">
                    Communications from Midas Touch team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading.messages ? (
                    <div className="py-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mdpc-gold mx-auto mb-2"></div>
                      <p className="dark:text-mdpc-brown-light">Loading your messages...</p>
                    </div>
                  ) : messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className={`border rounded-lg p-4 ${!message.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''} dark:border-mdpc-brown-dark/30`}>
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium dark:text-white">{message.subject}</h4>
                            {!message.read && (
                              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 text-xs px-2 py-0.5 rounded">New</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">From: {message.from}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Date: {message.date}</p>
                          <p className="mt-2 text-gray-700 dark:text-gray-300">{message.message}</p>
                          {!message.read && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 p-0"
                              onClick={() => markMessageAsRead(message.id)}
                            >
                              <Check className="h-3 w-3 mr-1" /> Mark as read
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground dark:text-mdpc-brown-light">No messages in your inbox.</p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" className="dark:border-mdpc-brown-dark/30 dark:text-mdpc-brown-light dark:hover:bg-mdpc-brown-dark/20">
                    View All
                  </Button>
                  <Button variant="default" size="sm" className="bg-mdpc-blue hover:bg-mdpc-blue-dark dark:bg-mdpc-gold dark:hover:bg-mdpc-gold-dark">
                    Contact Support
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Settings Section */}
              <Card id="settings" className="dark:bg-mdpc-brown-darkest/70 dark:border-mdpc-brown-dark/30">
                <CardHeader>
                  <CardTitle className="dark:text-mdpc-gold">Settings</CardTitle>
                  <CardDescription className="dark:text-mdpc-brown-light">
                    Manage your account preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Theme Toggle */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium dark:text-white">Theme Preference</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Choose between light and dark mode</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={toggleDarkMode}
                      className="dark:border-mdpc-brown-dark/30 dark:text-mdpc-brown-light"
                    >
                      {isDarkMode ? "Switch to Light" : "Switch to Dark"}
                    </Button>
                  </div>
                  
                  {/* Notifications */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium dark:text-white">Notifications</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates about your requests and appointments</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={toggleNotifications}
                      className={`${notificationsEnabled ? 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-800' : 'dark:border-mdpc-brown-dark/30'}`}
                    >
                      {notificationsEnabled ? (
                        <span className="text-green-700 dark:text-green-400">Enabled</span>
                      ) : (
                        <span className="text-gray-500 dark:text-mdpc-brown-light">Disabled</span>
                      )}
                    </Button>
                  </div>
                  
                  {/* Contact Preferences */}
                  <div>
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
                  </div>
                  
                  {/* Feedback */}
                  <div>
                    <h4 className="font-medium dark:text-white mb-2">Send Feedback</h4>
                    <Textarea 
                      placeholder="Share your thoughts or suggestions with us..."
                      className="dark:bg-mdpc-brown-darkest/30 dark:border-mdpc-brown-dark/30 dark:text-white"
                    />
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="mt-2 bg-mdpc-blue hover:bg-mdpc-blue-dark dark:bg-mdpc-gold dark:hover:bg-mdpc-gold-dark"
                    >
                      Submit Feedback
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserDashboard;
