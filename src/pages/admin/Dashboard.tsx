
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define types for service requests
type RequestStatus = "pending" | "in-progress" | "completed";

interface BaseRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: RequestStatus;
  createdAt: any;
  userId: string;
  message?: string;
}

interface DrillingRequest extends BaseRequest {
  location: string;
  serviceType: string;
}

interface LogisticsRequest extends BaseRequest {
  pickupLocation: string;
  deliveryLocation: string;
  serviceType: string;
  cargoDescription?: string;
  deliveryDate?: string;
}

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [drillingRequests, setDrillingRequests] = useState<DrillingRequest[]>([]);
  const [logisticsRequests, setLogisticsRequests] = useState<LogisticsRequest[]>([]);
  const [filter, setFilter] = useState<RequestStatus | "all">("all");
  
  useEffect(() => {
    document.title = "Admin Dashboard | Midas Touch";
    
    // Redirect if not admin
    if (!isAdmin) {
      navigate("/");
    }

    // Fetch drilling requests
    const drillingQuery = query(collection(db, "drillingRequests"), orderBy("createdAt", "desc"));
    const unsubscribeDrilling = onSnapshot(drillingQuery, (snapshot) => {
      const requests: DrillingRequest[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        requests.push({
          id: doc.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          location: data.location,
          serviceType: data.serviceType,
          status: data.status,
          createdAt: data.createdAt,
          userId: data.userId,
          message: data.message
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
      const requests: LogisticsRequest[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        requests.push({
          id: doc.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          pickupLocation: data.pickupLocation,
          deliveryLocation: data.deliveryLocation,
          serviceType: data.serviceType,
          status: data.status,
          createdAt: data.createdAt,
          userId: data.userId,
          cargoDescription: data.cargoDescription,
          deliveryDate: data.deliveryDate,
          message: data.message
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
    
    return () => {
      unsubscribeDrilling();
      unsubscribeLogistics();
    };
  }, [isAdmin, navigate]);

  const updateRequestStatus = async (collection: string, id: string, status: RequestStatus) => {
    try {
      await updateDoc(doc(db, collection, id), { status });
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

  const getServiceTypeName = (type: string) => {
    const serviceTypes: {[key: string]: string} = {
      "borehole-drilling": "Borehole Drilling",
      "geophysical-survey": "Geophysical Survey",
      "water-treatment": "Water Treatment",
      "pump-installation": "Pump Installation",
      "borehole-maintenance": "Borehole Maintenance",
      "bulky-delivery": "Bulky Delivery",
      "doorstep-delivery": "Doorstep Delivery",
      "express-delivery": "Express Delivery",
      "water-equipment": "Water Equipment Transport",
    };
    
    return serviceTypes[type] || type;
  };
  
  const filteredDrillingRequests = filter === "all" 
    ? drillingRequests
    : drillingRequests.filter(req => req.status === filter);
    
  const filteredLogisticsRequests = filter === "all" 
    ? logisticsRequests
    : logisticsRequests.filter(req => req.status === filter);

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
              <p className="text-3xl font-bold text-mdpc-gold">{drillingRequests.length + logisticsRequests.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Drilling Requests</CardTitle>
              <CardDescription>Borehole and water services</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-mdpc-gold">{drillingRequests.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Logistics Requests</CardTitle>
              <CardDescription>Transportation services</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-mdpc-gold">{logisticsRequests.length}</p>
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
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                {filteredDrillingRequests.length === 0 && filteredLogisticsRequests.length === 0 ? (
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
                        {[...filteredDrillingRequests, ...filteredLogisticsRequests]
                          .sort((a, b) => {
                            // Sort by creation date (newest first)
                            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date();
                            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date();
                            return dateB.getTime() - dateA.getTime();
                          })
                          .map(request => {
                            const isDrilling = 'location' in request;
                            
                            return (
                              <TableRow key={request.id}>
                                <TableCell className="whitespace-nowrap">{formatDate(request.createdAt)}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={isDrilling ? "bg-mdpc-blue text-white" : "bg-mdpc-brown-dark text-white"}>
                                    {isDrilling ? "Drilling" : "Logistics"}
                                  </Badge>
                                </TableCell>
                                <TableCell>{request.name}</TableCell>
                                <TableCell>{getServiceTypeName(request.serviceType)}</TableCell>
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
                                  <Select 
                                    value={request.status} 
                                    onValueChange={(value: RequestStatus) => {
                                      const collectionName = isDrilling ? "drillingRequests" : "logisticsRequests";
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
                            <TableCell>{request.name}</TableCell>
                            <TableCell>{getServiceTypeName(request.serviceType)}</TableCell>
                            <TableCell className="max-w-[150px] truncate">{request.location}</TableCell>
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
                            <TableCell>{request.name}</TableCell>
                            <TableCell>{getServiceTypeName(request.serviceType)}</TableCell>
                            <TableCell className="max-w-[150px]">
                              <div className="truncate"><span className="text-xs font-medium">From:</span> {request.pickupLocation}</div>
                              <div className="truncate"><span className="text-xs font-medium">To:</span> {request.deliveryLocation}</div>
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
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Contact Messages</CardTitle>
            <CardDescription>Messages from website contact form</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-8 text-center rounded-md">
              <p className="text-gray-500">No messages received yet</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
