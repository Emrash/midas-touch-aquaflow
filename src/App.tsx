
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ConsultationProvider } from "./contexts/ConsultationContext";
import ConsultationModal from "./components/ui/ConsultationModal";
import { useConsultation } from "./contexts/ConsultationContext";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import { useEffect } from "react";

// Pages
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Logistics from "./pages/Logistics";
import Services from "./pages/Services";
import ServiceDetail from "./pages/services/ServiceDetail";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import DrillingHome from "./pages/drilling/DrillingHome";
import LogisticsHome from "./pages/logistics/LogisticsHome";

// Components
import WhatsAppButton from "./components/ui/WhatsAppButton";

const queryClient = new QueryClient();

// Admin auto-redirect component
const AdminRedirect = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if at auth page and user is admin
    // Explicitly check that we're not already on the admin route
    console.log("Admin redirect check: path =", location.pathname, "isAdmin =", isAdmin);
    if (isAdmin && location.pathname === "/auth" && !location.pathname.includes('/admin')) {
      console.log("Redirecting admin to dashboard");
      navigate("/admin");
    }
  }, [isAdmin, navigate, location.pathname]);

  return null;
};

// Modal container component
const ModalContainer = () => {
  const { isModalOpen, closeModal, serviceType, modalTitle, modalDescription } = useConsultation();
  
  return (
    <ConsultationModal 
      isOpen={isModalOpen} 
      onClose={closeModal} 
      serviceType={serviceType}
      title={modalTitle}
      description={modalDescription}
    />
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ConsultationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AdminRedirect />
            <WhatsAppButton phoneNumber="2348001234567" />
            <ModalContainer />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/logistics" element={<Logistics />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Navigate to="/auth" />} />
              <Route path="/register" element={<Navigate to="/auth" />} />
              
              {/* Services Routes */}
              <Route path="/services" element={<Services />} />
              <Route path="/services/:serviceId" element={<ServiceDetail />} />
              
              {/* Multi-domain Routes */}
              <Route path="/drilling" element={<DrillingHome />} />
              <Route path="/logistics-services" element={<LogisticsHome />} />
              
              {/* Protected Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* User Profile/Dashboard */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ConsultationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
