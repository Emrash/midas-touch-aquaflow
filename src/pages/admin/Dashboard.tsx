
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "Admin Dashboard | Midas Touch";
    
    // Redirect if not admin
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

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
              <p className="text-3xl font-bold text-mdpc-gold">0</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Messages</CardTitle>
              <CardDescription>Unread contact messages</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-mdpc-gold">0</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Users</CardTitle>
              <CardDescription>Registered accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-mdpc-gold">0</p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Service Requests</CardTitle>
            <CardDescription>Manage drilling and logistics service requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Requests</TabsTrigger>
                <TabsTrigger value="drilling">Drilling</TabsTrigger>
                <TabsTrigger value="logistics">Logistics</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                <div className="bg-gray-100 p-8 text-center rounded-md">
                  <p className="text-gray-500">No service requests yet</p>
                </div>
              </TabsContent>
              
              <TabsContent value="drilling" className="space-y-4">
                <div className="bg-gray-100 p-8 text-center rounded-md">
                  <p className="text-gray-500">No drilling service requests yet</p>
                </div>
              </TabsContent>
              
              <TabsContent value="logistics" className="space-y-4">
                <div className="bg-gray-100 p-8 text-center rounded-md">
                  <p className="text-gray-500">No logistics service requests yet</p>
                </div>
              </TabsContent>
              
              <TabsContent value="pending" className="space-y-4">
                <div className="bg-gray-100 p-8 text-center rounded-md">
                  <p className="text-gray-500">No pending requests</p>
                </div>
              </TabsContent>
              
              <TabsContent value="completed" className="space-y-4">
                <div className="bg-gray-100 p-8 text-center rounded-md">
                  <p className="text-gray-500">No completed requests</p>
                </div>
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
