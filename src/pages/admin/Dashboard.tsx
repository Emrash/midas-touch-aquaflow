
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

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
      const requests: BaseRequest[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Omit<BaseRequest, 'id'>;
        requests.push({
          id: doc.id,
          fullName: data.fullName || data.name || "Unknown",
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
        variant: "destructive"
      });
    });
    
    // Fetch logistics requests
    const logisticsQuery = query(collection(db, "logisticsRequests"), orderBy("createdAt", "desc"));
    const unsubscribeLogistics = onSnapshot(logisticsQuery, (snapshot) => {
      const requests: BaseRequest[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Omit<BaseRequest, 'id'>;
        requests.push({
          id: doc.id,
          fullName: data.fullName || data.name || "Unknown",
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
        const data = doc.data() as Omit<BaseRequest, 'id'>;
        requests.push({
          id: doc.id,
          fullName: data.fullName || data.name || "Unknown",
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
                                    <Select 
                                      value={request.status} 
                                      onValueChange={(value: RequestStatus) => {
                                        updateRequestStatus(collectionName, request.id, value);
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
                                    
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => openNotesDialog(request.id, collectionName, request.adminNotes)}
                                      title="Add admin notes"
                                    >
                                      Notes {request.adminNotes ? "*" : ""}
                                    </Button>
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
                                
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => openNotesDialog(request.id, "drillingRequests", request.adminNotes)}
                                  title="Add admin notes"
                                >
                                  Notes {request.adminNotes ? "*" : ""}
                                </Button>
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
                                
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => openNotesDialog(request.id, "logisticsRequests", request.adminNotes)}
                                  title="Add admin notes"
                                >
                                  Notes {request.adminNotes ? "*" : ""}
                                </Button>
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
                              {request.requestDetails.message}
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
                                
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => openNotesDialog(request.id, "consultationRequests", request.adminNotes)}
                                  title="Add admin notes"
                                >
                                  Notes {request.adminNotes ? "*" : ""}
                                </Button>
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
    </div>
  );
};

export default AdminDashboard;
