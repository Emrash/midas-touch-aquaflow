
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { Clock, Calendar, FileText, User, MessageSquare, Settings } from "lucide-react";

const UserDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
    
    document.title = "My Dashboard | Midas Touch";
  }, [user, navigate]);

  if (!user) return null;

  const recentRequests = [
    {
      id: "REQ-2025-001",
      date: "May 15, 2025",
      type: "Borehole Installation",
      status: "In Progress"
    },
    {
      id: "REQ-2025-002", 
      date: "May 10, 2025",
      type: "Water Treatment System",
      status: "Quoted"
    },
    {
      id: "REQ-2025-003",
      date: "May 5, 2025",
      type: "Logistics Request",
      status: "Completed"
    }
  ];

  const upcomingAppointments = [
    {
      id: "APT-2025-001",
      date: "May 20, 2025",
      time: "10:00 AM",
      type: "Site Inspection"
    },
    {
      id: "APT-2025-002",
      date: "May 25, 2025",
      time: "2:00 PM",
      type: "Project Discussion"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-12">
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
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="#profile">
                        <User className="mr-2 h-4 w-4" />
                        My Profile
                      </a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="#requests">
                        <FileText className="mr-2 h-4 w-4" />
                        My Requests
                      </a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="#appointments">
                        <Calendar className="mr-2 h-4 w-4" />
                        Appointments
                      </a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="#messages">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Messages
                      </a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
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
                    className="w-full" 
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent requests and interactions with Midas Touch</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="requests" className="w-full">
                    <TabsList className="grid grid-cols-2 w-full">
                      <TabsTrigger value="requests">Requests</TabsTrigger>
                      <TabsTrigger value="appointments">Appointments</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="requests" className="pt-4">
                      {recentRequests.length > 0 ? (
                        <div className="space-y-4">
                          {recentRequests.map((request) => (
                            <div key={request.id} className="border rounded-lg p-4 flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{request.type}</h4>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>{request.date}</span>
                                </div>
                              </div>
                              <div>
                                <span className={`inline-block px-3 py-1 text-xs rounded-full ${
                                  request.status === "Completed" 
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                                    : request.status === "In Progress"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                }`}>
                                  {request.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center py-8 text-muted-foreground">No recent requests found.</p>
                      )}
                      <div className="mt-4">
                        <Button variant="outline" size="sm" className="w-full">View All Requests</Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="appointments" className="pt-4">
                      {upcomingAppointments.length > 0 ? (
                        <div className="space-y-4">
                          {upcomingAppointments.map((appointment) => (
                            <div key={appointment.id} className="border rounded-lg p-4">
                              <h4 className="font-medium">{appointment.type}</h4>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{appointment.date} at {appointment.time}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center py-8 text-muted-foreground">No upcoming appointments found.</p>
                      )}
                      <div className="mt-4">
                        <Button variant="outline" size="sm" className="w-full">View All Appointments</Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="bg-mdpc-blue hover:bg-mdpc-blue-dark h-auto py-6 flex flex-col">
                      <FileText className="h-6 w-6 mb-2" />
                      <span>New Request</span>
                    </Button>
                    <Button className="bg-mdpc-gold hover:bg-mdpc-gold-dark h-auto py-6 flex flex-col">
                      <Calendar className="h-6 w-6 mb-2" />
                      <span>Book Appointment</span>
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
