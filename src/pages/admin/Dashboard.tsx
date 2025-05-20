import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, doc, updateDoc, query, orderBy, Timestamp, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Send, MessageSquare, FileText, Plus } from "lucide-react";
import ProjectUploadModal from "@/components/admin/ProjectUploadModal";

// Define types for service requests
type RequestStatus = "pending" | "in-progress" | "completed";

interface BaseRequest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: RequestStatus;
  createdAt: Timestamp;
  userId: string;
  serviceType: string;
  requestDetails: {
    message?: string;
    [key: string]: any;
  };
  adminNotes?: string;
}

// Define the shape of data coming from Firestore before we add the id
interface FirestoreRequestData {
  fullName?: string; // Make fullName optional since we might fallback to another property
  email?: string;
  phone?: string;
  status: RequestStatus;
  createdAt: Timestamp;
  userId: string;
  serviceType?: string;
  requestDetails?: {
    message?: string;
    [key: string]: any;
  };
  adminNotes?: string;
}

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [drillingRequests, setDrillingRequests] = useState<BaseRequest[]>([]);
  const [logisticsRequests, setLogisticsRequests] = useState<BaseRequest[]>([]);
  const [consultationRequests, setConsultationRequests] = useState<BaseRequest[]>([]);
  const [filter, setFilter] = useState<RequestStatus | "all">("all");
  
  // For admin notes dialog
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<{id: string, collectionName: string, notes: string} | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  
  // For messaging dialog
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState<{id: string, name: string, email: string} | null>(null);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  
  // For request details dialog
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BaseRequest | null>(null);

  // For project upload modal
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  
  useEffect(() => {
    document.title = "Admin Dashboard | Midas Touch";
    
    // Redirect if not admin
    if (!isAdmin) {
      navigate("/");
      return;
    }

    // Fetch drilling requests
    const drillingQuery = query(collection(db, "drillingRequests"), orderBy("createdAt", "desc"));
    const unsubscribeDrilling = onSnapshot(drillingQuery, (snapshot) => {
      console.log("Drilling requests snapshot:", snapshot.size, "documents");
      const requests: BaseRequest[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as FirestoreRequestData;
        requests.push({
          id: doc.id,
          fullName: data.fullName || "Unknown",
          email: data.email || "",
          phone: data.phone || "",
          serviceType: data.serviceType || "drilling",
          requestDetails: data.requestDetails || {},
          status: data.status as RequestStatus,
          createdAt: data.createdAt,
          userId: data.userId,
          adminNotes: data.adminNotes,
        });
      });
      setDrillingRequests(requests);
    }, (error) => {
      console.error("Error fetching drilling requests: ", error);
      toast({
        title: "Error fetching drilling requests",
        description: error.message,
        variant: "destructive"
      });
    });
    
    // Fetch logistics requests
    const logisticsQuery = query(collection(db, "logisticsRequests"), orderBy("createdAt", "desc"));
    const unsubscribeLogistics = onSnapshot(logisticsQuery, (snapshot) => {
      const requests: BaseRequest[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as FirestoreRequestData;
        requests.push({
          id: doc.id,
          fullName: data.fullName || "Unknown",
          email: data.email || "",
          phone: data.phone || "",
          serviceType: data.serviceType || "logistics",
          requestDetails: data.requestDetails || {},
          status: data.status as RequestStatus,
          createdAt: data.createdAt,
          userId: data.userId,
          adminNotes: data.adminNotes,
        });
      });
      setLogisticsRequests(requests);
    }, (error) => {
      console.error("Error fetching logistics requests: ", error);
      toast({
        title: "Error fetching logistics requests",
        variant: "destructive"
      });
    });
    
    // Fetch consultation requests
    const consultationQuery = query(collection(db, "consultationRequests"), orderBy("createdAt", "desc"));
    const unsubscribeConsultation = onSnapshot(consultationQuery, (snapshot) => {
      const requests: BaseRequest[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as FirestoreRequestData;
        requests.push({
          id: doc.id,
          fullName: data.fullName || "Unknown",
          email: data.email || "",
          phone: data.phone || "",
          serviceType: data.serviceType || "consultation",
          requestDetails: data.requestDetails || {},
          status: data.status as RequestStatus,
          createdAt: data.createdAt,
          userId: data.userId,
          adminNotes: data.adminNotes,
        });
      });
      setConsultationRequests(requests);
    }, (error) => {
      console.error("Error fetching consultation requests: ", error);
      toast({
        title: "Error fetching consultation requests",
        variant: "destructive"
      });
    });
    
    return () => {
      unsubscribeDrilling();
      unsubscribeLogistics();
      unsubscribeConsultation();
    };
  }, [isAdmin, navigate]);

  const updateRequestStatus = async (collectionName: string, id: string, status: RequestStatus) => {
    try {
      await updateDoc(doc(db, collectionName, id), { status });
      
      // Also add a status update to the updates collection
      await addDoc(collection(db, "statusUpdates"), {
        requestId: id,
        collectionName: collectionName,
        status: status,
        updatedAt: Timestamp.now(),
        updatedBy: user?.email || "Admin",
        message: `Status updated to ${status}`
      });
      
      toast({
        title: "Status updated",
        description: `Request status updated to ${status}`
      });
    } catch (error) {
      console.error("Error updating request status: ", error);
      toast({
        title: "Error updating status",
        variant: "destructive"
      });
    }
  };

  const openNotesDialog = (id: string, collectionName: string, notes: string = "") => {
    setCurrentRequest({ id, collectionName, notes });
    setAdminNotes(notes);
    setIsNotesOpen(true);
  };

  const saveAdminNotes = async () => {
    if (!currentRequest) return;
    
    try {
      await updateDoc(doc(db, currentRequest.collectionName, currentRequest.id), { 
        adminNotes: adminNotes 
      });
      
      toast({
        title: "Notes saved",
        description: "Admin notes have been saved successfully"
      });
      
      setIsNotesOpen(false);
    } catch (error) {
      console.error("Error saving admin notes: ", error);
      toast({
        title: "Error saving notes",
        variant: "destructive"
      });
    }
  };

  const openMessageDialog = (userId: string, fullName: string, email: string) => {
    console.log("Opening message dialog for user:", userId, fullName, email);
    setMessageRecipient({
      id: userId,
      name: fullName || "Client",
      email: email || ""
    });
    setMessageSubject(`Update on your service request`);
    setMessageText("");
    setIsMessageOpen(true);
  };

  const sendMessage = async () => {
    if (!messageRecipient || !messageText.trim()) return;
    
    console.log("Sending message to:", messageRecipient);
    setSendingMessage(true);
    try {
      // Create a new message document
      const messageData = {
        sender: user?.email || "Midas Touch Admin",
        recipientId: messageRecipient.id,
        subject: messageSubject || "Update from Midas Touch",
        message: messageText,
        timestamp: Timestamp.now(),
        read: false
      };
      
      await addDoc(collection(db, "messages"), messageData);
      console.log("Message sent successfully:", messageData);
      
      toast({
        title: "Message Sent",
        description: `Message sent to ${messageRecipient.name}`,
      });
      
      setIsMessageOpen(false);
      setMessageText("");
      setMessageSubject("");
      setMessageRecipient(null);
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error Sending Message",
        description: error.message || "There was a problem sending your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const viewRequestDetails = (request: BaseRequest) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
  };

  const getStatusBadgeColor = (status: RequestStatus) => {
    switch(status) {
      case "pending": return "bg-yellow-500 hover:bg-yellow-600";
      case "in-progress": return "bg-blue-500 hover:bg-blue-600";
      case "completed": return "bg-green-500 hover:bg-green-600";
      default: return "bg-gray-500";
    }
  };

  const formatDate = (timestamp: any) => {
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
      return serviceTypes[subType] || "Drilling";
    } else if (request.serviceType === "logistics") {
      const subType = request.requestDetails?.serviceSubType || "";
      const serviceTypes: {[key: string]: string} = {
        "bulky-delivery": "Bulky Delivery",
        "doorstep-delivery": "Doorstep Delivery",
        "express-delivery": "Express Delivery",
        "water-equipment": "Water Equipment Transport",
      };
      return serviceTypes[subType] || "Logistics";
    } else {
      return request.serviceType || "Consultation";
    }
  };
  
  const filteredDrillingRequests = filter === "all" 
    ? drillingRequests
    : drillingRequests.filter(req => req.status === filter);
    
  const filteredLogisticsRequests = filter === "all" 
    ? logisticsRequests
    : logisticsRequests.filter(req => req.status === filter);
    
  const filteredConsultationRequests = filter === "all"
    ? consultationRequests
    : consultationRequests.filter(req => req.status === filter);

  const allRequests = [...filteredDrillingRequests, ...filteredLogisticsRequests, ...filteredConsultationRequests];
  
  // Count all pending requests
  const pendingRequestsCount = drillingRequests.filter(req => req.status === "pending").length +
    logisticsRequests.filter(req => req.status === "pending").length +
    consultationRequests.filter(req => req.status === "pending").length;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-mdpc-blue text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-heading font-bold">Admin Dashboard</h1>
              <p className="text-sm opacity-80">Welcome, {user?.email}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="border-white text-white hover:bg-white/10"
            >
              Back to Website
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Service Requests</CardTitle>
              <CardDescription>Total requests received</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-mdpc-gold">{drillingRequests.length + logisticsRequests.length + consultationRequests.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Pending Requests</CardTitle>
              <CardDescription>Awaiting your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-mdpc-gold">{pendingRequestsCount}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Completed Requests</CardTitle>
              <CardDescription>Successfully fulfilled</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-mdpc-gold">
                {drillingRequests.filter(req => req.status === "completed").length +
                logisticsRequests.filter(req => req.status === "completed").length +
                consultationRequests.filter(req => req.status === "completed").length}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Project Management Section */}
        <Card className="mb-8">
          <CardHeader className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <CardTitle className="text-2xl">Projects</CardTitle>
              <CardDescription>Manage website projects portfolio</CardDescription>
            </div>
            <Button 
              onClick={() => setIsProjectModalOpen(true)}
              className="bg-mdpc-gold hover:bg-mdpc-gold-dark text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Project
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500 py-6">
              Click "Add New Project" to upload new completed projects to showcase on the website.
            </div>
          </CardContent>
        </Card>
        
        {/* Service Requests Card */}
        <Card className="mb-8">
          <CardHeader className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <CardTitle className="text-2xl">Service Requests</CardTitle>
              <CardDescription>Manage drilling and logistics service requests</CardDescription>
            </div>
            <div className="w-full sm:w-auto">
              <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Requests</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Requests</TabsTrigger>
                <TabsTrigger value="drilling">Drilling</TabsTrigger>
                <TabsTrigger value="logistics">Logistics</TabsTrigger>
                <TabsTrigger value="consultation">Consultation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                {allRequests.length === 0 ? (
                  <div className="bg-gray-100 p-8 text-center rounded-md">
                    <p className="text-gray-500">No service requests matching your filter</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allRequests
                          .sort((a, b) => {
                            // Sort by creation date (newest first)
                            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date();
                            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date();
                            return dateB.getTime() - dateA.getTime();
                          })
                          .map(request => {
                            const isDrilling = request.serviceType === "drilling";
                            const isLogistics = request.serviceType === "logistics";
                            const isConsultation = request.serviceType === "consultation" || (!isDrilling && !isLogistics);
                            const collectionName = isDrilling ? "drillingRequests" : isLogistics ? "logisticsRequests" : "consultationRequests";
                            
                            return (
                              <TableRow key={request.id}>
                                <TableCell className="whitespace-nowrap">{formatDate(request.createdAt)}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={
                                    isDrilling 
                                      ? "bg-mdpc-blue text-white" 
                                      : isLogistics 
                                        ? "bg-mdpc-brown-dark text-white"
                                        : "bg-mdpc-gold text-white"
                                  }>
                                    {isDrilling ? "Drilling" : isLogistics ? "Logistics" : "Consultation"}
                                  </Badge>
                                </TableCell>
                                <TableCell>{request.fullName}</TableCell>
                                <TableCell>{getServiceTypeName(request)}</TableCell>
                                <TableCell className="max-w-[150px] truncate">
                                  <div className="truncate">{request.email}</div>
                                  <div className="text-xs text-gray-500">{request.phone}</div>
                                </TableCell>
                                <TableCell>
                                  <Badge className={getStatusBadgeColor(request.status)}>
                                    {request.status === "in-progress" ? "In Progress" : 
                                     request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => viewRequestDetails(request)}
                                        title="View full details"
                                        className="border-mdpc-blue text-mdpc-blue hover:bg-mdpc-blue/10"
                                      >
                                        <FileText className="h-4 w-4 mr-1" />
                                        Details
                                      </Button>
                                      
                                      <Button 
                                        variant="default" 
                                        size="sm"
                                        className="bg-mdpc-blue text-white hover:bg-mdpc-blue-dark"
                                        onClick={() => {
                                          console.log("Message button clicked for user:", request.userId);
                                          if (request.userId) {
                                            openMessageDialog(request.userId, request.fullName || "", request.email || "");
                                          } else {
                                            toast({
                                              title: "Error",
                                              description: "Cannot message user: User ID not found",
                                              variant: "destructive"
                                            });
                                          }
                                        }}
                                        title="Send message to client"
                                      >
                                        <MessageSquare className="h-4 w-4 mr-1" />
                                        Message
                                      </Button>
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="drilling" className="space-y-4">
                {filteredDrillingRequests.length === 0 ? (
                  <div className="bg-gray-100 p-8 text-center rounded-md">
                    <p className="text-gray-500">No drilling service requests matching your filter</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Service Type</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDrillingRequests.map(request => (
                          <TableRow key={request.id}>
                            <TableCell className="whitespace-nowrap">{formatDate(request.createdAt)}</TableCell>
                            <TableCell>{request.fullName}</TableCell>
                            <TableCell>{getServiceTypeName(request)}</TableCell>
                            <TableCell className="max-w-[150px] truncate">{request.requestDetails.location}</TableCell>
                            <TableCell>
                              <div className="truncate">{request.email}</div>
                              <div className="text-xs text-gray-500">{request.phone}</div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusBadgeColor(request.status)}>
                                {request.status === "in-progress" ? "In Progress" : 
                                 request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => viewRequestDetails(request)}
                                    title="View full details"
                                    className="border-mdpc-blue text-mdpc-blue hover:bg-mdpc-blue/10"
                                  >
                                    <FileText className="h-4 w-4 mr-1" />
                                    Details
                                  </Button>
                                  
                                  <Select 
                                    value={request.status} 
                                    onValueChange={(value: RequestStatus) => {
                                      updateRequestStatus("drillingRequests", request.id, value);
                                    }}
                                  >
                                    <SelectTrigger className="w-[130px]">
                                      <SelectValue placeholder="Update status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="in-progress">In Progress</SelectItem>
                                      <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="logistics" className="space-y-4">
                {filteredLogisticsRequests.length === 0 ? (
                  <div className="bg-gray-100 p-8 text-center rounded-md">
                    <p className="text-gray-500">No logistics service requests matching your filter</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Service Type</TableHead>
                          <TableHead>Route</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLogisticsRequests.map(request => (
                          <TableRow key={request.id}>
                            <TableCell className="whitespace-nowrap">{formatDate(request.createdAt)}</TableCell>
                            <TableCell>{request.fullName}</TableCell>
                            <TableCell>{getServiceTypeName(request)}</TableCell>
                            <TableCell className="max-w-[150px]">
                              <div className="truncate"><span className="text-xs font-medium">From:</span> {request.requestDetails.pickupLocation}</div>
                              <div className="truncate"><span className="text-xs font-medium">To:</span> {request.requestDetails.deliveryLocation}</div>
                            </TableCell>
                            <TableCell>
                              <div className="truncate">{request.email}</div>
                              <div className="text-xs text-gray-500">{request.phone}</div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusBadgeColor(request.status)}>
                                {request.status === "in-progress" ? "In Progress" : 
                                 request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => viewRequestDetails(request)}
                                    title="View full details"
                                    className="border-mdpc-blue text-mdpc-blue hover:bg-mdpc-blue/10"
                                  >
                                    <FileText className="h-4 w-4 mr-1" />
                                    Details
                                  </Button>
                                  
                                  <Select 
                                    value={request.status} 
                                    onValueChange={(value: RequestStatus) => {
                                      updateRequestStatus("logisticsRequests", request.id, value);
                                    }}
                                  >
                                    <SelectTrigger className="w-[130px]">
                                      <SelectValue placeholder="Update status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="in-progress">In Progress</SelectItem>
                                      <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="consultation" className="space-y-4">
                {filteredConsultationRequests.length === 0 ? (
                  <div className="bg-gray-100 p-8 text-center rounded-md">
                    <p className="text-gray-500">No consultation requests matching your filter</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredConsultationRequests.map(request => (
                          <TableRow key={request.id}>
                            <TableCell className="whitespace-nowrap">{formatDate(request.createdAt)}</TableCell>
                            <TableCell>{request.fullName}</TableCell>
                            <TableCell>{getServiceTypeName(request)}</TableCell>
                            <TableCell className="max-w-[150px] truncate">
                              {request.requestDetails.message ? (
                                <Button 
                                  variant="link" 
                                  className="text-mdpc-blue p-0 h-auto font-normal text-left"
                                  onClick={() => viewRequestDetails(request)}
                                >
                                  {request.requestDetails.message.length > 50 ? 
                                    request.requestDetails.message.substring(0, 50) + '...' : 
                                    request.requestDetails.message}
                                </Button>
                              ) : "No message"}
                            </TableCell>
                            <TableCell>
                              <div className="truncate">{request.email}</div>
                              <div className="text-xs text-gray-500">{request.phone}</div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusBadgeColor(request.status)}>
                                {request.status === "in-progress" ? "In Progress" : 
                                 request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => viewRequestDetails(request)}
                                    title="View full details"
                                    className="border-mdpc-blue text-mdpc-blue hover:bg-mdpc-blue/10"
                                  >
                                    <FileText className="h-4 w-4 mr-1" />
                                    Details
                                  </Button>
                                  
                                  <Select 
                                    value={request.status} 
                                    onValueChange={(value: RequestStatus) => {
                                      updateRequestStatus("consultationRequests", request.id, value);
                                    }}
                                  >
                                    <SelectTrigger className="w-[130px]">
                                      <SelectValue placeholder="Update status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="in-progress">In Progress</SelectItem>
                                      <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      
      {/* Admin Notes Dialog */}
      <Dialog open={isNotesOpen} onOpenChange={setIsNotesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin Notes</DialogTitle>
            <DialogDescription>Add private notes about this service request</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add your notes here..."
              rows={5}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsNotesOpen(false)}>Cancel</Button>
            <Button onClick={saveAdminNotes}>Save Notes</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Message Dialog */}
      <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Message to Client</DialogTitle>
            <DialogDescription>
              {messageRecipient && (
                <span>Sending to: <b>{messageRecipient.name}</b> ({messageRecipient.email})</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
                placeholder="Message subject..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message here..."
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMessageOpen(false)}>Cancel</Button>
            <Button 
              onClick={sendMessage} 
              disabled={sendingMessage || !messageText.trim()}
              className="bg-mdpc-blue text-white hover:bg-mdpc-blue-dark"
            >
              {sendingMessage ? (
                <>Sending...</>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-1" />
                  Send Message
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              {selectedRequest && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className={
                    selectedRequest.serviceType === "drilling"
                      ? "bg-mdpc-blue text-white" 
                      : selectedRequest.serviceType === "logistics"
                        ? "bg-mdpc-brown-dark text-white"
                        : "bg-mdpc-gold text-white"
                  }>
                    {selectedRequest.serviceType.charAt(0).toUpperCase() + selectedRequest.serviceType.slice(1)}
                  </Badge>
                  <Badge className={getStatusBadgeColor(selectedRequest.status)}>
                    {selectedRequest.status === "in-progress" ? "In Progress" : 
                     selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Submitted on {formatDate(selectedRequest.createdAt)}
                  </span>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Client Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Name:</span> {selectedRequest.fullName}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {selectedRequest.email}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {selectedRequest.phone}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Service Details</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Service Type:</span> {getServiceTypeName(selectedRequest)}
                    </div>
                    
                    {selectedRequest.serviceType === "drilling" && (
                      <>
                        <div>
                          <span className="font-medium">Location:</span> {selectedRequest.requestDetails.location || "Not specified"}
                        </div>
                        <div>
                          <span className="font-medium">Project Type:</span> {selectedRequest.requestDetails.projectType || "Not specified"}
                        </div>
                        <div>
                          <span className="font-medium">Estimated Duration:</span> {selectedRequest.requestDetails.estimatedDuration || "Not specified"}
                        </div>
                      </>
                    )}
                    
                    {selectedRequest.serviceType === "logistics" && (
                      <>
                        <div>
                          <span className="font-medium">Pickup Location:</span> {selectedRequest.requestDetails.pickupLocation || "Not specified"}
                        </div>
                        <div>
                          <span className="font-medium">Delivery Location:</span> {selectedRequest.requestDetails.deliveryLocation || "Not specified"}
                        </div>
                        <div>
                          <span className="font-medium">Cargo Type:</span> {selectedRequest.requestDetails.cargoType || "Not specified"}
                        </div>
                        <div>
                          <span className="font-medium">Delivery Date:</span> {selectedRequest.requestDetails.deliveryDate || "Not specified"}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Message or additional notes section */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Message/Additional Information</h3>
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  {selectedRequest.requestDetails.message || selectedRequest.requestDetails.additionalNotes || 
                   selectedRequest.requestDetails.specialRequirements || "No additional information provided."}
                </div>
              </div>
              
              {/* Admin notes section */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Admin Notes</h3>
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  {selectedRequest.adminNotes || "No admin notes yet."}
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
                
                <div className="flex gap-2">
                  {selectedRequest.serviceType === "drilling" && (
                    <Button 
                      onClick={() => openNotesDialog(selectedRequest.id, "drillingRequests", selectedRequest.adminNotes || "")}
                      className="bg-mdpc-blue text-white hover:bg-mdpc-blue-dark"
                    >
                      Edit Notes
                    </Button>
                  )}
                  
                  {selectedRequest.serviceType === "logistics" && (
                    <Button 
                      onClick={() => openNotesDialog(selectedRequest.id, "logisticsRequests", selectedRequest.adminNotes || "")}
                      className="bg-mdpc-blue text-white hover:bg-mdpc-blue-dark"
                    >
                      Edit Notes
                    </Button>
                  )}
                  
                  {selectedRequest.serviceType === "consultation" && (
                    <Button 
                      onClick={() => openNotesDialog(selectedRequest.id, "consultationRequests", selectedRequest.adminNotes || "")}
                      className="bg-mdpc-blue text-white hover:bg-mdpc-blue-dark"
                    >
                      Edit Notes
                    </Button>
                  )}
                  
                  <Button 
                    onClick={() => {
                      if (selectedRequest.userId) {
                        openMessageDialog(selectedRequest.userId, selectedRequest.fullName || "", selectedRequest.email || "");
                        setIsDetailsOpen(false);
                      }
                    }}
                    className="bg-mdpc-blue text-white hover:bg-mdpc-blue-dark"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message Client
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Project Upload Modal */}
      <ProjectUploadModal 
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
    </div>
  );
};

export default AdminDashboard;
